
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
        </div>
    );
}


export default Home;