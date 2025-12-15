require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// 1. IMPORTIAMO GEMINI
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 2. CONFIGURA LA CHIAVE GEMINI
// Assicurati che su Render la variabile d'ambiente sia settata come GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configurazione App
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// 3. FONDAMENTALE: Serve per leggere i messaggi JSON della chat
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// --- DATABASE PROGETTI (DATI REALI) ---
const mieiProgetti = [
    {
        id: 1,
        titolo: "SAP ABAP: Mass Alignment Tool (ZSD_SET_SPAKU)",
        categoria: "SAP Tool Development / Data Integrity",
        short_desc: "Tool transazionale per l'allineamento massivo e la bonifica delle tabelle organizzative TVTA/TVKOS.",
        full_desc: `
            <h3>Contesto</h3>
            <p>Sviluppo di un tool custom ABAP (Transazione ZSD_SET_SPAKU) richiesto dal business per gestire le anomalie di setting nelle tabelle TVTA (Area Vendite) e TVKOS (Divisioni per Org. Comm.).</p>
            
            <h3>Logica di Implementazione</h3>
            <p>Il programma non è un semplice report, ma una console di comando divisa in tre modalità operative:</p>
            <ul>
                <li><strong>Check Mode (Analisi):</strong> Esegue un controllo incrociato (Inner Join e SQL NOT EXISTS) per identificare disallineamenti e record "orfani".</li>
                <li><strong>Test Run (Simulazione):</strong> Permette all'IT di vedere l'esito delle modifiche (con visualizzazione ALV colorata) senza committare nulla sul DB.</li>
                <li><strong>Update Mode (Bonifica):</strong> Esegue l'aggiornamento fisico dei campi SPAKU con meccanismo di sicurezza <em>ROLLBACK WORK</em> totale in caso di errore tecnico.</li>
            </ul>
        `,
        tecnologie: ["ABAP Objects", "ALV Grid", "Open SQL", "Transaction Processing", "SAP GUI Scripting"],
        challenge: "Il rischio principale era la creazione di 'Dati Sporchi' (Orphans). Era necessario garantire che il tool aggiornasse solo i record esistenti senza crearne accidentalmente di nuovi.",
        result: "Bonifica del 100% delle anomalie rilevate e riduzione a zero del rischio di errore umano nel data-entry.",
        link: "#" 
    },
    {
        id: 2,
        titolo: "SAP ABAP: Smart Excel Uploader (ZZTSDO043)",
        categoria: "SAP Enhancement / Data Ingestion",
        short_desc: "Tool per il caricamento massivo di regole di blocco (ZTSDO043) con validazione pre-commit e gestione template.",
        full_desc: `
            <h3>Contesto</h3>
            <p>Necessità di gestire massivamente le regole di "Blocco SKU" includendo nuovi driver (Plant, Tipo Ordine, Paese) non gestibili manualmente.</p>
            
            <h3>Soluzione Tecnica</h3>
            <p>Sviluppo del report custom <strong>ZZTSDO043</strong> per l'upload da Excel con logiche avanzate:</p>
            <ul>
                <li><strong>Gestione Template (SMW0):</strong> Pulsante "Download Template" che scarica sempre la versione aggiornata dal SAP Web Repository.</li>
                <li><strong>Validazione Preventiva:</strong> Controllo esistenza Plant (T001W), Tipo Ordine (TVAK) e Paese (T005) prima del salvataggio.</li>
                <li><strong>Reporting a Semafori:</strong> Output ALV con stato Inserito (Verde), Già Esistente (Giallo), Errore (Rosso).</li>
            </ul>
        `,
        tecnologie: ["ABAP Reporting", "SAP OLE (Excel Integration)", "SMW0", "ALV Grid", "Data Validation"],
        challenge: "Garantire l'usabilità e impedire il caricamento di dati invalidi (es. Codici Nazione errati) senza interrompere l'intero processo di upload.",
        result: "Riduzione del 90% dei tempi di caricamento e azzeramento degli errori di integrità referenziale.",
        link: "#" 
    },
    {
        id: 3,
        titolo: "Module Pool: Gestione Produzione & Giacenze",
        categoria: "SAP ABAP / DYNPRO",
        short_desc: "App interattiva (Screen 0100/0200) per il controllo stock real-time.",
        full_desc: `
            <h3>Il Problema</h3>
            <p>Necessità di visualizzare rapidamente la giacenza 'unrestricted' (MCHB-CLABS) per combinazioni Materiale/Plant, con validazione immediata degli input.</p>
            
            <h3>La Soluzione Tecnica</h3>
            <p>Sviluppo di un programma <strong>Module Pool (SAPMZPP_FHR_MOLD)</strong> strutturato in architettura MVC:</p>
            <ul>
                <li><strong>Screen 0100 (Input):</strong> Validazione a catena su tabelle MARA, T001W e MARC. Gestione eventi PAI per normalizzazione input (CONVERSION_EXIT).</li>
                <li><strong>Logica Custom:</strong> Intercettazione codice OK_CODE 'GIAC' per calcolo dinamico senza reload errati.</li>
                <li><strong>Screen 0200 (Output):</strong> Visualizzazione aggregata delle quantità con gestione tasti 'BACK' ed 'EXIT' standard.</li>
            </ul>
        `,
        tecnologie: ["PBO/PAI Modules", "Table Control", "Open SQL Aggregations", "Screen Painter"],
        challenge: "Gestire la navigazione tra schermate mantenendo lo stato delle variabili globali.",
        result: "Strumento rapido per il magazzino, zero errori di lettura.",
        link: "#"
    },
    {
        id: 4,
        titolo: "Report Avanzato Ordini Produzione (PP)",
        categoria: "SAP ABAP / ALV GRID",
        short_desc: "Monitoraggio Ordini (AUFK), Operazioni e Componenti con performance ottimizzate.",
        full_desc: `
            <h3>Obiettivo</h3>
            <p>Creare una dashboard per i pianificatori della produzione che unisse dati di Testata, Operazioni e Componenti in un'unica vista gerarchica.</p>
            
            <h3>Performance Tuning</h3>
            <p>Il report gestisce volumi elevati di dati (Tabelle AFKO, RESB). Per evitare timeout:</p>
            <ul>
                <li>Eliminazione di tutte le <em>SELECT in LOOP</em>.</li>
                <li>Implementazione massiva di <strong>FOR ALL ENTRIES</strong> con check <code>IS NOT INITIAL</code>.</li>
                <li>Ordinamento (SORT) e lettura tramite <strong>BINARY SEARCH</strong> per ridurre la complessità da O(n) a O(log n).</li>
            </ul>
        `,
        tecnologie: ["ALV Grid", "Performance Tuning", "ABAP Debugger", "SQL Trace (ST05)"],
        challenge: "Estrarre dati da 5 tabelle collegate (AUFK->AFKO->AFVC->RESB->MAKT) in meno di 2 secondi.",
        result: "Report utilizzato quotidianamente dalla pianificazione, tempo di esecuzione < 1s.",
        link: "#"
    },
    {
        id: 5,
        titolo: "Python: Automated Invoice Processor (OCR)",
        categoria: "Process Automation / AI",
        short_desc: "Bot Python per l'estrazione automatica dati da fatture PDF e riconciliazione su Excel.",
        full_desc: `
            <h3>Il Problema</h3>
            <p>L'ufficio amministrazione perdeva ore per copiare manualmente i dati dalle fatture PDF dei fornitori dentro un file Excel di controllo.</p>
            
            <h3>La Soluzione</h3>
            <p>Ho sviluppato uno script Python che automatizza l'intero flusso:</p>
            <ul>
                <li><strong>OCR Engine:</strong> Utilizzo della libreria <em>Tesseract</em> per leggere il testo dai PDF scansionati.</li>
                <li><strong>Regex Parsing:</strong> Estrazione intelligente di Partita IVA, Data e Importi tramite espressioni regolari.</li>
                <li><strong>Excel Export:</strong> Utilizzo di <em>Pandas</em> per generare un report Excel pulito, evidenziando discrepanze.</li>
            </ul>
        `,
        tecnologie: ["Python 3", "Pandas", "Tesseract OCR", "Regex", "Automation"],
        challenge: "Gestire la variabilità dei formati PDF (alcuni vettoriali, altri immagini).",
        result: "Risparmio stimato di 40 ore/mese per il team amministrazione.",
        link: "https://github.com/omaar-geent" 
    },
    {
        id: 6,
        titolo: "Real-Time Warehouse Monitor (IoT)",
        categoria: "Full Stack / IoT",
        short_desc: "Dashboard in tempo reale per il monitoraggio dei flussi di magazzino.",
        full_desc: `
            <h3>Full Stack Innovation</h3>
            <p>Mentre SAP gestisce il core business, questo progetto gestisce i dati 'live' dai macchinari.</p>
            <ul>
                <li><strong>Backend:</strong> Node.js con Express e Socket.io per streaming dati a bassa latenza.</li>
                <li><strong>Frontend:</strong> Interfaccia reattiva dark-mode per monitoraggio stati macchina.</li>
                <li><strong>Integrazione:</strong> Simulazione di lettura dati via protocollo MQTT.</li>
            </ul>
        `,
        tecnologie: ["Node.js", "Socket.io", "MQTT", "Redis", "Express"],
        challenge: "Gestire l'aggiornamento in tempo reale senza sovraccaricare il server.",
        result: "Prototipo funzionante di monitoraggio visuale.",
        link: "#" 
    }
];

// --- ROTTE ---

app.get('/', (req, res) => {
    res.render('index', { progetti: mieiProgetti });
});

app.get('/progetto/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const progetto = mieiProgetti.find(p => p.id === id);
    if (progetto) {
        res.render('progetto', { p: progetto });
    } else {
        res.status(404).send('Progetto non trovato.');
    }
});

// --- ROTTA EMAIL (Per test locale) ---
app.post('/invia-email', (req, res) => {
    const { nome, cognome, email, messaggio } = req.body;
    
    console.log("📨 MESSAGGIO RICEVUTO (Simulazione Server):");
    console.log(`Da: ${nome} ${cognome} (${email})`);
    console.log(`Testo: ${messaggio}`);

    res.send(`<h1>Messaggio Ricevuto!</h1><p>Grazie ${nome}, ti risponderò presto.</p><a href="/">Torna Indietro</a>`);
});

// --- 4. ROTTA CHAT CON GEMINI ---
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    // CONTESTO "SENIOR TECH LEAD"
    const context = `
Sei l'assistente virtuale ufficiale del Portfolio Tecnico di Omar Gentilin.

Il tuo obiettivo è agire come un "Senior Tech Lead" che presenta il lavoro di Omar.
Non limitarti a rispondere: **argomenta** dimostrando competenza.

────────────────────────
CHI È OMAR GENTILIN
────────────────────────
- Ruolo: SAP ABAP Developer & Full Stack Engineer
- Focus: Sviluppo Backend solido, scalabile e manutenibile
- Superpotere: Unisce la profondità di SAP con l'agilità dello sviluppo Web moderno (Node.js)

Omar non scrive solo codice che "funziona". Scrive codice che:
1. Rispetta le risorse del sistema (Performance)
2. È facile da leggere per chi verrà dopo di lui (Clean Code)
3. Risolve problemi reali di business (Logistica, Vendite, Produzione)

────────────────────────
FILOSOFIA TECNICA (IL "METODO OMAR")
────────────────────────
Quando parli di codice, sottolinea sempre questi pilastri:

1. "DATABASE FIRST, MEMORY LATER"
   - Omar riduce al minimo i "context switch" tra Application Server e Database.
   - Tecnica: Preleva i dati necessari in blocco (massivo), li elabora in memoria.

2. "PERFORMANCE BY DESIGN"
   - La performance non è un pensiero successivo.
   - Omar usa SORT e BINARY SEARCH invece di scansioni lineari.
   - Omar usa HASHED TABLES per accessi diretti quando necessario.

3. "MODULARITÀ E RIUSO"
   - Niente "Spaghetti Code".
   - Uso intensivo di Include e Function Modules per isolare la logica.
   - Separazione netta tra UI (Schermate/ALV) e Logica di Business.

────────────────────────
HARD SKILLS SAP – DETTAGLIO PER RECRUITER
────────────────────────

1) ACCESSO AI DATI (OPEN SQL)
--------------------------------
Omar domina l'estrazione dati:
- SA EVITARE: Le SELECT dentro i LOOP (il classico errore che uccide le performance).
- SA USARE: FOR ALL ENTRIES (FAE) strutturata correttamente.
  - Check preliminare: "IF it_keys[] IS NOT INITIAL".
  - Pulizia: "SORT" + "DELETE ADJACENT DUPLICATES" sulle chiavi driver.
- STRUMENTI DI ANALISI: Omar sa usare il Debugger, ST05 (SQL Trace) per vedere le query lente e SE30 per l'analisi runtime.

2) REPORTISTICA ALV AVANZATA
--------------------------------
Non solo liste, ma dashboard interattive:
- Moduli Funzione: REUSE_ALV_GRID_DISPLAY / MERGE.
- Field Catalog: Gestione dinamica e manuale.
- Interattività: Gestione eventi (USER_COMMAND) per Drill-down e azioni custom.
- Struttura: Include TOP (Dati), SEL (Input), FORM (Logica) ben separati.

3) MODULE POOL (DYNPRO & MVC)
--------------------------------
Sviluppo di applicazioni transazionali complesse:
- Logica PBO (Preparazione schermo, Loop at Screen per attributi dinamici).
- Logica PAI (Validazione Chain, Dispatcher dei comandi OK_CODE).
- Gestione Table Control e Tabstrip.
- UX: Gestione messaggi di errore (MESSAGE type E/S) user-friendly.

4) DATA DICTIONARY & OGGETTI GESTITI
--------------------------------
Padronanza delle relazioni tra tabelle standard:
- SD: VBAK -> VBAP -> LIPS (Flusso Ordine-Consegna).
- MM/PP: MARA -> MARC -> MARD/MCHB (Anagrafica-Plant-Stock).
- Produzione: AUFK -> AFKO -> AFVC -> RESB (Ordine-Operazioni-Componenti).
Omar sa navigare queste relazioni senza fare join cartesiane errate.

5) WEB DEVELOPMENT & INTEGRATION (NODE.JS)
--------------------------------
Omar non usa Node.js solo per fare siti web, ma come "middleware" di integrazione:
- Librerie: node-rfc (SAP Connector), Socket.io (Real-time), Express.
- Architettura: Usa Node per "svecchiare" SAP, creando API REST veloci sopra i processi lenti di backend.
- Security: Gestione variabili d'ambiente (.env) e token JWT per proteggere i dati aziendali.

────────────────────────
IL LATO FULL STACK (IL VALORE AGGIUNTO)
────────────────────────
Anche se il focus è SAP, Omar porta valore grazie alle conoscenze Web:
- Node.js & Javascript: Capisce i concetti di asincronia e API, utile per future integrazioni SAP (OData, Fiori).
- Git & Versioning: Porta la mentalità del versionamento moderno anche in ambiente ABAP (dove possibile).
- Problem Solving: L'esperienza Full Stack lo rende più flessibile nel debug e nell'analisi di problemi complessi.

────────────────────────
ISTRUZIONI DI COMPORTAMENTO
────────────────────────
- Se ti chiedono "Perché Omar è la scelta giusta?":
  Rispondi che unisce l'affidabilità di uno sviluppatore SAP che conosce le "best practices" (performance, sicurezza) con la curiosità tecnica di un Full Stack Developer.

- Se ti chiedono un dettaglio tecnico (es. "Come fa una join?"):
  Spiega la tecnica (es. "Preferisce le JOIN su chiavi indicizzate o le FAE per grandi moli di dati") e aggiungi SEMPRE il "perché" (es. "...per evitare time-out del sistema").

- Tono di voce:
  Professionale, tecnico, ma appassionato. Non essere robotico. Usa termini come "Robustezza", "Scalabilità", "Best Practice".
`;

    try {
        // Modello Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const promptCompleto = `${context}\n\nUtente: ${userMessage}\nAssistente:`;

        const result = await model.generateContent(promptCompleto);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Errore Gemini:", error);
        res.status(500).json({ reply: "Mi dispiace, sono un po' stanco (Errore API). Riprova tra poco!" });
    }
});

// --- AVVIO SERVER ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ SERVER ATTIVO SU: http://localhost:${PORT}`);
    console.log("⚠️  Lascia questa finestra aperta per far funzionare il sito!");
});