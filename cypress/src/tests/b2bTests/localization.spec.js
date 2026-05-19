// TC-L10N: Localization Tests
describe('B2B German Localization (TC-L10N)', () => {
  it('TC-L10N-001: Full page render in de_DE - UI elements in German', () => {
    cy.visit('/b2b/portal');
    cy.get('.b2b-portal').should('be.visible');
    cy.get('.portal-tab').should('contain', 'Übersicht');
    cy.get('.portal-tab').should('contain', 'Bestellverlauf');
    cy.get('.portal-tab').should('contain', 'Benutzerverwaltung');
    cy.get('.portal-tab').should('contain', 'Support-Tickets');
    cy.get('.portal-tab').should('contain', 'Dokumentencenter');
  });

  it('TC-L10N-002: Price display shows German EUR format (1.234,56 €)', () => {
    cy.visit('/b2b/catalog');
    cy.get('.b2b-catalog').should('be.visible');
    cy.get('.price-main').first().invoke('text').should('match', /[\d.,]+\s*€/);
  });

  it('TC-L10N-003: Tax display shows MwSt', () => {
    cy.visit('/b2b/catalog');
    cy.get('.price-tax').first().should('contain', 'MwSt');
  });

  it('TC-L10N-004: Checkout fields in German', () => {
    cy.visit('/b2b/checkout');
    cy.get('.b2b-checkout').should('be.visible');
    cy.get('.checkout-section').should('contain', 'Lieferadresse');
    cy.get('.checkout-section').should('contain', 'Rechnungsadresse');
    cy.get('.checkout-section').should('contain', 'Zahlungsart');
    cy.contains('SEPA-Lastschrift').should('be.visible');
    cy.contains('Rechnung').should('be.visible');
    cy.contains('Vorkasse').should('be.visible');
  });

  it('TC-L10N-005: Date display in DD.MM.YYYY format', () => {
    cy.visit('/b2b/portal');
    cy.get('[data-tab="orders"]').click();
    cy.get('.b2b-table tbody tr').first().find('td').eq(1).invoke('text').should('match', /\d{2}\.\d{2}\.\d{4}/);
  });

  it('TC-L10N-006: Legal pages accessible and rendered in German', () => {
    cy.visit('/b2b/legal');
    cy.get('.b2b-legal').should('be.visible');
    cy.get('.legal-tab').should('contain', 'Impressum');
    cy.get('.legal-tab').should('contain', 'AGB');
    cy.get('.legal-tab').should('contain', 'Datenschutzerklärung');
    cy.get('.legal-tab').should('contain', 'Widerrufsbelehrung');
    cy.get('.legal-content').should('contain', 'Impressum');
    cy.get('[data-page="agb"]').click();
    cy.get('.legal-content').should('contain', 'Allgemeine Geschäftsbedingungen');
    cy.get('[data-page="datenschutz"]').click();
    cy.get('.legal-content').should('contain', 'Datenschutzerklärung');
    cy.get('.legal-content').should('contain', 'DSGVO');
  });

  it('TC-L10N-007: Validation errors in German', () => {
    cy.visit('/b2b/company-account');
    cy.get('[data-tab="registration"]').click();
    cy.get('#reg-name').type('Test');
    cy.get('#reg-hrb').type('INVALID');
    cy.get('#reg-ust').type('INVALID');
    cy.get('#reg-strasse').type('Str');
    cy.get('#reg-plz').type('ABC');
    cy.get('#reg-ort').type('Berlin');
    cy.get('#reg-bundesland').select('Berlin');
    cy.get('#reg-vorname').type('Max');
    cy.get('#reg-nachname').type('Test');
    cy.get('#reg-email').type('test@test.de');
    cy.get('#companyRegForm').submit();
    cy.get('.msg-error').should('be.visible');
  });

  it('TC-L10N-008: Company account labels in German', () => {
    cy.visit('/b2b/company-account');
    cy.get('.tab-btn').should('contain', 'Übersicht');
    cy.get('.tab-btn').should('contain', 'Firmenregistrierung');
    cy.get('.tab-btn').should('contain', 'Organisation');
    cy.get('.info-label').should('contain', 'Handelsregisternummer');
    cy.get('.info-label').should('contain', 'USt-IdNr');
    cy.get('.info-label').should('contain', 'Kreditlimit');
  });
});
