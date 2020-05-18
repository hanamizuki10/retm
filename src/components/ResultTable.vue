<template>
  <div>
    <div class="subtitle-2 font-weight-bold text-align-left">カテゴリ別時間情報</div>
    <v-data-table
      dense
      :headers="headers"
      :items="times"
      item-key="name"
      class="elevation-1 width-360"
      hide-default-footer
    >
      <template v-slot:item.remainingTime="{ item }">
        <span :class="getFontColor(item.remainingTime)">{{ item.remainingTime }}</span>
      </template>
    </v-data-table>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';

@Component
export default class ResultTable extends Vue {
  get categories(): CustomTypes.Category[] {
    return calendardata.moduleCategories;
  }
  get times(): any {
    var data = [];
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
      { text: '予定時間', align: 'end', width: 80, sortable: false, value: 'scheduledTime' },
      { text: '累積総時間', align: 'end', width: 100, sortable: false, value: 'actualTime' },
      { text: '残時間', align: 'end', width: 80, sortable: false, value: 'remainingTime' }
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

<style scoped>
.text-align-left {
  text-align: left;
}
.width-360 {
  width: 360px;
}
</style>
