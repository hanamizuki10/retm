<template>
  <v-container class="calendar-cell">
    <v-row>
      <v-col lg="2">{{ item.day }},{{ item.isCurrent }}</v-col>
      <v-spacer></v-spacer>
      <v-col md="auto">{{ item.holidayName }}</v-col>
    </v-row>
    <div v-if="item.isTarget">
      <v-row>
        <v-col></v-col>
        <v-col md="auto" class="planTime">
          <InputTime v-model="item.planTime" size="medium" color="#b0f3ff" @input="input" />
        </v-col>
        <v-col></v-col>
      </v-row>
      <v-row v-for="(categoryName, index) in categoryNames" :key="categoryName">
        <v-col class="caption">{{ categoryName }}</v-col>
        <v-col class="text-align-center categoryTimes">
          <InputTime
            v-model="item.categoryTimes[index]"
            size="small"
            color="#ffffff"
            @input="input"
          />
        </v-col>
        <v-col></v-col>
      </v-row>
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
</style>
