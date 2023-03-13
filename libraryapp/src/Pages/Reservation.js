import React, { useState } from "react";

function Reservation() {
  const [startTime, setStartTime] = useState("08:00");
  const [endTime, setEndTime] = useState("19:00");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");

  const handleStartTimeChange = (event) => {
    const newStartTime = event.target.value;
    if (newStartTime >= "08:00" && newStartTime <= "19:00" && newStartTime < endTime) {
      setStartTime(newStartTime);
      setStartTimeError("");
    } else {
      setStartTimeError("Invalid start time.");
    }
  };

  const handleEndTimeChange = (event) => {
    const newEndTime = event.target.value;
    if (newEndTime >= "08:00" && newEndTime <= "19:00" && newEndTime > startTime) {
      setEndTime(newEndTime);
      setEndTimeError("");
    } else {
      setEndTimeError("Invalid end time.");
    }
  };

  return (
    <div>
      <label>Start Time:</label>
      <input type="time" value={startTime} onChange={handleStartTimeChange} onInvalid={(event) => {event.target.setCustomValidity("Invalid start time.")}} />
      <div style={{ color: "red" }}>{startTimeError}</div>
      <br />
      <label>End Time:</label>
      <input type="time" value={endTime} onChange={handleEndTimeChange} onInvalid={(event) => {event.target.setCustomValidity("Invalid end time.")}} />
      <div style={{ color: "red" }}>{endTimeError}</div>
    </div>
  );
}

export default Reservation;
