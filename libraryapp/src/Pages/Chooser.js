import '../styles/Button.css'
import React, { useRef, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from '../helpers/AuthContext';

const Chooser = () => {
  const buttonsRef = useRef([]);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    buttonsRef.current[0].focus();
    
    if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
      axios.get("http://localhost:5000/auth/allow", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id")
        },
      })
        .then((response) => {
          if (response.data.error) {
            authContext.logout()
            navigate('/')
          } else {
            authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
            navigate('/choose')
          }
        })
    }
    
    if (!authContext.isLoggedIn) {
      navigate('/')
    }
  }, [navigate, authContext]);

  const handleKeyDown = (event, index) => {
    if (event.key === 'ArrowUp' && index > 0) {
      buttonsRef.current[index - 1].focus();
    } else if (event.key === 'ArrowDown' && index < 2) {
      buttonsRef.current[index + 1].focus();
    } else if (event.key === 'Enter') {
      event.preventDefault(); //prevents calling function twice
      chooseDes(index);
    }
  };

  const chooseDes = (index) => {
    switch (index) {
      case 0:
        navigate('/entry');
        break;
      case 1:
        navigate('/exit');
        break;
      case 2:
        navigate('/reservation');
        break;
      default:
        console.log("Default");
        break;
    }
  };

  return (
    <div className='button-container'>
      <h1>Choose A Destination</h1>
      <button className='button' ref={(el) => (buttonsRef.current[0] = el)} onKeyDown={(event) => handleKeyDown(event, 0)} onClick={() => chooseDes(0)} >Entry</button>
      <button className='button' ref={(el) => (buttonsRef.current[1] = el)} onKeyDown={(event) => handleKeyDown(event, 1)} onClick={() => chooseDes(1)} >Exit</button>
      <button className='button' ref={(el) => (buttonsRef.current[2] = el)} onKeyDown={(event) => handleKeyDown(event, 2)} onClick={() => chooseDes(2)} >Reservation</button>
    </div>
  );
}

export default Chooser