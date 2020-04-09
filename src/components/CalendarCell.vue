<template>
  <table :class="cellColor">
    <tr>
      <td>{{ data.date.getDate() }}</td>
      <td></td>
      <td colspan="2">{{ data.holidayName }}</td>
    </tr>
    <tr>
      <td colspan="4" class="text-align-center planTime">
        <v-text-field name="planTime" v-model="data.planTime.inputTime" outlined></v-text-field>
      </td>
    </tr>
    <tr v-for="(categoryName, index) in categoryNames" :key="categoryName">
      <td></td>
      <td colspan="2" class="text-align-center categoryTimes">
        <v-text-field
          name="categoryTimes"
          :label="categoryName"
          v-model="data.categoryTimes[index].inputTime"
          outlined
          dense
        ></v-text-field>
      </td>
      <td></td>
    </tr>
    <tr>
      <td colspan="3" class="text-align-right">総時間</td>
      <td>{{ data.totalTime.inputTime }}</td>
    </tr>
    <tr>
      <td colspan="3" class="text-align-right">残時間</td>
      <td>{{ data.remainingTime.inputTime }}</td>
    </tr>
    <tr>
      <td colspan="4" class="text-align-center text">
        <v-textarea name="text" label="備考" v-model="data.text" rows="1" outlined></v-textarea>
      </td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CalendarCell extends Vue {
  //@Prop() private data!: CustomTypes.MyDay;
  @Prop() private data!: any;
  @Prop() private categoryNames!: String[];

  get cellColor() {
    if ('土' == this.data.week) {
      return 'saturday';
    } else if ('日' == this.data.week) {
      return 'sunday';
    } else {
      return '';
    }
  }
}
</script>

<style scoped>
.text-align-center {
  text-align: center;
}
.text-align-right {
  text-align: right;
}
table.calendar td {
  border: none;
}
.saturday {
  background-color: aqua;
}
.sunday {
  background-color: burlywood;
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
