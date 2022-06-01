import axios from "axios";
import { BACKEND_BASE_URL } from "../App";

export function getAccessToken () {
    return localStorage.getItem('accessToken');
}

<<<<<<< HEAD
async function goLogout(e : any) {
    console.log("HERERERERERERERE")
    e.preventDefault();
    var data : any = {};
    
    try {
        const res = await axios.post(`${BACKEND_BASE_URL}/logout`, {
        }, {
            headers : {
                Authorization : `${getAccessToken()}`
            }
        });    
        data = res.data;
        localStorage.setItem(`accessToken`, '')
        window.location.href = '/';
} catch(error) {
    if(data.error) {
        alert(data.error);
    } else {
        alert(`Something went wrong : ${error}`);
    }
}
}

export default goLogout;
=======
export function isLoggedIn() {
    return localStorage.getItem('loggedIn') === 'true' ? true : false;
}

export function setLoggedIn(value: boolean) {
    localStorage.setItem('loggedIn', value ? 'true' : 'false');
}
>>>>>>> ad124e9bfc6cefd8b510c083049e4b66067d758b
