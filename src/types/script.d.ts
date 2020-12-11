declare interface GetHolidayResult {
  [key: string]: string;
}
declare namespace CustomTypes {
  export interface HolidayInfo {
    keyDayString: string;
    holidayName: string;
  }

  export interface MyDays {
    [key: string]: MyDay;
  }

  export interface InputTimes {
    scheduledTime: MyTime; // 予定時間
    actualTime: MyTime; // 実績時間
    remainingTime: MyTime; // 残時間
    baseTime: MyTime;
    startDate: Date;
    startYear: number;
    startMonth: number;
    startDay: number;
  }
  export interface MyMonth {
    firstDate: Date | null;
    lastDate: Date | null;
    weeks: MyWeek[];
  }
  export interface MyWeek {
    days: string[];
  }
  export interface MyDay {
    date: Date;
    month: number;
    day: number;
    keyDayString: string;
    isTarget: boolean;
    isHoliday: boolean;
    isLock: boolean;
    holidayName: string;
    week: string;
    scheduledTime: MyTime; // 予定時間
    cumulativeTime: MyTime; // 累積時間
    remainingTime: MyTime; // 累積残時間
    categories: CategoryIndex;
    text: string;
  }
  export interface MyTime {
    strHours: string;
    strMinutes: string;
    hours: number;
    minutes: number;
  }
  export interface CategoryIndex {
    [name: string]: Category;
  }
  export interface Category {
    name: string;
    scheduledTime: MyTime; // 予定時間
    actualTime: MyTime; // 実績時間
    remainingTime: MyTime; // 残時間
  }
  export interface CategoryDisp {
    name: string;
    scheduledTime: string; // 予定時間
    actualTime: string; // 実績時間
    remainingTime: string; // 残時間
  }
}
