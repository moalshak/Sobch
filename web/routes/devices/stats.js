import express from "express";
import config from "../../../lib/config.js";
import { db } from "../../server.js";
import { ref, get, child } from "firebase/database";


const router = express.Router(),
    Log = config.getLog("stats");

router.get('/:id', (req, res) => {
    const datainf = req.params;
    //using this 'user' variable for now.
    var user = false;
    console.log(datainf)
    get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
        // The Device of associated ID exists
        if (snapshot.exists()) {
          res.status(200).send(snapshot.val());  
          Log.info(snapshot.val());
        } 
        // The Device of associated ID exists but is not liked to  User(s)
        else if (!snapshot.exists() && user == false)
        {
            res.status(405).send(snapshot.val());
            Log.info(snapshot.val());
            console.log("Device not linked to User")
        }
        else  
        // The device is non-existent
        {
          res.status(404)  
          console.log("Device Not Found");
        }
      }).catch((error) => {
        console.error(error);
      });
})



export default {
    router: router
}