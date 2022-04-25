"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function playMedia(device, mediaUrl) {
    return new Promise(function (resolve, reject) {
        device.play(mediaUrl, function (err) {
            if (err) {
                reject(err);
                return;
            }
            device.on("finished", function (finErr) {
                if (finErr) {
                    reject(finErr);
                    return;
                }
                resolve();
            });
        });
    });
}
exports.default = playMedia;
//# sourceMappingURL=playMedia.js.map