import axios from 'axios';
import { AxiosPromise } from 'axios';
export { AxiosPromise } from 'axios';

export class AxiosWrapper {
  constructor(baseUrl: string, headers: any) {
    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers = headers;
  }

  get<T>(api: string): AxiosPromise<T> {
    return axios.get<T>(api);
  }

  post<T>(api: string, params?: any): AxiosPromise<T> {
    return axios.post<T>(api, params);
  }
}
