// TC-SP: Self-Service Portal Tests
describe('B2B Self-Service Portal / Kundenportal (TC-SP)', () => {
  beforeEach(() => {
    cy.visit('/b2b/portal');
    cy.get('.b2b-portal').should('be.visible');
  });

  it('TC-SP-001: Dashboard displays KPIs correctly', () => {
    cy.get('.portal-kpis').should('be.visible');
    cy.get('.kpi-card').should('have.length', 6);
    cy.get('.kpi-label').should('contain', 'Aktive Leitungen');
    cy.get('.kpi-label').should('contain', 'Monatliche Ausgaben');
    cy.get('.kpi-label').should('contain', 'Aktive Verträge');
    cy.get('.spend-trend').should('be.visible');
    cy.get('.trend-bar').should('have.length', 6);
  });

  it('TC-SP-002: Admin manages users', () => {
    cy.get('[data-tab="users"]').click();
    cy.get('.b2b-table').should('be.visible');
    cy.get('.b2b-table tbody tr').should('have.length.at.least', 4);
    cy.get('#btnAddEmployee').should('be.visible');
  });

  it('TC-SP-003: Order history displayed with export options', () => {
    cy.get('[data-tab="orders"]').click();
    cy.get('#ordersTable').should('be.visible');
    cy.get('#ordersTable tbody tr').should('have.length.at.least', 3);
    cy.get('#btnExportOrdersPdf').should('be.visible');
    cy.get('#btnExportOrdersCsv').should('be.visible');
  });

  it('TC-SP-003b: Export order history as PDF', () => {
    cy.get('[data-tab="orders"]').click();
    cy.get('#btnExportOrdersPdf').click();
    cy.get('.msg-success').should('contain', 'PDF');
  });

  it('TC-SP-004: Create support ticket', () => {
    cy.get('[data-tab="tickets"]').click();
    cy.get('.b2b-table').should('be.visible');
    cy.get('#btnNewTicket').click();
    cy.get('#ticketSubject').type('Test-Ticket: SIM defekt');
    cy.get('#ticketDesc').type('SIM-Karte funktioniert nicht mehr.');
    cy.get('#ticketForm').submit();
    cy.get('.msg-success').should('contain', 'Ticket');
    cy.get('.msg-success').should('contain', 'erfolgreich erstellt');
  });

  it('TC-SP-005: Document center with download', () => {
    cy.get('[data-tab="docs"]').click();
    cy.get('#docTable').should('be.visible');
    cy.get('#docTable tbody tr').should('have.length.at.least', 4);
    cy.get('.filter-btn').should('contain', 'Rechnung');
    cy.get('.filter-btn').should('contain', 'Vertrag');
    cy.get('.btn-download').first().click();
    cy.get('.msg-success').should('contain', 'heruntergeladen');
  });

  it('TC-SP-005b: Document filter by type', () => {
    cy.get('[data-tab="docs"]').click();
    cy.get('.doc-filters .filter-btn').contains('Rechnung').click();
    cy.get('#docTable tbody tr:visible').should('have.length.at.least', 1);
    cy.get('#docTable tbody tr:visible').each(($row) => {
      cy.wrap($row).should('contain', 'Rechnung');
    });
  });

  it('TC-SP: Order search works', () => {
    cy.get('[data-tab="orders"]').click();
    cy.get('#orderSearch').type('100001');
    cy.get('#ordersTable tbody tr:visible').should('have.length', 1);
    cy.get('#ordersTable tbody tr:visible').should('contain', '100001');
  });
});
