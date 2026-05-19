// TC-Q: Quote Tests
describe('B2B Quotes / Angebote (TC-Q)', () => {
  beforeEach(() => {
    cy.visit('/b2b/quotes');
    cy.get('.b2b-quotes').should('be.visible');
  });

  it('TC-Q-001: Submit RFQ - quote created', () => {
    cy.get('#btnNewQuote').click();
    cy.get('#rfqProduct').select('MOB-CORP-L');
    cy.get('#rfqQty').clear().type('100');
    cy.get('#rfqNotes').type('Anfrage für 100 SIM-Karten');
    cy.get('#rfqForm').submit();
    cy.get('.msg-success').should('contain', 'Angebotsanfrage');
    cy.get('.msg-success').should('contain', 'Q-2026-005');
  });

  it('TC-Q-002: View quote with negotiation history', () => {
    cy.contains('Q-2026-002').closest('tr').find('.btn-view-quote').click();
    cy.get('.quote-detail').should('be.visible');
    cy.get('.status-negotiation').should('contain', 'Verhandlung');
    cy.get('.quote-history .history-entry').should('have.length.at.least', 2);
    cy.get('.history-entry').should('contain', 'Rabatt');
  });

  it('TC-Q-003: Accept quote converts to order', () => {
    cy.contains('Q-2026-003').closest('tr').find('.btn-view-quote').click();
    cy.get('.quote-detail').should('be.visible');
    cy.get('.btn-convert').click();
    cy.get('.msg-success').should('contain', 'Bestellung');
  });

  it('TC-Q-004: Download quote PDF', () => {
    cy.contains('Q-2026-001').closest('tr').find('.btn-view-quote').click();
    cy.get('.btn-download-pdf').click();
    cy.get('.msg-success').should('contain', 'PDF');
  });

  it('TC-Q-005: Expired quotes cannot be converted', () => {
    cy.contains('Q-2026-004').closest('tr').find('.btn-view-quote').click();
    cy.get('.quote-detail').should('be.visible');
    cy.get('.status-expired').should('contain', 'Abgelaufen');
    cy.get('.btn-convert').should('not.exist');
  });

  it('TC-Q: Quote list displays all quotes', () => {
    cy.get('.b2b-table tbody tr').should('have.length.at.least', 4);
    cy.get('.status-badge').should('have.length.at.least', 4);
  });
});
