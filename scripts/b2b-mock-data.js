/**
 * B2B Mock Data for German Telco Storefront
 * Provides realistic test data for all B2B features
 */

// ── Companies ──
export const companies = [
  {
    id: 'comp-001',
    name: 'Firma Alpha GmbH',
    hrb: 'HRB 12345',
    ustIdNr: 'DE123456789',
    creditLimit: 50000,
    creditUsed: 32500,
    status: 'Aktiv',
    addresses: [
      {
        id: 'addr-001', label: 'Hauptsitz', strasse: 'Musterstraße 1', plz: '10115', ort: 'Berlin', bundesland: 'Berlin', isDefault: true, type: 'both',
      },
      {
        id: 'addr-002', label: 'Niederlassung Süd', strasse: 'Hauptstraße 42', plz: '80331', ort: 'München', bundesland: 'Bayern', isDefault: false, type: 'shipping',
      },
    ],
    costCenters: [
      { id: 'cc-001', name: 'IT-Abteilung', code: 'IT-100' },
      { id: 'cc-002', name: 'Vertrieb', code: 'VT-200' },
      { id: 'cc-003', name: 'Geschäftsführung', code: 'GF-300' },
    ],
  },
  {
    id: 'comp-002',
    name: 'Beta AG',
    hrb: 'HRB 67890',
    ustIdNr: 'DE987654321',
    creditLimit: 100000,
    creditUsed: 45000,
    status: 'Aktiv',
    addresses: [
      {
        id: 'addr-003', label: 'Zentrale', strasse: 'Industriestraße 10', plz: '70173', ort: 'Stuttgart', bundesland: 'Baden-Württemberg', isDefault: true, type: 'both',
      },
    ],
    costCenters: [
      { id: 'cc-004', name: 'Entwicklung', code: 'EW-100' },
      { id: 'cc-005', name: 'Marketing', code: 'MK-200' },
    ],
  },
];

// ── Users ──
export const users = [
  {
    id: 'user-001', companyId: 'comp-001', email: 'admin@alpha-gmbh.de', vorname: 'Thomas', nachname: 'Müller', role: 'Admin', orgUnit: 'Geschäftsführung',
  },
  {
    id: 'user-002', companyId: 'comp-001', email: 'einkauf@alpha-gmbh.de', vorname: 'Anna', nachname: 'Schmidt', role: 'Buyer', orgUnit: 'IT-Abteilung',
  },
  {
    id: 'user-003', companyId: 'comp-001', email: 'leiter@alpha-gmbh.de', vorname: 'Klaus', nachname: 'Weber', role: 'Approver', orgUnit: 'IT-Abteilung', approverLevel: 'Abteilungsleiter',
  },
  {
    id: 'user-004', companyId: 'comp-001', email: 'gf@alpha-gmbh.de', vorname: 'Peter', nachname: 'Fischer', role: 'Approver', orgUnit: 'Geschäftsführung', approverLevel: 'Geschäftsführer',
  },
  {
    id: 'user-005', companyId: 'comp-001', email: 'mitarbeiter@alpha-gmbh.de', vorname: 'Lisa', nachname: 'Wagner', role: 'Viewer', orgUnit: 'Vertrieb',
  },
];

// ── Organization Hierarchy ──
export const orgHierarchy = {
  companyId: 'comp-001',
  root: {
    name: 'Geschäftsführung',
    users: ['user-001', 'user-004'],
    children: [
      {
        name: 'IT-Abteilung',
        users: ['user-003'],
        children: [
          { name: 'Team Entwicklung', users: ['user-002'], children: [] },
        ],
      },
      {
        name: 'Vertrieb',
        users: ['user-005'],
        children: [],
      },
    ],
  },
};

// ── Products (Telco) ──
export const products = [
  {
    sku: 'MOB-CORP-S', name: 'Business Mobil S', type: 'Mobilfunkvertrag', category: 'Mobilfunkverträge',
    priceTiers: [{ min: 1, max: 9, price: 29.99 }, { min: 10, max: 49, price: 24.99 }, { min: 50, max: 99, price: 19.99 }, { min: 100, max: null, price: 14.99 }],
    sla: 'Bronze', contractMonths: [12, 24], dataGB: 10, minutesIncl: 'Unlimited', smsIncl: 'Unlimited',
    description: 'Einstiegs-Mobilfunkvertrag für Geschäftskunden mit 10 GB Datenvolumen.',
  },
  {
    sku: 'MOB-CORP-M', name: 'Business Mobil M', type: 'Mobilfunkvertrag', category: 'Mobilfunkverträge',
    priceTiers: [{ min: 1, max: 9, price: 39.99 }, { min: 10, max: 49, price: 34.99 }, { min: 50, max: 99, price: 29.99 }, { min: 100, max: null, price: 24.99 }],
    sla: 'Silber', contractMonths: [12, 24], dataGB: 25, minutesIncl: 'Unlimited', smsIncl: 'Unlimited',
    description: 'Mittlerer Mobilfunkvertrag mit 25 GB und Silber-SLA.',
  },
  {
    sku: 'MOB-CORP-L', name: 'Business Mobil L', type: 'Mobilfunkvertrag', category: 'Mobilfunkverträge',
    priceTiers: [{ min: 1, max: 9, price: 49.99 }, { min: 10, max: 49, price: 44.99 }, { min: 50, max: 99, price: 39.99 }, { min: 100, max: null, price: 34.99 }],
    sla: 'Gold', contractMonths: [12, 24, 36], dataGB: 50, minutesIncl: 'Unlimited', smsIncl: 'Unlimited',
    description: 'Premium-Mobilfunkvertrag mit 50 GB und Gold-SLA.',
  },
  {
    sku: 'MOB-CORP-XL', name: 'Business Mobil XL', type: 'Mobilfunkvertrag', category: 'Mobilfunkverträge',
    priceTiers: [{ min: 1, max: 9, price: 69.99 }, { min: 10, max: 49, price: 59.99 }, { min: 50, max: 99, price: 49.99 }, { min: 100, max: null, price: 39.99 }],
    sla: 'Platin', contractMonths: [24, 36], dataGB: 100, minutesIncl: 'Unlimited', smsIncl: 'Unlimited',
    description: 'Enterprise-Mobilfunkvertrag mit 100 GB, Platin-SLA und priorisiertem Support.',
  },
  {
    sku: 'IOT-SIM-100', name: 'IoT SIM Paket 100', type: 'IoT SIM', category: 'IoT SIM',
    priceTiers: [{ min: 1, max: 49, price: 5.99 }, { min: 50, max: 199, price: 4.49 }, { min: 200, max: null, price: 2.99 }],
    sla: 'Bronze', contractMonths: [12, 24, 36], dataMB: 100,
    description: '100 MB IoT SIM-Karte für M2M-Kommunikation.',
  },
  {
    sku: 'FEST-FLAT', name: 'Business Festnetz Flat', type: 'Festnetz', category: 'Festnetz',
    priceTiers: [{ min: 1, max: 4, price: 39.99 }, { min: 5, max: null, price: 34.99 }],
    sla: 'Silber', contractMonths: [12, 24],
    description: 'Festnetz-Flatrate für Geschäftskunden mit allen deutschen Netzen.',
  },
  {
    sku: 'NET-FIBER-500', name: 'Business Internet 500', type: 'Internet', category: 'Internet',
    priceTiers: [{ min: 1, max: 1, price: 79.99 }, { min: 2, max: null, price: 69.99 }],
    sla: 'Gold', contractMonths: [24], speedMbps: 500,
    description: '500 Mbit/s Glasfaser-Internet für den Geschäftsstandort.',
  },
  {
    sku: 'DEV-IPHONE-15', name: 'iPhone 15 Pro (DaaS)', type: 'DaaS', category: 'Geräte',
    priceTiers: [{ min: 1, max: 9, price: 45.99 }, { min: 10, max: null, price: 39.99 }],
    leaseMonths: [24, 36], deviceBrand: 'Apple', deviceModel: 'iPhone 15 Pro',
    description: 'iPhone 15 Pro als Device-as-a-Service mit 24 oder 36 Monaten Laufzeit.',
  },
  {
    sku: 'DEV-GALAXY-S24', name: 'Samsung Galaxy S24 (DaaS)', type: 'DaaS', category: 'Geräte',
    priceTiers: [{ min: 1, max: 9, price: 35.99 }, { min: 10, max: null, price: 29.99 }],
    leaseMonths: [24, 36], deviceBrand: 'Samsung', deviceModel: 'Galaxy S24',
    description: 'Samsung Galaxy S24 als Device-as-a-Service mit flexibler Laufzeit.',
  },
];

// ── SIM Fleet ──
export const simFleet = Array.from({ length: 50 }, (_, i) => ({
  id: `sim-${String(i + 1).padStart(3, '0')}`,
  msisdn: `+4917${String(10000000 + i)}`,
  iccid: `8949${String(1000000000000 + i)}`,
  status: i < 40 ? 'Aktiv' : (i < 45 ? 'Gesperrt' : 'Gekündigt'),
  employee: users[i % users.length]?.vorname + ' ' + users[i % users.length]?.nachname,
  plan: products[i % 4].name,
  costCenter: companies[0].costCenters[i % 3].name,
  dataUsedGB: Math.round(Math.random() * 30 * 10) / 10,
  contractEnd: new Date(2027, (i % 12), 15).toLocaleDateString('de-DE'),
  kuendigungsfrist: '3 Monate',
}));

// ── Contracts ──
export const contracts = [
  {
    id: 'ctr-001', type: 'Mobilfunkvertrag', plan: 'Business Mobil L', status: 'Aktiv',
    startDate: '01.01.2025', endDate: '31.12.2026', laufzeit: '24 Monate',
    kuendigungsfrist: '3 Monate', kuendigungDeadline: '30.09.2026',
    monthlyFee: 49.99, simCount: 20, costCenter: 'IT-Abteilung',
  },
  {
    id: 'ctr-002', type: 'Festnetz', plan: 'Business Festnetz Flat', status: 'Aktiv',
    startDate: '01.06.2025', endDate: '31.05.2027', laufzeit: '24 Monate',
    kuendigungsfrist: '3 Monate', kuendigungDeadline: '28.02.2027',
    monthlyFee: 39.99, costCenter: 'Geschäftsführung',
  },
  {
    id: 'ctr-003', type: 'Internet', plan: 'Business Internet 500', status: 'Läuft aus',
    startDate: '01.03.2024', endDate: '28.02.2026', laufzeit: '24 Monate',
    kuendigungsfrist: '3 Monate', kuendigungDeadline: '30.11.2025',
    monthlyFee: 79.99, costCenter: 'IT-Abteilung',
  },
];

// ── Quotes ──
export const quotes = [
  {
    id: 'Q-2026-001', status: 'Ausstehend', createdAt: '10.05.2026', expiresAt: '10.06.2026',
    buyer: 'Anna Schmidt', items: [{ sku: 'MOB-CORP-L', name: 'Business Mobil L', qty: 100, unitPrice: 49.99, discount: 0 }],
    total: 4999.00, notes: 'Anfrage für 100 SIM-Karten, Business Mobil L',
    history: [{ date: '10.05.2026', actor: 'Anna Schmidt', action: 'Angebot angefordert' }],
  },
  {
    id: 'Q-2026-002', status: 'Verhandlung', createdAt: '05.05.2026', expiresAt: '05.06.2026',
    buyer: 'Anna Schmidt', items: [{ sku: 'MOB-CORP-M', name: 'Business Mobil M', qty: 50, unitPrice: 34.99, discount: 10 }],
    total: 1574.55, notes: '10% Rabatt vom Vertrieb angeboten',
    history: [
      { date: '05.05.2026', actor: 'Anna Schmidt', action: 'Angebot angefordert' },
      { date: '07.05.2026', actor: 'Vertrieb', action: '10% Rabatt angeboten' },
    ],
  },
  {
    id: 'Q-2026-003', status: 'Angenommen', createdAt: '01.04.2026', expiresAt: '01.05.2026',
    buyer: 'Anna Schmidt', items: [{ sku: 'IOT-SIM-100', name: 'IoT SIM Paket 100', qty: 200, unitPrice: 2.99, discount: 0 }],
    total: 598.00, notes: 'IoT SIM-Karten für Maschinenpark',
    history: [
      { date: '01.04.2026', actor: 'Anna Schmidt', action: 'Angebot angefordert' },
      { date: '03.04.2026', actor: 'Vertrieb', action: 'Angebot bestätigt' },
      { date: '05.04.2026', actor: 'Anna Schmidt', action: 'Angebot angenommen' },
    ],
  },
  {
    id: 'Q-2026-004', status: 'Abgelaufen', createdAt: '01.01.2026', expiresAt: '01.02.2026',
    buyer: 'Anna Schmidt', items: [{ sku: 'DEV-IPHONE-15', name: 'iPhone 15 Pro (DaaS)', qty: 10, unitPrice: 39.99, discount: 0 }],
    total: 399.90, notes: 'DaaS Anfrage - abgelaufen',
    history: [{ date: '01.01.2026', actor: 'Anna Schmidt', action: 'Angebot angefordert' }],
  },
];

// ── Requisition Lists ──
export const requisitionLists = [
  {
    id: 'rl-001', name: 'Abteilung IT Geräte', createdBy: 'Anna Schmidt', createdAt: '15.03.2026',
    items: [
      { sku: 'DEV-IPHONE-15', name: 'iPhone 15 Pro (DaaS)', qty: 5, unitPrice: 45.99 },
      { sku: 'MOB-CORP-L', name: 'Business Mobil L', qty: 5, unitPrice: 44.99 },
    ],
  },
  {
    id: 'rl-002', name: 'Vertrieb Standardausstattung', createdBy: 'Anna Schmidt', createdAt: '20.04.2026',
    items: [
      { sku: 'DEV-GALAXY-S24', name: 'Samsung Galaxy S24 (DaaS)', qty: 10, unitPrice: 29.99 },
      { sku: 'MOB-CORP-M', name: 'Business Mobil M', qty: 10, unitPrice: 34.99 },
    ],
  },
];

// ── Purchase Orders ──
export const purchaseOrders = [
  {
    id: 'po-001', poNumber: 'PO-2026-001', status: 'Genehmigt', createdAt: '01.05.2026',
    buyer: 'Anna Schmidt', total: 400.00, costCenter: 'IT-Abteilung',
    items: [{ sku: 'MOB-CORP-S', name: 'Business Mobil S', qty: 10, unitPrice: 24.99, lineTotal: 249.90 }],
    approvalHistory: [{ date: '01.05.2026', action: 'Automatisch genehmigt (< 500 €)' }],
  },
  {
    id: 'po-002', poNumber: 'PO-2026-002', status: 'Genehmigung ausstehend', createdAt: '10.05.2026',
    buyer: 'Anna Schmidt', total: 2249.50, costCenter: 'IT-Abteilung', requiredApprover: 'Abteilungsleiter',
    items: [{ sku: 'MOB-CORP-M', name: 'Business Mobil M', qty: 50, unitPrice: 34.99, lineTotal: 1749.50 }, { sku: 'IOT-SIM-100', name: 'IoT SIM Paket 100', qty: 100, unitPrice: 5.00, lineTotal: 500.00 }],
    approvalHistory: [{ date: '10.05.2026', action: 'Erstellt von Anna Schmidt' }],
  },
  {
    id: 'po-003', poNumber: 'PO-2026-003', status: 'Genehmigung ausstehend', createdAt: '12.05.2026',
    buyer: 'Anna Schmidt', total: 11997.00, costCenter: 'IT-Abteilung', requiredApprover: 'Geschäftsführer',
    items: [{ sku: 'DEV-IPHONE-15', name: 'iPhone 15 Pro (DaaS)', qty: 30, unitPrice: 399.90, lineTotal: 11997.00 }],
    approvalHistory: [{ date: '12.05.2026', action: 'Erstellt von Anna Schmidt' }],
  },
  {
    id: 'po-004', poNumber: 'PO-2026-004', status: 'Abgelehnt', createdAt: '08.05.2026',
    buyer: 'Anna Schmidt', total: 8500.00, costCenter: 'Vertrieb', requiredApprover: 'Geschäftsführer',
    items: [{ sku: 'MOB-CORP-XL', name: 'Business Mobil XL', qty: 100, unitPrice: 85.00, lineTotal: 8500.00 }],
    approvalHistory: [
      { date: '08.05.2026', action: 'Erstellt von Anna Schmidt' },
      { date: '09.05.2026', action: 'Abgelehnt von Peter Fischer: Budget überschritten' },
    ],
  },
];

// ── Orders ──
export const orders = [
  {
    id: 'ord-001', number: '100001', status: 'Abgeschlossen', createdAt: '15.03.2026',
    total: 1249.50, paymentMethod: 'Rechnung', costCenter: 'IT-Abteilung',
    items: [{ name: 'Business Mobil M', qty: 25, unitPrice: 34.99 }, { name: 'IoT SIM Paket 100', qty: 50, unitPrice: 4.49 }],
  },
  {
    id: 'ord-002', number: '100002', status: 'In Bearbeitung', createdAt: '20.04.2026',
    total: 4599.00, paymentMethod: 'SEPA-Lastschrift', costCenter: 'IT-Abteilung',
    items: [{ name: 'iPhone 15 Pro (DaaS)', qty: 10, unitPrice: 459.90 }],
  },
  {
    id: 'ord-003', number: '100003', status: 'Abgeschlossen', createdAt: '01.05.2026',
    total: 249.90, paymentMethod: 'Rechnung', costCenter: 'Vertrieb',
    items: [{ name: 'Business Mobil S', qty: 10, unitPrice: 24.99 }],
  },
  {
    id: 'ord-004', number: '100004', status: 'In Bearbeitung', createdAt: '15.05.2026',
    total: 799.80, paymentMethod: 'Vorkasse', costCenter: 'IT-Abteilung',
    items: [{ name: 'Business Internet 500', qty: 1, unitPrice: 79.99 }, { name: 'Business Festnetz Flat', qty: 2, unitPrice: 34.99 }],
  },
];

// ── Support Tickets ──
export const supportTickets = [
  {
    id: 'TK-2026-001', category: 'Technisch', subject: 'SIM-Karte aktivieren', status: 'Offen', createdAt: '18.05.2026', description: 'SIM-Karte sim-042 lässt sich nicht aktivieren.',
  },
  {
    id: 'TK-2026-002', category: 'Rechnungsanfrage', subject: 'Rechnung 100001 korrigieren', status: 'In Bearbeitung', createdAt: '16.05.2026', description: 'Falsche Kostenstelle auf Rechnung.',
  },
  {
    id: 'TK-2026-003', category: 'Vertrag', subject: 'Vertragsverlängerung', status: 'Geschlossen', createdAt: '10.05.2026', description: 'Vertrag ctr-003 soll verlängert werden.',
  },
];

// ── KPI Dashboard Data ──
export const dashboardKPIs = {
  activeLines: 40,
  totalLines: 50,
  monthlySpend: 4250.60,
  monthlySpendTrend: [3800, 3950, 4100, 4050, 4200, 4250.60],
  contractsActive: 2,
  contractsExpiring: 1,
  contractsExpired: 0,
  recentOrders: orders.slice(0, 3),
  pendingApprovals: 2,
};

// ── Documents ──
export const documents = [
  { id: 'doc-001', type: 'Rechnung', name: 'Rechnung RE-2026-001', date: '15.03.2026', size: '245 KB' },
  { id: 'doc-002', type: 'Rechnung', name: 'Rechnung RE-2026-002', date: '20.04.2026', size: '312 KB' },
  { id: 'doc-003', type: 'Vertrag', name: 'Rahmenvertrag RV-2025-001', date: '01.01.2025', size: '1.2 MB' },
  { id: 'doc-004', type: 'SLA', name: 'SLA Gold - Mobilfunk', date: '01.01.2025', size: '520 KB' },
  { id: 'doc-005', type: 'Rechnung', name: 'Rechnung RE-2026-003', date: '01.05.2026', size: '198 KB' },
];
