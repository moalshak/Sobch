import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken, isLoggedIn} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar, {NavBarBot} from "../components/NavBar";
import ToggleButton from "react-bootstrap/ToggleButton";
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import Modal from "react-bootstrap/Modal";
import {setLoggedIn} from "../lib/acc";
import {Alert, AlertProps, Variant} from './CustomAlert';
import Spinner from "react-bootstrap/Spinner";
import { AiOutlineEdit } from "react-icons/ai";
import {ImStatsBars} from "react-icons/im";
import {BiDevices, BiUnlink} from "react-icons/bi";

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


    const [showDialog, setShowDialog] = useState(false);

    const [isEdit, setIsEdit] = useState(false);

    function handleClose() {
        setShowDialog(false);
    }

    function handleShowDialog() {
        setShowDialog(true);
    }

    /**
     * Custom alert props which looks cleaner than the regular alert
     */
    const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });

    async function handleSubmit() {
        try {
            setLoading(true);
            const response = await axios.post(`${BACKEND_BASE_URL}/my-devices`, {device}, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (response.status === 200) {
                if (response.data.message === "Already Owned") {
                    setAlertProps({
                        heading: 'Your device has been updated',
                        message: 'Device preferences changed',
                        variant: Variant.success
                    });
                } else {
                    setAlertProps({
                        heading: "Something went wrong",
                        message: response.data.message,
                        variant: Variant.danger
                    });
                }
            }
            setLoading(false);
            setShowDialog(false);
        } catch (err : any) {
            if (err.response.status === 401) {
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
            setShowDialog(false);
        } catch (err : any) {
            if (err.response.status === 401) {
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
                    heading: 'Device Removed',
                    message: 'The device has been unlinked!',
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
        {loading || !showForm || !isLoggedIn() ? 
            <div className="d-flex justify-content-center">
                <Spinner className='mt-3' animation="grow" />
            </div>
        :
            <> 
            <Modal show={showDialog} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>{isEdit ? "Edit" : "Delete"} Device</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to {isEdit ? "edit" : "unlink"} this device?
                    <br/>
                    {!isEdit ? "This will remove the device from your account and you will no longer be able to view it's stats. In order to add it again you will need the OTP" : ""}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={isEdit ? handleSubmit : deleteDevice}>
                    Confirm
                </Button>
                </Modal.Footer>
            </Modal>
            
            <h1>Edit Device</h1><Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Device's ID:</Form.Label>
                            <Form.Control value={deviceId} disabled />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Minimum Temperature</Form.Label>
                            <Form.Control required step={0.1} type="number" placeholder="Minimum Temperature" value={device.config.min} onChange={(e) => setDevice({ ...device, config: { ...device.config, min: Number(e.target.value) } })} />
                            <Form.Text className="text-muted">The minimum temperature at which you will be notified</Form.Text>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Maximum Temperature</Form.Label>
                            <Form.Control required step={0.1} type="number" placeholder="Maximum Temperature" value={device.config.max} onChange={(e) => setDevice({ ...device, config: { ...device.config, max: Number(e.target.value) } })} />
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
                                    <ToggleButtonGroup id="ToggleButtonGroup-1" defaultValue={device.config.active ? 1 : 2} className="ms-3" type="radio" name="options-1" onChange={(value) => setDevice({ ...device, config: { ...device.config,  active: value === 1} })}>
                                    <ToggleButton variant='outline-success' checked={device.config.active} id="tbg-radio-1" value={1}>
                                    Yes
                                    </ToggleButton>
                                    <ToggleButton variant='outline-danger' checked={!device.config.active} id="tbg-radio-2" value={2}>
                                    No
                                    </ToggleButton>
                                    </ToggleButtonGroup>
                                    <br />
                                    <Form.Text className="text-muted">If the device is active you will get real time temperature measures</Form.Text>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Notify Me</Form.Label>
                                    <ToggleButtonGroup id="ToggleButtonGroup-2" defaultValue={device.config.wantsToBeNotified ? 3 : 4} className="ms-3" type="radio" name="options-2" onChange={(value) => setDevice({ ...device, config: { ...device.config,  wantsToBeNotified: value === 3} })}>
                                    <ToggleButton variant='outline-success' checked={device.config.wantsToBeNotified} id="tbg-radio-3" value={3}>
                                    Yes
                                    </ToggleButton>
                                    <ToggleButton variant='outline-danger' checked={!device.config.wantsToBeNotified} id="tbg-radio-4" value={4}>
                                    No
                                    </ToggleButton>
                                    </ToggleButtonGroup>
                                    <br />
                                    <Form.Text className="text-muted">If you want to be notified when the temperature of this device is out of bounds</Form.Text>
                                </Form.Group>
                            </Col>
                        </Row>
                        <br />
                        <Button variant="primary" onClick={(_) => {
                            setIsEdit(true);
                            handleShowDialog();
                        }}>
                            Edit This Device's Configuration <AiOutlineEdit/>
                        </Button>
                        <Button className="ms-3" variant="danger" onClick={(_) => {
                            setIsEdit(false);
                            handleShowDialog();
                        }}>
                            Unlink This Device <BiUnlink/>
                        </Button>
                    </Form><br /><Link to={`/my-devices`}><Button variant="secondary" className='mt-3 mb-3'>All Devices <BiDevices/></Button></Link><Link to={`/stats/${device.id}`}><Button variant="secondary" className="ms-3">See this devices Stats <ImStatsBars/></Button></Link><br /></>
    }
        </Container>
        <NavBarBot />
        </div>
    )
}

export default Alter;