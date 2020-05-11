<template>
  <v-container>
    <v-snackbar v-model="emptyString" :timeout="timeout">
      {{ emptyStringText }}
      <v-btn color="blue" text @click="emptyString = false">
        Close
      </v-btn>
    </v-snackbar>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            name="input-7-1"
            label="Add a new clip here!"
            v-model="newClip"
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
      <div style="text-align: center">
        {{ newClip !== "" ? newClip : preview }}
      </div>
    </v-alert>
    <v-container v-if="clips.length > 0">
      <v-alert
        v-for="(clip, i) in clips"
        :key="i"
        text
        color="blue"
        border="left"
        class="alertJustify"
      >
        {{ clip.title }}

        <!--        <span @click="copy(clip.id, $event)">-->
        <!--          <v-btn class="ma-2" outlined x-small fab color="indigo">-->
        <!--            <v-icon dark>mdi-content-copy</v-icon>-->
        <!--          </v-btn>-->
        <!--          <span style="visibility: hidden"> {{ clip.id }} </span>-->
        <!--        </span>-->
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Local",

  data: function() {
    return {
      newClip: "",
      clips: [],
      preview: "Here you'll see preview as soon as you start typing.",
      emptyString: false,
      emptyStringText: "Cannot add empty string",
      timeout: 3000
    };
  },

  mounted() {
    if (JSON.parse(this.$cookies.get("clips"))) {
      this.clips = JSON.parse(this.$cookies.get("clips"));
    }
    this.clips.forEach(e => {
      console.log(e.id, e.title);
    });
  },

  methods: {
    onSubmit() {
      //  doing all the internal process to update
      if (this.newClip !== "") {
        var newClipObj = {
          id: this.clips.length,
          title: this.newClip
        };
        this.clips = [newClipObj, ...this.clips];
        this.newClip = "";

        //  managing the cookies
        this.$cookies.set("clips", JSON.stringify(this.clips), Infinity);
      } else {
        this.emptyString = true;
      }
    }
  }
};
</script>

<style>
.center {
  display: flex;
  justify-content: center;
}
.alertJustify {
  display: flex;
  justify-content: space-between !important;
  align-content: space-between;
  text-align: center;
}
</style>
