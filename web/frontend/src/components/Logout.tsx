import {isLoggedIn} from "../lib/acc";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';
import {Link } from "react-router-dom";
import {getAccessToken} from "../lib/acc"
import NavBar from "./NavBar";
import {useNavigate} from "react-router-dom";
import {setLoggedIn} from "../lib/acc";

function Logout() {
    const navigate = useNavigate();

    async function goLogout(e : any) {
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
            localStorage.removeItem('accessToken');
            setLoggedIn(false);
            navigate("/");
    } catch(error) {
        if(data.error) {
            alert(data.error);
        } else {
            alert(`Something went wrong : ${error}`);
        }
    }    
        
    }
    
    if (!isLoggedIn()) {
        navigate(-1);
   }

    return (
        <div>
            <NavBar />
            <Link to={'/'}>
                <button onClick={goLogout}>Confirm Logout</button>
            </Link>
        </div>
    );
}


export default Logout;