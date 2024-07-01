import api from './ApiService.js'


export default class AuthService {

    async getUserProfile () {
        
        const response = await api.get(
            '/profile'
        )


        return response.data

    }
}