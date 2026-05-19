import { purchaseOrders, products, companies } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, escapeHTML, labels } from '../../scripts/german-locale.js';
import { getApprovalLevel } from '../../scripts/validators.js';

function getStatusClass(status) {
  const map = { Genehmigt: 'approved', 'Genehmigung ausstehend': 'pending', Abgelehnt: 'rejected' };
  return map[status] || 'default';
}

function renderPODetail(po) {
  const approval = getApprovalLevel(po.total);
  return `
    <div class="po-detail">
      <div class="po-detail-header">
        <h3>${labels.purchaseOrder.poNumber}: ${po.poNumber}</h3>
        <span class="status-badge status-${getStatusClass(po.status)}">${po.status}</span>
      </div>
      <div class="po-meta">
        <p><strong>Erstellt:</strong> ${po.createdAt} von ${po.buyer}</p>
        <p><strong>Kostenstelle:</strong> ${po.costCenter}</p>
        <p><strong>Genehmigungsstufe:</strong> ${approval.label}</p>
      </div>
      <table class="b2b-table">
        <thead><tr><th>Produkt</th><th>SKU</th><th>Menge</th><th>Stückpreis</th><th>Gesamt</th></tr></thead>
        <tbody>
          ${po.items.map((item) => `<tr><td>${item.name}</td><td>${item.sku}</td><td>${item.qty}</td><td>${formatCurrency(item.unitPrice)}</td><td>${formatCurrency(item.lineTotal)}</td></tr>`).join('')}
        </tbody>
      </table>
      <p class="po-total">Gesamt: <strong>${formatCurrency(po.total)}</strong></p>
      <div class="approval-history">
        <h4>Genehmigungsverlauf</h4>
        ${po.approvalHistory.map((h) => `<div class="history-entry"><span class="history-date">${h.date}</span> ${h.action}</div>`).join('')}
      </div>
      ${po.status === 'Genehmigung ausstehend' ? `
        <div class="approval-actions">
          <h4>Genehmigung (${po.requiredApprover || 'Automatisch'})</h4>
          <div class="form-group"><label>Kommentar</label><textarea id="approvalComment" rows="2" placeholder="Optional: Begründung..."></textarea></div>
          <div class="btn-group">
            <button class="btn-primary btn-approve" data-id="${po.id}">${labels.purchaseOrder.approve}</button>
            <button class="btn-danger btn-reject" data-id="${po.id}">${labels.purchaseOrder.reject}</button>
          </div>
        </div>
      ` : ''}
    </div>`;
}

export default async function decorate(block) {
  const company = companies[0];

  block.innerHTML = `
    <div class="b2b-purchase-orders">
      <div class="po-header">
        <h2>${labels.purchaseOrder.title}</h2>
        <button class="btn-primary" id="btnNewPO">${labels.purchaseOrder.create}</button>
      </div>
      <div class="po-filters">
        <button class="filter-btn active" data-filter="all">Alle</button>
        <button class="filter-btn" data-filter="Genehmigung ausstehend">${labels.purchaseOrder.pendingApproval}</button>
        <button class="filter-btn" data-filter="Genehmigt">${labels.purchaseOrder.approved}</button>
        <button class="filter-btn" data-filter="Abgelehnt">${labels.purchaseOrder.rejected}</button>
      </div>
      <table class="b2b-table" id="poTable">
        <thead><tr><th>PO-Nr.</th><th>Status</th><th>Erstellt</th><th>Erstellt von</th><th>Summe</th><th>Genehmiger</th><th>Aktion</th></tr></thead>
        <tbody>
          ${purchaseOrders.map((po) => `
            <tr class="po-row" data-status="${po.status}">
              <td>${po.poNumber}</td>
              <td><span class="status-badge status-${getStatusClass(po.status)}">${po.status}</span></td>
              <td>${po.createdAt}</td><td>${po.buyer}</td>
              <td>${formatCurrency(po.total)}</td>
              <td>${po.requiredApprover || 'Automatisch'}</td>
              <td><button class="btn-sm btn-view-po" data-id="${po.id}">Details</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div id="poDetailPanel" class="hidden"></div>
      <div id="newPOForm" class="hidden">
        <h3>${labels.purchaseOrder.create}</h3>
        <form id="createPOForm">
          <div class="form-row">
            <div class="form-group">
              <label>${labels.purchaseOrder.poNumber}</label>
              <input type="text" id="poNumInput" placeholder="PO-2026-005">
            </div>
            <div class="form-group">
              <label>${labels.checkout.costCenter}</label>
              <select id="poCostCenter">
                ${company.costCenters.map((cc) => `<option value="${cc.code}">${cc.name} (${cc.code})</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Produkt</label>
              <select id="poProduct">
                ${products.map((p) => `<option value="${p.sku}" data-name="${p.name}" data-price="${p.priceTiers[0].price}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="form-group">
              <label>Menge</label>
              <input type="number" id="poQty" value="1" min="1">
            </div>
          </div>
          <div id="approvalPreview" class="approval-preview"></div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">${labels.purchaseOrder.create}</button>
            <button type="button" class="btn-secondary" id="cancelNewPO">${labels.actions.cancel}</button>
          </div>
        </form>
      </div>
      <div id="poMessages"></div>
    </div>`;

  // Filters
  block.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      block.querySelectorAll('.po-row').forEach((row) => {
        row.style.display = btn.dataset.filter === 'all' || row.dataset.status === btn.dataset.filter ? '' : 'none';
      });
    });
  });

  // View PO detail
  block.querySelectorAll('.btn-view-po').forEach((btn) => {
    btn.addEventListener('click', () => {
      const po = purchaseOrders.find((p) => p.id === btn.dataset.id);
      const panel = block.querySelector('#poDetailPanel');
      panel.innerHTML = renderPODetail(po);
      panel.classList.remove('hidden');
      // Attach approve/reject
      panel.querySelector('.btn-approve')?.addEventListener('click', () => {
        const comment = panel.querySelector('#approvalComment')?.value || '';
        block.querySelector('#poMessages').innerHTML = `<div class="msg-success">Bestellanforderung ${escapeHTML(po.poNumber)} genehmigt.${comment ? ` Kommentar: ${escapeHTML(comment)}` : ''}</div>`;
      });
      panel.querySelector('.btn-reject')?.addEventListener('click', () => {
        const comment = panel.querySelector('#approvalComment')?.value || '';
        block.querySelector('#poMessages').innerHTML = `<div class="msg-error">Bestellanforderung ${escapeHTML(po.poNumber)} abgelehnt.${comment ? ` Kommentar: ${escapeHTML(comment)}` : ''}</div>`;
      });
    });
  });

  // New PO toggle
  block.querySelector('#btnNewPO').addEventListener('click', () => block.querySelector('#newPOForm').classList.toggle('hidden'));
  block.querySelector('#cancelNewPO').addEventListener('click', () => block.querySelector('#newPOForm').classList.add('hidden'));

  // Approval preview
  const updateApprovalPreview = () => {
    const sel = block.querySelector('#poProduct');
    const opt = sel.options[sel.selectedIndex];
    const price = Number(opt.dataset.price);
    const qty = Number(block.querySelector('#poQty').value);
    const total = price * qty;
    const approval = getApprovalLevel(total);
    block.querySelector('#approvalPreview').innerHTML = `<p>Geschätzter Betrag: <strong>${formatCurrency(total)}</strong> → <em>${approval.label}</em></p>`;
  };
  block.querySelector('#poProduct').addEventListener('change', updateApprovalPreview);
  block.querySelector('#poQty').addEventListener('input', updateApprovalPreview);
  updateApprovalPreview();

  // Create PO
  block.querySelector('#createPOForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const poNum = block.querySelector('#poNumInput').value || `PO-${Date.now()}`;
    const sel = block.querySelector('#poProduct');
    const opt = sel.options[sel.selectedIndex];
    const total = Number(opt.dataset.price) * Number(block.querySelector('#poQty').value);
    const approval = getApprovalLevel(total);
    block.querySelector('#poMessages').innerHTML = `<div class="msg-success">Bestellanforderung ${poNum} erstellt (${formatCurrency(total)}). ${approval.label}.</div>`;
    block.querySelector('#newPOForm').classList.add('hidden');
  });
}
