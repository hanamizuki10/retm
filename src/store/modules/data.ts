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
  private _data: CustomTypes.MyMonth = { firstDate: null, lastDate: null, weeks: [] };
  private _days: CustomTypes.MyDays = {};

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
    this.setMyMonth({ firstDate: null, lastDate: null, weeks: [] });
  }

  @Action
  public createCalendar(date: Date) {
    // リセット
    this.resetData();
    console.log(DataModule.formatDate(date));
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    var data: CustomTypes.MyMonth = { firstDate: null, lastDate: null, weeks: [] };
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
      planTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      totalTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      remainingTime: { strHours: '00', strMinutes: '00', hours: 0, minutes: 0 },
      categoryTimes: [],
      text: ''
    };

    return item;
  }

  private static setCategoryInit(
    item: CustomTypes.MyDay,
    categoryNames: string[]
  ): CustomTypes.MyDay {
    categoryNames.forEach((weekString: string) => {
      item.categoryTimes.push({ strHours: '00', strMinutes: '00', hours: 0, minutes: 0 });
    });
    return item;
  }

  private static formatDate(date: Date): string {
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    return targetYear + '-' + ('00' + targetMonth).slice(-2) + '-' + ('00' + targetDate).slice(-2);
  }
  private static isToday(dt: Date): boolean {
    const _today: Date = new Date(Date.now());
    return this.formatDate(dt) === this.formatDate(_today);
  }
  @Action
  public calc() {
    for (const [key, value] of Object.entries(this._days)) {
      console.log(key, value.keyDayString, value.date);
      if (!value.isTarget) {
        continue;
      }
    }
  }
}
export default getModule(DataModule);
