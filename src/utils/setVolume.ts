export default function setVolume(
  device: ChromecastDevice,
  volume: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    device.setVolume(volume, (err: any) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}
