import Database from "better-sqlite3";
import path from "path";

const db = new Database(path.join(process.cwd(), "candidates.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS candidates (
  id INTEGER PRIMARY KEY,
  name TEXT,
  experience_years REAL,
  degree TEXT,
  score REAL,
  top TEXT
);
`);

export default db;
