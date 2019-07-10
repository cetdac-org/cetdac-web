
export const state = () => ({
  errorText: null,
  successText: null,
  walletAccount:null,
  lang:null,
  axios: null
})

export const mutations = {
  setErrorText(state, data) {
    state.errorText = data
  },
  setSuccessText(state, data) {
    state.successText = data
  },
  setAxios(state, axios) {
    state.axios = axios
  },
  setWalletAccount(state, data){
    state.walletAccount = data
  },
  setLang(state, data){
    state.lang = data
  }
}
export const getters = {
  getWalletAccount ( state ){
    return state.walletAccount
  }
}
