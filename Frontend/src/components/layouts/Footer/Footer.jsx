import React from 'react'
import "./footer.css"
import { assets } from '../../../assets/assets'
import { Link } from 'react-router-dom'
import { FaFacebookSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import { FaArrowAltCircleUp } from "react-icons/fa";
import logo from "../../../assets/yourcartLogo.png"
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

function Footer() {
  const navigate = useNavigate()

  const pageUp = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="footerContainer">
      <div className="topFooter">
        <div className="firstSection">
          <img src={logo} alt="" />
          <p>YourCart - a Retailer site of mens and women casual shirts, T-Shirts, Trousers, Jeans, Shorts in Mumbai</p>
        </div>

        <div className="secondSection">
          <h2>COMPANY</h2>
          <div>
            <ul>
              <li><Link to={"/about"}>About</Link></li>
              <li><Link to={"/terms-and-conditions"}>Terms and Conditions</Link></li>
              <li><Link to={"/contact"}>Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="thirdSection">
          <h2>GET IN TOUCH</h2>
          <div className="contact">
            <p>+91-XXXXXX0206</p>
            <p>raibrahmadev508@gmail.com</p>
          </div>
        </div>
      </div>

      <div className="bottomFooter">
        <div>
          <p>Copyright © siteName. All Right Reserved.</p>
        </div>
        <div className="socialLogoPageUp">
          <div className="socialLogo">
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
              <div className="socialIcon">
                <FaFacebookSquare className="socialIcon" />
              </div>
            </a>
            <a href="https://x.com/" target="_blank" rel="noopener noreferrer">
            <div className="socialIcon">
              <FaSquareXTwitter className='socialIcon' />
            </div>
            </a>
            <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
            <div className="socialIcon">
              <FaInstagramSquare className='socialIcon' />
              </div>
            </a>
          </div>

          {/* <div className="pageUp" onClick={pageUp}>
          <p >Page Up </p><FaArrowAltCircleUp/>
        </div> */}


          <motion.div className='pageUp'
            onClick={pageUp}
            // initial={{opacity : 0,y:50}}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeout" }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}>
            <p>Page Up</p> <FaArrowAltCircleUp />
          </motion.div>



        </div>
      </div>
    </div>
  )
}

export default Footer