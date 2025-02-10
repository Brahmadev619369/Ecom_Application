import axios from 'axios'
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { toast, ToastContainer } from "react-toastify"
import "./activation.css"
import LoaderNew from '../../loader2/LoaderNew';

function Activation() {

  const { activationToken } = useParams()
  const [isloading, setIsloading] = useState("")
  const activate = async () => {
    setIsloading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/register/activation/${activationToken}`)
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data);

    } finally {
      setIsloading(false)
    }

  }
  return (
    <div className="activationContainer">
      {
        isloading && <LoaderNew />
      }
      <ToastContainer />
      <h2>Click the Activate button to activate your account.</h2>
      <div className="activateBtn">
        <button onClick={activate}>Activate</button>
      </div>
    </div>
  )
}

export default Activation