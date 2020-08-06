<template>
  <v-container>
    <v-container class="mb-2 blue lighten-5">
      <v-row no-gutters>
        <v-col>
          <v-textarea
            name="input-7-1"
            label="Add a new clip here!"
            v-model="newClip"
            @keydown="preventSpace"
          ></v-textarea>
        </v-col>
      </v-row>

      <v-row class="md-2 center">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-btn
              @click="onSubmit"
              x-large
              icon
              class="mr-2 myIcon"
              fab
              color="blue"
              v-on="on"
            >
              <v-icon>mdi-plus-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>Add Clip</span>
        </v-tooltip>
      </v-row>
    </v-container>

    <!-- the preview clip -->
    <v-alert text color="red" border="left">
      <div class="small-info">Created on: {{ previewClip.createdOn }}</div>

      <div class="d-flex justify-space-between">
        <span class="original-text">
          {{ newClip !== "" ? `${newClip}\n` : preview }}
        </span>

        <span>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small icon fab color="red" v-on="on">
                <v-icon dark>mdi-delete-forever</v-icon>
              </v-btn>
            </template>
            <span>Delete Clip ( Preview, can't be deleted )</span>
          </v-tooltip>

          <!-- Archive icon -->
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn small icon fab color="red" v-on="on">
                <v-icon dark>mdi-archive-arrow-down-outline</v-icon>
              </v-btn>
            </template>
            <span>Archive Clip ( Preview, can't be archived )</span>
          </v-tooltip>

          <!-- add to fav if already in favourite then show remove and filled icon-->
          <v-tooltip v-if="previewClip.fav" top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="previewAddToFav()"
                icon
                fab
                small
                color="orange"
                v-on="on"
              >
                <v-icon dark>mdi-star</v-icon>
              </v-btn>
            </template>
            <span>Remove from favourites</span>
          </v-tooltip>

          <!-- add to fav when not already in fav :-) -->
          <v-tooltip v-else top>
            <template v-slot:activator="{ on }">
              <v-btn
                @click="previewAddToFav()"
                icon
                fab
                small
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
                @click="previewCopy()"
                icon
                small
                fab
                color="green"
                v-on="on"
              >
                <v-icon class="myIcon">mdi-content-copy</v-icon>
              </v-btn>
            </template>
            <span>Copy Clip</span>
          </v-tooltip>
        </span>
      </div>
    </v-alert>

    <!-- showing all the clips -->
    <main v-if="clips.length > 0">
      <div v-for="(clip, i) in clips" :key="i">
        <v-alert
          v-if="!showArchived && !clip.archived"
          text
          color="blue"
          border="left"
        >
          <!-- showing the date -->
          <div class="small-info">Created on: {{ clip.createdOn }}</div>

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
                    small
                    icon
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
                    small
                    icon
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
                    icon
                    fab
                    small
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
                    icon
                    fab
                    small
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
                    icon
                    small
                    fab
                    color="green"
                    v-on="on"
                  >
                    <v-icon class="myIcon">mdi-content-copy</v-icon>
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
      <v-snackbar v-model="emptyStr" :timeout="timeout">
        {{ emptyText }}
        <v-btn color="blue" text @click="emptyStr = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="boolCopied" :timeout="timeout">
        {{ messageCopied }}
        <v-btn color="blue" text @click="boolCopied = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="notBoolCopied" :timeout="timeout">
        {{ stringNotCopied }}
        <v-btn color="blue" text @click="notBoolCopied = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="justGotDeleted" :timeout="timeout">
        {{ gotDeletedString }}
        <v-btn color="blue" text @click="justGotDeleted = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="justGotArchived" :timeout="timeout">
        {{ messageArchived }}
        <v-btn color="blue" text @click="justGotArchived = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="addedToFav" :timeout="timeout">
        {{ gotAddToFav }}
        <v-btn color="blue" text @click="addedToFav = false">Close</v-btn>
      </v-snackbar>
      <v-snackbar v-model="removedFromFav" :timeout="timeout">
        {{ gotRemovedFromFav }}
        <v-btn color="blue" text @click="removedFromFav = false">Close</v-btn>
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

      messageCopied: "Copied to clipboard.",
      preview: "Start typing to see preview.",
      emptyText: "Cannot add empty clip.",
      notCopied: "Couldn't copy to the clipboard, please grant the permission.",
      gotDeletedString: "Clip deleted!",
      gotAddToFav: "Added to favourites!",
      gotRemovedFromFav: "Removed from favourites!",
      messageArchived: "Clip Archived!",

      // logical parameters
      emptyStr: false,
      boolCopied: false,
      notBoolCopied: false,
      justGotDeleted: false,
      showArchived: false,
      justGotArchived: false,
      addedToFav: false,
      removedFromFav: false,

      // logic for the new life
      newClip: "",
      clips: [],
      previewClip: {
        id: 1,
        fav: false,
        createdOn: this.getNow(),
        archived: false
      },

      // forein component requirements
      timeout: 2000
    };
  },

  mounted() {
    if (JSON.parse(this.$cookies.get("clips"))) {
      this.clips = JSON.parse(this.$cookies.get("clips"));
    }

    // adding sample clip
    if (this.clips.length === 0) {
      this.clips.push({
        id: 0,
        title: "Sample clip.",
        fav: false,
        createdOn: this.getNow(),
        archived: false
      });
    }

    this.reorder();
  },

  methods: {
    reorder() {
      // reshuffling the array for the exact indexes

      this.clips.filter(clip => {
        clip.id = this.clips.indexOf(clip);
      });
    },
    manageCookie() {
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
        let newClipObj = {
          id: this.clips.length,
          title: this.newClip,
          fav: false,
          createdOn: this.getNow(),
          archived: false
        };

        // adding the clip to the start of the array and then reshuffling and making the new clip = ""
        this.clips = [newClipObj, ...this.clips];
        this.reorder();
        this.newClip = "";
        this.manageCookie();
      } else {
        this.clearSnacks();
        this.emptyStr = true;
      }
    },
    copyClip(id) {
      // method to copy to the clipboard if the permission is given

      navigator.clipboard
        .writeText(this.clips[id].title)
        .then(() => {
          this.clearSnacks();
          this.boolCopied = true;
        })
        .catch(() => {
          this.clearSnacks();
          this.notBoolCopied = true;
        });
    },
    deleteClip(id) {
      // deleting the clip

      this.clips.splice(id, 1);
      this.reorder();
      this.manageCookie();
      this.clearSnacks();
      this.justGotDeleted = true;
    },
    favouriteClip(id) {
      // adding to favourite

      if (this.clips[id].fav === true) {
        this.clips[id].fav = !this.clips[id].fav;
        this.manageCookie();
        this.clearSnacks();
        this.removedFromFav = true;
      } else {
        this.clips[id].fav = !this.clips[id].fav;
        this.manageCookie();
        this.clearSnacks();
        this.addedToFav = true;
      }
    },
    archiveClip(id) {
      // adding to favourite

      this.clips[id].archived = !this.clips[id].archived;
      this.manageCookie();
      this.clearSnacks();
      this.justGotArchived = true;
    },
    previewCopy() {
      //  Copy the preview Clip

      let toCopy =
        this.newClip.length > 0 ? this.newClip : "Start typing to see preview.";
      navigator.clipboard
        .writeText(toCopy)
        .then(() => {
          this.clearSnacks();
          this.boolCopied = true;
        })
        .catch(() => {
          this.clearSnacks();
          this.notBoolCopied = true;
        });
    },
    previewAddToFav() {
      // handling preview fav

      if (this.previewClip.fav === true) {
        this.previewClip.fav = !this.previewClip.fav;
        this.clearSnacks();
        this.removedFromFav = true;
      } else {
        this.previewClip.fav = !this.previewClip.fav;
        this.clearSnacks();
        this.addedToFav = true;
      }
    },
    clearSnacks() {
      //  clear all the snackbars for the new notification snack

      this.emptyStr = false;
      this.boolCopied = false;
      this.notBoolCopied = false;
      this.justGotDeleted = false;
      this.showArchived = false;
      this.justGotArchived = false;
      this.addedToFav = false;
      this.removedFromFav = false;
    },
    preventSpace(e) {
      //prevent additional white spaces from adding at start of input

      if (!this.newClip.length && (e.keyCode === 13 || e.keyCode === 32)) {
        //prevent input if enter or space is pressed when clip is empty

        e.preventDefault();
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
  font-size: 0.65em;
}

.original-text::first-letter {
  font-size: 1.5em;
}

.v-alert {
  padding: 6px 12px 6px 14px !important;
  border-radius: 8px !important;
}
</style>
