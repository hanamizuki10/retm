<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        残業管理くん
      </div>

      <v-spacer></v-spacer>

      <v-btn large color="info" @click="copy">コピー</v-btn>
    </v-app-bar>

    <v-content>
      <v-container>
        <v-row>
          <v-col>←</v-col>
          <v-col>2020年</v-col>
          <v-col>1月</v-col>
          <v-col>2月</v-col>
          <v-col>3月</v-col>
          <v-col>4月</v-col>
          <v-col>5月</v-col>
          <v-col>6月</v-col>
          <v-col>7月</v-col>
          <v-col>8月</v-col>
          <v-col>9月</v-col>
          <v-col>10月</v-col>
          <v-col>11月</v-col>
          <v-col>12月</v-col>
          <v-col>→</v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-menu
              v-model="menu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="datePickerDate"
                  label="毎月の起点日"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="datePickerDate" @input="menu = false" locale="ja-JP">
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <!-- TODO: 1ヶ月なのか、vs 日数指定 をラジオボタンで -->
            1ヶ月なのか<br />
            日数指定なのか
          </v-col>
          <v-col>
            <!-- TODO: 総時間 -->
            <label class="v-label v-label--active theme--light caption">総時間</label>
            <InputTime v-model="totalTime" :limitLength="3" />
          </v-col>
          <v-col>
            <!-- TODO: 日々の分割時間目安 -->
            <label class="v-label v-label--active theme--light caption">日々の分割時間目安</label>
            <InputTime v-model="baseTime" />
          </v-col>
          <v-col>
            <!-- TODO: 累積時間 -->
            <label class="v-label v-label--active theme--light caption">累積時間</label>
            <InputTime v-model="accumulationTotalTime" color="#cccccc" :limitLength="3" />
          </v-col>
          <v-col>
            <!-- TODO: 残時間 -->
            <label class="v-label v-label--active theme--light caption">残時間</label>
            <InputTime v-model="accumulationRemainingTime" color="#cccccc" :limitLength="3" />
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn large color="info" @click="showHolidays">日本の祝日を適用</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <input
              type="checkbox"
              id="isInputHoliday"
              :checked="isInputHoliday"
              @change="changeIsInputHoliday"
            />
            <label for="isInputHoliday">土日祝日も入力モードとするか</label>
          </v-col>
        </v-row>
      </v-container>
      <Calendar />
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import calendardata from './store/modules/data';
import Calendar from './components/Calendar.vue';
import InputTime from './components/InputTime.vue';

@Component({
  components: {
    Calendar,
    InputTime
  }
})
export default class App extends Vue {
  private datePickerDate = new Date().toISOString().substr(0, 10);
  private menu = false;

  get isInputHoliday(): boolean {
    return calendardata.moduleIsInputHoliday;
  }

  get weekStrings(): string[] {
    return calendardata.moduleWeekStrings;
  }
  get dataweeks(): CustomTypes.MyWeek[] {
    console.log('dataweeks');
    console.log(calendardata.moduleData);
    if (calendardata.moduleData.weeks) {
      console.log('dataweeks1');
      return calendardata.moduleData.weeks;
    } else {
      console.log('dataweeks2');
      return [];
    }
  }

  get days(): CustomTypes.MyDays {
    return calendardata.moduleDays;
  }
  get categoryNames(): string[] {
    return calendardata.moduleCategoryNames;
  }
  get totalTime(): CustomTypes.MyTime {
    return { strHours: '126', strMinutes: '30', hours: 126, minutes: 30 };
  }
  get baseTime(): CustomTypes.MyTime {
    return { strHours: '07', strMinutes: '30', hours: 7, minutes: 30 };
  }

  get accumulationTotalTime(): CustomTypes.MyTime {
    return calendardata.moduleAccumulationTimes.totalTime;
  }

  get accumulationRemainingTime(): CustomTypes.MyTime {
    return calendardata.moduleAccumulationTimes.remainingTime;
  }

  created() {
    // 初期値では今日を起点とした日付で情報を表示する
    const date = new Date(this.datePickerDate);
    calendardata.createCalendar(date);
  }

  @Watch('datePickerDate')
  private changeStartDay() {
    console.log(this.datePickerDate);
    const date = new Date(this.datePickerDate);
    calendardata.createCalendar(date);
  }
  @Watch('data')
  private changeCalendardata() {
    console.log('changeCalendardata');
  }
  private changeIsInputHoliday(event: Event) {
    calendardata.setIsInputHoliday(!this.isInputHoliday);
  }

  private showHolidays() {
    // 日本の祝日を適用ボタンを押されたら、データを取得してカレンダーに反映させる。
    var currentYear = new Date(this.datePickerDate).getFullYear();
    var strStartDate = currentYear - 1 + '/01/01';
    var strEndDate = currentYear + 1 + '/12/31';
    var _this = this;
    this.$script
      .getHolidays(strStartDate, strEndDate)
      .then(function(holidays) {
        console.log('getHolidays.then', holidays);
        // カレンダーに祝日を反映させる
        for (const [key, value] of Object.entries(holidays)) {
          console.log(key, value);
          const info: CustomTypes.HolidayInfo = {
            keyDayString: key,
            holidayName: value
          };
          calendardata.addHoliday(info);
        }
      })
      .catch(function(error) {
        console.error('getHolidays.error', error);
        // TODO:エラー処理の実装
      });
  }

  public copy() {
    var str = '';
    var _this = this;
    this.weekStrings.forEach((weekString: string) => {
      str += weekString;
      str += '\t';
      str += '\t';
      str += '\t';
      str += '\t';
    });
    str += '\r\n';
    this.dataweeks.forEach((week: CustomTypes.MyWeek) => {
      week.days.forEach((day: string) => {
        str += _this.days[day].date.getDate();
        str += '\t';
        str += '\t';
        str += _this.days[day].text;
        str += '\t';
        str += _this.days[day].holidayName;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: string) => {
        str += _this.days[day].planTime.hours + ':' + _this.days[day].planTime.minutes;
        str += '\t';
        str += '\t';
        str += '\t';
        str += '\t';
      });
      str += '\r\n';
      this.categoryNames.forEach((categoryName: string, index: number) => {
        week.days.forEach((day: string) => {
          str += '\t';
          str += categoryName;
          str += '\t';
          str += _this.days[day].categoryTimes[index].hours;
          str += ':' + _this.days[day].categoryTimes[index].minutes;
          str += '\t';
          str += '\t';
        });
        str += '\r\n';
      });
      week.days.forEach((day: string) => {
        str += '\t';
        str += '\t';
        str += '総時間';
        str += '\t';
        str += _this.days[day].totalTime.hours + ':' + _this.days[day].totalTime.minutes;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: string) => {
        str += '\t';
        str += '\t';
        str += '残時間';
        str += '\t';
        str += _this.days[day].remainingTime.hours;
        str += ':' + _this.days[day].remainingTime.minutes;
        str += '\t';
      });
      str += '\r\n';
    });

    var listener = function(e: any) {
      e.clipboardData.setData('text/plain', str);
      // 本来のイベントをキャンセル
      e.preventDefault();
      // 終わったら一応削除
      document.removeEventListener('copy', listener);
    };

    // コピーのイベントが発生したときに、クリップボードに書き込むようにしておく
    document.addEventListener('copy', listener);

    // コピー
    document.execCommand('copy');
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
