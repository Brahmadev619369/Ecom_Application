import React from 'react'
import { Link } from 'react-router-dom'
import "./confirm.css"

function ConfirmMessage({ message, onConfirm, onCancel }) {
    return (
        <div className='ConfirmMessage-overlay'>
            <div className="Confitm-container">
            <div className="confirmMessage-content">
                <p>{message}</p>
            </div>

            <div className="confirmMessage-btn">
                <button onClick={onConfirm} className="confirm-btn">Yes</button>
                <button onClick={onCancel } className="cancel-btn">No</button>
            </div>
            </div>
        </div>
    )
}

export default ConfirmMessage
