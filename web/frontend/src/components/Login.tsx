import { useState } from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';
import {Link} from "react-router-dom"
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import NavBar from "./NavBar";

function Login() {

    const [email, logEmail] = useState('');
    const [password, logPassword] = useState('');
    
    

   async function doLoginRequest(e: any) {
       e.preventDefault();
       var data : any = {};

       try{
           const res = await axios.post(`${BACKEND_BASE_URL}/login`, {
               email : email.trim(),
               password : password.trim()
           });
           data = res.data;

           if(data.error) {
               if(data.message){
                   alert({message : data.message, error : data.error});
               } else {
                alert(data.error);
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
        if (data.error) {
            alert(data.error);
        } else {
            alert(`Something went wrong : ${error}`);
        }
    }
       



   }




    return (
        <div>
            {/* <Link to={'/'}>
            <Button>Home</Button>
            </Link> */}
            <NavBar/>
            
            <Container>
            <h1>Login</h1>
            <Form onSubmit={doLoginRequest}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control type="email" placeholder="email@example.com" value={email} onChange={(e) => logEmail(e.target.value) }/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => logPassword(e.target.value) }/>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Login
                </Button>
            </Form>
            </Container>
        </div>
    );
}


export default Login;