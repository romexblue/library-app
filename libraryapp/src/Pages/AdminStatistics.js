import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";
import DatePicker from "react-datepicker";
import axios from "axios";
import stat from "../styles/AdminStatistics.module.css";
import image1 from "../images/Export_Icon.png";

const AdminStatistics = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [college, setCollege] = useState("");
    const [collegeSelect, setCollegeSelect] = useState([]);
    // const [reservationStats, setReservationStats] = useState('');
    const [recordStats, setRecordStats] = useState("");

    const handleCollegeChange = (event) => {
        setCollege(event.target.value);
        const link = `${process.env.REACT_APP_API_URL}/reservation/stats/${startDate}/${endDate}/${event.target.value}`;
        const link2 = `${process.env.REACT_APP_API_URL}/record/stats/${startDate}/${endDate}/${event.target.value}`;
        getReservationStats(link);
        getRecordStats(link2);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        const start = date.toISOString().slice(0, 10);
        const link = `${process.env.REACT_APP_API_URL}/reservation/stats/${start}/${endDate}/${college}`;
        const link2 = `${process.env.REACT_APP_API_URL}/record/stats/${start}/${endDate}/${college}`;
        getReservationStats(link);
        getRecordStats(link2);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        const end = date.toISOString().slice(0, 10);
        const link = `${process.env.REACT_APP_API_URL}/reservation/stats/${startDate}/${end}/${college}`;
        const link2 = `${process.env.REACT_APP_API_URL}/record/stats/${startDate}/${end}/${college}`;
        getReservationStats(link);
        getRecordStats(link2);
    };

    const getReservationStats = async (link) => {
        await axios
            .get(link, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                if (response.data) {
                    // setReservationStats(response.data);
                }
            });
    };

    const getRecordStats = async (link) => {
        await axios
            .get(link, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                if (response.data) {
                    setRecordStats(response.data);
                }
            });
    };

    useEffect(() => {
        axios
            .get(`${process.env.REACT_APP_API_URL}/student/all/college`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                if (response.data) {
                    setCollegeSelect(response.data);
                }
            });
        const link = `${process.env.REACT_APP_API_URL}/reservation/stats/${startDate}/${endDate}`;
        const link2 = `${process.env.REACT_APP_API_URL}/record/stats/${startDate}/${endDate}/`;
        getReservationStats(link);
        getRecordStats(link2);
    }, [startDate, endDate]);

    const totalUsers = recordStats?.records?.reduce((acc, val) => {
        return acc + (val?.record_count ?? 0);
    }, 0);

    const headers = [
        { label: "Total Users", key: "total_count" },
        { label: "Floor Name", key: "floor_name" },
        { label: "Users Per Floor", key: "count" },
    ];

    const csvData = [
        { total_count: totalUsers, floor_name: "", count: "" },
        ...(recordStats?.records?.map((record) => ({
            total_count: "",
            floor_name: record.floor_name,
            count: record.record_count,
        })) || []),
    ];

    const csvReport = {
        data: csvData,
        headers: headers,
        filename: `${startDate.toISOString().slice(0, 10)}-${endDate
            .toISOString()
            .slice(0, 10)}-${college === "" ? "All" : college}`,
    };

    return (
        <div className={stat.mainPage}>
            <div className={stat.topBar}>
                <div className={stat.dpStart}>
                    <label className={stat.label}>Start Date</label>
                    <DatePicker
                        className={stat.pdateStart}
                        selected={startDate}
                        onChange={(date) => handleStartDateChange(date)}
                        popperPlacement="bottom"
                    />
                </div>
                <div className={stat.dpEnd}>
                    <label className={stat.label}>End Date</label>
                    <DatePicker
                        className={stat.pdateEnd}
                        selected={endDate}
                        onChange={(date) => handleEndDateChange(date)}
                        popperPlacement="bottom"
                    />
                </div>
                <div className={stat.category}>
                    <label className={stat.label}>Filter by College</label>
                    <select
                        className={stat.allSelect}
                        value={college}
                        onChange={handleCollegeChange}
                    >
                        <option value="">All</option>
                        {collegeSelect.map((college, index) => (
                            <option key={index} value={college.college}>
                                {college.college}
                            </option>
                        ))}
                    </select>
                </div>
                <div className={stat.export}>
                    {/*Export Button*/}
                    <div className={stat.exportContainer}>
                        <CSVLink {...csvReport} className={stat.imgCont}>
                            <img
                                className={stat.exportIcon}
                                src={image1}
                                alt="export"
                            />
                        </CSVLink>
                    </div>
                </div>
            </div>
            <div className={stat.allStatistics}>
                <div className={stat.headerStatistics}>
                    <div className={stat.panel1Title}>
                        <p>
                            Entry/Exit General Statistics{" "}
                            {college ? `for [${college}]` : ""}{" "}
                        </p>
                    </div>
                    {recordStats && (
                        <div className={stat.StatisticsContainer1}>
                            <div className={stat.stats1a}>
                                <h4>Total Library Users (person):</h4>{" "}
                                <p> {totalUsers}</p>
                            </div>
                            {/* <div className={stat.stats2a}>
                                <h4>Avg. Time Stayed (sec):</h4>
                                <p>
                                    {" "}
                                    {Math.round(
                                        recordStats.overall.averageStayTime
                                    )}
                                </p>
                            </div> */}
                            <div className={stat.generalStatistics}>
                                <div className={stat.panel1}>
                                    <div className={stat.tableTitle}>
                                        Library Entry/Exit Statistics by Floor
                                    </div>
                                    <div className={stat.floorStatitics}>
                                        {recordStats?.records &&
                                            recordStats?.records?.length >
                                                0 && (
                                                <div>
                                                    {recordStats?.records.map(
                                                        (floor, index) => (
                                                            <div
                                                                className={
                                                                    stat.perfloorStats
                                                                }
                                                                key={index}
                                                            >
                                                                <div
                                                                    className={
                                                                        stat.floorTitleA
                                                                    }
                                                                >
                                                                    {
                                                                        floor?.floor_name
                                                                    }
                                                                    :
                                                                    <div
                                                                        className={
                                                                            stat.divider
                                                                        }
                                                                    ></div>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        stat.allperfloor
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            stat.statsboxA
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            Usage
                                                                            Count
                                                                            (person):
                                                                        </h4>
                                                                        <p>
                                                                            {
                                                                                floor?.record_count
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    {/* <div
                                                                        className={
                                                                            stat.statsboxA
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            Avg.
                                                                            Time
                                                                            Stayed
                                                                            (sec):
                                                                        </h4>
                                                                        <p>
                                                                            {" "}
                                                                            {Math.round(
                                                                                floor.averageStayTime
                                                                            )}
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            stat.statsboxA
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            Highest
                                                                            Time
                                                                            Stayed
                                                                            (sec):
                                                                        </h4>
                                                                        <p>
                                                                            {" "}
                                                                            {
                                                                                floor.highestStayTime
                                                                            }
                                                                        </p>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            stat.statsboxA
                                                                        }
                                                                    >
                                                                        <h4>
                                                                            Lowest
                                                                            Time
                                                                            Stayed
                                                                            (sec):
                                                                        </h4>
                                                                        <p>
                                                                            {" "}
                                                                            {
                                                                                floor.lowestStayTime
                                                                            }
                                                                        </p>
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminStatistics;
