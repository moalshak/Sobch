import * as server from '../web/server.js';
import assert from 'assert';
import { describe } from 'mocha';
//import { get as getRequest } from 'request';
import { ref, get, set } from "@firebase/database";

describe('No JS errors', () => {
    it('running init', (done) =>{
        done();
    });
})

//// testing the alter/{device-id} endpoints

// define some testing variables
const device1 = {
    "id": "1",
    "config" : {
        "active": true,
        "max": 20,
        "min": 15,
        "room": "kitchen"
    },
    "otp": "70"
}

describe('No errors from the alter/{device-id} endpoints', () => {
    it('running alter/{device-id} DELETE request', (done) => {
    set(ref(server.db, `devices/${device1.id}`),
    {
        "id": device1.id,
        "config": {
        "min": device1.config.min,
        "max": device1.config.max,
        "room": device1.config.room,
        "active": device1.config.active
        },
        "otp": device1.otp
    }).then(() => {
        get(ref(server.db, `devices/${device1.id}`)).then((deviceSnapshot) => {
            if(deviceSnapshot.exists()) {
                //getRequest
                done();
            } else {
                console.log("Testing objects have not been created.");
            }
        });
        //done();
    }).catch((error) => {
        console.log(error);
    });
        //get(ref(db, `devices/${deviceId}`)).then
        
    })
})
