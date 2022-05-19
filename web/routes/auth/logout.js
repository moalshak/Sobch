import express from "express";
import config from "../../../lib/config.js";
import { db, auth} from "../../server.js";
import {  signInWithEmailAndPassword } from "firebase/auth";



const router = express.Router(),
    Log = config.getLog("login");

router.get('/', (req, res) => {
    res.status(200).send("Request received");
})

const auth = getAuth();
signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});