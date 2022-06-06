import 'bootstrap/dist/css/bootstrap.min.css';

import NavBar, {NavBarBot} from "../components/NavBar";

function Team(){


    return (

        <div>
            <NavBar />
            <div className="row">
            <div className="container">
                <div className="text-center">
                    
                        <div className="col-6 col-sm-4">
                        
                            <h6>Mohammad Al Shakoush</h6>
                               
                                    <img src="https://avatars.githubusercontent.com/u/65516452?v=4" className="img-thumbnail"></img>
                        <div className="footer">
                         Technical Officer   
                        </div>
                                
        <br />
        </div>

        <div className="col d-flex justify-content-center">
        <div className="col-6 col-sm-4">
                <h6> Fergal McCollam </h6>
                    
                        <img src="./images/profile.jpg" className="img-thumbnail"></img>
                        <div className="footer">
                            Project Leader
                        </div>

                    
        <br />
        </div>

        <div className="col-6 col-sm-4">
            <h6 className="text-center">Carmen Jica</h6>
                   
                        <img src="./images/carmenimg.jpg" className="img-thumbnail"></img>
                        <div className="footer">
                            Architecture Officer
                        </div>
              
        <br />
        </div>

        <div className="col d-flex justify-content-center">
            <div className="col-6 col-sm-4">
                <h6 className="text-center">Selim EL Sayed Aly</h6>
                    <img src="./images/selimimg.jpg" className="img-thumbnail"></img>
                    <div className="footer">
                            Documentation Officer
                        </div>
                        
        <br />
        </div>

        <div className="col-6 col-sm-4">
                <h6>Dhruv Ghosh</h6>
                
                    <img src="./images/dhruv3.jpg" className="img-thumbnail"></img>
                    <div className="footer">
                           Communication Officer
                        </div>
                
        <br />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </div> 
        
        <NavBarBot />
        </div>
    )

}

export default Team;