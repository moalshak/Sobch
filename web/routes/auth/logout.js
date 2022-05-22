import { auth, signOut } from "firebase/auth";
import {userCredential} from "../auth/register"

router.post('/', (req, res) => {
    const user = userCredential.user ;
    var message, code;

   auth.signOut(user).then(() => {
        code = 200;
        message = "Success"
        res.status(code).send({message});
  }).catch((error) => {
    // An error happened.
  });
});
        
        
    
