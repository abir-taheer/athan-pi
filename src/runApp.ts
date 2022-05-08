import ChromecastAPI from "chromecast-api";
import initTables from "./database/initTables";
import getPrayerTimes from "./utils/getPrayerTimes";
import express from "express";
import athanLoop from "./utils/athanLoop";
import getDevices from "./database/getDevices";
import bodyParser from "body-parser";
import home from "./home";
import fs from "fs";
import getSettings from "./utils/getSettings";

export default function runApp(){
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

    const devices = getDevices();

    chromecast.on("device", (device) => {
      // Check to see if it's already in the database

      const existingDevice = devices.find((d) => d.name === device.name);

      if (existingDevice) {
        return;
      }

      devices.push({
        id: device.name,
        name: device.name,
        friendlyName: device.friendlyName,
        host: device.host,
        enabled: true,
        volume: 0.5,
        prayers: [],
      });

      fs.writeFileSync("./devices.json", JSON.stringify(devices));
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
    const id = req.params.id as string;

    const { enabled, volume, prayers } = req.body;

    const devices = getDevices();
    const deviceIndex = devices.findIndex((d) => d.id === id);

    if (deviceIndex === -1) {
      res.json({
        success: false,
        error: "Device not found",
      });
    }

    devices[deviceIndex].enabled = enabled;
    devices[deviceIndex].volume = volume;
    devices[deviceIndex].prayers = prayers;

    fs.writeFileSync("./devices.json", JSON.stringify(devices));

    res.json(devices[deviceIndex]);
  });

  app.get("/api/settings/list", (req, res) => {
    const settingsMap = getSettings();

    res.json(settingsMap);
  });

  app.post("/api/settings/update/:name", (req, res) => {
    const name = req.params.name as string;
    const settingsMap = getSettings();

    settingsMap[name] = req.body.value;

    fs.writeFileSync("./settings.json", JSON.stringify(settingsMap));
    res.json(settingsMap);
  });

  app.get("/api/prayertimes", async (req, res) => {
    const settings = getSettings();
    const city = settings.city ? settings.city.value : "New York City";
    const prayers = await getPrayerTimes(new Date(), city);

    res.json(prayers);
  });

  app.listen(3000);
}
