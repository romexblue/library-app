import '../styles/InfoPage.css'
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import image1 from '../images/Back_Icon.png';
import image2 from '../images/Rfid_Icon.png';
import image3 from '../images/XuLib.png';
import AuthContext from '../helpers/AuthContext';
import { useNavigate } from "react-router-dom";

const InfoPage = ({studentID, setStudentID, studentRFID, setStudentRFID, setStudentData}) => {
    const [value, setValue] = useState(''); //value of input
    const [searchResult, setSearchResult] = useState(''); //value of result
    const [userData, setUserData] = useState([]);
    const [date, setDate] = useState(new Date());
    const authContext = useContext(AuthContext);
    const navigate = useNavigate();
    useEffect(()=>{
        if(!studentRFID && !studentID){
            setValue('');
            setSearchResult('')
            setStudentData([]);
        }
        const timer = setInterval(() => setDate(new Date()), 1000);
    return () => clearInterval(timer);
    },[studentID, studentRFID, setStudentData]);
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
    const handleChange = (event) => {
        const newValue = event.target.value;
        setValue(newValue);
        try {
            if (newValue.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(newValue.trim()); //handle special chars to prevent error
                axios.get(`http://localhost:5000/student/find/${encodedValue}`, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id")
                    },
                })
                    .then((response) => {
                        if (response.data.error) {
                            setSearchResult('User Not Found');
                            setStudentData([]);
                            setStudentID('');
                            setStudentRFID('');
                        } else {
                            setSearchResult('User Found');
                            setStudentData(response.data);
                            setStudentID(response.data.id);
                            setStudentRFID(response.data.rfid);
                        }
                    })
            } else {
                setSearchResult('');
                setStudentID('');
                setStudentRFID('');
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <div className="Sections">
        <div className="sec1">
            <div className="Back" onClick={()=>navigate('/')}>
                <button className="back-icon" >
                  <img className="BackIcon" id="BackBtn" src={image1} alt=""/>
                  <p>BACK</p>
                </button>
            </div>
            <div className="LogoutBtn" onClick={()=>authContext.logout()}>
                <button className="btn logout">Logout</button>
            </div>
        </div>
        <div className="sec2">
            <div className="RFID-Icon">
                <img src={image2} alt=""/>
            </div>
            <div className="TapMessage">
                <h1>TAP YOUR ID NOW</h1>
            </div>
        </div>
        <div className="sec3">
            <div className="IdInput">
                <label htmlFor="fname">ID NUMBER:</label>
                <input type="text" id="fname" name="firstname" placeholder="Your name.." value={value} onChange={handleChange}/>
            </div>
        </div>
        <div className="sec4">
            <div className="LibrarySeal">
                <img src={image3} alt=""/>
            </div>
            <div className="systemtime">
                <div className="display-date">
                    <span id="month">{formatDate(date)}</span>
                </div>
            <div className="display-time">{formatTime(date)}</div>
            </div>
        </div>
    </div>
    )
}

export default InfoPage