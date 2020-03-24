<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        残業管理くん
      </div>

      <v-spacer></v-spacer>

      <v-btn href="https://github.com/vuetifyjs/vuetify/releases/latest" target="_blank" text>
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn>
    </v-app-bar>

    <v-content>
      <div>
        <table class="calendar">
          <tr v-for="r in data.rows" :key="r">
            <td v-for="c in r.cells" :key="c">
              <CalendarCell :day="getDay(c)" holidayName="国民の祝日" />
            </td>
          </tr>
        </table>
      </div>
      <v-btn large color="primary" @click="copy">コピー</v-btn>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import CalendarCell from './components/CalendarCell.vue';

declare namespace CustomTypes {
  export interface Rows {
    rows: Cells[];
    count: number;
  }
  export interface Cells {
    cells: Cell[];
    count: number;
  }
  export interface Cell {
    date: Date;
    isCurrent: boolean;
  }
}
@Component({
  components: {
    CalendarCell
  }
})
export default class App extends Vue {
  private weeks = ['日', '月', '火', '水', '木', '金', '土'];
  private data: CustomTypes.Rows = { rows: [], count: 0 };
  private tempWeek: CustomTypes.Cells = { cells: [], count: 0 };
  private currentYear = 0;
  private currentMonth = 0;
  private currentDate = 0;
  private today = '';
  private selectedDay = '';

  created() {
    const date = new Date();
    [this.currentYear, this.currentMonth, this.currentDate] = [
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate()
    ];
    const afterMonthDate = new Date(this.currentYear, this.currentMonth, this.currentDate);
    console.log(
      date.toLocaleString('ja-JP-u-ca-japanese'),
      ' ~ ',
      afterMonthDate.toLocaleString('ja-JP-u-ca-japanese')
    );

    const strMonth = ('0' + this.currentMonth).slice(-2);
    this.today = this.selectedDay = `${this.currentYear}-${strMonth}-${this.currentDate}`;
    console.log([this.currentYear, this.currentMonth, this.currentDate]);
    console.log([this.today, this.selectedDay]);

    const firstDate = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
    const lastDate = new Date(this.currentYear, this.currentMonth, this.currentDate);
    const firstday = firstDate.getDay();
    const lastday = lastDate.getDay();
    // Sunday - Saturday : 0 - 6
    if (firstday != 0) {
      for (var i = 0; i < firstday; i++) {
        const dt = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
        dt.setDate(dt.getDate() - (firstday - i));
        this.log(dt);
        this.addData(dt, false);
      }
    }
    console.log('pre----');
    for (var i = 0; i < 32; i++) {
      const dt = new Date(this.currentYear, this.currentMonth - 1, this.currentDate);
      dt.setDate(dt.getDate() + i);
      this.log(dt);
      this.addData(dt, i == 0);
      if (dt.toLocaleString() == lastDate.toLocaleString()) {
        console.log('break!');
        break;
      }
    }
    console.log('post----');
    if (lastday < 6) {
      var i = 1;
      const dt = new Date(this.currentYear, this.currentMonth, this.currentDate);
      do {
        dt.setDate(lastDate.getDate() + i);
        this.log(dt);
        this.addData(dt, false);
      } while (dt.getDay() < 6);
    }
  }
  private addData(dt: Date, isCurrent: boolean) {
    const item: CustomTypes.Cell = { date: dt, isCurrent: isCurrent };
    this.tempWeek.cells.push(item);
    this.tempWeek.count++;
    if (this.tempWeek.count == 7) {
      this.data.rows.push(this.tempWeek);
      this.data.count++;
      this.tempWeek = { cells: [], count: 0 };
    }
  }

  private log(dt: Date) {
    console.log(dt.toLocaleString(), ' : ', this.weeks[dt.getDay()]);
  }

  public getDay(c: CustomTypes.Cell) {
    return c.date.getDate();
  }
  public copy() {
    var str = 'コピーする文字';

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
