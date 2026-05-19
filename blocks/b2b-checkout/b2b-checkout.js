import { companies } from '../../scripts/b2b-mock-data.js';
import { formatCurrency, formatTaxDisplay, labels } from '../../scripts/german-locale.js';
import { validateIBAN, validateRequired } from '../../scripts/validators.js';

export default async function decorate(block) {
  const company = companies[0];
  const defaultAddr = company.addresses.find((a) => a.isDefault);
  const cartItems = [
    { sku: 'MOB-CORP-L', name: 'Business Mobil L', qty: 20, unitPrice: 39.99 },
    { sku: 'IOT-SIM-100', name: 'IoT SIM Paket 100', qty: 50, unitPrice: 4.49 },
  ];
  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const tax = formatTaxDisplay(subtotal);

  block.innerHTML = `
    <div class="b2b-checkout">
      <h2>${labels.checkout.title}</h2>
      <div class="checkout-grid">
        <div class="checkout-main">
          <section class="checkout-section">
            <h3>${labels.checkout.shippingAddress}</h3>
            <div class="address-prefill">
              <p><strong>${company.name}</strong></p>
              <p>${defaultAddr.strasse}<br>${defaultAddr.plz} ${defaultAddr.ort}<br>${defaultAddr.bundesland}, Deutschland</p>
              <button class="btn-secondary btn-sm">${labels.actions.edit}</button>
            </div>
          </section>
          <section class="checkout-section">
            <h3>${labels.checkout.billingAddress}</h3>
            <label class="checkbox-label"><input type="checkbox" checked id="sameBilling"> Identisch mit Lieferadresse</label>
            <div id="billingFields" class="hidden">
              <div class="form-group"><label>${labels.address.strasse}</label><input type="text"></div>
              <div class="form-row">
                <div class="form-group"><label>${labels.address.plz}</label><input type="text" maxlength="5"></div>
                <div class="form-group"><label>${labels.address.ort}</label><input type="text"></div>
              </div>
            </div>
          </section>
          <section class="checkout-section">
            <h3>Bestelldetails</h3>
            <div class="form-row">
              <div class="form-group">
                <label>${labels.checkout.poNumber}</label>
                <input type="text" id="poNumber" placeholder="PO-2026-001">
              </div>
              <div class="form-group">
                <label>${labels.checkout.costCenter}</label>
                <select id="costCenter">
                  ${company.costCenters.map((cc) => `<option value="${cc.code}">${cc.name} (${cc.code})</option>`).join('')}
                </select>
              </div>
            </div>
            <label class="checkbox-label"><input type="checkbox" id="splitBilling"> Getrennte Rechnungen je Kostenstelle</label>
          </section>
          <section class="checkout-section">
            <h3>${labels.checkout.paymentMethod}</h3>
            <div class="payment-options">
              <label class="payment-option">
                <input type="radio" name="payment" value="sepa" checked>
                <span class="payment-label">${labels.checkout.sepaLastschrift}</span>
              </label>
              <div id="sepaFields" class="payment-fields">
                <div class="form-group">
                  <label>${labels.checkout.iban}</label>
                  <input type="text" id="ibanInput" placeholder="DE89 3704 0044 0532 0130 00">
                  <span id="ibanValidation" class="validation-msg"></span>
                </div>
                <div class="form-group">
                  <label>${labels.checkout.accountHolder}</label>
                  <input type="text" id="accountHolder" value="${company.name}">
                </div>
                <p class="sepa-mandate">Ich ermächtige ${company.name}, Zahlungen von meinem Konto mittels SEPA-Lastschrift einzuziehen.</p>
              </div>
              <label class="payment-option">
                <input type="radio" name="payment" value="rechnung">
                <span class="payment-label">${labels.checkout.rechnung}</span>
              </label>
              <div id="rechnungFields" class="payment-fields hidden">
                <p class="payment-info">Zahlung innerhalb von 30 Tagen nach Rechnungserhalt. Rechnung wird an die Rechnungsadresse gesendet.</p>
              </div>
              <label class="payment-option">
                <input type="radio" name="payment" value="vorkasse">
                <span class="payment-label">${labels.checkout.vorkasse}</span>
              </label>
              <div id="vorkasseFields" class="payment-fields hidden">
                <p class="payment-info">Bitte überweisen Sie den Betrag nach Bestellbestätigung auf das angegebene Konto. Die Lieferung erfolgt nach Zahlungseingang.</p>
              </div>
            </div>
          </section>
        </div>
        <aside class="checkout-summary">
          <h3>Zusammenfassung</h3>
          <div class="summary-items">
            ${cartItems.map((item) => `
              <div class="summary-item">
                <span>${item.qty}× ${item.name}</span>
                <span>${formatCurrency(item.qty * item.unitPrice)}</span>
              </div>
            `).join('')}
          </div>
          <div class="summary-totals">
            <div class="summary-row"><span>Zwischensumme (netto)</span><span>${tax.netto}</span></div>
            <div class="summary-row"><span>${tax.label}</span><span>${tax.mwst}</span></div>
            <div class="summary-row total"><span>${labels.checkout.orderTotal}</span><span>${tax.brutto}</span></div>
          </div>
          <button class="btn-primary btn-place-order" id="btnPlaceOrder">${labels.checkout.placeOrder}</button>
          <div id="checkoutMessages" class="checkout-messages"></div>
        </aside>
      </div>
    </div>`;

  // Toggle billing
  block.querySelector('#sameBilling').addEventListener('change', (e) => {
    block.querySelector('#billingFields').classList.toggle('hidden', e.target.checked);
  });

  // Payment method toggle
  block.querySelectorAll('input[name="payment"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      block.querySelector('#sepaFields').classList.toggle('hidden', radio.value !== 'sepa');
      block.querySelector('#rechnungFields').classList.toggle('hidden', radio.value !== 'rechnung');
      block.querySelector('#vorkasseFields').classList.toggle('hidden', radio.value !== 'vorkasse');
    });
  });

  // IBAN validation
  const ibanInput = block.querySelector('#ibanInput');
  const ibanMsg = block.querySelector('#ibanValidation');
  ibanInput?.addEventListener('blur', () => {
    const result = validateIBAN(ibanInput.value);
    ibanMsg.textContent = result.valid ? 'IBAN gültig ✓' : result.error;
    ibanMsg.className = `validation-msg ${result.valid ? 'valid' : 'invalid'}`;
  });

  // Place order
  block.querySelector('#btnPlaceOrder').addEventListener('click', () => {
    const msgs = block.querySelector('#checkoutMessages');
    const payment = block.querySelector('input[name="payment"]:checked').value;
    const errors = [];

    if (payment === 'sepa') {
      const ibanResult = validateIBAN(ibanInput.value);
      if (!ibanResult.valid) errors.push('Ungültige IBAN');
      const holderResult = validateRequired(block.querySelector('#accountHolder').value, 'Kontoinhaber');
      if (!holderResult.valid) errors.push(holderResult.error);
    }

    // Credit limit check
    if (subtotal + companies[0].creditUsed > companies[0].creditLimit) {
      errors.push(`Kreditlimit überschritten. Verfügbarer Kreditrahmen: ${formatCurrency(companies[0].creditLimit - companies[0].creditUsed)}`);
    }

    if (errors.length > 0) {
      msgs.innerHTML = `<div class="msg-error">${errors.join('<br>')}</div>`;
    } else {
      const poNum = block.querySelector('#poNumber').value || 'Auto';
      msgs.innerHTML = `<div class="msg-success">
        <h4>Bestellung erfolgreich aufgegeben!</h4>
        <p>Bestellnummer: <strong>100005</strong></p>
        <p>PO-Nummer: <strong>${poNum}</strong></p>
        <p>Zahlungsart: <strong>${payment === 'sepa' ? labels.checkout.sepaLastschrift : (payment === 'rechnung' ? labels.checkout.rechnung : labels.checkout.vorkasse)}</strong></p>
        <p>Betrag: <strong>${tax.brutto}</strong></p>
        ${payment === 'rechnung' ? '<p>Zahlungsziel: 30 Tage netto</p>' : ''}
      </div>`;
    }
  });
}
