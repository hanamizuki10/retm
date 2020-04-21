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
          <v-col>
            <v-btn rounded @click="changeMonth(0)">＜</v-btn>
            <v-btn rounded :disabled="isDisabled(1)" @click="changeMonth(1)">1月</v-btn>
            <v-btn rounded :disabled="isDisabled(2)" @click="changeMonth(2)">2月</v-btn>
            <v-btn rounded :disabled="isDisabled(3)" @click="changeMonth(3)">3月</v-btn>
            <v-btn rounded :disabled="isDisabled(4)" @click="changeMonth(4)">4月</v-btn>
            <v-btn rounded :disabled="isDisabled(5)" @click="changeMonth(5)">5月</v-btn>
            <v-btn rounded :disabled="isDisabled(6)" @click="changeMonth(6)">6月</v-btn>
            <v-btn rounded :disabled="isDisabled(7)" @click="changeMonth(7)">7月</v-btn>
            <v-btn rounded :disabled="isDisabled(8)" @click="changeMonth(8)">8月</v-btn>
            <v-btn rounded :disabled="isDisabled(9)" @click="changeMonth(9)">9月</v-btn>
            <v-btn rounded :disabled="isDisabled(10)" @click="changeMonth(10)">10月</v-btn>
            <v-btn rounded :disabled="isDisabled(11)" @click="changeMonth(11)">11月</v-btn>
            <v-btn rounded :disabled="isDisabled(12)" @click="changeMonth(12)">12月</v-btn>
            <v-btn rounded @click="changeMonth(13)">＞</v-btn>
          </v-col>
        </v-row>
      </v-container>
      <v-container>
        <v-row>
          <v-col>
            <v-menu
              v-model="datePickerMenu"
              :close-on-content-click="false"
              :nudge-right="40"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on }">
                <v-text-field
                  v-model="startDay"
                  label="毎月の起点日"
                  readonly
                  v-on="on"
                ></v-text-field>
              </template>
              <v-date-picker
                v-model="startDate"
                @change="changeDatePicker"
                @input="datePickerMenu = false"
                locale="ja-JP"
                :day-format="date => new Date(date).getDate()"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col>
            <!-- TODO: 1ヶ月なのか、vs 日数指定 をラジオボタンで -->
            1ヶ月なのか<br />
            日数指定なのか
          </v-col>
          <v-col>
            <!-- TODO: 総時間 -->
            <label class="v-label v-label--active theme--light caption">総時間</label><br />
            <InputTime v-model="totalTime" :limit-length="3" @input="inputTotalTime" />
          </v-col>
          <v-col>
            <!-- TODO: 累積時間 -->
            <label class="v-label v-label--active theme--light caption">累積時間</label><br />
            <InputTime v-model="accumulationTotalTime" />
          </v-col>
          <v-col>
            <!-- TODO: 残時間 -->
            <label class="v-label v-label--active theme--light caption">残時間</label><br />
            <InputTime v-model="accumulationRemainingTime" />
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            <v-btn large color="info" @click="showHolidays">日本の祝日を適用</v-btn>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <!-- TODO: 日々の分割時間目安 -->
            便利機能、自動入力
            <label class="v-label v-label--active theme--light caption">日々の分割時間目安</label>
            <InputTime v-model="baseTime" @input="inputBaseTime" />
            <v-btn large color="info">自動入力</v-btn>
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
      {{ startYear }}年{{ startMonth }}月
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
  private startDate = new Date().toISOString().substr(0, 10);
  private datePickerMenu = false;

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
    return calendardata.moduleInputTimes.totalTime;
  }
  get baseTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.baseTime;
  }
  get startYear(): number {
    return calendardata.moduleInputTimes.startYear;
  }
  get startMonth(): number {
    console.log('startMonth', calendardata.moduleInputTimes.startMonth);
    return calendardata.moduleInputTimes.startMonth;
  }
  get startDay(): number {
    console.log('startDay', calendardata.moduleInputTimes.startDay);
    return calendardata.moduleInputTimes.startDay;
  }
  get accumulationTotalTime(): CustomTypes.MyTime {
    console.log('startMonth', calendardata.moduleInputTimes.startMonth);
    return calendardata.moduleAccumulationTimes.totalTime;
  }

  get accumulationRemainingTime(): CustomTypes.MyTime {
    return calendardata.moduleAccumulationTimes.remainingTime;
  }

  created() {
    // 初期値では今日を起点とした日付で情報を表示する
    const date = new Date(this.startDate);
    calendardata.createCalendar(date);
  }

  @Watch('data')
  private changeCalendardata() {
    console.log('changeCalendardata');
  }
  private changeIsInputHoliday(event: Event) {
    calendardata.setIsInputHoliday(!this.isInputHoliday);
  }
  private inputTotalTime(event: Event) {
    console.log('inputTotalTime-totalTime', this.totalTime.strHours, this.totalTime.strMinutes);
    console.log('inputTotalTime-baseTime', this.baseTime.strHours, this.baseTime.strMinutes);
    calendardata.calc();
  }
  private inputBaseTime(event: Event) {
    console.log('inputBaseTime-totalTime', this.totalTime.strHours, this.totalTime.strMinutes);
    console.log('inputBaseTime-baseTime', this.baseTime.strHours, this.baseTime.strMinutes);
  }
  private isDisabled(month: number): boolean {
    return this.startMonth === month;
  }
  private changeMonth(newTargetMonth: number) {
    console.log('changeMonth', newTargetMonth);
    const nowStartDate = new Date(this.startDate);
    var targetYear = nowStartDate.getFullYear();
    var targetMonth = newTargetMonth;
    var targetDate = nowStartDate.getDate();
    if (newTargetMonth === 0) {
      // 前年の12月へ
      targetYear -= 1;
      newTargetMonth = 12;
    } else if (newTargetMonth === 13) {
      // 次年の1月へ
      targetYear += 1;
      newTargetMonth = 1;
    }
    const date =
      targetYear + '-' + ('00' + targetMonth).slice(-2) + '-' + ('00' + targetDate).slice(-2);
    calendardata.setStartDate(date);
    this.startDate = date;
  }
  private changeDatePicker(date: string) {
    console.log('changeDatePicker', date);
    calendardata.setStartDate(date);
  }

  private showHolidays() {
    // 日本の祝日を適用ボタンを押されたら、データを取得してカレンダーに反映させる。
    var currentYear = new Date(this.startDate).getFullYear();
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
