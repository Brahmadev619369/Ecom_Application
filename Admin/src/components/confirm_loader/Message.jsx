import React from 'react'
import "./confirm.css"

function Message({ message}) {
  return (
    <div >
              <div className='ConfirmMessage-overlay'>
            <div className="Confitm-container">
            <div className="confirmMessage-content">
                <p>{message}</p>
            </div>
            </div>
        </div>
    </div>
  )
}

export default Message
