import axios from 'axios';

export class AxiosWrapper {
  constructor(baseUrl: string, headers: any) {
    axios.defaults.baseURL = baseUrl;
    axios.defaults.headers = headers;
  }

  get<T>(api: string): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.get<T>(api).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  post<T>(api: string, params?: any): Promise<T> {
    return new Promise((resolve, reject) => {
      axios.post<T>(api, params).then(res => {
        resolve(res.data);
      }).catch(err => {
        reject(err);
      });
    });
  }
}
