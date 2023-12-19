// Modal.js
import React from "react";
import styles from "./modal.module.css";

const Modal = ({ isOpen, onClose, children }) => {
    return (
        <>
            {isOpen && (
                <div className={styles.overlay} onClick={onClose}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            className={styles.closeButton}
                            onClick={onClose}
                        >
                            Close
                        </button>
                        {children}
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;
