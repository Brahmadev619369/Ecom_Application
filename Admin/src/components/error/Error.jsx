import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./error.css"
function Error() {
  const navigate = useNavigate()

  return (
    <div className='errorContainer'>
      <h2>Something went wrong!</h2>

      <button onClick={()=>navigate("/")}>GO TO HOME</button>
    </div>
  )
}

export default Error