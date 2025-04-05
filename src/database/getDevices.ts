import fs from "fs";
import { devicesJsonPath } from "./initTables";

export default function getDevices(): DatabaseDevice[] {
  let devicesString: string = "";

  try {
    devicesString = fs.readFileSync(devicesJsonPath, "utf8");
  } catch {
    fs.writeFileSync(devicesJsonPath, "[]");
  }

  const devices = devicesString ? JSON.parse(devicesString) : [];

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
