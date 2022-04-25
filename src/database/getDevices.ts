import fs from "fs";

export default function getDevices(): DatabaseDevice[] {
  const devices = JSON.parse(fs.readFileSync("./devices.json", "utf8"));

  return devices.map((row: any) => {
    return {
      id: row.id,
      name: row.name,
      friendlyName: row.friendlyName,
      host: row.host,
      enabled: row.enabled,
      volume: row.volume,
      prayers: row.prayers,
    };
  });
}
