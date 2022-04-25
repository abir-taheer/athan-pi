import ChromecastAPI from "chromecast-api";
import database from "../database/database";
import getDevices from "../database/getDevices";
import getPrayerTimes from "./getPrayerTimes";

const prayers: Prayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function athanLoop() {
  const citySetting = await database
    .prepare(`SELECT value FROM settings WHERE name = ?`)
    .get("city");

  if (!citySetting) {
    setTimeout(athanLoop, 1000 * 5);
    return;
  }

  const date = new Date();

  const prayerTimes = await getPrayerTimes(date, citySetting.value);

  const currentPrayer = prayers.find((prayer) => {
    const prayerTime = prayerTimes[prayer];
    const timeDifference = prayerTime.getTime() - date.getTime();
    return timeDifference < 0 && timeDifference > -60000;
  });

  if (!currentPrayer) {
    setTimeout(athanLoop, 1000 * 5);
    return;
  }

  const devices = getDevices();

  const deviceNameMap: { [key: string]: DatabaseDevice } = {};

  devices.forEach((device) => {
    deviceNameMap[device.name] = device;
  });

  if (devices.length === 0) {
    setTimeout(athanLoop, 1000 * 5);
    return;
  }

  const athanUrl =
    currentPrayer === "fajr"
      ? "https://res.cloudinary.com/abir-taheer/video/upload/v1650888485/athan/fajr.mp3"
      : "https://res.cloudinary.com/abir-taheer/video/upload/v1650888536/athan/regular.mp3";

  const duaAfterUrl =
    "https://res.cloudinary.com/abir-taheer/video/upload/v1650890068/athan/after_athan.mp3";

  const chromecast = new ChromecastAPI();
  chromecast.on("device", (device) => {
    if (
      !deviceNameMap[device.name] ||
      !deviceNameMap[device.name].enabled ||
      !deviceNameMap[device.name].prayers.includes(currentPrayer)
    ) {
      return;
    }

    device.setVolume(deviceNameMap[device.name].volume, () => {
      device.play(athanUrl, (err: any) => {
        let played = false;
        if (!err) {
          device.on("finished", () => {
            if (played) {
              return;
            }

            played = true;

            device.play(duaAfterUrl);
          });
        }
      });
    });
  });

  await sleep(1000 * 60 * 5);

  setTimeout(athanLoop, 1000 * 5);
}
