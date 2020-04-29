import Vue from "vue";
import Vuex from "vuex";
import VueCookies from "vue-cookies";

Vue.use(VueCookies);
Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    db: {
      clips: [
        {
          id: 1,
          content: "say something im giving up on you",
          time: ""
        }
      ]
    }
  },
  mutations: {
    updateDB(state, db) {
      state.db = db;
    }
  },
  actions: {
    getDB(state) {
      return state.db;
    }
  },
  modules: {}
});
