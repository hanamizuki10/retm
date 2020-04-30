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
      <v-container fluid class="calendarheader">
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
        <v-row dense style="background-color: #efede8;" justify="start" align="center">
          <v-col dense class="width130">
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
                  prepend-icon="mdi-calendar-today"
                  readonly
                  hide-details
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
          <v-col dense class="width130">
            <label class="v-label v-label--active theme--light caption">予定総時間</label><br />
            <InputTime v-model="scheduledTime" :limit-length="3" @input="inputTotalTime" />
          </v-col>
          <v-col dense class="width130">
            <label class="v-label v-label--active theme--light caption">累積総時間</label><br />
            <InputTime v-model="actualTime" :readonly="true" />
          </v-col>
          <v-col dense class="width130">
            <label class="v-label v-label--active theme--light caption">残時間</label><br />
            <InputTime v-model="remainingTime" :readonly="true" />
          </v-col>
          <v-col dense class="width140">
            <label class="v-label v-label--active theme--light caption">目安時間の自動入力</label>
            <br />
            <InputTime v-model="baseTime" @input="inputBaseTime" />
            <v-tooltip bottom>
              <template v-slot:activator="{ on }">
                <v-btn
                  class="mx-2"
                  fab
                  dark
                  x-small
                  depressed
                  color="accent"
                  v-on="on"
                  @click="autoInput"
                >
                  <v-icon dark>mdi-pencil</v-icon>
                </v-btn>
              </template>
              <span>自動入力許可されている日付に自動入力する</span>
            </v-tooltip>
          </v-col>
          <v-col dense>
            <CategoryEdit />
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
import CategoryEdit from './components/CategoryEdit.vue';

@Component({
  components: {
    Calendar,
    CategoryEdit,
    InputTime
  }
})
export default class App extends Vue {
  private startDate = new Date().toISOString().substr(0, 10);
  private datePickerMenu = false;
  private checkbox = true;

  created() {
    calendardata.init();
    this.showHolidays();
  }
  get categories(): CustomTypes.Category[] {
    return calendardata.moduleCategories;
  }

  get weekStrings(): string[] {
    return calendardata.moduleWeekStrings;
  }
  get days(): CustomTypes.MyDays {
    return calendardata.moduleDays;
  }
  get scheduledTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.scheduledTime;
  }
  get actualTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.actualTime;
  }
  get remainingTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.remainingTime;
  }
  get baseTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.baseTime;
  }
  get startYear(): number {
    return calendardata.moduleInputTimes.startYear;
  }
  get startMonth(): number {
    return calendardata.moduleInputTimes.startMonth;
  }
  get startDay(): number {
    return calendardata.moduleInputTimes.startDay;
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
  private inputTotalTime(event: Event) {
    calendardata.calc();
  }
  private inputBaseTime(event: Event) {
    console.log('inputBaseTime-baseTime', this.baseTime.strHours, this.baseTime.strMinutes);
  }

  private autoInput() {
    calendardata.setAutoPlanTime();
  }

  private isDisabled(month: number): boolean {
    return this.startMonth === month;
  }
  private changeMonth(newTargetMonth: number) {
    console.log('changeMonth', newTargetMonth);
    var targetYear = this.startYear;
    var targetMonth = newTargetMonth;
    var targetDate = this.startDay;
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
      targetYear + '-' + ('00' + newTargetMonth).slice(-2) + '-' + ('00' + targetDate).slice(-2);
    console.log('切り替え', date);
    calendardata.setStartDate(date);
    this.startDate = date;
    this.showHolidays();
  }
  private changeDatePicker(date: string) {
    console.log('changeDatePicker', date);
    calendardata.setStartDate(date);
    this.showHolidays();
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
        str += _this.days[day].day;
        str += '\t';
        str += '\t';
        str += '\t';
        str += _this.days[day].holidayName;
        str += '\t';
      });
      str += '\r\n';
      week.days.forEach((day: string) => {
        str += _this.days[day].scheduledTime.hours + ':' + _this.days[day].scheduledTime.minutes;
        str += '\t';
        str += '\t';
        str += '\t';
        str += '\t';
      });
      str += '\r\n';
      this.categories.forEach((category: CustomTypes.Category) => {
        week.days.forEach((day: string) => {
          str += '\t';
          str += category.name;
          str += '\t';
          str += _this.days[day].categories[category.name].scheduledTime.hours;
          str += ':' + _this.days[day].categories[category.name].scheduledTime.minutes;
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
        str += _this.days[day].cumulativeTime.hours + ':' + _this.days[day].cumulativeTime.minutes;
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
      week.days.forEach((day: string) => {
        str += _this.days[day].text;
        str += '\t';
        str += '\t';
        str += '\t';
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
.calendarheader {
  max-width: 960px;
  min-width: 960px;
  padding: 0px;
}
.width130 {
  max-width: 130px;
}
.width140 {
  max-width: 140px;
}
.text-align-right {
  text-align: right;
}
.text-align-left {
  text-align: left;
}
.primary.test {
  color: hsl(250, 100%, 20%);
}
.secondary.test {
  color: #424242;
}
.accent.test {
  color: #82b1ff;
}
.error.test {
  color: #ff5252;
}
.info.test {
  color: #2196f3;
}
.success.test {
  color: #4caf50;
}
.warning.test {
  color: #ffc107;
}
</style>
