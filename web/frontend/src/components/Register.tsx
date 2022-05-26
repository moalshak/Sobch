import { useState } from "react";
import axios from 'axios';
import {BASE_URL} from '../App';

/***
 * Register component
 * 
 */
function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');

    /***
     * takes care of the register form
     *  - if the passwords don't match, show an error
     *  - if the passwords match, send the data to the server
     */
    async function doRegisterRequest( e : any) {
        e.preventDefault();
        // check if the passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        try {
            // send the data to the server
            const res = await axios.post(`${BASE_URL}/register`, {
                credentials: {
                    email : email.trim(),
                    password : password.trim()
                },
                address : address.trim()
            });

            // get data from the server response
            const data = res.data;
            if (data.error) {
                // there was an error
                if (data.message) {
                    alert({message : data.message, error : data.error});
                }
                return;
            }
            
            // message show the message from the server
            if (data.message) {
                alert(data.message);
            }

            // set local storage with the token
            const accessToken = res.data.accessToken;
            localStorage.setItem('accessToken', accessToken);

            // TODO: what to do here ?
            window.location.href = '/';
        } catch(error) {
            alert(`Something went wrong : ${error}`);
        }
    }

    return (
        <div>
            <form onSubmit={doRegisterRequest}>
            <input type="text" value={email} onChange={(e) => setEmail(e.target.value) } placeholder="Email"/>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value) } placeholder="Password"/>
            <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value) } placeholder="Confirm Password"/>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value) } placeholder="Address"/>
            <button type="submit">Register</button>
            </form>
        </div>
    );
}



export default Register;