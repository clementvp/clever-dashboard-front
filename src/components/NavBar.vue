<template>
  <div class="nav">
    <nav class="navbar">
      <div class="navbar-brand">
        <a class="navbar-item">Clever dashboards</a>
        <div class="navbar-burger" @click="showNav = !showNav" :class="{ 'is-active': showNav }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div class="navbar-menu" :class="{ 'is-active': showNav }">
        <div class="navbar-end">
          <a class="navbar-item" @click="goTo('/')">Accueil</a>
          <a id="user-item" class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">
              <font-awesome-icon icon="user"/>
            </a>
            <div class="navbar-dropdown">
              <a class="navbar-item" @click="logout">Logout</a>
            </div>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  data() {
    return {
      showNav: false,
    };
  },
  methods: {
    goTo(page) {
      this.$router.push(page);
    },
    logout() {
      this.$auth.logOut();
    },
  },
};
</script>
<style scoped>
.navbar {
  background-color: #80cbc4;
}
#user-item {
  margin-right: 50px;
}
</style>
