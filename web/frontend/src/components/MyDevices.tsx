import axios from 'axios';
import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "./NavBar";
import {Alert, Variant} from './CustomAlert';
import {isLoggedIn, setLoggedIn} from "../lib/acc";
import Spinner from "react-bootstrap/Spinner";

function MyDevices() {

    /**
     * List of devices
     */
    const [devices, setDevices] = useState([]);

    /**
     * First time visiting the page
     */
    const [firstTime, setFirstTime] = useState(true);

    /**
     * loading or not
     */
    const [loading, setLoading] = useState(true);

    /**
     * The navigate of react
     */
    const navigate = useNavigate();

    /**
     * The access token confirm authorization
     */
    const accessToken = getAccessToken();

    /**
     * The update indicator for the refresh of the devices
     */
    const [updateIndicator, setUpdateIndicator] = useState(false);


    /**
     * Custom alert props which looks cleaner than the regular alert
     */
    const [alertProps, setAlertProps] = useState({
        heading: '',
        message: '',
        variant: Variant.nothing
    });


    /**
     * Retrieve devices from the server
     */
    const getDevices = async () => {

        if (firstTime) {
            setLoading(true);
        }

        try {
            const response = await axios.get(`${BACKEND_BASE_URL}/my-devices`, {
                headers: {
                    Authorization: `${accessToken}`
                }
            });
            var ids = response.data.devices || [];
            setDevices(ids);
            
            if (firstTime) {
                setLoading(false);
                setFirstTime(false);
            }
            setLoggedIn(true);
        } catch (err : any) {
            if (err.response.status === 401) {
                setAlertProps({
                    heading: 'You are not logged in!',
                    message: 'You will be redirected to the login page in 3 seconds',
                    variant: Variant.warning
                });
                setTimeout(()=> {
                    navigate("/login");
                }, 3000);
                return;
            }
        }
    }

    /**
     * Update the update indicator every x seconds to show the user that the current temp
     */
    setTimeout(()=> {
        if (updateIndicator) {
            setUpdateIndicator(false);
        } else {
            setUpdateIndicator(true);
        }
    }, 5000);
    
    /**
     * Watch the updateIndicator state and update the devices list
     */
    useEffect(() => {
        setLoggedIn(false);
        getDevices();
    }, [updateIndicator]);



    const RenderDevices = function () {
        return (
            <div>
            <Container>
                <h1>MY DEVICES</h1>
                <div>
                    <div 
                        className="d-grid"
                    >
                        <Button href={`/add-device`} variant="outline-primary" className='mt-3 mb-3' size="lg">Add Device</Button>
                    </div>
                </div>
                {devices.map((device : any) => {
                    return (
                        <div>
                        <Card className='mb-3 mt-3 pb-1 center'>
                        <div key={device.id}>
                            {/* TODO: add image */}
                            <Row>
                            <Card.Title >Device ID: {device.id}</Card.Title>
                            <br/>

                            <Row className="justify-content-md-center">
                                <Col xs={12} sm={4} md={4}>
                                    if(device.model == "Sobch DHT-11"){
                                        <Card.Img  src="./images/therm1.jpg"></Card.Img>
                                    }
                                    if(device.model == "Sobch DHT-22"){
                                        <Card.Img  src="./images/therm2.jpg"></Card.Img>
                                    }
                                    if(device.model == "Sobch DHT-33"){
                                        <Card.Img  src="./images/therm3.jpg"></Card.Img>
                                    }
                                    if(device.model == "Sobch DHT-44"){
                                        <Card.Img  src="./images/therm4.jpg"></Card.Img>
                                    }
                                    if(device.model == "Sobch DHT-55"){
                                        <Card.Img  src="./images/therm5.jpg"></Card.Img>
                                    }
                                </Col>
                            </Row>
                            <br/>
                            <br/>
                            <Col>
                            </Col>
                            <span><b style={{fontSize: 24}}>Current Temperature:</b>
                            {
                            device.currentTemp > device.config.max ? 
                                <span style={{fontSize: 24, color: "red"}}> {device.currentTemp}°C <span style={{fontSize: 20, color: "green"}}>🔥</span></span> :
                            device.currentTemp < device.config.min ?
                                <span  style={{fontSize: 24,color: "blue"}}> {device.currentTemp} °C <span style={{fontSize: 20, color: "green"}}>❄️</span></span> :
                            <span style={{fontSize: 24, color: "green"}}> {device.currentTemp} °C <span style={{fontSize: 20, color: "green"}}>✅</span></span>}
                            </span>
                            </Row>

                            <br/>
                            <Row>
                                <Col>
                                <Button style={{width : "100%"}} variant="outline-primary" size='sm' href={`/stats/${device.id}`}>See Stats</Button>
                                </Col>
                                <Col>
                                <Button style={{width : "100%"}} variant="outline-primary" size='sm' href={`/alter/${device.id}`}>Edit Device</Button>
                                </Col>
                            </Row>
                        </div>
                        </Card>
                        </div>
                    );
                })}
            </Container>
            </div>
        );
    }

    return (
        <div>
            <NavBar/>
            <Alert {...alertProps}/>
            {loading ? (firstTime ?
            <div className="d-flex justify-content-center">
                <div  role="status">
                <Spinner className='mt-3' animation="grow" />
                </div>
            </div> : <RenderDevices/>) : <RenderDevices/>}
        </div>
    );

}


export default MyDevices;