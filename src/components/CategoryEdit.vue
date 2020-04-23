<template>
  <div class="text-center">
    <v-dialog v-model="dialog" width="300">
      <template v-slot:activator="{ on }">
        <v-btn color="red lighten-2" dark v-on="on">
          カテゴリー編集
        </v-btn>
      </template>

      <v-card>
        <v-card-title class="headline grey lighten-2" primary-title>
          カテゴリー編集
        </v-card-title>

        <v-card-text>
          <v-text-field
            v-model="newCategoryName"
            label="追加するカテゴリ略称"
            append-icon="mdi-plus-box"
            @click:append="addCategoryName"
            @keydown="keydownTextField"
          ></v-text-field>
          <v-list dense>
            <v-subheader>登録済みのカテゴリー一覧</v-subheader>
            <v-list-item-group color="primary">
              <v-list-item
                v-for="(categoryName, i) in categoryNames"
                :key="i"
                @click="delCategoryName"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="categoryName"></v-list-item-title>
                </v-list-item-content>
                <v-list-item-icon>
                  <v-icon>mdi-delete</v-icon>
                </v-list-item-icon>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="dialog = false">
            OK
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import calendardata from '../store/modules/data';

@Component
export default class CategoryEdit extends Vue {
  private dialog = false;
  private newCategoryName: string = '';
  get categoryNames(): string[] {
    return calendardata.moduleCategoryNames;
  }
  private keydownTextField(event: KeyboardEvent) {
    console.log(event.key);
    if (event.key === 'Enter') {
      if (this.newCategoryName.trim() !== '') {
        calendardata.addCategoryName(this.newCategoryName);
        this.newCategoryName = '';
      }
    }
  }
  private addCategoryName() {
    console.log('addCategoryName', this.newCategoryName);
    calendardata.addCategoryName(this.newCategoryName);
    this.newCategoryName = '';
  }
  private delCategoryName(event: MouseEvent) {
    const categoryName = (event.target as HTMLElement).innerText;
    console.log('delCategoryName', event, categoryName);
    calendardata.removeCategoryName(categoryName);
  }
}
</script>
