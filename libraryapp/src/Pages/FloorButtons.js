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
    const [floorID, setFloorID] = useState('');
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    const handleConfirm = () => {
        const today = new Date();
        const formattedDate = today.toISOString().slice(0, 10);
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        console.log(`Current Date is ${formattedDate} and Current Time is ${formattedTime}`);
        const data = { date: formattedDate, time_in: formattedTime, StudentId: studentID, FloorId: floorID, }
        console.log(data)
        axios.post("http://localhost:5000/record/", data,
            { headers: { accessToken: sessionStorage.getItem("accessToken") } },
        ).then((response) => {
            console.log("Add Record Successful")
        })

        setStudentID('');
        setFloorID('');
        setShowConfirmation(false);
    };

    const handleCancel = () => {
        console.log('Cancelled!');
        setShowConfirmation(false);
    };

    useEffect(() => {
        axios.get("http://localhost:5000/floor", {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
            },
        })
            .then((response) => {
                if (response.data.error) {
                    console.log(response.data.error)
                    navigate('/')
                    authContext.logout()
                } else {
                    setButtonData(response.data)
                }
            })
    }, [navigate, authContext]);

    useEffect(() => {
        buttonRefs.current[0]?.focus(); // set initial focus on first button if there are buttons
    }, [buttonData]);

    const handleKeyDown = (event, index) => {
        const buttonCount = buttonData.length;

        if (event.key === 'ArrowUp') {
            event.preventDefault();
            buttonRefs.current[(index - 1 + buttonCount) % buttonCount].focus();
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            buttonRefs.current[(index + 1) % buttonCount].focus();
        } else if (event.key === 'Enter') {
            event.preventDefault(); //prevents calling function twice
            chooseFloor(index);
        }
    };

    const chooseFloor = (index) => {
        setFloorID(index+1);
        if (studentID) {
            setShowConfirmation(true);
        } else {
            console.log("No Such Student In Database")
        }

    }

    return (
        <>
            <InfoPage studentID={studentID} setStudentID={setStudentID} />
            <div className="button-container">
                Choose Floor
                {buttonData.map((buttonObj, index) => (
                    <button
                        key={buttonObj.id}
                        className="button"
                        ref={ref => (buttonRefs.current[index] = ref)}
                        onKeyDown={event => handleKeyDown(event, index)}
                        onClick={() => chooseFloor(index)}
                    >
                        {buttonObj.name}
                    </button>
                ))}
                {showConfirmation && (
                    <ConfModal
                        title="Confirm or Cancel?"
                        message="Are you sure you want to perform this action?"
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