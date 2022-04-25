"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var database_1 = __importDefault(require("./database"));
function getDevices() {
    var rows = database_1.default.prepare("SELECT * FROM devices").all();
    return rows.map(function (row) {
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
exports.default = getDevices;
//# sourceMappingURL=getDevices.js.map