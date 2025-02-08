import React from 'react'
import { useForm } from 'react-hook-form'
import "./subscribe.css"
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

function Subscribe() {
    const {register,handleSubmit,reset} = useForm()


    const submit = async(data) =>{
      try {
        const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/subscribe`,data)

        toast(res.data.message);
        reset({
          email:""
        })
      } catch (error) {
        toast.error(error.response.data.error);
      }
    }
  return (
    <div className="subscribeContainer">
      <ToastContainer/>
        <form onSubmit={handleSubmit(submit)}>
        <div className="subText">
        <h2 className='playfair-display-font'>Subscribe now & get upto 50% off</h2>
        <p>Unlock exclusive deals and save big with our special offer!</p>
        </div>

        <div className="subBtn">
            <input type="text" {...register("email")} placeholder='Enter Email'/>
            <input type="submit" />
        </div>
        </form>


    </div>
  )
}

export default Subscribe