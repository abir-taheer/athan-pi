import axios from "axios";
import fs from "fs";
import { prayerTimesJsonPath } from "./initTables";

type ApiResponse = {
  code: number;
  status: string;
  data: {
    timings: {
      Fajr: string;
      Sunrise: string;
      Dhuhr: string;
      Asr: string;
      Sunset: string;
      Maghrib: string;
      Isha: string;
      Imsak: string;
      Midnight: string;
    };
    date: {
      readable: string;
      timestamp: string;
      gregorian: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
        };
        month: {
          number: number;
          en:
            | "January"
            | "February"
            | "March"
            | "April"
            | "May"
            | "June"
            | "July"
            | "August"
            | "September"
            | "October"
            | "November"
            | "December";
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
      };
      hijri: {
        date: string;
        format: string;
        day: string;
        weekday: {
          en: string;
          ar: string;
        };
        month: {
          number: number;
          en: string;
          ar: string;
        };
        year: string;
        designation: {
          abbreviated: string;
          expanded: string;
        };
        holidays: string[];
      };
    };
    meta: {
      latitude: number;
      longitude: number;
      timezone: string;
      method: {
        id: number;
        name: number;
        params: {
          Fajr: number;
          Isha: number;
        };
      };
      latitudeAdjustmentMethod: string;
      midnightMode: string;
      school: string;
      offset: {
        Imsak: number;
        Fajr: number;
        Sunrise: number;
        Dhuhr: number;
        Asr: number;
        Maghrib: number;
        Sunset: number;
        Isha: number;
        Midnight: number;
      };
    };
  };
};

export default async function getPrayerTimesFromServer(
  date: Date,
  city: string,
) {
  const timestamp = Math.round(date.getTime() / 1000);
  const response = await axios.get<ApiResponse>(
    "https://api.aladhan.com/v1/timingsByCity/" + timestamp,
    {
      params: {
        city,
        country: "US",
        iso8601: true,
      },
    },
  );

  const times: PrayerTime = {
    date: date.toDateString(),
    fajr: new Date(response.data.data.timings.Fajr),
    dhuhr: new Date(response.data.data.timings.Dhuhr),
    asr: new Date(response.data.data.timings.Asr),
    maghrib: new Date(response.data.data.timings.Maghrib),
    isha: new Date(response.data.data.timings.Isha),
  };

  fs.writeFileSync(prayerTimesJsonPath, JSON.stringify([times]));

  return times;
}
