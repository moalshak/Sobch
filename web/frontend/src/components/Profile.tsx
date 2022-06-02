import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {useParams} from "react-router-dom"; 
import { getAccessToken } from '../lib/acc';
import {Link, useNavigate} from "react-router-dom"
import axios from 'axios';
import NavBar from "./NavBar";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import {isLoggedIn, setLoggedIn} from "../lib/acc";
import {Alert, AlertProps, Variant} from './CustomAlert';
import Spinner from "react-bootstrap/Spinner";

function Profile() {
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [createdAt, setCreatedAt] = useState('');
    const [lastLogin, setlastLogin] = useState('');
    const [loading, setLoading] = useState(true);
    const {id} = useParams();

    const url = `${BACKEND_BASE_URL}/profile/` 
    const accessToken = getAccessToken();

    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    const navigate = useNavigate();

    async function goDelete(e : any) {
        e.preventDefault();
        var data : any = {};
        
        try {
            setLoading(true);
            const res = await axios.delete(`${BACKEND_BASE_URL}/register`, {
            });
            if (res.status === 200) {
                //alert("Your profile information has been successfully updated");
                setAlertProps({
                    heading: 'Your profile information has been deleted successfully!',
                    message: 'You will now be redirected to the home page',
                    variant: Variant.success
                });
                
                setTimeout(() => {
                    navigate("/");
                }, 2500);
                setLoading(false);
                return;
            }    

            data = res.data;
            // window.location.href = '/';
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
        } catch (error : any) {
            if (error.response.status === 401)
            {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in 2 seconds',
                    variant: Variant.warning
                });
                setTimeout(() => {
                    navigate("/login");
                }, 2500);
                return;
            }
            alert (error);
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
                        <div 
                            className="d-grid"
                        >
                            <Button href={`/edit-profile`} variant="outline-primary" className='mt-3 mb-3' size="lg">Edit</Button>
                        </div>
                        <div 
                            className="d-grid"
                        >
                            <Button onClick = {goDelete} variant="outline-danger" className='mt-3 mb-3' size="lg">Delete Account</Button>
                        </div>
                    </div>
                </Card>
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
        </div>
    );
    
    }


export default Profile;
