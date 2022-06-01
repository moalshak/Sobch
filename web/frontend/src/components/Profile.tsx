import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {useParams} from "react-router-dom"; 
import { getAccessToken } from '../lib/acc';
import {Link} from "react-router-dom"
import axios from 'axios';
import NavBar from "./NavBar";

function Profile() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [metadata, setMetadata] = useState('');
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    const url = `${BACKEND_BASE_URL}/profile/` 
    const accessToken = getAccessToken();

    async function goDelete(e : any) {
        e.preventDefault();
        var data : any = {};
        
        try {
            const res = await axios.delete(`${BACKEND_BASE_URL}/register`, {
            });    

            data = res.data;
            window.location.href = '/';
    } catch(error) {
        if(data.error) {
            alert(data.error);
        } else {
            alert(`Something went wrong : ${error}`);
        }
    }
}


    async function getProfile() {
        try{
            setLoading(true);
            const res = await axios.get(url, {
                headers: {
                    Authorization : `${accessToken}`
                }
            })
            setEmail(res.data.profile.credentials.email)
            setAddress(res.data.profile.address)
            setMetadata(res.data.profile.meta)
            setLoading(false);
        } catch (error) {
            alert (error);
        }
    }

    useEffect(()=> {
        getProfile();
    }, []);

    function RenderProfile(){
        return (
            <div>
                <h1> Profile </h1>
                <Link to={`/edit-profile/`}>
                    <button>Edit Profile</button>
                </Link>
                <div>
                <li>Email address : {email}</li>
                <li>Address/city : {address}</li>
                <li>Other : {metadata}</li>
                </div>
            </div>
        );
    }

    

    return (
        <div>
            <NavBar />
            {loading ? 
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div>
            : <RenderProfile/>}
            <Link to={'/'}>
                <button onClick={goDelete}>Delete account</button>
            </Link>
        </div>
    );
};


export default Profile;
