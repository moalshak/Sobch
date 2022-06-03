import {Alert, AlertProps, Variant} from './CustomAlert';
import {useEffect, useState} from 'react';
import { isLoggedIn } from '../lib/acc';
import {useNavigate} from 'react-router-dom';
import NavBar, {NavBarBot} from "../components/NavBar";

function Logout () {

    const navigate = useNavigate();
    /**
     * Custom alert props which looks cleaner than the regular alert
     */
        const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });
    
     useEffect(()=> {
        if (isLoggedIn() == false) {
             setAlertProps({ 
                 heading: 'Logged out!',
                 message: "Success, you have logged out",
                 variant: Variant.info
             });
             setTimeout(()=> {
                navigate("/login");
              }, 2000);
        }
    }, []);


    return (
        <div>
            <NavBar/>
            <Alert {...alertProps} />
            <NavBarBot/>
        </div>
    );
}



export default Logout;