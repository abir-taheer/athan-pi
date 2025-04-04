import fs from "fs";
import { settingsJsonPath } from "../database/initTables";

export default function getSettings() {
  if (!fs.existsSync(settingsJsonPath)) {
    fs.writeFileSync(settingsJsonPath, "{ }");
  }
  const settings = JSON.parse(fs.readFileSync(settingsJsonPath, "utf8"));
  return settings;
}
