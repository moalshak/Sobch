import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import NavBar from "./NavBar";
import {isLoggedIn, setLoggedIn} from "../lib/acc";

function Stats() {
    
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState([]);
    const [currentTemp, setCurrentTemp] = useState(undefined);


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
        } catch(error) {
            alert(error);
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
        } catch(error) {
            alert(error);
        }
    }


    function CurrenTemp() {
        if (currentTemp) {
            return (
                <span>
                {currentTemp > device.config.max ? <span style={{fontSize: 16, color: "red"}}>🌡️{currentTemp} °C 🔥</span> :
                currentTemp < device.config.min ? <span  style={{fontSize: 16,color: "blue"}}>🌡️{currentTemp} °C ❄️</span> :
                <span style={{fontSize: 16, color: "green"}}>🌡️{currentTemp} °C ✅</span>}
                </span>
            )

        } else {
            return (
                <img src="../loading.gif" style={{width:"16px", height:"16px"}}/>
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
                                    <b>Max:</b> {device.config.max}
                                </span>
                            </Col>
                            <Col>
                                <span>
                                    <b>Min:</b> {device.config.min}
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
                                    <b>Notify Me:</b> {device.config.wantsToBeNotified ? "Yes" : "No"}
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
                    <Button variant="secondary">Edit This Devices Configuration</Button>
                </Link>
                <br/>
                <br/>
                <Link to={`/my-devices`}>
                    <Button variant="secondary">Back to My Devices</Button>
                </Link>
            </div>
            </Container>
        );
    }

    return (
        <div>
            <NavBar/>
            {loading ? 
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div>
            : <RenderStats/>}
        </div>
    );
}


export default Stats;