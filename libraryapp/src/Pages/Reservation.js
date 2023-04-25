import '../styles/Reservation.css';
import "react-datepicker/dist/react-datepicker.css";
import React, { useState, useEffect, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import DatePicker from "react-datepicker";
import axios from "axios";
import ReservationUsers from "./ReservationUsers";
import ConfModal from './ConfModal';
import image1 from '../images/Home.png';


const TIMES = {
  "8:00am": ["9:00am", "10:00am"],
  "8:30am": ["9:30am", "10:30am"],
  "9:00am": ["10:00am", "11:00am"],
  "9:30am": ["10:30am", "11:30am"],
  "10:00am": ["11:00am", "12:00pm"],
  "10:30am": ["11:30am", "12:30pm"],
  "11:00am": ["12:00pm", "1:00pm"],
  "11:30am": ["12:30pm", "1:30pm"],
  "12:00pm": ["1:00pm", "2:00pm"],
  "12:30pm": ["1:30pm", "2:30pm"],
  "1:00pm": ["2:00pm", "3:00pm"],
  "1:30pm": ["2:30pm", "3:30pm"],
  "2:00pm": ["3:00pm", "4:00pm"],
  "2:30pm": ["3:30pm", "4:30pm"],
  "3:00pm": ["4:00pm", "5:00pm"],
  "3:30pm": ["4:30pm", "5:30pm"],
  "4:00pm": ["5:00pm", "6:00pm"],
  "4:30pm": ["5:30pm", "6:30pm"],
  "5:00pm": ["6:00pm", "7:00pm"],
  "5:30pm": ["6:30pm"],
  "6:00pm": ["7:00pm"]
};

function TimeSelect({ label, options, value, onChange }) {
  return (
    <div>
      <label>{label}</label>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

function Reservation() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [startTime, setStartTime] = useState(Object.keys(TIMES)[0]);
  const [endTime, setEndTime] = useState(TIMES[startTime][1]); //set two hours on load
  const [selectedDate, setSelectedDate] = useState(new Date()); //set it to today date
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confabs, setConfabs] = useState([]);
  const [selectedConfab, setSelectedConfab] = useState("");
  const [reason, setReason] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("")
  const [studentList, setStudentList] = useState();
  const [showForm, setShowForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleConfirm = () => {
    const date = selectedDate.toISOString().slice(0, 10);
    const start = convertTo24Hour(startTime);
    const end = convertTo24Hour(endTime);
    const purpose = reason;
    const phone = phoneNumber;
    const confId = selectedConfab.id;
    const guestList = [...studentList];

    const data = { date: date, start_time: start, end_time: end, confirmation_status: "Pending", reason: purpose, ConfabId: confId, phone: phone, guestList: guestList }
    axios
      .post(`http://localhost:5000/reservation`, data, {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id"),
        },
      })
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.log(error.response.data)
        console.log(data)
      });
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;
    const phoneNumberRegex = /^0/;
    if (phoneNumberRegex.test(inputValue) && inputValue.length < 12) {
      setPhoneNumber(inputValue);
    }
  };

  const setList = useCallback((list) => {
    setStudentList(list);
  }, []);

  const getAvailableTime = useCallback(() => {
    const conId = selectedConfab.id;
    const date = selectedDate.toISOString().slice(0, 10);
    if (conId && date) {
      axios
        .get(`http://localhost:5000/reservation/${conId}/${date}`, {
          headers: {
            accessToken: sessionStorage.getItem("accessToken"),
            userId: sessionStorage.getItem("id"),
          },
        })
        .then((response) => {
          setAvailableSlots(response.data.availableSlots);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [selectedConfab, selectedDate]);

  const getConfabs = useCallback(() => {
    axios
      .get("http://localhost:5000/confab", {
        headers: {
          accessToken: sessionStorage.getItem("accessToken"),
          userId: sessionStorage.getItem("id"),
        },
      })
      .then((response) => {
        setConfabs(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const setDate = (date) => {
    setSelectedDate(date);
  };

  const handleConfabChange = (event) => {
    console.log("HELLO")
    const selectedConfabId = parseInt(event.target.value);
    if (selectedConfabId) {
      const selectedConfab = confabs.find((c) => c.id === selectedConfabId);
      setSelectedConfab(selectedConfab);
    } else {
      setSelectedConfab("");
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
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
            navigate('/reservation')
          }
        })
    }

    if (!authContext.isLoggedIn) {
      navigate('/')
    };
    getConfabs();
  }, [getConfabs, authContext, navigate]);

  useEffect(() => {
    getAvailableTime();
  }, [getAvailableTime]);

  //converts to HH:mm:ss format
  function convertTo24Hour(params) {
    let [hour, minute, period] = params.match(/\d+|am|pm/g);
    hour = parseInt(hour);
    if (period === "pm" && hour !== 12) {
      hour += 12;
    } else if (period === "am" && hour === 12) {
      hour = 0;
    }
    if (params === startTime) {   //add 01 in minutes so adding new reservation will not conflict
      return `${hour.toString().padStart(2, "0")}:${minute}:01`;
    } else {
      return `${hour.toString().padStart(2, "0")}:${minute}:00`;
    }
  }

  function convertTo12Hour(time) {
    const [hours, minutes] = time.split(':');
    const isAM = hours < 12 || hours === '00' || hours === '24';
    const hours12 = hours % 12 || 12;
    const formattedTime = `${hours12}:${minutes}${isAM ? 'am' : 'pm'}`;
    return formattedTime;
  }

  function handleStartTimeChange(event) {
    const newStartTime = event.target.value;
    setStartTime(newStartTime);
    setEndTime(TIMES[newStartTime][0]);
  }

  function handleEndTimeChange(event) {
    setEndTime(event.target.value);
  }

  const endTimeOptions = TIMES[startTime];

  const submitRec = () => {
    const phone = phoneNumber;
    const guestList = [...studentList];
    const regex = /^09\d{9}$/;

    if (guestList.length === 0 || !regex.test(phone)) {
      setErrorMessage("Please Enter A Valid Phone Number and Fill Up User List")
    } else {
      setErrorMessage("")
      setShowConfirmation(true);
    }
  };

  const nextPage = () => {
    if (reason !== "" && selectedConfab) {
      setErrorMessage("");
      setShowForm(!showForm);
    } else {
      setErrorMessage("Please Select Confab and Fill Purpose Field");
    }
  };

  return (
    <div className="maindiv">
    <div className="centerdiv">
        <div className="left-panel">
            <div className="floor-label">
                <div className="panel-title">
                    <p className="pan-title">Confab Rooms</p>
                </div>
                <div className="f-label" id="fl-1">
                    <p className="floor-title">5th Floor</p>
                </div>
                <div className="f-label" id="fl-2">
                    <p className="floor-title">4th Floor</p>
                </div>
                <div className="f-label" id="fl-3">
                    <p className="floor-title">3rd Floor</p>
                </div>
            </div>
            <div className="conf-buttons">
                <div className="square-button">
                    <div className="conf-number">
                        <p>5</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
                <div className="square-button">
                    <div className="conf-number">
                        <p>6</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
                <div className="square-button">
                    <div className="conf-number">
                        <p>3</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
                <div className="square-button">
                    <div className="conf-number">
                        <p>4</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
                <div className="square-button">
                    <div className="conf-number">
                        <p>1</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
                <div className="square-button">
                    <div className="conf-number">
                        <p>2</p>
                    </div>
                    <div className="conf-name">
                        <p className="floor-title">CONFAB</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="divider">

        </div>
        <div className="right-panel">
            <div className="section" id="sec1">
                <div className="comp" id="comp1">
                    <p>Usage</p>
                </div>
                <div className="comp" id="comp2">
                    <img src={image1} alt=""/>
                </div>
            </div>
            <div className="section" id="sec2">
            </div>
            <div className="section" id="sec3">
                <div className="table-header">
                    <div className="header" id="header1">No.</div>
                    <div className="header" id="header2">From</div>
                    <div className="header" id="header3">Until</div>
                    <div className="header" id="header4">Notes</div>
                </div>
            </div>
            <div className="section" id="sec4">
                <div className="table">
                    <div className="table-content">
                        <div className="column" id="column1">1</div>
                        <div className="column" id="column2">8:00 am</div>
                        <div className="column" id="column3">10:00 am</div>
                        <div className="column" id="column4">10 pax</div>
                    </div>
                    <div className="table-content">
                        <div className="column" id="column1">1</div>
                        <div className="column" id="column2">8:00 am</div>
                        <div className="column" id="column3">10:00 am</div>
                        <div className="column" id="column4">10 pax</div>
                    </div>
                </div>
            </div>
            <div className="section" id="sec5">
                <div className="comp" id="drop3">
                    <div className="label">
                        Start Time
                    </div>
                    <div className="drop-down">                          
                        <input className="dropdown2" list="browsers" name="browser" placeholder="8:00 am"/>
                        <datalist id="browsers">
                          <option value="8:00 am"/>
                          <option value="9:00 am"/>
                          <option value="10:00 am"/>
                          <option value="11:00 am"/>
                          <option value="12:00 pm"/>
                          <option value="1:00 pm"/>
                          <option value="2:00 pm"/>
                          <option value="3:00 pm"/>
                          <option value="4:00 pm"/>
                          <option value="5:00 pm"/>
                          <option value="6:00 pm"/>
                        </datalist>                          
                      </div>
                </div>
                <div className="comp" id="drop4">
                    <div className="label">
                        End Time
                    </div>
                    <div className="drop-down">
                          <input className="dropdown2" list="browsers" name="browser" placeholder="8:00 am"/>
                          <datalist id="browsers">
                            <option value="8:00 am"/>
                            <option value="9:00 am"/>
                            <option value="10:00 am"/>
                            <option value="11:00 am"/>
                            <option value="12:00 pm"/>
                            <option value="1:00 pm"/>
                          </datalist>                          
                    </div>
                </div>
            </div>
            
            <div className="section" id="sec6">
                <div className="btn-holder" id="holder1">
                    <button className="cancelbtn" >Cancel</button>
                    <button className="submitbtn">Next</button>
                </div>
            </div>
        </div>
    </div>
</div>

  );
}

export default Reservation;