// TC-RL: Requisition List Tests
describe('B2B Requisition Lists / Bestelllisten (TC-RL)', () => {
  beforeEach(() => {
    cy.visit('/b2b/requisition-lists');
    cy.get('.b2b-requisition').should('be.visible');
  });

  it('TC-RL-001: Create requisition list "Abteilung IT Geräte"', () => {
    cy.get('#btnCreateList').click();
    cy.get('#newListName').type('Abteilung Marketing Geräte');
    cy.get('#newListProduct').select(0);
    cy.get('#newListQty').clear().type('5');
    cy.get('#newListForm').submit();
    cy.get('.requisition-card').should('contain', 'Abteilung Marketing Geräte');
  });

  it('TC-RL-002: Existing requisition lists display correctly', () => {
    cy.get('.requisition-card').should('have.length.at.least', 2);
    cy.get('.requisition-card').first().should('contain', 'Abteilung IT Geräte');
    cy.get('.b2b-table').should('be.visible');
  });

  it('TC-RL-003: Move requisition list to cart', () => {
    cy.get('.btn-list-to-cart').first().click();
    cy.get('.msg-success').should('contain', 'Warenkorb');
  });

  it('TC-RL-004: Reorder from order history', () => {
    cy.get('.btn-reorder').first().click();
    cy.get('.msg-success').should('contain', 'Warenkorb');
  });

  it('TC-RL: Delete requisition list', () => {
    cy.get('.requisition-card').then(($cards) => {
      const initialCount = $cards.length;
      cy.get('.btn-delete-list').first().click();
      cy.get('.requisition-card').should('have.length', initialCount - 1);
    });
  });
});
