<template>
  <table>
    <tr>
      <td>{{ day }}</td>
      <td></td>
      <td></td>
      <td>{{ holidayName }}</td>
    </tr>
    <tr>
      <td colspan="4" class="text-align-center">7:30</td>
    </tr>
    <tr>
      <td></td>
      <td>顧</td>
      <td>4:00</td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>A</td>
      <td>2:00</td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td>他</td>
      <td>1:00</td>
      <td></td>
    </tr>
    <tr>
      <td></td>
      <td></td>
      <td class="text-align-right">総時間</td>
      <td>39:04</td>
    </tr>
  </table>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class CalendarCell extends Vue {
  @Prop() private day!: string;
  @Prop() private holidayName!: string;
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
