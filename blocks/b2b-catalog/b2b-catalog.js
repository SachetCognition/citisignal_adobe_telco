import { products } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, formatTaxDisplay, labels } from '../../scripts/german-locale.js';
import { validateCSVUpload } from '../../scripts/validators.js';

function getPriceForQty(product, qty) {
  const tier = product.priceTiers.find((t) => qty >= t.min && (t.max === null || qty <= t.max));
  return tier ? tier.price : product.priceTiers[0].price;
}

function renderProductCard(product) {
  const price = product.priceTiers[0].price;
  const tax = formatTaxDisplay(price);
  return `
    <div class="product-card" data-sku="${product.sku}">
      <div class="product-type-badge">${product.type}</div>
      <h3>${product.name}</h3>
      <p class="product-desc">${product.description}</p>
      ${product.sla ? `<span class="sla-badge sla-${product.sla.toLowerCase()}">${product.sla}</span>` : ''}
      ${product.dataGB ? `<p class="product-feature">${labels.product.dataVolume}: ${product.dataGB} GB</p>` : ''}
      ${product.contractMonths ? `<p class="product-feature">${labels.product.contractDuration}: ${product.contractMonths.join(' / ')} Monate</p>` : ''}
      <div class="product-pricing">
        <div class="price-main">${tax.brutto} ${tax.label}</div>
        <div class="price-tax">${tax.netto} netto</div>
      </div>
      <div class="tier-pricing">
        <table class="tier-table">
          <thead><tr><th>${labels.product.quantity}</th><th>${labels.product.price}</th></tr></thead>
          <tbody>
            ${product.priceTiers.map((t) => `<tr><td>${t.min}${t.max ? `–${t.max}` : '+'}</td><td>${formatCurrency(t.price)}</td></tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="product-actions">
        <div class="qty-control">
          <button class="qty-btn qty-minus">−</button>
          <input type="number" class="qty-input" value="1" min="1" data-sku="${product.sku}">
          <button class="qty-btn qty-plus">+</button>
        </div>
        <button class="btn-primary btn-add-cart" data-sku="${product.sku}">${labels.product.addToCart}</button>
        <button class="btn-secondary btn-add-requisition" data-sku="${product.sku}">${labels.product.addToRequisition}</button>
        <button class="btn-secondary btn-compare" data-sku="${product.sku}">${labels.product.compare}</button>
      </div>
    </div>`;
}

function renderComparison(selectedSkus) {
  const selected = products.filter((p) => selectedSkus.includes(p.sku));
  if (selected.length < 2) return '<p>Bitte wählen Sie mindestens 2 Produkte zum Vergleichen.</p>';
  const fields = [
    { key: 'type', label: 'Typ' },
    { key: 'sla', label: 'SLA-Stufe' },
    { key: 'dataGB', label: 'Datenvolumen' },
    { key: 'contractMonths', label: 'Vertragslaufzeit' },
    { key: 'minutesIncl', label: 'Minuten' },
    { key: 'smsIncl', label: 'SMS' },
    { key: 'speedMbps', label: 'Geschwindigkeit' },
  ];
  return `<table class="comparison-table">
    <thead><tr><th>Eigenschaft</th>${selected.map((p) => `<th>${p.name}</th>`).join('')}</tr></thead>
    <tbody>
      <tr><td><strong>Preis ab</strong></td>${selected.map((p) => `<td>${formatCurrency(p.priceTiers[p.priceTiers.length - 1].price)}/Monat</td>`).join('')}</tr>
      ${fields.filter((f) => selected.some((p) => p[f.key])).map((f) => `
        <tr><td><strong>${f.label}</strong></td>${selected.map((p) => `<td>${Array.isArray(p[f.key]) ? p[f.key].join(', ') + ' Mon.' : (p[f.key] ? (typeof p[f.key] === 'number' ? p[f.key] + (f.key === 'dataGB' ? ' GB' : (f.key === 'speedMbps' ? ' Mbit/s' : '')) : p[f.key]) : '—')}</td>`).join('')}</tr>
      `).join('')}
    </tbody>
  </table>`;
}

export default async function decorate(block) {
  const categories = [...new Set(products.map((p) => p.category))];
  const compareSet = new Set();

  block.innerHTML = `
    <div class="b2b-catalog">
      <nav class="catalog-tabs">
        <button class="cat-tab active" data-cat="all">Alle Produkte</button>
        ${categories.map((c) => `<button class="cat-tab" data-cat="${c}">${c}</button>`).join('')}
        <button class="cat-tab" data-cat="csv">CSV-Upload</button>
        <button class="cat-tab" data-cat="compare">${labels.product.compare}</button>
      </nav>
      <div class="catalog-content">
        <div id="productGrid" class="product-grid">
          ${products.map(renderProductCard).join('')}
        </div>
        <div id="csvUpload" class="hidden">
          <h2>Schnellbestellung / CSV-Upload</h2>
          <p>Laden Sie eine CSV-Datei hoch (Spalten: SKU, Menge, Mitarbeiter).</p>
          <textarea id="csvInput" rows="10" placeholder="SKU;Menge;Mitarbeiter\nMOB-CORP-L;10;Max Mustermann\nIOT-SIM-100;50;"></textarea>
          <button class="btn-primary" id="btnParseCSV">CSV verarbeiten</button>
          <div id="csvResults"></div>
        </div>
        <div id="compareView" class="hidden">
          <h2>Produktvergleich</h2>
          <div id="comparisonTable"></div>
        </div>
      </div>
      <div id="cartNotification" class="cart-notification hidden"></div>
    </div>`;

  // Category filtering
  block.querySelectorAll('.cat-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      block.querySelectorAll('.cat-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const cat = tab.dataset.cat;
      block.querySelector('#productGrid').classList.toggle('hidden', cat === 'csv' || cat === 'compare');
      block.querySelector('#csvUpload').classList.toggle('hidden', cat !== 'csv');
      block.querySelector('#compareView').classList.toggle('hidden', cat !== 'compare');
      if (cat === 'compare') {
        block.querySelector('#comparisonTable').innerHTML = renderComparison([...compareSet]);
      }
      if (cat !== 'csv' && cat !== 'compare') {
        block.querySelectorAll('.product-card').forEach((card) => {
          const sku = card.dataset.sku;
          const prod = products.find((p) => p.sku === sku);
          card.style.display = (cat === 'all' || prod.category === cat) ? '' : 'none';
        });
      }
    });
  });

  // Qty controls
  block.querySelectorAll('.qty-minus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      if (Number(input.value) > 1) input.value = Number(input.value) - 1;
    });
  });
  block.querySelectorAll('.qty-plus').forEach((btn) => {
    btn.addEventListener('click', () => {
      const input = btn.parentElement.querySelector('.qty-input');
      input.value = Number(input.value) + 1;
    });
  });

  // Add to cart
  block.querySelectorAll('.btn-add-cart').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sku = btn.dataset.sku;
      const prod = products.find((p) => p.sku === sku);
      const qty = Number(block.querySelector(`.qty-input[data-sku="${sku}"]`).value);
      const price = getPriceForQty(prod, qty);
      const notif = block.querySelector('#cartNotification');
      notif.innerHTML = `${qty}× ${prod.name} (${formatCurrency(price)}/Stk.) zum Warenkorb hinzugefügt.`;
      notif.classList.remove('hidden');
      setTimeout(() => notif.classList.add('hidden'), 3000);
    });
  });

  // Compare
  block.querySelectorAll('.btn-compare').forEach((btn) => {
    btn.addEventListener('click', () => {
      const { sku } = btn.dataset;
      if (compareSet.has(sku)) { compareSet.delete(sku); btn.classList.remove('compared'); }
      else { compareSet.add(sku); btn.classList.add('compared'); }
    });
  });

  // CSV Upload
  block.querySelector('#btnParseCSV')?.addEventListener('click', () => {
    const csv = block.querySelector('#csvInput').value;
    const result = validateCSVUpload(csv);
    const resultsDiv = block.querySelector('#csvResults');
    if (!result.valid) {
      resultsDiv.innerHTML = `<div class="msg-error">${result.errors.join('<br>')}</div>`;
    } else {
      const matched = result.rows.map((r) => {
        const prod = products.find((p) => p.sku === r.sku);
        return { ...r, found: !!prod, name: prod?.name || 'Unbekannt', price: prod ? getPriceForQty(prod, r.menge) : 0 };
      });
      resultsDiv.innerHTML = `
        <table class="b2b-table"><thead><tr><th>Zeile</th><th>SKU</th><th>Produkt</th><th>Menge</th><th>Stückpreis</th><th>Gesamt</th></tr></thead>
        <tbody>${matched.map((r) => `<tr class="${r.found ? '' : 'row-error'}"><td>${r.lineNumber}</td><td>${r.sku}</td><td>${r.name}</td><td>${r.menge}</td><td>${r.found ? formatCurrency(r.price) : '—'}</td><td>${r.found ? formatCurrency(r.price * r.menge) : '—'}</td></tr>`).join('')}</tbody></table>
        <p><strong>Summe:</strong> ${formatCurrency(matched.filter((r) => r.found).reduce((s, r) => s + r.price * r.menge, 0))}</p>
        <button class="btn-primary" id="btnAddCSVToCart">Alle in den Warenkorb</button>`;
      resultsDiv.querySelector('#btnAddCSVToCart')?.addEventListener('click', () => {
        const notif = block.querySelector('#cartNotification');
        notif.innerHTML = `${matched.filter((r) => r.found).length} Positionen zum Warenkorb hinzugefügt.`;
        notif.classList.remove('hidden');
        setTimeout(() => notif.classList.add('hidden'), 3000);
      });
    }
  });
}
