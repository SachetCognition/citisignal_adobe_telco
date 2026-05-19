import { quotes, products } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, formatDate, labels } from '../../scripts/german-locale.js';

function getStatusClass(status) {
  const map = { Ausstehend: 'pending', Verhandlung: 'negotiation', Angenommen: 'accepted', Abgelaufen: 'expired' };
  return map[status] || 'default';
}

function renderQuoteDetail(quote) {
  return `
    <div class="quote-detail">
      <div class="quote-header">
        <h3>${labels.quote.quoteNumber}: ${quote.id}</h3>
        <span class="status-badge status-${getStatusClass(quote.status)}">${quote.status}</span>
      </div>
      <div class="quote-meta">
        <p><strong>Erstellt:</strong> ${quote.createdAt}</p>
        <p><strong>${labels.quote.expiresAt}:</strong> ${quote.expiresAt}</p>
        <p><strong>Erstellt von:</strong> ${quote.buyer}</p>
      </div>
      <table class="b2b-table">
        <thead><tr><th>Produkt</th><th>Menge</th><th>Stückpreis</th><th>Rabatt</th><th>Gesamt</th></tr></thead>
        <tbody>
          ${quote.items.map((item) => {
    const lineTotal = item.qty * item.unitPrice * (1 - (item.discount || 0) / 100);
    return `<tr><td>${item.name}</td><td>${item.qty}</td><td>${formatCurrency(item.unitPrice)}</td><td>${item.discount || 0}%</td><td>${formatCurrency(lineTotal)}</td></tr>`;
  }).join('')}
        </tbody>
      </table>
      <p class="quote-total"><strong>Gesamt: ${formatCurrency(quote.total)}</strong></p>
      <div class="quote-notes"><strong>Notizen:</strong> ${quote.notes}</div>
      <div class="quote-history">
        <h4>Verlauf</h4>
        ${quote.history.map((h) => `<div class="history-entry"><span class="history-date">${h.date}</span> <strong>${h.actor}:</strong> ${h.action}</div>`).join('')}
      </div>
      <div class="quote-actions">
        ${quote.status === 'Ausstehend' || quote.status === 'Verhandlung' ? `
          <button class="btn-primary btn-accept-quote" data-id="${quote.id}">${labels.quote.accept}</button>
          <button class="btn-secondary btn-counter" data-id="${quote.id}">${labels.quote.counterOffer}</button>
          <button class="btn-danger btn-reject-quote" data-id="${quote.id}">${labels.quote.reject}</button>
        ` : ''}
        ${quote.status === 'Angenommen' ? `<button class="btn-primary btn-convert" data-id="${quote.id}">${labels.quote.convertToOrder}</button>` : ''}
        <button class="btn-secondary btn-download-pdf" data-id="${quote.id}">${labels.quote.downloadPdf}</button>
      </div>
    </div>`;
}

export default async function decorate(block) {
  block.innerHTML = `
    <div class="b2b-quotes">
      <div class="quotes-header">
        <h2>${labels.quote.title}</h2>
        <button class="btn-primary" id="btnNewQuote">${labels.quote.requestQuote}</button>
      </div>
      <div class="quotes-list">
        <table class="b2b-table">
          <thead><tr><th>${labels.quote.quoteNumber}</th><th>${labels.quote.status}</th><th>Erstellt</th><th>${labels.quote.expiresAt}</th><th>Summe</th><th>Aktion</th></tr></thead>
          <tbody>
            ${quotes.map((q) => `
              <tr class="quote-row" data-id="${q.id}">
                <td>${q.id}</td>
                <td><span class="status-badge status-${getStatusClass(q.status)}">${q.status}</span></td>
                <td>${q.createdAt}</td><td>${q.expiresAt}</td>
                <td>${formatCurrency(q.total)}</td>
                <td><button class="btn-sm btn-view-quote" data-id="${q.id}">Details</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      <div id="quoteDetailPanel" class="hidden"></div>
      <div id="newQuoteForm" class="hidden">
        <h3>${labels.quote.requestQuote}</h3>
        <form id="rfqForm">
          <div class="form-group">
            <label>Produkt</label>
            <select id="rfqProduct">
              ${products.map((p) => `<option value="${p.sku}">${p.name} (${formatCurrency(p.priceTiers[0].price)})</option>`).join('')}
            </select>
          </div>
          <div class="form-group"><label>Menge</label><input type="number" id="rfqQty" value="10" min="1"></div>
          <div class="form-group"><label>Bemerkungen</label><textarea id="rfqNotes" rows="3" placeholder="Besondere Anforderungen..."></textarea></div>
          <div class="form-actions">
            <button type="submit" class="btn-primary">${labels.actions.submit}</button>
            <button type="button" class="btn-secondary" id="cancelRfq">${labels.actions.cancel}</button>
          </div>
        </form>
      </div>
      <div id="quoteMessages"></div>
    </div>`;

  // View quote detail
  block.querySelectorAll('.btn-view-quote').forEach((btn) => {
    btn.addEventListener('click', () => {
      const quote = quotes.find((q) => q.id === btn.dataset.id);
      const panel = block.querySelector('#quoteDetailPanel');
      panel.innerHTML = renderQuoteDetail(quote);
      panel.classList.remove('hidden');
    });
  });

  // New RFQ toggle
  block.querySelector('#btnNewQuote').addEventListener('click', () => {
    block.querySelector('#newQuoteForm').classList.toggle('hidden');
  });
  block.querySelector('#cancelRfq').addEventListener('click', () => {
    block.querySelector('#newQuoteForm').classList.add('hidden');
  });

  // Submit RFQ
  block.querySelector('#rfqForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const sku = block.querySelector('#rfqProduct').value;
    const prod = products.find((p) => p.sku === sku);
    const qty = block.querySelector('#rfqQty').value;
    const msgs = block.querySelector('#quoteMessages');
    msgs.innerHTML = `<div class="msg-success">Angebotsanfrage Q-2026-005 für ${qty}× ${prod.name} erfolgreich übermittelt.</div>`;
    block.querySelector('#newQuoteForm').classList.add('hidden');
  });

  // Accept, reject, convert, download
  block.addEventListener('click', (e) => {
    const msgs = block.querySelector('#quoteMessages');
    if (e.target.classList.contains('btn-accept-quote')) {
      msgs.innerHTML = `<div class="msg-success">Angebot ${e.target.dataset.id} wurde angenommen.</div>`;
    }
    if (e.target.classList.contains('btn-reject-quote')) {
      msgs.innerHTML = `<div class="msg-error">Angebot ${e.target.dataset.id} wurde abgelehnt.</div>`;
    }
    if (e.target.classList.contains('btn-convert')) {
      msgs.innerHTML = `<div class="msg-success">Angebot ${e.target.dataset.id} wurde in Bestellung 100006 umgewandelt.</div>`;
    }
    if (e.target.classList.contains('btn-download-pdf')) {
      msgs.innerHTML = `<div class="msg-success">PDF für Angebot ${e.target.dataset.id} wird generiert...</div>`;
    }
  });
}
