<template>
  <v-container class="calendar">
    <v-row>
      <v-col v-for="w in weekStrings" :key="w">
        {{ w }}
      </v-col>
    </v-row>
    <v-row v-for="week in dataweeks" :key="week">
      <v-col v-for="day in week.days" :key="day" :class="cellColor(day)">
        <CalendarCell :keyDayString="day" :categoryNames="categoryNames" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';
import CalendarCell from './CalendarCell.vue';

@Component({
  components: {
    CalendarCell
  }
})
export default class Calendar extends Vue {
  get weekStrings(): string[] {
    return calendardata.moduleWeekStrings;
  }
  get dataweeks(): CustomTypes.MyWeek[] {
    return calendardata.moduleData.weeks;
  }
  get categoryNames(): string[] {
    return calendardata.moduleCategoryNames;
  }

  get days(): CustomTypes.MyDays {
    return calendardata.moduleDays;
  }

  private cellColor(keyDayString: string): string {
    if (!this.days[keyDayString].isTarget) {
      return 'not-target';
    }
    if ('土' == this.days[keyDayString].week) {
      return 'saturday';
    } else if ('日' == this.days[keyDayString].week) {
      return 'sunday';
    } else if (this.days[keyDayString].isHoliday) {
      return 'sunday';
    } else {
      return '';
    }
  }
}
</script>

<style scoped>
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