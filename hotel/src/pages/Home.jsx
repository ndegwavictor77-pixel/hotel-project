import React from "react";
import { Link } from "react-router-dom";


export default function Home() {
    const rooms = [
        {
            name: "Deluxe Room",
            description:
                "A comfortable and elegant room perfect for business and leisure travelers.",
            price: "8,500",
            image:
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80",
        },
        {
            name: "Executive Suite",
            description:
                "Enjoy extra space, premium furnishings and a relaxing private lounge.",
            price: "15,000",
            image:
                "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
        },
        {
            name: "Luxury Suite",
            description:
                "Experience premium comfort with a spacious bedroom and elegant interiors.",
            price: "22,000",
            image:
                "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
        },
    ];

    const services = [
        {
            icon: "🍽️",
            title: "Restaurant",
            description:
                "Enjoy delicious local and international meals prepared by our chefs.",
        },
        {
            icon: "🏊",
            title: "Swimming Pool",
            description:
                "Relax and enjoy our clean and refreshing swimming pool.",
        },
        {
            icon: "🧖",
            title: "Spa & Wellness",
            description:
                "Take time to relax with our wellness and spa services.",
        },
        {
            icon: "🚗",
            title: "Airport Transfer",
            description:
                "Convenient transportation to and from the airport.",
        },
        {
            icon: "📶",
            title: "Free Wi-Fi",
            description:
                "Stay connected with fast and reliable internet throughout the hotel.",
        },
        {
            icon: "🛎️",
            title: "24/7 Reception",
            description:
                "Our reception team is available around the clock to assist you.",
        },
    ];

    return (
        <div className="home">

            {/* ================= NAVBAR =================

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
                    <Link to="/sign up">Sign Up</Link>
                </div>

                <Link
                    to="/reservation"
                    className="nav-book-button"
                >
                    Book Now
                </Link>

            </nav> */}


            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-overlay"></div>

                <div className="hero-content">

                    <p className="hero-small-title">
                        WELCOME TO GRAND HAVEN
                    </p>

                    <h1>
                        Your Comfort.
                        <br />
                        Our Priority.
                    </h1>

                    <p className="hero-description">
                        Experience exceptional hospitality, beautiful
                        rooms and unforgettable moments in a peaceful
                        and luxurious environment.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/reservation"
                            className="hero-primary-button"
                        >
                            Make a Reservation
                        </Link>

                        <Link
                            to="/room"
                            className="hero-secondary-button"
                        >
                            Explore Rooms
                        </Link>

                    </div>

                </div>

            </section>


            {/* ================= QUICK BOOKING ================= */}

            <section className="booking-box">

                <div className="booking-item">
                    <span>📅</span>
                    <div>
                        <small>CHECK IN</small>
                        <strong>Select date</strong>
                    </div>
                </div>

                <div className="booking-item">
                    <span>📅</span>
                    <div>
                        <small>CHECK OUT</small>
                        <strong>Select date</strong>
                    </div>
                </div>

                <div className="booking-item">
                    <span>👤</span>
                    <div>
                        <small>GUESTS</small>
                        <strong>2 Adults</strong>
                    </div>
                </div>

                <Link
                    to="/reservation"
                    className="availability-button"
                >
                    Check Availability
                </Link>

            </section>


            {/* ================= INTRODUCTION ================= */}

            <section className="intro-section">

                <div className="intro-image">

                    <img
                        src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
                        alt="Luxury hotel"
                    />

                </div>

                <div className="intro-content">

                    <p className="section-label">
                        ABOUT OUR HOTEL
                    </p>

                    <h2>
                        A place where
                        <br />
                        <span>comfort meets elegance.</span>
                    </h2>

                    <p>
                        Welcome to Grand Haven Hotel, where modern
                        comfort meets warm hospitality. Whether you are
                        travelling for business, vacation or a special
                        occasion, our team is ready to make your stay
                        memorable.
                    </p>

                    <p>
                        From beautifully designed rooms to excellent
                        dining and professional guest services, we
                        provide everything you need for a relaxing stay.
                    </p>

                    <Link
                        to="/room"
                        className="dark-button"
                    >
                        Discover More
                    </Link>

                </div>

            </section>


            {/* ================= ROOMS ================= */}

            <section className="rooms-section">

                <div className="section-heading">

                    <div>
                        <p className="section-label">
                            ACCOMMODATION
                        </p>

                        <h2>
                            Our Rooms & Suites
                        </h2>
                    </div>

                    <Link
                        to="/room"
                        className="view-all"
                    >
                        View All Rooms →
                    </Link>

                </div>


                <div className="rooms-grid">

                    {rooms.map((room, index) => (

                        <div
                            className="room-card"
                            key={index}
                        >

                            <div className="room-image">

                                <img
                                    src={room.image}
                                    alt={room.name}
                                />

                                <div className="room-price">
                                    KSh {room.price}
                                    <small>
                                        / night
                                    </small>
                                </div>

                            </div>

                            <div className="room-info">

                                <h3>
                                    {room.name}
                                </h3>

                                <p>
                                    {room.description}
                                </p>

                                <Link
                                    to="/reservation"
                                    className="room-button"
                                >
                                    Book This Room →
                                </Link>

                            </div>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= SERVICES ================= */}

            <section className="services-section">

                <div className="services-heading">

                    <p className="section-label">
                        HOTEL FACILITIES
                    </p>

                    <h2>
                        Everything You Need
                    </h2>

                    <p>
                        We provide a wide range of services designed
                        to make your stay comfortable and enjoyable.
                    </p>

                </div>


                <div className="services-grid">

                    {services.map((service, index) => (

                        <div
                            className="service-card"
                            key={index}
                        >

                            <div className="service-icon">
                                {service.icon}
                            </div>

                            <h3>
                                {service.title}
                            </h3>

                            <p>
                                {service.description}
                            </p>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= WHY US ================= */}

            <section className="why-section">

                <div className="why-content">

                    <p className="section-label">
                        WHY CHOOSE US
                    </p>

                    <h2>
                        Hospitality that
                        <br />
                        feels like home.
                    </h2>

                    <p>
                        We believe a great hotel is more than just
                        a room. It is about creating an experience
                        that guests remember.
                    </p>

                    <div className="features">

                        <div>
                            <strong>01</strong>
                            <span>
                                Comfortable Rooms
                            </span>
                        </div>

                        <div>
                            <strong>02</strong>
                            <span>
                                Professional Staff
                            </span>
                        </div>

                        <div>
                            <strong>03</strong>
                            <span>
                                Excellent Services
                            </span>
                        </div>

                        <div>
                            <strong>04</strong>
                            <span>
                                Secure Environment
                            </span>
                        </div>

                    </div>

                </div>

                <div className="why-image">

                    <img
                        src="https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1000&q=80"
                        alt="Hotel swimming pool"
                    />

                </div>

            </section>


            {/* ================= CTA ================= */}

            <section className="cta-section">

                <div>

                    <p>
                        READY FOR AN UNFORGETTABLE STAY?
                    </p>

                    <h2>
                        Book your stay with us today.
                    </h2>

                </div>

                <Link
                    to="/reservation"
                    className="cta-button"
                >
                    Make a Reservation →
                </Link>

            </section>

{/* 

            <footer className="home-footer">

                <div className="footer-column">

                    <div className="hotel-logo footer-logo">
                        <span>✦</span>

                        <div>
                            <h2>Grand Haven</h2>
                            <small>HOTEL & RESORT</small>
                        </div>

                    </div>

                    <p>
                        Experience comfort, elegance and
                        exceptional hospitality.
                    </p>

                </div>


                <div className="footer-column">

                    <h3>Quick Links</h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/room">
                        Rooms
                    </Link>

                    <Link to="/service">
                        Services
                    </Link>

                    <Link to="/reservations">
                        Reservations
                    </Link>

                </div>


                <div className="footer-column">

                    <h3>Contact</h3>

                    <p>📍 Nairobi, Kenya</p>
                    <p>📞 +254 700 000 000</p>
                    <p>✉️ info@grandhaven.com</p>

                </div>


                <div className="footer-column">

                    <h3>Follow Us</h3>

                    <p>
                        Facebook
                    </p>

                    <p>
                        Instagram
                    </p>

                    <p>
                        Twitter
                    </p>

                </div>

            </footer>


            <div className="copyright">

                © {new Date().getFullYear()} Grand Haven Hotel.
                All rights reserved.

            </div> */}

        </div>
    );
}