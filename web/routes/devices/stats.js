import express from "express";
import {getLog} from "../../../lib/config.js";
import { db, auth } from "../../server.js";
import { ref, get, child } from "firebase/database";
import myDevices from "./my-devices.js";


const router = express.Router(),
    Log = getLog("stats");



//Bad Request
router.get('/', (req, res) => {
  const datainf = req;
  const user = auth.user;
  //using this 'user' variable for now.
  get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
          res.status(400).send({device : req.body, accessToken: req.user.stsTokenManager.accessToken},"Bad Request");
          console.log("Bad Request")
    }).catch((error) => {
      console.error(error);
    });
      
})
 
router.get('/:id', (req, res) => {
  const datainf = req.params;
  //using this 'user' variable for now.
  const user = req.user;

  const dataId = datainf.id.trim();

  get(ref(db, `devices/${dataId}`)).then((snapshot) => {
    if (!snapshot.exists()) 
      {
          res.status(401).send({error : "Unauthorized", accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized")
      }
      else if (snapshot.exists() && !snapshot.val().owner.includes(user.uid))
      {
          res.status(401).send({accessToken: req.user.stsTokenManager.accessToken});
          Log.info("Unauthorized");
      }
      // The Device of associated ID exists.
      else if (snapshot.exists() && snapshot.val().owner.includes(user.uid)) {
        res.status(200).send({device : snapshot.val(), accessToken: req.user.stsTokenManager.accessToken});  
        Log.info(snapshot.val());
      }
      //Internal Server error
      else 
      {
          res.status(500).send({accessToken: req.user.stsTokenManager.accessToken},"Internal server error");
          Log.info("Internal server error")
      }
    }).catch((error) => {
      Log.info(error);
    });    
})

export default {
  router: router
}    



