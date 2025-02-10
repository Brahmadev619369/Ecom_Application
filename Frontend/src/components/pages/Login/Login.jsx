import React, { useContext, useState,useEffect } from 'react'
import Loader from '../../loader/Loader'
import "./login.css"
import { ToastContainer, toast } from 'react-toastify'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { StoreContext } from '../../Context'


function Login() {
  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);


  const { register, handleSubmit, watch, formState: { errors },reset } = useForm()
  const [currState, setCurrState] = useState("Login")
  const [isLoading, setIsLoading] = useState(false)
  const {loginHandler} = useContext(StoreContext)
  const navigate = useNavigate()

  let baseUrl;
  if(currState === "Login"){
    baseUrl = `${import.meta.env.VITE_EXPRESS_BASE_URL}/users/login`
  }else{
    baseUrl = `${import.meta.env.VITE_EXPRESS_BASE_URL}/users/register`
  }

  const onSubmit = async(data) =>{
    setIsLoading(true)
    
    try {
      const res = await axios.post(baseUrl,data)
      if(currState === "Login"){
        const token = res.data.token
        console.log(res.data.token);
        
        loginHandler(token)
        navigate("/")
      }else{
        console.log(res.data.message);
        reset()
        toast.success(res.data.message)
        navigate("/login")
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || "Something went wrong!";
      toast.error(errorMessage);
      
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
      <ToastContainer />

        <h2>{currState}</h2>
        <hr />

        <form className='formContainer' onSubmit={handleSubmit(onSubmit)}>

          {
            currState === "Register" && (
              <div className="formElement">
                <label>UserName</label>
                <input type="text" {...register("name")} />
              </div>
            )
          }

          <div className="formElement">
            <label>Email</label>
            <input type="text" {...register("email")} />
          </div>

          <div className="formElement">
            <label>Password</label>
            <input type="text" {...register("password")} />
          </div>

          {
            currState === "Register" && (
              <div className="formElement">
                <label>Confirm Password</label>
                <input type="text" {...register("confirmPassword")} />
              </div>
            )
          }

          <div className="BtnText">
          <input className = "submitBtn" type="submit" />


          {
            currState === "Login" ? 
            <p>Don't have an account? <span onClick = {()=>setCurrState("Register")}>Register</span> </p>
            :<p>Already have an account? <span onClick = {()=>setCurrState("Login")}>Login</span>  </p>
          }

          {
            currState === "Login" &&(
              <Link to={"/forgot-password"}>Forgot Password</Link>
            )
          }

</div>

        </form>
      </div>
    </div>
  )
}

export default Login