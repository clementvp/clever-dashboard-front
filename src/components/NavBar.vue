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
  },
};
</script>
<style scoped>
.navbar {
  background-color: #80cbc4;
}
</style>
