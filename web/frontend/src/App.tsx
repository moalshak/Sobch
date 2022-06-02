import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import MyDevices from './components/MyDevices';
import Stats from './components/Stats';
import Alter from './components/Alter';
import AddDevice from './components/AddDevice';
import Logout from './components/Logout';
import TeamSobch from './components/TeamSobch';
import Help from './components/Help';

const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://0.0.0.0:8000";

function App() {
  
  return (
    
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/profile/" element={<Profile />} />
        <Route path="/edit-profile/" element={<EditProfile />} />
        <Route path="/my-devices" element={<MyDevices />} />
        <Route path="/add-device" element={<AddDevice />} />
        <Route path="/stats/:deviceId" element={<Stats />} />
        <Route path="/alter/:deviceId" element={<Alter />} />
        <Route path="/team" element={<TeamSobch />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Router>
  );
}

export {
  App,
  BACKEND_BASE_URL
};
