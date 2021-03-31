//This file is the main point of configuration for the application.
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false

import "bootstrap/dist/css/bootstrap.min.css";
import "font-awesome/css/font-awesome.min.css";
import store from "./store";
import router from "./router";

//Add Vue Filter for currency
Vue.filter("currency", (value) => new Intl.NumberFormat("en-US", {style: "currency", currency: "USD"}).format(value));

//Common mistake is to forget to add the import below in the configuration object which will result in error.
new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
