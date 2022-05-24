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
    } catch(error) {
        res.status(500).send({message: "Internal server error", error: error});
        Log.info("Internal server error", {user: user.uid});
        return;
    }
})

router.delete('/:deviceId', async (req, res) => {
    var deviceId, user;
    try {
        deviceId = req.params.deviceId.trim();
        user = req.user;
    } catch(error) {
        res.status(400).send({error: "Bad Request"});
        Log.error(error);
        return;
    }

    try {
        var deviceSnapshot = await get(ref(db, `devices/${deviceId}`));

        if(deviceSnapshot.exists()) {
            var requester = await get(ref(db, `users/${user.uid}`));

            if(requester.exists()) {
                var owns = requester.val().owns;
                var owners = deviceSnapshot.val().owners;
                if (owns.includes(deviceId)) {
                    //console.log("owns: " + owns);
                    //console.log("owners: " + owners + "\n\n");
                    var indexDevice = owns.indexOf(deviceId);
                    var indexOwner = owners.indexOf(user.uid);
                    owns.splice(indexDevice, 1);
                    owners.splice(indexOwner, 1);
                    //console.log("owns: " + owns);
                    //console.log("owners: " + owners);
                    await set(ref(db, `users/${user.uid}/owns`), owns);
                    await set(ref(db, `devices/${deviceId}/owners`), {"owners": []});  

                    res.status(200).send({message: "Success device deleted",accessToken: req.user.stsTokenManager.accessToken});
                    Log.info("Success device deleted", {deviceId: deviceId, user : user.uid});
                    return;
                } else {
                    res.status(401).send({error: "Unauthorized"});
                    Log.info("Unauthorized user does not own this device", {user : user.uid});
                    return;
                }
            } else {
                res.status(401).send({error: "Unauthorized"});
                Log.info("Unauthorized user does not own this device", {user : user.uid});
                return;
            }
        }
    } catch(error) {
        console.log(error);
        res.status(500).send({message: "Internal server error", error: error});
        Log.info("Internal server error", {user: user.uid});
        return;
    }
})

export default {
    router: router
}