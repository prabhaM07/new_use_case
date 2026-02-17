import axios from 'axios'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../common/DataModels/User'
import { store, type RootState } from '../../../app/store';
import { clearCredentials } from '../slices/authSlice';

const api = axios.create(
    {
        baseURL: 'http://localhost:8000',
        withCredentials: true,
        headers: {
            'Content-Type' : 'application/json'
        }
    }
);

api.interceptors.request.use((config) => {
    
    const storee = store.getState() as RootState;

    if (storee.auth.token)
        config.headers['Authorization'] = `Bearer ${storee.auth.token}`

    return config
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
        store.dispatch(clearCredentials());
    }
    return Promise.reject(error);
  }
);

export const loginUser = (data:LoginRequest) : Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/login', data).then((res) => {
        return res.data
    });

export const registerUser = (data:RegisterRequest) : Promise<{ message : string }> =>
    api.post<{ message : string}>('/auth/register',data).then((res) => res.data);

export const logoutUser = () : Promise<{ message : string }> =>
    api.get<{ message : string }>('/auth/logout').then((res) => res.data);

export default api;

