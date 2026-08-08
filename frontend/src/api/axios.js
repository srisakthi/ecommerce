import axios from "axios";

import {

    getAccessToken

} from "../utils/token";

const api = axios.create({

    baseURL:"http://localhost:5000/api/v1",

    withCredentials:true

});

api.interceptors.request.use(

(config)=>{

    const token = getAccessToken();

    if(token){

        config.headers.Authorization =

            `Bearer ${token}`;

    }

    return config;

}

);

export default api;