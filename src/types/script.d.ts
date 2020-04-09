declare interface GetHolidayResult {
  [key: string]: string;
}
declare namespace CustomTypes {
  export interface MyMonth {
    firstDate: Date | null;
    lastDate: Date | null;
    weeks: MyWeek[];
  }
  export interface MyWeek {
    days: MyDay[];
  }
  export interface MyDay {
    date: Date;
    isTarget: Boolean;
    isCurrent: Boolean;
    isHoliday: Boolean;
    holidayName: String;
    week: String;
    planTime: MyTime;
    totalTime: MyTime;
    remainingTime: MyTime;
    categoryTimes: MyTime[];
    text: String;
  }
  export interface MyTime {
    hours: number;
    minutes: number;
  }
}