import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/esm/Card';
import NavBar, {NavBarBot} from "../components/NavBar";


function Home() {
    return (
        <div>
        <NavBar />
        <Container>
            <Card border="dark" style={{ width: '18rem' }}>
                <Card.Header>Meet the team</Card.Header>
                <Card.Body>
                    <Card.Title>Members of SOBCH</Card.Title>
                    <a href="/team" className="card-link">See More</a>
                </Card.Body>
            </Card>
                
            <Card border="dark" style={{ width: '18rem' }}>
                <Card.Header>FAQ</Card.Header>
                <Card.Body>
                    <Card.Title>Need help?</Card.Title>
                    <a href="/help" className="card-link">See More</a>
                </Card.Body>
            </Card>
        </Container>
        <NavBarBot />
        </div>
    );
}


export default Home;