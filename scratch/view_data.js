const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "../dev.db");
const db = new Database(dbPath);

console.log("--- UomProfile ---");
const uoms = db.prepare("SELECT * FROM UomProfile").all();
console.log(uoms);

console.log("--- Currency ---");
const currencies = db.prepare("SELECT * FROM Currency").all();
console.log(currencies);

db.close();
