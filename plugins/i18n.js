import Vue from "vue";
import globalMessages from "~/pages/global.messages.json";
import cookies from "~/plugins/cookies";

// use this mixin to tell our i18n helper which language is showing
// !!! the key must be $lang, which will be referenced by the helper !!!
export default ({
  app,
  store,
}) => {
  if (process.client) {
    const langs = store.state.lang.locales;
    const search = window.location.search || "";
    const matchs = search.trim().replace(/^[?#&]/, "").split("&");
    for (let i = 0; i < matchs.length; i++) {
      if (/^lang=/.test(matchs[i])) {
        const lang = matchs[i].replace(/^lang=/, "");
        if (lang && (langs.indexOf(lang) !== -1)) {
          console.log('lang==',lang);
          const expire = new Date(new Date().getTime() + (30 * 24 * 60 * 60 * 1000));
          cookies.setItem(window.document, "lang", lang, expire, "/");
        }
      }
    }
  }else{

  }

  if (Vue.$plugins_i18n_installed) {
    return;
  }
  Vue.$plugins_i18n_installed = true;

  Object.defineProperty(Vue.prototype, "$lang", {
    get() {
      return store.state.lang.lang;
    },
    set(value) {
      store.state.lang.lang = value;
    },
  });
  // Vue.prototype.$lang = store.state.lang.lang;

  Vue.mixin({
    methods: {
      $globalT(key) {
        key = key.replace(/\./g, "@@@");
        return globalMessages[this.$lang || "zh_Hans_CN"][key] || "---";
      },
    },
  });
};
