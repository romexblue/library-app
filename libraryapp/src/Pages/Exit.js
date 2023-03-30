import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import axios from 'axios';

const Exit = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);
    const inputRef = useRef(null);

    useEffect(() => {
        //for page refresh
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
            axios.get("http://localhost:5000/auth/allow", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
                    userId: sessionStorage.getItem("id")
                },
            })
                .then((response) => {
                    if (response.data.error) {
                        authContext.logout()
                        navigate('/')
                    } else {
                        authContext.login(sessionStorage.getItem("id"), sessionStorage.getItem("accessToken"))
                        navigate('/exit')
                    }
                })
        }

        if (!authContext.isLoggedIn) {
            navigate('/')
        };

        const interval = setInterval(() => {
            checkFocus();
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate, authContext])

    function checkFocus() {
        if (document.activeElement === document.body) {
            inputRef.current.focus();
        }   
    }

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleSubmit(event){
        event.preventDefault();
        const studentID = value;
        const today = new Date();
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        const data = {time_out:formattedTime}
        try {
            if (studentID.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(studentID.trim()); //handle special chars to prevent error
                axios.patch(`http://localhost:5000/record/find/${encodedValue}`, data, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
                        userId: sessionStorage.getItem("id")
                    },
                })
                    .then((response) => {
                        if (response.data.error) {
                            console.log(response.data);
                            setValue('');
                        } else {
                            console.log(response.data);
                            setValue('');
                        }
                    })
            } else {
                setValue('')
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
            <label htmlFor="textInput">Scan School ID:</label>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                ref={inputRef}
            />
            </form>
        </div>
    );
}

export default Exit