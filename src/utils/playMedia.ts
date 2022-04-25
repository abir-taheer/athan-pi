export default function playMedia(
  device: ChromecastDevice,
  mediaUrl: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    device.play(mediaUrl, (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      device.on("finished", (finErr) => {
        if (finErr) {
          reject(finErr);
          return;
        }

        resolve();
      });
    });
  });
}
