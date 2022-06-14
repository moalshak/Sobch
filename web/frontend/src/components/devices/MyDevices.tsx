import axios from 'axios';
import {useEffect, useState} from 'react';
import {BACKEND_BASE_URL} from '../../App';
import {getAccessToken, isLoggedIn, setLoggedIn} from '../../lib/acc';
import {useNavigate} from "react-router-dom";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar, {NavBarBot} from "../utils/NavBar";
import {Alert, Variant} from '../utils/CustomAlert';
import Spinner from "react-bootstrap/Spinner";
import {AiOutlineEdit} from "react-icons/ai";
import {ImStatsBars} from 'react-icons/im';
import {BiAddToQueue} from 'react-icons/bi';
import ProgressBar from 'react-bootstrap/ProgressBar';

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
            let ids = response.data.devices || [];

            if (ids.length === 0) {
                setAlertProps({
                    heading: 'No Devices Found',
                    message: 'You have no devices yet. Please add a device to your account.',
                    variant: Variant.info
                });
                setLoggedIn(true);
                setLoading(false);
                setFirstTime(false);
                return;
            }

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
                    message: 'You will be redirected to the login page in a few seconds',
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
        if (devices.length > 0) {
            if (updateIndicator) {
                setUpdateIndicator(false);
            } else {
                setUpdateIndicator(true);
            }
        }
    }, 5000);
    
    /**
     * Watch the updateIndicator state and update the devices list
     */
    useEffect(() => {
        setLoggedIn(false);
        getDevices();
    }, [updateIndicator]);


    function ModelImg(model){
        model = model.model; // JS being JS
        let link;
        if(model === "Sobch DHT-11"){
            link = "./images/therm1.jpg";
        }
        if(model === "Sobch DHT-22"){
            link = "./images/them2.jpg";
        }
        if(model === "Sobch DHT-33"){
            link = "./images/therm3.jpg";
        }
        if(model === "Sobch DHT-44"){
            link = "./images/therm4.jpg";
        }
        if(model === "Sobch DHT-55"){
            link = "./images/therm5.jpeg";
        }
        return (
            <Card.Img  src={link}/>
        );
        
    }

    // not that kind of head u freak!
    function GetHead() {
        if (!isLoggedIn()) {
            return (
                <></>
            );
        }
        return (
                <div>
                <h1>MY DEVICES</h1>
                <div 
                    className="d-grid"
                >
                    <Button href={`/add-device`} variant="outline-primary" className='mt-3 mb-3' size="lg">Add Device <BiAddToQueue/></Button>
                </div>
            </div>
        )
    }

    const RenderDevices = function () {
        return (
            <div>
                {devices.map((device : any) => {
                    return (
                        
                        <div>
                        <Card className='mb-3 mt-3 pb-1 center'>
                        <div key={device.id}>
                            <Row>
                            <Card.Title >Device ID: {device.id}</Card.Title>
                            <br/>

                            <Row className="justify-content-md-center">
                                <Col xs={12} sm={4} md={4}>
                                  <ModelImg model={device.model}/>
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
                            <ProgressBar
                            label={device.currentTemp <= device.config.min ? `Lower than min by ${Math.round(((device.config.min - device.currentTemp)*100))/100}` : device.currentTemp >= device.config.max ? `Higher than max by ${Math.round(((device.currentTemp - device.config.max)*100))/100}` : "Normal"}
                            variant={device.currentTemp >= device.config.max || device.currentTemp <= device.config.min ? 'danger' : 'info'}
                            max={device.config.max + 3}
                            min={device.config.min - 4}
                            now={device.currentTemp} />

                            <br/>
                            <Row>
                                <Col>
                                <Button style={{width : "100%"}} variant="outline-primary" size='sm' href={`/stats/${device.id}`}>See Stats <ImStatsBars/></Button>
                                </Col>
                                <Col>
                                <Button style={{width : "100%"}} variant="outline-primary" size='sm' href={`/alter/${device.id}`}>Edit Device <AiOutlineEdit/></Button>
                                </Col>
                            </Row>
                        </div>
                        </Card>
                        </div>
                    );
                })}
            </div>
        );
    }
    
    return (
        <div>
        <NavBar/>
        <div>
            <Alert {...alertProps}/>
            <Container>
            <GetHead/>
            {loading ? (firstTime ?
            <div className="d-flex justify-content-center">
                <div  role="status">
                <Spinner className='mt-3' animation="grow" />
                </div>
            </div> : <RenderDevices/>) : <RenderDevices/>}
            </Container>
        </div>
        <NavBarBot />
        </div>
    );

}


export default MyDevices;