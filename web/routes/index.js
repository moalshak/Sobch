import express from "express";
import {getLog} from "../../lib/config.js";

const router = express.Router(),
    Log = getLog("index");

/**
 * this is just an entry point for the backend
 * */
router.get('/', (req, res) => {
    res.status(200).send("Request received");
    Log.info(`Request received`)
})


export default {
    router: router
}