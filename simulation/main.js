import {db} from '../lib/firebase.js';
import {ref, set, get} from 'firebase/database';
import {getLog} from '../lib/config.js';
import { notifyUserViaEmail } from '../lib/notifyUser.js';

const Log = getLog("simulation");

var defaultAggressiveness =  {
    min : -0.2,
    max : 0.2,
    decimals : 2,
    changeChance : 0.1,
    delay : 60 * 1000,
}, aggressiveness;

/**
 * Generates a random temperature between a min and max temp
 * with the given precision
 * 
 * @param {Float} min 
 * @param {Float} max 
 * @param {Number} decimals 
 * @returns 
 */
function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

/**
 * Generates the change in temperature based on the aggressiveness
 * @param {Number} currentTemp the current temperature of a device
 * @returns {Number} new Temperature
 */
function generateChange(currentTemp) {
    if (Math.random() < aggressiveness.changeChance) {
        return currentTemp + getRandomFloat(aggressiveness.min, aggressiveness.max, aggressiveness.decimals);
    }
    return currentTemp;
}

/**
 * ensure that the database is connected
 */
var ensureDBconnection = () => {
    if (!db) {
        // throw error saying that the database is not connected
        throw new Error("Database is not connected");
    }
}


/**
 * simulates the environment
 *  - if device is active randomly change the current temperature
 *  - if device is not active do not change current temp
 * @param {Array} devices the devices to simulate
 */
var simulateEnvironment = async (devices) => {
    ensureDBconnection();
    // loop over all devices in the database
    for (var id in devices) {
        var device = devices[id];
        // if the device
        if (device.config.active) {
            // change the current temperature
            if (device.currentTemp === undefined) {
                device.currentTemp = getRandomFloat(15, 20, 2);
            }
            device.currentTemp = Math.round(generateChange(device.currentTemp) * aggressiveness.decimals * 50) / (aggressiveness.decimals * 50);
            // device has gone beyond the limits set by the owner
            // if (device.currentTemp >= device.config.max || device.currentTemp <= device.config.min) {
            //     // notify the owners
            //     var owners_ids = device.owners || [];
            //     var owners = [];
            //     for(var id of owners_ids) {
            //         var owner = (await get(ref(db, `users/${id}`))).val();
            //         owners.push(owner);
            //     }
            //     for (var owner of owners) {
            //         if (owner && owner.credentials && owner.credentials.email) {
            //             // notifyUserViaEmail(owner.credentials.email, device);
            //             // Log.info("Notified user " + owner.credentials.email + " about the device " + device.id);
            //         }
            //     }
            // }
            // update the database
            set(ref(db, `devices/${id}`), device);
        }
    }
}

/**
 * 
 * @param {*} ms 
 * @returns 
 */
const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * start the simulation loop
 */
var startSimulation = async (agg) => {
    aggressiveness = agg || defaultAggressiveness;
    /**
     * the database reference and the actual devices
     */
    var devicesRef = ref(db, 'devices/'),
        devices;
    while (true) {
        // wait for 10 seconds
        devices = (await get(devicesRef)).val();
        for (var dev in devices) {
            devices[dev].id = dev;
        }
        simulateEnvironment(devices);
        await delay(aggressiveness.delay);
    }
}

// if command line argument is provided, start simulation with the parameter being the aggressiveness
if (process.argv[2] === 'start') {
    var agg = {
        min : parseFloat(process.argv[3]) || defaultAggressiveness.min,
        max : parseFloat(process.argv[4]) || defaultAggressiveness.max,
        decimals : parseInt(process.argv[5]) || defaultAggressiveness.decimals,
        changeChance : parseFloat(process.argv[6]) || defaultAggressiveness.changeChance,
        delay : parseInt(process.argv[7]) || 1000
    }
    Log.info("Starting simulation", {aggressiveness : agg});
    startSimulation(agg);
}


export {
    startSimulation,
    getRandomFloat as genRandomTemperature,
    notifyUserViaEmail as notifyUser,
}