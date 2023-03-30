import React, { useState, useRef } from 'react';
import '../styles/ReservationUsers.css';
import axios from 'axios';

function ReservationUsers({ capacity }) {
  const [inputValues, setInputValues] = useState(Array(3).fill(''));
  const inputRefs = useRef(Array(3).fill(null));

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async (event, index) => {
    event.preventDefault();
    const studentId = inputValues[index];

    await axios.get(`http://localhost:5000/student/find/${studentId}`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then((response) => {
        if (response.data.error) {
          const newInputValues = [...inputValues];
          newInputValues[index] = "";
          setInputValues(newInputValues);
        } else {
          const studentData = response.data;
          if (studentData) {
            const newInputValues = [...inputValues];
            newInputValues[index] = studentData.school_id;

            const isDuplicate = inputValues.slice(0, index).includes(studentData.school_id);
            if (isDuplicate) {
              const newInputValues = [...inputValues];
              newInputValues[index] = '';
              setInputValues(newInputValues);
              return;
            };

            setInputValues(newInputValues);
            inputRefs.current[index].disabled = true;
            if (index < inputValues.length - 1) {
              inputRefs.current[index + 1].focus();
            }
          }
        }
      })
  };

  const handleAddInputField = () => {
    const newInputValues = [...inputValues, ''];
    setInputValues(newInputValues);
    inputRefs.current.push(null);
  };

  const inputFields = inputValues.map((inputValue, i) => {
    return (
      <form key={i} onSubmit={(event) => handleSubmit(event, i)}>
        <input
          type="text"
          value={inputValue}
          onChange={(event) => handleInputChange(event, i)}
          ref={(el) => inputRefs.current[i] = el}
        />
      </form>
    );
  });

  return (
    <div>
      <h2>Enter student IDs:</h2>
      <div className="container">{inputFields}</div>
      {inputValues.length < capacity &&
        <button onClick={handleAddInputField}>Add</button>
      }
    </div>
  );
}

export default ReservationUsers;
