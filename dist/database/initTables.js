"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("./database"));
function initTables() {
    database_1.default
        .prepare("CREATE TABLE IF NOT EXISTS settings (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            name TEXT,\n            value TEXT\n        )")
        .run();
    database_1.default
        .prepare("CREATE TABLE IF NOT EXISTS devices (\n            id INTEGER PRIMARY KEY AUTOINCREMENT,\n            name TEXT,\n            friendlyName TEXT,\n            host TEXT,\n            enabled INTEGER,\n            volume FLOAT,\n            prayers TEXT\n            )")
        .run();
    database_1.default
        .prepare("CREATE TABLE IF NOT EXISTS prayer_times (id INTEGER PRIMARY KEY AUTOINCREMENT, date VARCHAR(32), fajr DATETIME, dhuhr DATETIME, asr DATETIME, maghrib DATETIME, isha DATETIME)")
        .run();
}
exports.default = initTables;
//# sourceMappingURL=initTables.js.map