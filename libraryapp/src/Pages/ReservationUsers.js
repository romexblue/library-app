import React, { useState, useRef, useEffect } from 'react';
import '../styles/ReservationUsers.css';
import axios from 'axios';
import image1 from '../images/Reminder_Icon.png';

function ReservationUsers({ capacity, updateData, cancel }) {
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
    <div className="rsmaindiv">
    <div className="rscenterdiv">
        <div className="rsleft-panel">
            <div className="section" id="rssec1">
                <p>RESERVATION DATE</p>
            </div>
            <div className="section" id="rssec2">
                <p>April 10, 2023</p>
            </div>
            <div className="section" id="rssec3">
                <p>Room Assignment</p>
            </div>
            <div className="section" id="rssec4">
                <div className="rspartition" id="part1">
                    <div className="comp" id="rscomp1">
                        Confab Room
                    </div>
                    <div className="comp" id="rscomp2">
                        <input type="text" className="conf"  required/>
                    </div>
                </div>
                <div className="rspartition" id="part2">
                    <div className="comp" id="rscomp3">
                        From
                    </div>
                    <div className="comp" id="rscomp4">
                        <input type="text" className="from" required/>
                    </div>
                </div>
                <div className="rspartition" id="part3">
                    <div className="comp" id="rscomp5">
                        Until
                    </div>
                    <div className="comp" id="rscomp6">
                        <input type="text" className="until" required/>
                    </div>
                </div>
            </div>
            <div className="section" id="rssec5">

            </div>
            <div className="section" id="rssec6">
                Group Representative
            </div>
            <div className="section" id="rssec7">
                <div className="partition" id="part4">
                    <div className="comp" id="rscomp7">
                        Id Number ( Tap your XU ID )
                    </div>
                    <div className="comp" id="rscomp8">
                        <input type="text" className="idnumber" id="idnum" required placeholder="XU ID Number"/>
                    </div>
                </div>
                <div className="partition" id="part5">
                    <div className="comp" id="rscomp9">
                        <img className="info_icon" src={image1} alt="note"/>
                    </div>
                    <div className="comp" id="rscomp10">
                        <button className="scanid" >SCAN</button>
                    </div>
                </div>
            </div>
            <div className="section" id="rssec8">
                <div className="partition" id="part6">
                    <div className="comp" id="rscomp11">
                        Name
                    </div>
                    <div className="comp" id="rscomp12">
                        <input type="text" className="name" required/>
                    </div>
                </div>
            </div>
            <div className="section" id="rssec9">
                <div className="partition" id="part7">
                    <div className="comp" id="rscomp13">
                        Course
                    </div>
                    <div className="comp" id="rscomp14">
                        <input type="text" className="course" required/>
                    </div>
                </div>
                <div className="partition" id="part8">
                    <div className="comp" id="rscomp15">
                        Year
                    </div>
                    <div className="comp" id="rscomp16">
                        <input type="text" className="year" required/>
                    </div>
                </div>
                <div className="partition" id="part9">
                    <div className="comp" id="rscomp17">
                        Contact No.
                    </div>
                    <div className="comp" id="rscomp18">
                        <input type="text" className="contact" id="contactno" placeholder="+63912345678" required/>
                    </div>
                </div>
            </div>
            <div className="section" id="rssec10">

            </div>
            <div className="section" id="rssec10_1">
                Usage
            </div>
            <div className="section" id="rssec11">
                <div className="comp" id="rscomp19">
                    <div className="component" id='compo1'>
                        <div className='label' id='plabel'>
                            Purpose
                        </div>
                        <div className='purpose' id='pinput'>
                            <textarea className='purposebox' placeholder='Write the purpose of using the library space.'></textarea>
                        </div>
                    </div>
                    <div className="component" id="compo2">
                        <div className="label" id='dlabel'>
                            Pax
                        </div>
                        <div className="drop-down">                          
                            <select className="dropdown2" list="browsers" name="browser" placeholder="3" id="browsers" >
                            <option >No. of users...</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                            </select>                          
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="divider">

        </div>
        <div className="rsright-panel">
            <div className="section" id="rssec12">
                Confab Users
            </div>
            <div className='section' id="rssec13">
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 2
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 3
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 4
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 5
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 6
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 7
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 8
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>
                <div className='inputcontainer' id='inputbox'>
                    <label className='inputlabel'>
                        User 9
                    </label>
                    <input className='userinput'>

                    </input>
                    <label className='inputmessage'>
                        Invalid ID Number
                    </label>
                </div>

            </div>
            <div className='section' id='rssec14'>
                <div className="inputnotes">
                    <p>You may select a field and tap your ID on the ID reader to add user. Alternately, you 
                    may manually type the user’s school ID number.</p>
                </div>
            </div>
            <div className="section" id="rssec15">
                <div className="btn-holder" id="holder1">
                    <button className="cancelbtn" onClick={()=>cancel()} >Cancel</button>
                    <button className="submitbtn">Submit</button>
                </div>
            </div>
        </div>
    </div>
</div>
  );
}

export default ReservationUsers;
