import { set, ref, get, update } from "firebase/database";
import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";

const router = express.Router(),
    Log = config.getLog("alter");

    router.put('/:deviceId', async (req, res) => {
        var device, deviceId, user, config;
            try {
                device = req.body;
                config = device.config;
                deviceId = req.params.deviceId.trim();
                user = req.user;
            } catch(error) {
                res.status(400).send({error: "Bad Request"});
                Log.error(error);
                return;
            }
    
        try {
            // const deviceSnapshot = await get(ref(db, `users/${user.uid}/owns/${deviceId}`));
            const deviceSnapshot = await get(ref(db, `devices/${deviceId}`));
            
            if(deviceSnapshot.exists()) {
                var requester = await get(ref(db, `users/${user.uid}`));
                if (requester.exists()) {
                    var owns = requester.val().owns;
                    if (owns.includes(deviceId)) {
                        const deviceVal = deviceSnapshot.val();

                        const min = config.min || deviceVal.config.min || 0;
                        const max = config.max || deviceVal.config.max || 30;
                        const room = config.room || deviceVal.config.room || "";
                        const active =  config.active || deviceVal.config.active || false;
                        
                        deviceVal.config = {
                            "min": min,
                            "max": max,
                            "room": room,
                            "active": active
                        }
    
                        await set(ref(db, `devices/${deviceId}`), deviceVal);
                        res.status(200).send({message: "Success device updated", device : deviceVal,accessToken: req.user.stsTokenManager.accessToken});
                        Log.info("Success device updated", {device : deviceVal, user : user.uid});
                        return;
                    } else {
                        res.status(401).send({error: "Unauthorized"});
                        Log.info("Unauthorized user does not own this device", {user : user.uid});
                        return;
                    }
                } else {
                    res.status(401).send({error: "Unauthorized"});
                    Log.info("Unauthorized user does not exist", {user : user.uid});
                    return;
                }
            }
        } catch(err) {
            res.status(300).send({error: "Internal server error"});
            Log.info("Internal server error", {user: user.uid});
            return;
        }
    })

router.delete('/:deviceId', (req, res) => {
    const deviceId = req.params.deviceId.trim();
    const user = req.user;

    get(ref(db, `users/owns/${deviceId}`)).then((deviceSnapshot) => {
        if(deviceSnapshot.exists() && deviceSnapshot.val().owner.includes(user.uid)) {
            get(ref(db, `devices/${user.uid}`)).then((userSnapshot) => {
                if(userSnapshot.exists() && userSnapshot.val().owner.includes(user.uid)) {
                    set(ref(db, `devices/${user.uid}`), null);
                    set(ref(db, `users/owns/${deviceId}`), null);
                    res.status(200).send({message : "Success - device unlinked", accessToken: user.stsTokenManager.accessToken});
                    Log.info(`Success - device unlinked`)
                } else {
                    res.status(401).send({error: "Unauthorized", accessToken: user.stsTokenManager.accessToken}); 
                    Log.info('Unauthorised')
                }
            });
        } else {
            res.status(401).send({error: "Unauthorized", accessToken: user.stsTokenManager.accessToken}); 
            Log.info('Unauthorised')
        }

    }).catch((error) => {
        res.status(500).send({error: "Internal server error", accessToken: user.stsTokenManager.accessToken});
        Log.info("Internal server error");
    })


})

export default {
    router: router
}