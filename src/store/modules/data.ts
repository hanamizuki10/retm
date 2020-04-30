import { getModule, Module, Mutation, Action, VuexModule } from 'vuex-module-decorators';
import Dexie from 'dexie';
import { AppDatabase } from '../../types/dexieDefinitions';
import store from '@/store/';
@Module({
  namespaced: true,
  name: 'data',
  store,
  dynamic: true
})
class DataModule extends VuexModule {
  private _weekStrings = ['日', '月', '火', '水', '木', '金', '土'];
  private _categories: CustomTypes.Category[] = [];
  private _inputTimes: CustomTypes.InputTimes = DataModule.generateEmptyInputTimes();
  private _isInputHoliday: boolean = false; // 土日祝日も入力モードとするか
  private _data: CustomTypes.MyMonth = DataModule.generateEmptyMyMonth();
  private _days: CustomTypes.MyDays = {};
  private _db: AppDatabase = new Dexie('AppDatabase') as AppDatabase;

  @Mutation
  public setCategories(categories: CustomTypes.Category[]) {
    this._categories = categories;
    this._db.objects.put({
      id: 1,
      categories: this._categories,
      inputTimes: this._inputTimes,
      isInputHoliday: this._isInputHoliday,
      data: this._data,
      days: this._days
    });
  }

  @Mutation
  public setInputTimes(inputTimes: CustomTypes.InputTimes) {
    this._inputTimes = inputTimes;
    this._db.objects.put({
      id: 1,
      categories: this._categories,
      inputTimes: this._inputTimes,
      isInputHoliday: this._isInputHoliday,
      data: this._data,
      days: this._days
    });
  }
  @Mutation
  public setIsInputHoliday(isInputHoliday: boolean) {
    this._isInputHoliday = isInputHoliday;
    this._db.objects.put({
      id: 1,
      categories: this._categories,
      inputTimes: this._inputTimes,
      isInputHoliday: this._isInputHoliday,
      data: this._data,
      days: this._days
    });
  }
  @Mutation
  public setData(data: CustomTypes.MyMonth) {
    this._data = data;
    this._db.objects.put({
      id: 1,
      categories: this._categories,
      inputTimes: this._inputTimes,
      isInputHoliday: this._isInputHoliday,
      data: this._data,
      days: this._days
    });
  }
  @Mutation
  public setMyDays(days: CustomTypes.MyDays) {
    this._days = days;
    this._db.objects.put({
      id: 1,
      categories: this._categories,
      inputTimes: this._inputTimes,
      isInputHoliday: this._isInputHoliday,
      data: this._data,
      days: this._days
    });
  }

  public get moduleWeekStrings(): string[] {
    return this._weekStrings;
  }
  public get moduleCategories(): CustomTypes.Category[] {
    return this._categories;
  }
  public get moduleInputTimes(): CustomTypes.InputTimes {
    return this._inputTimes;
  }
  public get moduleIsInputHoliday(): boolean {
    return this._isInputHoliday; // 土日祝日も入力モードとするか
  }
  public get moduleData(): CustomTypes.MyMonth {
    return this._data;
  }
  public get moduleDays(): CustomTypes.MyDays {
    return this._days;
  }

  @Action
  public init(): void {
    this._db.version(1).stores({
      objects: '++id'
    });
    this._db.open();
    var self = this;
    this._db.objects.get(1, function(objectData) {
      console.log('objectData', objectData);
      if (objectData) {
        self.setCategories(objectData.categories);
        self.setInputTimes(objectData.inputTimes);
        self.setIsInputHoliday(objectData.isInputHoliday);
        self.setData(objectData.data);
        self.setMyDays(objectData.days);
      } else {
        self.createCalendar(new Date());
      }
    });
  }

  @Action
  public addCategory(categoryName: string): void {
    var newCategories = this._categories.concat(DataModule.generateCategory(categoryName));
    this.setCategories(newCategories);
    var newDays = Object.assign({}, this._days);
    for (const [key, item] of Object.entries(newDays)) {
      item.categories[categoryName] = DataModule.generateCategory(categoryName);
      newDays[key] = item;
    }
    this.setMyDays(newDays);
  }

  @Action
  public removeCategory(categoryName: string): void {
    const newCategories = this._categories.filter(category => category.name != categoryName);
    this.setCategories(newCategories);
    var newDays = Object.assign({}, this._days);
    for (const [key, item] of Object.entries(newDays)) {
      delete item.categories[categoryName];
      newDays[key] = item;
    }
    this.setMyDays(newDays);
  }

  @Action
  public updateIsInputHoliday(isInputHoliday: boolean): void {
    this.setIsInputHoliday(isInputHoliday);
  }

  @Action
  public addMyDay(item: CustomTypes.MyDay): void {
    var newDays = Object.assign({}, this._days);
    newDays[item.keyDayString] = item;
    this.setMyDays(newDays);
    //console.log('addMyDay', item.date);
  }

  @Action
  public addHoliday(info: CustomTypes.HolidayInfo): void {
    var newDays = Object.assign({}, this._days);
    if (newDays[info.keyDayString]) {
      newDays[info.keyDayString].isHoliday = true;
      newDays[info.keyDayString].holidayName = info.holidayName;
      //console.log(newDays[info.keyDayString]);
    }
    this.setMyDays(newDays);
  }

  @Action
  public resetData(): void {
    this.setMyDays({});
    this.setData(DataModule.generateEmptyMyMonth());
  }

  @Action
  public createCalendar(date: Date): void {
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
        item = DataModule.setCategoryInit(item, this._categories);
        this.addMyDay(item);
        dt.setDate(dt.getDate() + 1);
      } while (dt.getDay() < firstday);
    }
    console.log('pre----', firstday);
    // 起点日を指定しそこから終点日までの対象区間データを
    var dt = data.firstDate;
    var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], true);
    item = DataModule.setCategoryInit(item, this._categories);
    this.addMyDay(item);
    do {
      dt.setDate(dt.getDate() + 1);
      //console.log(DataModule.formatDate(dt));
      var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], true);
      item = DataModule.setCategoryInit(item, this._categories);
      this.addMyDay(item);
    } while (dt < data.lastDate);

    console.log('post----', lastday);
    if (lastday < 6) {
      var dt = data.lastDate;
      do {
        dt.setDate(dt.getDate() + 1);
        var item = DataModule.generateMyDay(dt, this._weekStrings[dt.getDay()], false);
        item = DataModule.setCategoryInit(item, this._categories);
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
    this.setData(data);
    console.log('end', data);
  }

  @Action
  public calc(): void {
    var newInputTimes = Object.assign({}, this._inputTimes);
    var newCategories = this._categories.concat();
    newCategories.forEach((c: CustomTypes.Category) => {
      c.actualTime = DataModule.generateMyTimeByMinutes(0); // リセット
    });
    var totalScheduledMinutes = DataModule.getTotalMinutes(this._inputTimes.scheduledTime);
    var totalActualTime = 0;
    var newDays = Object.assign({}, this._days);
    for (const [key, item] of Object.entries(newDays)) {
      //console.log(key, item.keyDayString, item.date);
      if (!item.isTarget) {
        continue;
      }
      totalActualTime += DataModule.getTotalMinutes(item.scheduledTime);
      var remainingTime = totalScheduledMinutes - totalActualTime;
      item.cumulativeTime = DataModule.generateMyTimeByMinutes(totalActualTime);
      item.remainingTime = DataModule.generateMyTimeByMinutes(remainingTime);
      newCategories.forEach((c: CustomTypes.Category) => {
        if (item.categories[c.name].scheduledTime.strHours != '00') {
          console.log(item.categories[c.name].scheduledTime.strHours);
        }
        var cScheduledTime = DataModule.getTotalMinutes(c.scheduledTime);
        var cActualTime = DataModule.getTotalMinutes(c.actualTime);
        cActualTime += DataModule.getTotalMinutes(item.categories[c.name].scheduledTime);
        var cRemainingTime = cScheduledTime - cActualTime;
        c.actualTime = DataModule.generateMyTimeByMinutes(cActualTime);
        c.remainingTime = DataModule.generateMyTimeByMinutes(cRemainingTime);
        item.categories[c.name].actualTime = DataModule.generateMyTimeByMinutes(cActualTime);
        item.categories[c.name].remainingTime = DataModule.generateMyTimeByMinutes(cRemainingTime);
      });
      newDays[key] = item;
    }
    var remainingTime = totalScheduledMinutes - totalActualTime;
    newInputTimes.actualTime = DataModule.generateMyTimeByMinutes(totalActualTime);
    newInputTimes.remainingTime = DataModule.generateMyTimeByMinutes(remainingTime);
    this.setInputTimes(newInputTimes);
    this.setMyDays(newDays);
    this.setCategories(newCategories);
  }

  @Action
  public setStartDate(date: string): void {
    console.log('setStartDate', date);
    var newInputTimes = Object.assign({}, this._inputTimes);
    newInputTimes.startDate = new Date(date);
    newInputTimes.startYear = newInputTimes.startDate.getFullYear();
    newInputTimes.startMonth = newInputTimes.startDate.getMonth() + 1;
    newInputTimes.startDay = newInputTimes.startDate.getDate();
    console.log('newInputTimes', newInputTimes);
    this.setInputTimes(newInputTimes);
    this.createCalendar(newInputTimes.startDate);
  }

  @Action
  public setAutoPlanTime(): void {
    console.log('setAutoPlanTime', this._inputTimes.baseTime);
    var newDays = Object.assign({}, this._days);
    for (const [key, item] of Object.entries(newDays)) {
      if (!item.isTarget) {
        continue;
      }
      if (item.isLock) {
        continue;
      }
      if (item.isHoliday || '土' == item.week || '日' == item.week) {
        // 休日
        if (!this._isInputHoliday) {
          // 休日は入力しないモード
          continue;
        }
      }
      item.scheduledTime = DataModule.generateMyTime(
        this._inputTimes.baseTime.hours,
        this._inputTimes.baseTime.minutes
      );
      console.log(
        item.keyDayString,
        item.scheduledTime.strHours,
        item.scheduledTime.strMinutes,
        item.holidayName
      );
      newDays[key] = item;
    }
    this.setMyDays(newDays);
    this.calc();
  }
  @Action
  public resetTimes(keyDayString: string): void {
    var newDays = Object.assign({}, this._days);
    console.log('resetTimes', keyDayString, newDays[keyDayString]);
    newDays[keyDayString].scheduledTime = DataModule.generateMyTime(0, 0);
    this._categories.forEach((c: CustomTypes.Category) => {
      newDays[keyDayString].categories[c.name] = DataModule.generateCategory(c.name);
    });
    this.setMyDays(newDays);
    this.calc();
  }
  @Action
  public changeLock(keyDayString: string): void {
    var newDays = Object.assign({}, this._days);
    newDays[keyDayString].isLock = !newDays[keyDayString].isLock;
    this.setMyDays(newDays);
  }

  private static getTotalMinutes(time: CustomTypes.MyTime): number {
    return time.hours * 60 + time.minutes;
  }

  private static generateMyDay(dt: Date, week: string, isTarget: boolean): CustomTypes.MyDay {
    const item: CustomTypes.MyDay = {
      date: dt,
      month: dt.getMonth() + 1,
      day: dt.getDate(),
      keyDayString: this.formatDate(dt),
      isTarget: isTarget,
      isCurrent: this.isToday(dt),
      isHoliday: false,
      isLock: false,
      holidayName: '',
      week: week,
      scheduledTime: DataModule.generateMyTime(0, 0),
      cumulativeTime: DataModule.generateMyTime(0, 0),
      remainingTime: DataModule.generateMyTime(0, 0),
      categories: {},
      text: ''
    };

    return item;
  }
  private static generateEmptyInputTimes(): CustomTypes.InputTimes {
    const date = new Date();
    return {
      scheduledTime: DataModule.generateMyTime(0, 0),
      actualTime: DataModule.generateMyTime(0, 0),
      remainingTime: DataModule.generateMyTime(0, 0),
      baseTime: DataModule.generateMyTime(0, 0),
      startDate: date,
      startYear: date.getFullYear(),
      startMonth: date.getMonth() + 1,
      startDay: date.getDate()
    };
  }

  private static generateEmptyMyMonth(): CustomTypes.MyMonth {
    return {
      firstDate: null,
      lastDate: null,
      weeks: []
    };
  }
  private static generateMyTimeByMinutes(minutes: number): CustomTypes.MyTime {
    var isMinus = false;
    if (minutes < 0) {
      isMinus = true;
      minutes = Math.abs(minutes);
    }
    var h = Math.floor(minutes / 60);
    // console.log(minutes / 60);
    // console.log(minutes % 60);
    var m = minutes % 60;
    var time = DataModule.generateMyTime(h, m);
    if (isMinus) {
      time.strHours = '-' + time.strHours;
      time.hours = -1 * time.hours;
    }
    return time;
  }

  private static generateMyTime(hours: number, minutes: number): CustomTypes.MyTime {
    var strHours = String(hours);
    if (strHours.length == 1) {
      strHours = ('00' + strHours).slice(-2);
    }
    return {
      strHours: strHours,
      strMinutes: ('00' + minutes).slice(-2),
      hours: hours,
      minutes: minutes
    };
  }

  private static setCategoryInit(
    item: CustomTypes.MyDay,
    categories: CustomTypes.Category[]
  ): CustomTypes.MyDay {
    categories.forEach((category: CustomTypes.Category) => {
      item.categories[category.name] = DataModule.generateCategory(category.name);
    });
    return item;
  }
  private static generateCategory(name: string): CustomTypes.Category {
    return {
      name: name,
      scheduledTime: DataModule.generateMyTime(0, 0),
      actualTime: DataModule.generateMyTime(0, 0),
      remainingTime: DataModule.generateMyTime(0, 0)
    };
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
}
export default getModule(DataModule);
