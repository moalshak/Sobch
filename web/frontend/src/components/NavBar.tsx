
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Nav from 'react-bootstrap/Nav';

function NavBar(props : any) {
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
                {/* TODO : if already logged in do not show this */}
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>

                <Nav.Link href="/my-devices">My Devices</Nav.Link>
                <Nav.Link href="/profile">Profile</Nav.Link>

                <Nav.Link href="/logout">Logout</Nav.Link>
            </Nav>
            </Navbar.Collapse>
        </Container>
        </Navbar>
    );
}

export default NavBar;