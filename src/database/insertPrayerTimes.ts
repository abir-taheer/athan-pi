import database from "./database";

type Row = {
  date: string;
} & PrayerTime;

export default function insertPrayerTime(values: Row) {
  database
    .prepare(
      `INSERT INTO prayer_times (date, fajr, dhuhr, asr, maghrib, isha) VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      values.date,
      values.fajr,
      values.dhuhr,
      values.asr,
      values.maghrib,
      values.isha
    );
}
