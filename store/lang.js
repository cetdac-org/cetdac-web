export const state = () => ({
  locales: ["en_US", "zh_Hans_CN", "zh_Hant_HK"], // available langages
  lang: null
})

export const mutations = {
  setLang (state, lang) {
    state.lang = lang
  }
}
