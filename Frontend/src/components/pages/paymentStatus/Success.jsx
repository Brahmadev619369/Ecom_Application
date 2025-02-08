import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./status.css"

function Success() {
    const navigate = useNavigate()

    const homePg = () =>{
        navigate("/myOrders")
    }
  return (
    <div className='StatusContainer'>

        <p className='success crimson-text-regular'>ORDERED PLACED</p>

        <button onClick={()=>homePg()}>GO TO ORDERS</button>
      
    </div>
  )
}

export default Success
