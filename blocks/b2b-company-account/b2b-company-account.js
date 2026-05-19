import { companies, users, orgHierarchy } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, escapeHTML, labels } from '../../scripts/german-locale.js';
import { validateUstIdNr, validateHRB, validatePLZ, validateRequired, validateVIES } from '../../scripts/validators.js';

function renderOrgTree(node, depth = 0) {
  const indent = depth * 20;
  const userNames = node.users
    .map((uid) => users.find((u) => u.id === uid))
    .filter(Boolean)
    .map((u) => `<span class="org-user" data-role="${u.role}">${u.vorname} ${u.nachname} <em>(${labels.roles[u.role]})</em></span>`)
    .join(', ');
  const children = node.children.map((c) => renderOrgTree(c, depth + 1)).join('');
  return `<div class="org-node" style="margin-left:${indent}px">
    <div class="org-unit-name">${node.name}</div>
    <div class="org-unit-users">${userNames || '—'}</div>
    ${children}
  </div>`;
}

function renderAddresses(company) {
  return company.addresses.map((addr) => `
    <div class="address-card" data-id="${addr.id}">
      <h4>${addr.label} ${addr.isDefault ? '<span class="badge-default">Standard</span>' : ''}</h4>
      <p>${addr.strasse}<br>${addr.plz} ${addr.ort}<br>${addr.bundesland}, Deutschland</p>
      <p class="address-type">${addr.type === 'both' ? 'Liefer- & Rechnungsadresse' : (addr.type === 'shipping' ? 'Lieferadresse' : 'Rechnungsadresse')}</p>
      <button class="btn-secondary btn-edit-addr">${labels.actions.edit}</button>
    </div>
  `).join('');
}

function renderRegistrationForm() {
  return `
    <div class="b2b-registration-form">
      <h2>${labels.company.registration}</h2>
      <form id="companyRegForm">
        <div class="form-group">
          <label for="reg-name">${labels.company.companyName} *</label>
          <input type="text" id="reg-name" required>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-hrb">${labels.company.hrb} *</label>
            <input type="text" id="reg-hrb" placeholder="HRB 12345" required>
          </div>
          <div class="form-group">
            <label for="reg-ust">${labels.company.ustIdNr} *</label>
            <input type="text" id="reg-ust" placeholder="DE123456789" required>
            <span class="vies-status" id="viesStatus"></span>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-strasse">${labels.address.strasse} *</label>
            <input type="text" id="reg-strasse" required>
          </div>
          <div class="form-group">
            <label for="reg-plz">${labels.address.plz} *</label>
            <input type="text" id="reg-plz" maxlength="5" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-ort">${labels.address.ort} *</label>
            <input type="text" id="reg-ort" required>
          </div>
          <div class="form-group">
            <label for="reg-bundesland">${labels.address.bundesland} *</label>
            <select id="reg-bundesland" required>
              <option value="">Bitte wählen</option>
              <option>Baden-Württemberg</option><option>Bayern</option><option>Berlin</option>
              <option>Brandenburg</option><option>Bremen</option><option>Hamburg</option>
              <option>Hessen</option><option>Mecklenburg-Vorpommern</option><option>Niedersachsen</option>
              <option>Nordrhein-Westfalen</option><option>Rheinland-Pfalz</option><option>Saarland</option>
              <option>Sachsen</option><option>Sachsen-Anhalt</option><option>Schleswig-Holstein</option>
              <option>Thüringen</option>
            </select>
          </div>
        </div>
        <h3>Kontaktperson (Administrator)</h3>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-vorname">${labels.user.vorname} *</label>
            <input type="text" id="reg-vorname" required>
          </div>
          <div class="form-group">
            <label for="reg-nachname">${labels.user.nachname} *</label>
            <input type="text" id="reg-nachname" required>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label for="reg-email">${labels.user.email} *</label>
            <input type="email" id="reg-email" required>
          </div>
          <div class="form-group">
            <label for="reg-telefon">${labels.user.telefon}</label>
            <input type="tel" id="reg-telefon" placeholder="+49 30 12345678">
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-primary">Registrierung absenden</button>
        </div>
        <div id="regFormMessages" class="form-messages"></div>
      </form>
    </div>`;
}

export default async function decorate(block) {
  const company = companies[0];
  const companyUsers = users.filter((u) => u.companyId === company.id);
  const creditAvailable = company.creditLimit - company.creditUsed;

  block.innerHTML = `
    <div class="b2b-company-account">
      <nav class="b2b-tabs">
        <button class="tab-btn active" data-tab="overview">Übersicht</button>
        <button class="tab-btn" data-tab="registration">${labels.company.registration}</button>
        <button class="tab-btn" data-tab="hierarchy">Organisation</button>
        <button class="tab-btn" data-tab="users">${labels.portal.userManagement}</button>
        <button class="tab-btn" data-tab="addresses">${labels.company.addresses}</button>
        <button class="tab-btn" data-tab="credit">${labels.company.creditLimit}</button>
      </nav>

      <div class="tab-content" id="tab-overview">
        <h2>${company.name}</h2>
        <div class="company-info-grid">
          <div class="info-card">
            <span class="info-label">${labels.company.hrb}</span>
            <span class="info-value">${company.hrb}</span>
          </div>
          <div class="info-card">
            <span class="info-label">${labels.company.ustIdNr}</span>
            <span class="info-value">${company.ustIdNr}</span>
          </div>
          <div class="info-card">
            <span class="info-label">${labels.company.status}</span>
            <span class="info-value status-badge status-aktiv">${company.status}</span>
          </div>
          <div class="info-card">
            <span class="info-label">${labels.company.creditLimit}</span>
            <span class="info-value">${formatCurrency(company.creditLimit)}</span>
          </div>
          <div class="info-card">
            <span class="info-label">${labels.company.creditAvailable}</span>
            <span class="info-value">${formatCurrency(creditAvailable)}</span>
          </div>
          <div class="info-card">
            <span class="info-label">${labels.company.costCenters}</span>
            <span class="info-value">${company.costCenters.map((cc) => cc.name).join(', ')}</span>
          </div>
        </div>
      </div>

      <div class="tab-content hidden" id="tab-registration">
        ${renderRegistrationForm()}
      </div>

      <div class="tab-content hidden" id="tab-hierarchy">
        <h2>Organisationsstruktur</h2>
        <div class="org-tree">
          ${renderOrgTree(orgHierarchy.root)}
        </div>
      </div>

      <div class="tab-content hidden" id="tab-users">
        <h2>${labels.portal.userManagement}</h2>
        <button class="btn-primary" id="btnAddUser">${labels.portal.newUser}</button>
        <table class="b2b-table">
          <thead>
            <tr><th>${labels.user.vorname}</th><th>${labels.user.nachname}</th><th>${labels.user.email}</th><th>${labels.user.rolle}</th><th>${labels.user.abteilung}</th><th>Aktionen</th></tr>
          </thead>
          <tbody>
            ${companyUsers.map((u) => `
              <tr>
                <td>${u.vorname}</td><td>${u.nachname}</td><td>${u.email}</td>
                <td><span class="role-badge role-${u.role.toLowerCase()}">${labels.roles[u.role]}</span></td>
                <td>${u.orgUnit}</td>
                <td><button class="btn-sm btn-edit">${labels.actions.edit}</button></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div id="addUserForm" class="hidden">
          <h3>${labels.portal.newUser}</h3>
          <form id="newUserForm">
            <div class="form-row">
              <div class="form-group"><label>${labels.user.vorname}</label><input type="text" id="new-vorname" required></div>
              <div class="form-group"><label>${labels.user.nachname}</label><input type="text" id="new-nachname" required></div>
            </div>
            <div class="form-row">
              <div class="form-group"><label>${labels.user.email}</label><input type="email" id="new-email" required></div>
              <div class="form-group">
                <label>${labels.user.rolle}</label>
                <select id="new-role">
                  <option value="Buyer">${labels.roles.Buyer}</option>
                  <option value="Approver">${labels.roles.Approver}</option>
                  <option value="Viewer">${labels.roles.Viewer}</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">${labels.actions.save}</button>
              <button type="button" class="btn-secondary" id="cancelAddUser">${labels.actions.cancel}</button>
            </div>
          </form>
        </div>
      </div>

      <div class="tab-content hidden" id="tab-addresses">
        <h2>${labels.company.addresses}</h2>
        <div class="addresses-grid">
          ${renderAddresses(company)}
        </div>
      </div>

      <div class="tab-content hidden" id="tab-credit">
        <h2>${labels.company.creditLimit}</h2>
        <div class="credit-overview">
          <div class="credit-bar">
            <div class="credit-used" style="width:${(company.creditUsed / company.creditLimit) * 100}%"></div>
          </div>
          <div class="credit-details">
            <p><strong>${labels.company.creditLimit}:</strong> ${formatCurrency(company.creditLimit)}</p>
            <p><strong>${labels.company.creditUsed}:</strong> ${formatCurrency(company.creditUsed)}</p>
            <p><strong>${labels.company.creditAvailable}:</strong> ${formatCurrency(creditAvailable)}</p>
          </div>
        </div>
      </div>
    </div>`;

  // Tab switching
  block.querySelectorAll('.tab-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      block.querySelectorAll('.tab-btn').forEach((b) => b.classList.remove('active'));
      block.querySelectorAll('.tab-content').forEach((tc) => tc.classList.add('hidden'));
      btn.classList.add('active');
      block.querySelector(`#tab-${btn.dataset.tab}`).classList.remove('hidden');
    });
  });

  // Registration form
  const regForm = block.querySelector('#companyRegForm');
  if (regForm) {
    const ustInput = block.querySelector('#reg-ust');
    const viesStatus = block.querySelector('#viesStatus');
    ustInput.addEventListener('blur', async () => {
      const result = await validateVIES(ustInput.value);
      viesStatus.textContent = result.valid ? 'VIES ✓' : result.error;
      viesStatus.className = `vies-status ${result.valid ? 'valid' : 'invalid'}`;
    });

    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msgs = block.querySelector('#regFormMessages');
      const errors = [];
      const hrbResult = validateHRB(block.querySelector('#reg-hrb').value);
      if (!hrbResult.valid) errors.push(hrbResult.error);
      const ustResult = validateUstIdNr(block.querySelector('#reg-ust').value);
      if (!ustResult.valid) errors.push(ustResult.error);
      const plzResult = validatePLZ(block.querySelector('#reg-plz').value);
      if (!plzResult.valid) errors.push(plzResult.error);
      const nameResult = validateRequired(block.querySelector('#reg-name').value, 'Firmenname');
      if (!nameResult.valid) errors.push(nameResult.error);

      if (errors.length > 0) {
        msgs.innerHTML = `<div class="msg-error">${errors.join('<br>')}</div>`;
      } else {
        const viesResult = await validateVIES(block.querySelector('#reg-ust').value);
        if (!viesResult.valid) {
          msgs.innerHTML = `<div class="msg-error">${viesResult.error}</div>`;
        } else {
          msgs.innerHTML = '<div class="msg-success">Registrierung erfolgreich übermittelt. Sie erhalten eine Bestätigungs-E-Mail.</div>';
        }
      }
    });
  }

  // Add user form toggle
  const btnAddUser = block.querySelector('#btnAddUser');
  const addUserForm = block.querySelector('#addUserForm');
  if (btnAddUser && addUserForm) {
    btnAddUser.addEventListener('click', () => addUserForm.classList.toggle('hidden'));
    block.querySelector('#cancelAddUser').addEventListener('click', () => addUserForm.classList.add('hidden'));
    block.querySelector('#newUserForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const tbody = block.querySelector('.b2b-table tbody');
      const v = block.querySelector('#new-vorname').value;
      const n = block.querySelector('#new-nachname').value;
      const em = block.querySelector('#new-email').value;
      const role = block.querySelector('#new-role').value;
      tbody.insertAdjacentHTML('beforeend', `<tr><td>${escapeHTML(v)}</td><td>${escapeHTML(n)}</td><td>${escapeHTML(em)}</td><td><span class="role-badge role-${escapeHTML(role.toLowerCase())}">${labels.roles[role]}</span></td><td>—</td><td><button class="btn-sm btn-edit">${labels.actions.edit}</button></td></tr>`);
      addUserForm.classList.add('hidden');
      e.target.reset();
    });
  }
}
