import axios from 'axios'
import type { LoginRequest, RegisterRequest, AuthResponse } from '../../../common/DataModels/User'
import { store, type RootState } from '../../../app/store';
import { clearCredentials, setCredentials } from '../slices/authSlice';
import { useAppDispatch } from '../../../app/hooks';
import { useNavigate } from 'react-router-dom';

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


api.interceptors.response.use( (response) => {
    console.log(response);
    return response
}, async (error ) => {
    const request = error.config;
    console.log(Object.keys(error))
    console.log(error.request)
    console.log(error.response)
    if (error.response?.status === 401 && !request._retry ) {
        console.log(error)
        request._retry = true;
        // const navigate = useNavigate();

        try {
            console.log(request)
            const data = await refreshToken();
            store.dispatch(setCredentials(data.access_token))
            
            request.headers['Authorization'] = `Bearer ${data.access_token}`;

            return await api(request);
        }catch(refreshError) {
            console.log("Token rotation failed")

            return Promise.reject(refreshError)
        }
    }
    return Promise.reject(error);

})


export const loginUser = (data:LoginRequest) : Promise<AuthResponse> =>
    api.post<AuthResponse>('/auth/login', data).then((res) => {
        return res.data
    });

export const registerUser = (data:RegisterRequest) : Promise<{ message : string }> =>
    api.post<{ message : string}>('/auth/register',data).then((res) => res.data);

export const logoutUser = () : Promise<{ message : string }> =>
    api.get<{ message : string }>('/auth/logout').then((res) => res.data);

export const refreshToken = () : Promise<{access_token : string, token_type: string}> => 
    api.post<{access_token : string, token_type: string}>('/auth/refresh').then(res => res.data)


export default api;

