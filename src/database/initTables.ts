import database from "./database";

export default function initTables() {
  database
    .prepare(
      `CREATE TABLE IF NOT EXISTS prayer_times (date VARCHAR(32), fajr DATETIME, dhuhr DATETIME, asr DATETIME, maghrib DATETIME, isha DATETIME)`
    )
    .run();
}
