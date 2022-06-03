
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { isLoggedIn } from '../lib/acc';
import Nav from 'react-bootstrap/Nav';
import {goLogout} from '../lib/acc';
import {Link} from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Corparate from './Company';

function NavBar() {
    return(
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href="/"> <img
          alt=""
          src="/Sobchlogo.png"
          width="200"
          height="110"
          className="d-inline-block align-top"/></Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <Nav.Link href="/">Home</Nav.Link>
            </Nav>
            <Nav>
                {
                    isLoggedIn() ?

                    <>
                    <Nav.Link href="/my-devices">My Devices</Nav.Link>
                    <Nav.Link href="/profile">Profile</Nav.Link>
                    <Nav.Link href="/logout" onClick={goLogout}>Logout</Nav.Link></>
                    :
                    <>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/login">Login</Nav.Link>
                    </>
                }

               
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export function NavBarBot() {
    return (
        <div className="fixed-bottom">
        <Navbar bg="light" expand="lg">
        <Container>
            <Navbar.Brand href=""> <img
          alt=""
          
          width="200"
          height="50"
          className="d-inline-block align-bottom"/></Navbar.Brand>

            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
                <p> © Sobch 2022, all rights reserved</p>
                <Nav.Link href="/corporate">Corporate Info</Nav.Link>
            </Nav>
            <Nav>
               
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
        </div>
    )
        
}

export default NavBar;