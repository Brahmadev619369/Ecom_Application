import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./status.css"

function Failure() {

    const navigate = useNavigate()

    const homePg = () =>{
        navigate("/")
    }
  return (
    <div className='StatusContainer'>

        <p className='failure crimson-text-regular'>PAYMENT FAILED</p>

        <button onClick={()=>homePg()}>GO TO HOME</button>
      
    </div>
  )
}

export default Failure
