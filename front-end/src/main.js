import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import router from './router';
window.DEBUG = process.env.NODE_ENV === 'development';

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app')
