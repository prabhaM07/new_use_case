import axios from 'axios'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../common/DataModels/User'
import { store, type RootState } from '../../../app/store';

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

    if (storee.auth.isAuthenticated)
        config.headers['Authorization'] = `Bearer ${storee.auth.token}`

    return config
});

export const loginUser = (data:LoginRequest) : Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/login', data).then((res) => {
        return res.data
    });

export const registerUser = (data:RegisterRequest) : Promise<{ message : string }> =>
    api.post<{ message : string}>('/auth/register',data).then((res) => res.data);

export const logoutUser = () : Promise<void> =>
    api.post('/auth/logout').then(() => undefined);

export default api;

