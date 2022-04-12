import { BASE_URL, TIME_OUT } from './request/config'
import TLRequest from './request'

const tlRequest = new TLRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor(config) {
      // 是否携带token
      const token = ''
      if (token) {
        config.headers!.Authorization = `Bearer ${token}`
      }
      console.log('实例请求成功拦截')
      return config
    },
    requestInterceptorCatch(err) {
      console.log('实例请求失败拦截')
      return err
    },
    responseInterceptor(res) {
      console.log('实例响应成功拦截')
      return res
    },
    responseInterceptorCatch(err) {
      console.log('实例响应失败拦截')
      return err
    }
  }
})

export default tlRequest
