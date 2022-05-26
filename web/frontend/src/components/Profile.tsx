import axios from "axios";
import {useParams} from "react-router-dom";
import {BACKEND_BASE_URL} from '../App';

function Profile() {
    const {id} = useParams();

    return (
        <div>
            <h1>Profile {id}</h1>
        </div>
    );
}


export default Profile;