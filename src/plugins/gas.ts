import Vue from 'vue';
import { GoogleScript } from '@/google/script';

export default () => {
  const script = new GoogleScript();
  Vue.prototype.$script = script;
};
