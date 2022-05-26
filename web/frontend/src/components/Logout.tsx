import { useState } from "react";
import axios from 'axios';
import {BACKEND_BASE_URL} from '../App';
import { AnyRecord } from "dns";
import { database } from "firebase-admin";
import {Link } from "react-router-dom";
import {getAccessToken} from "../lib/acc"


function Logout() {



    async function goLogout(e : any) {
        e.preventDefault();
        var data : any = {};
        
        try {
            const res = await axios.post(`${BACKEND_BASE_URL}/logout`, {
            }, {
                headers : {
                    Authorization : `${getAccessToken()}`
                }
            });    
            data = res.data;
            window.location.href = '/';    
    } catch(error) {
        if(data.error) {
            alert(data.error);
        } else {
            alert(`Something went wrong : ${error}`);
        }
    }
    

        
        
        
   
        
    }

    return (
        <div>
            <Link to={'/'}>
                <button onClick={goLogout}>Confirm Logout</button>
            </Link>
        </div>
    );
}


export default Logout;