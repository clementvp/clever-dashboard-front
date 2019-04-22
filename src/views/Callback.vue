<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    handleLoginEvent(data) {
      this.$router.push(data.state.target || '/');
    },
  },
  async created() {
    try {
      await this.$auth.handleAuthentication();
    } catch (error) {
      console.log(error);
    }
  },
};
</script>
