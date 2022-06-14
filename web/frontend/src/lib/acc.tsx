import axios from "axios";
import { BACKEND_BASE_URL } from "../App";


/**
 * @returns {string} The access token
 */

export function getAccessToken () {
    return localStorage.getItem('accessToken');
}

export async function goLogout(e : any) {
    e.preventDefault();
    let data : any = {};
    
    try {
        const res = await axios.post(`${BACKEND_BASE_URL}/logout`, {
        }, {
            headers : {
                Authorization : `${getAccessToken()}`
            }
        });    
        data = res.data;
        localStorage.removeItem(`accessToken`);
        setLoggedIn(false);
       window.location.href = '/Logout';
    } catch(error) {
        if(data.error) {
            alert(data.error);
        } else {
            alert(`Something went wrong : ${error}`);
        }
    }
}

/**
 * Whether the user is logged in or not
 * 
 * @returns {boolean} true if the user is logged in
 */
export function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true';
}

/**
 * Sets the logged in status
 *
 * @param value loggedIn the value to set it to
 */
export function setLoggedIn(value: boolean) {
    localStorage.setItem('loggedIn', value ? 'true' : 'false');
}
