"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function initTables() {
    if (!fs_1.default.existsSync("./settings.json")) {
        fs_1.default.writeFileSync("./settings.json", "{ }");
    }
    if (!fs_1.default.existsSync("./devices.json")) {
        fs_1.default.writeFileSync("./devices.json", "[]");
    }
    if (!fs_1.default.existsSync("./prayerTimes.json")) {
        fs_1.default.writeFileSync("./prayerTimes.json", "[]");
    }
    console.log("initialized");
}
exports.default = initTables;
//# sourceMappingURL=initTables.js.map