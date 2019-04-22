<template>
  <div class="view">
    <b-notification type="is-danger" :active.sync="isNotificationActive">{{notificationMsg}}</b-notification>
    <div class="container">
      <grid-layout
        id="grid"
        :layout.sync="plugins"
        :col-num="12"
        :row-height="30"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="false"
        :margin="[10, 10]"
        :use-css-transforms="false"
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
          <iframe :src="item.url" frameborder="0" style="width:100%; height:100%;"></iframe>
        </grid-item>
      </grid-layout>
    </div>
  </div>
</template>
<script>
import axios from 'axios';

export default {
  name: 'view',
  data() {
    return {
      dashboard: {},
      plugins: [],
      isNotificationActive: false,
      notificationMsg: null,
    };
  },
  methods: {
    async getDashboardInfo(id) {
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dashboard/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        this.dashboard = response.data.dashboard;
        this.dashboard.id = id;
        this.plugins = response.data.dashboard.plugins;
        if (!this.dashboard) {
          this.notificationMsg = "Il n'existe pas de dashboard avec cet Id";
          this.isNotificationActive = true;
        }
      } catch (error) {
        this.notificationMsg = 'Une erreure est survenue lors de la récupération de ce dashboard';
        this.isNotificationActive = true;
      }
    },
  },
  mounted() {
    this.getDashboardInfo(this.$route.params.id);
  },
};
</script>
