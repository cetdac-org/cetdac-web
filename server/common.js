export default function API(axios) {
  axios.defaults.baseURL = 'https://www.iostabc.com/endpoint'

  const apiUrl = 'https://www.iostabc.com/api/abct'
  
  axios.interceptors.response.use(function (res) {
    return res.data ? res.data : Promise.reject(res)
  }, function (err) {
    return Promise.reject(err)
  })
  return {
    getContractBalcnce (contract='ContractGBxLy1B1jfGoAWUHGDW9k8hG7NRo4owwcerJmrNTK8xZ') {
      return axios.get(`/getTokenBalance/${contract}/iost/1`)
    },
    getTokenBalcnce (id) {
      return axios.get(`/getTokenBalance/${id}/abctest/1`)
    },
    getPrice () {
      return axios.get(`${apiUrl}/price`)
    },
    getObtainHistory ({ page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/historyobtainabct`,{
        params: {
          page,
          size,
        }
      })
    },
    getIssueHistory (account, { page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/issueobtainabct`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
    getExchangeHistory (account, { page = 1, size = 20 } = {}) {
      return axios.get(`${apiUrl}/exchangeobtainabct`,{
        params: {
          account,
          page,
          size,
        }
      })
    },
  }
}