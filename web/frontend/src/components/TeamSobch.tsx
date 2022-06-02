import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import NavBar from "../components/NavBar";

function Team(){


    return (
        <div>
            <NavBar />
            <div className="container">
                <div className="text-center">
                    <div className="row">
                        <div className="col-6 col-sm-4">
                        <Card border="dark" style={{ width: '18rem' }}>
                            <Card.Header>Mohammad</Card.Header>
                                <Card.Body>
                                <Card.Text>
                                    <img src="./images/me.jpg" className="img-thumbnail"></img>
                                    <Card.Footer>Technical Officer</Card.Footer>
                                    </Card.Text>
                                </Card.Body>
                        </Card>
                        
        <br />
        </div>

    <div className="col-6 col-sm-4">
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Fergal</Card.Header>
            <Card.Body>
                <Card.Text>
                <img src="./images/me.jpg" className="img-thumbnail"></img>
                <Card.Footer>Project Leader</Card.Footer>
                </Card.Text>
          </Card.Body>
        </Card>
        <br />
    </div>

        <div className="col-6 col-sm-4">
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Carmen</Card.Header>
            <Card.Body>
            <Card.Text>
                <img src="./images/me.jpg" className="img-thumbnail"></img>
                <Card.Footer>Architecture Officer</Card.Footer>
                </Card.Text>
          </Card.Body>
        </Card>
        <br />
        </div>

        <div className="col d-flex justify-content-center">
        <div className="col-6 col-sm-4">
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Selim</Card.Header>
            <Card.Body>
                <Card.Text>
                <img src="./images/me.jpg" className="img-thumbnail"></img>
                <Card.Footer>Documentation Officer</Card.Footer>
                </Card.Text>
            </Card.Body>
        </Card>
        <br />
        </div>

        <div className="col-6 col-sm-4">
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Dhruv</Card.Header>
            <Card.Body>
                <Card.Text>
                <img src="./images/dhruv.jpg" className="img-thumbnail"></img>
                <Card.Footer>Communication Officer</Card.Footer>
                </Card.Text>
          </Card.Body>
        </Card>
        <br />
        </div>
        </div>
        </div>
        </div>
        </div>
        </div>
    



            

        
        
        
    )

}

export default Team;