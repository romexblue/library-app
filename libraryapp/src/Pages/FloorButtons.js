import '../styles/Button.css'
import axios from "axios"
import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import AuthContext from '../helpers/AuthContext';
import ConfModal from './ConfModal';
import InfoPage from './InfoPage';

const FloorButtons = () => {
    const [buttonData, setButtonData] = useState([]);// array of button text values based on database data
    const buttonRefs = useRef([]);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [studentID, setStudentID] = useState('');
    const [studentRFID, setStudentRFID] = useState('');
    const [floorID, setFloorID] = useState('');
    const [floorName, setFloorName] = useState('');
    const inputRef = useRef(null);
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleConfirm = () => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        const data = { date: formattedDate, time_in: formattedTime, StudentId: studentID, FloorId: floorID, rfid:studentRFID }

        axios.post("http://localhost:5000/record/", data,
            {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                }
            },
        ).then((response) => {
            if (response.data.error) {
                console.log(response.data)
            } else {
                console.log(response.data)
                console.log("Add Record Successful")
            }
        })

        inputRef.current.focus();
        setStudentID('');
        setStudentRFID('');
        setFloorID('');
        setFloorName('');
        setShowConfirmation(false);
    };

    const handleCancel = () => {
        inputRef.current.focus();
        console.log('Cancelled!');
        setStudentID('');
        setStudentRFID('');
        setFloorID('');
        setFloorName('');
        setShowConfirmation(false);
    };

    function checkFocus() {
        if (document.activeElement === document.body) {
            inputRef.current.focus();
            console.log("HELLODS");
        }
    }

    useEffect(() => {
        inputRef.current.focus();
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id")) {
            axios.get("http://localhost:5000/floor", {
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

        const interval = setInterval(() => {
            checkFocus();
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate, authContext]);

    const handleKeyDown = (event, index, id, name) => {
        const buttonCount = buttonData.length;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            buttonRefs.current[(index - 1 + buttonCount) % buttonCount].focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            buttonRefs.current[(index + 1) % buttonCount].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault(); //prevents calling function twice
            chooseFloor(id, name);
        }
    };

    const chooseFloor = (id, name) => {
        setFloorID(id);
        setFloorName(name);
        if (studentID) {
            setShowConfirmation(true);
        } else {
            console.log("No Such Student In Database")
            inputRef.current.focus();
        }

    }

    return (
        <>
            <InfoPage
                studentID={studentID} setStudentID={setStudentID}
                studentRFID={studentRFID} setStudentRFID={setStudentRFID}
                inputRef={inputRef} />

            <div className="button-container">
                Choose Floor
                {buttonData.map((buttonObj, index) => (
                    <button
                        key={buttonObj.id}
                        className="button"
                        ref={ref => (buttonRefs.current[index] = ref)}
                        onKeyDown={event => handleKeyDown(event, index, buttonObj.id, buttonObj.name)}
                        onClick={() => chooseFloor(buttonObj.id, buttonObj.name)}
                    >
                        {buttonObj.name}
                    </button>
                ))}
                {showConfirmation && (
                    <ConfModal
                        title="Confirm or Cancel?"
                        message={`Are you sure you want to go to ${floorName}`}
                        confirmText="Confirm"
                        cancelText="Cancel"
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                    />
                )}
            </div>
        </>
    );
}

export default FloorButtons