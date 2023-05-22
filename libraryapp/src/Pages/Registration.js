import { useEffect, useContext, useState, useRef } from "react"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";
import image1 from '../images/XuLib.png';
import image2 from '../images/ID_Design.png';
import image3 from '../images/Rfid_Icon.png';
// import image4 from '../images/Back_Icon.png';
import image5 from '../images/Success_Icon.png';
import image6 from '../images/Failed_Icon.png';
import reg from "../styles/regWiz.module.css";
import reg2 from "../styles/regWiz2.module.css";

const Registration = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    // const location = useLocation();
    // const [adminName, setAdminName] = useState((location.state || {}).name);
    // const [isAdmin, setIsAdmin] = useState((location.state || {}).userType);
    const [schoolId, setSchoolId] = useState("");
    const [type, setType] = useState("STUDENT");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [gender, setGender] = useState("U");
    const [college, setCollege] = useState("");
    const [year, setYear] = useState("");
    const [rfid, setRfid] = useState("");
    const [rfid2, setRfid2] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [matchMessage, setMatchMessage] = useState("");
    const rfid_1 = useRef(null);
    const rfid_2 = useRef(null);
    const [collegeSelect, setCollegeSelect] = useState([]);
    const [regResponse, setRegResponse] = useState("");

    const handleSubmit = () => {
        if (rfid === "" || rfid2 === "") {
            setMatchMessage("Required *")
            return;
        }
        if (matchMessage === "Does Not Match *") {
            return;
        }
        let mail = '';
        if (type.includes("STUDENT")) {
            mail = `${schoolId}@my.xu.edu.ph`
        } else {
            //pending for faculty email. Don't know basis
            //Same first letter in first name and same Last name
            //John Carlson and Jeremy Carlson
            //jcarlson@xu.edu.ph ???
        }
        const dataChanged = { school_id: schoolId, type: type, first_name: fName, last_name: lName, gender: gender, email: mail, college: college, year: year, rfid: rfid2 };
        axios.put(`http://localhost:5000/student/`, dataChanged, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                setRegResponse(response.data.error);
            } else {
                setRegResponse(response.data.success);
                nextPage();
                setSchoolId("");
                clearData();
            }
            setTimeout(() => {
                setRegResponse("");
            }, 5000);
        })
    };
    const handleCollegeChange = (event) => {
        setCollege(event.target.value)
    }
    const clearData = () => {
        setFName("");
        setLName("");
        setCollege("");
        setYear("");
        setRfid("");
        setRfid2("");
    };

    const findStudent = (event) => {
        setSchoolId(event.target.value);
        const id = event.target.value;
        if (id.trim() !== '') { //handle blank space when deleting all
            const encodedValue = encodeURIComponent(id.trim()); //handle special chars to prevent error
            axios.get(`http://localhost:5000/student/find-one/${encodedValue}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (!response.data) {
                        clearData();
                    } else {
                        setType(response.data.type);
                        setFName(response.data.first_name);
                        setLName(response.data.last_name);
                        setGender(response.data.gender);
                        setCollege(response.data.college);
                        setYear(response.data.year);
                    }
                })
        }
    };

    const checkMatch = (event) => {
        setRfid2(event.target.value);
        if (event.target.value !== rfid) {
            setMatchMessage("Does Not Match *");
        } else {
            setMatchMessage("")
        }
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            if (rfid !== '') {
                rfid_2.current.focus();
            }
        }
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
    }, [])
    useEffect(() => {
        //to check token then check if admin
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
            axios.get(`http://localhost:5000/auth/admin-auth/${sessionStorage.getItem("id")}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            }).then((response) => {
                if (response.data.error) {
                    //if not admin
                    authContext.logout();
                    navigate('/');
                } else {

                    //if admin
                    if (response.data.type === "Admin" || response.data.type === "Librarian" || response.data.type === "Assistant") {
                        navigate('/registration');
                        // setAdminName(response.data.name);
                        // setIsAdmin(response.data.type);
                    } else {
                        navigate('/choose') // for guard 
                    }
                    authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                }

            })
        } else {
            if (!sessionStorage.getItem("accessToken") && !sessionStorage.getItem("id")) {
                navigate('/')
            }
        }

    }, [authContext, navigate]);

    useEffect(() => {
        if (!showForm && rfid_1.current) {
            rfid_1.current.focus();
        }
    }, [showForm]);

    const nextPage = (event) => {
        if (event) {
            event.preventDefault();
        }

        setShowForm(!showForm);
    };

    return (
        <div>
            {/* <button className={reg.mainBackBtn} onClick={() => navigate('/admin', { state: { userType: isAdmin, name: adminName } })}><img alt="" src={image4}></img></button> */}
            <div className={reg.mainWindow}>
                {regResponse !== "" && (
                    <div className={`${reg.confirmModal} ${regResponse === "Something Went Wrong" ? reg.bgFail : reg.bgSuccess}`}>
                        <div className={reg.comps1}>
                            <div className={reg.imgHolder1}>
                                <img src={regResponse==="Something Went Wrong" ? image6: image5} alt=''></img>
                            </div>  
                        </div>
                        <div className={reg.comps2}>
                            <h3>{regResponse==="Something Went Wrong" ? "Failed!": "Success!"}</h3>
                            <p>{regResponse}</p>
                        </div>
                    </div>
                )}
                <div className={reg.centerWindow}>
                    <div className={reg.windowTitle}>
                        REGISTRATION WIZARD
                    </div>
                    <div className={reg.windowSubTitle}>
                        ID Registration System
                    </div>
                    <div className={reg.progressBar}>
                        <div className={reg.progressStatus}>
                            <div className={reg.perInfo}
                                style={{
                                    backgroundColor: showForm ? "rgb(40, 57, 113)" : "rgb(217, 217, 217)",
                                    color: showForm ? "rgb(255, 255, 255)" : "rgb(0, 0, 0)"
                                }}
                            ><p>Personal Information</p></div>
                            <div className={reg.rfidData}
                                style={{
                                    backgroundColor: showForm ? "rgb(217, 217, 217)" : "rgb(40, 57, 113)",
                                    color: showForm ? "rgb(0, 0, 0)" : "rgb(255, 255, 255)"
                                }}
                            >RFID Data</div>
                        </div>
                    </div>
                    {showForm && (
                        <form onSubmit={(event) => nextPage(event)}>
                            <div className={reg.formInput}>
                                <div className={reg.leftPanel}>
                                    <div className={reg.panelImage}>
                                        <img className={reg.pImage} src={image2} alt="" />
                                    </div>
                                </div>
                                <div className={reg.rightPanel}>
                                    <div className={reg.section1}>
                                        <label className={reg.label1}>School ID</label>
                                        <input required placeholder="Type School ID" value={schoolId} onChange={(event) => findStudent(event)} className={reg.input1} type="number" />
                                    </div>
                                    <div className={reg.section2}>
                                        <div className={reg.comp1}>
                                            <label className={reg.label2} >Last Name</label>
                                            <input required value={lName} onChange={(event) => setLName(event.target.value)} className={reg.input2} type="text" />
                                        </div>
                                    </div>
                                    <div className={reg.section3}>
                                        <label className={reg.label4}>Given Name</label>
                                        <input required value={fName} onChange={(event) => setFName(event.target.value)} className={reg.input4} type="text" />
                                    </div>
                                    <div className={reg.section4}>
                                        <div className={reg.compo1}>
                                            <label className={reg.label5}>College</label>
                                            <select className={reg.input5} value={college} onChange={handleCollegeChange}>
                                                {collegeSelect.map((college, index) => (
                                                    <option key={index} value={college.college}>
                                                        {college.college}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className={reg.compo2}>
                                            <label className={reg.label5a}>Type:</label>
                                            <select required className={reg.statusSelect} value={type} onChange={(event) => setType(event.target.value)}>
                                                <option value="FACULTY">Faculty</option>
                                                <option value="SHSFACULTY">SHS Faculty</option>
                                                <option value="STUDENT">Student</option>
                                                <option value="SHSSTUDENT">SHS Student</option>
                                                <option value="STAFF">Staff</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className={reg.section5}>
                                        <div className={reg.comp3}>
                                            <label className={reg.label6} >Year</label>
                                            <input required value={year} onChange={(event) => setYear(event.target.value)} className={reg.input6} type="text" />
                                        </div>
                                        <div className={reg.comp4}>
                                            <label className={reg.label7}>Gender</label>
                                            <select className={reg.input7} value={gender} onChange={(event) => setGender(event.target.value)}>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="U">Others</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className={reg.nxtButtonSection}>
                                <div className={reg.btnHolder1}>
                                    <button className={reg.nxtButton} type="submit">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </form>
                    )}

                    {!showForm && (
                        <div className={reg2.formInput}>
                            <div className={reg2.leftPanel}>
                                <div className={reg2.panelImage}>
                                    <img className={reg2.pImage} src={image3} alt="" />
                                </div>
                            </div>
                            <div className={reg2.rightPanel}>
                                <div className={reg2.section1}>
                                    <label className={reg2.label1}>Personal Info</label>
                                    <div className={reg2.input1}>{schoolId}</div>
                                    <div className={reg2.input2}>{`${fName} ${lName}`}</div>
                                </div>
                                <div className={reg2.section2}>
                                    <label className={reg2.label2} >RFID</label>
                                    <input required value={rfid}
                                        onChange={(event) => setRfid(event.target.value)}
                                        className={reg2.input3}
                                        type="password"
                                        ref={rfid_1}
                                        onKeyDown={handleKeyPress}
                                    />
                                </div>
                                <div className={reg2.section3}>
                                    <label className={reg2.label3}>Confirm RFID</label>
                                    <input required value={rfid2}
                                        onChange={(event) => checkMatch(event)}
                                        className={reg2.input4}
                                        type="password"
                                        ref={rfid_2}
                                    />
                                    <p className={reg2.warningMessage}>{matchMessage}</p>
                                </div>
                            </div>
                            <div className={reg2.nxtButtonSection}>
                                <div className={reg2.sectionButtons}>
                                    <button className={reg2.backButton} onClick={() => nextPage()}>
                                        Back
                                    </button>
                                    <button className={reg2.nxtButton} onClick={() => handleSubmit()}>
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={reg2.xulibIcon}>
                <img className={reg2.libIcon} src={image1} alt="" />
            </div>
        </div>
    )
}

export default Registration