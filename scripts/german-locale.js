/**
 * German Localization Utilities for B2B Telco Storefront (de_DE)
 */

const DE_LOCALE = 'de-DE';

export function formatCurrency(value) {
  return new Intl.NumberFormat(DE_LOCALE, {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value, decimals = 2) {
  return new Intl.NumberFormat(DE_LOCALE, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatDate(date) {
  if (typeof date === 'string' && /^\d{2}\.\d{2}\.\d{4}$/.test(date)) return date;
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString(DE_LOCALE, { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export function calculateMwSt(bruttoAmount, rate = 19) {
  const netto = bruttoAmount / (1 + rate / 100);
  const mwst = bruttoAmount - netto;
  return { netto, mwst, brutto: bruttoAmount, rate };
}

export function formatTaxDisplay(amount, rate = 19) {
  const { netto, mwst, brutto } = calculateMwSt(amount, rate);
  return {
    brutto: formatCurrency(brutto),
    netto: formatCurrency(netto),
    mwst: formatCurrency(mwst),
    label: `inkl. ${rate}% MwSt`,
  };
}

// UI Labels
export const labels = {
  // Navigation
  nav: {
    home: 'Startseite',
    products: 'Produkte',
    cart: 'Warenkorb',
    checkout: 'Kasse',
    account: 'Mein Konto',
    logout: 'Abmelden',
  },
  // Company Account
  company: {
    registration: 'Firmenregistrierung',
    companyName: 'Firmenname',
    hrb: 'Handelsregisternummer (HRB)',
    ustIdNr: 'USt-IdNr',
    creditLimit: 'Kreditlimit',
    creditUsed: 'Genutzter Kredit',
    creditAvailable: 'Verfügbarer Kredit',
    status: 'Status',
    addresses: 'Adressen',
    costCenters: 'Kostenstellen',
  },
  // Address
  address: {
    strasse: 'Straße',
    plz: 'PLZ',
    ort: 'Ort',
    bundesland: 'Bundesland',
    land: 'Land',
  },
  // User
  user: {
    vorname: 'Vorname',
    nachname: 'Nachname',
    email: 'E-Mail-Adresse',
    telefon: 'Telefonnummer',
    rolle: 'Rolle',
    abteilung: 'Abteilung',
  },
  // Roles
  roles: {
    Admin: 'Administrator',
    Buyer: 'Einkäufer',
    Approver: 'Genehmiger',
    Viewer: 'Betrachter',
  },
  // Org Units
  orgUnits: {
    geschaeftsfuehrer: 'Geschäftsführer',
    abteilungsleiter: 'Abteilungsleiter',
    einkaufer: 'Einkäufer',
    mitarbeiter: 'Mitarbeiter',
  },
  // Products
  product: {
    price: 'Preis',
    brutto: 'Brutto',
    netto: 'Netto',
    mwst: 'MwSt',
    addToCart: 'In den Warenkorb',
    addToRequisition: 'Zur Bestellliste hinzufügen',
    requestQuote: 'Angebot anfordern',
    compare: 'Vergleichen',
    quantity: 'Menge',
    contractDuration: 'Vertragslaufzeit',
    slaLevel: 'SLA-Stufe',
    dataVolume: 'Datenvolumen',
  },
  // Checkout
  checkout: {
    title: 'Kasse',
    shippingAddress: 'Lieferadresse',
    billingAddress: 'Rechnungsadresse',
    paymentMethod: 'Zahlungsart',
    poNumber: 'Bestellnummer (PO)',
    costCenter: 'Kostenstelle',
    placeOrder: 'Bestellung aufgeben',
    sepaLastschrift: 'SEPA-Lastschrift',
    rechnung: 'Rechnung (Netto 30 Tage)',
    vorkasse: 'Vorkasse (Überweisung)',
    iban: 'IBAN',
    accountHolder: 'Kontoinhaber',
    orderTotal: 'Gesamtsumme',
  },
  // Quotes
  quote: {
    title: 'Angebote',
    requestQuote: 'Angebot anfordern',
    quoteNumber: 'Angebotsnummer',
    status: 'Status',
    expiresAt: 'Gültig bis',
    accept: 'Annehmen',
    reject: 'Ablehnen',
    counterOffer: 'Gegenangebot',
    convertToOrder: 'Bestellung aufgeben',
    downloadPdf: 'PDF herunterladen',
  },
  // Requisition Lists
  requisition: {
    title: 'Bestelllisten',
    createList: 'Neue Liste erstellen',
    listName: 'Listenname',
    addAllToCart: 'Alle in den Warenkorb',
  },
  // Purchase Orders
  purchaseOrder: {
    title: 'Bestellanforderungen',
    create: 'Neue Bestellanforderung',
    poNumber: 'PO-Nummer',
    approve: 'Genehmigen',
    reject: 'Ablehnen',
    comment: 'Kommentar',
    pendingApproval: 'Genehmigung ausstehend',
    approved: 'Genehmigt',
    rejected: 'Abgelehnt',
  },
  // Fleet
  fleet: {
    title: 'Flottenmanagement',
    activeSims: 'Aktive SIM-Karten',
    totalSims: 'Gesamt SIM-Karten',
    simNumber: 'Rufnummer',
    employee: 'Mitarbeiter',
    plan: 'Tarif',
    dataUsed: 'Datenverbrauch',
    contractEnd: 'Vertragsende',
  },
  // Portal
  portal: {
    dashboard: 'Übersicht',
    userManagement: 'Benutzerverwaltung',
    orderHistory: 'Bestellverlauf',
    supportTickets: 'Support-Tickets',
    documentCenter: 'Dokumentencenter',
    newUser: 'Neuen Benutzer anlegen',
    newTicket: 'Neues Ticket erstellen',
    export: 'Exportieren',
    exportPdf: 'Als PDF exportieren',
    exportCsv: 'Als CSV exportieren',
  },
  // Status
  status: {
    aktiv: 'Aktiv',
    gesperrt: 'Gesperrt',
    gekuendigt: 'Gekündigt',
    ausstehend: 'Ausstehend',
    inBearbeitung: 'In Bearbeitung',
    abgeschlossen: 'Abgeschlossen',
    offen: 'Offen',
    geschlossen: 'Geschlossen',
  },
  // Actions
  actions: {
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    search: 'Suchen',
    filter: 'Filtern',
    back: 'Zurück',
    next: 'Weiter',
    submit: 'Absenden',
    reorder: 'Erneut bestellen',
  },
  // Validation errors
  errors: {
    required: 'Pflichtfeld',
    invalidEmail: 'Ungültige E-Mail-Adresse',
    invalidIban: 'Ungültige IBAN',
    invalidUstIdNr: 'Ungültige USt-IdNr. Bitte überprüfen Sie Ihre Eingabe.',
    invalidPlz: 'Ungültige Postleitzahl',
    invalidPhone: 'Ungültige Telefonnummer',
    creditLimitExceeded: 'Kreditlimit überschritten',
    quoteExpired: 'Angebot abgelaufen',
    budgetExceeded: 'Budget überschritten',
  },
  // Legal
  legal: {
    impressum: 'Impressum',
    agb: 'AGB',
    datenschutz: 'Datenschutzerklärung',
    widerruf: 'Widerrufsbelehrung',
    cookie: 'Cookie-Einstellungen',
  },
};
