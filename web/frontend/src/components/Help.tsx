import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar, {NavBarBot} from "../components/NavBar";
import { IoMdTrash,IoIosPersonAdd,IoMdAddCircleOutline,IoMdSad, IoMdFingerPrint,IoIosBody} from "react-icons/io";

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
      <h6 className="mb-3 text-primary"><i className="far fa-paper-plane text-primary pe-2"></i> Can you delete a user?<IoMdTrash/></h6>
      <p>
        Absolutely! Go to the <a href="/profile" className="card-link">Profile</a> page
        and click on the <strong>Delete Account</strong> button.
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-pen-alt text-primary pe-2"></i> How do I register?<IoIosPersonAdd/></h6>
      <p>
        At the top of your screen if youre on PC or in the navigation menu on mobile, click on the <a href="/register" className="card-link">Register</a> button and it
        will bring you to the registration page. Where you fill in the required fields.
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-user text-primary pe-2"></i> How do I add a device?<IoMdAddCircleOutline/></h6>
      <p>
        Once you are <a href="/login" className="card-link">logged in</a> you can go to the <a href="/add-device" className="card-link">Add Device</a> page and
        click on the <strong>Add Device</strong> button.
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="bi bi-envelope"></i> I registered but still cant log in.<IoMdSad/></h6>
      <p>
        Make sure you have verified you account by checking your email and clicking on the verification link.
        If you have already done this, please contact us at <p className="font-italic">help@sobch.xyz</p>
      </p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-home text-primary pe-2"></i> Where can I find my One-Time Password?<IoMdFingerPrint/></h6>
      <p> Inside the box of your purchashed thermometer, you will find the One-Time Password that is in the form of a 16 digit serial number.
          reason.</p>
    </div>

    <div className="col-md-6 col-lg-4 mb-4">
      <h6 className="mb-3 text-primary"><i className="fas fa-book-open text-primary pe-2"></i> Can I have more than one person registered to a <IoIosBody/> device?</h6>
      <p>
        Of course! You can register as many people as you want to a single device. Just register the device with the one-time Password
        of the person you want to register.
      </p>
    </div>
  </div>
</section>
        </div>
        <NavBarBot />
        </div>

   

    )
}
export default How;