import {db, auth} from "../../../lib/firebase.js";
import {getLog} from "../../../lib/config.js";
import express from "express";
import { ref, set, get, push} from "firebase/database";

const router = express.Router(),
    Log = getLog("my-devices");


function alreadyOwned(res) {
    res.status(200).send({error : false, message: "Already Owned"});
    Log.info("Already Owned device request");
    return;
}

function unauthorized(res, req) {
    res.status(403).send({error : true, message: "Invalid match (device id / otp)", accessToken: req.user.stsTokenManager.accessToken});
    return;
}


router.post("/", async (req, res) => {
    var device, otp, user;
    try {
        device = req.body.device;
        otp = device.otp;
        user = req.user;
    } catch(error) {
        res.status(400).send({error: true, message : "Bad Request"});
        Log.error(error);
        return;
    }

    const deviceId = device.id.toString().trim();
    const snapshot = await get(ref(db, `devices/${deviceId}`));
    if (snapshot.exists()) {
        var deviceSnapshot = snapshot.val();
        // otp matches -> add device
        if (otp === deviceSnapshot.otp) {
            Log.info("OTP MATCHES!")
            // make sure device owners is an array
            if (deviceSnapshot.owners === undefined || !Array.isArray(deviceSnapshot.owners)) {
                deviceSnapshot.owners = [];
            }
            // device already owned
            var deviceLiked = deviceSnapshot.owners.includes(user.uid);
            if (!deviceLiked) {
                deviceSnapshot.owners.push(user.uid);
            }
            if (device.config) {
                deviceSnapshot.config = device.config;
            }
            await set(ref(db, `devices/${deviceId}`), deviceSnapshot);
            var userSnapshot = (await get(ref(db, `users/${user.uid}`))).val();
            if (userSnapshot.owns === undefined || !Array.isArray(userSnapshot.owns)) {
                userSnapshot.owns = [];
            }
            var userLinked = userSnapshot.owns.includes(deviceId);
            if (!userLinked) {
                userSnapshot.owns.push(deviceId);
            }
            await set(ref(db, `users/${user.uid}`), userSnapshot);

            if (deviceLiked && userLinked) {
                return alreadyOwned(res);
            }

            res.status(200).send({error : false, message: "device added", device: deviceSnapshot, accessToken: req.user.stsTokenManager.accessToken});
        }
        // otp does not match -> unauthorized
        else {
            unauthorized(res, req);
            Log.info("Device otp does not match");    
            return;
        }
    } else {
        unauthorized(res, req);
        Log.info("Unauthorized request to add device");
        return;
    }
});

router.get('/', async (req, res) => {
    var user;
    try{ 
    user = req.user;
    } catch(error) {
        res.status(400).send({error: "Bad Request", accessToken: req.user.stsTokenManager.accessToken});
        Log.error(error);
    return;
    }

    try {
        // using this 'user' variable for now.
        var snapshot = await get(ref(db, `users/${user.uid}`))
    
        if (snapshot.exists() && snapshot.val().owns !== undefined  && snapshot.val().owns.length > 0)
        {
            var devicesIds = snapshot.val().owns;
            var devices = [];
            for (var deviceId of devicesIds) {
                var dev = (await get(ref(db, `devices/${deviceId}`))).val();
                devices.push (
                    {
                        id : deviceId,
                        ...dev
                    }
                );
            }

            res.status(200).send({message: "Owned Device List.", devices, accessToken: req.user.stsTokenManager.accessToken})
        }
        else if (user.owns === undefined || snapshot.val().owns.length === 0)
        {
            res.status(200).send({message: "No devices to show.", accessToken: req.user.stsTokenManager.accessToken})
        }
        else 
        {
            res.status(401).send({message: "Unauthorized", accessToken: req.user.stsTokenManager.accessToken})
        }

    } catch(error) {
        console.error(error);
        res.status(500).send({message : "Internal Server Error"})
    }
})

export default {
    router: router
}
