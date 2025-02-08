import React from 'react'
import { assets } from '../../assets/assets'
import "./contactSupport.css"

function ContactSupport() {
  return (
    <div className="contactSupportContainer">
      <div className="bestQlty">
        <img src={assets.quality_icon} alt="" />
        <p>Unmatched Excellence</p>
        <p className='supportText' >We provide 14 days free return policy</p>
      </div>

      <div className="exchange">
        <img src={assets.exchange_icon} alt="" />
        <p>Smooth Exchange Guarantee</p>
        <p className='supportText'>We offer hassle free exchange policy</p>
      </div>

      <div className="support">
        <img src={assets.support_img} alt="" />
        <p>Support You Can Trust</p>
        <p className='supportText' >We provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default ContactSupport