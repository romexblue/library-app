import '../styles/Modal.css'
import React, { useState } from "react";
import axios from 'axios';

const ConfModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [maxCapacity, setMaxCapacity] = useState(data.max_capacity ?? 0);
    const [status, setStatus] = useState(data.status ?? "Open");
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, max_capacity: maxCapacity, status: status };
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
            const dataAdd = { name: name, current_count: 0, max_capacity: maxCapacity, status: status };
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

export default ConfModal;
