import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from "react-router-dom";
import AuthContext from '../helpers/AuthContext';
import axios from 'axios';

const Exit = () => {
    const [value, setValue] = useState("");
    const navigate = useNavigate();
    const authContext = useContext(AuthContext);

    useEffect(() => {
        //for page refresh
        if (sessionStorage.getItem("accessToken") && sessionStorage.getItem("id") && !authContext.isLoggedIn) {
            axios.get("http://localhost:5000/auth/allow", {
                headers: {
                    accessToken: sessionStorage.getItem("accessToken"),
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
        }

    }, [navigate, authContext])

    function handleChange(event) {
        setValue(event.target.value);
    }

    function handleClick() {
        const studentID = value;
        const today = new Date();
        const formattedTime = today.toLocaleTimeString('en-US', { hour12: false });
        const data = {time_out:formattedTime}
        try {
            if (studentID.trim() !== '') { //handle blank space when deleting all
                const encodedValue = encodeURIComponent(studentID.trim()); //handle special chars to prevent error
                axios.put(`http://localhost:5000/record/find/${encodedValue}`, data, {
                    headers: {
                        accessToken: sessionStorage.getItem("accessToken"),
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
            <label htmlFor="textInput">Enter School ID:</label>
            <input
                type="number"
                value={value}
                onChange={handleChange}
            />
            <br></br>
            <button onClick={handleClick}>Time Out</button>
        </div>
    );
}

export default Exit