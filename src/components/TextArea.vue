<template>
  <v-container class="grey lighten-5">
    <v-row no-gutters>
      <v-col>
        <v-textarea
          name="mainInput"
          label="Add a new clip here!"
          v-model="newClip"
          @keydown="prevent_Space"
        ></v-textarea>
      </v-col>
    </v-row>

    <v-row class="center">
      <v-btn @click="onSubmit" class="ma-2" outlined large fab color="green">
        <v-icon dark>mdi-plus</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: "TextArea",

  data: function() {
    return {
      newClip: ""
    };
  },

  methods: {
    prevent_Space(event) {
      //prevent additional white spaces from adding at start of input
      if (
        !this.newClip.length &&
        (event.keyCode === 13 || event.keyCode === 32)
      ) {
        //prevent input if enter or space is pressed when clip is empty
        event.preventDefault();
      }
    }
  }
};
</script>

<style scoped></style>
