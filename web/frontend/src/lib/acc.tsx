/**
 * @returns {string} The access token
 */
export function getAccessToken () {
    return localStorage.getItem('accessToken');
}

/**
 * Whether the user is logged in or not
 * 
 * @returns {boolean} true if the user is logged in
 */
export function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true' ? true : false;
}

/**
 * Sets the logged in status
 * 
 * @param {boolean} loggedIn the value to set it to
 */
export function setLoggedIn(value: boolean) {
    localStorage.setItem('loggedIn', value ? 'true' : 'false');
}