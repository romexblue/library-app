import '../styles/Modal.css'
import React, { useState } from "react";
import axios from 'axios';

const StudentModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [schoolId, setSchoolId] = useState(data.max_capacity ?? 0);
    const [rfid, setRfid] = useState(data.status ?? "Open");
    const [type, setType] = useState(data.level ?? 0);
    const [dateOfExpiry, setDateOfExpiry] = useState(data.bldg ?? "Bldg1")
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, school_id: schoolId, rfid: rfid, type: type, date_of_expiry: dateOfExpiry };
            axios.patch(`http://localhost:5000/floor/${data.id}`, dataChanged, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass
                    } else {
                        updateUi();
                    }
                });
        }
        if (action === "Add") {
            const dataAdd = { name: name, school_id: schoolId, rfid: rfid, type: type, date_of_expiry: dateOfExpiry };
            axios.post("http://localhost:5000/floor/", dataAdd, {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        //pass 
                    } else {
                        updateUi();
                    }
                });
        }
        setName('');
        setMaxCapacity('');
        setStatus('Open');
        setShowModal(false);
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
                        <p>Max Capacity: <input type="number" value={maxCapacity} onChange={(event) => { setMaxCapacity(event.target.value) }} /></p>
                        <p>Level: <input type="number" value={level} onChange={(event) => { setLevel(event.target.value) }} /></p>
                        <p>Bldg No:
                            <select className="Bldg" value={bldg} onChange={(event) => setBldg(event.target.value)}>
                                <option value="Bldg1"> 1</option>
                                <option value="Bldg2"> 2</option>
                            </select>
                        </p>
                        <p>Status:
                            <select className="status" value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
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
