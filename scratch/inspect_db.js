const Database = require("better-sqlite3");
const path = require("path");

const paths = [
  path.resolve(__dirname, "../prisma/dev.db"),
  path.resolve(__dirname, "../dev.db")
];

for (const dbPath of paths) {
  console.log("\n====================================");
  console.log("Database path:", dbPath);
  try {
    const db = new Database(dbPath);
    const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
    console.log("Tables in database:", tables.map(t => t.name));
    for (const table of tables) {
      if (table.name.startsWith("_prisma")) continue;
      const count = db.prepare(`SELECT count(*) as count FROM "${table.name}"`).get();
      console.log(`Table ${table.name}: ${count.count} rows`);
      if (count.count > 0) {
        const sample = db.prepare(`SELECT * FROM "${table.name}" LIMIT 2`).all();
        console.log(`  Sample:`, sample);
      }
    }
    db.close();
  } catch (e) {
    console.log("Error opening/reading database:", e.message);
  }
}
