const Database = require("better-sqlite3");
const path = require("path");

const dbPath = path.resolve(__dirname, "../dev.db");
const db = new Database(dbPath);

console.log("Clearing UomProfile table...");
const result = db.prepare("DELETE FROM UomProfile").run();
console.log(`Successfully deleted ${result.changes} rows from UomProfile.`);

db.close();
