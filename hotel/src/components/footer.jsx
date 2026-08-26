import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="footer">

            <div className="footer-container">

                {/* Hotel Information */}
                <div className="footer-section">
                    <h2>Hotel Management</h2>

                    <p>
                        Enjoy comfortable rooms, quality services,
                        and a memorable stay with us.
                    </p>
                </div>


                {/* Quick Links */}
                <div className="footer-section">
                    <h3>Quick Links</h3>

                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>

                        <li>
                            <Link to="/guest">My Profile</Link>
                        </li>

                        <li>
                            <Link to="/service">Services</Link>
                        </li>

                        <li>
                            <Link to="/room">Rooms</Link>
                        </li>

                        <li>
                            <Link to="/contact">Contact</Link>
                        </li>
                        <li>
                            <Link to="/privacy">Privacy</Link>
                        </li>
                    </ul>
                </div>


                {/* Guest Links */}
                <div className="footer-section">
                    <h3>Guest</h3>

                    <ul>
                        <li>
                            <Link to="/guest">My Profile</Link>
                        </li>

                        <li>
                            <Link to="/guestservice">
                                My Services
                            </Link>
                        </li>

                        <li>
                            <Link to="/reservation">
                                My Bookings
                            </Link>
                        </li>
                        
                        
                    </ul>
                </div>


                {/* Contact */}
                <div className="footer-section">
                    <h3>Contact Us</h3>

                    <p>📍 Nairobi, Kenya</p>

                    <p>📞 +254 700 000 000</p>

                    <p>✉️ info@GrandHaven.com</p>
                </div>

            </div>


            {/* Bottom Footer */}
            <div className="footer-bottom">

                <p>
                    © {new Date().getFullYear()} Hotel Management.
                    All rights reserved.
                </p>

                <div className="footer-socials">

                   
                     <a href="#" aria-label="Facebook">
                        Facebook
                    </a>

                    <a href="#" aria-label="Instagram">
                        Instagram
                    </a>

                    <a href="#" aria-label="Twitter">
                        Twitter
                    </a>
                </div>

            </div>

        </footer>
    );
}