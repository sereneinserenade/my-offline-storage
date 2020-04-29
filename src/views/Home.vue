<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <Local> </Local>
  </div>
</template>

<script>
// @ is an alias to /src
import Local from "@/components/Local.vue";

export default {
  name: "Home",
  components: {
    Local
  }
};
</script>
