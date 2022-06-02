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
                                    <Card.Title>Technical Officer</Card.Title>
                                    <Card.Text>
                                    Some quick description and photo....
                                    </Card.Text>
                                </Card.Body>
                        </Card>
                        
        <br />
        </div>

        <div className="col-6 col-sm-4">
        <Card border="dark" style={{ width: '18rem' }}>
            <Card.Header>Fergal</Card.Header>
            <Card.Body>
            <img className="card-img-top" src="https://source.unsplash.com/daily" alt="Card Image Top"></img>
                <Card.Title>Project Leader</Card.Title>
                <Card.Text>
                Some quick description and photo....
                </Card.Text>
          </Card.Body>
        </Card>
        <br />
        </div>

        <div className="col-6 col-sm-4">
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
        </div>

        <div className="col d-flex justify-content-center">
        <div className="col-6 col-sm-4">
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
        </div>

        <div className="col-6 col-sm-4">
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
        </div>
        </div>
        </div>
        </div>
    



            

        
        
        
    )

}

export default Team;