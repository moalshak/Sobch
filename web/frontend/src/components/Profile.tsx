import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {useParams} from "react-router-dom"; 
import { getAccessToken } from '../lib/acc';
import {Link} from "react-router-dom"
import axios from 'axios';


function Profile() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [metadata, setMetadata] = useState('');
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    const url = `${BACKEND_BASE_URL}/profile/${id}` 
    const accessToken = getAccessToken();


    async function getProfile() {
        try{
            setLoading(true);
            const res = await axios.get(url, {
                headers: {
                    Authorization : `${accessToken}`
                }
            })
            setEmail(res.data.profile.email)
            setAddress(res.data.profile.address)
            setMetadata(res.data.profile.metadata)
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
                <Link to={`/edit-profile/${id}`}>
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
            {loading ? <img src="../loading.gif" style={{width:"55px", height:"55px"}}/> : <RenderProfile/>}
        </div>
    );
}

export default Profile;
