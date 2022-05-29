
import {Link} from "react-router-dom"
function Home() {
    return (
        <div>
            <img  src="Sobchlogo.png"
            width = "200"
            height = "100"/>
            <h1>Home</h1>
            <Link to={'/Login'}>
            <button>Login</button>
            </Link>
            <Link to={'/Logout'}>
            <button>Logout</button>
            </Link>
            <Link to={`/my-devices`}><button>All Devices</button></Link>
        </div>
    );
}


export default Home;