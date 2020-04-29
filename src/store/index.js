import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    clips: []
  },
  mutations: {
    updateClips(state, clips) {
      state.clips = clips;
    },
    updateCookieClips(state) {
      Vue.$cookies.set("clips", state.clips, Infinity);
    }
  },
  actions: {
    getInitClips(state) {
      if (Vue.$cookies.get("clips")) {
        state.clips = Vue.$cookies.get("clips");
      }
    }
  },
  modules: {}
});
