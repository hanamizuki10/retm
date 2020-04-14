import { getModule, Module, Mutation, Action, VuexModule } from 'vuex-module-decorators';
import store from '@/store/';
@Module({
  namespaced: true,
  name: 'data',
  store,
  dynamic: true
})
class DataModule extends VuexModule {
  private _categoryNames: string[] = ['A', 'M', '他'];

  public get categoryNames(): string[] {
    return this._categoryNames;
  }

  @Mutation
  public setCategoryNames(categoryNames: string[]) {
    this._categoryNames = categoryNames;
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

  private _days: CustomTypes.MyDays = {};
  public get days(): CustomTypes.MyDays {
    return this._days;
  }

  @Mutation
  public setMyDays(days: CustomTypes.MyDays) {
    this._days = days;
    console.log('setMyDays', this._days);
  }

  @Action
  public addMyDay(item: CustomTypes.MyDay) {
    var newDays = Object.assign({}, this._days);
    newDays[item.keyDayString] = item;
    this.setMyDays(newDays);
    console.log('addMyDay', item);
  }

  @Action
  public addHoliday(info: CustomTypes.HolidayInfo) {
    var newDays = Object.assign({}, this._days);
    if (newDays[info.keyDayString]) {
      newDays[info.keyDayString].isHoliday = true;
      newDays[info.keyDayString].holidayName = info.holidayName;
      console.log(newDays[info.keyDayString]);
    }
    this.setMyDays(newDays);
  }

  @Action
  public resetDays() {
    this.setMyDays({});
  }
}
export default getModule(DataModule);
