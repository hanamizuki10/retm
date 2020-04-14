<template>
  <v-container class="calendar-cell">
    <v-row>
      <v-col lg="2">{{ item.date.getDate() }}</v-col>
      <v-col md="auto">{{ item.holidayName }}</v-col>
    </v-row>
    <div v-if="item.isTarget">
      <v-row>
        <v-col></v-col>
        <v-col md="auto" class="planTime">
          <InputTime v-model="item.planTime" size="medium" color="#b0f3ff" />
        </v-col>
        <v-col></v-col>
      </v-row>
      <v-row v-for="(categoryName, index) in categoryNames" :key="categoryName">
        <v-col>{{ categoryName }}</v-col>
        <v-col class="text-align-center categoryTimes">
          <InputTime v-model="item.categoryTimes[index]" size="small" color="#ffffff" />
        </v-col>
        <v-col></v-col>
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col class="text-align-right">総時間</v-col>
        <v-col>{{ item.totalTime.hours + ':' + item.totalTime.minutes }}</v-col>
      </v-row>
      <v-row>
        <v-col></v-col>
        <v-col class="text-align-right">残時間</v-col>
        <v-col>{{ item.remainingTime.hours + ':' + item.remainingTime.minutes }}</v-col>
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
    return calendardata.days[this.keyDayString];
  }
}
</script>

<style scoped>
div.calendar-cell div.row {
  border: none;
}
div.calendar-cell div.col {
  border: none;
  padding: 0px;
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
  width: 100px;
}
.planTime input {
  text-align: center;
}
.categoryTimes div {
  width: 100px;
}
.text div {
  width: 100px;
}
</style>
