"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
function setSettings(name, value) {
    if (!fs_1.default.existsSync("./settings.json")) {
        fs_1.default.writeFileSync("./settings.json", "{ }");
    }
    var settings = JSON.parse(fs_1.default.readFileSync("./settings.json", "utf8"));
    settings[name] = value;
    fs_1.default.writeFileSync("./settings.json", JSON.stringify(settings));
}
exports.default = setSettings;
//# sourceMappingURL=setSettings.js.map