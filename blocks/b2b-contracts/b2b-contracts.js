import { contracts } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, labels } from '../../scripts/german-locale.js';

function getStatusClass(status) {
  if (status === 'Aktiv') return 'aktiv';
  if (status === 'Läuft aus') return 'expiring';
  return 'default';
}

function getDaysUntil(dateStr) {
  const parts = dateStr.split('.');
  const d = new Date(parts[2], parts[1] - 1, parts[0]);
  const diff = d - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export default async function decorate(block) {
  block.innerHTML = `
    <div class="b2b-contracts">
      <h2>Vertragsmanagement</h2>
      <div class="contract-cards">
        ${contracts.map((ctr) => {
    const daysToEnd = getDaysUntil(ctr.kuendigungDeadline);
    const isUrgent = daysToEnd > 0 && daysToEnd < 180;
    return `
          <div class="contract-card ${isUrgent ? 'urgent' : ''}">
            <div class="ctr-header">
              <h3>${ctr.plan}</h3>
              <span class="status-badge status-${getStatusClass(ctr.status)}">${ctr.status}</span>
            </div>
            <div class="ctr-details">
              <div class="ctr-row"><span class="ctr-label">Vertrags-ID</span><span>${ctr.id}</span></div>
              <div class="ctr-row"><span class="ctr-label">Typ</span><span>${ctr.type}</span></div>
              <div class="ctr-row"><span class="ctr-label">Vertragslaufzeit</span><span>${ctr.laufzeit}</span></div>
              <div class="ctr-row"><span class="ctr-label">Beginn</span><span>${ctr.startDate}</span></div>
              <div class="ctr-row"><span class="ctr-label">Ende</span><span>${ctr.endDate}</span></div>
              <div class="ctr-row"><span class="ctr-label">Kündigungsfrist</span><span>${ctr.kuendigungsfrist}</span></div>
              <div class="ctr-row ${isUrgent ? 'ctr-urgent' : ''}"><span class="ctr-label">Kündigungsfrist bis</span><span>${ctr.kuendigungDeadline} ${isUrgent ? `(${daysToEnd} Tage)` : ''}</span></div>
              <div class="ctr-row"><span class="ctr-label">Monatliche Gebühr</span><span>${formatCurrency(ctr.monthlyFee)}</span></div>
              ${ctr.simCount ? `<div class="ctr-row"><span class="ctr-label">SIM-Karten</span><span>${ctr.simCount}</span></div>` : ''}
              <div class="ctr-row"><span class="ctr-label">Kostenstelle</span><span>${ctr.costCenter}</span></div>
            </div>
            <div class="ctr-actions">
              <button class="btn-primary btn-renew" data-id="${ctr.id}">Verlängern</button>
              <button class="btn-secondary btn-cancel" data-id="${ctr.id}">Kündigen</button>
              <button class="btn-secondary btn-details" data-id="${ctr.id}">Details</button>
            </div>
          </div>`;
  }).join('')}
      </div>
      <div class="contract-timeline">
        <h3>Vertragsübersicht (Timeline)</h3>
        <div class="timeline-chart">
          ${contracts.map((ctr) => {
    const startParts = ctr.startDate.split('.');
    const endParts = ctr.endDate.split('.');
    const start = new Date(startParts[2], startParts[1] - 1, startParts[0]);
    const end = new Date(endParts[2], endParts[1] - 1, endParts[0]);
    const now = new Date();
    const totalDays = (end - start) / (1000 * 60 * 60 * 24);
    const elapsedDays = Math.max(0, (now - start) / (1000 * 60 * 60 * 24));
    const progress = Math.min(100, (elapsedDays / totalDays) * 100);
    return `
            <div class="timeline-row">
              <span class="timeline-label">${ctr.plan}</span>
              <div class="timeline-bar">
                <div class="timeline-fill" style="width:${progress}%"></div>
                <span class="timeline-dates">${ctr.startDate} — ${ctr.endDate}</span>
              </div>
            </div>`;
  }).join('')}
        </div>
      </div>
      <div id="contractMessages"></div>
    </div>`;

  block.querySelectorAll('.btn-renew').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelector('#contractMessages').innerHTML = `<div class="msg-success">Vertragsverlängerung für ${btn.dataset.id} angefragt. Sie erhalten eine Bestätigung per E-Mail.</div>`;
    });
  });
  block.querySelectorAll('.btn-cancel').forEach((btn) => {
    btn.addEventListener('click', () => {
      const ctr = contracts.find((c) => c.id === btn.dataset.id);
      const days = getDaysUntil(ctr.kuendigungDeadline);
      if (days <= 0) {
        block.querySelector('#contractMessages').innerHTML = `<div class="msg-error">Kündigungsfrist für Vertrag ${ctr.id} bereits abgelaufen (${ctr.kuendigungDeadline}).</div>`;
      } else {
        block.querySelector('#contractMessages').innerHTML = `<div class="msg-success">Kündigung für Vertrag ${ctr.id} eingereicht. Kündigungsfrist: ${ctr.kuendigungDeadline}.</div>`;
      }
    });
  });
}
