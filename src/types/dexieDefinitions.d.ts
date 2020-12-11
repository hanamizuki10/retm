/**
   IndexedDB
*/
import Dexie from 'dexie';

export type DexieDatabase = { [P in keyof Dexie]: Dexie[P] };
/** データベースの型定義 */
export interface AppDatabase extends DexieDatabase {
  objects: Dexie.Table<ICustomer, number>;
}
/** テーブルの型定義 */
export interface ICustomer {
  id?: number;
  categories: CustomTypes.Category[];
  inputTimes: CustomTypes.InputTimes;
  isInputHoliday: boolean;
  data: CustomTypes.MyMonth;
  days: CustomTypes.MyDays;
}
