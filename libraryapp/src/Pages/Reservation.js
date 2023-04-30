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

function TimeSelect({ options, value, onChange }) {
  return (
    <div>
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
    //if (reason !== "" && selectedConfab) {
    setErrorMessage("");
    setShowForm(!showForm);
    // } else {
    //   setErrorMessage("Please Select Confab and Fill Purpose Field");
    // }
  };

  return (
    <>
      {showForm && (
        <>
          <div className="rmaindiv">
            <div className="rcenterdiv">
              <div className="rleft-panel">
                <div className="component" id='c1'>
                  <p className="panel-title" id='pantitle1'>Spaces</p>
                </div>
                <div className="component" id='c2'>
                  <div className="conf-buttons">
                 
                    <div className="square-button">
                      <div className="room-name">
                        <p className="roomName">Confab</p>
                      </div>
                      <div className="room-icon">
                        <p className="roomIcon">1</p>
                      </div>
                      <div className="room-info">
                        <p className="room-capacity">Capacity: <p className="rdata">10</p> pax</p>
                        <p className="room-type">Type: <p className="rdata">Confab</p></p>
                        <p className="room-loc">Location: <p className="rdata">2nd Floor</p></p>
                      </div>
                      <div className="room-reserve">
                        <button className="reserve-btn" id="reservebtn">Reserve</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="rdivider">

              </div>
              <div className="rright-panel">
                <div className="section" id="rsec1">
                  <div className="comp" id="rcomp1">
                    <p>Usage</p>
                  </div>
                  <div className="comp" id="rcomp2">
                    <img src={image1} alt="" />
                  </div>
                </div>
                <div className={"section"} id="rsec2">
                  <div className="Infosec" id="isec1">
                    <div className="Infolabel" id='ilabel1'>Date:</div>
                    <div className="ConfInfo" id="roomInfo1"><DatePicker wrapperClassName="datePicker" showIcon selected={selectedDate}
                      onChange={date => setDate(date)} minDate={new Date()} popperPlacement="bottom" required /></div>
                  </div>
                  <div className="Infosec" id="isec2">
                    <div className="Infolabel" id='ilabel2'>Room:</div>
                    <div className="ConfInfo" id="roomInfo2">Confab 1</div>
                  </div>
                  <div className="Infosec" id="isec3">
                    <div className="Infolabel" id='ilabel3'>Type:</div>
                    <div className="ConfInfo" id="roomInfo2">Confab Room</div>
                  </div>
                </div>
                <div className="section" id="rsec3">
                  <div className="table-header">
                    <div className="header" id="header1">No.</div>
                    <div className="header" id="header2">From</div>
                    <div className="header" id="header3">Until</div>
                    <div className="header" id="header4">Notes</div>
                  </div>
                </div>
                <div className="section" id="rsec4">
                  <div className="wrapper">
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
                </div>
                <div className="section" id="rsec5">
                  <div className="comp" id="drop3">
                    <div className="label">
                      Start Time
                    </div>
                    <div className="drop-down">
                      <TimeSelect
                        options={Object.keys(TIMES)}
                        value={startTime}
                        onChange={handleStartTimeChange}
                      />
                    </div>
                  </div>
                  <div className="comp" id="drop4">
                    <div className="label">
                      End Time
                    </div>
                    <div className="drop-down">
                      <TimeSelect
                        options={endTimeOptions}
                        value={endTime}
                        onChange={handleEndTimeChange}
                      />
                    </div>
                  </div>
                </div>
                <div className="section" id="rsec6">
                  <div className="btn-holder" id="holder1">
                    <button className="cancelbtn" >Cancel</button>
                    <button className="submitbtn" onClick={() => nextPage()}>Next</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {!showForm && (
        <>
          <ReservationUsers capacity={selectedConfab.max_capacity ?? 0} updateData={setList} />
        </>
      )}
      {showConfirmation && (
        <ConfModal
          title="Reservation Confirmation"
          message={`Confab: ${selectedConfab.name} Time: ${startTime}-${endTime} Users: ${studentList.join(", ")}`} //Pending pani kay di ma format
          onConfirm={handleConfirm}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}

export default Reservation;