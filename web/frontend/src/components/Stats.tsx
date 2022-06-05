import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';
import {Link, useNavigate} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import NavBar, {NavBarBot} from "./NavBar";
import {isLoggedIn, setLoggedIn} from "../lib/acc";
import Spinner from "react-bootstrap/Spinner";
import {AiOutlineEdit} from "react-icons/ai";
import {BiDevices} from "react-icons/bi";
import ProgressBar from 'react-bootstrap/ProgressBar';
import {Alert, AlertProps, Variant} from './CustomAlert';
import {MdOutlineNotificationImportant} from "react-icons/md";

function Stats() {
    
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState([]);
    const [currentTemp, setCurrentTemp] = useState(undefined);

    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    const navigate = useNavigate();


    /**
     * The update indicator for the refresh of the devices
     */
    const [updateIndicator, setUpdateIndicator] = useState(false);

    const [device, setDevice] = useState(
        {
            config: {
                active: true,
                max: 0,
                min: 0,
                room: "",
                wantsToBeNotified: true
            },
            currentTemp: 0,
            id: "",
            otp: "",
            owners: []
        }
    );

    const {deviceId} = useParams();


    async function getStats() {
        try {
            setLoading(true);
            const res = await axios.get(`${BACKEND_BASE_URL}/stats/${deviceId}`,
            {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setDevice(res.data.device);
            setCurrentTemp(res.data.currentTemp);
            setOwners(res.data.device.owners);
            setLoading(false);
            setLoggedIn(true);
        } catch (err : any) {
            if (err.response.status === 401)
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
                else if (err.response.data.error) {
                    setAlertProps({
                        heading: 'Error',
                        message: err.response.data.message,
                        variant: Variant.danger
                    });
                    return;
                }
        }          
    }

    async function getCurrentTemp() {
        try {
            const res = await axios.get(`${BACKEND_BASE_URL}/stats/${deviceId}`,
            {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setCurrentTemp(res.data.device.currentTemp);
        } catch (err : any) {
            if (err.response.status === 401)
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
            else if (err.response.data.error) {
                setAlertProps({
                    heading: 'Error',
                    message: err.response.data.message,
                    variant: Variant.danger
                });
                return;
            }
        }        
    }


    function CurrenTemp() {
        if (currentTemp) {
            return (
                <span>
                {currentTemp > device.config.max ? <span style={{fontSize: 16, color: "red"}}>🌡️{currentTemp} °C 🔥</span> :
                currentTemp < device.config.min ? <span  style={{fontSize: 16,color: "blue"}}>🌡️{currentTemp} °C ❄️</span> :
                <span style={{fontSize: 16, color: "green"}}>🌡️{currentTemp} °C ✅</span>}
                <div>
                <br/>
                <ProgressBar
                label={device.currentTemp <= device.config.min ? `Lower than min by ${Math.round(((device.config.min - device.currentTemp)*100))/100}` : device.currentTemp >= device.config.max ? `Higher than max by ${Math.round(((device.currentTemp - device.config.max)*100))/100}` : "Normal"}
                variant={device.currentTemp >= device.config.max || device.currentTemp <= device.config.min ? 'danger' : 'info'}
                max={device.config.max + 3}
                min={device.config.min - 4}
                now={device.currentTemp} />
                </div>
                
                </span>
                
            )

        } else {
            return (
                <Spinner className='mt-3' animation="grow" />
            )
        }
    }

    setTimeout(()=> {
        if (updateIndicator) {
            setUpdateIndicator(false);
        } else {
            setUpdateIndicator(true);
        }
    }, 5000);


    useEffect(()=> {
        setLoggedIn(false);
        getStats();
    }, []);



    useEffect(()=> {
        getCurrentTemp();   
    }, [updateIndicator])



    function RenderStats() {
        return (
            <Container>
                <Card className='mt-3'>
                    {/* TODO: add image of the model */}
                    <Card.Img/> 
                <Card.Header>Device with id: {device.id}</Card.Header>
                <Card.Body>
                    <Card.Text>
                        <Row>
                            <Col>
                                
                                <span>
                                    <b>Room:</b> {device.config.room === '' ? 'No room' : device.config.room}
                                </span>
                            </Col>
                            <Col>

                                <span>
                                    <b>Max:</b> {device.config.max} °C
                                </span>
                            </Col>
                            <Col>
                                <span>
                                    <b>Min:</b> {device.config.min} °C
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span>
                                    <b>Active:</b> {device.config.active ? "Yes" : "No"}
                                </span>
                            </Col>
                            <Col>
                                <span>
                                    <b>Notify Me:</b> {device.config.wantsToBeNotified ? "Yes" : "No"} <MdOutlineNotificationImportant/>
                                </span>
                            </Col>
                            <Col>
                                <span>
                                    <b>OTP:</b> {device.otp}
                                </span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span>
                                    <b>Current temperature:</b>
                                <CurrenTemp/>
                                </span>
                            </Col>
                        </Row>
                    </Card.Text>
                </Card.Body>
                <br/>
                    <Card.Header>Owners</Card.Header>
                    <ListGroup>
                        {owners.map((owner) => {
                            return (
                                    <ListGroup.Item key={owner}>{owner}</ListGroup.Item>
                            )
                        })}
                    </ListGroup>
                </Card>
            <div>
                <br/>
                <Link to={`/alter/${deviceId}`}>
                    <Button variant="secondary">Edit This Devices Configuration <AiOutlineEdit/></Button>
                </Link>
                <br/>
                <br/>
                <Link to={`/my-devices`}>
                    <Button variant="secondary">Back to My Devices <BiDevices/></Button>
                </Link>
            </div>
            </Container>
        );
    }

    return (
        <div>
            <NavBar/>
            <Alert {...alertProps}/>
            {loading ? 
            <div className="d-flex justify-content-center">
                <div  role="status">
                <Spinner className='mt-3' animation="grow" size="sm" />
                </div>
            </div>
            : <RenderStats/>}
            <NavBarBot />
        </div>
    );
}


export default Stats;