import aec from '../styles/ModalAEC.module.css'
import React, { useState } from "react";
import axios from 'axios';

const ConfabModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [description, setDescription] = useState(data.description ?? "");
    const [maxCapacity, setMaxCapacity] = useState(data.max_capacity ?? 0);
    const [status, setStatus] = useState(data.status ?? "Open");
    const [level, setLevel] = useState(data.level ?? 0);
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, max_capacity: maxCapacity, level: level, description: description, status: status };
            axios.patch(`http://localhost:5000/confab/${data.id}`, dataChanged, {
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
            const dataAdd = { name: name, max_capacity: maxCapacity, level: level, description: description, status: status };
            axios.post("http://localhost:5000/confab/", dataAdd, {
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
            <div className={aec.confModal}>
                <div className={aec.modalContent}>
                    <div className={aec.modalHeader}>
                        <p className={aec.modalTitle}>{title}</p>
                        <div className={aec.modalClose} onClick={handleCancel}>x</div>
                    </div>
                    <div className={aec.modalBody}>
                        <p className={aec.nameSection} >
                        <label className={aec.nameLabel}>Name:</label> 
                        <input className={aec.nameInput} type="text" value={name} onChange={(event) => { setName(event.target.value) }} /></p>
                        <p className={aec.maxCapSection} >
                            <label className={aec.maxLabel} >Max Capacity:</label> 
                            <input className={aec.maxInput} type="number" value={maxCapacity} onChange={(event) => { setMaxCapacity(event.target.value) }} /></p>
                        <p className={aec.levelSection} >
                            <label className={aec.levelLabel}>Level:</label>
                            <input className={aec.levelInput} type="number" value={level} onChange={(event) => { setLevel(event.target.value) }} /></p>
                        <p className={aec.descSection} >
                            <label className={aec.descLabel}>Description:</label>
                            <textarea className={aec.descInput} placeholder='Write the description of the space' type="text" value={description} onChange={(event) => { setDescription(event.target.value) }} /></p>
                        <p className={aec.statusSection} >Status:
                            <select className={aec.status} value={status} onChange={(event) => setStatus(event.target.value)}>
                                <option value="Open">Open</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </p>
                    </div>
                    <div className={aec.modalFooter}>
                        <button className={aec.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={aec.confirmBtn} onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default ConfabModal;
