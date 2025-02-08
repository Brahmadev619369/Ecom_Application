import React from 'react'
import loader from "../../assets/loader.svg"
import "./loader.css"

function Loader() {
  return (
    <div className="loaderContainer">
        <img src={loader} alt="" />
    </div>
  )
}

export default Loader