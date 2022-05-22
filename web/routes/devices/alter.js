import { set, ref, get, update, child, push } from "@firebase/database";
import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";

const router = express.Router(),
    Log = config.getLog("alter");

router.put('/:deviceId', (req, res) => {
    const device = req.body;
    const deviceId = req.params.deviceId.trim();
    const user = req.user;

    get(ref(db, `users/devices/${deviceId}`)).then((deviceSnapshot) => {
        if(deviceSnapshot.exists() && deviceSnapshot.val().owner.includes(user.uid)) {
            update(ref(db, `users/devices/${deviceId}`), {
                "id": device.id,
                "config": {
                    "min": device.config.min,
                    "max": device.config.max,
                    "room": device.config.room,
                    "active": device.config.active
                    }
            }).then(() => {
                res.status(200).send({message : "Success - device information changed", accessToken: req.user.stsTokenManager.accessToken});
                Log.info(`Success - device information changed`)
            }).catch((error) => {
                res.status(500).send({error: "Internal server error", accessToken: req.user.stsTokenManager.accessToken});
                Log.info("Internal server error");
            });
        } else {
            res.status(401).send({error: "Unauthorized", accessToken: req.user.stsTokenManager.accessToken}); 
            Log.info('Unauthorised')
        }
    }).catch((error) => {
        res.status(500).send({error: "Internal server error", accessToken: req.user.stsTokenManager.accessToken});
        Log.info("Internal server error");
    })
});

router.delete('/:deviceId', (req, res) => {
    const deviceId = req.params.deviceId.trim();
    const user = req.user;

    get(ref(db, `users/devices/${deviceId}`)).then((deviceSnapshot) => {
        if(deviceSnapshot.exists() && deviceSnapshot.val().owner.includes(user.uid)) {
            set(ref(db, `users/devices/${deviceId}`), null);
            res.status(200).send({message : "Success - device unlinked", accessToken: req.user.stsTokenManager.accessToken});
            Log.info(`Success - device unlinked`)
        } else {
            res.status(401).send({error: "Unauthorized", accessToken: req.user.stsTokenManager.accessToken}); 
            Log.info('Unauthorised')
        }
    }).catch((error) => {
        res.status(500).send({error: "Internal server error", accessToken: req.user.stsTokenManager.accessToken});
        Log.info("Internal server error");
    })
})

export default {
    router: router
}