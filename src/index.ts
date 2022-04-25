import ChromecastAPI from "chromecast-api";
import initTables from "./database/initTables";
import getPrayerTimes from "./utils/getPrayerTimes";
import express from "express";
import database from "./database/database";
import athanLoop from "./utils/athanLoop";
import getDevices from "./database/getDevices";
import bodyParser from "body-parser";
import home from "./home";

initTables();
athanLoop();

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send(home);
});

app.get("/api/devices/scan", (req, res) => {
  const chromecast = new ChromecastAPI();

  const timeToScan = parseInt((req.query.timeToScan as string) || "5000");

  if (!timeToScan || timeToScan < 0 || timeToScan > 10000) {
    res.send({
      success: false,
      error: "Invalid time to scan",
    });
    return;
  }

  chromecast.on("device", (device) => {
    // Check to see if it's already in the database

    const existingDevice = database

      .prepare(`SELECT * FROM devices WHERE name = ?`)
      .get(device.name);

    if (existingDevice) {
      return;
    }

    database
      .prepare(
        `INSERT INTO devices (name, friendlyName, volume, host, enabled, prayers) VALUES (?, ?, ?, ?, ?, ?)`
      )
      .run(
        device.name,
        device.friendlyName,
        0.5,
        device.host,
        1,
        JSON.stringify([])
      );
  });

  setTimeout(() => {
    chromecast.destroy();
    res.send({ success: true });
  }, timeToScan);
});

app.get("/api/devices/list", (req, res) => {
  res.json(getDevices());
});

app.post("/api/devices/update/:id", (req, res) => {
  const id = parseInt(req.params.id as string);

  const { enabled, volume, prayers } = req.body;

  const device = database.prepare(`SELECT * FROM devices WHERE id = ?`).get(id);

  if (!device) {
    res.json({
      success: false,
      error: "Device not found",
    });
  }

  database
    .prepare(
      "UPDATE devices SET enabled = ?, volume = ?, prayers = ? WHERE id = ?"
    )
    .run(enabled ? 1 : 0, volume, JSON.stringify(prayers), id);

  res.json(database.prepare(`SELECT * FROM devices WHERE id = ?`).get(id));
});

app.get("/api/settings/list", (req, res) => {
  const settings = database.prepare("SELECT * FROM settings").all();

  const settingsMap: { [key: string]: string } = {};

  settings.forEach((setting) => {
    settingsMap[setting.name] = setting.value;
  });

  res.json(settingsMap);
});

app.post("/api/settings/update/:name", (req, res) => {
  const name = req.params.name as string;

  const { value } = req.body;

  const setting = database
    .prepare(`SELECT * FROM settings WHERE name = ?`)
    .get(name);

  if (!setting) {
    database
      .prepare(`INSERT INTO settings (name, value) VALUES (?, ?)`)
      .run(name, value);
  } else {
    database
      .prepare("UPDATE settings SET value = ? WHERE name = ?")
      .run(value, name);
  }

  res.json(database.prepare(`SELECT * FROM settings WHERE name = ?`).get(name));
});

app.get("/api/prayertimes", async (req, res) => {
  const citySetting = database
    .prepare("SELECT * FROM settings WHERE name = ?")
    .get("city");
  const city = citySetting ? citySetting.value : "New York City";
  const prayers = await getPrayerTimes(new Date(), city);

  res.json(prayers);
});

app.listen(3000);
