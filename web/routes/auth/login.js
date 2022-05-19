import express from "express";
import config from "../../../lib/config.js";
import { db, auth} from "../../server.js";
import {  signInWithEmailAndPassword } from "firebase/auth";


const router = express.Router(),
    Log = config.getLog("login");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

router.post('/', async (req, res) => {

    const credentials = req.body,
    email = credentials.email,
    password = credentials.password;

    var code,message;

    try {
       
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        const user = userCredential.user;
        req.user = user;

        code = 200;
        message = user;

        res.status(code).send(message);
        console.log(req.body);
        
    }catch(error) {
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