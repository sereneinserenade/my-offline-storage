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
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row class="center">
        <v-btn @click="onSubmit" class="ma-2" outlined large fab color="indigo">
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
          <v-btn class="ma-2" outlined x-small fab color="indigo">
            <v-icon dark>mdi-content-copy</v-icon>
          </v-btn>
        </span>
        <span @click="delete_clip(clip.id)">
          <v-btn class="ma-2" outlined x-small fab color="indigo">
            <v-icon dark>mdi-delete</v-icon>
          </v-btn>
        </span>
        <span>{{ clip.title }}</span>
      </v-alert>
    </v-container>
  </v-container>
</template>

<script>
export default {
  name: "Local",

  data: function() {
    return {
      stringCopied: "Copied to clipboard",
      newClip: "",
      clips: [],
      preview: "Here you'll see preview as soon as you start typing.",
      emptyString: false,
      copied: false,
      notCopied: false,
      emptyStringText: "Cannot add empty string",
      timeout: 3000,
      stringNotCopied:
        "Could not copy to the clipboard, is the App permitted ?",
      gotDeletedString: "Clip has been successfully deleted",
      just_got_deleted: false
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

        this.reshuffel();
        this.newClip = "";
        this.manage_cookie();
      } else {
        this.emptyString = true;
      }
    },
    copy(id) {
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
      this.clips.splice(id, 1);
      this.reshuffel();
      this.manage_cookie();
      this.just_got_deleted = true;
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
