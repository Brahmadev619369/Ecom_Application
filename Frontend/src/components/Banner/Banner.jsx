import React from 'react'
import banner from "../../assets/banner.png"
import bank from "../../assets/bankOffer.png"
import "./banner.css"

function Banner() {
  return (
    <div className="bannerContainer crimson-text-regular">
        <div className="textContainers">
            <h1>Empowering Your Lifestyle with Style.</h1>
<h2>Shop Your Favorite Styles Today!</h2>
<p>Explore the latest trends and timeless classics curated just for you. Enjoy unbeatable prices and exclusive offers—only for a limited time!</p>

<img src={bank} alt="" />
        </div>

        <div className="imgContainer">
            <img src={banner} alt="" />
        </div>
    </div>
  )
}

export default Banner