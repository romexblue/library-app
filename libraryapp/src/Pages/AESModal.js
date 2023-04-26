import '../styles/Modal.css'
import React, { useState } from "react";
import axios from 'axios';

const StudentModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [schoolId, setSchoolId] = useState(data.school_id ?? "");
    const [rfid, setRfid] = useState(data.rfid ?? "");
    const [type, setType] = useState(data.type ?? "Student");
    const [dateOfExpiry, setDateOfExpiry] = useState(data.date_of_expiry ?? "2022-01-14")
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, school_id: schoolId, rfid: rfid, type: type, date_of_expiry: dateOfExpiry };
            axios.patch(`http://localhost:5000/student/${data.id}`, dataChanged, {
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
            const dataAdd = { name: name, school_id: schoolId, rfid: rfid, type: type, date_of_expiry: dateOfExpiry };
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
        setName('');
        setSchoolId('');
        setRfid('');
        setType('');
        setDateOfExpiry('');
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
                        <p>Name: <input type="text" value={name} onChange={(event) => { setName(event.target.value) }} /></p>
                        <p>School ID: <input type="text" value={schoolId} onChange={(event) => { setSchoolId(event.target.value) }} /></p>
                        <p>RFID: <input type="text" value={rfid} onChange={(event) => { setRfid(event.target.value) }} /></p>
                        <p>Type:
                            <select className="Type" value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="Student"> Student</option>
                                <option value="Faculty"> Faculty</option>
                                <option value="Staff"> Staff </option>
                            </select>
                        </p>
                        <p>Date of Expiriy <input
                            type="date"
                            value={dateOfExpiry}
                            onChange={(event) => setDateOfExpiry(event.target.value)}
                            pattern="\d{4}-\d{2}-\d{2}"
                            required
                        />
                        </p>
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
