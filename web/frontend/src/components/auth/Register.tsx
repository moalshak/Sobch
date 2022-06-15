import {useEffect, useState} from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../../App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import NavBar from "../utils/NavBar";
import {Alert, AlertProps, Variant} from '../utils/CustomAlert';
import {isLoggedIn} from '../../lib/acc';
import {useNavigate} from "react-router-dom";

/***
 * Register component
 * 
 */
function Register() {

    /**
     * State variables
     */
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [address, setAddress] = useState('');
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
     * takes care of the register form
     *  - if the passwords don't match, show an error
     *  - if the passwords match, send the data to the server
     */
    async function doRegisterRequest( e : any) {
        e.preventDefault();
        // check if the passwords match
        if (password !== confirmPassword) {
            setAlertProps({
                heading: 'Error',
                message: 'Passwords do not match',
                variant: Variant.warning
            });
            return;
        }

        try {
            // send the data to the server
            const res = await axios.post(`${BACKEND_BASE_URL}/register`, {
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
                    setAlertProps({
                        heading: 'Error',
                        message: data.message,
                        variant: Variant.danger
                    });                    
                }
                return;
            }
            
            // message show the message from the server
            if (data.message) {
                setAlertProps({
                    heading: 'Success',
                    message: "Please remember to verify your email in order to be able to login",
                    variant: Variant.success
                });
            }

            // set local storage with the token
            const accessToken = res.data.accessToken;
            localStorage.setItem('accessToken', accessToken);

            setTimeout(() => {
                window.location.href = '/login';
            }, 3000);

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

    useEffect(()=> {
        if (isLoggedIn()) {
             setAlertProps({ 
                 heading: 'Already logged in!',
                 message: "You are already logged in. If you want to make a new account please log out first",
                 variant: Variant.info
             });
             setTimeout(()=> {
                  navigate(-1);
              }, 3000);
        }
    }, [])

    return (
        <div>
            <NavBar />
            <Alert {...alertProps}/>
            {
                isLoggedIn() ?
                <></>
                :
            
            <Container>
                <h1>Register</h1>
                <Form onSubmit={doRegisterRequest}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label >Email address <span style={{color : 'red'}}>*</span></Form.Label>
                    <Form.Control required type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label >Password <span style={{color : 'red'}}>*</span></Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Form.Text className="text-muted">
                        Must be at least 6 characters
                    </Form.Text>
                </Form.Group>
                <Form.Group  controlId="formBasicPassword">
                    <Form.Label>Confirm Password <span style={{color : 'red'}}>*</span></Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <Form.Text className="text-muted">
                        Must be the same as the password
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicAddress">
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <Form.Text className="text-muted">
                        The address is mainly for you to link the devices to
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Register
                </Button>
                </Form>
                <br/>
                <span style={{color : 'red'}}>*</span> required field
                <br/>
                <span>Already have an account ? <a href="/login">Login</a></span>
            </Container>
        }
        </div>
    );
}



export default Register;