import CoockieService from "./CoockieService.js";
import AuthService from "./AuthService.js";
import ProfileService from "./ProfileService.js";
import { redirectTo } from "./utils.js";

const LINK_TO_REDIRECT_IF_NO_AUTH = 'http://localhost:5500/pages/auth.html'

const coockieService = new CoockieService()
const profileService = new ProfileService()
const authService = new AuthService()

document.getElementById('auth-logout').addEventListener(
    "click",
    async () => {

        await authService.logout()

        redirectTo(LINK_TO_REDIRECT_IF_NO_AUTH)

    }
)

function insertDataIntoProfile(data) {
    const contentDiv = document.getElementById('profile')
    contentDiv.innerHTML = ''

    Object.entries(data).forEach(([field, value]) => {

        const fieldValueDiv = document.createElement('div')
        fieldValueDiv.className = 'field-value'

        const fieldSpan = document.createElement('span')
        fieldSpan.className = 'field'
        fieldSpan.textContent = `${field}: `

        const valueSpan = document.createElement('span')
        valueSpan.className = 'value'
        valueSpan.textContent = value

        fieldValueDiv.appendChild(fieldSpan)
        fieldValueDiv.appendChild(valueSpan)

        contentDiv.appendChild(fieldValueDiv)

    })
}


async function fetchProfile() {
    const loader = document.getElementById('profile-loader')
    const profile = document.getElementById('profile')

    loader.classList.add('hidden')
    profile.classList.remove('hidden')

    const profileData = await profileService.getUserProfile()


    insertDataIntoProfile(profileData)
}

if (!coockieService.getCookie('accessToken')) {

    if (!coockieService.getCookie('refreshToken')) {

        redirectTo(LINK_TO_REDIRECT_IF_NO_AUTH)

    }

    // redirectTo(LINK_TO_REDIRECT_IF_NO_AUTH)

    fetchProfile()

} else {

    fetchProfile()

}