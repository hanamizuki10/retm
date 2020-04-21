<template>
  <v-container class="calendar-cell">
    <v-row>
      <v-col class="text-align-left">
        <label v-if="item.day === 1" class="caption">{{ item.month }}/</label>
        {{ item.day }}
        <label class="font-red caption">{{ item.holidayName }}</label>
      </v-col>
    </v-row>
    <div v-if="isInput">
      <v-row>
        <v-col class="planTime">
          <InputTime v-model="item.planTime" size="medium" @input="input" />
        </v-col>
      </v-row>
      <v-row v-for="(categoryName, index) in categoryNames" :key="categoryName">
        <v-col class="text-align-center categoryTimes">
          <label class="caption"> {{ categoryName }} </label>
          <InputTime v-model="item.categoryTimes[index]" size="small" @input="input" />
        </v-col>
      </v-row>
    </div>
    <div v-if="item.isTarget">
      <v-row>
        <v-col class="text-align-right caption">
          総時間 {{ item.totalTime.strHours + ':' + item.totalTime.strMinutes }}
        </v-col>
      </v-row>
      <v-row>
        <v-col class="text-align-right caption">
          残時間 {{ item.remainingTime.strHours + ':' + item.remainingTime.strMinutes }}
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';
import InputTime from './InputTime.vue';

@Component({
  components: {
    InputTime
  }
})
export default class CalendarCell extends Vue {
  @Prop() private keyDayString!: string;
  @Prop() private categoryNames!: String[];

  get isInput(): boolean {
    if (!this.item.isTarget) {
      return false;
    }
    if (!calendardata.moduleIsInputHoliday) {
      if ('土' == this.item.week) {
        return false;
      } else if ('日' == this.item.week) {
        return false;
      } else if (this.item.isHoliday) {
        return false;
      }
    }
    return true;
  }

  get item(): CustomTypes.MyDay {
    return calendardata.moduleDays[this.keyDayString];
  }
  private input(event: Event) {
    // 累積時間、残時間の再計算を行う
    calendardata.calc();
    console.log('this.item.planTime', this.item.planTime);
  }
}
</script>

<style scoped>
.calendar-cell {
  padding-top: 0px;
  padding-bottom: 0px;
}
.calendar-cell div.row {
  border: none;
}
.calendar-cell div.col {
  border: none;
  padding-top: 0px;
  padding-bottom: 0px;
}
.text-align-center {
  text-align: center;
}
.text-align-right {
  text-align: right;
}
.text-align-left {
  text-align: left;
}
table.calendar v-col {
  border: none;
}
.planTime div {
  min-width: 80px;
}
.categoryTimes div {
  min-width: 70px;
}
.text div {
  width: 100px;
}
.font-red {
  color: red;
}
</style>
