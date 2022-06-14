import {db} from "../../../lib/firebase.js";
import {getLog, isAdmin} from "../../../lib/config.js";
import express from "express";
import {get, ref, set} from "firebase/database";

const router = express.Router(),
    Log = getLog("my-devices");


function alreadyOwned(res) {
    res.status(200).send({error : false, message: "Already Owned"});
    Log.info("Already Owned device request");
}

function unauthorized(res, req) {
    res.status(403).send({error : true, message: "Invalid match (device id / otp)", accessToken: req.user.stsTokenManager.accessToken});
}


router.post("/", async (req, res) => {
    let device, otp, user;
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
        let deviceSnapshot = snapshot.val();
        // otp matches -> add device
        if (otp === deviceSnapshot.otp) {
            Log.info("OTP MATCHES!")
            // make sure device owners is an array
            if (deviceSnapshot.owners === undefined || !Array.isArray(deviceSnapshot.owners)) {
                deviceSnapshot.owners = [];
            }
            // device already owned
            let deviceLiked = deviceSnapshot.owners.includes(user.uid);
            if (!deviceLiked) {
                deviceSnapshot.owners.push(user.uid);
            }
            if (device.config) {
                deviceSnapshot.config.min = device.config.min;
                deviceSnapshot.config.max = device.config.max;
                deviceSnapshot.config.active = device.config.active;
                deviceSnapshot.config.room = device.config.room;
                if (device.config.wantsToBeNotified) {
                    if (deviceSnapshot.config.wantsToBeNotified === undefined) {
                        deviceSnapshot.config.wantsToBeNotified = [user.uid];
                    }
                    if (!deviceSnapshot.config.wantsToBeNotified.includes(user.uid)) {
                        deviceSnapshot.config.wantsToBeNotified.push(user.uid);
                    }
                } else {
                    // remove user from wantsToBeNotified
                    if (Array.isArray(deviceSnapshot.config.wantsToBeNotified)) {
                        if (deviceSnapshot.config.wantsToBeNotified.includes(user.uid)) {
                            deviceSnapshot.config.wantsToBeNotified.splice(deviceSnapshot.config.wantsToBeNotified.indexOf(user.uid), 1);
                        }
                    } else {
                        deviceSnapshot.config.wantsToBeNotified = [];
                    }
                }
            }
            await set(ref(db, `devices/${deviceId}`), deviceSnapshot);
            let userSnapshot = (await get(ref(db, `users/${user.uid}`))).val();
            if (!userSnapshot) {
                await set(ref(db, `users/${user.uid}`), {
                    credentials : {
                        email : user.email
                    }
                });
                Log.error("User does not exist, just added ", {user: user.uid});
                userSnapshot = (await get(ref(db, `users/${user.uid}`))).val();
            }
            if (userSnapshot.owns === undefined || !Array.isArray(userSnapshot.owns)) {
                userSnapshot.owns = [];
            }
            let userLinked = userSnapshot.owns.includes(deviceId);
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
        }
    } else {
        unauthorized(res, req);
        Log.info("Unauthorized request to add device");
    }
});

router.get('/', async (req, res) => {
    let user = req.user;

    try {
        let snapshot = await get(ref(db, `users/${user.uid}`))
    
        if (snapshot.exists() && snapshot.val().owns !== undefined  && snapshot.val().owns.length > 0)
        {
            let devicesIds = snapshot.val().owns;
            let devices = [];
            for (let deviceId of devicesIds) {
                let dev = (await get(ref(db, `devices/${deviceId}`)));
                if (dev.exists()) {
                    dev = dev.val()
                    devices.push (
                        {
                            id : deviceId,
                            ...dev
                        }
                    );
                }
            }
            res.status(200).send({message: "Owned Device List.", devices, accessToken: req.user.stsTokenManager.accessToken})
        } else if (user.owns === undefined || snapshot.val().owns.length === 0)  {
            res.status(200).send({message: "No devices to show.", accessToken: req.user.stsTokenManager.accessToken})
        }
    } catch(error) {
        console.error(error);
        res.status(500).send({message : "Internal Server Error"})
    }
})

export default {
    router: router
}
