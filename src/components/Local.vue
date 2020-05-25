<template>
  <v-container>
    <v-snackbar v-model="emptyString" :timeout="timeout">
      {{ emptyStringText }}
      <v-btn color="blue" text @click="emptyString = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="copied" :timeout="timeout">
      {{ stringCopied }}
      <v-btn color="blue" text @click="copied = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="notCopied" :timeout="timeout">
      {{ stringNotCopied }}
      <v-btn color="blue" text @click="notCopied = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="just_got_deleted" :timeout="timeout">
      {{ gotDeletedString }}
      <v-btn color="blue" text @click="just_got_deleted = false">Close</v-btn>
    </v-snackbar>
    <v-container class="grey lighten-5">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            name="input-7-1"
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

    <v-container class="center">Preview</v-container>

    <v-alert text color="red" border="left">
      <div style="text-align: center">
        {{ newClip !== "" ? `${newClip}\n` : preview }}
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
        <span @click="copy(clip.id)">
          <v-btn class="ma-2" outlined x-small fab color="green">
            <v-icon dark>mdi-content-copy</v-icon>
          </v-btn>
        </span>
        <span v-if="clip.fav" @click="to_favourite(clip.id)">
          <v-btn class="ma-2" outlined x-small fab color="orange">
            <v-icon dark>mdi-star</v-icon>
          </v-btn>
        </span>
        <span v-else @click="to_favourite(clip.id)">
          <v-btn class="ma-2" outlined x-small fab color="orange">
            <v-icon dark>mdi-star-outline</v-icon>
          </v-btn>
        </span>
        <span @click="delete_clip(clip.id)">
          <v-btn class="ma-2" outlined x-small fab color="red">
            <v-icon dark>mdi-delete-forever</v-icon>
          </v-btn>
        </span>
        <span>{{ clip.title }}</span>
        <span class="small-info"> Created on: {{ clip.created_on }} </span>
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Local",

  data: function() {
    return {
      stringCopied: "Copied to clipboard.",
      newClip: "",
      clips: [],
      preview: "Start typing to see preview",
      emptyString: false,
      copied: false,
      notCopied: false,
      emptyStringText: "Cannot add empty clip.",
      timeout: 1000,
      stringNotCopied:
        "Could not copy to the clipboard, is the App permitted ?",
      gotDeletedString: "Clip deleted!",
      just_got_deleted: false,
      messageAddToFav: "Added to favourites!"
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
    getNow() {
      // getting the current time

      const today = new Date();
      const month = today.toLocaleString("default", { month: "long" });
      const date = today.getDate() + " " + month + ", " + today.getFullYear();
      return date + " " + today.getHours() + ":" + today.getMinutes();
    },
    onSubmit() {
      //  doing all the internal process to update

      if (this.newClip !== "") {
        var newClipObj = {
          id: this.clips.length,
          title: this.newClip,
          fav: false,
          created_on: this.getNow()
        };

        // adding the clip to the start of the array and then reshuffling and making the new clip = ""
        this.clips = [newClipObj, ...this.clips];
        this.reshuffel();
        this.newClip = "";
        this.manage_cookie();
      } else {
        this.emptyString = true;
      }
    },
    copy(id) {
      // method to copy to the clipboard if the permission is given

      navigator.clipboard
        .writeText(this.clips[id].title)
        .then(() => {
          this.copied = true;
        })
        .catch(() => {
          this.notCopied = true;
        });
    },
    delete_clip(id) {
      // deleting the clip

      this.clips.splice(id, 1);
      this.reshuffel();
      this.manage_cookie();
      this.just_got_deleted = true;
    },
    to_favourite(id) {
      // adding to favourite

      this.clips[id].fav = !this.clips[id].fav;
      this.manage_cookie();
    },
    reshuffel() {
      // reshuffling the array for the exact indexes

      this.clips.filter(clip => {
        clip.id = this.clips.indexOf(clip);
      });
    },
    manage_cookie() {
      //  managing the cookies

      this.$cookies.set("clips", JSON.stringify(this.clips), Infinity);
    },
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

<style>
.center {
  display: flex;
  justify-content: center;
}
.small-info {
  position: absolute;
  right: 0.36em;
  bottom: 0.18em;
  font-size: 0.85em;
}
/* better look for the small devices */
@media (max-width: 720px) {
  .small-info {
    font-size: 0.65em;
  }
}
</style>
