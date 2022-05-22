import { v4 as uuidv4 } from 'uuid';
import { generate } from 'generate-password';
import {db} from "../web/server.js";
import {ref, set, get} from "firebase/database";

/**
 * IDs of the admins
 */
const ADMINS = [
    "4zmlwFZ2KmXW8eB2HPh7STmM5jJ3", // carmen
    "GN0MqIz07rWxrr2LTwDZmJl70Vj1", // dhruv
    "bLjx3vrCyHSK9zwYdAUTL2iWaIg1", // mohammad
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

/**
 * 
 * generates a device
 * 
 * @returns {Object} A device
 */
function generateDevice() {
    var device = {};
    device.id = generateID();
    device.config = {};
    device.config.min = 0;
    device.config.max = 0;
    device.config.room = "";
    device.config.active = false;
    device.owners = ADMINS;
    device.otp = generateOTP();
    return device;
}

var devices = [];

for (var i = 0; i < 10; i++) {
    var device = generateDevice();
    devices.push(device);
    set(ref(db, `devices/${device.id}`), device);
}


for (var device of devices) {
    for (var admin of ADMINS) {
        const snapshot = await get(ref(db, `users/${admin}`))
        const user = snapshot.val();
        if (user.owns === undefined) {
            user.owns = [];
        }
        user.owns.push(device.id);
        // user.owns = []; // uncomment this to remove all devices from the admins
        set(ref(db, `users/${admin}`), user);
    }
}