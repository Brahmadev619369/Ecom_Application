import axios from 'axios'
import React from 'react'
import { useParams } from 'react-router-dom'
import {toast,ToastContainer} from "react-toastify"
import "./activation.css"
function Activation() {

    const {activationToken} = useParams()

    const activate = async(req,res) =>{
       try {
        const response = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/register/activation/${activationToken}`)
        toast.success(response.data.message);
       } catch (error) {
        toast.error(error.response.data);
        
       }
        
    }
  return (
    <div className="activationContainer">
        <ToastContainer/>
        <h2>Click the Activate button to activate your account.</h2>
        <div className="activateBtn">
        <button onClick={activate}>Activate</button>
    </div>
    </div>
  )
}

export default Activation