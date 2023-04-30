import '../styles/Modal.css'
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
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>{title}</h3>
                    </div>
                    <div className="modal-body">
                        <p>Name: <input type="text" value={name} onChange={(event) => { setName(event.target.value) }} /></p>
                        <p>Username: <input type="text" value={username} onChange={(event) => { setUserName(event.target.value) }} /></p>
                        <p>Type:
                            <select className="Type" value={type} onChange={(event) => setType(event.target.value)}>
                                <option value="Admin"> Admin</option>
                                <option value="Librarian"> Librarian</option>
                                <option value="Assistant"> Assistant</option>
                                <option value="Guard"> Guard </option>
                            </select>
                        </p>
                        <p>Password <input
                            type="text"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                        />
                        <button onClick={()=>generatePassword()}>Generate Random Password</button>
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

export default UserModal;
