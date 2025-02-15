import axios from 'axios'
import React, { useState,useEffect } from 'react'
import { useForm } from 'react-hook-form'
import "./contact.css"
import LoaderNew from '../../loader2/LoaderNew'
import Chatbot from '../../chatbot/Chatbot'
function Contact() {
  const { register, handleSubmit } = useForm()
const token = localStorage.getItem("AuthToken")
  const [isloading,setIsloading] = useState(false)

  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);


  const handleToSubmit = async(data) =>{
    setIsloading(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/contactUs`,data,{
        headers:{
          Authorization : `Bearer ${token}`
        }
      })
      
    } catch (error) {
      console.log(error);
      
    }
    finally{
      setIsloading(false)
    }
  }


  return (
    <div className='contactFormMainContainer'>
      <div className="heading">
        <div className="line1"></div>
        <h2 className='playfair-display-font'>Contact Us</h2>
        <div className="line1"></div>
      </div>

{
  isloading && <LoaderNew/>
}
      <div className="contactFormContainer">
        <form className='formContainer' onSubmit={handleSubmit(handleToSubmit)}>

          <div className="formElement">
            <label>Name</label>
            <input type="text" {...register("name")} />
          </div>

          <div className="formElement">
            <label>Email</label>
            <input type="text" {...register("email")} />
          </div>

          <div className="formElement">
            <label>Mobile No.</label>
            <input type="text" {...register("number")} />
          </div>

          <div className="formElement">
            <label>Description</label>
            <textarea type="text" {...register("message")} />
          </div>

          <div className="BtnText">
            <input className="submitBtn" type="submit" />
          </div>
        </form>
      </div>

    </div>
  )
}

export default Contact