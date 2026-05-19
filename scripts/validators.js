/**
 * Validation utilities for German B2B Telco Storefront
 */

export function validateIBAN(iban) {
  const cleaned = iban.replace(/\s/g, '').toUpperCase();
  if (!/^DE\d{20}$/.test(cleaned)) return { valid: false, error: 'IBAN muss mit DE beginnen und 22 Zeichen lang sein.' };
  const rearranged = cleaned.slice(4) + cleaned.slice(0, 4);
  const numericStr = rearranged.replace(/[A-Z]/g, (ch) => ch.charCodeAt(0) - 55);
  let remainder = '';
  for (const digit of numericStr) {
    remainder = String(Number(remainder + digit) % 97);
  }
  if (Number(remainder) !== 1) return { valid: false, error: 'Ungültige IBAN – Prüfziffer fehlerhaft.' };
  return { valid: true, error: null };
}

export function validateUstIdNr(ustIdNr) {
  const cleaned = ustIdNr.replace(/\s/g, '').toUpperCase();
  if (!/^DE\d{9}$/.test(cleaned)) return { valid: false, error: 'USt-IdNr muss mit DE beginnen und 11 Zeichen lang sein (DE + 9 Ziffern).' };
  return { valid: true, error: null };
}

export async function validateVIES(ustIdNr) {
  const result = validateUstIdNr(ustIdNr);
  if (!result.valid) return result;
  // Simulate VIES API call – in production this would call the EU VIES SOAP/REST service
  const knownValid = ['DE123456789', 'DE987654321'];
  if (knownValid.includes(ustIdNr.replace(/\s/g, '').toUpperCase())) {
    return { valid: true, error: null, companyName: 'VIES-verifiziertes Unternehmen' };
  }
  return { valid: false, error: 'USt-IdNr konnte nicht über VIES verifiziert werden.' };
}

export function validatePLZ(plz) {
  if (!/^\d{5}$/.test(plz)) return { valid: false, error: 'PLZ muss genau 5 Ziffern enthalten.' };
  return { valid: true, error: null };
}

export function validatePhoneDE(phone) {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  if (!/^\+49\d{6,13}$/.test(cleaned) && !/^0\d{6,13}$/.test(cleaned)) {
    return { valid: false, error: 'Ungültige Telefonnummer. Format: +49... oder 0...' };
  }
  return { valid: true, error: null };
}

export function validateEmail(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { valid: false, error: 'Ungültige E-Mail-Adresse.' };
  }
  return { valid: true, error: null };
}

export function validateHRB(hrb) {
  const cleaned = hrb.replace(/\s/g, '').toUpperCase();
  if (!/^HRB\d+$/.test(cleaned)) {
    return { valid: false, error: 'HRB-Nummer muss mit HRB beginnen, gefolgt von Ziffern.' };
  }
  return { valid: true, error: null };
}

export function validateRequired(value, fieldLabel) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { valid: false, error: `${fieldLabel} ist ein Pflichtfeld.` };
  }
  return { valid: true, error: null };
}

export function getApprovalLevel(orderTotal) {
  if (orderTotal < 500) return { level: 'auto', label: 'Automatisch genehmigt' };
  if (orderTotal <= 5000) return { level: 'abteilungsleiter', label: 'Genehmigung durch Abteilungsleiter erforderlich' };
  return { level: 'geschaeftsfuehrer', label: 'Genehmigung durch Geschäftsführer erforderlich' };
}

export function validateCSVUpload(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { valid: false, errors: ['CSV muss mindestens eine Kopfzeile und eine Datenzeile enthalten.'], rows: [] };
  const header = lines[0].split(/[;,]/).map((h) => h.trim().toLowerCase());
  const requiredCols = ['sku', 'menge'];
  const missing = requiredCols.filter((c) => !header.includes(c));
  if (missing.length > 0) return { valid: false, errors: [`Fehlende Spalten: ${missing.join(', ')}`], rows: [] };
  const rows = [];
  const errors = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = lines[i].split(/[;,]/).map((c) => c.trim());
    const row = {};
    header.forEach((h, idx) => { row[h] = cols[idx] || ''; });
    if (!row.sku) { errors.push(`Zeile ${i + 1}: SKU fehlt.`); }
    else if (!row.menge || Number.isNaN(Number(row.menge)) || Number(row.menge) < 1) { errors.push(`Zeile ${i + 1}: Ungültige Menge.`); }
    else rows.push({ ...row, menge: Number(row.menge), lineNumber: i + 1 });
  }
  return { valid: errors.length === 0, errors, rows };
}
