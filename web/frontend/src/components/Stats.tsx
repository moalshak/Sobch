import axios from 'axios';
import {useEffect, useState} from 'react';
import {useParams} from "react-router-dom";
import {BACKEND_BASE_URL} from '../App';
import {getAccessToken} from '../lib/acc';
import {Link} from "react-router-dom";

function Stats() {
    
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState([]);
    const [currentTemp, setCurrentTemp] = useState(undefined);


    /**
     * The update indicator for the refresh of the devices
     */
    const [updateIndicator, setUpdateIndicator] = useState(false);

    const [device, setDevice] = useState(
        {
            config: {
                active: true,
                max: 0,
                min: 0,
                room: "",
                wantsToBeNotified: true
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
            setCurrentTemp(res.data.currentTemp);
            setOwners(res.data.device.owners);
            setLoading(false);
        } catch(error) {
            alert(error);
        }
    }

    async function getCurrentTemp() {
        try {
            const res = await axios.get(`${BACKEND_BASE_URL}/stats/${deviceId}`,
            {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setCurrentTemp(res.data.device.currentTemp);
        } catch(error) {
            alert(error);
        }
    }


    function CurrenTemp() {
        if (currentTemp) {
            return (
                <span>
                {currentTemp > device.config.max ? <span style={{fontSize: 16, color: "red"}}>🌡️{currentTemp} °C 🔥</span> :
                currentTemp < device.config.min ? <span  style={{fontSize: 16,color: "blue"}}>🌡️{currentTemp} °C ❄️</span> :
                <span style={{fontSize: 16, color: "green"}}>🌡️{currentTemp} °C ✅</span>}
                </span>
            )

        } else {
            return (
                <img src="../loading.gif" style={{width:"16px", height:"16px"}}/>
            )
        }
    }

    setTimeout(()=> {
        if (updateIndicator) {
            setUpdateIndicator(false);
        } else {
            setUpdateIndicator(true);
        }
    }, 5000);


    useEffect(()=> {
        getStats();
    }, []);



    useEffect(()=> {
        getCurrentTemp();   
    }, [updateIndicator])



    function RenderStats() {
        return (
            <div>
                <li>Active : {device.config.active ? <span style={{color: "green"}}>YES</span> : <span style={{color: "red"}}>NO</span>}</li>
                <li>Room : {device.config.room}</li>
                <li>Max : {device.config.max}</li>
                <li>Min : {device.config.min}</li>
                <li>Current temperature: {<CurrenTemp/>}</li>
                <li>OTP : {device.otp}</li>
                <h3>OWNERS</h3>
                {owners.map((owner : any) => {
                    return (
                        <li key={owner}>{owner}</li>
                    )
                })}
                <li>Notify me: {device.config.wantsToBeNotified ? "Yes" : "No"}</li>
            <div>
                <Link to={`/alter/${deviceId}`}>
                    <button>Edit This Devices Configuration</button>
                </Link>
                <Link to={`/my-devices`}>
                    <button>Back to My Devices</button>
                </Link>
            </div>
            </div>
        );
    }

    return (
        <div>
            <h2>Stats</h2>
            {loading ? <img src="../loading.gif" style={{width:"55px", height:"55px"}}/> : <RenderStats/>}
        </div>
    );
}


export default Stats;