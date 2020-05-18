import React from 'react';
import logo from './dUNO2.png';
import './App.css';

var sectionStyle = {
  width: "100%",
  height: "100%",
  backgroundImage: { logo }
};

function App() {
  return (
    <div className="App">
      <p>DUNO</p>
      <input className="Login-input" placeholder="Name" />
      <button>Get started</button>
    </div>
  );
}

export default App;
