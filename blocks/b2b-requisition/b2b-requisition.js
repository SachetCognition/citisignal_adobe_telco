import { requisitionLists, products, orders } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, labels } from '../../scripts/german-locale.js';

export default async function decorate(block) {
  const listsData = [...requisitionLists];

  function renderLists() {
    return listsData.map((list) => {
      const total = list.items.reduce((s, i) => s + i.qty * i.unitPrice, 0);
      return `
      <div class="requisition-card" data-id="${list.id}">
        <div class="req-card-header">
          <h3>${list.name}</h3>
          <span class="req-meta">Erstellt: ${list.createdAt} von ${list.createdBy}</span>
        </div>
        <table class="b2b-table">
          <thead><tr><th>Produkt</th><th>SKU</th><th>Menge</th><th>Stückpreis</th><th>Gesamt</th></tr></thead>
          <tbody>
            ${list.items.map((item) => `<tr><td>${item.name}</td><td>${item.sku}</td><td>${item.qty}</td><td>${formatCurrency(item.unitPrice)}</td><td>${formatCurrency(item.qty * item.unitPrice)}</td></tr>`).join('')}
          </tbody>
        </table>
        <div class="req-card-footer">
          <span class="req-total">Gesamt: <strong>${formatCurrency(total)}</strong></span>
          <div class="req-actions">
            <button class="btn-primary btn-list-to-cart" data-id="${list.id}">${labels.requisition.addAllToCart}</button>
            <button class="btn-danger btn-delete-list" data-id="${list.id}">${labels.actions.delete}</button>
          </div>
        </div>
      </div>`;
    }).join('');
  }

  block.innerHTML = `
    <div class="b2b-requisition">
      <div class="req-header">
        <h2>${labels.requisition.title}</h2>
        <button class="btn-primary" id="btnCreateList">${labels.requisition.createList}</button>
      </div>
      <div id="createListForm" class="hidden">
        <form id="newListForm">
          <div class="form-group">
            <label>${labels.requisition.listName}</label>
            <input type="text" id="newListName" required placeholder="z.B. Abteilung Marketing Geräte">
          </div>
          <div class="form-group">
            <label>Produkt hinzufügen</label>
            <select id="newListProduct">
              ${products.map((p) => `<option value="${p.sku}" data-name="${p.name}" data-price="${p.priceTiers[0].price}">${p.name} (${formatCurrency(p.priceTiers[0].price)})</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Menge</label><input type="number" id="newListQty" value="1" min="1"></div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">${labels.actions.save}</button>
            <button type="button" class="btn-secondary" id="cancelCreateList">${labels.actions.cancel}</button>
          </div>
        </form>
      </div>
      <div id="reorderSection">
        <h3>Aus Bestellverlauf erneut bestellen</h3>
        <table class="b2b-table">
          <thead><tr><th>Bestell-Nr.</th><th>Datum</th><th>Summe</th><th>Aktion</th></tr></thead>
          <tbody>
            ${orders.map((o) => `<tr><td>${o.number}</td><td>${o.createdAt}</td><td>${formatCurrency(o.total)}</td><td><button class="btn-sm btn-reorder" data-id="${o.id}">${labels.actions.reorder}</button></td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div id="listsContainer">${renderLists()}</div>
      <div id="reqMessages"></div>
    </div>`;

  block.querySelector('#btnCreateList').addEventListener('click', () => {
    block.querySelector('#createListForm').classList.toggle('hidden');
  });
  block.querySelector('#cancelCreateList').addEventListener('click', () => {
    block.querySelector('#createListForm').classList.add('hidden');
  });

  block.querySelector('#newListForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = block.querySelector('#newListName').value;
    const sel = block.querySelector('#newListProduct');
    const opt = sel.options[sel.selectedIndex];
    const qty = Number(block.querySelector('#newListQty').value);
    listsData.push({
      id: `rl-${Date.now()}`, name, createdBy: 'Aktueller Benutzer', createdAt: new Date().toLocaleDateString('de-DE'),
      items: [{ sku: sel.value, name: opt.dataset.name, qty, unitPrice: Number(opt.dataset.price) }],
    });
    block.querySelector('#listsContainer').innerHTML = renderLists();
    block.querySelector('#createListForm').classList.add('hidden');
    e.target.reset();
    attachCardListeners();
  });

  function attachCardListeners() {
    block.querySelectorAll('.btn-list-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => {
        const msgs = block.querySelector('#reqMessages');
        msgs.innerHTML = `<div class="msg-success">Alle Artikel der Liste wurden zum Warenkorb hinzugefügt.</div>`;
        setTimeout(() => { msgs.innerHTML = ''; }, 3000);
      });
    });
    block.querySelectorAll('.btn-delete-list').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = listsData.findIndex((l) => l.id === btn.dataset.id);
        if (idx > -1) listsData.splice(idx, 1);
        block.querySelector('#listsContainer').innerHTML = renderLists();
        attachCardListeners();
      });
    });
  }
  attachCardListeners();

  block.querySelectorAll('.btn-reorder').forEach((btn) => {
    btn.addEventListener('click', () => {
      const msgs = block.querySelector('#reqMessages');
      msgs.innerHTML = '<div class="msg-success">Artikel aus der vorherigen Bestellung wurden in den Warenkorb gelegt.</div>';
      setTimeout(() => { msgs.innerHTML = ''; }, 3000);
    });
  });
}
