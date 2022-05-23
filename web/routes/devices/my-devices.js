import {db, auth} from '../../server.js';
import config from "../../../lib/config.js";
import express from "express";
import { ref, set, get, push} from "firebase/database";

const router = express.Router(),
    Log = config.getLog("my-devices");


router.post("/", (req, res) => {
    const device = req.body.device,
        user = req.user;

    set(ref(db, `devices/${device.id}`),
    {
        "id": device.id,
        "config": {
            "min": device.config.min,
            "max": device.config.max,
            "room": device.config.room,
            "active": device.config.active
        },
        "owner" : [user.uid],
        "otp": req.body.otp
    });
    get(ref(db, `users/${user.uid}`)).then((snapshot) => {
        if(snapshot.exists()) 
        {
            const user = snapshot.val();
            if (user.owns === undefined) {
                user.owns = [];
            }
            user.owns.push(device.id);
            // user.owns = []; // uncomment this to remove all devices from the admins
            set(ref(db, `users/${user.uid}`), user);   
    }
    });
    // const snapshot = await get(ref(db, `users/${user.uid}`))
    // const userr = snapshot.val();
    // if (userr.owns === undefined) {
    //     userr.owns = [];
    // }
    // userr.owns.push(device.id);
    // user.owns = []; // uncomment this to remove all devices from the admins
    // set(ref(db, `users/${user.uid}`), user);


    //TODO - Linking user to Device, Make sure only a valid device id (containted in database). 
    res.status(200).send({device : req.body, accessToken: req.user.stsTokenManager.accessToken});
    Log.info("Device added", device);
});

router.get("/", (req, res) => {
    // TODO : send back the access token : {accessToken: req.user.stsTokenManager.accessToken}
    // TODO: only allow this if the user is the owner of the device
    const user = req.user;

    var fuck = get(ref(db, `devices`));
    console.log(fuck);
    res.status(200).send("Request received");
    Log.info("Request received");
});

export default {
    router: router
}
