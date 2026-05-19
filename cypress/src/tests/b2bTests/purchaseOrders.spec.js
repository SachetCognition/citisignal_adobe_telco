// TC-PO: Purchase Order & Approval Tests
describe('B2B Purchase Orders / Bestellanforderungen (TC-PO)', () => {
  beforeEach(() => {
    cy.visit('/b2b/purchase-orders');
    cy.get('.b2b-purchase-orders').should('be.visible');
  });

  it('TC-PO-001: Create PO with PO number', () => {
    cy.get('#btnNewPO').click();
    cy.get('#poNumInput').type('PO-2026-005');
    cy.get('#poCostCenter').select(0);
    cy.get('#poProduct').select(0);
    cy.get('#poQty').clear().type('5');
    cy.get('#createPOForm').submit();
    cy.get('.msg-success').should('contain', 'PO-2026-005');
  });

  it('TC-PO-002: Auto-approved order (< 500€)', () => {
    cy.contains('PO-2026-001').closest('tr').find('.btn-view-po').click();
    cy.get('.po-detail').should('be.visible');
    cy.get('.status-approved').should('contain', 'Genehmigt');
    cy.get('.approval-history').should('contain', 'Automatisch genehmigt');
  });

  it('TC-PO-003: Order requires Abteilungsleiter approval (500-5000€)', () => {
    cy.contains('PO-2026-002').closest('tr').find('.btn-view-po').click();
    cy.get('.po-detail').should('be.visible');
    cy.get('.status-pending').should('contain', 'ausstehend');
    cy.get('.po-meta').should('contain', 'Abteilungsleiter');
  });

  it('TC-PO-004: Order requires Geschäftsführer approval (> 5000€)', () => {
    cy.contains('PO-2026-003').closest('tr').find('.btn-view-po').click();
    cy.get('.po-detail').should('be.visible');
    cy.get('.po-meta').should('contain', 'Geschäftsführer');
  });

  it('TC-PO-005: Approver rejects with comment', () => {
    cy.contains('PO-2026-002').closest('tr').find('.btn-view-po').click();
    cy.get('#approvalComment').type('Budget überschritten');
    cy.get('.btn-reject').click();
    cy.get('.msg-error').should('contain', 'abgelehnt');
    cy.get('.msg-error').should('contain', 'Budget überschritten');
  });

  it('TC-PO-006: Approver approves PO', () => {
    cy.contains('PO-2026-002').closest('tr').find('.btn-view-po').click();
    cy.get('.btn-approve').click();
    cy.get('.msg-success').should('contain', 'genehmigt');
  });

  it('TC-PO: Filter by status', () => {
    cy.get('[data-filter="Genehmigung ausstehend"]').click();
    cy.get('.po-row:visible').should('have.length.at.least', 1);
    cy.get('.po-row:visible').each(($row) => {
      cy.wrap($row).should('contain', 'ausstehend');
    });
  });

  it('TC-PO: Approval preview updates on product/qty change', () => {
    cy.get('#btnNewPO').click();
    cy.get('#poProduct').select(0);
    cy.get('#poQty').clear().type('1');
    cy.get('#approvalPreview').should('contain', 'Automatisch genehmigt');
    cy.get('#poQty').clear().type('100');
    cy.get('#approvalPreview').should('contain', 'Abteilungsleiter');
  });
});
