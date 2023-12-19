import { useState, useEffect } from "react";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import AESModal from "./AESModal";
import DeleteModal from "./DeleteModal";
import stu from "../styles/AdminStudent.module.css";
import image1 from "../images/search_icon.png";
import image2 from "../images/Edit_Icon.png";
import image3 from "../images/Delete_Icon.png";
import Modal from "../components/Modal/Modal";

const AdminStudent = ({ adminData }) => {
    const navigate = useNavigate();
    const [idValue, setIdValue] = useState("");
    const [students, setStudents] = useState([]);
    const [studentData, setStudentData] = useState({});
    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [action, setAction] = useState("Delete");
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [file, setFile] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploadError, setUploadError] = useState("");

    const findStudentById = (event) => {
        event.preventDefault();
        if (!idValue) {
            return;
        }

        axios
            .get(
                `${process.env.REACT_APP_API_URL}/student/find-one/${idValue}`,
                {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id"),
                    },
                }
            )
            .then((response) => {
                if (response.data.error) {
                    setStudents([]);
                } else {
                    setStudents([response.data]);
                }
                setCount(0);
                setCurrentPage(1);
            });
    };

    const handleValueChange = (event) => {
        setIdValue(event.target.value);
        if (event.target.value === "") {
            fetchStudents(currentPage);
        }
    };

    const fetchStudents = async (page) => {
        await axios
            .get(`${process.env.REACT_APP_API_URL}/student/all/${page}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id"),
                },
            })
            .then((response) => {
                setStudents(response.data.students);
                setCount(response.data.count);
            })
            .catch((error) => {});
    };

    const handleClick = (student, type) => {
        if (type === "Delete") {
            setStudentData(student);
            setAction(type);
            setShowDeleteModal(true);
        }
        if (type === "Add") {
            setStudentData([]);
            setAction(type);
            setShowEditModal(true);
        }

        if (type === "Edit") {
            setStudentData(student);
            setAction(type);
            setShowEditModal(true);
        }
    };

    const handleConfirmStudent = () => {
        setStudentData({});
        setShowEditModal(false);
    };

    const handleCancelStudent = () => {
        setShowEditModal(false);
        setAction("");
    };

    const handleDeleteConfirm = () => {
        axios
            .delete(
                `${process.env.REACT_APP_API_URL}/student/${studentData.school_id}`,
                {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id"),
                    },
                }
            )
            .then((response) => {
                fetchStudents(currentPage);
            })
            .catch((error) => {});
        setShowDeleteModal(false);
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
        setAction("");
        setStudentData({});
    };

    useEffect(() => {
        fetchStudents(currentPage);
    }, [currentPage]);

    const handlePageClick = (data) => {
        setCurrentPage(data.selected + 1);
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        try {
            if (!file) {
                console.error("No file selected.");
                return;
            }

            const formData = new FormData();
            formData.append("csvFile", file);

            axios
                .post(
                    `${process.env.REACT_APP_API_URL}/student/upload-csv`,
                    formData,
                    {
                        headers: {
                            accessToken: sessionStorage.getItem("accessToken"),
                            userId: sessionStorage.getItem("id"),
                        },
                    }
                )
                .then((response) => {
                    setUploadError(
                        response?.response?.data?.toString() ??
                            "Successfully Uploaded"
                    );
                    setTimeout(() => {
                        setShowUploadModal(false);
                        setUploadError('');
                    }, 500);
                })
                .catch((error) => {
                    console.log(error);
                    setUploadError(
                        error?.response?.data?.error?.parent?.sqlMessage ??
                            "Sorry there was an error"
                    );
                });
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploadError(
                error?.response?.data?.error?.parent?.sqlMessage ??
                    "Sorry there was an error"
            );
        }
    };

    return (
        <div>
            <div className={stu.pageHeader}>
                <div className={stu.section1}>
                    <p>Patron</p>
                </div>
                <div className={stu.section2}>
                    <form
                        onSubmit={(event) => findStudentById(event)}
                        className={stu.searchForm}
                    >
                        <input
                            value={idValue}
                            onChange={(event) => handleValueChange(event)}
                            className={stu.searchInput}
                            type="number"
                            placeholder="Find by ID"
                        ></input>
                        <button type="submit" className={stu.searchBtnBox}>
                            <img
                                className={stu.searchBtn}
                                src={image1}
                                alt=""
                            ></img>
                        </button>
                    </form>
                </div>
                <button
                    type="button"
                    className={stu.addBtn}
                    onClick={() => setShowUploadModal(true)}
                >
                    Upload CSV File
                </button>
                <Modal
                    isOpen={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                >
                    <div style={{ width: "400px" }}>
                        <h2>Upload Patron Data</h2>
                        <p style={{ marginTop: "5px" }}>
                            <strong style={{ textDecoration: "underline" }}>
                                Strictly
                            </strong>{" "}
                            in the following order:
                        </p>
                        <ol style={{ paddingLeft: "1.875rem" }}>
                            <li>School Id</li>
                            <li>RFID</li>
                            <li>type</li>
                            <li>First Name</li>
                            <li>Last Name</li>
                            <li>Gender</li>
                            <li>Email</li>
                            <li>College</li>
                            <li>Year</li>
                        </ol>
                        <input
                            style={{ marginTop: "1.25rem" }}
                            type="file"
                            onChange={handleFileChange}
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                        <button
                            type="button"
                            style={{ marginTop: "1.25rem" }}
                            className={stu.addBtn}
                            onClick={handleUpload}
                        >
                            Upload To System
                        </button>
                        {uploadError && (
                            <p style={{ marginTop: "1.25rem" }}>
                                RESPONSE: {JSON.stringify(uploadError)}
                            </p>
                        )}
                    </div>
                </Modal>
                <div className={stu.section3}>
                    <div className={stu.button1}>
                        <button
                            className={stu.addBtn}
                            onClick={() =>
                                navigate("/registration", {
                                    state: {
                                        userType: adminData.type,
                                        name: adminData.name,
                                    },
                                })
                            }
                        >
                            <p>Registration Wizard</p>
                        </button>
                    </div>
                </div>
            </div>
            <div className={stu.mainTable}>
                <table className={stu.tableContainer}>
                    <thead className={stu.tableHeader}>
                        <tr>
                            <th>School ID</th>
                            <th>Type</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Sex</th>
                            <th>College</th>
                            <th>Year</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                </table>
                <table className={stu.tableContents}>
                    <tbody className={stu.tableBody}>
                        {students && students.length !== 0 ? (
                            students.map((studentObj, index) => {
                                return (
                                    <tr key={index}>
                                        <td>{studentObj?.school_id}</td>
                                        <td>{studentObj?.type}</td>
                                        <td>{studentObj?.first_name}</td>
                                        <td>{studentObj?.last_name}</td>
                                        <td>{studentObj?.gender}</td>
                                        <td>{studentObj?.college}</td>
                                        <td>{studentObj?.year}</td>
                                        <td>
                                            <button
                                                className={stu.editButton}
                                                onClick={() =>
                                                    handleClick(
                                                        studentObj,
                                                        "Edit"
                                                    )
                                                }
                                            >
                                                <img
                                                    alt="edit"
                                                    src={image2}
                                                ></img>
                                            </button>
                                            <button
                                                className={stu.deleteButton}
                                                onClick={() =>
                                                    handleClick(
                                                        studentObj,
                                                        "Delete"
                                                    )
                                                }
                                            >
                                                <img
                                                    alt="delete"
                                                    src={image3}
                                                ></img>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9" style={{ textAlign: "center" }}>
                                    No data found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <div className="paginateContainer">
                <ReactPaginate
                    pageCount={Math.ceil(count / 7)} // number of pages
                    pageRangeDisplayed={7}
                    previousLabel={"Prev"}
                    previousClassName="prevPaginate"
                    nextLabel={"Next"}
                    nextClassName="nextPaginate"
                    marginPagesDisplayed={0}
                    onPageChange={handlePageClick} // callback function for page change
                    containerClassName="paginate"
                    activeClassName="activePaginate"
                    pageClassName="classPaginate"
                />
            </div>
            {showEditModal && (
                <AESModal
                    title={`${action} Student`}
                    data={studentData}
                    update={handleConfirmStudent}
                    cancel={handleCancelStudent}
                    updateUi={fetchStudents}
                    action={action}
                />
            )}
            {showDeleteModal && (
                <DeleteModal
                    title={action.toLocaleLowerCase()}
                    message={`${studentData.last_name}`}
                    onConfirm={handleDeleteConfirm}
                    onCancel={handleDeleteCancel}
                />
            )}
        </div>
    );
};

export default AdminStudent;
