<template>
  <div class="home">
    <NavBar/>
    <b-loading :is-full-page="true" :active.sync="isLoading"></b-loading>
    <b-notification :active.sync="isNotificationActive" type="is-danger">{{notificationMsg}}</b-notification>
    <div class="container">
      <b-modal :active.sync="creationModalActive" has-modal-card>
        <div class="card">
          <div class="card-content">
            <h5 class="title is-5">Nouveau dashboard</h5>
            <b-field label="Nom du nouveau dashboard:">
              <b-input v-model="dashboardName"></b-input>
            </b-field>
            <div class="has-text-centered">
              <button class="button is-primary" @click="createNewDashboard">Créer</button>
            </div>
          </div>
        </div>
      </b-modal>
      <div>
        <h5 class="title is-5">Liste dashboards</h5>
      </div>
      <div>
        <b-table :data="dashboards" :paginated="true" :per-page="10">
          <template slot-scope="props">
            <b-table-column field="name" label="Nom" centered>{{ props.row.name }}</b-table-column>
            <b-table-column
              field="creation_date"
              label="Date de création"
              centered
            >{{ props.row.creation_date }}</b-table-column>
            <b-table-column field="delete" label="Supression">
              <button class="btn-table button is-danger" @click="deleteDashboard(props.row._id)">
                <span>
                  Supprimer
                  <font-awesome-icon icon="trash-alt"/>
                </span>
              </button>
            </b-table-column>
            <b-table-column field="edit" label="Edition" centered>
              <button class="btn-table button is-info" @click="goToPage( `/edit/${props.row._id}`)">
                <span>
                  Editer
                  <font-awesome-icon icon="edit"/>
                </span>
              </button>
            </b-table-column>
            <b-table-column field="see" label="Voir" centered>
              <button
                class="btn-table button is-success"
                @click="goToPage( `/view/${props.row._id}`)"
              >
                <span>
                  Voir
                  <font-awesome-icon icon="eye"/>
                </span>
              </button>
            </b-table-column>
          </template>
        </b-table>
      </div>
      <div>
        <button class="button is-primary" @click="clickButtonCreation">
          <span>
            Nouveau dashboard
            <font-awesome-icon icon="plus"/>
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios';
import NavBar from '../components/NavBar.vue';

export default {
  name: 'home',
  components: {
    NavBar,
  },
  data() {
    return {
      dashboards: [],
      dashboardName: '',
      notificationMsg: null,
      creationModalActive: false,
      isNotificationActive: false,
      isLoading: false,
      access_token: null,
    };
  },
  methods: {
    async retrieveAlldashboards() {
      this.isLoading = true;
      try {
        const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/dashboard`, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        this.dashboards = response.data.dashboards;
        this.isLoading = false;
      } catch (error) {
        console.log(error);
        this.notificationMsg = 'Une erreure est survenue lors de la récupération de la liste des dashboards';
        this.isLoading = false;
        this.isNotificationActive = true;
      }
    },
    async deleteDashboard(id) {
      try {
        await axios.delete(`${process.env.VUE_APP_API_BASE_URL}/dashboard/${id}`, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
        this.retrieveAlldashboards();
      } catch (error) {
        this.notificationMsg = 'Une erreure est survenue lors de la supression du dashboard';
        this.isNotificationActive = true;
      }
    },
    clickButtonCreation() {
      this.creationModalActive = true;
    },
    async createNewDashboard() {
      if (this.dashboardName !== '') {
        try {
          await axios.post(`${process.env.VUE_APP_API_BASE_URL}/dashboard`, { name: this.dashboardName }, { headers: { Authorization: `Bearer ${localStorage.getItem('access-token')}` } });
          this.dashboardName = '';
          this.retrieveAlldashboards();
          this.creationModalActive = false;
        } catch (error) {
          this.notificationMsg = 'Une erreure est survenue lors de la création du dashboard';
          this.isNotificationActive = true;
        }
      } else {
        this.notificationMsg = 'Merci de remplir un nom pour le dashboard';
        this.isNotificationActive = true;
      }
    },
    goToPage(path) {
      this.$router.push({ path });
    },
  },
  mounted() {
    this.retrieveAlldashboards();
  },
};
</script>
<style scoped>
.container {
  margin-top: 20px;
}
.btn-table {
  width: 107px;
}
</style>
