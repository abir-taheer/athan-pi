"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setVolume(device, volume) {
    return new Promise(function (resolve, reject) {
        device.setVolume(volume, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
exports.default = setVolume;
//# sourceMappingURL=setVolume.js.map