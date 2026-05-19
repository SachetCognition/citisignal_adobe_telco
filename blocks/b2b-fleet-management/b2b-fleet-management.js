import { simFleet, companies } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, formatNumber, labels } from '../../scripts/german-locale.js';

export default async function decorate(block) {
  const company = companies[0];
  const activeSims = simFleet.filter((s) => s.status === 'Aktiv');
  const gesperrtSims = simFleet.filter((s) => s.status === 'Gesperrt');
  const gekuendigtSims = simFleet.filter((s) => s.status === 'Gekündigt');
  const totalDataUsed = simFleet.reduce((s, sim) => s + (sim.dataUsedGB || 0), 0);

  function renderSimTable(sims) {
    return sims.map((sim) => `
      <tr data-status="${sim.status}">
        <td>${sim.msisdn}</td>
        <td>${sim.iccid}</td>
        <td><span class="status-badge status-${sim.status.toLowerCase()}">${sim.status}</span></td>
        <td>${sim.employee}</td>
        <td>${sim.plan}</td>
        <td>${sim.costCenter}</td>
        <td>${formatNumber(sim.dataUsedGB, 1)} GB</td>
        <td>${sim.contractEnd}</td>
      </tr>
    `).join('');
  }

  block.innerHTML = `
    <div class="b2b-fleet">
      <h2>${labels.fleet.title}</h2>
      <div class="fleet-kpis">
        <div class="kpi-card"><span class="kpi-value">${activeSims.length}</span><span class="kpi-label">${labels.fleet.activeSims}</span></div>
        <div class="kpi-card kpi-warn"><span class="kpi-value">${gesperrtSims.length}</span><span class="kpi-label">${labels.status.gesperrt}</span></div>
        <div class="kpi-card kpi-danger"><span class="kpi-value">${gekuendigtSims.length}</span><span class="kpi-label">${labels.status.gekuendigt}</span></div>
        <div class="kpi-card"><span class="kpi-value">${simFleet.length}</span><span class="kpi-label">${labels.fleet.totalSims}</span></div>
        <div class="kpi-card"><span class="kpi-value">${formatNumber(totalDataUsed, 1)} GB</span><span class="kpi-label">Gesamter Datenverbrauch</span></div>
      </div>
      <div class="fleet-controls">
        <div class="search-box">
          <input type="text" id="simSearch" placeholder="Rufnummer, Mitarbeiter oder Tarif suchen...">
        </div>
        <div class="filter-group">
          <button class="filter-btn active" data-filter="all">Alle (${simFleet.length})</button>
          <button class="filter-btn" data-filter="Aktiv">Aktiv (${activeSims.length})</button>
          <button class="filter-btn" data-filter="Gesperrt">Gesperrt (${gesperrtSims.length})</button>
          <button class="filter-btn" data-filter="Gekündigt">Gekündigt (${gekuendigtSims.length})</button>
        </div>
        <button class="btn-secondary" id="btnExportFleet">${labels.portal.exportCsv}</button>
      </div>
      <div class="fleet-table-wrap">
        <table class="b2b-table" id="fleetTable">
          <thead>
            <tr>
              <th>${labels.fleet.simNumber}</th><th>ICCID</th><th>Status</th>
              <th>${labels.fleet.employee}</th><th>${labels.fleet.plan}</th>
              <th>Kostenstelle</th><th>${labels.fleet.dataUsed}</th><th>${labels.fleet.contractEnd}</th>
            </tr>
          </thead>
          <tbody id="fleetBody">${renderSimTable(simFleet)}</tbody>
        </table>
      </div>
      <div class="fleet-usage-section">
        <h3>Datenverbrauch nach Kostenstelle</h3>
        <div class="usage-bars" id="usageBars"></div>
      </div>
      <div id="fleetMessages"></div>
    </div>`;

  // Usage by cost center
  const usageByCostCenter = {};
  simFleet.forEach((sim) => {
    if (!usageByCostCenter[sim.costCenter]) usageByCostCenter[sim.costCenter] = 0;
    usageByCostCenter[sim.costCenter] += sim.dataUsedGB;
  });
  const maxUsage = Math.max(...Object.values(usageByCostCenter));
  block.querySelector('#usageBars').innerHTML = Object.entries(usageByCostCenter).map(([cc, usage]) => `
    <div class="usage-row">
      <span class="usage-label">${cc}</span>
      <div class="usage-bar-bg"><div class="usage-bar-fill" style="width:${(usage / maxUsage) * 100}%"></div></div>
      <span class="usage-value">${formatNumber(usage, 1)} GB</span>
    </div>
  `).join('');

  // Search
  block.querySelector('#simSearch').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    block.querySelectorAll('#fleetBody tr').forEach((row) => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });

  // Filter
  block.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelectorAll('.filter-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      block.querySelectorAll('#fleetBody tr').forEach((row) => {
        row.style.display = (btn.dataset.filter === 'all' || row.dataset.status === btn.dataset.filter) ? '' : 'none';
      });
    });
  });

  // Export
  block.querySelector('#btnExportFleet').addEventListener('click', () => {
    const headers = ['Rufnummer', 'ICCID', 'Status', 'Mitarbeiter', 'Tarif', 'Kostenstelle', 'Datenverbrauch (GB)', 'Vertragsende'];
    const csvRows = [headers.join(';')];
    simFleet.forEach((sim) => {
      csvRows.push([sim.msisdn, sim.iccid, sim.status, sim.employee, sim.plan, sim.costCenter, sim.dataUsedGB, sim.contractEnd].join(';'));
    });
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flottenmanagement_export.csv';
    a.click();
    URL.revokeObjectURL(url);
    block.querySelector('#fleetMessages').innerHTML = '<div class="msg-success">CSV-Export heruntergeladen.</div>';
    setTimeout(() => { block.querySelector('#fleetMessages').innerHTML = ''; }, 3000);
  });
}
