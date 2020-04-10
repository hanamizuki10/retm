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
      <div class="ml-4">
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
                  @change="loadCalendar"
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
      <table class="calendar">
        <tr>
          <td v-for="w in weekStrings" :key="w">
            {{ w }}
          </td>
        </tr>
        <tr v-for="week in data.weeks" :key="week">
          <td v-for="day in week.days" :key="day">
            <CalendarCell :data="day" :categoryNames="categoryNames" />
          </td>
        </tr>
      </table>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
  private today = '';
  private selectedDay = '';
  private datePickerDate = new Date().toISOString().substr(0, 10);
  private menu = false;
  private categoryNames = ['A', 'M', '他'];

  created() {
    // テストコード- GAS連携用
    var samplestring = this.$script
      .getSampleString()
      .then(function(value) {
        console.log('console.log', value);
      })
      .catch(function(error) {
        console.error('console.error', error);
      });
    console.log(samplestring);
    // テストコード- GAS連携用

    // 初期値では今日を起点とした日付で情報を表示する
    this.loadCalendar();
  }
  private loadCalendar() {
    const date = new Date(this.datePickerDate);
    var currentYear = date.getFullYear();
    var currentMonth = date.getMonth() + 1;
    var currentDate = date.getDate();

    const strMonth = ('0' + currentMonth).slice(-2);
    this.today = this.selectedDay = `${currentYear}-${strMonth}-${currentDate}`;
    console.log([currentYear, currentMonth, currentDate]);
    console.log([this.today, this.selectedDay]);

    this.data.firstDate = new Date(currentYear, currentMonth - 1, currentDate);
    this.data.lastDate = new Date(currentYear, currentMonth, currentDate);

    const firstday = this.data.firstDate.getDay();
    const lastday = this.data.lastDate.getDay();
    // Sunday - Saturday : 0 - 6
    if (firstday != 0) {
      for (var i = 0; i < firstday; i++) {
        const dt = new Date(currentYear, currentMonth - 1, currentDate);
        dt.setDate(dt.getDate() - (firstday - i));
        this.addData(dt, this.weekStrings[dt.getDay()], false, false);
      }
    }
    console.log('pre----');
    for (var i = 0; i < 32; i++) {
      const dt = new Date(currentYear, currentMonth - 1, currentDate);
      dt.setDate(dt.getDate() + i);
      this.addData(dt, this.weekStrings[dt.getDay()], false, i == 0);
      if (dt.toLocaleString() == this.data.lastDate.toLocaleString()) {
        console.log('break!');
        break;
      }
    }
    console.log('post----');
    if (lastday < 6) {
      var i = 1;
      const dt = new Date(currentYear, currentMonth, currentDate);
      do {
        dt.setDate(this.data.lastDate.getDate() + i);
        this.addData(dt, this.weekStrings[dt.getDay()], false, false);
        i++;
      } while (dt.getDay() < 6);
      console.log(dt.toLocaleString(), ' : ', this.weekStrings[dt.getDay()]);
    }
    var strStartDate = currentYear - 1 + '/01/01';
    var strEndDate = currentYear + 1 + '/12/31';
    this.$script
      .getHolidays(strStartDate, strEndDate)
      .then(function(value) {
        console.log('getHolidays.then', value);
      })
      .catch(function(error) {
        console.error('getHolidays.error', error);
      });
  }

  private showHolidays() {
    // 日本の祝日を適用ボタンを押されたら、データを取得してカレンダーに反映させる。
    var currentYear = new Date(this.datePickerDate).getFullYear();
    var strStartDate = currentYear - 1 + '/01/01';
    var strEndDate = currentYear + 1 + '/12/31';
    this.$script
      .getHolidays(strStartDate, strEndDate)
      .then(function(value) {
        console.log('getHolidays.then', value);
        // TODO:カレンダーに反映させる
      })
      .catch(function(error) {
        console.error('getHolidays.error', error);
        // TODO:エラー処理の実装
      });
  }

  private addData(dt: Date, week: String, isTarget: boolean, isCurrent: boolean) {
    const item: CustomTypes.MyDay = {
      date: dt,
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

    this.tempWeek.days.push(item);
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

  public copy() {
    var str = '';
    this.weekStrings.forEach((weekString: string) => {
      str += weekString;
      str += '\t';
      str += '\t';
      str += '\t';
      str += '\t';
    });
    str += '\r\n';
    this.data.weeks.forEach((week: CustomTypes.MyWeek) => {
      week.days.forEach((day: CustomTypes.MyDay) => {
        str += day.date.getDate();
        str += '\t';
        str += '\t';
        str += day.text;
        str += '\t';
        str += day.holidayName;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: CustomTypes.MyDay) => {
        str += day.planTime.hours + ':' + day.planTime.minutes;
        str += '\t';
        str += '\t';
        str += '\t';
        str += '\t';
      });
      str += '\r\n';
      this.categoryNames.forEach((categoryName: string, index: number) => {
        week.days.forEach((day: CustomTypes.MyDay) => {
          str += '\t';
          str += categoryName;
          str += '\t';
          str += day.categoryTimes[index].hours + ':' + day.categoryTimes[index].minutes;
          str += '\t';
          str += '\t';
        });
        str += '\r\n';
      });
      week.days.forEach((day: CustomTypes.MyDay) => {
        str += '\t';
        str += '\t';
        str += '総時間';
        str += '\t';
        str += day.totalTime.hours + ':' + day.totalTime.minutes;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: CustomTypes.MyDay) => {
        str += '\t';
        str += '\t';
        str += '残時間';
        str += '\t';
        str += day.remainingTime.hours + ':' + day.remainingTime.minutes;
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
table.calendar {
  border-collapse: collapse;
}
table.calendar td {
  border: solid 1px black;
  /*実線 1px 黒*/
}
</style>
