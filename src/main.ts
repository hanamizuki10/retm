import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import gasPlugin from './plugins/gas';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
gasPlugin();
new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
