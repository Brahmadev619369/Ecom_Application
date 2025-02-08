import React, { useContext, useState } from 'react'
import Loader from '../../loader/Loader'
import { ToastContainer, toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

function ResetPassword() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
          const [isLoading, setIsLoading] = useState(false)
const {resetToken} = useParams()
          const onSubmit = async(data) =>{
            setIsLoading(true)
            try {
                const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/reset-password/${resetToken}`,data)
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

      <ToastContainer/>

      <div className="loginContainer">
      <ToastContainer />

        <h2>Reset Password</h2>
        <hr />

        <form className='formContainer' onSubmit={handleSubmit(onSubmit)}>

        <div className="formElement">
            <label>Password</label>
            <input type="text" {...register("password")} />
          </div>

          <div className="formElement">
            <label>Confirm Password</label>
            <input type="text" {...register("confirmPassword")} />
          </div>

          <div className="BtnText">
          <input className = "submitBtn" type="submit" />

</div>

        </form>
      </div>
    </div>
  )
}

export default ResetPassword