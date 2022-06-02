import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "../components/NavBar";

function Home() {


    return (
    
        <div>
            <NavBar />
            <div className="text-center">
                <h1>Whale Cum!</h1>
                <div className="card"style={{width:"18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">Meet the team!</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Sobch members</h6>
                    <p className="card-text">Click see more to learn about the members of Sobch</p>
                    <a href="/team" className="card-link">See More</a>
                </div>
                </div>

                <div className="card"style={{width:"18rem"}}>
                <div className="card-body">
                    <h5 className="card-title">Help</h5>
                    <h6 className="card-subtitle mb-2 text-muted">FAQs and more</h6>
                    <p className="card-text">Click see more to learn how to register a device and other FAQs </p>
                    <a href="/help" className="card-link">See More</a>
                </div>
                </div>
            </div>
        </div>
    );
}


export default Home;