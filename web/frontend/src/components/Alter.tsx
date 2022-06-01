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
            const response = await axios.get(`${BACKEND_BASE_URL}/my-devices`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            var devices = response.data.devices;
            var device = devices.find((d : any) => d.id === deviceId);
            if (device) {
                setDevice(device);
                setLoading(false);
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
     * Do a request to the server to check for authorization
     */
    useEffect(()=> {
        getDevice();
    }, []);


    if (loading) {
        return(
        <div>
            <NavBar/>
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div>
        </div>
        );
    } else {
        
        return(
            <div>
            
            <NavBar/>

            <Container>
                <h1>Edit Device</h1>
                <Form onSubmit={handleSubmit}>
                    <input hidden={true} type="text" value={device.id} readOnly={true}/>
                    <Form.Group>
                        <Form.Label>Minimum Temperature</Form.Label>
                        <Form.Control required type="number" placeholder="Minimum Temperature"  value={device.config.min} onChange={(e) => setDevice({...device, config: {...device.config, min: parseInt(e.target.value)}})}/>
                        <Form.Text className="text-muted">The minimum temperature at which you will be notified</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Maximum Temperature</Form.Label>
                        <Form.Control required type="number" placeholder="Maximum Temperature"  value={device.config.max} onChange={(e) => setDevice({...device, config: {...device.config, max: parseInt(e.target.value)}})}/>
                        <Form.Text className="text-muted">The maximum temperature at which you will be notified</Form.Text>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Room</Form.Label>
                        <Form.Control required type="text" placeholder="Room"  value={device.config.room} onChange={(e) => setDevice({...device, config: {...device.config, room: e.target.value}})}/>
                        <Form.Text className="text-muted">The room in which the device is located</Form.Text>
                    </Form.Group>
                    <Row>
                        <Col>
                    <Form.Group>
                        <Form.Label>Active</Form.Label>
                        <Form.Check required type="checkbox" placeholder="Active"  checked={device.config.active} onChange={(e) => setDevice({...device, config: {...device.config, active: e.target.checked}})}/>
                        <Form.Text className="text-muted">If the device is active you will get real time temperature measures</Form.Text>
                    </Form.Group>
                    </Col>
                    <Col>
                    <Form.Group>
                        <Form.Label>Notify Me</Form.Label>
                        <Form.Check required type="checkbox" placeholder="Notify Me"  checked={device.config.wantsToBeNotified} onChange={(e) => setDevice({...device, config: {...device.config, wantsToBeNotified: e.target.checked}})}/>
                        <Form.Text className="text-muted">If you want to be notified when the temperature of this device is out of bounds</Form.Text>
                    </Form.Group>
                    </Col>
                    </Row>
                    <br/>
                    <Button variant="primary" type="submit">
                        Edit Device's Configuration
                    </Button>
                </Form>
            <br/>
            {/* TODO: replace with nav */}
            <Link to={`/my-devices`}><Button>All Devices</Button></Link>

            <Link to={`/stats/${device.id}`}><Button className="ml-3">See this devices Stats</Button></Link>
            <br/>
            </Container>

            </div>
        )
    }
}

export default Alter;