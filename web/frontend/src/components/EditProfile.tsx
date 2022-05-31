import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { Link, useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";

interface Profile {
    profile :{
        id: string,
        credentials: {
            email: string,
            password: string,
        },
        address: string
    }
}

function EditProfile(){

    const [profile, setProfile] = useState<Profile>({
        profile : {
            id: "",
            credentials: {
                email: "",
                password: "",
            },
            address: ""
    }
    });

    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const {id} = useParams();

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            setLoading(true);
            const response = await axios.put(`${BACKEND_BASE_URL}/profile`, id, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            if (response.status === 200) {
                alert("Your profile information has been successfully updated");
            }
            setLoading(false);
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
                return;
            }
            else if (err.response.status === 500) {
                alert("Invalid password, must be at least 6 characters!");
                navigate(`/edit-profile/${id}`);
                return;
            }
        }
    }

    var getProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_BASE_URL}/profile/${id}`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                }
            });
            setProfile(response.data)
            setLoading(false)
        } catch (err : any) {
            if (err.response.status === 401) {
                alert("You are not logged in! You will be redirected to the login page");
                navigate("/login");
                return;
            }
        }
    }

    useEffect(() => {
        getProfile();
    }, []);

    return(
        <div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Profile ID:
                    <input type="text" value={profile.profile.id} onChange={(e) => setProfile({...profile, profile: {...profile.profile, id: e.target.value}})}/>
                </label>
                <label>
                    Email:
                    <input type="text" value={profile.profile.credentials.email} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, email: e.target.value}}})}/>
                </label>
                <label>
                    Password:
                    <input type="password" value={profile.profile.credentials.password} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, password: e.target.value}}})}/>
                </label>
                <label>
                    Address:
                    <input type="text" value={profile.profile.address} onChange={(e) => setProfile({...profile, profile: {...profile.profile, id: e.target.value}})}/>
                </label>
                <input type="submit" value="Submit"/>
            </form>
        </div>
    )

}