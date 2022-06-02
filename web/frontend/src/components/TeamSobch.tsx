import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import NavBar from "../components/NavBar";

function Team(){


    return (
        <div>
            <NavBar />
            <div className="text-center">
            <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Mohammad</Card.Header>
            <Card.Body>
                <Card.Title>Technical Officer</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
       
        <br />

        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Fergal</Card.Header>
            <Card.Body>
                <Card.Title>Project Leader</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
        <br />

        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Carmen</Card.Header>
            <Card.Body>
                <Card.Title>Architecture Officer</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
        <br />

        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Selim</Card.Header>
            <Card.Body>
                <Card.Title>Documentation Officer</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
        <br />

        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Dhruv</Card.Header>
            <Card.Body>
                <Card.Title>Communication Officer</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
        <br />
        </div>
        </div>


            

        
        
        
    )

}

export default Team;