// TC-CK: Checkout & Payment Tests
describe('B2B Checkout & Payment (TC-CK)', () => {
  beforeEach(() => {
    cy.visit('/b2b/checkout');
    cy.get('.b2b-checkout').should('be.visible');
  });

  it('TC-CK-001: B2B checkout - company address pre-filled, PO field visible', () => {
    cy.get('.address-prefill').should('contain', 'Firma Alpha GmbH');
    cy.get('.address-prefill').should('contain', 'Musterstraße');
    cy.get('#poNumber').should('be.visible');
    cy.get('#costCenter').should('be.visible');
  });

  it('TC-CK-002: SEPA payment with valid DE IBAN accepted', () => {
    cy.get('input[value="sepa"]').should('be.checked');
    cy.get('#ibanInput').type('DE89370400440532013000');
    cy.get('#ibanInput').blur();
    cy.get('#ibanValidation').should('contain', 'gültig');
    cy.get('#ibanValidation').should('have.class', 'valid');
  });

  it('TC-CK-003: SEPA payment with invalid IBAN shows validation error', () => {
    cy.get('#ibanInput').type('DE12345678901234567890');
    cy.get('#ibanInput').blur();
    cy.get('#ibanValidation').should('have.class', 'invalid');
  });

  it('TC-CK-004: Pay via Rechnung - order placed', () => {
    cy.get('input[value="rechnung"]').check();
    cy.get('#rechnungFields').should('be.visible');
    cy.get('.payment-info').should('contain', '30 Tagen');
    cy.get('#poNumber').type('PO-CK-004');
    cy.get('#btnPlaceOrder').click();
    cy.get('.msg-success').should('contain', 'Bestellung erfolgreich');
    cy.get('.msg-success').should('contain', 'Rechnung');
  });

  it('TC-CK-005: Split billing by cost center checkbox', () => {
    cy.get('#splitBilling').check();
    cy.get('#splitBilling').should('be.checked');
  });

  it('TC-CK-006: Order summary shows correct totals with MwSt', () => {
    cy.get('.summary-totals').should('contain', 'Zwischensumme');
    cy.get('.summary-totals').should('contain', 'MwSt');
    cy.get('.summary-totals').should('contain', 'Gesamtsumme');
    cy.get('.summary-row.total').invoke('text').should('match', /[\d.,]+\s*€/);
  });

  it('TC-CK: Vorkasse payment method', () => {
    cy.get('input[value="vorkasse"]').check();
    cy.get('#vorkasseFields').should('be.visible');
    cy.get('#vorkasseFields').should('contain', 'Zahlungseingang');
    cy.get('#poNumber').type('PO-VORKASSE');
    cy.get('#btnPlaceOrder').click();
    cy.get('.msg-success').should('contain', 'Bestellung erfolgreich');
  });

  it('TC-CK: Billing address toggle', () => {
    cy.get('#billingFields').should('not.be.visible');
    cy.get('#sameBilling').uncheck();
    cy.get('#billingFields').should('be.visible');
    cy.get('#sameBilling').check();
    cy.get('#billingFields').should('not.be.visible');
  });
});
