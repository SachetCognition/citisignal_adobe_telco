// TC-CA: Company Account Tests
describe('B2B Company Account (TC-CA)', () => {
  beforeEach(() => {
    cy.visit('/b2b/company-account');
    cy.get('.b2b-company-account').should('be.visible');
  });

  it('TC-CA-001: Company registration with valid HRB and USt-IdNr', () => {
    cy.get('[data-tab="registration"]').click();
    cy.get('#tab-registration').should('be.visible');
    cy.get('#reg-name').type('Test GmbH');
    cy.get('#reg-hrb').type('HRB 99999');
    cy.get('#reg-ust').type('DE123456789');
    cy.get('#reg-ust').blur();
    cy.get('.vies-status').should('contain', 'VIES');
    cy.get('#reg-strasse').type('Teststraße 1');
    cy.get('#reg-plz').type('10115');
    cy.get('#reg-ort').type('Berlin');
    cy.get('#reg-bundesland').select('Berlin');
    cy.get('#reg-vorname').type('Max');
    cy.get('#reg-nachname').type('Mustermann');
    cy.get('#reg-email').type('max@test-gmbh.de');
    cy.get('#companyRegForm').submit();
    cy.get('.msg-success').should('contain', 'Registrierung erfolgreich');
  });

  it('TC-CA-002: Company registration with invalid USt-IdNr shows validation error', () => {
    cy.get('[data-tab="registration"]').click();
    cy.get('#reg-name').type('Test GmbH');
    cy.get('#reg-hrb').type('HRB 99999');
    cy.get('#reg-ust').type('INVALID123');
    cy.get('#reg-strasse').type('Teststraße 1');
    cy.get('#reg-plz').type('10115');
    cy.get('#reg-ort').type('Berlin');
    cy.get('#reg-bundesland').select('Berlin');
    cy.get('#reg-vorname').type('Max');
    cy.get('#reg-nachname').type('Mustermann');
    cy.get('#reg-email').type('max@test.de');
    cy.get('#companyRegForm').submit();
    cy.get('.msg-error').should('be.visible');
    cy.get('.msg-error').should('contain', 'USt-IdNr');
  });

  it('TC-CA-003: Org hierarchy displays 3 levels correctly', () => {
    cy.get('[data-tab="hierarchy"]').click();
    cy.get('#tab-hierarchy').should('be.visible');
    cy.get('.org-tree').should('be.visible');
    cy.get('.org-node').should('have.length.at.least', 3);
    cy.get('.org-unit-name').first().should('contain', 'Geschäftsführung');
    cy.get('.org-unit-name').should('contain', 'IT-Abteilung');
    cy.get('.org-unit-name').should('contain', 'Vertrieb');
  });

  it('TC-CA-004: Admin assigns roles to users', () => {
    cy.get('[data-tab="users"]').click();
    cy.get('.b2b-table').should('be.visible');
    cy.get('.role-badge').should('have.length.at.least', 4);
    cy.get('.role-admin').should('contain', 'Administrator');
    cy.get('.role-buyer').should('contain', 'Einkäufer');
    cy.get('.role-approver').should('contain', 'Genehmiger');
    cy.get('.role-viewer').should('contain', 'Betrachter');
  });

  it('TC-CA-005: German addresses saved correctly', () => {
    cy.get('[data-tab="addresses"]').click();
    cy.get('.addresses-grid').should('be.visible');
    cy.get('.address-card').should('have.length.at.least', 1);
    cy.get('.address-card').first().should('contain', 'Musterstraße');
    cy.get('.address-card').first().should('contain', '10115');
    cy.get('.address-card').first().should('contain', 'Berlin');
  });

  it('TC-CA-006: Credit limit displayed with used/available', () => {
    cy.get('[data-tab="credit"]').click();
    cy.get('.credit-bar').should('be.visible');
    cy.get('.credit-used').should('be.visible');
    cy.get('.credit-details').should('contain', 'Kreditlimit');
    cy.get('.credit-details').should('contain', 'Genutzter Kredit');
    cy.get('.credit-details').should('contain', 'Verfügbarer Kredit');
  });
});
