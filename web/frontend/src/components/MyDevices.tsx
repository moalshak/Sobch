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
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
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
        getDevices();
    }, [updateIndicator]);



    const RenderDevices = function () {
        return (
            <div>
            <Container>
                <h1>MY DEVICES</h1>
                <div>
                    <Link 
                        to={`/add-device`}
                    >
                        <Button>Add Device</Button>
                    </Link>
                </div>
                {devices.map((device : any) => {
                    return (
                        <div>
                        <Card className='mb-3 mt-3'>
                        <div key={device.id}>
                            {/* TODO: add image */}
                            <Row>
                            <Card.Title>Device ID: {device.id}</Card.Title>
                            <br/>
                            <Card.Img variant="top" src="holder.js/100px180"/>
                            <br/>
                            <Col>
                            <span>Current Temperature:</span>
                            </Col>
                            <Col>
                            {
                            device.currentTemp > device.config.max ? 
                                <span style={{fontSize: 28, color: "red"}}>🌡️{device.currentTemp} °C 🔥</span> :
                            device.currentTemp < device.config.min ?
                                <span  style={{fontSize: 28,color: "blue"}}>🌡️{device.currentTemp} °C ❄️</span> :
                            <span style={{fontSize: 28, color: "green"}}>🌡️{device.currentTemp} °C ✅</span>}
                            </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col>
                                {/* <Link to={`/stats/${device.id}`}>
                                <Button >See Stats</Button>
                                </Link> */}
                                <Card.Link href={`/stats/${device.id}`}>See Stats</Card.Link>
                                </Col>

                                <Col>
                                {/* <Link to={`/alter/${device.id}`}>
                                <Button className="">Edit Device</Button>
                                </Link> */}
                                <Card.Link href={`/alter/${device.id}`}>Edit Device</Card.Link>
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
            {loading ? (firstTime ?
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div> : <RenderDevices/>) : <RenderDevices/>}
        </div>
    );

}


export default MyDevices;