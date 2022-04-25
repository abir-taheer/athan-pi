type Prayer = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

type PrayerTime = {
  [key in Prayer]: Date;
} & { date: string };

type DatabaseDevice = {
  id: number;
  name: string;
  friendlyName: string;
  host: string;
  enabled: boolean;
  volume: number;
  prayers: Prayer[];
};

class ChromecastDevice {
  name: string;
  friendlyName: string;
  host: string;
  client: any;

  play(url: string, options?: PlayOptions, callback?: (err: any) => void): void;

  play(url: string, callback?: (err: any) => void);

  pause(callback?: (err: any) => void): void;

  resume(callback?: (err: any) => void): void;

  stop(callback?: (err: any) => void): void;

  seek(seconds: number, callback?: (err: any) => void): void;

  setVolume(volume: number, callback?: (err: any) => void): void;

  seekTo(seconds: number, callback?: (err: any) => void): void;

  changeSubtitles(index: number, callback?: (err: any) => void): void;
  changeSubtitlesSize(size: number, callback?: (err: any) => void): void;
  subtitlesOff(callback?: (err: any) => void): void;

  getCurrentTime(callback: (err: any, time: number) => void): void;

  close(callback?: (err: any) => void): void;

  on(event: "connected", callback: (err: any) => void): void;
  on(event: "finished", callback: (err: any) => void): void;
  on(event: "status", callback: (status: string) => void): void;

  destroy(): void;
}
declare module "chromecast-api" {
  type PlayOptions = {
    // Number of seconds to skip forward
    startTime: number;
  };

  class ChromecastAPI {
    constructor();
    destroy(): void;
    on(event: "device", callback: (device: Device) => void): void;

    devices: ChromecastDevice[];

    on(event: "error", callback: (error: any) => void): void;
    update(): void;
  }
  export = ChromecastAPI;
}
