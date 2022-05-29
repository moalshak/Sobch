import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";

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
            <h1>Add Device</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Device ID:
                    <input type="text" value={device.device.id} onChange={(e) => setDevice({...device, device: {...device.device, id: e.target.value}})}/>
                </label>
                <label>
                    Min:
                    <input type="number" value={device.device.config.min} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, min: Number(e.target.value)}}})}/>
                </label>
                <label>
                    Max:
                    <input type="number" value={device.device.config.max} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, max: Number(e.target.value)}}})}/>
                </label>
                <label>
                    Room:
                    <input type="text" value={device.device.config.room} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, room: e.target.value}}})}/>
                </label>
                <label>
                    OTP:
                    <input type="text" value={device.device.otp} onChange={(e) => setDevice({...device, device: {...device.device, otp: e.target.value}})}/>
                </label>
                <label>
                    Active:
                    <input type="checkbox" checked={device.device.config.active} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, active: e.target.checked}}})}/>
                </label>
                <label>
                    Wants to be notified:
                    <input type="checkbox" checked={device.device.config.wantsToBeNotified} onChange={(e) => setDevice({...device, device: {...device.device, config: {...device.device.config, wantsToBeNotified: e.target.checked}}})}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>

            <div>
            <Link to={`/my-devices`}><button>All Devices</button></Link>
            </div>
        </div>
    )
}

export default AddDevice;