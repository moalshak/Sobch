console.log("Generating devices...");
import { v4 as uuidv4 } from 'uuid';
import { generate } from 'generate-password';
import {db} from "../lib/firebase.js";
import {ref, set, get} from "firebase/database";
import {genRandomTemperature} from '../simulation/main.js';

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

const ROOMS = ["Living Room", "Bedroom", "Kitchen", "Bathroom", "Office", "Garage"];

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
    device.config.wantsToBeNotified = true;
    device.owners = ADMINS;
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

console.log("Devices generated");
process.exit(0);
