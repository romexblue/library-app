import React, { useState, useRef } from 'react';
import '../styles/ReservationUsers.css';
import axios from 'axios';

function ReservationUsers({ confab, timeData, updateData, childData, cancel, confirm }) {
    const [counter, setCounter] = useState(0);
    const [inputValues, setInputValues] = useState(Array(confab.capacity).fill(''));
    const inputRefs = useRef(Array(confab.capacity).fill(null));
    const [reason, setReason] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [rep, setRep] = useState("");
    const [studentData, setStudentData] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const repInputRef = useRef(null);

    // useEffect(() => {
    //     // Update the reservation data
    //     const newListData = inputValues.filter((value) => value !== '');
    //     console.log("yawa")
    //     updateData(newListData);
    // }, [inputValues, updateData]);

    // useEffect(() => {
    //   setInputValues(Array(capacity).fill(''));

    // }, [capacity]);

    // useEffect(() => {
    //   if (inputRefs.current.length > 0) {
    //     const firstInputRef = inputRefs.current[0];
    //     if (firstInputRef) {
    //       firstInputRef.disabled = false;
    //       firstInputRef.setAttribute("placeholder", "Scan Your ID or input School ID");
    //     }
    //     for (let i = 1; i < capacity; i++) {
    //       const inputRef = inputRefs.current[i];
    //       if (inputRef) {
    //         inputRef.disabled = true;
    //         inputRef.setAttribute("placeholder", "");
    //       }
    //     }
    //   }
    // }, [capacity]);

    const handleConfirm = () => {
        const newListData = inputValues.filter((value) => value !== '');
     
        const regex = /^09\d{9}$/;
        if (rep === "" || inputValues.length === 0 || reason === "" || newListData.length < counter - 1) {
            setErrorMessage("Please fill in all required fields with (*)")
        }
        else if (!regex.test(phoneNumber)) {
            setErrorMessage("Invalid Phone Number")
        } else {
            setErrorMessage("")
            confirm();
        }
    }

    const reasonChange = (event) => {
        setErrorMessage("")
        setReason(event.target.value);
        childData({ reason: event.target.value, phone: phoneNumber })
    }

    const submitRep = async (event) => {
        event.preventDefault();
        const response = await findStudent(rep);

        if (!response.data) {
            setRep('');
            setStudentData({});
        } else {
            if (inputValues.includes(response.data.school_id)) {
                setRep('');
                setStudentData({});
            } else {
                setRep(response.data.school_id);
                setStudentData(response.data);
                updateData([rep, ...inputValues])
                repInputRef.current.disabled = true;
            }
        }
    }

    const handlePhoneNumberChange = (event) => {
        setErrorMessage("")
        const inputValue = event.target.value;
        const phoneNumberRegex = /^0/;
        if (inputValue === '' || (phoneNumberRegex.test(inputValue) && inputValue.length < 12)) {
            setPhoneNumber(inputValue);
        }
        childData({ reason: reason, phone: inputValue })
    };

    const handleInputChange = (event, index) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = event.target.value;
        setInputValues(newInputValues);
    };

    const handleSubmit = async (event, index) => {
        event.preventDefault();
        const studentId = inputValues[index];

        // Send a request to look up the student's information
        const response = await findStudent(studentId);

        if (!response.data) {
            // If the student ID is not valid, clear the input value
            const newInputValues = [...inputValues];
            newInputValues[index] = "";
            setInputValues(newInputValues);
        } else {
            const studentData = response.data;
            if (studentData) {
                const newInputValues = [...inputValues];
                newInputValues[index] = studentData.school_id;

                // Check for duplicate school IDs
                const isDuplicate = [...newInputValues, rep].filter((value, i) => i !== index && value !== '').includes(studentData.school_id);
                if (isDuplicate) {
                    const newInputValues = [...inputValues];
                    newInputValues[index] = '';
                    setInputValues(newInputValues);
                    return;
                };

                updateData([rep, ...newInputValues]);
                setInputValues(newInputValues);

                // Disable the current input field
                inputRefs.current[index].disabled = true;

                // Find the next available input field that is disabled and has no value
                const nextIndex = newInputValues.findIndex((value, i) => i > index && value === '');
                if (nextIndex >= 0 && inputRefs.current[nextIndex]) {
                    inputRefs.current[nextIndex].disabled = false;
                    inputRefs.current[nextIndex].setAttribute("placeholder", "Scan Your ID or input School ID");
                    inputRefs.current[nextIndex].focus();
                }

            }
        }

    };

    const findStudent = async (id) => {
        const response = await axios.get(`http://localhost:5000/student/find-one/${id}`, {
            headers: {
                accessToken: sessionStorage.getItem("accessToken"),
                userId: sessionStorage.getItem("id")
            },
        })
        return response;
    }

    const handleSelectChange = (event) => {
        setCounter(event.target.value);
        const newValues = [...inputValues];
        newValues.length = event.target.value;
        setInputValues(newValues);
        updateData([rep, ...newValues]);
    };

    //data from reservationusers to parent component

    const inputFields = [];
    for (let i = 0; i < counter - 1; i++) {

        inputFields.push(
            <form className='inputcontainer' id='inputbox' key={i} onSubmit={(event) => handleSubmit(event, i)}>
                <label className='inputlabel'>
                    User {i + 2} *
                </label>
                <div className='inputCase'>
                    <input
                        className='userinput'
                        type="text"
                        value={inputValues[i] ?? ""}
                        onChange={(event) => handleInputChange(event, i)}
                        ref={(el) => inputRefs.current[i] = el}

                        placeholder={i === 0 ? "Tap Your ID or input School ID" : ""}
                        data-index={i} //for the css 
                    />
                    <button className='deleteInput' type="button"
                        disabled={!inputValues[i]}
                        onClick={() => {
                            inputRefs.current[i].disabled = false;
                            inputRefs.current[i].value = '';
                            const updatedInputValues = [...inputValues];
                            updatedInputValues[i] = "";
                            setInputValues(updatedInputValues);
                            updateData([rep, ...updatedInputValues]);
                        }}>
                        x
                    </button>
                </div>
            </form>
        );
    };

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });
    };

    return (
        <div className="rsmaindiv">
            <div className="rscenterdiv">
                <div className="rsleft-panel">
                    <div className="section" id="rssec1">
                        <p>RESERVATION DATE</p>
                    </div>
                    <div className="section" id="rssec2">
                        <p>{formatDate(timeData.date)}</p>
                    </div>
                    <div className="section" id="rssec3">
                        <p>Room Assignment</p>
                    </div>
                    <div className="section" id="rssec4">
                        <div className="rspartition" id="part1">
                            <div className="comp" id="rscomp1">
                                Confab Room
                            </div>
                            <div className="comp" id="rscomp2">
                                <p className="conf">{confab.name}</p>
                            </div>
                        </div>
                        <div className="rspartition" id="part2">
                            <div className="comp" id="rscomp3">
                                From
                            </div>
                            <div className="comp" id="rscomp4">
                                <p className="from">{timeData.timeIn}</p>
                            </div>
                        </div>
                        <div className="rspartition" id="part3">
                            <div className="comp" id="rscomp5">
                                Until
                            </div>
                            <div className="comp" id="rscomp6">
                                <p className="until">{timeData.timeOut}</p>
                            </div>
                        </div>
                    </div>
                    <div className="section" id="rssec5">

                    </div>
                    <div className="section" id="rssec6">
                        Group Representative
                    </div>
                    <div className="section" id="rssec7">
                        <div className="partition" id="part4">
                            <div className="comp" id="rscomp7">
                                Id Number ( Tap your XU ID ) *
                            </div>
                            <div className='comp' id='rscomp8'>
                                <form onSubmit={(event) => submitRep(event)} className="inputHold">
                                    <input
                                        value={rep}
                                        onChange={(event) => setRep(event.target.value)}
                                        ref={repInputRef} type="text"
                                        className="idnumber" id="idnum" placeholder="XU ID Number" />
                                </form>
                                <button className='buttonx' onClick={() => { setRep(''); repInputRef.current.disabled = false; setStudentData({}); }}>X</button>
                            </div>
                        </div>
                        <div className="partition" id="part5">
                            <div className="comp" id="rscomp9">
                                <p className='noteReminder'>Click the Field and tap your ID on the reader. You may also type your ID number and press "Enter".</p>
                            </div>
                        </div>
                    </div>
                    <div className="section" id="rssec8">
                        <div className="partition" id="part6">
                            <div className="comp" id="rscomp11">
                                Name
                            </div>
                            <div className="comp" id="rscomp12">
                                <div className="name">{studentData.last_name} {studentData.first_name} </div>
                            </div>
                        </div>
                    </div>
                    <div className="section" id="rssec9">
                        <div className="partition" id="part7">
                            <div className="comp" id="rscomp13">
                                Course
                            </div>
                            <div className="comp" id="rscomp14">
                                <div className="course">{studentData.college}</div>
                            </div>
                        </div>
                        <div className="partition" id="part8">
                            <div className="comp" id="rscomp15">
                                Year
                            </div>
                            <div className="comp" id="rscomp16">
                                <div className="year">{studentData.year ? studentData.year.match(/\d+/)?.[0] || '' : ''}</div>
                            </div>
                        </div>
                        <div className="partition" id="part9">
                            <div className="comp" id="rscomp17">
                                Contact No.*
                            </div>
                            <div className="comp" id="rscomp18">
                                <input value={phoneNumber} onChange={(event) => handlePhoneNumberChange(event)} type="text" className="contact" id="contactno" placeholder="09XX XXX XXXX" />
                            </div>
                        </div>
                    </div>
                    <div className="section" id="rssec10">

                    </div>
                    <div className="section" id="rssec10_1">
                        Usage
                    </div>
                    <div className="section" id="rssec11">
                        <div className="comp" id="rscomp19">
                            <div className="component" id='compo1'>
                                <div className='label' id='plabel'>
                                    Purpose *
                                </div>
                                <div className='purpose' id='pinput'>
                                    <textarea value={reason} onChange={(event) => reasonChange(event)} className='purposebox' placeholder='Write the purpose of using the library space.' />
                                </div>
                            </div>
                            <div className="component" id="compo2">
                                <div className="label" id='dlabel'>
                                    Pax *
                                </div>
                                <div className="drop-down">
                                    <select className="dropdown2" list="browsers" name="browser" placeholder="3" id="browsers" onChange={handleSelectChange}>
                                        <option value={0}>No. of users...</option>
                                        {Array.from({ length: confab.capacity - 2 }, (_, i) => (
                                            <option key={i} value={i + 3}>{i + 3}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="divider">

                </div>
                <div className="rsright-panel">
                    <div className="section" id="rssec12">
                        Confab Users *
                    </div>
                    <div className='section' id="rssec13">
                        {inputFields}
                    </div>
                    <div className='section' id='rssec14'>
                        <div className="inputnotes">
                            <p>Select a field and tap your ID on the Card Reader to add user. Alternately, you
                                may manually type the user’s school ID number and Press "Enter".</p>
                        </div>
                        <div className="btn-holder" id="btnHolder1">
                            <div className='buttonContainer'>
                                <div className="upperSection">
                                    <p>{errorMessage}</p>
                                </div>
                                <div className="lowerSection">
                                    <button className="cancelbtn" onClick={() => cancel()} >Cancel</button>
                                    <button className="submitbtn" onClick={() => handleConfirm()}>Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ReservationUsers;
