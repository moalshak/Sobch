import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken, setLoggedIn} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "../components/NavBar";
import {Alert, Variant} from './CustomAlert';
import Spinner from "react-bootstrap/Spinner";

interface Device {
    device: {
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
}

function AddDevice() {

    const [device, setDevice] = useState<Device>({
        device: {
            id: "",
            config: {
                min: 0,
                max: 0,
                room: "",
                active: false,
                wantsToBeNotified: false
            },
            otp: ""
        }
    });

    const [loading, setLoading] = useState(true);

    const [showForm, setShowForm] = useState(true);

    /**
     * Custom alert props which looks cleaner than the regular alert
    */
    const [alertProps, setAlertProps] = useState({
        heading: '',
        message: '',
        variant: Variant.nothing
    });
    

    /**
     * The navigate of react
     */
    const navigate = useNavigate();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const response = await axios.post(`${BACKEND_BASE_URL}/my-devices`, device, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (response.status === 200) {
                if (response.data.message === "Already Owned") {
                    setAlertProps({
                        heading: 'Device Already Owned',
                        message: 'You already own this device! The configuration has been updated',
                        variant: Variant.info
                    });
                    setShowForm(false);
                    setTimeout(() => {
                        navigate(`/stats/${device.device.id}`);
                    }, 2000);
                    return;
                } else if (response.data.message === "device added") {
                    setAlertProps({
                        heading: 'Device Added',
                        message: `The device has been added!`,
                        variant: Variant.success
                    });
                    setShowForm(false);
                    setTimeout(() => {
                        navigate(`/stats/${device.device.id}`);
                    }, 2000);
                    return;
                } else {
                    setAlertProps({
                        heading: 'Warning',
                        message: response.data.message,
                        variant: Variant.warning
                    });
                }
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


    var authenticate = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}/my-devices`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setLoading(false);
            setLoggedIn(true);
        } catch (err : any) {
            if (err.response.status === 401) {
                setAlertProps({
                    heading: 'Not Logged In',
                    message: 'You are not logged in! You will be redirected to the login page in 3 seconds',
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
     * Do a request to the server to check for authorization
     */
    useEffect(() => {
        setLoading(false);
        authenticate();
    }, []);


    return(
        <div>
        <NavBar/>
        <Alert {...alertProps}/>
        <Container className="mt-3">
        {loading || !showForm ? 
            <Spinner className='mt-3' animation="grow" />
            :
            <><h1>Add Device</h1><Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Device ID:</Form.Label>
                            <Form.Control required type="text" placeholder="Device's Identification Number" onChange={(e) => setDevice({ ...device, device: { ...device.device, id: e.target.value } })} />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Minimum Temperature</Form.Label>
                            <Form.Control type="number" placeholder="Minimum Temperature" value={device.device.config.min} onChange={(e) => setDevice({ ...device, device: { ...device.device, config: { ...device.device.config, min: Number(e.target.value) } } })} />
                            <Form.Text className="text-muted">The minimum temperature at which you will be notified</Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Maximum Temperature</Form.Label>
                            <Form.Control type="number" placeholder="Maximum Temperature" value={device.device.config.max} onChange={(e) => setDevice({ ...device, device: { ...device.device, config: { ...device.device.config, max: Number(e.target.value) } } })} />
                            <Form.Text className="text-muted">The maximum temperature at which you will be notified</Form.Text>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Room</Form.Label>
                            <Form.Control type="text" value={device.device.config.room} onChange={(e) => setDevice({ ...device, device: { ...device.device, config: { ...device.device.config, room: e.target.value } } })} />
                            <Form.Text className="text-muted">The room in which the device is located</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>OTP</Form.Label>
                            <Form.Control required type="text" value={device.device.otp} onChange={(e) => setDevice({ ...device, device: { ...device.device, otp: e.target.value } })} />
                            <Form.Text className="text-muted">The OTP is a one time password that is used to authorize the device</Form.Text>
                        </Form.Group>
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Active</Form.Label>
                                    <Form.Check type="checkbox" checked={device.device.config.active} onChange={(e: any) => setDevice({ ...device, device: { ...device.device, config: { ...device.device.config, active: e.target.checked } } })} />
                                    <Form.Text className="text-muted">If the device is active you will get real time temperature measures</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Notify Me</Form.Label>
                                    <Form.Check type="checkbox" checked={device.device.config.wantsToBeNotified} onChange={(e: any) => setDevice({ ...device, device: { ...device.device, config: { ...device.device.config, wantsToBeNotified: e.target.checked } } })} />
                                    <Form.Text className="text-muted">If you want to be notified when the temperature of this device is out of bounds</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group>
                            <Button variant="primary" type="submit">Add device</Button>
                        </Form.Group>
                    </Form></>
        }
        </Container>
        </div>
    )
}

export default AddDevice;