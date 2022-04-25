import fs from "fs";

export default function setSettings(name: string, value: string) {
  if (!fs.existsSync("./settings.json")) {
    fs.writeFileSync("./settings.json", "{ }");
  }
  const settings = JSON.parse(fs.readFileSync("./settings.json", "utf8"));
  settings[name] = value;
  fs.writeFileSync("./settings.json", JSON.stringify(settings));
}
