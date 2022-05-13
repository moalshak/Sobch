import express from "express";
import Config from "../../lib/config.js";
import { database } from "../server.js";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

const router = express.Router(),
    Log = Config.getLog("sign-up");

router.post('/', async function(req, res) {
    res.json(userRes)
});


export default {
    router: router
}