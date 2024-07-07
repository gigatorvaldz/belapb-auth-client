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


function getRefreshTokenFromCookies() {

    const refreshToken = coockieService.getCookie('refreshToken')

    if (!refreshToken) {

        return

    }

    return refreshToken

}


api.interceptors.request.use(

    async config => {

        let token = getAccessTokenFromCookies()


        if (!token) {

            const refreshToken = getRefreshTokenFromCookies()


            if (refreshToken) {

                const refreshResponse = await axios.post(
                    `${API_URL}refresh_token`,
                    {},
                    {
        
                        headers: {
                            'Authorization': `Bearer ${refreshToken}`
                        }
        
                    }
                )
        

                if (refreshResponse.status !== 200) {

                    return alert('Auth error')
                    
                }


                coockieService.setCookie('accessToken', refreshResponse.data.access_token, refreshResponse.data.access_token_expires)
                coockieService.setCookie('refreshToken', refreshResponse.data.refresh_token, refreshResponse.data.refresh_token_expires)

                token = refreshResponse.data.access_token

                config.headers['Authorization'] = `Bearer ${token}`
            }

        } else {

            config.headers['Authorization'] = `Bearer ${token}`

        }

        return config

    },

    error => {

        return Promise.reject(error)

    }

)


export default api