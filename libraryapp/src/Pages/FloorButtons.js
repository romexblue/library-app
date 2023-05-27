import '../styles/FButton.css'
import axios from "axios"
import { useState, useEffect, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../helpers/AuthContext';
import ConFFModal from './ConFFModal';
import InfoPage from './InfoPage';
import image1 from '../images/Num_1.png';
import image2 from '../images/Tag_1.png';
import image3 from '../images/Num_2.png';
import image4 from '../images/Tag_2.png';
import image7 from '../images/Reminder_Icon.png';


const FloorButtons = () => {
    const [buttonData, setButtonData] = useState([]);// array of button text values based on database data
    //const buttonRefs = useRef([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [studentID, setStudentID] = useState('');
    const [studentRFID, setStudentRFID] = useState('');
    const [studentData, setStudentData] = useState([]);
    const [floorID, setFloorID] = useState('');
    const [floorName, setFloorName] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const [date, setDate] = useState(new Date());
    const handleConfirm = () => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        const data = { date: formattedDate, time_in: formattedTime, StudentSchoolId: studentID, FloorId: floorID, rfid: studentRFID }

        axios.post("http://localhost:5000/record/", data,
            {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                }
            },
        ).then((response) => {
            if (response.data.error) {
            } else {
            }
            getFloors();
        })

        //inputRef.current.focus();
        setStudentID('');
        setStudentRFID('');
        setFloorID('');
        setFloorName('');
        setShowConfirmation(false);
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
            hour12: true
        });
    };
    const handleCancel = () => {
        setFloorID('');
        setFloorName('');
        setShowConfirmation(false);
    };
    useEffect(() => {
        //inputRef.current.focus();
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id")) {
            axios.get("http://localhost:5000/floor/all", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        navigate('/')
                        authContext.logout()
                    } else {
                        setButtonData(response.data)
                        authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                        navigate('/entry')
                    }
                })
        }

        if (!authContext.isLoggedIn) { navigate('/') }

        // const interval = setInterval(() => {
        //     checkFocus();
        // }, 3000);

        // return () => clearInterval(interval);

        const timer = setInterval(() => {
            setDate(new Date());
            getFloors();
        }, 1000);
        return () => clearInterval(timer);
    }, [navigate, authContext,]);

    const getFloors = () => {
        axios.get("http://localhost:5000/floor/all", {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        })
            .then((response) => {
                setButtonData(response.data)
            })
    };

    // const handleKeyDown = (event, index, id, name) => {
    //     const buttonCount = buttonData.length;

    //     if (event.key === 'ArrowUp') {
    //         event.preventDefault();
    //         buttonRefs.current[(index - 1 + buttonCount) % buttonCount].focus();
    //     } else if (event.key === 'ArrowDown') {
    //         event.preventDefault();
    //         buttonRefs.current[(index + 1) % buttonCount].focus();
    //     } else if (event.key === 'Enter') {
    //         event.preventDefault(); //prevents calling function twice
    //         chooseFloor(id, name);
    //     }
    // };

    const chooseFloor = (id, name) => {
        setFloorID(id);
        setFloorName(name);
        if (studentID) {
            setShowConfirmation(true);
        } else {
            //console.log("No Such Student In Database")
            //inputRef.current.focus();
        }

    }

    return (
        <>
            {!studentID && (
                <InfoPage
                    studentID={studentID} setStudentID={setStudentID}
                    studentRFID={studentRFID} setStudentRFID={setStudentRFID}
                    setStudentData={setStudentData}
                // inputRef={inputRef} 
                />
            )}

            {studentID && (

                <div className="info">
                    <div className="left-panel">
                        <div className="info-student">
                            <div className="stud-info" id="sec1-a">
                            </div>
                            <div className="stud-info1" id="sec2-a">
                                <div className="comp" id="comp1">
                                    <img src={image1} alt='Img' />
                                </div>
                                <div className="comp" id="comp2">
                                    <img src={image2} alt='Img' />
                                </div>
                                <div className="comp" id="comp3">
                                </div>

                            </div>
                            <div className="stud-info" id="sec3-a">
                                <div className="comp" id="comp4">
                                    ID Number:
                                </div>
                                <div className="comp" id="comp5">
                                    {studentData.school_id}
                                </div>
                            </div>
                            <div className="stud-info" id="sec4-a">
                            </div>
                            <div className="stud-info" id="sec5-a">
                                <div className="comp" id="comp6">
                                    Last Name:
                                </div>
                                <div className="comp" id="comp7">
                                    {studentData.last_name}
                                </div>
                            </div>
                            <div className="stud-info" id="sec6-a">
                                <div className="partition" id="part1">
                                    <div className="comp" id="comp8">
                                        First Name:
                                    </div>
                                    <div className="comp" id="comp9">
                                        {studentData.first_name}
                                    </div>
                                </div>
                                <div className="partition" id="part2">
                                    <div className="comp" id="comp10">
                                        Type:
                                    </div>
                                    <div className="comp" id="comp11">
                                        {studentData.type}
                                    </div>
                                </div>
                            </div>
                            <div className="stud-info" id="sec7-a">
                            </div>
                            <div className="stud-info" id="sec8-a">
                                <div className="partition" id="part3">
                                    <div className="comp" id="comp12">
                                        Sex:
                                    </div>
                                    <div className="comp" id="comp13">
                                        {studentData.gender}
                                    </div>
                                </div>
                                <div className="partition" id="part4">
                                    <div className="comp" id="comp14">
                                        College:
                                    </div>
                                    <div className="comp" id="comp15">
                                        {studentData.college}
                                    </div>
                                </div>
                                <div className="partition" id="part6">
                                    <div className="comp" id="comp16">
                                        Year:
                                    </div>
                                    <div className="comp" id="comp17">
                                        {/* Takes Year From (LAW_LPRO 2S1) Format */}
                                        {studentData.year ? studentData.year.match(/\d+/)?.[0] || '' : ''}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="note-display">
                            <div className="note-up" id="uppernote">
                                <div className="time">
                                    <div className="systemtime2">
                                        <div className="display-date">
                                            <span id="month">{formatDate(date)}</span>
                                        </div>
                                        <div className="display-time">{formatTime(date)}</div>
                                    </div>
                                </div>
                                <div className="reminder">
                                    <div className="note-div">
                                        <p>Please confirm that all information
                                            are correct before selecting your desired floor .</p>
                                    </div>
                                    <div className="note-icon">
                                        <img src={image7} alt='Img' />
                                    </div>
                                </div>
                            </div>
                            <div className="note-down" id="lowernote">
                                <button className="cancelbtn" onClick={() => { setStudentID(''); setStudentRFID(''); getFloors(); }}>Back</button>
                            </div>
                        </div>
                    </div>
                    <div className="fright-panel">
                        <div className='building-select'>
                            <div className="building-select1" id="sec1-b"></div>
                            <div className="building-select2" id="sec2-b">
                                <div className="comp" id="comp18">
                                    <img src={image3} alt='Img' />
                                </div>
                                <div className="comp" id="comp19">
                                    <img src={image4} alt='Img' />
                                </div>
                                <div className="comp" id="comp20">
                                </div>
                            </div>
                            <div className='buildings'>
                                {buttonData.map((buttonObj, index) => (
                                    <div className='building-option' tabIndex="0" id="sec3-b" key={buttonObj.id} onClick={() => {
                                        if (buttonObj.status === "Closed" || buttonObj.status === "Full") {
                                            return;
                                        } chooseFloor(buttonObj.id, buttonObj.name);
                                    }}>
                                        <div className="label" id="tag1">
                                            <h1>L{buttonObj.level}</h1>
                                        </div>
                                        <div className="label" id="tag2">
                                            <div className="division" id="divup">
                                                <h2 className="building-text">{buttonObj.name}</h2>
                                            </div>
                                            <div className="division" id="divdown">
                                                <h2 className="building-text">Current Capacity: {buttonObj.current_count}</h2>
                                            </div>
                                        </div>
                                        <div className="label" id="tag3">
                                            <div className="division" id="label-div">
                                                <div className='labelcolor' id='labelc' style={{
                                                    backgroundColor: buttonObj.status === "Full"
                                                        ? "rgb(245, 57, 35)"
                                                        : buttonObj.status === "Closed"
                                                            ? "rgb(182, 182, 182)"
                                                            : "rgb(58, 187, 60)"
                                                }}>

                                                </div>
                                            </div>
                                            <div className="division" id="stat-div">
                                                <p>Status: {buttonObj.status}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {showConfirmation && (
                <ConFFModal
                    title="CONFIRM"
                    message={`Visiting Level: ${floorName}`}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </>
    );
}

export default FloorButtons