import {db} from '../web/server.js';
import {ref, set, get, onValue} from 'firebase/database';
import config from '../lib/config.js';

const Log = config.getLog("simulation");

var defaultAggressiveness =  {
    min : -0.1,
    max : 0.2,
    decimals : 2,
    changeChance : 0.1,
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
 * the database reference and the actual devices
 */
var devicesRef = ref(db, 'devices/'),
    devices = (await get(devicesRef)).val();


/**
 * simulates the environment
 *  - if device is active randomly change the current temperature
 *  - if device is not active do not change current temp
 * @param {Array} devices the devices to simulate
 */
var simulateEnvironment = (devices) => {
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
            device.currentTemp = Math.round(generateChange(device.currentTemp) * 100) / 100;
            // update the database
            set(ref(db, `devices/${id}`), device);
        }
    }
}

const delay = ms => new Promise(res => setTimeout(res, ms));

/**
 * start the simulation loop
 */
var startSimulation = async (agg) => {
    aggressiveness = agg || defaultAggressiveness;
    
    while (true) {
        // wait for 10 seconds
        devices = (await get(devicesRef)).val();
        simulateEnvironment(devices);
        await delay(5000);
    }
}

// if command line argument is provided, start simulation with the parameter being the aggressiveness
if (process.argv[2] === 'start') {
    var agg = {
        min : parseFloat(process.argv[3]) || defaultAggressiveness.min,
        max : parseFloat(process.argv[4]) || defaultAggressiveness.max,
        decimals : parseInt(process.argv[5]) || defaultAggressiveness.decimals,
        changeChance : parseFloat(process.argv[6]) || defaultAggressiveness.changeChance
    }
    Log.info("Starting simulation", {aggressiveness : agg});
    startSimulation(agg);
}

export default {
    startSimulation: startSimulation,
    genRandomTemperature : getRandomFloat,
}