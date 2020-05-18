<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="500">
      <template v-slot:activator="{ on }">
        <v-btn color="primary lighten-2" dark v-on="on">
          カテゴリー編集
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="subtitle-2">
          カテゴリー編集
        </v-card-title>
        <v-card-text>
          カテゴリー別に日々の残時間を管理したい場合に利用してください。
          <v-text-field
            v-model="newCategoryName"
            class="subtitle-2"
            label="追加するカテゴリ略称"
            append-icon="mdi-plus-box"
            @click:append="addCategoryName"
          ></v-text-field>
          <v-list dense>
            <v-subheader>登録済みのカテゴリー一覧</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item v-for="(category, index) in categories" :key="index">
                <v-list-item-content>
                  <v-list-item-title v-text="category.name"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <label class="v-label v-label--active theme--light caption">予定総時間</label>
                  <InputTime
                    v-model="category.scheduledTime"
                    :limit-length="3"
                    @input="input"
                    size="small"
                  />
                </v-list-item-content>
                <v-list-item-content>
                  <label class="v-label v-label--active theme--light caption">累積総時間</label>
                  <InputTime v-model="category.actualTime" :readonly="true" size="small" />
                </v-list-item-content>
                <v-list-item-content>
                  <label class="v-label v-label--active theme--light caption">残時間</label>
                  <InputTime v-model="category.remainingTime" :readonly="true" size="small" />
                </v-list-item-content>
                <v-list-item-icon @click="delCategory">
                  <v-icon :data-category-name="category.name">mdi-delete</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>
      </v-card>
    </v-dialog>
  </div>
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
export default class CategoryEdit extends Vue {
  private dialog = false;
  private newCategoryName: string = '';

  get categories(): CustomTypes.Category[] {
    return calendardata.moduleCategories;
  }

  private addCategoryName() {
    if (this.newCategoryName) {
      calendardata.addCategory(this.newCategoryName);
      this.newCategoryName = '';
    }
  }
  private delCategory(event: MouseEvent) {
    const categoryName = (event.target as HTMLElement).getAttribute('data-category-name');
    if (categoryName) {
      calendardata.removeCategory(categoryName);
    }
  }
  private input() {
    calendardata.calc();
  }
}
</script>
