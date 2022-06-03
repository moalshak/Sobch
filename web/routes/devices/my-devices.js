import {db} from "../../../lib/firebase.js";
import {getLog, isAdmin} from "../../../lib/config.js";
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


router.delete("/", async (req, res) => {
    var user, deviceId;

    try {
        user = req.user;
        deviceId = req.body.deviceId;
    } catch (error) {
        res.status(400).send({error : true, message: "Bad request"});
        return;
    }

    var message, code;

    try {
        // check if device is owned by user
        const device = await get(ref(db, `devices/${deviceId}`));
        if (!device) {
            unauthorized(res, req);
            return;
        }

        var owners = device.owners || [];

        if (!isAdmin(user.uid)) {
            if (owners.indexOf(user.uid) === -1) {
                unauthorized(res, req);
                return;
            }
        }

        // get the user
        const userData = await get(ref(db, `users/${user.uid}`));

        var owns = userData.owns || [];

        if (!isAdmin(user.uid)) {
            if (owns.indexOf(deviceId) === -1) {
                unauthorized(res, req);
                return;
            }
        }

        // remove device from user and user from device
        device.owners.filter((owner) => {
            return owner !== user.uid;
        });

        // remove device from user
        userData.owns.filter((deviceId) => {
            return deviceId !== deviceId;
        });

        await set(ref(db, `devices/${deviceId}`), device);
        await set(ref(db, `users/${user.uid}`), userData);

        code = 200;
        message = "Success, device unlinked!";
        res.status(code).send({error : false, message});
        Log.info("Success - Device unlinked", {deviceId, user: user.uid});
    } catch (error) {
        code = 400;
        message = "FAILED";
        res.status(code).send({error : true, message});
        Log.error(error);
    }
});

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
            if (!userSnapshot) {
                await set(ref(db, `users/${user.uid}`), {
                    credentials : user.email
                });
                Log.error("User does not exist, just added ", {user: user.uid});
                userSnapshot = (await get(ref(db, `users/${user.uid}`))).val();
            }
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

            // get all devices
            var devicesSnap = await get(ref(db, `devices`));
            if (devicesSnap.exists()) {
                var devicesSnapshot = devicesSnap.val();
                for (var i in devicesSnapshot) {
                    var dev = devicesSnapshot[i];
                    if (isAdmin(user.uid) || dev.owners.includes(user.uid)) {
                        if (!devicesIds.includes(dev.id)) {
                            devices.push (
                                {
                                    id : dev.id,
                                    ...devicesSnapshot[dev.id]
                                }
                            );
                        }
                    }
                }
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
