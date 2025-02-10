import React, { useEffect } from 'react'
import "./about.css"

function About() {
  useEffect(() => {
    window.scrollTo({top:0,behavior:"smooth"});
}, []);


  return (
    <div className="about-container">
      <div className="about-banner">
        <h1>Welcome to YourCart – Your One-Stop Shopping Destination!</h1>
        <p>Shop smart. Shop easy. Shop with confidence.</p>
      </div>

      <section className="about-section">
        <h2>Who We Are</h2>
        <p>
          At <strong>YourCart</strong>, we’re passionate about bringing you the best products at unbeatable prices.
          We believe shopping should be seamless, enjoyable, and most importantly, tailored to your needs.
        </p>
      </section>

      <section className="about-section">
        <h2>Why Choose Us?</h2>
        <div className="about-grid">
          <div className="about-box">
            <h3>🚀 Fast & Reliable Delivery</h3>
            <p>Get your favorite products delivered quickly and safely to your doorstep.</p>
          </div>
          <div className="about-box">
            <h3>💰 Best Prices Guaranteed</h3>
            <p>We offer competitive prices without compromising on quality.</p>
          </div>
          <div className="about-box">
            <h3>🔒 Secure Shopping</h3>
            <p>Your privacy and security are our top priorities. Shop with confidence.</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>Our Mission</h2>
        <p>
          Our mission is simple: to revolutionize online shopping by offering a seamless, enjoyable,
          and affordable experience for customers around the world. We constantly strive to innovate
          and improve so you can shop with ease.
        </p>
      </section>

      <section className="about-section">
        <h2>Contact Us</h2>
        <p>📧 Email: raibrahmadev508@gmail.com</p>
        <p>📍 Location: Near Durian Company, Goregaon East.</p>
      </section>
    </div>
  )
}

export default About