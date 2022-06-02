import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import Card from 'react-bootstrap/esm/Card';
import NavBar from "../components/NavBar";

function How(){
    return (
        <div>
        <NavBar />
        <div className="container">
        <section>
  <h3 className="text-center mb-4 pb-2 text-primary fw-bold">FAQ</h3>
  <p className="text-center mb-5">
    Find the answers for the most frequently asked questions below
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

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-user text-primary pe-2"></i> How do I add a device?
      </h6>
      <p>
        Once you are logged in you can go to the <a href="/add-device" className="card-link">Add Device</a> page and
        click on the <strong>Add Device</strong> button.
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="bi bi-envelope"></i> I registered but still cant log in.
      </h6>
      <p>
        Make sure you have verified you account by checking your email and clicking on the verification link.
        If you have already done this, please contact us at <p className="font-italic">help@sobch.xyz</p>
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-home text-primary pe-2"></i> Where can I find my One-Time Password?
      </h6>
      <p> Inside the box of your purchashed thermometer, you will find the One-Time Password that is in the form of a 16 digit serial number.
        reason.</p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-book-open text-primary pe-2"></i> Another
        question that is longer than usual</h6>
      <p>
        Of course! We’re happy to offer a free plan to anyone who wants to try our service.
      </p>
    </div>
  </div>
</section>
        </div>
        </div>

   

    )
}
export default How;