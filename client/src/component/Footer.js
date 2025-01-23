// src/Footer.js
import React from 'react';
import { Container, Row, div } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from 'react-icons/fa';
import '../Footer/Footer.css'
function Footer() {
  return (
    <footer className="footer" style={{minWidth:"330px"}}>
  
      <div className="container">
        <div className="row">
          <div className="footer-col">
            <h4>Women</h4>
            <ul>
              <li><a href="#">Dresses</a></li>
              <li><a href="#">Tops</a></li>
              <li><a href="#">Bottoms</a></li>
              <li><a href="#">Jackets</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Collections</h4>
            <ul>
              <li><a href="#">Work Wear</a></li>
              <li><a href="#">Casual Wear</a></li>
              <li><a href="#">Evening Wear</a></li>
              <li><a href="#">Winter Wear</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Accessories</h4>
            <ul>
              <li><a href="#">Jewellery</a></li>
              <li><a href="#">Bags</a></li>
              <li><a href="#">Footwear</a></li>
              <li><a href="#">Scarves</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Follow Us</h4>
            <div className="social-links">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaTwitter /></a>
            </div>
          </div>
        </div>
      </div>
 </footer>
  )
}
export default Footer;