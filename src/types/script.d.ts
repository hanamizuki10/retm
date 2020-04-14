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
    keyDayString: string;
    isTarget: boolean;
    isCurrent: boolean;
    isHoliday: boolean;
    holidayName: string;
    week: string;
    planTime: MyTime;
    totalTime: MyTime;
    remainingTime: MyTime;
    categoryTimes: MyTime[];
    text: string;
  }
  export interface MyTime {
    hours: number;
    minutes: number;
  }
}