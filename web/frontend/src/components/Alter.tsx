import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";

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
        return <img src="../loading.gif" style={{width:"55px", height:"55px"}}/>
    } else {

        return(
            <div>
            <div>
                <h1>Edit Device</h1>
                <form onSubmit={handleSubmit}>
                    <input hidden={true} type="text" value={device.id} readOnly={true}/>
                    <label>
                        Min:
                        <input type="number" value={device.config.min} onChange={(e) => setDevice({...device, config: {...device.config, min: parseInt(e.target.value)}})}/>
                    </label>
                    <label>
                        Max:
                        <input type="number" value={device.config.max} onChange={(e) => setDevice({...device, config: {...device.config, max: parseInt(e.target.value)}})}/>
                    </label>
                    <label>
                        Room:
                        <input type="text" value={device.config.room} onChange={(e) => setDevice({...device, config: {...device.config, room: e.target.value}})}/>
                    </label>
                    <label>
                        Active:
                        <input type="checkbox" checked={device.config.active} onChange={(e) => setDevice({...device, config: {...device.config, active: e.target.checked}})}/>
                    </label>
                    <label>
                        Notify Me:
                        <input type="checkbox" checked={device.config.wantsToBeNotified} onChange={(e) => setDevice({...device, config: {...device.config, wantsToBeNotified: e.target.checked}})}/>
                    </label>
                    <input type="submit" value="Submit"/>
                </form>
            </div>
            <Link to={`/my-devices`}><button>All Devices</button></Link>
            <Link to={`/stats/${device.id}`}><button>See this devices Stats</button></Link>
            </div>
        )
    }
}

export default Alter;