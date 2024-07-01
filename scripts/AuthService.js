import api from './ApiService.js'
import CoockieService from './CoockieService.js'

const coockieService = new CoockieService()


export default class AuthService {

    async login (loginData) {
        
        const response = await api.post(
            '/login',
            loginData,
        )
        
        console.log(response)

        if (response.status !== 200) {

            return false

        }


        coockieService.setCookie('accessToken', response.data.access_token)
        coockieService.setCookie('refreshToken', response.data.refresh_token)

        // По-хорошему, тут алерт не нужен, но оставляем для дебага и потому что нет нормального диалогового окна с сообщениями
        alert(response.data.message)

        return true

    }

    async register (registerData) {

        const response = await api.post(
            '/register',
            registerData,
            {

                headers: {
                    'Content-Type': 'application/json'
                }

            }
        )
        
        console.log(response)

        if (response.status !== 200) {

            return false

        }

        // По-хорошему, с регистрации этого не должно приходить

        coockieService.setCookie('accessToken', response.data.access_token)
        coockieService.setCookie('refreshToken', response.data.refresh_token)

        // По-хорошему, тут алерт не нужен, но оставляем для дебага и потому что нет нормального диалогового окна с сообщениями
        alert(response.data.message)

        return true

    }

}