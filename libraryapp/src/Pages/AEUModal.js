import aeu from '../styles/ModalAEU.module.css'
import React, { useState } from "react";
import axios from 'axios';

const UserModal = ({ title, data, update, cancel, updateUi, action }) => {
    const [name, setName] = useState(data.name ?? "");
    const [username, setUserName] = useState(data.username ?? "");
    const [type, setType] = useState(data.type ?? "Librarian");
    const [password, setPassword] = useState(data.password ?? "")
    const [showModal, setShowModal] = useState(true);

    const handleConfirm = () => {
        if (action === "Edit") {
            const dataChanged = { name: name, username: username, type: type, password: password };
            axios.patch(`http://localhost:5000/auth/${data.id}`, dataChanged, {
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
            const dataAdd = { name: name, username: username, type: type, password: password };
            axios.post("http://localhost:5000/auth", dataAdd, {
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
        setUserName('');
        setType('');
        setPassword('');
        update();
    };

    const handleCancel = () => {
        cancel();
        setShowModal(false);
    };

    function generatePassword() {
        const length = 12;
        let pswd = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            pswd += characters[randomIndex];
        }

        setPassword(pswd);
    }

    return (
        showModal && (
            <div className={aeu.modal}>
                <div className={aeu.modalContent}>
                    <div className={aeu.modalHeader}>
                        <h3>{title}</h3>
                    </div>
                    <div className={aeu.modalBody}>
                        <div className={aeu.section1}>
                            <p className={aeu.secLabel1}>Name:</p>
                            <input className={aeu.secInput1} type="text" value={name} onChange={(event) => { setName(event.target.value) }} />
                        </div>
                        <div className={aeu.section2}>
                            <p className={aeu.secLabel2}>Username:</p> 
                            <input className={aeu.secInput2}type="text" value={username} onChange={(event) => { setUserName(event.target.value) }} />
                        </div>
                        <div className={aeu.section3}>
                            <p className={aeu.secLabel3}>Type:</p>
                            <select className={aeu.secType3} value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="Admin"> Admin</option>
                                <option value="Librarian"> Librarian</option>
                                <option value="Assistant"> Assistant</option>
                                <option value="Guard"> Guard </option>
                            </select>
                        </div>
                        <div className={aeu.section4}>
                            <p className={aeu.secLabel4}>Password </p>
                            <div className={aeu.passMaker}>
                                <input className={aeu.secInput4}
                                    type="text"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                                <button className={aeu.passGenerate} onClick={()=>generatePassword()}>Generate Password</button>
                            </div>
                        </div>
                    </div>
                    <div className={aeu.modalFooter}>
                        <button className={aeu.cancelBtn} onClick={handleCancel}>Cancel</button>
                        <button className={aeu.confirmBtn} onClick={handleConfirm}>Confirm</button>
                    </div>
                </div>
            </div>
        )
    );
}

export default UserModal;
