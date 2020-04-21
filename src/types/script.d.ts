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
    totalTime: MyTime;
    baseTime: MyTime;
    startDate: Date;
    startYear: number;
    startMonth: number;
    startDay: number;
  }
  export interface AccumulationTimes {
    totalTime: MyTime;
    remainingTime: MyTime;
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
    isCurrent: boolean;
    isHoliday: boolean;
    isLock: boolean;
    holidayName: string;
    week: string;
    planTime: MyTime;
    totalTime: MyTime;
    remainingTime: MyTime;
    categoryTimes: MyTime[];
    text: string;
  }
  export interface MyTime {
    strHours: string;
    strMinutes: string;
    hours: number;
    minutes: number;
  }
}