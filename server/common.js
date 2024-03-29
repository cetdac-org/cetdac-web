export default function API(axios) {
  axios.defaults.baseURL = 'https://blockservice.bitapp.net.cn/admin/'

  axios.interceptors.response.use(function (res) {
    return res.data ? res.data : Promise.reject(res)
  }, function (err) {
    return Promise.reject(err)
  })
}