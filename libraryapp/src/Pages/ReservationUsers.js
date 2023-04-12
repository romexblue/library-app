import React, { useState, useRef, useEffect } from 'react';
import '../styles/ReservationUsers.css';
import axios from 'axios';

function ReservationUsers({ capacity, updateData }) {
  const [inputValues, setInputValues] = useState(Array(capacity).fill(''));
  const inputRefs = useRef(Array(capacity).fill(null));

  useEffect(() => {
    // Update the reservation data
    const newListData = inputValues.filter((value) => value !== '');
    updateData(newListData);
  }, [inputValues, updateData]);

  // useEffect(() => {
  //   setInputValues(Array(capacity).fill(''));

  // }, [capacity]);

  // useEffect(() => {
  //   if (inputRefs.current.length > 0) {
  //     const firstInputRef = inputRefs.current[0];
  //     if (firstInputRef) {
  //       firstInputRef.disabled = false;
  //       firstInputRef.setAttribute("placeholder", "Scan Your ID or input School ID");
  //     }
  //     for (let i = 1; i < capacity; i++) {
  //       const inputRef = inputRefs.current[i];
  //       if (inputRef) {
  //         inputRef.disabled = true;
  //         inputRef.setAttribute("placeholder", "");
  //       }
  //     }
  //   }
  // }, [capacity]);

  const handleInputChange = (event, index) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = event.target.value;
    setInputValues(newInputValues);
  };

  const handleSubmit = async (event, index) => {
    event.preventDefault();
    const studentId = inputValues[index];

    // Send a request to look up the student's information
    await axios.get(`http://localhost:5000/student/find/${studentId}`, {
      headers: {
        accessToken: sessionStorage.getItem("accessToken"),
        userId: sessionStorage.getItem("id")
      },
    })
      .then((response) => {
        if (response.data.error) {
          // If the student ID is not valid, clear the input value
          const newInputValues = [...inputValues];
          newInputValues[index] = "";
          setInputValues(newInputValues);
        } else {
          const studentData = response.data;
          if (studentData) {
            const newInputValues = [...inputValues];
            newInputValues[index] = studentData.school_id;

            // Check for duplicate school IDs
            const isDuplicate = newInputValues.filter((value, i) => i !== index && value !== '').includes(studentData.school_id);
            if (isDuplicate) {
              const newInputValues = [...inputValues];
              newInputValues[index] = '';
              setInputValues(newInputValues);
              return;
            };

            setInputValues(newInputValues);

            // Disable the current input field
            inputRefs.current[index].disabled = true;

            // Find the next available input field that is disabled and has no value
            const nextIndex = newInputValues.findIndex((value, i) => i > index && value === '');
            if (nextIndex >= 0) {
              inputRefs.current[nextIndex].disabled = false;
              inputRefs.current[nextIndex].setAttribute("placeholder", "Scan Your ID or input School ID");
              inputRefs.current[nextIndex].focus();
            }

          }
        }
      })
  };

  const inputFields = [];
  for (let i = 0; i < capacity; i++) {
    inputFields.push(
      <form className='Inputs' key={i} onSubmit={(event) => handleSubmit(event, i)}>
        <input
          type="text"
          value={inputValues[i] ?? ""}
          onChange={(event) => handleInputChange(event, i)}
          ref={(el) => inputRefs.current[i] = el}
          disabled={i > 0 ? true : false}
          placeholder={i === 0 ? "Scan Your ID or input School ID" : ""}
          data-index={i} //for the css 
        />
        <button type="button"
          disabled={!inputValues[i]}
          onClick={() => {
            inputRefs.current[i].disabled = false;
            inputRefs.current[i].value = '';
            const updatedInputValues = [...inputValues];
            updatedInputValues[i] = "";
            setInputValues(updatedInputValues);
          }}>
          X
        </button>
      </form>
    );
  };

  return (
    <div>
      <div className="container">
        {inputFields}
      </div>
    </div>
  );
}

export default ReservationUsers;
