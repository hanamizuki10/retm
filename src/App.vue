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
      <div>
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
        <v-row>
          <v-col cols="12" sm="6" md="4">
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
                  label="起点日"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker v-model="datePickerDate" @input="menu = false" locale="ja-JP">
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="6" md="4">
            <InputTime v-model="totalTime" />
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="12" sm="6" md="4">
            <v-btn large color="info" @click="showHolidays">日本の祝日を適用</v-btn>
          </v-col>
        </v-row>
      </div>
      <hr />
      <v-container class="calendar">
        <v-row>
          <v-col v-for="w in weekStrings" :key="w">
            {{ w }}
          </v-col>
        </v-row>
        <v-row v-for="week in data.weeks" :key="week">
          <v-col v-for="day in week.days" :key="day" :class="cellColor(day)">
            <CalendarCell :keyDayString="day" :categoryNames="categoryNames" />
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import calendardata from './store/modules/data';
import CalendarCell from './components/CalendarCell.vue';
import InputTime from './components/InputTime.vue';

@Component({
  components: {
    CalendarCell,
    InputTime
  }
})
export default class App extends Vue {
  private weekStrings = ['日', '月', '火', '水', '木', '金', '土'];
  private data: CustomTypes.MyMonth = { firstDate: null, lastDate: null, weeks: [] };
  private totalTime: CustomTypes.MyTime = { hours: 7, minutes: 30 };
  private tempWeek: CustomTypes.MyWeek = { days: [] };
  //private daylist: CustomTypes.MyDays = {};
  private today = '';
  private selectedDay = '';
  private datePickerDate = new Date().toISOString().substr(0, 10);
  private menu = false;
  //private categoryNames = ['A', 'M', '他'];

  get daylist(): CustomTypes.MyDays {
    return calendardata.days;
  }
  get categoryNames(): string[] {
    return calendardata.categoryNames;
  }

  created() {
    // 初期値では今日を起点とした日付で情報を表示する
    this.loadCalendar();
  }
  private loadCalendar() {
    const date = new Date(this.datePickerDate);
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    console.log('loadCalendar', targetYear, targetMonth, targetDate);
    // リセット
    this.data = { firstDate: null, lastDate: null, weeks: [] };

    const strMonth = ('0' + targetMonth).slice(-2);
    this.today = this.selectedDay = `${targetYear}-${strMonth}-${targetDate}`;
    console.log([targetYear, targetMonth, targetDate]);
    console.log([this.today, this.selectedDay]);

    this.data.firstDate = new Date(targetYear, targetMonth - 1, targetDate);
    this.data.lastDate = new Date(targetYear, targetMonth, targetDate - 1);

    const firstday = this.data.firstDate.getDay();
    const lastday = this.data.lastDate.getDay();
    // Sunday - Saturday : 0 - 6
    if (firstday != 0) {
      for (var i = 0; i < firstday; i++) {
        const dt = new Date(targetYear, targetMonth - 1, targetDate);
        dt.setDate(dt.getDate() - (firstday - i));
        this.addData(dt, this.weekStrings[dt.getDay()], false, false);
      }
    }
    console.log('pre----');
    for (var i = 0; i < 32; i++) {
      const dt = new Date(targetYear, targetMonth - 1, targetDate);
      dt.setDate(dt.getDate() + i);
      this.addData(dt, this.weekStrings[dt.getDay()], true, i == 0);
      if (dt.toLocaleString() == this.data.lastDate.toLocaleString()) {
        console.log('break!');
        break;
      }
    }
    console.log('post----');
    if (lastday < 6) {
      var i = 1;
      const dt = new Date(targetYear, targetMonth, targetDate);
      do {
        dt.setDate(this.data.lastDate.getDate() + i);
        this.addData(dt, this.weekStrings[dt.getDay()], false, false);
        i++;
      } while (dt.getDay() < 6);
      console.log(dt.toLocaleString(), ' : ', this.weekStrings[dt.getDay()]);
    }
  }

  @Watch('datePickerDate')
  private changeStartDay() {
    this.loadCalendar();
    console.log(this.datePickerDate);
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
        // TODO:カレンダーに反映させる
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

  private addData(dt: Date, week: string, isTarget: boolean, isCurrent: boolean) {
    const item: CustomTypes.MyDay = {
      date: dt,
      keyDayString: this.formatDate(dt),
      isTarget: isTarget,
      isCurrent: isCurrent,
      isHoliday: false, // TODO
      holidayName: '', // TODO
      week: week,
      planTime: { hours: 0, minutes: 0 },
      totalTime: { hours: 0, minutes: 0 },
      remainingTime: { hours: 0, minutes: 0 },
      categoryTimes: [],
      text: ''
    };
    this.categoryNames.forEach((weekString: string) => {
      item.categoryTimes.push({ hours: 0, minutes: 0 });
    });
    calendardata.addMyDay(item);

    this.tempWeek.days.push(item.keyDayString);
    console.log(
      dt.toLocaleString(),
      ' : ',
      this.weekStrings[dt.getDay()],
      'this.data.weeks.push',
      this.tempWeek.days.length
    );
    if (this.tempWeek.days.length == 7) {
      console.log('this.data.weeks.push', this.tempWeek.days.length);
      this.data.weeks.push(this.tempWeek);
      this.tempWeek = { days: [] };
    }
  }
  private formatDate(date: Date) {
    var targetYear = date.getFullYear();
    var targetMonth = date.getMonth() + 1;
    var targetDate = date.getDate();
    return targetYear + '-' + ('00' + targetMonth).slice(-2) + '-' + ('00' + targetDate).slice(-2);
  }

  private cellColor(keyDayString: string): string {
    if (!this.daylist[keyDayString].isTarget) {
      return 'not-target';
    }
    if ('土' == this.daylist[keyDayString].week) {
      return 'saturday';
    } else if ('日' == this.daylist[keyDayString].week) {
      return 'sunday';
    } else {
      return '';
    }
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
    this.data.weeks.forEach((week: CustomTypes.MyWeek) => {
      week.days.forEach((day: string) => {
        str += _this.daylist[day].date.getDate();
        str += '\t';
        str += '\t';
        str += _this.daylist[day].text;
        str += '\t';
        str += _this.daylist[day].holidayName;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: string) => {
        str += _this.daylist[day].planTime.hours + ':' + _this.daylist[day].planTime.minutes;
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
          str += _this.daylist[day].categoryTimes[index].hours;
          str += ':' + _this.daylist[day].categoryTimes[index].minutes;
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
        str += _this.daylist[day].totalTime.hours + ':' + _this.daylist[day].totalTime.minutes;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: string) => {
        str += '\t';
        str += '\t';
        str += '残時間';
        str += '\t';
        str += _this.daylist[day].remainingTime.hours;
        str += ':' + _this.daylist[day].remainingTime.minutes;
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
div.calendar div.row {
  border: solid 1px black;
}
div.calendar div.col {
  border: solid 1px black;
  padding: 0px;
}
.not-target {
  background-color: darkgray;
}
.saturday {
  background-color: aqua;
}
.sunday {
  background-color: burlywood;
}
</style>
