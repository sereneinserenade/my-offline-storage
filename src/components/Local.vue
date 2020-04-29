<template>
  <v-container>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            name="input-7-1"
            label="Add a new clip here!"
            v-model="newclip"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row class="center">
        <v-btn @click="onSubmit" class="ma-2" outlined large fab color="indigo">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
      </v-row>
    </v-container>

    <v-container class="center">
      Preview
    </v-container>

    <v-alert text color="red" border="left">
      {{ newclip != "" ? newclip : preview }}
    </v-alert>
    <v-container>
      <v-alert
        v-for="(clip, i) in clips"
        :key="i"
        text
        color="blue"
        icon="far fa-copy"
        border="left"
      >
        {{ clip.title }}
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Local",

  data: () => ({
    newclip: "",
    clips: [],
    preview: "Here you'll see preview as soon as you start to type.",
    emptyError: "Cannot add an Empty Clip."
  }),

  methods: {
    onSubmit() {
      if (this.newclip != "") {
        var newClipObj = {
          id: this.clips.length + 1,
          title: this.newclip
        };
      } else {
        alert(this.emptyError);
      }
      this.clips = [newClipObj, ...this.clips];
      this.newclip = "";
    }
  }
};
</script>

<style>
.center {
  display: flex;
  justify-content: center;
}
</style>
