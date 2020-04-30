<template>
  <div class="input-time" :class="cssClass">
    <input
      ref="r1"
      class="hours"
      v-model="value.strHours"
      :maxlength="limitLength"
      @input="inputHours"
      @keyup.right="forcusMinutes"
      @click="$refs.r1.select()"
    />
    :
    <input
      ref="r2"
      class="minutes"
      v-model="value.strMinutes"
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
  @Prop({ default: 2 }) private limitLength!: number;

  get refs(): any {
    return this.$refs;
  }
  get cssClass(): string {
    var time = this.value.hours + this.value.minutes;
    if (time === 0) {
      return this.size; // 未入力
    } else if (this.value.strHours.startsWith('-')) {
      return this.size + ' inputerror'; // マイナス値
    } else {
      return this.size + ' input'; // 登録値あり
    }
  }

  private inputHours(event: Event) {
    console.log('inputHours', this.limitLength);

    // 入力値に:が含まれていたら無条件で右側に移動
    var isforcusMinutes = false;
    if (':' === this.value.strHours.slice(-1)) {
      this.value.strHours = this.value.strHours.slice(0, -1);
      isforcusMinutes = true;
    }

    const charLength = String(this.value.strHours).length;
    this.value.hours = parseInt(this.value.strHours, 10); // TODO:数値以外の入力対策
    console.log('inputHours', this.limitLength, charLength);
    console.log(charLength === this.limitLength);
    if (charLength === this.limitLength) {
      // ２文字入力された事を感知したら分へ移動
      isforcusMinutes = true;
    }
    this.$emit('input', this.value);
    if (isforcusMinutes) {
      this.forcusMinutes();
    }
  }

  private inputMinutes(event: Event) {
    console.log('inputMinutes');
    const charLength = String(this.value.strMinutes).length;
    this.value.minutes = parseInt(this.value.strMinutes, 10); // TODO:数値以外の入力対策
    if (charLength === 0) {
      this.forcusHours();
    }
    this.$emit('input', this.value);
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
  /* border-bottom: 0.5px solid #bbbbbb;*/ /* 下線 */
  display: inline;
  color: darkgrey;
}
.input-time.input {
  color: blue;
}
.input-time.inputerror {
  color: red;
}
input {
  margin: 0px;
  padding: 0px;
  text-align: center;
}
input.hours {
  text-align: right;
}
input.minutes {
  text-align: left;
}
.input-time.small input {
  font-size: medium;
}
.input-time.small input.hours {
  width: 30px;
}
.input-time.small input.minutes {
  width: 25px;
}
.input-time.medium input {
  font-size: large;
}
.input-time.medium input.hours {
  width: 40px;
}
.input-time.medium input.minutes {
  width: 30px;
}
.input-time.large input {
  font-size: x-large;
}
.input-time.large input.hours {
  width: 40px;
}
.input-time.large input.minutes {
  width: 30px;
}
</style>
