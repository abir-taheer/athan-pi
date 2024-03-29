"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function getDevices() {
    var devices = JSON.parse(fs_1.default.readFileSync("./devices.json", "utf8"));
    return devices.map(function (row) {
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
exports.default = getDevices;
//# sourceMappingURL=getDevices.js.map