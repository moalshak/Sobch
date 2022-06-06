import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import NavBar, {NavBarBot} from "../components/NavBar";
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Team(){


    return (

        <div>
            <NavBar />
            
            <Container>

            <Row>
                <Col>
            <Card style={{width : '18em'}}>
            <Card.Header>Mohammad Al Shakoush</Card.Header>
                <Card.Body>
                <Card.Text>
                    <img src="https://avatars.githubusercontent.com/u/65516452?v=4" className="img-thumbnail"></img>
                    <Card.Footer>Technical Officer</Card.Footer>
                </Card.Text>
                </Card.Body>
            </Card>
            </Col>

            <Col>
            <Card style={{width : '18em'}}>
                <Card.Header>Fergal McCollam</Card.Header>
                    <Card.Body>
                    <Card.Text>
                        <img src="./images/profile.jpg" className="img-thumbnail"></img>
                        <Card.Footer>Project Leader</Card.Footer>
                    </Card.Text>
                    </Card.Body>
            </Card>
            </Col>

            <Col>
            <Card style={{width : '18em'}}>
                <Card.Header>Carmen Jica</Card.Header>
                    <Card.Body>
                    <Card.Text>
                        <img src="./images/carmenimg.jpg" className="img-thumbnail"></img>
                        <Card.Footer>Architecture Officer</Card.Footer>
                    </Card.Text>
                    </Card.Body>
            </Card>
            </Col>
        </Row>

        <Row>
        <Col>
        <Card style={{width : '18em'}}>
        <Card.Header>Selim EL Sayed Aly</Card.Header>
            <Card.Body>
            <Card.Text>
                <img src="./images/selimimg.jpg" className="img-thumbnail"></img>
                <Card.Footer>Documentation Officer</Card.Footer>
            </Card.Text>
            </Card.Body>
        </Card>
        </Col>
        <Col>
        <Card style={{width : '18em'}}>
            <Card.Header>Dhruv Ghosh</Card.Header>
            <Card.Body>
            <Card.Text>
                <img src="./images/dhruv3.jpg" className="img-thumbnail"></img>
                <Card.Footer>Communication Officer</Card.Footer>
            </Card.Text>
            </Card.Body>
        </Card>
        </Col>
        </Row>
        <NavBarBot />

        </Container>

        </div> 
    )

}

export default Team;