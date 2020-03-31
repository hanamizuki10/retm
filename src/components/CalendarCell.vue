<template>
  <table>
    <tr>
      <td>{{ data.date.getDate() }}</td>
      <td></td>
      <td>{{ data.text }}</td>
      <td>{{ data.holidayName }}</td>
    </tr>
    <tr>
      <td colspan="4" class="text-align-center">{{ data.planTime.inputTime }}</td>
    </tr>
    <tr v-for="(categoryName, index) in categoryNames" :key="categoryName">
      <td></td>
      <td>{{ categoryName }}</td>
      <td>{{ data.categoryTimes[index].inputTime }}</td>
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
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CalendarCell extends Vue {
  //@Prop() private data!: CustomTypes.MyDay;
  @Prop() private data!: any;
  @Prop() private categoryNames!: String[];
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
</style>
