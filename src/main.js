import Vue from 'vue';
import Buefy from 'buefy';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faTrashAlt, faEdit, faEye, faPlus, faSave, faCogs, faPlug,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import App from './App.vue';
import router from './router';
import store from './store';
import 'buefy/dist/buefy.css';

library.add(faTrashAlt);
library.add(faEdit);
library.add(faEye);
library.add(faSave);
library.add(faPlus);
library.add(faCogs);
library.add(faPlug);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.use(Buefy);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
