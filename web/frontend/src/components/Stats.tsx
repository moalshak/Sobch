import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';

function Stats() {
    
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState([]);

    const [device, setDevice] = useState(
        {
            config: {
                active: true,
                max: 0,
                min: 0,
                room: ""
            },
            currentTemp: 0,
            id: "",
            otp: "",
            owners: []
        }
    );

    const {deviceId} = useParams();


    async function getStats() {
        try {
            setLoading(true);
            const res = await axios.get(`${BACKEND_BASE_URL}/stats/${deviceId}`,
            {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setDevice(res.data.device);
            setOwners(res.data.device.owners);
            setLoading(false);
        } catch(error) {
            alert(error);
        }
    }


    useEffect(()=> {
        getStats();
    }, []);

    function RenderStats() {
        return (
            <div>
                <li>Active : {device.config.active ? "YES" : "NO"}</li>
                <li>Room : {device.config.room}</li>
                <li>Max : {device.config.max}</li>
                <li>Min : {device.config.min}</li>
                <li>Current Temperature : {device.currentTemp}</li>
                <li>OTP : {device.otp}</li>
                <h3>OWNERS</h3>
                {owners.map((owner : any) => {
                    return (
                        <li key={owner}>{owner}</li>
                    )
                })}
            </div>
        );
    }

    return (
        <div>
            <h2>Stats</h2>
            {loading ? 'Loading...' : <RenderStats/>}
        </div>
    );
}


export default Stats;