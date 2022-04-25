import database from "./database";

export default function initTables() {
  database
    .prepare(
      `CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            value TEXT
        )`
    )
    .run();

  database
    .prepare(
      `CREATE TABLE IF NOT EXISTS devices (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            friendlyName TEXT,
            host TEXT,
            enabled INTEGER,
            volume FLOAT,
            prayers TEXT
            )`
    )
    .run();

  database
    .prepare(
      `CREATE TABLE IF NOT EXISTS prayer_times (id INTEGER PRIMARY KEY AUTOINCREMENT, date VARCHAR(32), fajr DATETIME, dhuhr DATETIME, asr DATETIME, maghrib DATETIME, isha DATETIME)`
    )
    .run();
}
