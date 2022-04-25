import fs from "fs";

export default function getSettings() {
  if (!fs.existsSync("./settings.json")) {
    fs.writeFileSync("./settings.json", "{ }");
  }
  const settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
  return settings;
}
