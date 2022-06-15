import axios from "axios";
import {useEffect, useState} from "react";
import {BACKEND_BASE_URL} from "../../App";
import {getAccessToken, setLoggedIn} from "../../lib/acc";
import {useNavigate, useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar, {NavBarBot} from "../utils/NavBar";
import {Alert, AlertProps, Variant} from '../utils/CustomAlert';
import Spinner from "react-bootstrap/Spinner";
import Modal from "react-bootstrap/Modal";
import {AiOutlineEdit} from "react-icons/ai";


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



    const [showPopUp, setShowPopUp] = useState(false);

    function handleClosePopUp() {
        setShowPopUp(false);
    }

    function handleShowPopUp() {
        setShowPopUp(true);
    }

    async function handleSubmit() {

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
                    email : profile.profile.credentials.email,
                    password : newPassword
                },
                address : profile.profile.address
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
                setShowPopUp(false);
                return;
            }
            setLoading(false);
            setShowPopUp(false);
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

    let getProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_BASE_URL}/profile/`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setProfile(response.data)
            setLoading(false);
            setLoggedIn(true);
            setShowPopUp(false);
        } catch (err : any) {
            if (err.response.status === 401) {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in a few seconds',
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
       
        
        {loading ? 
            <div className="d-flex justify-content-center">
            <Spinner className='mt-3' animation="grow" />
            </div>
        :
            <>
            <Modal show={showPopUp} onHide={handleClosePopUp}>
                <Modal.Header closeButton>
                <Modal.Title> Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to save these changes to your profile?
                    <br/>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClosePopUp}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
            
            
            <h1>Edit Profile</h1><Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" placeholder="email@example.com" value={profile.profile.credentials.email} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, email: e.target.value.trim()}}})}/>
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
                        <Form.Control type="text" placeholder="Address" value={profile.profile.address} onChange={(e) => setProfile({...profile, profile: {...profile.profile, address: e.target.value.trim()}})}/>
                        <Form.Text className="text-muted">
                            An empty field will preserve the current information.
                        </Form.Text>
                    </Form.Group>
                    <Button variant="primary" type="submit" onClick={(_) => {
                        handleShowPopUp();
                    }}>
                        Save changes <AiOutlineEdit/>
                    </Button>
                </Form></>
        }
            </Container>
            <NavBarBot />
            </div>
        )

}
    export default EditProfile;