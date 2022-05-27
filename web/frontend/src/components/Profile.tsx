import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {useParams} from "react-router-dom"; 
import { getAccessToken } from '../lib/acc';
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
            setEmail(res.data.email)
            setAddress(res.data.address)
            setMetadata(res.data.metadata)
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
                <button> Edit </button>
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



  
  
  
  
  
  
  
  
//   async function updateProfile(e : "button click") {
//     e.preventDefault();

//     try {
//       await axios.put('http://localhost:8000/profile', {
//         email,
//         password,
//         address,
//       });
//     } catch(error) {
//       console.log(error);
//     }
//   }
}






export default Profile;
