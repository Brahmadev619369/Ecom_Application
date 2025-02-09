import React, { useContext, useState } from "react";
import axios from "axios";
import "./subscribe.css";
import { Navigate } from 'react-router-dom'
import { storeContext } from '../../context/context'
import Loader from "../../loader/Loader";

function Subscribe() {
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    festival: "",
    image: null, 
  });
const { auth } = useContext(storeContext)
  const token = localStorage.getItem("AuthToken");
    const [isloading,setIsloading] = useState(false)

  if (auth?.role === "Worker") {
    return <Navigate to="/login" />
}
  // Handle text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle file input
  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
setIsloading(true)
    try {
      const formDataObj = new FormData();
      formDataObj.append("subject", formData.subject);
      formDataObj.append("message", formData.message);
      formDataObj.append("festival", formData.festival);
      if (formData.image) {
        formDataObj.append("image", formData.image);
      }

      const res = await axios.post(`${import.meta.env.VITE_EXPRESS_BASE_URL}/subscriber-msg`, formDataObj, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", // Required for file uploads
        },
      });

      console.log(res.data);

      // Reset form
      setFormData({
        subject: "",
        message: "",
        festival: "",
        image: null,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    }finally{
      setIsloading(false)
    }
  };

  return (
    <div className="subscribe-container">
{
  isloading && <Loader/>
}

      <h2>Newsletter for Our Subscriber</h2>
      <form onSubmit={handleSubmit} className="subscribe-form">
        <div className="input-group">
          <label>Subject</label>
          <input type="text" name="subject" value={formData.subject} onChange={handleChange} required placeholder="Enter Subject" />
        </div>

        <div className="input-group">
          <label>Message</label>
          <input type="text" name="message" value={formData.message} onChange={handleChange} placeholder="Your message" />
        </div>

        <div className="input-group">
          <label>Festival</label>
          <input type="text" name="festival" value={formData.festival} onChange={handleChange} placeholder="Enter offer name" />
        </div>

        <div className="input-group">
          <label>Upload Image</label>
          <input type="file" name="image" onChange={handleFileChange} />
        </div>

        <button type="submit" className="submit-btn">Subscribe</button>
      </form>
    </div>
  );
}

export default Subscribe;
