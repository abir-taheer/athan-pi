import database from "../database/database";
import getPrayerTimesFromServer from "../database/getPrayerTimesFromServer";

export default async function getPrayerTimes(
  date: Date,
  city: string
): Promise<PrayerTime> {
  const databaseTimes: PrayerTime[] = database
    .prepare(`SELECT * FROM prayer_times WHERE city = ? AND date = ?`)
    .all(city, date.toDateString());

  if (databaseTimes.length > 0) {
    return databaseTimes[0];
  }

  const fromServer = await getPrayerTimesFromServer(date, city);

  return fromServer.times;
}
