import {useState} from 'react';
import './App.css';
import axios from 'axios';

function App() {
  const [deviceId, setDeviceId] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100);
  const [room, setRoom] = useState('');
  const [active, setActive] = useState(true);
  const [otp, setOtp] = useState('');

  // do a post request to http://localhost:8080/my-devices using axios
  async function dowhat(e : any) {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8000/my-devices', {
        deviceId,
        min,
        max,
        room,
        active,
        otp,
      });

    } catch(error) {
      console.log(error);
    }
  }

  return (
    <div className="App">
      {/* a form that has 6 inputs. device-id, min, max, room, active, otp */}
      {/* the form does a post request to "localhost:8080/my-devices" */}
      <form onSubmit={dowhat}>
        <input type="text" value={deviceId} onChange={(e) => setDeviceId(e.target.value) } placeholder="Device ID" />
        <input type="number" value={min} onChange={(e) => setMin(parseInt(e.target.value)) } placeholder="Min" />
        <input type="number" value={max} onChange={(e) => setMax(parseInt(e.target.value)) } placeholder="Max" />
        <input type="text" value={room} onChange={(e) => setRoom(e.target.value) } placeholder="Room" />
        <input type="text" value={active ? 'Yes' : 'No'} onChange={(e) => setActive(e.target.value === 'Yes' ? true : false) } placeholder="Active" />
        <input type="text" value={otp} onChange={(e) => setOtp(e.target.value) } placeholder="OTP" />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
