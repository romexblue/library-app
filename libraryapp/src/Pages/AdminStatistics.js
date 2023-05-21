import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import stat from '../styles/AdminStatistics.module.css';


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
    <div className={stat.mainPage}>
      <div className={stat.topBar}>
        <div className={stat.dpStart}>
      <DatePicker className={stat.pdateStart}
        selected={startDate}
        onChange={date => handleStartDateChange(date)}
        popperPlacement="bottom"
      />
        </div>
        <div className={stat.dpEnd}>
        <DatePicker className={stat.pdateEnd}
          selected={endDate}
          onChange={date => handleEndDateChange(date)}
          popperPlacement="bottom"
        />
        </div>
        <div className={stat.category}>
        <select className={stat.allSelect} value={college} onChange={handleCollegeChange}>
          <option value="">All</option>
          {collegeSelect.map((college, index) => (
            <option key={index} value={college.college}>
              {college.college}
            </option>
          ))}
        </select>
        </div>
      </div>
      <div className={stat.allStatistics}>
        <div className={stat.headerStatistics}>
        <div className={stat.panel1Title}>
          <p>Entry/Exit General Statistics {college ? `for [${college}]` : ""} </p>
          </div>
          {recordStats && (
            <div className={stat.StatisticsContainer1}>
              <div className={stat.stats1a}><h4>Total Library Users (person):</h4> <p> {recordStats.overall.count}</p></div>
              <div className={stat.stats2a}><h4>Avg. Time Stayed (sec):</h4><p> {recordStats.overall.averageStayTime}</p></div>
              <div className={stat.stats3a}><h4>Highest Time Stayed (sec):</h4><p> {recordStats.overall.highestStayTime}</p></div>
              <div className={stat.stats4a}><h4>Lowest Time Stayed (sec):</h4><p> {recordStats.overall.lowestStayTime}</p></div>
            </div>
          )}
          </div>
        <div className={stat.generalStatistics}>
        <div className={stat.panel1}>    
          <div className={stat.tableTitle}>Library Entry/Exit Statistics by Floor</div>
          <div className={stat.floorStatitics}>
          {recordStats.floors && recordStats.floors.length > 0 && (
            <div>
              {recordStats.floors.map((floor, index) => (
                <div className={stat.perfloorStats} key={index}>
                  <p className={stat.floorTitleA}>{floor['Floor.name']}:<div className={stat.divider}></div></p>
                  <div className={stat.allperfloor}>
                    <div className={stat.statsboxA}><h4>Usage Count (person):</h4><p> {floor.count}</p></div>
                    <div className={stat.statsboxA}><h4>Avg. Time Stayed (sec):</h4><p> {floor.averageStayTime}</p></div>
                    <div className={stat.statsboxA}><h4>Highest Time Stayed (sec):</h4><p> {floor.highestStayTime}</p></div>
                    <div className={stat.statsboxA}><h4>Lowest Time Stayed (sec):</h4><p> {floor.lowestStayTime}</p></div>
                </div>
                </div>
              ))}
              
            </div>
          )}
          </div>
          </div>
        <div className={stat.panel2}>
          <div className={stat.panel2Title}>Spaces Usage Statistics  {college ? `for ${college}` : ""} </div>
          <p style={{ fontSize: "13px" }}>
            Note: Reservations total per College is based from the representative as reservation may contain students from different collegs
          </p>
          <br></br>
          {reservationStats && (
            <>
              <div className={stat.stats1c}><p>Approved Reservations Total: {reservationStats.totalReservations}</p></div>
              <div className={stat.stats2c}><p>Usage Count (person): {reservationStats.totalStudentUsage}</p></div>
            </>
          )}
          <h4>Space Usage Statistics per Floor</h4>
          {reservationStats.totalReservationByConfab && reservationStats.totalReservationByConfab.length > 0 && (
            <div>
              <br></br>
              <h4>Approved Reseravations by Confab</h4>
              {reservationStats.totalReservationByConfab.map((usage, index) => (
                <div key={index}>
                  <p>Space: {usage.name}</p>
                  <div className={stat.stats1d}><p>Usage Count (person): {usage.count}</p></div>
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
    </div>
    </div>
  )
}

export default AdminStatistics