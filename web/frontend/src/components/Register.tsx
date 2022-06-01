import { useState } from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import NavBar from "./NavBar";

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
            <NavBar />
            
            <Container>
                <h1>Register</h1>
                <Form onSubmit={doRegisterRequest}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control required type="email" placeholder="email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control required type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Form.Text className="text-muted">
                        Must be at least 6 characters
                    </Form.Text>
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Confirm Password</Form.Label>
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
            </Container>
        </div>
    );
}



export default Register;