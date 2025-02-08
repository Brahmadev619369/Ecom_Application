import React from 'react'
import "./footer.css"
import { Link } from 'react-router-dom'
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import logo from "../../assets/yourcartLogo.png"

function Footer() {
  const pageUp = () =>{
    window.scroll(0,0)
  }
  return (
    <div className="footerContainer">
      <div className="topFooter">
      <div className="firstSection">
       <img src={logo} alt="" />
       <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque quibusdam minus blanditiis vero recusandae vitae maiores eaque nisi veniam amet?</p>
      </div>

      <div className="secondSection">
        <h2>COMPANY</h2>
        <div>
        <ul>
          <li><Link>About</Link></li>
          <li><Link>News</Link></li>
          <li><Link>Contact</Link></li>
          <li><Link>Careers</Link></li>
        </ul>
        </div>
      </div>

      <div className="thirdSection">
      <h2>GET IN TOUCH</h2>
      <div className="contact">
        <p>+91-9594670206</p>
        <p>raibrahmadev601@gmail.com</p>
      </div>
      </div>
      </div>

      <div className="bottomFooter">
        <div>
          <p>Copyright © siteName. All Right Reserved.</p>
        </div>
        <div className="socialLogoPageUp">
        <div className="socialLogo">
          <Link><div className="socialIcon"><FaFacebookSquare className='socialIcon'/></div></Link>
          <Link><div className="socialIcon"><FaSquareXTwitter className='socialIcon'/></div></Link>
          <Link><div className="socialIcon"><FaInstagramSquare className='socialIcon'/></div></Link>
        </div>

        <div className="pageUp">
          <p onClick={pageUp}>Page Up </p><FaArrowAltCircleUp/>
        </div>
        </div>
      </div>
    </div>
  )
}

export default Footer