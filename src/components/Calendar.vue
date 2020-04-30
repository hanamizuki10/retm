<template>
  <v-container class="calendar">
    <v-row class="subheader" align="center" align-content="center" justify="space-between">
      <v-col cols="3" class="text-align-left title">{{ startYear }}年{{ startMonth }}月</v-col>
      <v-col cols="9" dense class="text-align-right caption">
        <input
          type="checkbox"
          id="isInputHoliday"
          :checked="isInputHoliday"
          @change="changeIsInputHoliday"
        />
        <label for="isInputHoliday">土日祝日も入力モードとする</label>
      </v-col>
    </v-row>
    <v-row class="calendarbody">
      <v-col v-for="w in weekStrings" :key="w">
        {{ w }}
      </v-col>
    </v-row>
    <v-row class="calendarbody" v-for="week in dataweeks" :key="week">
      <v-col v-for="day in week.days" :key="day" :class="cellColor(day)">
        <CalendarCell :keyDayString="day" />
      </v-col>
    </v-row>
    <v-row class="subfooter">
      <v-col dense class="width130 text-align-left">
        <label class="v-label v-label--active theme--light caption">累積総時間</label><br />
        <InputTime v-model="actualTime" :readonly="true" />
      </v-col>
      <v-col dense class="width130 text-align-left">
        <label class="v-label v-label--active theme--light caption">残時間</label><br />
        <InputTime v-model="remainingTime" :readonly="true" />
      </v-col>
    </v-row>
    <v-row class="subfooter" v-for="(category, index) in categories" :key="index">
      <v-col dense class="width130 text-align-left">
        <label class="v-label v-label--active theme--light caption">”{{ category.name }}”</label>
        <label class="v-label v-label--active theme--light caption">の累積総時間</label><br />
        <InputTime v-model="category.actualTime" :readonly="true" />
      </v-col>
      <v-col dense class="width130 text-align-left">
        <label class="v-label v-label--active theme--light caption">”{{ category.name }}”</label>
        <label class="v-label v-label--active theme--light caption">の残時間</label><br />
        <InputTime v-model="category.remainingTime" :readonly="true" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';
import CalendarCell from './CalendarCell.vue';
import InputTime from './InputTime.vue';

@Component({
  components: {
    CalendarCell,
    InputTime
  }
})
export default class Calendar extends Vue {
  get weekStrings(): string[] {
    return calendardata.moduleWeekStrings;
  }
  get dataweeks(): CustomTypes.MyWeek[] {
    return calendardata.moduleData.weeks;
  }
  get startYear(): number {
    return calendardata.moduleInputTimes.startYear;
  }
  get startMonth(): number {
    return calendardata.moduleInputTimes.startMonth;
  }
  get days(): CustomTypes.MyDays {
    return calendardata.moduleDays;
  }
  get actualTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.actualTime;
  }
  get remainingTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.remainingTime;
  }
  get categories(): CustomTypes.Category[] {
    return calendardata.moduleCategories;
  }
  get isInputHoliday(): boolean {
    return calendardata.moduleIsInputHoliday;
  }
  private changeIsInputHoliday(event: Event) {
    calendardata.setIsInputHoliday(!this.isInputHoliday);
  }
  private cellColor(keyDayString: string): string {
    // 対象外
    if (!this.days[keyDayString].isTarget) {
      return 'notarget';
    }
    // 休み系
    if ('土' == this.days[keyDayString].week) {
      return 'holiday';
    } else if ('日' == this.days[keyDayString].week) {
      return 'holiday';
    } else if (this.days[keyDayString].isHoliday) {
      return 'holiday';
    }
    // 本日
    if (this.days[keyDayString].isCurrent) {
      return 'today';
    }
    return '';
  }
}
</script>

<style scoped>
.calendar {
  max-width: 1162px;
  min-width: 1162px;
}
.calendar .calendarbody .col {
  border-bottom: solid 0.1px lightgrey;
  padding: 0px;
  max-width: 166px;
  min-width: 166px;
}
.calendar .subheader .col {
  padding: 0px;
  border: none;
}
.text-align-left {
  text-align: left;
}
.text-align-right {
  text-align: right;
}
.holiday {
  background-color: #e4e4e4;
}
.notarget {
  background-color: #d3d3d3;
}
.today {
  background-color: #d7f9ff;
}
</style>
