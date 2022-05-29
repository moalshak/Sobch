import nodemailer from 'nodemailer';
import {EMAIL, PASSWORD} from "./config.js";
import {getLog} from "./config.js";

const Log = getLog("notifyUser");

/**
* Here we're using Gmail to send 
*/
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: EMAIL,
        pass: PASSWORD
    }
});

function notifyUserViaEmail (dest, device) {
    const mailOptions = {
        from: EMAIL,
        to: dest,
        subject: 'Thermometer Notification', // email subject
        html:
        `
        <h>Your thermometer has gone beyond the limits!</h>
        <p>
            Your device with id ${device.id} at the room "${device.config.room}" has exceeded the limits.
            Its current temperature is ${device.currentTemp}
            You have set the max to be ${device.config.max} and the min to be ${device.config.min}
        </p>
        <p>You were notified because you own this device</p>
        `
    };

    // returning result
    return transporter.sendMail(mailOptions, (err, info) => {
        if(err){
            Log.error("Failed to send email", {error: err});
        }
        Log.info("Email sent", {info});
    });
}

export {
    notifyUserViaEmail as notifyUserViaEmail
}