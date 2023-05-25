import mof from '../styles/ModalFF.module.css';
import React, { useState, useEffect, useRef } from "react";
import image1 from '../images/Confirm_Icon.png';

const ConRModal = ({title, message, onConfirm}) => {
  const [showModal, setShowModal] = useState(true);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  const handleConfirm = () => {
    setShowModal(false);
    onConfirm();
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
              <p>{title}</p>
            </div>
        <div className={mof.messageModal}>
          <p>{message}</p>
          <p>{title==="Success!" ? "Please take note of the Reservation ID for smoother transaction" : ""}</p>
        </div>
            <div className={mof.modalFooter}>
                <button className={mof.confirmBtn} ref={confirmButtonRef} onClick={handleConfirm}>Ok</button>
            </div>
        </div>
      </div>
    )
  );
}

export default ConRModal;
