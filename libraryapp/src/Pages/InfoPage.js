import '../styles/InfoPage.css'
import { useState, useEffect, useRef} from "react";
import axios from "axios";
import image1 from '../images/Back_Icon.png';
import image2 from '../images/Rfid_Icon.png';
import image3 from '../images/XuLib.png';
import { useNavigate } from "react-router-dom";

const InfoPage = ({studentID, setStudentID, studentRFID, setStudentRFID, setStudentData}) => {
    const [value, setValue] = useState(''); //value of input
    const [searchResult, setSearchResult] = useState(''); //value of result
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();
    const inputRef = useRef(null);
    useEffect(()=>{
        inputRef.current.focus();
        if(!studentRFID && !studentID){
            setValue('');
            setSearchResult('')
            setStudentData([]);
        }
        const timer = setInterval(() => {
        setDate(new Date())
        if (!inputRef.current.contains(document.activeElement)) {
            inputRef.current.focus();
          } 
    },1000);
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
      const handleSubmit = (event) => {
        event.preventDefault();
        const newValue = value;
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
                            setSearchResult('User not found');
                            setStudentData([]);
                            setStudentID('');
                            setStudentRFID('');
                            setValue('');
                        } else {
                            setSearchResult('User Found');
                            setStudentData(response.data);
                            setStudentID(response.data.school_id);
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
    const handleChange = (event) => {
        setSearchResult('');
        const newValue = event.target.value;
        setValue(newValue);
        
    }

    return (

        <div className="Sections">
        <div className="sec1">
            <div className="Back" onClick={()=>navigate('/')}>
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
                <h1>TAP YOUR ID TO ENTER</h1>
            </div>
        </div>
        <div className="sec3">
            <form onSubmit={handleSubmit}>
            <div className="IdInput">
                <label htmlFor="fname">Library User</label>
                <input type="text"  ref={inputRef} id="fname"  placeholder="Tap Your ID" value={value} onChange={handleChange}
                style={{ borderColor: searchResult === "User not found" ? "red" : "",
                         backgroundColor: searchResult === "User not found" ? "rgb(255, 251, 251)" : "" }}/>
            </div>
            </form>
        </div>
        <div className="sec4">
            <div className="LibrarySeal">
                <img src={image3} alt="img"/>
            </div>
            <div className="feedback" ><p>{searchResult}</p></div>
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