import fs from "fs";
import path from "node:path";

export const devicesJsonPath = path.resolve(__dirname, "../", "devices.json");
export const settingsJsonPath = path.resolve(__dirname, "../", "settings.json");
export const prayerTimesJsonPath = path.resolve(
  __dirname,
  "../",
  "prayerTimes.json",
);

export default function initTables() {
  if (!fs.existsSync(settingsJsonPath)) {
    fs.writeFileSync(settingsJsonPath, "{ }");
  }

  if (!fs.existsSync(devicesJsonPath)) {
    fs.writeFileSync(devicesJsonPath, "[]");
  }

  if (!fs.existsSync(prayerTimesJsonPath)) {
    fs.writeFileSync(prayerTimesJsonPath, "[]");
  }

  console.log("initialized");
}
