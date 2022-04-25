import database from "./database";

export default function getDevices(): DatabaseDevice[] {
  const rows = database.prepare(`SELECT * FROM devices`).all();
  return rows.map((row) => {
    return {
      id: row.id,
      name: row.name,
      friendlyName: row.friendlyName,
      host: row.host,
      enabled: row.enabled,
      volume: row.volume,
      prayers: JSON.parse(row.prayers),
    };
  });
}
