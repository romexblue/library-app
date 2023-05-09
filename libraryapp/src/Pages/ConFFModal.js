import mof from '../styles/ModalFF.module.css';
import React, { useState, useEffect, useRef } from "react";
import image1 from '../images/Confirm_Icon.png';

const ConFFModal = ({title, message, onConfirm, onCancel}) => {
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
      <div className={mof.modalContainer} onKeyDown={handleKeyDown}>
        <div className={mof.centerModal}>
        <div className={mof.modalHeader}><img alt="" src={image1}/>
            </div>
            <div className={mof.confirmMessage}>
              <p>Confirmation Message</p>
            </div>
        <div className={mof.messageModal}>
          <p>{message}</p>
        </div>
            <div className={mof.modalFooter}>
                <button className={mof.cancelBtn} ref={cancelButtonRef} onClick={handleCancel}>Cancel</button>
                <button className={mof.confirmBtn} ref={confirmButtonRef} onClick={handleConfirm}>Confirm</button>
            </div>
        </div>
      </div>
    )
  );
}

export default ConFFModal;
