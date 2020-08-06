import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clips: [],
    emptyString: false,
    copied: false,
    notCopied: false,
    preview: "Start typing to see preview",
    stringCopied: "Copied to clipboard.",
    emptyStringText: "Cannot add empty clip.",
    messageAddToFav: "Added to favourites!",
    stringNotCopied: "Could not copy to the clipboard, is the App permitted ?",
    gotDeletedString: "Clip deleted!",
    just_got_deleted: false,
    timeout: 1000
  },
  mutations: {
    onSubmit(state, newClip) {
      //  doing all the internal process to update
      if (this.newClip !== "") {
        var newClipObj = {
          id: state.clips.length,
          title: newClip,
          fav: false,
          created_on: this.$store.dispatch("getNow")
        };
        // adding the clip to the start of the array and then reshuffling and making the new clip = ""
        state.clips = [newClipObj, ...this.clips];
        this.reshuffel();
        this.newClip = "";
        this.manage_cookie();
      } else {
        this.emptyString = true;
      }
    }
  },
  actions: {
    getNow() {
      // getting the current time

      const today = new Date();
      const month = today.toLocaleString("default", { month: "long" });
      const date = today.getDate() + " " + month + ", " + today.getFullYear();
      return date + " " + today.getHours() + ":" + today.getMinutes();
    }
  },
  modules: {}
});
