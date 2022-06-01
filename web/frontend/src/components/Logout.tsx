import {Alert, AlertProps, Variant} from './CustomAlert';
import {useState} from 'react';

function Logout () {
    /**
     * Custom alert props which looks cleaner than the regular alert
     */
        const [alertProps, setAlertProps] = useState<AlertProps>({
        heading: '',
        message: '',
        variant: Variant.nothing
    });



}


export default Logout;