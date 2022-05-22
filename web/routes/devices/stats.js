import express from "express";
import config from "../../../lib/config.js";
import { db, auth } from "../../server.js";
import { ref, get} from "firebase/database";


const router = express.Router(),
    Log = config.getLog("stats");

router.get('/:id', (req, res) => {
  const datainf = req.params;
  const user = auth.user;
  //using this 'user' variable for now.
  get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
          res.status(400).send("Bad Request");
          console.log("Bad Request")
    }).catch((error) => {
      console.error(error);
    });
      
})

//Bad Request
router.get('/', (req, res) => {
    const datainf = req;
    const user = auth.user;
    //using this 'user' variable for now.
    get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
            res.status(400).send("Bad Request");
            console.log("Bad Request")
      }).catch((error) => {
        console.error(error);
      });
        
})
   
router.get('/:id', (req, res) => {
    const datainf = req.params;
    //using this 'user' variable for now.
    var user = true;
    get(ref(db, `devices/${datainf.id}`)).then((snapshot) => {
      var re = /^[A-Za-z]+$/;
      let regex = new RegExp(re)
      x = regex.test(datainf)
      console.log(x)
      if (x == false) 
      {
        res.status(400).send("Bad Request");
            console.log("Bad Request")
      }
      else  
      if (!snapshot.exists()) 
        {
            res.status(401).send("Unauthorized");
            console.log("Unauthorized")
        }
        else if (snapshot.exists() && user == false)
        {
            res.status(401).send("Unauthorized");
            Log.info("Unauthorized");
        }
        // The Device of associated ID exists.
        else if (snapshot.exists() && user == true) {
          res.status(200).send(snapshot.val(),"Success");  
          Log.info(snapshot.val());
        }
        //Internal Server error
        else 
        {
            res.status(500).send("Internal server error");
            Log.info("Internal server error")
        }
      }).catch((error) => {
        console.error(error);
      });
        
})

export default {
    router: router
}
