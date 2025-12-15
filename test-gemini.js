// INCOLLA QUI LA TUA CHIAVE
const API_KEY = "AIzaSyAxPfiWQLEE7kC5NYwp8uQrrSoG4R_W9lg"; 

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("🔍 Sto chiedendo a Google quali modelli hai a disposizione...");

fetch(url)
  .then(response => response.json())
  .then(data => {
    if (data.models) {
      console.log("\n✅ MODELLI TROVATI:");
      data.models.forEach(m => {
          // Mostriamo solo quelli che generano testo (i "generateContent")
          if(m.supportedGenerationMethods.includes("generateContent")) {
              console.log(" - " + m.name); // Esempio: models/gemini-1.5-flash
          }
      });
      console.log("\nCOPIA UNO DI QUESTI NOMI (senza 'models/') NEL TUO SERVER.JS!");
    } else {
      console.log("\n❌ ERRORE: Google ha risposto questo:", data);
    }
  })
  .catch(err => console.error("Errore di rete:", err));