import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { TlInterceptors, TlRequestConfig } from './types'
import { ElLoading } from 'element-plus'
import { LoadingInstance } from 'element-plus/lib/components/loading/src/loading'

const DEFAULT_SHOW_LOADING = true
class TLRequest {
  instance: AxiosInstance
  interceptors?: TlInterceptors
  loadingInstance?: LoadingInstance
  showLoading: boolean

  constructor(config: TlRequestConfig) {
    // 创建实例
    this.instance = axios.create(config)
    // 初始化实例拦截器
    this.interceptors = config.interceptors
    // 是否显示loading
    this.showLoading = config.showLoading ?? DEFAULT_SHOW_LOADING

    // 注册实例拦截器
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )

    // 注册所有实例都有的拦截器
    this.instance.interceptors.request.use(
      (config) => {
        console.log('所有实例都有的请求成功拦截')

        // 显示loading
        if (this.showLoading) {
          this.loadingInstance = ElLoading.service({
            lock: true,
            text: '正在加载...',
            background: 'rgba(0,0,0,0.5)'
          })
        }

        return config
      },
      (err) => {
        console.log('所有实例都有的请求失败拦截')
        return err
      }
    )
    this.instance.interceptors.response.use(
      (res) => {
        console.log('所有实例都有的响应成功拦截')
        // 隐藏loading
        this.loadingInstance?.close()
        return res.data
      },
      (err) => {
        console.log('所有实例都有的响应失败拦截')
        // 隐藏loading
        this.loadingInstance?.close()
        return err
      }
    )
  }
  request<T = any>(config: TlRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      // 是否隐藏loading
      if (config.showLoading === false) {
        console.log(this.showLoading)
        this.showLoading = false
      }
      //单个请求拦截器
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config)
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
          // 单个响应拦截器
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor<T>(res)
          }
          // 将showLoading设置回默认
          this.showLoading = DEFAULT_SHOW_LOADING

          // 将结果使用resolve返回出去
          resolve(res)
        })
        .catch((err) => {
          // 将showLoading设置回默认
          this.showLoading = DEFAULT_SHOW_LOADING
          reject(err)
        })
    })
  }
  get<T = any>(config: TlRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'GET' })
  }
  post<T = any>(config: TlRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'POST' })
  }
  delete<T = any>(config: TlRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'DELETE' })
  }
  patch<T = any>(config: TlRequestConfig): Promise<T> {
    return this.request({ ...config, method: 'PATCH' })
  }
}

export default TLRequest
