import { set, ref, get, update, child, push } from "@firebase/database";
import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";

const router = express.Router(),
    Log = config.getLog("alter");

router.put('/:deviceId', (req, res) => {
    const device = req.body;
    const deviceId = req.params.deviceId;

    get(ref(db, `devices/${deviceId}`)).then((deviceSnapshot) => {
        if(deviceSnapshot.exists()) {
            update(ref(db, `devices/${deviceId}`), {
                "id": device.id,
                "config": {
                    "min": device.config.min,
                    "max": device.config.max,
                    "room": device.config.room,
                    "active": device.config.active
                    }
            }).then(() => {
                // TODO : send back the access token : {accessToken: req.user.stsTokenManager.accessToken}
                res.status(200).send(`Success - device information changed`);
                Log.info(`Success - device information changed`)
            }).catch((error) => {
                res.status(500).send("Internal server error");
                Log.info("Internal server error");
            });
        } else {
            res.status(401).send("Unauthorised"); 
            Log.info('Unauthorised')
        }
    }).catch((error) => {
        res.status(500).send("Internal server error");
        Log.info("Internal server error");
    })
});

router.delete('/:deviceId', (req, res) => {
    const deviceId = req.params.deviceId;

    get(ref(db, `devices/${deviceId}`)).then((deviceSnapshot) => {
        if(deviceSnapshot.exists()) {
            set(ref(db, `devices/${deviceId}`), null);
            res.status(200).send(`Success - device unlinked`);
            Log.info(`Success - device unlinked`)
        } else {
            res.status(401).send("Unauthorised"); 
            Log.info('Unauthorised')
        }
    }).catch((error) => {
        res.status(500).send("Internal server error");
        Log.info("Internal server error");
    })
})

export default {
    router: router
}