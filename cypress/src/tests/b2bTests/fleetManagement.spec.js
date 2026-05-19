// TC-TF: B2B Telco Feature Tests (Fleet Management)
describe('B2B Fleet Management / Flottenmanagement (TC-TF)', () => {
  beforeEach(() => {
    cy.visit('/b2b/fleet-management');
    cy.get('.b2b-fleet').should('be.visible');
  });

  it('TC-TF-001: Fleet dashboard shows 50 SIMs with status', () => {
    cy.get('.kpi-value').first().should('contain', '40');
    cy.get('#fleetBody tr').should('have.length', 50);
    cy.get('.status-badge').should('have.length.at.least', 50);
  });

  it('TC-TF-002: SIM table shows employee assignments and plans', () => {
    cy.get('#fleetBody tr').first().find('td').should('have.length', 8);
    cy.get('#fleetBody tr').first().should('contain', '+49');
    cy.get('#fleetBody tr').first().find('td').eq(3).should('not.be.empty');
    cy.get('#fleetBody tr').first().find('td').eq(4).should('not.be.empty');
  });

  it('TC-TF-003: Filter by status works', () => {
    cy.get('[data-filter="Aktiv"]').click();
    cy.get('#fleetBody tr:visible').should('have.length', 40);
    cy.get('[data-filter="Gesperrt"]').click();
    cy.get('#fleetBody tr:visible').should('have.length', 5);
    cy.get('[data-filter="Gekündigt"]').click();
    cy.get('#fleetBody tr:visible').should('have.length', 5);
  });

  it('TC-TF-004: Search filters SIM table', () => {
    cy.get('#simSearch').type('Business Mobil L');
    cy.get('#fleetBody tr:visible').should('have.length.at.least', 1);
    cy.get('#fleetBody tr:visible').each(($row) => {
      cy.wrap($row).should('contain', 'Business Mobil L');
    });
  });

  it('TC-TF-005: Usage report per Kostenstelle displayed', () => {
    cy.get('.fleet-usage-section').should('be.visible');
    cy.get('.usage-row').should('have.length.at.least', 2);
    cy.get('.usage-label').should('contain', 'IT-Abteilung');
    cy.get('.usage-value').first().invoke('text').should('match', /[\d.,]+ GB/);
  });

  it('TC-TF: CSV export', () => {
    cy.get('#btnExportFleet').click();
    cy.get('.msg-success').should('contain', 'CSV-Export');
  });
});
