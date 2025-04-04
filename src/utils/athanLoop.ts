import ChromecastAPI from "chromecast-api";
import getDevices from "../database/getDevices";
import getPrayerTimes from "./getPrayerTimes";
import getSettings from "./getSettings";

const prayers: Prayer[] = ["fajr", "dhuhr", "asr", "maghrib", "isha"];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function athanLoop() {
  const citySetting = getSettings().city;

  if (!citySetting) {
    setTimeout(athanLoop, 1000 * 5);
    return;
  }

  const date = new Date();

  const prayerTimes = await getPrayerTimes(date, citySetting);

  const currentPrayer = prayers.find((prayer) => {
    const prayerTime = new Date(prayerTimes[prayer]);
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
  const discoveredDevices: ChromecastDevice[] = [];

  const allEnabledDevices = devices.filter(
    (device) => device.enabled && device.prayers.includes(currentPrayer),
  );

  const devicesLeftToDiscoverSet = new Set(
    allEnabledDevices.map((device) => device.name),
  );

  await new Promise((resolve) => {
    // max of 10 seconds to discover devices
    setTimeout(resolve, 1000 * 10);

    chromecast.on("device", (device) => {
      if (
        !deviceNameMap[device.name] ||
        !deviceNameMap[device.name].enabled ||
        !deviceNameMap[device.name].prayers.includes(currentPrayer)
      ) {
        return;
      }

      discoveredDevices.push(device);
      devicesLeftToDiscoverSet.delete(device.name);

      if (devicesLeftToDiscoverSet.size === 0) {
        resolve(true);
      }
    });

    discoveredDevices.forEach((device) => {
      device.setVolume(Number(deviceNameMap[device.name].volume), () => {
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
  });

  setTimeout(athanLoop, 1000);
}
