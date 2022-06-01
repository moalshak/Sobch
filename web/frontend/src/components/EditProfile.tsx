import axios from "axios";
import { useEffect, useState } from "react";
import {BACKEND_BASE_URL} from "../App";
import {getAccessToken} from "../lib/acc";
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import NavBar from "./NavBar";



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

    const [newPassword, setNewPassword] = useState("");
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

        if (profile.profile.credentials.password){
            if (profile.profile.credentials.password !== "" || newPassword !== "")
            {
                if (profile.profile.credentials.password !== newPassword) {
                    alert('Passwords do not match');
                    return;
                }
            }
        }
        

        try {
            setLoading(true);
            const response = await axios.put(`${BACKEND_BASE_URL}/profile/`, {
                headers: {
                    Authorization: `${getAccessToken()}`
                },
                credentials : {
                    email : profile.profile.credentials.email.trim(),
                    password : newPassword.trim()
                },
                address : profile.profile.address.trim()
            });
            if (response.status === 200) {
                alert("Your profile information has been successfully updated");
                navigate(`/profile/`);
                setLoading(false);
                return;
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
                navigate(`/edit-profile/`);
                return;
            }
        }
    }

    var getProfile = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BACKEND_BASE_URL}/profile/`, {
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

    if (loading) {
        return (
            <div className="d-flex justify-content-center">
                <div  role="status">
                    <img alt= "loading..." src="../loading.gif" style={{width:"55px", height:"55px"}}/>
                </div>
            </div>
        );
    }
    return(
        <div>
        <NavBar/>

        <Container>
            <h1>Edit Profile</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" placeholder="email@exmaple.com" value={profile.profile.credentials.email} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, email: e.target.value}}})}/>
                    <Form.Text className="text-muted">
                        An empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                <Row>
                    <Col>
                <Form.Group>
                    <Form.Label>New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={profile.profile.credentials.password} onChange={(e) => setProfile({...profile, profile: {...profile.profile, credentials: {...profile.profile.credentials, password: e.target.value}}})}/>
                    <Form.Text className="text-muted">
                        For security purposes has to be at least 6 characters, an empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                </Col>
                <Col>
                <Form.Group>
                    <Form.Label>Confirm New Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <Form.Text className="text-muted">
                        Has to be identical to the previously entered password
                    </Form.Text>
                </Form.Group>
                </Col>
                </Row>
                <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control type="text" placeholder="Address" value={profile.profile.address} onChange={(e) => setProfile({...profile, profile: {...profile.profile, address: e.target.value}})}/>
                    <Form.Text className="text-muted">
                        An empty field will preserve the current information.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">
                    Save changes
                </Button>
            </Form>
        </Container>

        </div>
    )

}

export default EditProfile;