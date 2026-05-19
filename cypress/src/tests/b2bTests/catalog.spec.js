// TC-SC: Shared Catalog & Pricing Tests
describe('B2B Catalog & Pricing (TC-SC)', () => {
  beforeEach(() => {
    cy.visit('/b2b/catalog');
    cy.get('.b2b-catalog').should('be.visible');
  });

  it('TC-SC-001: Products display with correct category tabs', () => {
    cy.get('.cat-tab').should('contain', 'Alle Produkte');
    cy.get('.cat-tab').should('contain', 'Mobilfunkverträge');
    cy.get('.cat-tab').should('contain', 'IoT SIM');
    cy.get('.cat-tab').should('contain', 'Geräte');
    cy.get('.product-card').should('have.length.at.least', 5);
  });

  it('TC-SC-002: Volume pricing tiers displayed per product', () => {
    cy.get('.tier-table').first().should('be.visible');
    cy.get('.tier-table').first().find('tr').should('have.length.at.least', 3);
    cy.get('.tier-table').first().should('contain', 'Menge');
    cy.get('.tier-table').first().should('contain', 'Preis');
  });

  it('TC-SC-003: Corporate plan products display contract terms', () => {
    cy.get('.product-feature').should('contain', 'Vertragslaufzeit');
    cy.get('.product-feature').should('contain', 'Datenvolumen');
  });

  it('TC-SC-004: Product comparison shows SLA tier differences', () => {
    cy.get('.btn-compare').eq(0).click();
    cy.get('.btn-compare').eq(1).click();
    cy.get('[data-cat="compare"]').click();
    cy.get('.comparison-table').should('be.visible');
    cy.get('.comparison-table th').should('have.length.at.least', 3);
  });

  it('TC-SC-005: CSV upload parses and validates orders', () => {
    cy.get('[data-cat="csv"]').click();
    cy.get('#csvInput').type('SKU;Menge;Mitarbeiter\nMOB-CORP-L;10;Max Mustermann\nIOT-SIM-100;50;Anna Schmidt');
    cy.get('#btnParseCSV').click();
    cy.get('.b2b-table').should('be.visible');
    cy.get('.b2b-table tbody tr').should('have.length', 2);
    cy.get('#btnAddCSVToCart').should('be.visible');
    cy.get('#btnAddCSVToCart').click();
    cy.get('.cart-notification').should('be.visible');
  });

  it('TC-SC-005b: CSV upload with invalid data shows errors', () => {
    cy.get('[data-cat="csv"]').click();
    cy.get('#csvInput').type('SKU;Menge\nMOB-CORP-L;abc');
    cy.get('#btnParseCSV').click();
    cy.get('.msg-error').should('be.visible');
  });

  it('TC-SC: Category filtering works', () => {
    cy.get('[data-cat="Mobilfunkverträge"]').click();
    cy.get('.product-card:visible').should('have.length.at.least', 1);
    cy.get('.product-card:visible').each(($card) => {
      cy.wrap($card).find('.product-type-badge').should('contain', 'Mobilfunkvertrag');
    });
  });

  it('TC-SC: Add to cart notification', () => {
    cy.get('.btn-add-cart').first().click();
    cy.get('.cart-notification').should('be.visible');
    cy.get('.cart-notification').should('contain', 'Warenkorb');
  });
});
