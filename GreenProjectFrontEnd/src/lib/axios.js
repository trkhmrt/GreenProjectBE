// lib/api.js
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8072/ael',
    //timeout: 30000,
    withCredentials: true
});

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    
  
    
    return config;
});

instance.interceptors.response.use(
  (response) => {
    if (response && response.config && ['post', 'put', 'delete'].includes(response.config.method)) {
      let msg = '';
      if (response.data && typeof response.data === 'string') msg = response.data;
      if (response.data && typeof response.data === 'object' && response.data.message) msg = response.data.message;
      if (!msg) msg = 'İşlem başarılı';
      if (msg) {
        window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg, type: 'success' } }));
      }
    }
    return response;
  },
  (error) => {
    let msg = 'Bir hata oluştu';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') msg = error.response.data;
      if (typeof error.response.data === 'object' && error.response.data.message) msg = error.response.data.message;
    }
    window.dispatchEvent(new CustomEvent('toast', { detail: { message: msg, type: 'error' } }));
    return Promise.reject(error);
  }
);

// Tüm istekler buradan yapılır
export const api = {
    get: (url, config) => instance.get(url, config),
    post: (url, data, config) => instance.post(url, data, config),
    put: (url, data, config) => instance.put(url, data, config),
    delete: (url, config) => instance.delete(url, config),
};


export default instance;