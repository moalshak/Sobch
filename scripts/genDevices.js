console.log("Generating devices...");
import fs from 'fs';
import {db} from "../lib/firebase.js";
import {ref, set, get} from "firebase/database";
import {genRandomTemperature} from '../simulation/main.js';
import {getLog} from "../lib/config.js";

const Log = getLog("genDevices");


/**
 * IDs of the admins
 */
const ADMINS = [
    "VfULdqBkeYXXtjP0xK6lVvYQTIW2", // mohammad
    "1CUMvWFlucbIddCwslwEsY5qlQb2", // carmen
    "yDU8z6Mizch1g4PMQHvWseYD8yF3", // dhruv
    "a2szgwUYHnUMInbc6cdiwXHeUN73", // selim
    "9GJaxXLYP5SaQDurokIpX2Yu79v1", // fergal
], emails = {
    "VfULdqBkeYXXtjP0xK6lVvYQTIW2" : {
        email : "mo.alshakoush@gmail.com"
    }, // mohammad
    "1CUMvWFlucbIddCwslwEsY5qlQb2" : {
        email : "m.c.jica@student.rug.nl"
    }, // carmen
    "yDU8z6Mizch1g4PMQHvWseYD8yF3" : {
        email : "dgroxmusic@gmail.com"
    }, // dhruv
    "a2szgwUYHnUMInbc6cdiwXHeUN73" : {
        email : "s.el.sayed.aly@student.rug.nl"
    }, // selim
    "9GJaxXLYP5SaQDurokIpX2Yu79v1" : {
        email : "f.j.mccollam@student.rug.nl"
    }, // fergal
}

var ID = 0;

try {
    const data = fs.readFileSync(`${process.cwd()}/scripts/lastId.id`, 'utf8');
    ID = parseInt(data);
} catch (err) {
    Log.error(err);
    console.log(err);
    process.exit(1);
}


/**
 * @returns {string} A unique ID
 */
function generateID() {
    ID++;
    return ID.toString();
}

/**
 * @returns {string} One time password
 */
 function generateOTP() {
    var length = 16;
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * 
 charactersLength));
   }
   result = result.match(/.{1,4}/g).join("-");
   return result;
}

/**
 * Array of possible rooms for devices
 */
const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Garage"];

/**
 * Array of possible models for devices
 */
const MODELS = ["Sobch DHT-11", "Sobch DHT-22", "Sobch DHT-33", "Sobch DHT-44", "Sobch DHT-55"];

/**
 * 
 * generates a device
 * 
 * @returns {Object} A device
 */
function generateDevice() {
    var device = {};
    device.id = generateID();
    device.currentTemp = genRandomTemperature(15, 25, 2);
    device.config = {};
    device.config.min = genRandomTemperature(10, 15, 2);
    device.config.max = genRandomTemperature(25, 30, 2);
    device.config.room = ROOMS[Math.floor(Math.random() * ROOMS.length)];
    device.config.active = true;
    device.config.wantsToBeNotified = ADMINS;
    device.owners = ADMINS;
    device.model = MODELS[Math.floor(Math.random() * MODELS.length)];
    device.otp = generateOTP();
    return device;
}

var devices = [];

for (var i = 0; i < 10; i++) {
    var device = generateDevice();
    devices.push(device.id);
    var devToAdd = {};
    for (var key in device) {
        devToAdd[key] = device[key];
    }
    set(ref(db, `devices/${device.id}`), devToAdd);
}


for (var admin of ADMINS) {
    var snapshot = await get(ref(db, `users/${admin}`))
    if (!snapshot.exists()) {
        await set(ref(db, `users/${admin}`), {credentials : { email : emails[admin].email}, owns : []});
        snapshot = await get(ref(db, `users/${admin}`))
    }
    const user = snapshot.val();
    if (user.owns === undefined || !Array.isArray(user.owns)) {
        user.owns = [];
    }
    var owns = user.owns || [];
    for (var device of devices) {
        owns.push(device);
    }
    user.owns = owns;
    // user.owns = []; // uncomment this to remove all devices from the admins
    set(ref(db, `users/${admin}`), user);
}

const idString = (ID++).toString();
fs.writeFile(`${process.cwd()}/scripts/lastId.id`, idString, err => {
    if (err) {
        Log.error(err);
        process.exit(1);
    }
    console.log("Devices generated ended up at :" + idString);
    process.exit(0);
});

