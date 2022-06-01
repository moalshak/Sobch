export function getAccessToken () {
    return localStorage.getItem('accessToken');
}

export function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true' ? true : false;
}

export function setLoggedIn(value: boolean) {
    localStorage.setItem('loggedIn', value ? 'true' : 'false');
}