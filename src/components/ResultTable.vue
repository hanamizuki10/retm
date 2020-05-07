<template>
  <v-data-table
    dense
    :headers="headers"
    :items="times"
    item-key="name"
    class="elevation-1"
    hide-default-footer
  >
    <template v-slot:item.remainingTime="{ item }">
      <span :class="getFontColor(item.remainingTime)">{{ item.remainingTime }}</span>
    </template>
  </v-data-table>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';

@Component
export default class ResultTable extends Vue {
  get scheduledTime(): CustomTypes.MyTime {
    return calendardata.moduleInputTimes.scheduledTime;
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
  get times(): any {
    var data = [];
    data.push({
      name: '総',
      scheduledTime: this.scheduledTime.strHours + ':' + this.scheduledTime.strMinutes,
      actualTime: this.actualTime.strHours + ':' + this.actualTime.strMinutes,
      remainingTime: this.remainingTime.strHours + ':' + this.remainingTime.strMinutes
    });
    this.categories.forEach((category: CustomTypes.Category) => {
      data.push({
        name: category.name,
        scheduledTime: category.scheduledTime.strHours + ':' + category.scheduledTime.strMinutes,
        actualTime: category.actualTime.strHours + ':' + category.actualTime.strMinutes,
        remainingTime: category.remainingTime.strHours + ':' + category.remainingTime.strMinutes
      });
    });
    return data;
  }
  get headers(): any {
    return [
      {
        text: '',
        align: 'start',
        width: 100,
        sortable: false,
        value: 'name'
      },
      { text: '予定時間', align: 'end', width: 100, sortable: false, value: 'scheduledTime' },
      { text: '累積総時間', align: 'end', width: 100, sortable: false, value: 'actualTime' },
      { text: '残時間', align: 'end', width: 100, sortable: false, value: 'remainingTime' }
    ];
  }
  private getFontColor(value: string) {
    if (value.startsWith('-')) {
      return 'red--text';
    }
    return '';
  }
}
</script>
