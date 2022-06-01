import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "../components/NavBar";

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
                    alert("You already own this device, the config has been updated");
                } else {
                    alert(response.data.message);
                }
            }
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
                return;
            }
        }
    }


    var whatEver = async () => {
        try {
            await axios.get(`${BACKEND_BASE_URL}/my-devices`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
                return;
            }
        }
    }


    /**
     * Do a request to the server to check for authorization
     */
    useEffect(() => {
        whatEver();
    }, []);


    return(
        <div>
        <NavBar/>
        
        <Container>
            <h1>Add Device</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Device ID:</Form.Label>                
                    <Form.Control required type="text" placeholder="Device's Identification Number" onChange={(e) => setDevice({...device, device: {...device.device, id: e.target.value}})}/>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Minimum Temperature</Form.Label>
                    <Form.Control type="number" placeholder="Minimum Temperature" value={device.device.config.min} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, min: Number(e.target.value)}}})}/>
                    <Form.Text className="text-muted">The minimum temperature at which you will be notified</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Maximum Temperature</Form.Label>
                    <Form.Control type="number" placeholder="Maximum Temperature" value={device.device.config.max} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, max: Number(e.target.value)}}})}/>
                    <Form.Text className="text-muted">The maximum temperature at which you will be notified</Form.Text>
                </Form.Group>

                <Form.Group>
                    <Form.Label>Room</Form.Label>
                    <Form.Control type="text" value={device.device.config.room} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, room: e.target.value}}})}/>
                    <Form.Text className="text-muted">The room in which the device is located</Form.Text>
                </Form.Group>
                <Form.Group> 
                    <Form.Label>OTP</Form.Label>
                    <Form.Control required type="text" value={device.device.otp} onChange={(e) => setDevice({...device, device: {...device.device, otp: e.target.value}})}/>
                    <Form.Text className="text-muted">The OTP is a one time password that is used to authorize the device</Form.Text>
                </Form.Group>
                <Row>
                    <Col>
                    <Form.Group>
                        <Form.Label>Active</Form.Label>
                        <Form.Check type="checkbox" checked={device.device.config.active} onChange={(e : any) => setDevice({...device, device: {...device.device, config: {...device.device.config, active: e.target.checked}}})}/>
                        <Form.Text className="text-muted">If the device is active you will get real time temperature measures</Form.Text>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Label>Notify Me</Form.Label>
                        <Form.Check type="checkbox" checked={device.device.config.wantsToBeNotified} onChange={(e : any) => setDevice({...device, device: {...device.device, config: {...device.device.config, wantsToBeNotified: e.target.checked}}})}/>
                        <Form.Text className="text-muted">If you want to be notified when the temperature of this device is out of bounds</Form.Text>
                    </Form.Group>
                    </Col>
                </Row>
                <Form.Group>
                    <Button variant="primary" type="submit">Add device</Button>
                </Form.Group>
            </Form>

            {/* <div>
            <Link to={`/my-devices`}><Button>All Devices</Button></Link>
            </div> */}
        </Container>
        </div>
    )
}

export default AddDevice;