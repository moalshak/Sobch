import { useState } from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';

function Login() {

    const [email, logEmail] = useState('');
    const [password, logPassword] = useState('');

   async function doLoginRequest(e: any) {
       e.preventDefault();

       try{
           const res = await axios.post(`${BACKEND_BASE_URL}/login`, {
               email : email.trim(),
               password : password.trim()
           });

           const data = res.data;
           if(data.error) {
               if(data.message){
                   alert({message : data.message, error : data.error});
               }
               return;
           }

           // message show the message from the server
           if (data.message) {
            alert(data.message);
        }

        // set local storage 
        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);

        
        window.location.href = '/';
    } catch(error) {
        alert(`Something went wrong : ${error}`);
    }
       



   }




    return (
        <div>
            <form onSubmit={doLoginRequest}>
            <input type = "text" value={email} onChange={(e) => logEmail(e.target.value) } placeholder = "Email"/>
            <input type="password" value={password} onChange={(e) => logPassword(e.target.value) } placeholder="Password"/>
            <button type="submit">Login </button>
            </form>
        </div>
    );
}


export default Login;