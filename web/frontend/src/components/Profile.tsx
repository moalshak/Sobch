import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {useParams} from "react-router-dom"; 
import { getAccessToken } from '../lib/acc';
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios';
import NavBar, {NavBarBot} from "../components/NavBar";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {isLoggedIn, setLoggedIn} from "../lib/acc";
import {Alert, AlertProps, Variant} from './CustomAlert';
import Spinner from "react-bootstrap/Spinner";
import {AiOutlineEdit} from "react-icons/ai";
import {TiUserDeleteOutline} from "react-icons/ti";
import Modal from "react-bootstrap/Modal";

function Profile() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [lastLogin, setlastLogin] = useState('');
    const [loading, setLoading] = useState(true);

    const {id} = useParams();
    

    const accessToken = getAccessToken();

    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    const navigate = useNavigate();

    const [showPopUp, setShowPopUp] = useState(false);

    function handleClosePopUp() {
        setShowPopUp(false);
    }

    function handleShowPopUp() {
        setShowPopUp(true);
    }

    async function goDelete(e : any) {
        e.preventDefault();
        var data : any = {};
        
        try {
            setLoading(true);
            const res = await axios.delete(`${BACKEND_BASE_URL}/register`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (res.status === 200) {
                setAlertProps({
                    heading: 'Your profile information has been deleted successfully!',
                    message: 'You will now be redirected to the home page',
                    variant: Variant.success
                });
                
                setTimeout(() => {
                    navigate("/register");
                }, 2500);
                setLoading(false);
                setShowPopUp(false);
                setLoggedIn(false);
                return;
            }    

            data = res.data;
    } catch(error) {
        if(data.error) {
            //alert(data.error);
            setAlertProps({
                heading: 'There was a problem deleting your account',
                message: `${data.error}`,
                variant: Variant.danger
            });
        } else {
            setAlertProps({
                heading: 'There was a problem deleting your account',
                message: `${error}`,
                variant: Variant.danger
            });
            //alert(`Something went wrong : ${error}`);
        }
    }
    }

    


    async function getProfile() {
        try{
            setLoading(true);
            var url = `${BACKEND_BASE_URL}/profile/`;
            if (id) {
                url += id;
            }
            const res = await axios.get(url, {
                headers: {
                    Authorization : `${accessToken}`
                }
            })
            setEmail(res.data.profile.credentials.email)
            setAddress(res.data.profile.address)
            setCreatedAt(new Intl.DateTimeFormat('en-NL', { timeZone : 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(res.data.meta.createdAt))
            setlastLogin(new Intl.DateTimeFormat('en-NL', { timeZone : 'Europe/Amsterdam', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(res.data.meta.lastLogin))
            setLoading(false);
            setLoggedIn(true);
            setShowPopUp(false);
            
        } catch (error : any) {
            if (error.response.status === 401)
            {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in a few seconds',
                    variant: Variant.warning
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
                return;
            }
            else if (error.response.data.error) {
                setAlertProps({
                    heading: 'Error',
                    message: error.response.data.message,
                    variant: Variant.danger
                });
                return;
            }
        }
    }

    useEffect(()=> {
        setLoggedIn(false);
        getProfile();
    }, []);

    function RenderProfile(){

        return (
                <div>
                <Container>
                        <>
                    <Modal show={showPopUp} onHide={handleClosePopUp}>
                        <Modal.Header closeButton>
                        <Modal.Title> Delete Profile</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Are you sure you want to permanently delete this account?
                            <br/>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClosePopUp}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={goDelete}>
                            Confirm
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    <Card className='mt-3'>    
                        <div>
                            <Card.Header>Profile :</Card.Header>
                                <Card.Body>
                                    <Card.Text>
                                        <Col>
                                            <Row>
                                                <span>
                                                    <b>Email address:</b> {email}
                                                </span>
                                            </Row>
                                            <Row>
        
                                                <span>
                                                    <b>Address:</b> {address}
                                                </span>
                                            </Row>
                                            <Row>
                                                <span>
                                                    <b>Created At:</b> {createdAt}
                                                </span>
                                            </Row>
                                            <Row>
                                                <span>
                                                    <b>Last logged in at:</b> {lastLogin}
                                                </span>
                                            </Row>
                                        </Col> 
                                    </Card.Text>
                                </Card.Body>
                                {!id ? <div>

                            <div 
                                className="d-grid"
                            >
                                <Button href={`/edit-profile`} variant="outline-primary" className='mt-3 mb-3' size="lg">Edit <AiOutlineEdit/></Button>
                            </div>
                            <div 
                                className="d-grid"
                            >
                                <Button variant="outline-danger" className='mt-3 mb-3' size="lg" onClick={(_) => {
                                    handleShowPopUp();
                                }}>
                                    Delete <TiUserDeleteOutline/>
                                </Button>
                            </div>
                            </div>
                            :
                            null }
                        </div>
                    </Card></>
                </Container>
            </div>
        )   
    }
    

    return (
        <div>
            <NavBar />
            <Alert {...alertProps}/>
            {loading ? 
            <div className="d-flex justify-content-center">
                <div  role="status">
                <Spinner className='mt-3' animation="grow" />
                </div>
            </div>
            : <RenderProfile/>}
            <div>
                    </div>
            <NavBarBot />
        </div>
    );
    
    }


export default Profile;
