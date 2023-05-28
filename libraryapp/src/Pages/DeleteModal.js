import mof from '../styles/deleteModal.module.css';
import React, { useState, useEffect, useRef } from "react";
import image1 from '../images/Delete_Icon2.png';

const DeleteModal = ({title, message, onConfirm, onCancel}) => {
  const [showModal, setShowModal] = useState(true);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

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
      <div className={mof.modalContainer} onKeyDown={handleKeyDown}>
        <div className={mof.centerModal}>
          <div className={mof.section1}>
                <img src={image1} alt=''/>
            </div>
          <div className={mof.section2}>
            <h2>Are you sure?</h2>
            </div>
        <div className={mof.section3}>
        <p className={mof.toDeleteMessage}>Do you really want to {title} <b>{message}</b>? <br/>This process cannot be undone.</p>
        </div>
            <div className={mof.section4}>
            <div className={mof.comp1}>
                    <button className={mof.cancelButton} ref={cancelButtonRef} onClick={handleCancel}>Cancel</button>
                </div>
                <div className={mof.comp2}>
                    <button className={mof.confirmButton} ref={confirmButtonRef} onClick={handleConfirm}>Yes,Delete</button>
                </div>
            </div>
        </div>
      </div>
    )
  );
}

export default DeleteModal;
