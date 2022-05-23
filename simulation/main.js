import {db} from '../web/server.js';
import {ref, set, get, onValue} from 'firebase/database';

if (!db) {
    // throw error saying that the database is not connected
    throw new Error("Database is not connected");
}

// get all devices from the databse
var devicesRef = await get(ref(db, 'devices/'));

var devices = devicesRef.val();

onValue(devicesRef, (snapshot) => {
    devices = snapshot.val();
    console.log("devices updated");
})


// loop over all devices in the database
for (var id in devices) {
    var device = devices[id];
    // if the device
    if (device.active) {
        console.log(id);
    }
    // if the device is not active
    else {
        console.log(`${id} is not active`);
    }
}
