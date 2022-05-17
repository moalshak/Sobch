import express from "express";
import config from "../../../lib/config.js";
import { db,auth } from "../../server.js";
import {createUserWithEmailAndPassword } from "firebase/auth";


const router = express.Router(),
    Log = config.getLog("register");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

router.post('/', async (req, res) => {
    const credentials = req.body.credentials,
    email = credentials.email,
    password = credentials.password,
    address = req.body.address;

    var code, message;
    
    try {
        const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
        // Signed in 
        const user = userCredential.user;
        req.user = user;
        
        code = 200;
        message = user;

        res.status(code).send(message);
    } catch(error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        code = 400;
        message = {errorCode, errorMessage};

        res.status(code).send(message);
    }
    
});

export default {
    router: router
}