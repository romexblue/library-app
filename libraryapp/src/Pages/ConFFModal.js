import cmod from '../styles/Modal.module.css';
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
      <div className={cmod.modalContainer} onKeyDown={handleKeyDown}>
        <div className={cmod.centerModal}>
        <div className={cmod.section1}><img alt="" src={image1}/>
            </div>
            <div className={cmod.section2}>{title}
            </div>
            <div className={cmod.section3}>
                {message}
            </div>
            <div className={cmod.section4}>
                <div className={cmod.secTitle}>
                    Confirm Reservation Details:
                </div>
                <div className={cmod.sectioning}>
                    <div className={cmod.divSection1}>
                        <div className={cmod.confabSelected}>
                            <label className={cmod.confLabel}>Space:</label>
                            <p className={cmod.confInfo}>{message.confab}</p>
                        </div>
                        <div className={cmod.timeInfo}>
                            <div className={cmod.startTime}>
                                <label className={cmod.timeLabel}>Start Time:</label>
                                <p className={cmod.timeStart}>{message.stime}</p>
                            </div>
                            <div className={cmod.endTime}>
                                <label className={cmod.timeLabel}>End Time:</label>
                                <p className={cmod.timeEnd}>{message.etime}</p>
                            </div>
                        </div>
                    </div>
                <div className={cmod.divSection2}>
                    <div className={cmod.usersList}>
                        <label className={cmod.confLabel}>Users:</label>
                        <textarea readonly className={cmod.users}>{message.users.join(',')}</textarea> 
                    </div>
                </div>
            </div>
            </div>
            <div className={cmod.confirmNote}>
                *You must check the box to agree to the guidelines in using XU Library spaces.
            </div>
            <div className={cmod.section5}>
                <button className={cmod.cancelBtn} ref={cancelButtonRef} onClick={handleCancel}>Cancel</button>
                <button className={cmod.confirmBtn} ref={confirmButtonRef} onClick={handleConfirm} disabled={!isChecked}>Confirm</button>
            </div>
        </div>
      </div>
    )
  );
}

export default ConFFModal;
