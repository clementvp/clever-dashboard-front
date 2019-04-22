<template>
  <div class="edit">
    <NavBar/>
    <b-notification :type="notificationType" :active.sync="isNotificationActive">{{notificationMsg}}</b-notification>
    <div class="custom-container">
      <h5 class="title is-5">Edition: {{this.dashboard.name}}</h5>
      <div class="columns">
        <div class="column is-2">
          <b-tabs v-model="activeTab" type="is-boxed" size="is-small" expanded>
            <b-tab-item>
              <template slot="header">
                <span>
                  Commandes
                  <font-awesome-icon icon="cogs"/>
                </span>
              </template>
              <div>
                <button class="btn-cmd button is-success" @click="save()">
                  <span>
                    Sauvegarder
                    <font-awesome-icon icon="save"/>
                  </span>
                </button>
              </div>
              <div>
                <button class="btn-cmd button is-warning" @click="goToView()">
                  <span>
                    Voir
                    <font-awesome-icon icon="eye"/>
                  </span>
                </button>
              </div>
            </b-tab-item>
            <b-tab-item>
              <template slot="header">
                <span>
                  Plugins
                  <font-awesome-icon icon="plug"/>
                </span>
              </template>
              <div v-for="plugin in availablePlugins" :key="plugin">
                <button class="button btn-plugin is-primary" @click="addPlugin(plugin)">{{plugin}}</button>
              </div>
            </b-tab-item>
          </b-tabs>
        </div>
        <div class="column">
          <grid-layout
            id="grid"
            :layout.sync="plugins"
            :col-num="12"
            :row-height="30"
            :is-draggable="true"
            :is-resizable="true"
            :is-mirrored="false"
            :vertical-compact="false"
            :margin="[10, 10]"
            :use-css-transforms="true"
          >
            <grid-item
              id="item"
              v-for="item in plugins"
              :key="item.i"
              :x="item.x"
              :y="item.y"
              :w="item.w"
              :h="item.h"
              :i="item.i"
            >
              <div>Plugin: {{item.type}}</div>
              <div class="has-text-centered">
                <button class="btn-table button is-danger" @click="deletePlugin(item.i)">
                  <span>
                    <font-awesome-icon icon="trash-alt"/>
                  </span>
                </button>
              </div>
            </grid-item>
          </grid-layout>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import shortid from 'shortid';
import VueGridLayout from 'vue-grid-layout';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'edit',
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    NavBar,
  },
  data() {
    return {
      dashboard: {},
      plugins: [],
      availablePlugins: [],
      isNotificationActive: false,
      notificationMsg: null,
      notificationType: null,
      activeTab: 0,
    };
  },
  methods: {
    async save() {
      try {
        await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dashboard/${this.$route.params.id}/plugin`, { plugins: this.plugins }, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        this.$toast.open({
          message: 'Le dashboard a bien été sauvegardé',
          type: 'is-success',
        });
      } catch (error) {
        this.notificationType = 'is-danger';
        this.notificationMsg = 'Une erreure est survenue lors de la sauvegarde du dashboard';
        this.isNotificationActive = true;
      }
    },
    async getDashboardInfo(id) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dashboard/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        if (!response.data.dashboard) {
          this.notificationType = 'is-danger';
          this.notificationMsg = "Il n'y a pas de dashboard avec cet id";
          this.isNotificationActive = true;
        } else {
          this.dashboard = response.data.dashboard;
          this.dashboard.id = id;
          this.plugins = response.data.dashboard.plugins;
        }
      } catch (error) {
        this.notificationType = 'is-danger';
        this.notificationMsg = 'Une erreure est survenue lors de la récupération du dashboard';
        this.isNotificationActive = true;
      }
    },
    async getAvailablePlugins() {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/plugin`, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        this.availablePlugins = response.data.plugins;
      } catch (error) {
        this.notificationType = 'is-danger';
        this.notificationMsg = 'Une erreure est survenue lors de la récupération des plugins disponibles';
        this.isNotificationActive = true;
      }
    },
    addPlugin(plugin) {
      this.plugins.push({
        x: 0, y: 0, w: 4, h: 4, i: shortid.generate(), url: `${process.env.VUE_APP_PLUGINS_BASE_URL}/${plugin}`, type: plugin,
      });
    },
    deletePlugin(pluginId) {
      this.plugins = this.plugins.filter(value => value.i !== pluginId);
    },
    goToView() {
      this.$router.push({ path: `/view/${this.$route.params.id}` });
    },
  },
  mounted() {
    this.getDashboardInfo(this.$route.params.id);
    this.getAvailablePlugins();
  },
};
</script>
<style scoped>
.custom-container {
  margin-top: 20px;
  margin-left: 30px;
  margin-right: 30px;
}
#item {
  background-color: #dbdbdb;
}
#grid {
  background-color: #b5b5b5;
}
.btn-cmd,
.btn-plugin {
  margin-bottom: 10px;
  width: 150px;
}
</style>
