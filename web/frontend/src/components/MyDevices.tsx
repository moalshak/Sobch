import axios from 'axios';
import {useState, useEffect} from 'react';
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';
import { useNavigate } from "react-router-dom";

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
            if (err.code === "ERR_BAD_REQUEST") {
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
                {devices.map((device : any) => {
                    return (
                        <div key={device.id}>
                            <h3>Devices' ID : {device.id} | Temp : {device.currentTemp}</h3>
                        </div>
                    );
                })};
            </div>
        );
    }

    return (
        <div>
            {loading ? (firstTime ? <div>Loading...</div> : <RenderDevices/>) : <RenderDevices/>}
        </div>
    )

}


export default MyDevices;