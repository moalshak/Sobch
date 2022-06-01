import { useState } from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import NavBar from "./NavBar";
import {Alert, AlertProps, Variant} from './CustomAlert';
import {setLoggedIn, isLoggedIn} from '../lib/acc';
import {useNavigate} from 'react-router-dom';

function Login() {

    const [email, logEmail] = useState('');
    const [password, logPassword] = useState('');
    const navigate = useNavigate();
    
    /**
     * Custom alert props which looks cleaner than the regular alert
     */
    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    /***
     * takes care of the login form
     * 
     * @param e event
    */
   async function doLoginRequest(e: any) {
       e.preventDefault();
       var data : any = {};

       try{
           const res = await axios.post(`${BACKEND_BASE_URL}/login`, {
               email : email.trim(),
               password : password.trim()
           });
           data = res.data;
           var error = data.error, message;

           if(error) {
               if(data.message){
                   message = data.message;
                } else {
                    message = error;
                }
                setAlertProps({ 
                    heading: 'Error',
                    message: error,
                    variant: Variant.danger
                 });
               return;
           }

           // message show the message from the server
           if (data.message) {
            setAlertProps({ 
                heading: 'Success',
                message: "You have successfully logged in",
                variant: Variant.success
             });
            }

        // set local storage 
        const accessToken = res.data.accessToken;
        localStorage.setItem('accessToken', accessToken);
        setLoggedIn(true);
        navigate('/');
        setTimeout(()=> {
            window.location.href = '/';
        }, 1500);

    } catch(error : any) {
        if (error.response.data.error) {
            setAlertProps({ 
                heading: 'Error',
                message: error.response.data.message,
                variant: Variant.danger
            });   
        }
    }

   }

   if (isLoggedIn()) {
        navigate(-1);
   }


    return (
        <div>
            <NavBar/>
            <Alert {...alertProps} />

            <Container className='mt-3'>
            <h1>Login</h1>
            <Form onSubmit={doLoginRequest}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="email@example.com" value={email} onChange={(e) => logEmail(e.target.value) }/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => logPassword(e.target.value) }/>
                </Form.Group>
                <Button variant="primary" type="submit" className='mt-3'>
                    Login
                </Button>
            </Form>
            </Container>
        </div>
    );
}


export default Login;