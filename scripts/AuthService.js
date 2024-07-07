import api from './ApiService.js'
import CoockieService from './CoockieService.js'

const coockieService = new CoockieService()


export default class AuthService {


    async login (loginData, isRememberMe = true) {
        
        const response = await api.post(
            '/login',
            loginData,
            {

                headers: {
                    'Content-Type': 'application/json'
                }

            }
        )
        

        if (response.status !== 200) {

            return false

        }


        coockieService.setCookie('accessToken', response.data.access_token, response.data.access_token_expires)

        // Если галочка на "Запомнить меня" есть, то мы сохраняем refreshToken, если нет - то по истечению accessToken'а мы должны будем перезайти в аккаунт
        if (isRememberMe) {
            coockieService.setCookie('refreshToken', response.data.refresh_token, response.data.refresh_token_expires)
        }

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


        if (response.status !== 200) {

            return false

        }

        // По-хорошему, с регистрации этого не должно приходить, а мы должны либо посылать запрос на /login и получать данные оттуда, либо отправять пользователя на экране login'а

        coockieService.setCookie('accessToken', response.data.access_token, response.data.access_token_expires)
        coockieService.setCookie('refreshToken', response.data.refresh_token, response.data.refresh_token_expires)

        // По-хорошему, тут алерт не нужен, но оставляем для дебага и потому что нет нормального диалогового окна с сообщениями
        alert(response.data.message)

        return true

    }


    async logout() {

        // По-хорошему должен быть определённый роут api/logout, который будет удалять в БД токены, если роут возвращает success, то можно удалять токены локально (логика далее)

        coockieService.deleteCookie('accessToken')
        coockieService.deleteCookie('refreshToken')

        alert('Successful Logout')

    }

}