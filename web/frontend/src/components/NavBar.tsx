
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { isLoggedIn } from '../lib/acc';
import Nav from 'react-bootstrap/Nav';
import {goLogout} from '../lib/acc';
import {IoIosLogOut} from 'react-icons/io';
import {HiOutlineLogin} from 'react-icons/hi';
import {BiDevices} from 'react-icons/bi';
import {CgProfile} from 'react-icons/cg';
import {AiFillHome} from 'react-icons/ai';
import {IoInformationCircleOutline, IoHelpCircleOutline} from 'react-icons/io5';

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
                <Nav.Link href="/">Home <AiFillHome/></Nav.Link>
            </Nav>
            <Nav>
                {
                    isLoggedIn() ?

                    <>
                    <Nav.Link href="/my-devices">My Devices <BiDevices/></Nav.Link>
                    <Nav.Link href="/profile">Profile <CgProfile/></Nav.Link>
                    <Nav.Link href="/logout" onClick={goLogout}>Logout <IoIosLogOut/></Nav.Link></>
                    :
                    <>
                    <Nav.Link href="/register">Register</Nav.Link>
                    <Nav.Link href="/login">Login <HiOutlineLogin/></Nav.Link>
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

            
            <Nav className="me-auto">
                <p> © Sobch 2022, all rights reserved</p>
                
            </Nav>
            <Nav>
                <>
             <Nav.Link href="/corporate">Corporate Info<IoInformationCircleOutline/></Nav.Link>
             <Nav.Link href="/help">FAQs<IoHelpCircleOutline/></Nav.Link>
                </>
            </Nav>
        </Container>
        </Navbar>
        </div>
    )
        
}

export default NavBar;