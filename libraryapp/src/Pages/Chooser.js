import React, { useRef, useEffect, useContext } from 'react';
import '../styles/Button.css';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import image1 from '../images/Logout_Icon.png';
import image2 from '../images/Entry_Icon.png';
import image3 from '../images/Exit_Icon.png';
import image4 from '../images/Sched_Icon.png';

const Chooser = () => {
  const buttonsRef = useRef([]);
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    buttonsRef.current[0].focus();
  }, []);

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
        break;
    }
  };
  
  return (

<div className="main_div">  
          <div className="Logout">
            <div className="registrationWizard">
            <button className="regButton" onClick={() => navigate('/registration')}><p>Registration Wizard</p></button>
            </div>
            <button className="back-icon" style={{cursor: "pointer"}} onClick={()=>authContext.logout()}>
              <img className="BackIcon" id="BackBtn" alt="img" src={image1}/>
              <p></p>
            </button>
          </div>
          <div className="title" >
            <div className="text">
                <h1>OPERATION MODE</h1>
                <h3>Please select a mode</h3>
            </div>
          </div>
        <div className="container">
          <button className="box" style={{cursor: "pointer"}} ref={(el) => (buttonsRef.current[0] = el)} onKeyDown={(event) => handleKeyDown(event, 0)} onClick={() => chooseDes(0)}>
            <div className="box-icon">
              <img className="Btn" id="EntryBtn" alt="img" src={image2}/>
            </div>
            <div className="box-text">
              <h3>Entry</h3>
            </div> 
          </button>
          <button className="box" style={{cursor: "pointer"}}  ref={(el) => (buttonsRef.current[1] = el)} onKeyDown={(event) => handleKeyDown(event, 1)} onClick={() => chooseDes(1)}>
            <div className="box-icon">
              <img className="Btn" id="EntryBtn" alt="img" src={image3}/>
            </div>
            <div className="box-text">
              <h3>Exit</h3>
            </div>
          </button>
          <button className="box" style={{cursor: "pointer"}}  ref={(el) => (buttonsRef.current[2] = el)} onKeyDown={(event) => handleKeyDown(event, 2)} onClick={() => chooseDes(2)}>
            <div className="box-icon">
              <img className="Btn" id="EntryBtn" alt="img" src={image4}/>
            </div>
            <div className="box-text">
              <h3>Reservation</h3>
            </div>
          </button>
        </div>
    </div>

  );
}

export default Chooser