import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import NavBar from "../components/NavBar";

function Home() {


    return (
    
        <div>
            <NavBar />
            <div className="container">
            
            <div className="text-center">
                    <div className="row">
                    <div className="col-6 col-sm-4">

                    <Card border="dark" style={{ width: '18rem' }}>
                        <Card.Header>Meet the team</Card.Header>
                            <Card.Body>
                                <Card.Title>Memebers of Bosch</Card.Title>
                                <a href="/team" className="card-link">See More</a>
                            </Card.Body>
                    </Card>
                    </div>
                    
    <br />
    </div>

            <div className="col-6 col-sm-4">
            <div className="col d-flex justify-content-center">
                <Card border="dark" style={{ width: '18rem' }}>
                    <Card.Header>FAQ</Card.Header>
                        <Card.Body>
                            <Card.Title>Need help?</Card.Title>
                            <a href="/help" className="card-link">See More</a>
                        </Card.Body>
                </Card>

                <br />
                </div>
            </div>
        </div>
        </div>
        </div>

        
    );
}


export default Home;