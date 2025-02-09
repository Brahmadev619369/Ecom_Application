import React, { useState ,useContext} from 'react';
import './registration.css';
import axios from 'axios';
import { ToastContainer,toast } from 'react-toastify';
import Loader from '../../loader/Loader';
import { Navigate } from 'react-router-dom'
import { storeContext } from '../../context/context'

function Registration() {
  const { auth } = useContext(storeContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    file: null,
    role: 'Worker',
    mobile: '+91', 
  });

  const [loader,setLoader] = useState(false)

  if (auth?.role === "Worker") {
    return <Navigate to="/login" />
}
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent changing the +91 prefix
    if (name === 'mobile' && !value.startsWith('+91')) {
      value = '+91' + value.replace('+91', ''); // Add +91 if not already present
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      file: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true)
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/users/adminRegister`, formData);
      toast.success("Account Created.")
      toast.success(res.data.message);
      setLoader(false)
    } catch (error) {
      toast.error(error.response.data.error);
      setLoader(false)
    }finally{
      formData.name = ""
      formData.price = ""
      formData.email =  ''
      formData.password = ''
      formData.confirmPassword= ''
      formData.file= null
      formData.role = 'Worker'
      formData.mobile= '+91'
    }
  };

  return (
    <div className="registerWorker">
      {
        loader && <Loader/>
      }
      <ToastContainer/>
      <h2>Register</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Enter Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Upload File</label>
          <input
            type="file"
            name="file"
            onChange={handleFileChange}
          />
        </div>

        <div className="form-group">
          <label>Mobile Number</label>
          <input
            type="text"
            placeholder="Enter Mobile Number"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            maxLength="13"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="Worker">Worker</option>
            <option value="Admin">Admin</option>
          </select>
        </div>

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Registration;
