// import axios from 'axios';
import CoockieService from './CoockieService.js';

const coockieService = new CoockieService()

const API_URL = 'http://localhost:8080/'

const api = axios.create({
    baseURL: API_URL,
})


function getAccessTokenFromCookies() {

    const accessToken = coockieService.getCookie('accessToken')

    if (!accessToken) {

        return

    }

    return accessToken

}


api.interceptors.request.use(

    config => {

        const token = getAccessTokenFromCookies()

        if (!token) {

            return config

        }

        if (token) {

            config.headers['Authorization'] = `Bearer ${token}`

        }

        return config

    },

    error => {

        return Promise.reject(error)

    }

)


export default api