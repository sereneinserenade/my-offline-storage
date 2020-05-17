<template>
  <v-container>
    <v-container class="mb-2 grey lighten-5">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            name="input-7-1"
            label="Add a new clip here!"
            v-model="newClip"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row class="md-2 center">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="onSubmit"
              class="mr-2"
              outlined
              large
              fab
              color="green"
              v-on="on"
            >
              <v-icon dark>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Add Clip</span>
        </v-tooltip>
      </v-row>
    </v-container>

    <v-alert text color="red" border="left">
      <div style="text-align: center">
        {{ newClip !== "" ? `${newClip}\n` : preview }}
      </div>
    </v-alert>

    <main v-if="clips.length > 0">
      <div v-for="(clip, i) in clips" :key="i">
        <v-alert
          v-if="!show_archived && !clip.archived"
          class="my-alert"
          text
          color="blue"
          border="left"
        >
          <!-- showing the date -->
          <div class="small-info">Created on: {{ clip.created_on }}</div>

          <div class="d-flex justify-space-between">
            <!-- showing the clip text an -->
            <span class="original-text">{{ clip.title }}</span>

            <!-- all the action buttons -->
            <span>
              <!-- delete icon -->
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="deleteClip(clip.id)"
                    class="ma-1"
                    outlined
                    x-small
                    fab
                    color="red"
                    v-on="on"
                  >
                    <v-icon dark>mdi-delete-forever</v-icon>
                  </v-btn>
                </template>
                <span>Delete Clip</span>
              </v-tooltip>

              <!-- Archive icon -->
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="archiveClip(clip.id)"
                    class="ma-1"
                    outlined
                    x-small
                    fab
                    color="red"
                    v-on="on"
                  >
                    <v-icon dark>mdi-archive-arrow-down-outline</v-icon>
                  </v-btn>
                </template>
                <span>Archive Clip</span>
              </v-tooltip>

              <!-- add to fav if already in favourite then show remove and filled icon-->
              <v-tooltip top v-if="clip.fav">
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="favouriteClip(clip.id)"
                    class="ma-1"
                    outlined
                    x-small
                    fab
                    color="orange"
                    v-on="on"
                  >
                    <v-icon dark>mdi-star</v-icon>
                  </v-btn>
                </template>
                <span>Remove from favourites</span>
              </v-tooltip>

              <!-- add to fav when not already in fav :-) -->
              <v-tooltip top v-else>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="favouriteClip(clip.id)"
                    class="ma-1"
                    outlined
                    x-small
                    fab
                    color="orange"
                    v-on="on"
                  >
                    <v-icon dark>mdi-star-outline</v-icon>
                  </v-btn>
                </template>
                <span>Add to Favourites</span>
              </v-tooltip>

              <!-- copy icon -->
              <v-tooltip top>
                <template v-slot:activator="{ on }">
                  <v-btn
                    @click="copyClip(clip.id)"
                    class="ma-1"
                    outlined
                    x-small
                    fab
                    color="green"
                    v-on="on"
                  >
                    <v-icon dark>mdi-content-copy</v-icon>
                  </v-btn>
                </template>
                <span>Copy Clip</span>
              </v-tooltip>
            </span>
          </div>
        </v-alert>
      </div>
    </main>

    <!-- all the notifications to user -->
    <div>
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
    </div>
  </v-container>
</template>

<script>
export default {
  name: "Local",

  data: function() {
    return {
      // messeges to be shown
      stringCopied: "Copied to clipboard.",
      preview: "Start typing to see preview.",
      emptyStringText: "Cannot add empty clip.",
      stringNotCopied:
        "Could not copy to the clipboard, is the App permitted ?",
      gotDeletedString: "Clip deleted!",
      messageAddToFav: "Added to favourites!",

      // logical parameters
      emptyString: false,
      copied: false,
      notCopied: false,
      just_got_deleted: false,
      show_archived: false,

      // logic for the new life
      newClip: "",
      clips: [],

      // forein component requirements
      timeout: 1500
    };
  },

  mounted() {
    if (JSON.parse(this.$cookies.get("clips"))) {
      this.clips = JSON.parse(this.$cookies.get("clips"));
    }
  },

  methods: {
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
          created_on: this.getNow(),
          archived: false
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
    copyClip(id) {
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
    deleteClip(id) {
      // deleting the clip

      this.clips.splice(id, 1);
      this.reshuffel();
      this.manage_cookie();
      this.just_got_deleted = true;
    },
    favouriteClip(id) {
      // adding to favourite

      this.clips[id].fav = !this.clips[id].fav;
      this.manage_cookie();
    },
    archiveClip(id) {
      // adding to favourite

      this.clips[id].archived = !this.clips[id].archived;
      this.manage_cookie();
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
  font-size: 0.65em;
}

.original-text::first-letter {
  font-size: 1.5em;
}

.bottom-nav {
  position: fixed !important;
  bottom: 0 !important ;
}
</style>
