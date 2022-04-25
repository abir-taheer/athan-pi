import ChromecastAPI from "chromecast-api";
import initTables from "./database/initTables";

initTables();

const client = new ChromecastAPI();

client.on("device", function (device) {
  console.log(device);
});
