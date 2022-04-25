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
var getDevices_1 = __importDefault(require("../database/getDevices"));
var getPrayerTimes_1 = __importDefault(require("./getPrayerTimes"));
var getSettings_1 = __importDefault(require("./getSettings"));
var prayers = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
var sleep = function (ms) { return new Promise(function (resolve) { return setTimeout(resolve, ms); }); };
function athanLoop() {
    return __awaiter(this, void 0, void 0, function () {
        var citySetting, date, prayerTimes, currentPrayer, devices, deviceNameMap, athanUrl, duaAfterUrl, chromecast;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    citySetting = (0, getSettings_1.default)().city;
                    if (!citySetting) {
                        setTimeout(athanLoop, 1000 * 5);
                        return [2 /*return*/];
                    }
                    date = new Date();
                    return [4 /*yield*/, (0, getPrayerTimes_1.default)(date, citySetting.value)];
                case 1:
                    prayerTimes = _a.sent();
                    currentPrayer = prayers.find(function (prayer) {
                        var prayerTime = prayerTimes[prayer];
                        var timeDifference = prayerTime.getTime() - date.getTime();
                        return timeDifference < 0 && timeDifference > -60000;
                    });
                    if (!currentPrayer) {
                        setTimeout(athanLoop, 1000 * 5);
                        return [2 /*return*/];
                    }
                    devices = (0, getDevices_1.default)();
                    deviceNameMap = {};
                    devices.forEach(function (device) {
                        deviceNameMap[device.name] = device;
                    });
                    if (devices.length === 0) {
                        setTimeout(athanLoop, 1000 * 5);
                        return [2 /*return*/];
                    }
                    athanUrl = currentPrayer === "fajr"
                        ? "https://res.cloudinary.com/abir-taheer/video/upload/v1650888485/athan/fajr.mp3"
                        : "https://res.cloudinary.com/abir-taheer/video/upload/v1650888536/athan/regular.mp3";
                    duaAfterUrl = "https://res.cloudinary.com/abir-taheer/video/upload/v1650890068/athan/after_athan.mp3";
                    chromecast = new chromecast_api_1.default();
                    chromecast.on("device", function (device) {
                        if (!deviceNameMap[device.name] ||
                            !deviceNameMap[device.name].enabled ||
                            !deviceNameMap[device.name].prayers.includes(currentPrayer)) {
                            return;
                        }
                        device.setVolume(deviceNameMap[device.name].volume, function () {
                            device.play(athanUrl, function (err) {
                                var played = false;
                                if (!err) {
                                    device.on("finished", function () {
                                        if (played) {
                                            return;
                                        }
                                        played = true;
                                        device.play(duaAfterUrl);
                                    });
                                }
                            });
                        });
                    });
                    return [4 /*yield*/, sleep(1000 * 60 * 5)];
                case 2:
                    _a.sent();
                    setTimeout(athanLoop, 1000 * 5);
                    return [2 /*return*/];
            }
        });
    });
}
exports.default = athanLoop;
//# sourceMappingURL=athanLoop.js.map