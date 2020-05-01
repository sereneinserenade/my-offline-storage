<template>
  <v-app>
    <v-content>
      <Local></Local>
    </v-content>
  </v-app>
</template>

<script>
import Local from "./components/Local";

export default {
  name: "App",

  components: {
    Local
  },

  data: () => ({
    //
  })
};
</script>
