import getPrayerTimesFromServer from "../database/getPrayerTimesFromServer";
import fs from "fs";

export default async function getPrayerTimes(
  date: Date,
  city: string
): Promise<PrayerTime> {
  const allTimes = fs.readFileSync("./prayerTimes.json", "utf8");
  const times = JSON.parse(allTimes);
  const timesForDate = times.find(
    (time: any) => time.date === date.toDateString()
  );

  if (timesForDate) {
    return {
      date: timesForDate.date,
      fajr: new Date(timesForDate.fajr),
      dhuhr: new Date(timesForDate.dhuhr),
      asr: new Date(timesForDate.asr),
      maghrib: new Date(timesForDate.maghrib),
      isha: new Date(timesForDate.isha),
    };
  }

  const fromServer = await getPrayerTimesFromServer(date, city);

  return fromServer;
}
