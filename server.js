require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// 1. IMPORTIAMO GEMINI
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

// 2. CONFIGURA LA CHIAVE GEMINI

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Configurazione App
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static('public'));

// 3. FONDAMENTALE: Serve per leggere i messaggi JSON della chat
app.use(express.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

// --- DATABASE PROGETTI ---
const mieiProgetti = [
    {
        id: 1,
        titolo: "SAP ABAP: Mass Alignment Tool (ZSD_SET_SPAKU)",
        categoria: "SAP Tool Development / Data Integrity",
        short_desc: "Tool transazionale per l'allineamento massivo e la bonifica delle tabelle organizzative TVTA/TVKOS.",
        full_desc: `
            <strong>Contesto:</strong> Sviluppo di un tool custom ABAP (Transazione ZSD_SET_SPAKU) richiesto dal business per gestire le anomalie di setting nelle tabelle TVTA (Area Vendite) e TVKOS (Divisioni per Org. Comm.).<br><br>
            <strong>Logica di Implementazione:</strong><br>
            Il programma non è un semplice report, ma una console di comando divisa in tre modalità operative:
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
            <strong>Contesto:</strong> Necessità di gestire massivamente le regole di "Blocco SKU" includendo nuovi driver (Plant, Tipo Ordine, Paese) non gestibili manualmente.<br><br>
            <strong>Soluzione Tecnica:</strong><br>
            Sviluppo del report custom <strong>ZZTSDO043</strong> per l'upload da Excel con logiche avanzate:
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
        titolo: "Corporate Web Portfolio",
        categoria: "Full Stack Web",
        short_desc: "Piattaforma web personale sviluppata con architettura MVC e AI Integration.",
        full_desc: `
            <strong>Descrizione:</strong> Applicazione web dinamica realizzata con Node.js ed Express. Il design è focalizzato sulla UX/UI moderna (stile 'Dark Mode Enterprise'), con gestione dinamica dei contenuti tramite rendering server-side (EJS).<br><br>
            <strong>AI Integration:</strong> Integrazione di Google Gemini tramite API per fornire un assistente virtuale intelligente capace di rispondere a domande sul profilo professionale.
        `,
        tecnologie: ["Node.js", "Express", "Google Gemini API", "EJS", "CSS3 Modern"],
        challenge: "Integrare un modello LLM (Large Language Model) in un contesto web mantenendo le performance elevate e i costi contenuti.",
        result: "Un sito performante, SEO-friendly e dotato di un assistente AI attivo 24/7.",
        link: "https://github.com/omaar-geent"
    },
    {
        id: 4,
        titolo: "Network Security Scanner",
        categoria: "Cybersecurity / Python Scripting",
        short_desc: "Tool software multithread per l'analisi delle vulnerabilità di rete e port scanning.",
        full_desc: `
            <strong>Obiettivo:</strong> Creare uno strumento leggero da riga di comando per l'audit rapido della sicurezza di reti locali, senza dipendere da tool pesanti come Nmap.<br><br>
            <strong>Funzionalità:</strong>
            <ul>
                <li><strong>Port Scanning Multithread:</strong> Scansione parallela delle prime 1024 porte TCP per velocizzare l'esecuzione.</li>
                <li><strong>Service Banner Grabbing:</strong> Tentativo di connessione ai servizi aperti per identificare versione e tipo di software in esecuzione (es. Apache, SSH).</li>
                <li><strong>Report Generation:</strong> Salvataggio automatico dei risultati in formato JSON o TXT per analisi successive.</li>
            </ul>
        `,
        tecnologie: ["Python 3", "Socket Library", "Threading", "TCP/IP Protocol"],
        challenge: "Ottimizzare la velocità di scansione evitando falsi positivi dovuti a timeout di rete troppo brevi.",
        result: "Scanner capace di mappare una sottorete /24 in meno di 60 secondi.",
        link: "https://github.com/omaar-geent"
    },
    {
        id: 5,
        titolo: "Python: Automated Invoice Processor (OCR)",
        categoria: "Process Automation / AI",
        short_desc: "Bot Python per l'estrazione automatica dati da fatture PDF e riconciliazione su Excel.",
        full_desc: `
            <strong>Il Problema:</strong> L'ufficio amministrazione perdeva ore per copiare manualmente i dati dalle fatture PDF dei fornitori dentro un file Excel di controllo.<br><br>
            <strong>La Soluzione:</strong>
            Ho sviluppato uno script Python che automatizza l'intero flusso:
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
        categoria: "IoT / Real-Time Web / SAP Integration",
        short_desc: "Dashboard in tempo reale per il monitoraggio dei flussi di magazzino e tracking muletti.",
        full_desc: `
            <strong>Descrizione:</strong>
            Sistema sperimentale per visualizzare in tempo reale lo stato del magazzino su una web dashboard, collegando il mondo fisico (sensori) con il gestionale.<br><br>
            <strong>Architettura:</strong>
            <ul>
                <li><strong>Frontend:</strong> Dashboard interattiva che mostra la posizione dei carrelli elevatori e lo stato delle baie di carico.</li>
                <li><strong>Backend:</strong> Server Node.js che riceve dati via protocollo <em>MQTT</em> dai sensori simulati sui muletti.</li>
                <li><strong>WebSockets (Socket.io):</strong> Push dei dati al browser senza necessità di refresh pagina (zero-latency).</li>
                <li><strong>SAP RFC:</strong> Integrazione asincrona per leggere le giacenze materiali in tempo reale da SAP MM.</li>
            </ul>
        `,
        tecnologie: ["Node.js", "Socket.io (WebSockets)", "MQTT", "Redis", "SAP RFC"],
        challenge: "Gestire l'elevata frequenza di aggiornamento dei dati di posizione (10 msg/sec) senza sovraccaricare il server.",
        result: "Prototipo funzionante presentato come Proof of Concept per la digitalizzazione della logistica interna.",
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

    const context = `
        Sei l'assistente virtuale del sito web di Omar Gentilin.
        Il tuo compito è rispondere alle domande dei visitatori come se fossi Omar.
        
        INFORMAZIONI SU OMAR:
        - Ruolo: SAP ABAP Specialist & Full Stack Developer.
        - Esperienza SAP: Creazione report ALV, BAPI custom, automazione ordini (Progetto Z_SALES_AUTO), Smartforms.
        - Esperienza Web: Node.js, Express, EJS, creazione portfolio interattivi, CSS Moderno.
        - Esperienza Security: Python scripting, Network Scanning con socket, uso di Kali Linux (base).
        - Soft Skills: Problem solving, capacità di unire il mondo Enterprise (SAP) con il Web moderno.
        - Contatti: Consiglia di usare il form nella home page o LinkedIn.
        
        REGOLE:
        - Rispondi in modo breve (massimo 3 frasi), professionale e cordiale.
        - Se ti chiedono "Chi sei?", rispondi che sei l'AI Assistant di Omar basato su Google Gemini.
        - Se non sai una cosa, dì: "Non ho questa info specifica, contattami via mail!".
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const promptCompleto = `${context}\n\nUtente: ${userMessage}\nAssistente:`;

        const result = await model.generateContent(promptCompleto);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Errore Gemini:", error);
        res.status(500).json({ reply: "Mi dispiace, sono un po' stanco. Riprova tra poco!" });
    }
});

// --- AVVIO SERVER (Con trucco anti-chiusura) ---
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`✅ SERVER ATTIVO SU: http://localhost:${PORT}`);
    console.log("⚠️  Lascia questa finestra aperta per far funzionare il sito!");
});

// Questo impedisce al processo di chiudersi da solo
setInterval(() => {}, 1000);