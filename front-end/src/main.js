// src/main.js
import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import router from './router'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.config.productionTip = false

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCaJNUmCP8IWJbJ0vliXOXnPOq_0QYVaE0',
    libraries: 'places', // Se você precisar da biblioteca de lugares
  }
})

new Vue({
  vuetify,
  router,
  render: h => h(App)
}).$mount('#app');
