import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import res from '../styles/AdminReservation.module.css';

const AdminReservation = () => {
    const [value, setValue] = useState('');
    const [confabData, setConfabData] = useState([]);
    const [reservationData, setReservationData] = useState([]);
    const [hoveredRow, setHoveredRow] = useState(null);
    const [searching, setSearching] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);

    useEffect(() => {
        getReservationByFilter(
            1,
            document.getElementById('status-select').value,
            selectedDate,
            currentPage
        );
        axios.get(`http://localhost:5000/confab/all`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                setConfabData([]);
            } else {
                setConfabData(response.data)
            }
        })
    }, [selectedDate, currentPage])

    const getReservationByFilter = (confId, status, date, page) => {
        axios.get(`http://localhost:5000/reservation/requests/${confId}/${status}/${date.toISOString().slice(0, 10)}/${page}`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                setReservationData([]);
                setPageCount(0)
            } else {
                setReservationData(response.data.reservations);
                setPageCount(response.data.pageCount);
            }
        })
    };

    const handleConfabSelectChange = (event) => {
        const confId = event.target.value;
        const status = document.getElementById('status-select').value;
        getReservationByFilter(confId, status, selectedDate, currentPage);
    };

    const handleStatusSelectChange = (event) => {
        const confId = document.getElementById('confab-select').value;
        const status = event.target.value;
        getReservationByFilter(confId, status, selectedDate, currentPage);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        getReservationByFilter(
            document.getElementById('confab-select').value,
            document.getElementById('status-select').value,
            date,
            currentPage
        );
    };

    const getReservationById = () => {
        if(!value){return;}
        setSearching(true);
        axios.get(`http://localhost:5000/reservation/requests/find-by/${value}`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                setReservationData([]);
            } else {
                if (!response.data.reservation) {
                    setReservationData([])
                } else {
                    setReservationData([response.data.reservation]);
                }
                setPageCount(0);
                setCurrentPage(1);
            }
        })
    };

    const handleInputChange = (event) => {
        setValue(event.target.value)
        if (event.target.value === '') {
            setSearching(false); // set searching to false when input field is empty
        }
    };

    const handleClick = (id, status) => {
        const admin = sessionStorage.getItem("id");
        const data = { confirmed_by: admin, confirmation_status: status }
        axios.patch(`http://localhost:5000/reservation/requests/find-by/${id}`, data, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            console.log(response.data.sucess)
            handleDateChange(selectedDate)
        })
    };

    const handleMouseEnter = (index) => {
        setHoveredRow(index);
    };

    const handleMouseLeave = () => {
        setHoveredRow(null);
    };

    const handlePageChange = (data) => {
        setCurrentPage(data.selected + 1);
    };

    return (
        <div>
            <select disabled={searching} id="confab-select" onChange={handleConfabSelectChange}>
                {confabData.map((confab) => (
                    <option key={confab.id} value={confab.id}>{confab.name}</option>
                ))}
            </select>
            <select className={res.tab} disabled={searching} id="status-select" onChange={handleStatusSelectChange}>
                <option>Pending</option>
                <option>Confirmed</option>
                <option>Cancelled</option>
            </select>
            <DatePicker
                disabled={searching}
                selected={selectedDate}
                onChange={date => handleDateChange(date)}
                popperPlacement="bottom"
            />
            <input type="number" placeholder="Find by ID" onChange={handleInputChange} value={value}></input>
            <button onClick={() => getReservationById()}>Find By ID</button>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>Reservation ID</th>
                            <th>Users List</th>
                            <th>Date</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Reason</th>
                            <th>Phone</th>
                            <th>Status</th>
                            <th>Confab ID</th>
                            <th>Handler</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservationData && reservationData.length !== 0 ? (
                            reservationData.map((resObj, index) => {
                                return (
                                    <tr key={index}
                                        onMouseEnter={() => handleMouseEnter(index)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <td>{resObj?.id}</td>
                                        <td>
                                            <select>
                                                {resObj?.Students?.map((student, index) => (
                                                    <option key={index} value={student.school_id}>{student.school_id}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{resObj?.date}</td>
                                        <td>{resObj?.start_time}</td>
                                        <td>{resObj?.end_time}</td>
                                        <td>{resObj?.reason}</td>
                                        <td>{resObj?.phone}</td>
                                        <td>{resObj?.confirmation_status}</td>
                                        <td>{resObj?.ConfabId}</td>
                                        <td>{resObj?.confirmed_by}</td>
                                        {resObj?.confirmation_status === 'Pending' && (
                                            <td style={{ border: 'none' }}>
                                                {hoveredRow === index && (
                                                    <>
                                                        <button onClick={() => handleClick(resObj?.id, 'Confirmed')}>Confirm</button>
                                                        <button onClick={() => handleClick(resObj?.id, 'Cancelled')}>Cancel</button>
                                                    </>
                                                )}
                                            </td>
                                        )}
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td colSpan="10" style={{ textAlign: "center" }}>{searching ? 'No data found' : 'No Data Found'}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageChange}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                />
            </div>
        </div>
    )
}

export default AdminReservation
