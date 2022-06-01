import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "./NavBar";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import {setLoggedIn} from "../lib/acc";
import {Alert, AlertProps, Variant} from './CustomAlert';


interface Device {
    id: string,
    config: {
        min: number,
        max: number,
        room: string,
        active: boolean,
        wantsToBeNotified: boolean
    },
    otp: string
}

function Alter() {

    const [device, setDevice] = useState<Device>({
        id: "",
        config: {
            min: 0,
            max: 0,
            room: "",
            active: false,
            wantsToBeNotified: false
        },
        otp: ""
    });



    /**
     * The navigate of react
     */
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const {deviceId} = useParams();


    const [showForm, setShowForm] = useState(true);

    /**
     * Custom alert props which looks cleaner than the regular alert
     */
    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_BASE_URL}/my-devices`, {device}, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (response.status === 200) {
                if (response.data.message === "Already Owned") {
                    alert("The config has been updated");
                } else {
                    alert(response.data.message);
                }
            }
            setLoading(false);
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
                return;
            }
        }
    }


    var getDevice = async () => {
        try {
            const response = await axios.get(`${BACKEND_BASE_URL}/stats/${deviceId}`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            var device = response.data.device;
            if (device) {
                setDevice(device);
                setLoading(false);
            }
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
        }
    }

    var deleteDevice = async () => {
        try {
            const response = await axios.delete(`${BACKEND_BASE_URL}/alter/${deviceId}`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (response.status === 200) {
                setAlertProps({
                    heading: 'Device Deleted',
                    message: 'The device has been deleted!',
                    variant: Variant.success
                });
                setTimeout(() => {
                    navigate("/my-devices");
                }, 2500);
                setShowForm(false);
                return;
            }
        } catch (err : any) {
            if (err.response.data.error) {
                setAlertProps({
                    heading: 'Error',
                    message: err.response.data.message,
                    variant: Variant.danger
                });
                return;
            }
        }
    }


    /**
     * Do a request to the server to check for authorization
     */
    useEffect(()=> {
        setLoggedIn(false);
        getDevice();
    }, []);



        
    return(
        <div>
            <NavBar/>
            <Alert {...alertProps}/>
            <Container>
        {loading || !showForm ? 
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div>
        :
            <><h1>Edit Device</h1><Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Device's ID:</Form.Label>
                            <Form.Control value={deviceId} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Minimum Temperature</Form.Label>
                            <Form.Control required type="number" placeholder="Minimum Temperature" value={device.config.min} onChange={(e) => setDevice({ ...device, config: { ...device.config, min: parseInt(e.target.value) } })} />
                            <Form.Text className="text-muted">The minimum temperature at which you will be notified</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Maximum Temperature</Form.Label>
                            <Form.Control required type="number" placeholder="Maximum Temperature" value={device.config.max} onChange={(e) => setDevice({ ...device, config: { ...device.config, max: parseInt(e.target.value) } })} />
                            <Form.Text className="text-muted">The maximum temperature at which you will be notified</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Room</Form.Label>
                            <Form.Control type="text" value={device.config.room} onChange={(e) => setDevice({ ...device, config: { ...device.config, room: e.target.value } })} />
                            <Form.Text className="text-muted">The room in which the device is located</Form.Text>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Active</Form.Label>
                                    <ButtonGroup className="ms-3">
                                        <ToggleButton variant='outline-success' value={device.config.active ? "1" : "0"} type="radio" onChange={(e) => setDevice({ ...device, config: { ...device.config, active: e.target.checked } })}>Yes</ToggleButton>
                                        <ToggleButton variant='outline-danger' value={device.config.active ? "0" : "1"} type="radio" onChange={(e) => setDevice({ ...device, config: { ...device.config, active: e.target.checked } })}>No</ToggleButton>
                                    </ButtonGroup>
                                    <br />
                                    <Form.Text className="text-muted">If the device is active you will get real time temperature measures</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Notify Me</Form.Label>
                                    <ButtonGroup className="ms-3">
                                        <ToggleButton variant='outline-success' value={device.config.wantsToBeNotified ? "1" : "0"} type="radio" onChange={(e) => setDevice({ ...device, config: { ...device.config, wantsToBeNotified: e.target.checked } })}>Yes</ToggleButton>
                                        <ToggleButton variant='outline-danger' value={device.config.wantsToBeNotified ? "0" : "1"} type="radio" onChange={(e) => setDevice({ ...device, config: { ...device.config, wantsToBeNotified: e.target.checked } })}>No</ToggleButton>
                                    </ButtonGroup>
                                    <br />
                                    <Form.Text className="text-muted">If you want to be notified when the temperature of this device is out of bounds</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Button variant="primary" type="submit">
                            Edit This Device's Configuration
                        </Button>
                        <Button className="ms-3" variant="danger" onClick={deleteDevice}>
                            Unlink This Device
                        </Button>
                    </Form><br /><Link to={`/my-devices`}><Button variant="secondary" className='mt-3 mb-3'>All Devices</Button></Link><Link to={`/stats/${device.id}`}><Button variant="secondary" className="ms-3">See this devices Stats</Button></Link><br /></>
    }
        </Container>
        </div>
    )
}

export default Alter;