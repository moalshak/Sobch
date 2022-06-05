import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar, {NavBarBot} from "../components/NavBar";
import Card from 'react-bootstrap/esm/Card';

function NavHelp() {

return(
    <div>
    <NavBar />
    <div className="container">
    <section>
        <p className="text-center mb-5">
        Everything you need!
        </p>

        <div className="row">
        <div className="col-md-6 col-lg-4 mb-4">
        <h6 className="mb-3 text-primary"><i className="far fa-paper-plane text-primary pe-2"></i> Can you delete a user?</h6>
        <p>
            Absolutely! Go to the <a href="/profile" className="card-link">Profile</a> page
            and click on the <strong>Delete Account</strong> button.
        </p>
        </div>

        <div className="col-md-6 col-lg-4 mb-4">
        <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"></i> How do I register?</h6>
        <p>
            At the top of your screen if youre on PC or in the navigation menu on mobile, click on the <a href="/register" className="card-link">Register</a> button and it
            will bring you to the registration page. Where you fill in the required fields.
        </p>
        </div>
    </div>
    </section>
    </div>
    </div>
        
)
}

export default NavHelp;