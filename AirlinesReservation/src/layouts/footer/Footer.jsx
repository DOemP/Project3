import React from "react";
import logo from '../../assets/image/logo_web.svg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import './footer.css';

const Footer = () => {
  return (
    <footer>
      <div className="container_foot">
        <div className="row">
          <div className="footer_h">
            <div className="col-6">
              <div className="logo_web">
                <img src={logo} alt='Logo' />
                <p>Thank you for trusting us</p>
                <p><FontAwesomeIcon icon={faPhone} /><a href=""> +1234567890</a></p>
                <p><FontAwesomeIcon icon={faEnvelope} /><a href=""> us@gmail.com</a></p>
              </div>
            </div>
            <div className="col-6">
              <div className="row">
                <div className="col-4">
                  {/* <h5 style={{color:"white"}}>Pages</h5> */}
                  <div className="page_nav">
                    {/* <div className="nav-item">
                      <h6><a href="#">Home</a></h6>
                    </div>
                    <div className="nav-item">
                      <h6><a href="#">Flight</a></h6>
                    </div>
                    <div className="nav-item">
                      <h6><a href="#">Flights Details</a></h6>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="footer_l">
            <hr />
            <div className="container">
              <div className="row">
                <div className="col-6">
                  <p>Team 3 development Â© 2024</p>
                </div>
                <div className="col-6">
                  <div className="item_l">
                    <p >Privacy policy</p>
                    <p>Terms and Coditions</p>
                    <p>Refund policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer >
  );
};
export default Footer;