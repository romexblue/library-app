import cmod from '../styles/Modal.module.css';
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
      <div className={cmod.modalContainer} onKeyDown={handleKeyDown}>
        <div className={cmod.centerModal}>
        <div className={cmod.section1}><img alt="" src={image1}/>
            </div>
            <div className={cmod.section2}>{title}
            </div>
            <div className={cmod.section3}>
                <div className={cmod.textArea}>
                <h3>Guidelines on the use of XU Library Spaces</h3>
                <p>1. Libray Spaces are available for us by all bona fide students. Health protocols and controlled seat 
                    capacity on each floor are strictly implemented by the whole library personnel.</p>
                <p>2. Library Spaces are on a first-come, first-served basis. Online reservations will not be 
                    entertained as of yet but you may notify any Librarian at the Circulation Counter if 
                    you want to avail next.</p>
                <p>3. Library Spaces may be used for a maximum of 2 hours only. Extension of use may be considered 
                    subject to room availability.</p>
                <p>4. Users should refrain from loud noise or disruptive behavior when using these spaces. 
                    Please be respectful and considerate of other library users.</p>
                <p>5. Eating, smoking, playing games/musical instruments, and gambling are strictly 
                    prohibited.</p>
                <p>6. Please do not leave your personal belongings unattended. The Library is not 
                    responsible for any loss or damage.</p>
                <p>7. Users are responsible for library property, materials, equipment, and furnishings 
                    during the period of use. In case of damage due to negligence, the users will 
                    replace/pay for the damaged property.</p>
                <p>8. After usage, kindly arrange the chairs and clean the area before you leave.</p>
                <p>9. The library retains the right to monitor all activities conducted on the premises to 
                    ensure compliance with library regulations. Library staff must have free access to 
                    the Confab Space at all times.</p>
                    <div className={cmod.agreeButton}>
                        <input
                          className="checkbox"
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => setIsChecked(!isChecked)}
                        />
                        <p>I agree to the guidelines of using XU library space.</p>
                    </div>
                </div>
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

export default ConfModal;
