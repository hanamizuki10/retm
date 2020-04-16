import { getModule, Module, Mutation, Action, VuexModule } from 'vuex-module-decorators';
import store from '@/store/';
@Module({
  namespaced: true,
  name: 'data',
  store,
  dynamic: true
})
class DataModule extends VuexModule {
  private _weekStrings = ['日', '月', '火', '水', '木', '金', '土'];
  private _categoryNames: string[] = ['A', 'M', '他'];
  private _data: CustomTypes.MyMonth = DataModule.generateEmptyMyMonth();
  private _inputTimes: CustomTypes.InputTimes = DataModule.generateEmptyInputTimes();
  private _accumulationTimes: CustomTypes.AccumulationTimes = DataModule.generateEmptyAccumulationTimes();
  private _days: CustomTypes.MyDays = {};
  private _isInputHoliday: boolean = false; // 土日祝日も入力モードとするか

  public get moduleIsInputHoliday(): boolean {
    return this._isInputHoliday; // 土日祝日も入力モードとするか
  }

  public get moduleInputTimes(): CustomTypes.InputTimes {
    return this._inputTimes;
  }

  public get moduleAccumulationTimes(): CustomTypes.AccumulationTimes {
    return this._accumulationTimes;
  }

  public get moduleWeekStrings(): string[] {
    return this._weekStrings;
  }
  public get moduleData(): CustomTypes.MyMonth {
    return this._data;
  }
  public get moduleCategoryNames(): string[] {
    return this._categoryNames;
  }
  public get moduleDays(): CustomTypes.MyDays {
    return this._days;
  }

  @Mutation
  public setCategoryNames(categoryNames: string[]) {
    this._categoryNames = categoryNames;
  }
  @Mutation
  public setMyDays(days: CustomTypes.MyDays) {
    this._days = days;
  }
  @Mutation
  public setMyMonth(data: CustomTypes.MyMonth) {
    this._data = data;
  }
  @Mutation
  public setAccumulationTimes(accumulationTimes: CustomTypes.AccumulationTimes) {
    this._accumulationTimes = accumulationTimes;
  }
  @Mutation
  public setIsInputHoliday(isInputHoliday: boolean) {
    this._isInputHoliday = isInputHoliday;
  }

  @Action
  public updateIsInputHoliday(isInputHoliday: boolean) {
    this.setIsInputHoliday(isInputHoliday);
  }

  @Action
  public addCategoryName(categoryName: string) {
    var newCategoryNames = this._categoryNames.concat(categoryName);
    this.setCategoryNames(newCategoryNames);
  }

  @Action
  public removeCategoryName(categoryName: string) {
    const newCategoryNames = this._categoryNames.filter(name => name != categoryName);
    this.setCategoryNames(newCategoryNames);
  }

  @Action
  public resetCategoryName() {
    this.setCategoryNames([]);
  }

  @Action
  public addMyDay(item: CustomTypes.MyDay) {
    var newDays = Object.assign({}, this._days);
    newDays[item.keyDayString] = item;
    this.setMyDays(newDays);
    //console.log('addMyDay', item.date);
  }

  @Action
  public addHoliday(info: CustomTypes.HolidayInfo) {
    var newDays = Object.assign({}, this._days);
    if (newDays[info.keyDayString]) {
      newDays[info.keyDayString].isHoliday = true;
      newDays[info.keyDayString].holidayName = info.holidayName;
      //console.log(newDays[info.keyDayString]);
    }
    this.setMyDays(newDays);
  }

  @Action
  public resetData() {
    this.setMyDays({});
    this.setMyMonth(DataModule.generateEmptyMyMonth());
  }

  @Action
  public createCalendar(date: Date) {
    // リセット
    this.resetData();
    console.log(DataModule.formatDate(date));
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    var data: CustomTypes.MyMonth = DataModule.generateEmptyMyMonth();
    data.firstDate = new Date(targetYear, targetMonth - 1, targetDate);
    data.lastDate = new Date(targetYear, targetMonth, targetDate - 1);

    // 計算対象の起点日と終点日を求める
    const firstday = data.firstDate.getDay();
    const lastday = data.lastDate.getDay();
    // Sunday - Saturday : 0 - 6
    if (firstday != 0) {
      // 起点日より前の日付情報を追加
      var dt = data.firstDate;
      dt.setDate(dt.getDate() - firstday);
      do {
        console.log('前処理', DataModule.formatDate(dt));
        var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], false);
        item = DataModule.setCategoryInit(item, this._categoryNames);
        this.addMyDay(item);
        dt.setDate(dt.getDate() + 1);
      } while (dt.getDay() < firstday);
    }
    console.log('pre----', firstday);
    // 起点日を指定しそこから終点日までの対象区間データを
    var dt = data.firstDate;
    var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], true);
    item = DataModule.setCategoryInit(item, this._categoryNames);
    this.addMyDay(item);
    do {
      dt.setDate(dt.getDate() + 1);
      //console.log(DataModule.formatDate(dt));
      var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], true);
      item = DataModule.setCategoryInit(item, this._categoryNames);
      this.addMyDay(item);
    } while (dt < data.lastDate);

    console.log('post----', lastday);
    if (lastday < 6) {
      var dt = data.lastDate;
      do {
        dt.setDate(dt.getDate() + 1);
        var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], false);
        item = DataModule.setCategoryInit(item, this._categoryNames);
        this.addMyDay(item);
        console.log('後処理', DataModule.formatDate(dt));
      } while (dt.getDay() < 6);
    }

    var tempWeek: CustomTypes.MyWeek = { days: [] };
    for (const [key, value] of Object.entries(this._days)) {
      tempWeek.days.push(value.keyDayString);
      if (tempWeek.days.length == 7) {
        data.weeks.push(tempWeek);
        tempWeek = { days: [] };
      }
    }
    this.setMyMonth(data);
    console.log('end', data);
  }

  private static generateMyDay(dt: Date, week: string, isTarget: boolean): CustomTypes.MyDay {
    const item: CustomTypes.MyDay = {
      date: dt,
      day: dt.getDate(),
      keyDayString: this.formatDate(dt),
      isTarget: isTarget,
      isCurrent: this.isToday(dt),
      isHoliday: false,
      holidayName: '',
      week: week,
      planTime: DataModule.generateMyTime(0, 0),
      totalTime: DataModule.generateMyTime(0, 0),
      remainingTime: DataModule.generateMyTime(0, 0),
      categoryTimes: [],
      text: ''
    };

    return item;
  }
  private static generateEmptyInputTimes(): CustomTypes.InputTimes {
    return {
      totalTime: DataModule.generateMyTime(0, 0),
      baseTime: DataModule.generateMyTime(0, 0)
    };
  }

  private static generateEmptyAccumulationTimes(): CustomTypes.AccumulationTimes {
    return {
      totalTime: DataModule.generateMyTime(0, 0),
      remainingTime: DataModule.generateMyTime(0, 0)
    };
  }

  private static generateEmptyMyMonth(): CustomTypes.MyMonth {
    return {
      firstDate: null,
      lastDate: null,
      weeks: []
    };
  }

  private static generateMyTime(hours: number, minutes: number): CustomTypes.MyTime {
    return {
      strHours: ('00' + hours).slice(-2),
      strMinutes: ('00' + minutes).slice(-2),
      hours: hours,
      minutes: 0
    };
  }

  private static setCategoryInit(
    item: CustomTypes.MyDay,
    categoryNames: string[]
  ): CustomTypes.MyDay {
    categoryNames.forEach((weekString: string) => {
      item.categoryTimes.push(DataModule.generateMyTime(0, 0));
    });
    return item;
  }

  private static formatDate(date: Date): string {
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    return targetYear + '/' + ('00' + targetMonth).slice(-2) + '/' + ('00' + targetDate).slice(-2);
  }
  private static isToday(dt: Date): boolean {
    const _today: Date = new Date(Date.now());
    return this.formatDate(dt) === this.formatDate(_today);
  }
  @Action
  public calc() {
    var totalTimeMinutes = 0;
    for (const [key, item] of Object.entries(this._days)) {
      console.log(key, item.keyDayString, item.date);
      if (!item.isTarget) {
        continue;
      }
      totalTimeMinutes += item.planTime.hours * 60;
      totalTimeMinutes += item.planTime.minutes;
    }
    var h = Math.floor(totalTimeMinutes / 60);
    var m = totalTimeMinutes % 60;
    console.log('calc', h, m);
    var accumulationTimes = DataModule.generateEmptyAccumulationTimes();
    accumulationTimes.totalTime = DataModule.generateMyTime(h, m);
    this.setAccumulationTimes(accumulationTimes);
  }
}
export default getModule(DataModule);
