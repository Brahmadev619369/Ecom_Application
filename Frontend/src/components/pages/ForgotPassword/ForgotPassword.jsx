import React, { useContext, useState } from 'react'
import Loader from '../../loader/Loader'
import toast, { Toaster } from 'react-hot-toast';
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

function ForgotPassword() {

    const { register, handleSubmit, watch, formState: { errors } } = useForm()
      const [isLoading, setIsLoading] = useState(false)

      const onSubmit = async(data) =>{
        setIsLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/forgot-password`,data)
            toast.success(res.data);
            
        } catch (error) {
            toast.error(error.response.data.error);
            
        }
        finally{
            setIsLoading(false)
        }
      }

  return (
    <div className="loginMainContainer playfair-display-font">
      {isLoading && (
        <Loader />
      )}


      <div className="loginContainer">
      <Toaster />

        <h2>Forgot Password</h2>
        <hr />

        <form className='formContainer' onSubmit={handleSubmit(onSubmit)}>


          <div className="formElement">
            <label>Email</label>
            <input type="text" {...register("email")} />
          </div>

          <div className="BtnText">
          <input className = "submitBtn" type="submit" />

</div>

        </form>
      </div>
    </div>
  )
}

export default ForgotPassword