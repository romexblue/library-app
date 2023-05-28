import { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import ReactPaginate from 'react-paginate';
import axios from 'axios';
import res from '../styles/AdminReservation.module.css';
import image1 from '../images/search_icon.png';
import DeleteModal from './DeleteModal';

const AdminReservation = () => {
    const [value, setValue] = useState('');
    const [confabData, setConfabData] = useState([]);
    const [reservationData, setReservationData] = useState([]);
    const [selectedResData, setSelectedResData] = useState();
    const [searching, setSearching] = useState(false);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [currentPage, setCurrentPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [action, setAction] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);

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

    const getReservationById = (event) => {
        event.preventDefault();
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

    const changeStatus = async (res, status) => {
        const admin = sessionStorage.getItem("id");
        const data = { confirmed_by: admin, confirmation_status: status }

        await axios.patch(`http://localhost:5000/reservation/requests/find-by/${res}`, data, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            handleDateChange(selectedDate)
        })
    };

    const handleClick = (res, status) => {
        if (status === "Confirmed") {
            setSelectedResData(res);
            setAction(status);
            changeStatus(res, status);
        }
        if (status === "Cancelled") {
            setSelectedResData(res);
            setAction(status);
            setShowDeleteModal(true);
        }
    };

    const handleDeclineConfirm = () => {
        changeStatus(selectedResData, action);
        setShowDeleteModal(false);
    };

    const handleDeclineCancel = () => {
        setShowDeleteModal(false);
    };

    const handlePageChange = (data) => {
        setCurrentPage(data.selected + 1);
    };

    return (
        <div>
            <div className={res.pageTop} id=''>
                <div className={res.pageFilter1} id=''>
                    <select className={res.tab} placeholder='Status' disabled={searching} id="status-select" onChange={handleStatusSelectChange}>
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Accepted</option>
                    </select>
                </div>
                <div className={res.pageFilter2} id='j'>
                    <select className={res.selectInput} disabled={searching} id="confab-select" onChange={handleConfabSelectChange}>
                        {confabData.map((confab) => (
                            <option className={res.optionSelect} key={confab.id} value={confab.id}>{confab.name}</option>
                        ))}
                    </select>
                </div>
                <div className={res.pageFilter3} id=''>
                    <div className={res.dateInput}>
                        <DatePicker className={res.datePicker}
                            disabled={searching}
                            selected={selectedDate}
                            onChange={date => handleDateChange(date)}
                            popperPlacement="bottom"
                        />
                    </div>
                </div>
                <div className={res.pageFilter4} id=''>
                    <form onSubmit={(event) => getReservationById(event)} className={res.searchForm}>
                        <input className={res.searchInput} type="number" placeholder="Find by ID" onChange={handleInputChange} value={value}></input>
                        <button className={res.searchBtnBox} type="submit"><img className={res.searchBtn} src={image1} alt=""></img></button>
                    </form>
                </div>
            </div>
            <div>
                <div className={res.mainTable} id='reservetable'>
                    <table className={res.tableContainer}>
                        <thead className={res.tableHeader}>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Reason</th>
                                <th>Status</th>
                                <th>Confab ID</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    </table>
                    <div>
                        <table className={res.tableContents}>
                            <tbody className={res.tableBody}>
                                {reservationData && reservationData.length !== 0 ? (
                                    reservationData.map((resObj, index) => {
                                        return (
                                            <tr key={index}>
                                                <td>{resObj?.id}</td>
                                                <td>{resObj?.date}</td>
                                                <td>{resObj?.start_time}</td>
                                                <td>{resObj?.end_time}</td>
                                                <td>{resObj?.reason}</td>
                                                <td>{resObj?.confirmation_status}</td>
                                                <td>{resObj?.ConfabId}</td>
                                                <td>
                                                    <button className={res.editButton} onClick={() => handleClick(resObj?.id, 'Confirmed')}>✔</button>
                                                    <button className={res.deleteButton} onClick={() => handleClick(resObj?.id, 'Cancelled')}>✖</button>
                                                </td>
                                            </tr>
                                        )
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="10" style={{ textAlign: "center" }}>{searching ? 'No Data Found' : 'No Data Found'}</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='paginateContainer'>
                    <ReactPaginate
                        pageCount={Math.ceil(pageCount / 7)} // number of pages
                        pageRangeDisplayed={15}
                        previousLabel={'Prev'}
                        previousClassName='prevPaginate'
                        nextLabel={'Next'}
                        nextClassName='nextPaginate'
                        marginPagesDisplayed={0}
                        onPageChange={handlePageChange} // callback function for page changes
                        containerClassName='paginate'
                        activeClassName='activePaginate'
                        pageClassName='classPaginate'
                    />
                </div>
            </div>
            {showDeleteModal && (
                <DeleteModal
                    title={"decline"}
                    message={`Reservation ${selectedResData}`}
                    onConfirm={handleDeclineConfirm}
                    onCancel={handleDeclineCancel}
                />
            )}
        </div>
    )
}

export default AdminReservation
