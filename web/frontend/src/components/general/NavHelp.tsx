import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from "../utils/NavBar";

function NavHelp() {

return(
    <div>
    <NavBar />
        <div className="container">
            <section>
                <div className="row">
                    <div className="col-md-6 col-lg-4 mb-4">
                        <h6 className="mb-3 text-primary"><i className="far fa-paper-plane text-primary pe-2"/>FAQ</h6>
                        <p>
                            Find all the FAQs <a href="/help" className="card-link">here!</a>
                        </p>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                        <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"/>About us</h6>
                        <p>
                           Meet the team behind Sobch <a href="/team" className="card-link">here</a>
                        </p>
                    </div>
                    <div className="col-md-6 col-lg-4 mb-4">
                        <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"/>Corporate Info</h6>
                        <p>
                           Find our corporate info <a href="/corporate" className="card-link">here</a> which includes contact addres, HQ address ect.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    </div>
        
)
}

export default NavHelp;