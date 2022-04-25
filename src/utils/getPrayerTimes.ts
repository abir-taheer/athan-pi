import database from "../database/database";
import getPrayerTimesFromServer from "../database/getPrayerTimesFromServer";

export default async function getPrayerTimes(
  date: Date,
  city: string
): Promise<PrayerTime> {
  const databaseTimes: PrayerTime[] = database
    .prepare(`SELECT * FROM prayer_times WHERE date = ?`)
    .all(date.toDateString());

  if (databaseTimes.length > 0) {
    return {
      date: databaseTimes[0].date,
      fajr: new Date(databaseTimes[0].fajr),
      dhuhr: new Date(databaseTimes[0].dhuhr),
      asr: new Date(databaseTimes[0].asr),
      maghrib: new Date(databaseTimes[0].maghrib),
      isha: new Date(databaseTimes[0].isha),
    };
  }

  const fromServer = await getPrayerTimesFromServer(date, city);

  return fromServer;
}
