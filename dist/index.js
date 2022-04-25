"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chromecast_api_1 = __importDefault(require("chromecast-api"));
var initTables_1 = __importDefault(require("./database/initTables"));
var getPrayerTimes_1 = __importDefault(require("./utils/getPrayerTimes"));
var express_1 = __importDefault(require("express"));
var database_1 = __importDefault(require("./database/database"));
var athanLoop_1 = __importDefault(require("./utils/athanLoop"));
var getDevices_1 = __importDefault(require("./database/getDevices"));
var body_parser_1 = __importDefault(require("body-parser"));
var home_1 = __importDefault(require("./home"));
(0, initTables_1.default)();
(0, athanLoop_1.default)();
var app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.get("/", function (req, res) {
    res.send(home_1.default);
});
app.get("/api/devices/scan", function (req, res) {
    var chromecast = new chromecast_api_1.default();
    var timeToScan = parseInt(req.query.timeToScan || "5000");
    if (!timeToScan || timeToScan < 0 || timeToScan > 10000) {
        res.send({
            success: false,
            error: "Invalid time to scan",
        });
        return;
    }
    chromecast.on("device", function (device) {
        // Check to see if it's already in the database
        var existingDevice = database_1.default
            .prepare("SELECT * FROM devices WHERE name = ?")
            .get(device.name);
        if (existingDevice) {
            return;
        }
        database_1.default
            .prepare("INSERT INTO devices (name, friendlyName, volume, host, enabled, prayers) VALUES (?, ?, ?, ?, ?, ?)")
            .run(device.name, device.friendlyName, 0.5, device.host, 1, JSON.stringify([]));
    });
    setTimeout(function () {
        chromecast.destroy();
        res.send({ success: true });
    }, timeToScan);
});
app.get("/api/devices/list", function (req, res) {
    res.json((0, getDevices_1.default)());
});
app.post("/api/devices/update/:id", function (req, res) {
    var id = parseInt(req.params.id);
    var _a = req.body, enabled = _a.enabled, volume = _a.volume, prayers = _a.prayers;
    var device = database_1.default.prepare("SELECT * FROM devices WHERE id = ?").get(id);
    if (!device) {
        res.json({
            success: false,
            error: "Device not found",
        });
    }
    database_1.default
        .prepare("UPDATE devices SET enabled = ?, volume = ?, prayers = ? WHERE id = ?")
        .run(enabled ? 1 : 0, volume, JSON.stringify(prayers), id);
    res.json(database_1.default.prepare("SELECT * FROM devices WHERE id = ?").get(id));
});
app.get("/api/settings/list", function (req, res) {
    var settings = database_1.default.prepare("SELECT * FROM settings").all();
    var settingsMap = {};
    settings.forEach(function (setting) {
        settingsMap[setting.name] = setting.value;
    });
    res.json(settingsMap);
});
app.post("/api/settings/update/:name", function (req, res) {
    var name = req.params.name;
    var value = req.body.value;
    var setting = database_1.default
        .prepare("SELECT * FROM settings WHERE name = ?")
        .get(name);
    if (!setting) {
        database_1.default
            .prepare("INSERT INTO settings (name, value) VALUES (?, ?)")
            .run(name, value);
    }
    else {
        database_1.default
            .prepare("UPDATE settings SET value = ? WHERE name = ?")
            .run(value, name);
    }
    res.json(database_1.default.prepare("SELECT * FROM settings WHERE name = ?").get(name));
});
app.get("/api/prayertimes", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var citySetting, city, prayers;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                citySetting = database_1.default
                    .prepare("SELECT * FROM settings WHERE name = ?")
                    .get("city");
                city = citySetting ? citySetting.value : "New York City";
                return [4 /*yield*/, (0, getPrayerTimes_1.default)(new Date(), city)];
            case 1:
                prayers = _a.sent();
                res.json(prayers);
                return [2 /*return*/];
        }
    });
}); });
app.listen(3000);
//# sourceMappingURL=index.js.map