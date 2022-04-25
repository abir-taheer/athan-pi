"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("./database"));
function insertPrayerTime(values) {
    database_1.default
        .prepare("INSERT INTO prayer_times (date, fajr, dhuhr, asr, maghrib, isha) VALUES (?, ?, ?, ?, ?, ?, ?)")
        .run(values.date, values.fajr, values.dhuhr, values.asr, values.maghrib, values.isha);
}
exports.default = insertPrayerTime;
//# sourceMappingURL=insertPrayerTimes.js.map