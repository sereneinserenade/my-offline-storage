<template>
  <v-app>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data: () => ({}),
  mounted() {
    this.$store.dispatch("getInitClips");
  }
};
</script>
