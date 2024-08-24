import axios from 'axios';
import useAuthStore from "./stores/auth.js";
const api = axios.create({
    baseURL: 'http://192.168.10.2/china_module_c_backend/public/api/v1',
});


//add interceptors
api.interceptors.request.use((req) =>{
    const authStore = useAuthStore();
    req.headers = {
        'Authorization' : `Bearer ${authStore.token}`,
        'Accept' : 'application/json',
    };
    return req;
},(err)=>{
    console.error(err);
    return Promise.reject(err);

});

api.interceptors.response.use((res) =>{
    return res;
},(err)=>{
    console.error(err);

    return Promise.reject(err);
});


export default api;
