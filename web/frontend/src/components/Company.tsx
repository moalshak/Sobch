
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar, {NavBarBot} from "../components/NavBar";


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
            <h6 className="mb-3 text-primary"><i className="far fa-paper-plane text-primary pe-2"></i>Headquaters Address</h6>
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
                <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"></i>Contact us</h6>
                <span>
                        Contact us by phone or email <br/>
                    <strong>Phone:</strong> +31 6 12345678<br/>
                    <strong>Email:</strong> help@sobch.xyz
                </span>
            </div>
        </div>
            

      </body>
      <NavBarBot />
      </div>
    

    )
      
}

export default Corparate;