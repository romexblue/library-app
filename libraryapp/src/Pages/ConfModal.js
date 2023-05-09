import '../styles/Modal.css'
import React, { useState, useEffect, useRef } from "react";
import image1 from '../images/Confirm_Icon.png';

const ConfModal = ({title, message, onConfirm, onCancel}) => {
  const [showModal, setShowModal] = useState(true);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    setShowModal(false);
    onConfirm();
  };

  const handleCancel = () => {
    setShowModal(false);
    onCancel();
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
      cancelButtonRef.current.focus();
    } else if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
      confirmButtonRef.current.focus();
    }
  };

  useEffect(() => {
    confirmButtonRef.current.focus();
  }, []);

  return (
    showModal && (
      <div className="modal" onKeyDown={handleKeyDown}>
        <div className="modal-content">
          <div className="modal-header">
              <img src={image1}/>
            <h3>{title}</h3>
          </div>
          <div className="modal-body">
            <p>SCROLLABLE TERMS AND CONDITION HERE</p>
            <p>CHECKBOX:  BOTTOM PART OF TERMS AND CONDITION</p>
            <input
          className="checkbox"
          type="checkbox"
          checked={isChecked}
          onChange={() => setIsChecked(!isChecked)}
          />
            <p>{message.confab}</p>
            <p>{message.stime}</p>
            <p>{message.etime}</p>
            <p>{message.users}</p>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" ref={cancelButtonRef} onClick={handleCancel}>Cancel</button>
            <button className="confirm-btn" ref={confirmButtonRef} onClick={handleConfirm} disabled={!isChecked} >Confirm</button>
          </div>
        </div>
      </div>
    )
  );
}

export default ConfModal;
