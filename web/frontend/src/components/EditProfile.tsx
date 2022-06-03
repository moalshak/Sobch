import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar, {NavBarBot} from "../components/NavBar";
import {setLoggedIn} from "../lib/acc";
import {Alert, AlertProps, Variant} from './CustomAlert';
import Spinner from "react-bootstrap/Spinner";


interface Profile {
    profile :{
        id: string,
        credentials: {
            email: string,
            password: string,
        },
        address: string
    }
}

function EditProfile(){

    const [newPassword, setNewPassword] = useState("");
    const [profile, setProfile] = useState<Profile>({
        profile : {
            id: "",
            credentials: {
                email: "",
                password: "",
            },
            address: ""
    }
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const {id} = useParams();

    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (profile.profile.credentials.password){
            if (profile.profile.credentials.password !== "" || newPassword !== "")
            {
                if (profile.profile.credentials.password.length < 6){
                    //alert('Password is less than 6 characters!');
                    setAlertProps({
                        heading: 'Invalid password!',
                        message: 'Make sure it is at least 6 characters..',
                        variant: Variant.danger
                    });
                    return;
                }
                if (profile.profile.credentials.password !== newPassword) {
                    //alert('Passwords do not match');
                    setAlertProps({
                        heading: 'Passwords do not match!',
                        message: 'Make sure you typed your password correctly twice..',
                        variant: Variant.danger
                    });
                    return;
                }
            }
        }

        

        try {
            setLoading(true);
            const response = await axios.put(`${BACKEND_BASE_URL}/profile/`, {
                credentials : {
                    email : profile.profile.credentials.email.trim(),
                    password : newPassword.trim()
                },
                address : profile.profile.address.trim()
            }, {headers: {
                    Authorization: `${getAccessToken()}`
                }
            }
            );
            if (response.status === 200) {
                //alert("Your profile information has been successfully updated");
                setAlertProps({
                    heading: 'Your profile information has been successfully updated!',
                    message: 'You will now be redirected to your pfrofile overview',
                    variant: Variant.success
                });
                
                setTimeout(() => {
                    navigate("/profile/");
                }, 2500);
                setLoading(false);
                return;
            }
            setLoading(false);
            setLoggedIn(true);
        } catch (err : any) {
            if (err.response.status === 401) {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in 2 seconds',
                    variant: Variant.danger
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
                return;
            }
            else if (err.response.status === 500) {
                //alert("Invalid password, must be at least 6 characters!");
                setAlertProps({
                    heading: 'Invalid password!',
                    message: 'It must be at least 6 characters!',
                    variant: Variant.danger
                });
                setTimeout(() => {
                    navigate("/edit-profile/");
                }, 2500);
                return;
            }
        }
    }

    var getProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_BASE_URL}/profile/`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setProfile(response.data)
            setLoading(false)
        } catch (err : any) {
            if (err.response.status === 401) {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in 2 seconds',
                    variant: Variant.danger
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
                return;
            }
        }
    }

    useEffect(() => {
        setLoggedIn(false);
        getProfile();
    }, []);

    return(
        <div>
        <NavBar/>
        <Alert {...alertProps}/>
        <Container>
            <h1>Edit Profile</h1>
        
        {loading ? 
            <div className="d-flex justify-content-center">
            <div  role="status">
            <Spinner className='mt-3' animation="grow" />
            </div>
        </div>
        :
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="email@exmaple.com" value={profile.profile.credentials.email} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, email: e.target.value}}})}/>
                    <Form.Text className="text-muted">
                        An empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                <Row>
                    <Col>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={profile.profile.credentials.password} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, password: e.target.value}}})}/>
                    <Form.Text className="text-muted">
                        For security purposes has to be at least 6 characters, an empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Form.Text className="text-muted">
                        Has to be identical to the previously entered password
                    </Form.Text>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" value={profile.profile.address} onChange={(e) => setProfile({...profile, profile: {...profile.profile, address: e.target.value}})}/>
                    <Form.Text className="text-muted">
                        An empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save changes
                </Button>
            </Form>
        }
        </Container>

        </div>
    )

}

export default EditProfile;