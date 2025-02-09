import React, { useContext, useState } from 'react'
import "./login.css"
import axios from 'axios'
import { storeContext } from '../../context/context'
import { useNavigate } from 'react-router-dom'
import Loader from '../../loader/Loader'
import toast, { Toaster } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { handleToLogin } = useContext(storeContext)
  const [loader, setloader] = useState(false)
  const navigate = useNavigate()


  const handleToLoginBtn = async (e) => {
    e.preventDefault()
    setloader(true)
    try {
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/login`, { email, password })

      handleToLogin(res.data.token);
      navigate("/")
      setloader(false)
    } catch (error) {
      toast.error(error.response.data.error || "Something Went Wrong!");

    } finally {
      setloader(false)
    }

  }

  console.log(email, password);

  return (
    <div className="adminLoginPanel">
      {
        loader && (
          <Loader/>
        )
      }

      <Toaster/>
      <div className="adminLogin">
        <h1>YOURCART</h1>
        <h2>ADMIN PANEL</h2>
        <form onSubmit={handleToLoginBtn} className='loginForm'>
          <h2>Login</h2>
          <hr />
          <div className="email">
            <input type="text" placeholder='Enter Email' value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="password">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Enter Password' />
          </div>

          <div className="btn">
            <button type='submit'>Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login