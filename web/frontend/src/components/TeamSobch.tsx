import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/esm/Card';
import NavBar, {NavBarBot} from "../components/NavBar";

function Team(){


    return (

        <div>
            <NavBar />
            <div className="container">
                <div className="text-center">
                    <div className="row">
                        <div className="col-6 col-sm-4">
                        <Card border="dark" style={{ width: '18rem' }}>
                            <Card.Header>Mohammad Al Shakoush</Card.Header>
                                <Card.Body>
                                <Card.Text>
                                    <img src="https://avatars.githubusercontent.com/u/65516452?v=4" className="img-thumbnail"></img>
                                    <Card.Footer>Technical Officer</Card.Footer>
                                </Card.Text>
                                </Card.Body>
                        </Card>
                        
        <br />
        </div>
        </div>
        </div>
        </div>

       

        <NavBarBot />
        </div> 
    )

}

export default Team;