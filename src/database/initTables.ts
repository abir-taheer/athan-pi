import fs from "fs";

export default function initTables() {
  if (!fs.existsSync("./settings.json")) {
    fs.writeFileSync("./settings.json", "{ }");
  }

  if (!fs.existsSync("./devices.json")) {
    fs.writeFileSync("./devices.json", "[]");
  }

  if (!fs.existsSync("./prayerTimes.json")) {
    fs.writeFileSync("./prayerTimes.json", "[]");
  }

  console.log("initialized");
}
