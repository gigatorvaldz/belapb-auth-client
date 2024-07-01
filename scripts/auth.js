import CoockieService from "./CoockieService.js";
import AuthService from "./AuthService.js";
import { redirectTo } from "./utils.js";

const coockieService = new CoockieService()
const authService = new AuthService()


const LINK_TO_REDIRECT_AFTER_AUTH = 'http://localhost:5500/pages/profile.html'

let authType = 'login'

const authAlternatives = document.getElementsByClassName('auth-alternative')

for (const element of authAlternatives) {
    element.addEventListener(
        "click",
        (e) => {

            e.preventDefault()

            switchAuthType(element.getAttribute('name'))

        }
    )
}

const registerForm = document.getElementById('register')

registerForm.addEventListener(
    'submit', 
    async function (event) {

        event.preventDefault()

        const form = event.target;
        const password = form.password.value;
        const confirmPassword = form.confirm_password.value;

        if (password !== confirmPassword) {
            alert('Пароли не совпадают!');
            return;
        }
    
        const formData = new FormData(event.target)

        // Удаляем лишнее
        formData.delete('confirm_password')

        const formObject = {}
    
        formData.forEach((value, key) => {
            formObject[key] = value
        })
    
        const jsonString = JSON.stringify(formObject)
    
        console.log(jsonString)

        const loader = document.getElementById('auth-loader')

        loader.classList.remove('hidden')
        registerForm.classList.add('hidden')

        const isRegistrationSuccess = await authService.register(jsonString)

        if (!isRegistrationSuccess) {

            alert('Ошибка при регистрации')

            loader.classList.add('hidden')

            registerForm.classList.remove('hidden')

            return

        }

        loader.classList.add('hidden')

        registerForm.classList.remove('hidden')
        switchAuthType()

    }
)


const loginForm = document.getElementById('login')


loginForm.addEventListener(
    'submit', 
    async function (event) {

        event.preventDefault()

        const formData = new FormData(event.target)

        // Удаляем лишнее, пока что нам это не нужно
        formData.delete('signin-form__remember-me')

        const formObject = {}
    
        formData.forEach((value, key) => {
            formObject[key] = value
        })
    
        const jsonString = JSON.stringify(formObject)
    
        console.log(jsonString)

        const loader = document.getElementById('auth-loader')

        loader.classList.remove('hidden')
        loginForm.classList.add('hidden')

        const isRegistrationSuccess = await authService.login(jsonString)

        if (!isRegistrationSuccess) {

            alert('Ошибка при входе')

            loader.classList.add('hidden')

            loginForm.classList.remove('hidden')

            return

        }

        loader.classList.add('hidden')

        loginForm.classList.remove('hidden')
        // switchAuthType()

    }
)



function showAuthForm() {
    
    const registerForm = document.getElementById('register')
    const loader = document.getElementById('auth-loader')

    loader.classList.toggle('hidden')
    registerForm.classList.toggle('hidden')

}


function switchAuthType(newAuthType) {

    const loginForm = document.getElementById('login')
    const registerForm = document.getElementById('register')

    authType = newAuthType

    loginForm.classList.toggle('hidden')
    registerForm.classList.toggle('hidden')
    
}


if (!coockieService.getCookie('accessToken')) {

    if (coockieService.getCookie('resfreshToken')) {

        // refresh, redirect

        redirectTo(LINK_TO_REDIRECT_AFTER_AUTH)

    }


    showAuthForm()

} else {

    redirectTo(LINK_TO_REDIRECT_AFTER_AUTH)

}