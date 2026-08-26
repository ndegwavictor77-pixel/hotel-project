import { Link } from "react-router-dom";

export default function Navbar(){
    return(
//         // <nav className="navbar">
//         //     <div className="nav-bar container">
//         //         <Link to="/" className="navbar-brand">
//         //         Hotel
//         //         </Link>
//         //         <div className="navbar-links">
//         //             <div>
                    
//         //             <Link to="/auth" className="btn btn-secondary">Sign Up</Link>
                
//         //             <Link to="/auth" className="btn btn-primary">Login</Link>
//         //             </div>
//         //             {/* <Link to="/dashboard" className="btn btn-secondary"> Dashboard</Link> */}
                    
                    
                    
//         //             </div>

//         //         </div>

            
            
            
//         // </nav>

        

            // {/* ================= NAVBAR ================= */}

            <nav className="home-navbar">

                <div className="hotel-logo">
                    <span>✦</span>
                    <div>
                        <h2>Grand Haven</h2>
                        <small>HOTEL & RESORT</small>
                    </div>
                </div>

                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/room">Room</Link>
                    <Link to="/service">Services</Link>
                    <Link to="/auth">Sign Up</Link>
                </div>

                <Link
                    to="/reservation"
                    className="nav-book-button"
                >
                    Book Now
                </Link>

            </nav>

        
        
    )
}