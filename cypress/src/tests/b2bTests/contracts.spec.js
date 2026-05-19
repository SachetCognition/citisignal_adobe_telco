// TC-TF: Contract Lifecycle Tests
describe('B2B Contracts / Vertragsmanagement (TC-TF-Contracts)', () => {
  beforeEach(() => {
    cy.visit('/b2b/contracts');
    cy.get('.b2b-contracts').should('be.visible');
  });

  it('TC-TF-003: Contract shows Kündigungsfrist', () => {
    cy.get('.contract-card').should('have.length.at.least', 2);
    cy.get('.ctr-label').should('contain', 'Kündigungsfrist');
    cy.get('.ctr-label').should('contain', 'Vertragslaufzeit');
    cy.get('.contract-card').first().should('contain', '3 Monate');
  });

  it('TC-TF-004: Contract timeline displayed', () => {
    cy.get('.contract-timeline').should('be.visible');
    cy.get('.timeline-row').should('have.length.at.least', 2);
    cy.get('.timeline-fill').should('be.visible');
  });

  it('TC-TF: Contract renewal request', () => {
    cy.get('.btn-renew').first().click();
    cy.get('.msg-success').should('contain', 'Vertragsverlängerung');
  });

  it('TC-TF: Contract cancellation request', () => {
    cy.get('.btn-cancel').first().click();
    cy.get('#contractMessages').find('div').should('be.visible');
  });

  it('TC-TF: Status badges displayed correctly', () => {
    cy.get('.status-aktiv').should('have.length.at.least', 1);
    cy.get('.contract-card').should('contain', 'Aktiv');
  });
});
