import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar, {NavBarBot} from "../utils/NavBar";

function Corparate() {
    return(
        <div>
            <NavBar />
        <body>
            
            <div className="container">
                <div className="page-header">
                <div className="text-center mb-4 fw-bold">
                <h1>Company Information</h1>
            </div>
            </div>
        <div className="col">
            <div className="col-md-6 col-lg-4 mb-4">
            <h6 className="mb-3 text-primary"><i className="far fa-paper-plane text-primary pe-2"/>Headquaters Address</h6>
            <span>
                    Zernikelaan 25,<br/>
                    Groningen, <br/>
                    The Netherlands, <br/>
                    1234 AB
            </span>
            </div>
            </div>
            </div>
        <div className="container">
            <div className="col-md-6 col-lg-4 mb-4">
                <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"/>Contact us</h6>
                <span>
                        Contact us by phone or email <br/>
                    <strong>Phone:</strong> +33643193801<br/>
                    <strong>Email:</strong> help@sobch.xyz
                </span>
            </div>
        </div>
        
        <div className="container">
            <div className="col-md-6 col-lg-4 mb-4">
                <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"/>Sobch Team</h6>
                <span>
                       Meet the <a href="/team" className="card-link">team!</a>
                </span>
            </div>
        </div>

        <div className="container">
            <div className="col-md-6 col-lg-4 mb-4">
                <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"/>Products</h6>
                <p>
                       <strong>Sobch DHT-11</strong> <img src="./images/therm1.jpg" className="img-thumbnail" alt="therm1"/> <br/>
                       <strong>Sobch DHT-22</strong> <img src="./images/them2.jpg" className="img-thumbnail" alt="therm2"/> <br/>
                       <strong>Sobch DHT-33</strong> <img src="./images/therm3.jpg" className="img-thumbnail" alt="therm3"/> <br/>
                       <strong>Sobch DHT-44</strong> <img src="./images/therm4.jpg" className="img-thumbnail" alt="therm4"/> <br/>
                       <strong>Sobch DHT-55</strong> <img src="./images/therm5.jpeg" className="img-thumbnail" alt="therm5"/> <br/>
                </p>
            </div>
        </div>

      </body>
      <NavBarBot />
      </div>
    )
}

export default Corparate;