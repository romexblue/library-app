import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';

const AdminStatistics = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [college, setCollege] = useState("");
  const [collegeSelect, setCollegeSelect] = useState([]);
  const [reservationStats, setReservationStats] = useState('');
  const [recordStats, setRecordStats] = useState('');

  const handleCollegeChange = (event) => {
    setCollege(event.target.value)
    const link = `http://localhost:5000/reservation/stats/${startDate}/${endDate}/${event.target.value}`;
    const link2 = `http://localhost:5000/record/stats/${startDate}/${endDate}/${event.target.value}`;
    getReservationStats(link);
    getRecordStats(link2);
  };

  const handleStartDateChange = (date) => {
    setStartDate(date);
    const start = date.toISOString().slice(0, 10);
    const link = `http://localhost:5000/reservation/stats/${start}/${endDate}/${college}`;
    const link2 = `http://localhost:5000/record/stats/${start}/${endDate}/${college}`;
    getReservationStats(link);
    getRecordStats(link2);
  };

  const handleEndDateChange = (date) => {
    setEndDate(date);
    const end = date.toISOString().slice(0, 10);
    const link = `http://localhost:5000/reservation/stats/${startDate}/${end}/${college}`;
    const link2 = `http://localhost:5000/record/stats/${startDate}/${end}/${college}`;
    getReservationStats(link);
    getRecordStats(link2);
  };

  const getReservationStats = async (link) => {
    await axios.get(link, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then(response => {
        if (response.data) {
          setReservationStats(response.data);
          console.log(response.data);
        }
      })
  };

  const getRecordStats = async (link) => {
    await axios.get(link, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then(response => {
        if (response.data) {
          setRecordStats(response.data);
          console.log(response.data);
        }
      })
  };

  useEffect(() => {
    axios.get(`http://localhost:5000/student/all/college`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then(response => {
        if (response.data) {
          setCollegeSelect(response.data)
        }
      })
    const link = `http://localhost:5000/reservation/stats/${startDate}/${endDate}`;
    const link2 = `http://localhost:5000/record/stats/${startDate}/${endDate}/`;
    getReservationStats(link);
    getRecordStats(link2);
  }, [])

  return (
    <div style={{ overflowY: 'scroll', height: "550px" }}>
      <DatePicker className=""
        selected={startDate}
        onChange={date => handleStartDateChange(date)}
        popperPlacement="bottom"
      />
      <DatePicker className=""
        selected={endDate}
        onChange={date => handleEndDateChange(date)}
        popperPlacement="bottom"
      />
      <select value={college} onChange={handleCollegeChange}>
        <option value="">All</option>
        {collegeSelect.map((college, index) => (
          <option key={index} value={college.college}>
            {college.college}
          </option>
        ))}
      </select>
      <div>
        <h2>Library Entry/Exit Statistics {college ? `for ${college}` : ""} </h2>
        {recordStats && (
          <>
            <p>Total Usage Count (person): {recordStats.overall.count}</p>
            <p>Average Time Stayed (seconds): {recordStats.overall.averageStayTime}</p>
            <p>Highest Time Stayed (seconds): {recordStats.overall.highestStayTime}</p>
            <p>Lowest Time Stayed (seconds): {recordStats.overall.lowestStayTime}</p>
          </>
        )}
        <div>
          <br></br>
          {recordStats.floors && recordStats.floors.length > 0 && (
            <div>
              <h4>Library Entry/Exit Statistics per Floor</h4>
              {recordStats.floors.map((floor, index) => (
                <div key={index}>
                  <p>Space: {floor['Floor.name']}</p>
                  <p>Usage Count (person): {floor.count}</p>
                  <p>Average Time Stayed (seconds): {floor.averageStayTime}</p>
                  <p>Highest Time Stayed (seconds): {floor.highestStayTime}</p>
                  <p>Lowest Time Stayed (seconds): {floor.lowestStayTime}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div>
        <br></br>
        <h2>Spaces Usage Statistics  {college ? `for ${college}` : ""} </h2>
        <p style={{ fontSize: "13px" }}>
          Note: Reservations total per College is based from the representative since reservation may contain students from different collegs
        </p>
        <br></br>
        {reservationStats && (
          <>
            <p>Approved Reservations Total: {reservationStats.totalReservations}</p>
            <p>Usage Count (person): {reservationStats.totalStudentUsage}</p>
          </>
        )}
        <br></br>
        <h4>Space Usage Statistics per Floor</h4>
        {reservationStats.totalReservationByConfab && reservationStats.totalReservationByConfab.length > 0 && (
          <div>
            <br></br>
            <h4>Approved Reseravations by Confab</h4>
            {reservationStats.totalReservationByConfab.map((usage, index) => (
              <div key={index}>
                <p>Space: {usage.name}</p>
                <p>Usage Count (person): {usage.count}</p>
              </div>
            ))}
          </div>
        )}

        {reservationStats.totalStudentUsageByConfab && reservationStats.totalStudentUsageByConfab.length > 0 && (
          <div>
            <br></br>
            <h4>Student Usage By Confab</h4>
            {reservationStats.totalStudentUsageByConfab.map((usage, index) => (
              <div key={index}>
                <p>Space: {usage.name}</p>
                <p>Usage Count (person): {usage.count}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminStatistics