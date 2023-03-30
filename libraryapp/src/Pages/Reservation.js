import React, { useState, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import axios from "axios";
import ReservationUsers from "./ReservationUsers";
import '../styles/Reservation.css';
import "react-datepicker/dist/react-datepicker.css";

const TIMES = {
  "8:00am": ["9:00am", "10:00am"],
  "9:00am": ["10:00am", "11:00am"],
  "10:00am": ["11:00am", "12:00pm"],
  "11:00am": ["12:00pm", "1:00pm"],
  "12:00pm": ["1:00pm", "2:00pm"],
  "1:00pm": ["2:00pm", "3:00pm"],
  "2:00pm": ["3:00pm", "4:00pm"],
  "3:00pm": ["4:00pm", "5:00pm"],
  "4:00pm": ["5:00pm", "6:00pm"],
  "5:00pm": ["6:00pm", "7:00pm"],
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
  const [startTime, setStartTime] = useState(Object.keys(TIMES)[0]);
  const [endTime, setEndTime] = useState(TIMES[startTime][1]); //set two hours on load
  const [selectedDate, setSelectedDate] = useState(new Date()); //set it to today date
  const [availableSlots, setAvailableSlots] = useState([]);
  const [confabs, setConfabs] = useState([]);
  const [selectedConfab, setSelectedConfab] = useState("");

  
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
    getConfabs();
  }, [getConfabs]);

  useEffect(() => {
    getAvailableTime();
  }, [getAvailableTime]);

  //converts to HH:mm:ss format
  // function convertTo24Hour(params) {
  //   let [hour, minute, period] = params.match(/\d+|am|pm/g);
  //   hour = parseInt(hour);
  //   if (period === "pm" && hour !== 12) {
  //     hour += 12;
  //   } else if (period === "am" && hour === 12) {
  //     hour = 0;
  //   }
  //   if (params === startTime) {   //add 01 in minutes so adding new reservation will not conflict
  //     return `${hour.toString().padStart(2, "0")}:${minute}:01`;
  //   } else {
  //     return `${hour.toString().padStart(2, "0")}:${minute}:00`;
  //   }
  // }

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

  return (
    <div>
      Choose a Date:
      <DatePicker
        selected={selectedDate}
        onChange={date => setDate(date)}
        minDate={new Date()}
        popperPlacement="bottom"
      />
      Choose a Confab:
      <select onChange={handleConfabChange}>
        <option value="">Select a confab</option>
        {confabs.map(confab => (
          <option key={confab.id} value={confab.id}>{confab.name}</option>
        ))}
      </select>
      {selectedConfab && (
        <div>
          <h3>{selectedConfab.name}</h3>
          <p>{selectedConfab.description}</p>
          <p>Max capacity: {selectedConfab.max_capacity}</p>
          <p>Status: {selectedConfab.status}</p>
        </div>
      )}

      <h3>Available Time</h3>
      <table style={{ margin: "0 auto" }}>
        <thead>
          <tr>
            <th>From</th>
            <th>Until</th>
          </tr>
        </thead>
        <tbody>
          {availableSlots.length > 0 ? (
            availableSlots.map(slot => (
              <tr key={slot.start}>
                <td>{convertTo12Hour(slot.start)}</td>
                <td>{convertTo12Hour(slot.end)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>
                {selectedConfab ? "Fully Booked" : "Choose a Confab"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <TimeSelect
        label="Start Time"
        options={Object.keys(TIMES)}
        value={startTime}
        onChange={handleStartTimeChange}
      />
      <TimeSelect
        label="End Time"
        options={endTimeOptions}
        value={endTime}
        onChange={handleEndTimeChange}
      />
      <ReservationUsers capacity={selectedConfab.max_capacity ?? 0}/>
    </div>
  );
}

export default Reservation;
