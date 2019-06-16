
export const state = () => ({
  errorText: null,
  successText: null,
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
  }
}