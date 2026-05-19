import { labels } from '../../scripts/german-locale.js';

const legalContent = {
  impressum: `
    <h2>Impressum</h2>
    <h3>Angaben gemäß § 5 TMG</h3>
    <p><strong>CitiSignal Telekommunikation GmbH</strong><br>
    Musterstraße 123<br>10115 Berlin<br>Deutschland</p>
    <h3>Vertreten durch</h3>
    <p>Max Mustermann, Geschäftsführer</p>
    <h3>Kontakt</h3>
    <p>Telefon: +49 30 123456-0<br>E-Mail: info@citisignal.de</p>
    <h3>Registereintrag</h3>
    <p>Registergericht: Amtsgericht Berlin-Charlottenburg<br>
    Registernummer: HRB 123456</p>
    <h3>Umsatzsteuer-ID</h3>
    <p>USt-IdNr. gemäß § 27a UStG: DE123456789</p>
    <h3>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
    <p>Max Mustermann<br>Musterstraße 123<br>10115 Berlin</p>
    <h3>Streitschlichtung</h3>
    <p>Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:
    <a href="https://ec.europa.eu/consumers/odr" target="_blank">https://ec.europa.eu/consumers/odr</a>.</p>`,

  agb: `
    <h2>Allgemeine Geschäftsbedingungen (AGB)</h2>
    <h3>§ 1 Geltungsbereich</h3>
    <p>Diese AGB gelten für alle Verträge zwischen der CitiSignal Telekommunikation GmbH (nachfolgend „Anbieter") und
    dem Geschäftskunden (nachfolgend „Kunde") über die auf der B2B-Plattform angebotenen Produkte und Dienstleistungen.</p>
    <h3>§ 2 Vertragsschluss</h3>
    <p>Die Darstellung der Produkte stellt kein rechtlich bindendes Angebot dar. Durch die Bestellung gibt der Kunde
    ein bindendes Angebot ab. Die Annahme erfolgt durch Auftragsbestätigung per E-Mail.</p>
    <h3>§ 3 Preise und Zahlungsbedingungen</h3>
    <p>Alle Preise verstehen sich in Euro (EUR) zzgl. der gesetzlichen Mehrwertsteuer (19% bzw. 7%).
    Zahlungsmethoden: SEPA-Lastschrift, Rechnung (Zahlungsziel 30 Tage netto), Vorkasse.</p>
    <h3>§ 4 Vertragslaufzeit und Kündigung</h3>
    <p>Mobilfunkverträge haben eine Mindestlaufzeit gemäß Tarifbeschreibung (12, 24 oder 36 Monate).
    Die Kündigungsfrist beträgt 3 Monate zum Vertragsende. Ohne fristgerechte Kündigung verlängert
    sich der Vertrag um jeweils 12 Monate.</p>
    <h3>§ 5 Haftung</h3>
    <p>Die Haftung richtet sich nach den gesetzlichen Bestimmungen. Für leichte Fahrlässigkeit haftet der Anbieter
    nur bei Verletzung wesentlicher Vertragspflichten.</p>
    <h3>§ 6 Datenschutz</h3>
    <p>Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung und den Bestimmungen
    der DSGVO/BDSG.</p>
    <h3>§ 7 Schlussbestimmungen</h3>
    <p>Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin.</p>`,

  datenschutz: `
    <h2>Datenschutzerklärung</h2>
    <h3>1. Verantwortlicher</h3>
    <p>CitiSignal Telekommunikation GmbH, Musterstraße 123, 10115 Berlin<br>
    Datenschutzbeauftragter: datenschutz@citisignal.de</p>
    <h3>2. Erhebung und Verarbeitung personenbezogener Daten</h3>
    <p>Wir verarbeiten Ihre Daten gemäß Art. 6 Abs. 1 DSGVO für die Vertragserfüllung (lit. b),
    zur Erfüllung rechtlicher Verpflichtungen (lit. c) und auf Basis berechtigter Interessen (lit. f).</p>
    <h3>3. Cookies und Tracking (§ 25 TTDSG)</h3>
    <p>Wir setzen technisch notwendige Cookies ohne Einwilligung ein. Marketing-Cookies und Tracking werden
    erst nach ausdrücklicher Einwilligung über unseren Cookie-Banner aktiviert.</p>
    <h3>4. Ihre Rechte (Art. 15-21 DSGVO)</h3>
    <ul>
      <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
      <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
      <li>Recht auf Löschung (Art. 17 DSGVO)</li>
      <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
      <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
      <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
    </ul>
    <h3>5. Datensicherheit</h3>
    <p>Wir setzen TLS 1.3, Content-Security-Policy Headers und XSS-Schutz ein.</p>
    <h3>6. Aufsichtsbehörde</h3>
    <p>Berliner Beauftragte für Datenschutz und Informationsfreiheit, Friedrichstr. 219, 10969 Berlin</p>`,

  widerruf: `
    <h2>Widerrufsbelehrung</h2>
    <h3>Widerrufsrecht</h3>
    <p>Als Verbraucher haben Sie das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.
    Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
    <p><strong>Hinweis für B2B-Kunden:</strong> Das Widerrufsrecht gilt gemäß § 312g BGB nur für Verbraucher.
    Geschäftskunden sind vom Widerrufsrecht ausgenommen, sofern der Vertrag im Rahmen ihrer gewerblichen oder
    selbständigen beruflichen Tätigkeit geschlossen wird.</p>
    <h3>Folgen des Widerrufs</h3>
    <p>Im Falle eines wirksamen Widerrufs sind die beiderseits empfangenen Leistungen zurückzugewähren.</p>`,

  cookie: `
    <h2>Cookie-Einstellungen</h2>
    <div class="cookie-banner" id="cookieBanner">
      <p>Wir verwenden Cookies und ähnliche Technologien gemäß § 25 TTDSG und Art. 6 DSGVO.</p>
      <div class="cookie-categories">
        <label class="cookie-cat"><input type="checkbox" checked disabled> <strong>Notwendig</strong> – Technisch erforderliche Cookies</label>
        <label class="cookie-cat"><input type="checkbox" id="cookieAnalytics"> <strong>Analyse</strong> – Statistiken und Nutzungsverhalten</label>
        <label class="cookie-cat"><input type="checkbox" id="cookieMarketing"> <strong>Marketing</strong> – Personalisierte Werbung</label>
      </div>
      <div class="cookie-actions">
        <button class="btn-primary" id="btnAcceptAll">Alle akzeptieren</button>
        <button class="btn-secondary" id="btnAcceptSelected">Auswahl bestätigen</button>
        <button class="btn-secondary" id="btnRejectAll">Nur notwendige</button>
      </div>
    </div>`,
};

export default async function decorate(block) {
  const pages = Object.keys(legalContent);

  block.innerHTML = `
    <div class="b2b-legal">
      <nav class="legal-nav">
        ${pages.map((p, i) => `<button class="legal-tab ${i === 0 ? 'active' : ''}" data-page="${p}">${labels.legal[p] || p}</button>`).join('')}
      </nav>
      <div class="legal-content" id="legalContent">
        ${legalContent[pages[0]]}
      </div>
    </div>`;

  block.querySelectorAll('.legal-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      block.querySelectorAll('.legal-tab').forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      block.querySelector('#legalContent').innerHTML = legalContent[tab.dataset.page];
      // Reattach cookie handlers if cookie page
      if (tab.dataset.page === 'cookie') {
        block.querySelector('#btnAcceptAll')?.addEventListener('click', () => {
          block.querySelector('#cookieAnalytics').checked = true;
          block.querySelector('#cookieMarketing').checked = true;
          block.querySelector('#cookieBanner').innerHTML = '<p class="msg-success">Alle Cookies akzeptiert.</p>';
        });
        block.querySelector('#btnRejectAll')?.addEventListener('click', () => {
          block.querySelector('#cookieBanner').innerHTML = '<p class="msg-success">Nur notwendige Cookies aktiviert. Keine Tracking-Cookies gesetzt.</p>';
        });
        block.querySelector('#btnAcceptSelected')?.addEventListener('click', () => {
          block.querySelector('#cookieBanner').innerHTML = '<p class="msg-success">Cookie-Einstellungen gespeichert.</p>';
        });
      }
    });
  });
}
