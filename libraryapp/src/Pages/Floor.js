import '../App.css'
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
//import axios from 'axios';
import AuthContext from '../helpers/AuthContext'

const Floor = () => {
  const [activeButton, setActiveButton] = useState(0);
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  
  useEffect(() => {
  
    if(!authContext.isLoggedIn){navigate('/')}

    function handleKeyDown(event) {
      if (event.key === "ArrowUp") {
        setActiveButton(activeButton => Math.max(activeButton - 1, 0));
      } else if (event.key === "ArrowDown") {
        setActiveButton(activeButton => Math.min(activeButton + 1, 2));
      } else if (event.key === 'Enter') {
        buttonRef.current.click();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate, authContext]);

  const aaa = ()=>{
    return console.log("Enter is Pressed")
  }

  return (
    <div className="button-list">
      <button
        className={`button ${activeButton === 0 ? "active" : ""}`}
        onClick={aaa} ref={buttonRef}
      >
        Button 1
      </button>
      {/* <button
        className={`button ${activeButton === 1 ? "active" : ""}`}
        onClick={() => console.log("Button 2 clicked")}
      >
        Button 2
      </button>
      <button
        className={`button ${activeButton === 2 ? "active" : ""}`}
        onClick={() => console.log("Button 3 clicked")}
      >
        Button 3
      </button> */}
    </div>
  );
}

export default Floor