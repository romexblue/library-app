import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import res from '../styles/AdminReservation.module.css';
import image1 from '../images/search_icon.png';
import '../styles/AdminReservation.module.css';

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
        
        axios.get(`http://localhost:5000/confab/all`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                setConfabData([]);
            } else {
                setConfabData(response.data);
                const firstConfabId = response.data[0].id ?? 0;
                getReservationByFilter(
                    firstConfabId,
                    document.getElementById('status-select').value,
                    new Date(),
                    currentPage
                );
            }
        })
    }, [currentPage])

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

    const getReservationById = () => {
        if (!value) { return; }
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
            <div className={res.pageTop} id=''>
                <div className={res.pageFilter1} id=''>
                    <select className={res.selectInput} disabled={searching} id="confab-select" onChange={handleConfabSelectChange}>
                    {confabData.map((confab) => (
                    <option className={res.optionSelect} key={confab.id} value={confab.id}>{confab.name}</option>
                    ))}
                    </select>
                </div>
                <div className={res.pageFilter2} id=''>
                    <div className={res.dateInput}>
                    <DatePicker className={res.datePicker}
                    disabled={searching}
                    selected={selectedDate}
                    onChange={date => handleDateChange(date)}
                    popperPlacement="bottom" 
                    />
                    </div>
                </div>
                <div className={res.pageFilter3} id=''>
                    <form className={res.searchForm}>
                        <input className={res.searchInput}type="number" placeholder="Find by ID" onChange={handleInputChange} value={value}></input>
                        <button className={res.searchBtnBox}onClick={() => getReservationById()}><img className={res.searchBtn} src={image1}></img></button>
                    </form>
                </div>
            </div>
            <div>
                <div className={res.reservationTable} id='reservetable'>
                    <table className={res.tableHeaders}>
                        <thead className='theaders'>
                            <tr>
                                <th>ID</th>
                                <th>Users List</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Reason</th>
                                <th>Phone</th>
                                <th>Status</th>
                                <th>Confab ID</th>
                                <th>Handler</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                <div style={{ height: "370px", overflowY: "scroll" }}>
                    <table className={res.tableContents}>
                        <tbody>
                            <tr>
                                <td>01</td>
                                <td>Names</td>
                                <td>2023-01-01</td>
                                <td>8:00am</td>
                                <td>10:00am</td>
                                <td>sadfsggsdfasdfasfas</td>
                                <td>099723232412</td>
                                <td>Pending</td>
                                <td>01</td>
                                <td>Chiong</td>
                                <td style={{ border: 'none' }}>
                                    <button>Confirm</button>
                                    <button>Cancel</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
                <ReactPaginate
                    pageCount={pageCount}
                    pageRangeDisplayed={10}
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
