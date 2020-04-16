import Vue from 'vue';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import gasPlugin from './plugins/gas';

Vue.config.productionTip = false;
gasPlugin();
new Vue({
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
