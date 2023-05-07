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
            console.log(dataChanged)
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
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>{title}</h3>
                    </div>
                    <div className="modal-body">
                        <p>School ID: <input type="text" value={schoolId} onChange={(event) => { setSchoolId(event.target.value) }} /></p>
                        <p>Type:
                            <select className="Type" value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="STUDENT"> Student</option>
                                <option value="FACULTY"> Faculty</option>
                                <option value="STAFF"> Staff </option>
                            </select>
                        </p>
                        <p>First Name: <input type="text" value={fName} onChange={(event) => { setFName(event.target.value) }} /></p>
                        <p>Last Name: <input type="text" value={lName} onChange={(event) => { setLName(event.target.value) }} /></p>
                        <p>Gender:
                            <select className="Type" value={gender} onChange={(event) => setGender(event.target.value)}>
                                <option value="M"> Male</option>
                                <option value="F"> Female</option>
                                <option value="U"> Undefined </option>
                            </select>
                        </p>
                        <p>Email: <input type="text" value={email} onChange={(event) => { setEmail(event.target.value) }} /></p>
                        <p>College: <input type="text" value={college} onChange={(event) => { setCollege(event.target.value) }} /></p>
                        <p>Year: <input type="text" value={year} onChange={(event) => { setYear(event.target.value) }} /></p>
                        <p>RFID: <input type="text" value={rfid} onChange={(event) => { setRfid(event.target.value) }} /></p>
                    </div>
                    <div className="modal-footer">
                        <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                        <button className="confirm-btn" onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default StudentModal;
