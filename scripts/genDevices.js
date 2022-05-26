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
    "4zmlwFZ2KmXW8eB2HPh7STmM5jJ3", // carmen
    "GN0MqIz07rWxrr2LTwDZmJl70Vj1", // dhruv
    "VfULdqBkeYXXtjP0xK6lVvYQTIW2", // mohammad
    "GWXGfoZ3Vjfj1xNEhoz7xdkC01I3", // selim
    "zZeyGzB6vnSlYgiOCIkwtVnOFb42", // fergal
    "jHJkymK0fSesTXk5VVP8OrwfytB3", // root
]

/**
 * @returns {string} A unique ID
 */
function generateID() {
    return uuidv4();
}

/**
 * @returns {string} One time password
 */
function generateOTP() {
    return generate({ length: 20, numbers: true });
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
        if (key !== 'id') {
            devToAdd[key] = device[key];
        }
    }
    set(ref(db, `devices/${device.id}`), devToAdd);
}


for (var admin of ADMINS) {
    const snapshot = await get(ref(db, `users/${admin}`))
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
