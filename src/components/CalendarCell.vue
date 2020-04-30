<template>
  <v-container fluid class="calendar-cell">
    <v-row>
      <v-col class="text-align-left subtitle-2" :class="cssDayRow">
        <label v-if="item.day === 1" class="overline">{{ item.month }}/</label>{{ item.day }}
        <label class="overline">{{ aliasName }}</label>
      </v-col>
    </v-row>
    <div v-if="isInput">
      <v-row>
        <v-col class="scheduledTime">
          <InputTime v-model="item.scheduledTime" size="medium" @input="input" />
        </v-col>
      </v-row>
      <v-row v-for="(category, index) in categories" :key="index">
        <v-col class="text-align-center categoryTimes">
          <label class="caption"> {{ category.name }} </label>
          <InputTime
            v-model="item.categories[category.name].scheduledTime"
            size="small"
            @input="input"
          />
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-text-field v-model="item.text" dense class="caption" @input="input" />
        </v-col>
      </v-row>
    </div>
    <div v-if="item.isTarget">
      <v-row>
        <v-col class="d-flex justify-space-between">
          <div v-if="isInput" class="d-inline-block justify-sm-start">
            <v-icon size="25" @click="lock" :color="isLockIconColor">{{ isLockIcon }}</v-icon>
            <v-icon size="25" @click="reset">mdi-eraser</v-icon>
          </div>
          <div></div>
          <div class="d-inline-block caption justify-sm-end" cols="8">
            総時間 {{ item.cumulativeTime.strHours + ':' + item.cumulativeTime.strMinutes }}<br />
            残時間
            <label :class="cssRemainingTime">
              {{ item.remainingTime.strHours + ':' + item.remainingTime.strMinutes }}
            </label>
          </div>
        </v-col>
      </v-row>
    </div>
    <v-row>
      <v-col class="font-red overline">{{ item.holidayName }}</v-col>
    </v-row>
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
  get aliasName(): string {
    if ('日' == this.item.week && this.item.isHoliday) {
      return '法定休日(祝)';
    } else if ('日' == this.item.week) {
      return '法定休日';
    } else if (this.item.isHoliday) {
      return '祝日';
    }
    return '';
  }
  get cssDayRow(): string {
    if ('日' == this.item.week) {
      return 'font-red';
    } else if (this.item.isHoliday) {
      return 'font-red';
    }
    return '';
  }
  get cssRemainingTime(): string {
    if (this.item.remainingTime.strHours.startsWith('-')) {
      return 'font-red';
    }
    return '';
  }
  get categories(): CustomTypes.Category[] {
    return calendardata.moduleCategories;
  }

  get isLockIcon(): string {
    if (this.item.isLock) {
      return 'mdi-lock';
    }
    return 'mdi-lock-open';
  }
  get isLockIconColor(): string {
    if (this.item.isLock) {
      return '';
    }
    return 'orange darken-2';
  }
  private input(event: Event) {
    // 累積時間、残時間の再計算を行う
    calendardata.calc();
    console.log('this.item.scheduledTime', this.item.scheduledTime);
  }
  private lock() {
    console.log('自動入力不可');
    calendardata.changeLock(this.keyDayString);
  }
  private reset() {
    console.log('入力値を初期化');
    calendardata.resetTimes(this.keyDayString);
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
.scheduledTime div {
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
