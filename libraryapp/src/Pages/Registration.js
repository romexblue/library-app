import { useEffect, useContext, useState } from "react"
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "../helpers/AuthContext";

const Registration = () => {
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const location = useLocation();
    const [adminName, setAdminName] = useState((location.state || {}).name);
    const [isAdmin, setIsAdmin] = useState((location.state || {}).userType);
    const [schoolId, setSchoolId] = useState("");
    const [type, setType] = useState("STUDENT");
    const [fName, setFName] = useState("");
    const [lName, setLName] = useState("");
    const [gender, setGender] = useState("");
    const [email, setEmail] = useState("");
    const [college, setCollege] = useState("");
    const [year, setYear] = useState("");
    const [rfid, setRfid] = useState("");
    const [rfid2, setRfid2] = useState("");
    const [showForm, setShowForm] = useState(true);
    const [matchMessage, setMatchMessage] = useState("");

    const handleSubmit = () => {
        if (matchMessage === "Does Not Match" || !rfid2) {
            return;
        }
        const dataChanged = { school_id: schoolId, type: type, first_name: fName, last_name: lName, gender: gender, email: email, college: college, year: year, rfid: rfid2 };
        console.log(dataChanged)
        axios.put(`http://localhost:5000/student/`, dataChanged, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        }).then((response) => {
            if (response.data.error) {
                //pass
            } else {
                nextPage();
                setSchoolId("");
                clearData();
            }
        })
    };

    const clearData = () => {
        setType("");
        setFName("");
        setLName("");
        setGender("");
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
            axios.get(`http://localhost:5000/student/find/${encodedValue}`, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        console.log("user not found");
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
        } else {
            console.log("user not found");
            setType("");
            setFName("");
            setLName("");
            setGender("");
            setCollege("");
            setYear("");
        }
    };

    const checkMatch = (event) => {
        setRfid2(event.target.value);
        if (event.target.value !== rfid) {
            setMatchMessage("Does Not Match");
        } else {
            setMatchMessage("")
        }
    };

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
                        setAdminName(response.data.name);
                        setIsAdmin(response.data.type);
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

    const nextPage = () => {
        setShowForm(!showForm);

    };

    return (
        <div>
            <button onClick={() => navigate('/admin', { state: { userType: isAdmin, name: adminName } })}>Back</button>
            <div className="mainWindow">
                <div className="centerWindow">
                    <div className="windowTitle">
                        REGISTRATION WIZARD
                    </div>
                    <div className="windowSubTitle">
                        ID Registration System
                    </div>
                    <div className="progressBar">
                        <div className="progressStatus">
                            <div className="perInfo"><p>Personal Information</p></div>
                            <div className="rfidData">RFID Data</div>
                        </div>
                    </div>
                    {showForm && (
                        <>
                            <div className="formInput">
                                <div className="leftPanel">
                                    <div className="panelImage">
                                        <img className="pImage" src="images/ID_Design.png" alt="" />
                                    </div>
                                </div>
                                <div className="rightPanel">
                                    <select id="status-select" value={type} onChange={(event) => setType(event.target.value)}>
                                        <option value="FACULTY">Faculty</option>
                                        <option value="SHSFACULTY">SHS Faculty</option>
                                        <option value="STUDENT">Student</option>
                                        <option value="SHSSTUDENT">SHS Student</option>
                                    </select>
                                    <div className="section1">
                                        <label className="label1">School ID</label>
                                        <input value={schoolId} onChange={(event) => findStudent(event)} className="input1" type="" />
                                    </div>
                                    <div className="section2">
                                        <div className="comp1">
                                            <label className="label2" >Last Name</label>
                                            <input value={lName} onChange={(event) => setLName(event.target.value)} className="input2" type="text" />
                                        </div>
                                    </div>
                                    <div className="section3">
                                        <label className="label4">Given Name</label>
                                        <input value={fName} onChange={(event) => setFName(event.target.value)} className="input4" type="text" />
                                    </div>
                                    <div className="section4">
                                        <label className="label5">Course</label>
                                        <input value={college} onChange={(event) => setCollege(event.target.value)} className="input5" type="text" />
                                    </div>
                                    <div className="section5">
                                        <div className="comp3">
                                            <label className="label6" >Year</label>
                                            <input value={year} onChange={(event) => setYear(event.target.value)} className="input6" type="text" />
                                        </div>
                                        <div className="comp4">
                                            <label className="label7">Gender</label>
                                            <select id="status-select" value={gender} onChange={(event) => setGender(event.target.value)}>
                                                <option value="M">Male</option>
                                                <option value="F">Female</option>
                                                <option value="U">Others</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                            </div>
                            <div className="nxtButtonSection">
                                <div className="btnHolder1">
                                    <button className="nxtButton" onClick={() => nextPage()}>
                                        Next
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
            {!showForm && (
                <>
                    <div className="section1">
                        <label className="label1">Personal Info</label>
                        <div className="input1">{schoolId}</div>
                        <div className="input2">{`${fName} ${lName}`}</div>
                    </div>
                    <div className="section2">
                        <label className="label2" >RFID</label>
                        <input value={rfid} onChange={(event) => setRfid(event.target.value)} className="input3" type="password" />
                    </div>
                    <div className="section3">
                        <label className="label3">Confirm RFID</label>
                        <input value={rfid2} onChange={(event) => checkMatch(event)} className="input4" type="password" />
                        <p>{matchMessage}</p>
                    </div>
                    <button className="nxtButton" onClick={() => nextPage()}>
                        Back
                    </button>
                    <button onClick={() => handleSubmit()}>
                        Submit
                    </button>
                </>
            )}
            <div className="xulibIcon">
                <img className="libIcon" src="images/XuLib.png" alt="" />
            </div>
            <div className="systemTime">

            </div>
        </div>
    )
}

export default Registration