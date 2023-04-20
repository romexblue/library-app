import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import axios from 'axios';
import image1 from '../images/Back_Icon.png';
import image2 from '../images/Rfid_Icon.png';
import image3 from '../images/XuLib.png';

const Exit = () => {
    const [response, setResponse] = useState("");
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const inputRef = useRef(null);
    const [date, setDate] = useState(new Date());
    useEffect(() => {
        //for page refresh
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
                        navigate('/exit')
                    }
                })
        }

        if (!authContext.isLoggedIn) {
            navigate('/')
        };

        const interval = setInterval(() => {
            checkFocus();
            setDate(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, [navigate, authContext])

    function checkFocus() {
        if (document.activeElement === document.body) {
            inputRef.current.focus();
        }   
    }

    function handleChange(event) {
        setResponse('')
        setValue(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        const studentID = value;
        const today = new Date();
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        const data = {time_out:formattedTime}
        try {
            if (studentID.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(studentID.trim()); //handle special chars to prevent error
                axios.patch(`http://localhost:5000/record/find/${encodedValue}`, data, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id")
                    },
                })
                    .then((response) => {
                        if (response.data.error) {
                           setResponse(response.data.error);
                            setValue('');
                        } else {
                           setResponse(response.data.success);
                            setValue('');
                        }
                    })
            } else {
                setValue('')
            }
        } catch (error) {
            console.error(error);
        }
    }
    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric"
        });
      };
    
      const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: true
        });
      };
    return (
   
        <div className="Sections">
        <div className="sec1">
            <div className="Back" onClick={()=>navigate('/choose')}>
                <button className="back-icon" >
                  <img className="BackIcon" id="BackBtn" src={image1} alt="img"/>
                  <p>BACK</p>
                </button>
            </div>
        </div>
        <div className="sec2">
            <div className="RFID-Icon">
                <img src={image2} alt="img"/>
            </div>
            <div className="TapMessage">
                <h1>TAP YOUR ID TO EXIT</h1>
            </div>
        </div>
        <div className="sec3">
            <form onSubmit={handleSubmit}>
            <div className="IdInput">
                <label htmlFor="fname">Library User</label>
                <input type="text"  ref={inputRef} id="fname"  placeholder="Tap Your ID" value={value} onChange={handleChange}
                style={{ borderColor: response === "Not Timed In" || response === "No existing record"? "red" : "",
                         backgroundColor: response === "Not Timed In" || response === "No existing record" ? "rgb(255, 251, 251)" : "" }}/>
            </div>
            </form>
        </div>
        <div className="sec4">
            <div className="LibrarySeal">
                <img src={image3} alt="img"/>
            </div>
            <div className="feedback" ><p style={{color: response === "Time Out Successful" ? "#385DBB" : ""}}>{response}</p></div>
            <div className="systemtime">
                <div className="display-date">
                    <span id="month">{formatDate(date)}</span>
                </div>
            <div className="display-time">{formatTime(date)}</div>
            </div>
        </div>
    </div>
    );
}

export default Exit