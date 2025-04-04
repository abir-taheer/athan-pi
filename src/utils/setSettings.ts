import fs from "fs";
import { settingsJsonPath } from "../database/initTables";

export default function setSettings(name: string, value: string) {
  if (!fs.existsSync(settingsJsonPath)) {
    fs.writeFileSync(settingsJsonPath, "{ }");
  }
  const settings = JSON.parse(fs.readFileSync(settingsJsonPath, "utf8"));
  settings[name] = value;
  fs.writeFileSync(settingsJsonPath, JSON.stringify(settings));
}
