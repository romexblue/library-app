import aes from '../styles/ModalAES.module.css'
import React, { useState } from "react";
import axios from 'axios';

const StudentModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [schoolId, setSchoolId] = useState(data.school_id ?? "");
    const [type, setType] = useState(data.type ?? "Student");
    const [fName, setFName] = useState(data.first_name ?? "");
    const [lName, setLName] = useState(data.last_name ?? "");
    const [gender, setGender] = useState(data.gender ?? "");
    const [email, setEmail] = useState(data.email ?? "");
    const [college, setCollege] = useState(data.college ?? "");
    const [year, setYear] = useState(data.year ?? "");
    const [rfid, setRfid] = useState(data.rfid ?? "");
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { school_id: schoolId, type: type, first_name: fName, last_name: lName, gender: gender, email: email, college: college, year: year, rfid: rfid };
      
            axios.patch(`http://localhost:5000/student/${data.school_id}`, dataChanged, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass
                    } else {
                        updateUi(1);
                    }
                });
        }
        if (action === "Add") {
            const dataAdd = { school_id: schoolId, type: type, first_name: fName, last_name: lName, gender: gender, email: email, college: college, year: year, rfid: rfid };
            axios.post("http://localhost:5000/student/", dataAdd, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass 
                    } else {
                        updateUi(1);
                    }
                });
        }
        setSchoolId('');
        setType('');
        setFName('');
        setLName('');
        setGender('');
        setEmail('');
        setCollege('');
        setYear('');
        setRfid('');
        update();
    };

    const handleCancel = () => {
        cancel();
        setShowModal(false);
    };

    return (
        showModal && (
            <div className={aes.modal}>
                <div className={aes.modalContent}>
                    <div className={aes.modalHeader}>
                        <h3>{title}</h3>
                    </div>
                    <div className={aes.modalBody}>
                        <div className={aes.section1}>
                            <div className={aes.compo1}>
                            <p>School ID: </p>
                            <input type="text" value={schoolId} onChange={(event) => { setSchoolId(event.target.value) }} />
                            </div>
                            <div className={aes.compo2}>
                                <p>Type:</p>
                                <select className={aes.typeSelect} value={type} onChange={(event) => setType(event.target.value)}>
                                    <option value="FACULTY">Faculty</option>
                                    <option value="SHSFACULTY">SHS Faculty</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="SHSSTUDENT">SHS Student</option>
                                </select>
                            </div>
                        </div>
                            <div className={aes.section2}>
                                <div className={aes.compo3}>
                                    <p>First Name:</p> <input type="text" value={fName} onChange={(event) => { setFName(event.target.value) }} />
                                </div>
                                <div className={aes.compo4}>
                                    <p>Last Name:</p> <input type="text" value={lName} onChange={(event) => { setLName(event.target.value) }} />
                                </div>
                        </div>
                        <div className={aes.section3}>
                            <div className={aes.compo5}>
                            <p>Email:</p> <input type="text" value={email} onChange={(event) => { setEmail(event.target.value) }} />
                            </div>
                        </div>
                        <div className={aes.section4}>
                            <div className={aes.compo6}>
                            <p>Gender:</p>
                            <select className={aes.genderSelect} value={gender} onChange={(event) => setGender(event.target.value)}>
                                    <option value="M"> Male</option>
                                    <option value="F"> Female</option>
                                    <option value="U"> Undefined </option>
                            </select>
                            </div>
                            <div className={aes.compo7}>
                            <p>College:</p> 
                            <select className={aes.genderSelect} value={college} onChange={(event) => setCollege(event.target.value)}>
                                    <option value="SHS">SHS</option>
                                    <option value="CAS"> CAS</option>
                                    <option value="ENGG"> ENGG</option>
                                    <option value="SOE"> SOE </option>
                                    <option value="AGGIES">AGGIES</option>
                                    <option value="NURSING"> NURSING</option>
                                    <option value="CCS"> CCS </option>
                                    <option value="SBM"> SBM</option>
                                    <option value="LAW"> Law</option>
                                    <option value="GRAD"> Graduate </option>
                                    <option value="MED"> Medicine </option>
                            </select>
                            </div>
                            <div className={aes.compo8}>
                            <p>Year:</p> <input type="text" value={year} onChange={(event) => { setYear(event.target.value) }} />
                            </div>
                            </div>
                        <div className={aes.section5}>
                            <div className={aes.compo9}>
                            <p>RFID:</p> <input type="text" value={rfid} onChange={(event) => { setRfid(event.target.value) }} />
                            </div>
                        </div>
                    <div className={aes.modalFooter}>
                        <button className={aes.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={aes.confirmBtn} onClick={handleConfirm}>Confirm</button>

                    </div>
                    </div>
                </div>
            </div>
        )
    );
}

export default StudentModal;
