<template>
  <div class="input-time" :class="size" :style="'background-color: ' + color">
    <input
      ref="r1"
      v-model="localValue.strHours"
      maxlength="2"
      @input="inputHours"
      @keyup.right="forcusMinutes"
      @click="$refs.r1.select()"
    />
    :
    <input
      ref="r2"
      v-model="localValue.strMinutes"
      maxlength="2"
      @input="inputMinutes"
      @keyup.left="forcusHours"
      @click="$refs.r2.select()"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit } from 'vue-property-decorator';

@Component
export default class InputTime extends Vue {
  @Prop() private value!: CustomTypes.MyTime;
  //@Prop({ default: 'small' }) private size!: string;
  @Prop({ default: 'medium' }) private size!: string;
  //@Prop({ default: 'large' }) private size!: string;
  //@Prop({ default: '#b0f3ff' }) private color!: string;
  @Prop({ default: '#ffffff' }) private color!: string;

  get refs(): any {
    return this.$refs;
  }

  private get localValue(): CustomTypes.MyTime {
    return this.value;
  }

  private set localValue(value: CustomTypes.MyTime) {
    this.input(value);
  }

  @Emit()
  public input(value: CustomTypes.MyTime) {}

  private inputHours(event: Event) {
    const charLength = String(this.value.strHours).length;
    this.value.hours = parseInt(this.value.strHours, 10); // TODO:数値以外の入力対策
    if (charLength === 2) {
      // ２文字入力された事を感知したら分へ移動
      this.forcusMinutes();
    }
  }

  private inputMinutes(event: Event) {
    const charLength = String(this.value.strMinutes).length;
    this.value.minutes = parseInt(this.value.strMinutes, 10); // TODO:数値以外の入力対策
    if (charLength === 0) {
      this.forcusHours();
    }
  }

  private forcusHours() {
    // 時間の入力にフォーカスを移動する
    this.refs.r1.focus();
    this.refs.r1.select();
  }
  private forcusMinutes() {
    // 分の入力にフォーカスを移動する
    this.refs.r2.focus();
    this.refs.r2.select();
  }
}
</script>

<style scoped>
.input-time {
  margin: 0px;
  padding: 0px;
}
input {
  margin: 0px;
  padding: 0px;
  text-align: center;
}
.input-time.small input {
  width: 25px;
  font-size: medium;
}
.input-time.medium input {
  width: 30px;
  font-size: large;
}
.input-time.large input {
  width: 30px;
  font-size: x-large;
}
</style>
