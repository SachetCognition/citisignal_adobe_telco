import { dashboardKPIs, orders, users, supportTickets, documents, companies } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, formatNumber, labels } from '../../scripts/german-locale.js';

function renderKPICards() {
  return `
    <div class="portal-kpis">
      <div class="kpi-card"><span class="kpi-value">${dashboardKPIs.activeLines}</span><span class="kpi-label">Aktive Leitungen</span></div>
      <div class="kpi-card"><span class="kpi-value">${dashboardKPIs.totalLines}</span><span class="kpi-label">Gesamt Leitungen</span></div>
      <div class="kpi-card"><span class="kpi-value">${formatCurrency(dashboardKPIs.monthlySpend)}</span><span class="kpi-label">Monatliche Ausgaben</span></div>
      <div class="kpi-card"><span class="kpi-value">${dashboardKPIs.contractsActive}</span><span class="kpi-label">Aktive Verträge</span></div>
      <div class="kpi-card kpi-warn"><span class="kpi-value">${dashboardKPIs.contractsExpiring}</span><span class="kpi-label">Auslaufende Verträge</span></div>
      <div class="kpi-card kpi-action"><span class="kpi-value">${dashboardKPIs.pendingApprovals}</span><span class="kpi-label">Offene Genehmigungen</span></div>
    </div>
    <div class="spend-trend">
      <h4>Ausgabenentwicklung (letzte 6 Monate)</h4>
      <div class="trend-chart">
        ${dashboardKPIs.monthlySpendTrend.map((v, i) => {
    const max = Math.max(...dashboardKPIs.monthlySpendTrend);
    const h = (v / max) * 120;
    return `<div class="trend-bar"><div class="trend-fill" style="height:${h}px"></div><span class="trend-label">${formatCurrency(v)}</span></div>`;
  }).join('')}
      </div>
    </div>`;
}

function renderOrderHistory() {
  return `
    <div class="order-controls">
      <input type="text" id="orderSearch" placeholder="Bestellnummer suchen...">
      <div class="export-btns">
        <button class="btn-secondary" id="btnExportOrdersPdf">${labels.portal.exportPdf}</button>
        <button class="btn-secondary" id="btnExportOrdersCsv">${labels.portal.exportCsv}</button>
      </div>
    </div>
    <table class="b2b-table" id="ordersTable">
      <thead><tr><th>Bestell-Nr.</th><th>Datum</th><th>Status</th><th>Summe</th><th>Zahlungsart</th><th>Kostenstelle</th></tr></thead>
      <tbody>
        ${orders.map((o) => `
          <tr>
            <td>${o.number}</td><td>${o.createdAt}</td>
            <td><span class="status-badge status-${o.status === 'Abgeschlossen' ? 'done' : 'progress'}">${o.status}</span></td>
            <td>${formatCurrency(o.total)}</td><td>${o.paymentMethod}</td><td>${o.costCenter}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

function renderTickets() {
  return `
    <button class="btn-primary" id="btnNewTicket">${labels.portal.newTicket}</button>
    <table class="b2b-table">
      <thead><tr><th>Ticket-Nr.</th><th>Kategorie</th><th>Betreff</th><th>Status</th><th>Erstellt</th></tr></thead>
      <tbody>
        ${supportTickets.map((t) => `
          <tr>
            <td>${t.id}</td><td>${t.category}</td><td>${t.subject}</td>
            <td><span class="status-badge status-${t.status === 'Offen' ? 'open' : (t.status === 'In Bearbeitung' ? 'progress' : 'closed')}">${t.status}</span></td>
            <td>${t.createdAt}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
    <div id="newTicketForm" class="hidden">
      <h4>${labels.portal.newTicket}</h4>
      <form id="ticketForm">
        <div class="form-group"><label>Kategorie</label><select id="ticketCat"><option>Technisch</option><option>Rechnungsanfrage</option><option>Vertrag</option><option>Sonstiges</option></select></div>
        <div class="form-group"><label>Betreff</label><input type="text" id="ticketSubject" required></div>
        <div class="form-group"><label>Beschreibung</label><textarea id="ticketDesc" rows="4" required></textarea></div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">${labels.actions.submit}</button>
          <button type="button" class="btn-secondary" id="cancelTicket">${labels.actions.cancel}</button>
        </div>
      </form>
    </div>`;
}

function renderDocCenter() {
  const docTypes = [...new Set(documents.map((d) => d.type))];
  return `
    <div class="doc-filters">
      <button class="filter-btn active" data-type="all">Alle</button>
      ${docTypes.map((t) => `<button class="filter-btn" data-type="${t}">${t}</button>`).join('')}
    </div>
    <table class="b2b-table" id="docTable">
      <thead><tr><th>Dokument</th><th>Typ</th><th>Datum</th><th>Größe</th><th>Aktion</th></tr></thead>
      <tbody>
        ${documents.map((d) => `
          <tr data-type="${d.type}">
            <td>${d.name}</td><td>${d.type}</td><td>${d.date}</td><td>${d.size}</td>
            <td><button class="btn-sm btn-download" data-id="${d.id}">Herunterladen</button></td>
          </tr>
        `).join('')}
      </tbody>
    </table>`;
}

export default async function decorate(block) {
  const company = companies[0];

  block.innerHTML = `
    <div class="b2b-portal">
      <div class="portal-header">
        <h2>Kundenportal – ${company.name}</h2>
      </div>
      <nav class="portal-nav">
        <button class="portal-tab active" data-tab="dashboard">${labels.portal.dashboard}</button>
        <button class="portal-tab" data-tab="orders">${labels.portal.orderHistory}</button>
        <button class="portal-tab" data-tab="users">${labels.portal.userManagement}</button>
        <button class="portal-tab" data-tab="tickets">${labels.portal.supportTickets}</button>
        <button class="portal-tab" data-tab="docs">${labels.portal.documentCenter}</button>
      </nav>
      <div class="portal-content">
        <div class="portal-panel" id="panel-dashboard">${renderKPICards()}</div>
        <div class="portal-panel hidden" id="panel-orders">${renderOrderHistory()}</div>
        <div class="portal-panel hidden" id="panel-users">
          <button class="btn-primary" id="btnAddEmployee">${labels.portal.newUser}</button>
          <table class="b2b-table">
            <thead><tr><th>${labels.user.vorname}</th><th>${labels.user.nachname}</th><th>${labels.user.email}</th><th>${labels.user.rolle}</th><th>Abteilung</th><th>Aktionen</th></tr></thead>
            <tbody>
              ${users.filter((u) => u.companyId === company.id).map((u) => `<tr><td>${u.vorname}</td><td>${u.nachname}</td><td>${u.email}</td><td>${labels.roles[u.role]}</td><td>${u.orgUnit}</td><td><button class="btn-sm">${labels.actions.edit}</button> <button class="btn-sm btn-danger-sm">${labels.actions.delete}</button></td></tr>`).join('')}
            </tbody>
          </table>
        </div>
        <div class="portal-panel hidden" id="panel-tickets">${renderTickets()}</div>
        <div class="portal-panel hidden" id="panel-docs">${renderDocCenter()}</div>
      </div>
      <div id="portalMessages"></div>
    </div>`;

  // Tab switching
  block.querySelectorAll('.portal-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      block.querySelectorAll('.portal-tab').forEach((t) => t.classList.remove('active'));
      block.querySelectorAll('.portal-panel').forEach((p) => p.classList.add('hidden'));
      tab.classList.add('active');
      block.querySelector(`#panel-${tab.dataset.tab}`).classList.remove('hidden');
    });
  });

  // Order search
  block.querySelector('#orderSearch')?.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    block.querySelectorAll('#ordersTable tbody tr').forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Export orders CSV
  block.querySelector('#btnExportOrdersCsv')?.addEventListener('click', () => {
    const csv = ['Bestell-Nr.;Datum;Status;Summe;Zahlungsart;Kostenstelle'];
    orders.forEach((o) => csv.push(`${o.number};${o.createdAt};${o.status};${o.total};${o.paymentMethod};${o.costCenter}`));
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'bestellverlauf.csv'; a.click();
    URL.revokeObjectURL(url);
  });

  // Export orders PDF (simulated)
  block.querySelector('#btnExportOrdersPdf')?.addEventListener('click', () => {
    block.querySelector('#portalMessages').innerHTML = '<div class="msg-success">PDF-Export wird vorbereitet und heruntergeladen...</div>';
    setTimeout(() => { block.querySelector('#portalMessages').innerHTML = ''; }, 3000);
  });

  // Ticket form
  block.querySelector('#btnNewTicket')?.addEventListener('click', () => block.querySelector('#newTicketForm').classList.toggle('hidden'));
  block.querySelector('#cancelTicket')?.addEventListener('click', () => block.querySelector('#newTicketForm').classList.add('hidden'));
  block.querySelector('#ticketForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = `TK-${Date.now()}`;
    block.querySelector('#portalMessages').innerHTML = `<div class="msg-success">Ticket ${id} erfolgreich erstellt.</div>`;
    block.querySelector('#newTicketForm').classList.add('hidden');
  });

  // Document filters
  block.querySelectorAll('.doc-filters .filter-btn')?.forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelectorAll('.doc-filters .filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      block.querySelectorAll('#docTable tbody tr').forEach((row) => {
        row.style.display = (btn.dataset.type === 'all' || row.dataset.type === btn.dataset.type) ? '' : 'none';
      });
    });
  });

  // Download
  block.querySelectorAll('.btn-download').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelector('#portalMessages').innerHTML = `<div class="msg-success">Dokument wird heruntergeladen...</div>`;
      setTimeout(() => { block.querySelector('#portalMessages').innerHTML = ''; }, 2000);
    });
  });
}
