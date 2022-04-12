import type { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface TlInterceptors {
  requestInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorCatch?: (err: any) => any
  responseInterceptor?: <T = AxiosResponse>(res: T) => T

  responseInterceptorCatch?: (err: any) => any
}
export interface TlRequestConfig extends AxiosRequestConfig {
  interceptors?: TlInterceptors
  showLoading?: boolean
}
