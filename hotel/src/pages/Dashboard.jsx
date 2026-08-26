import { Link } from "react-router-dom";
import { useEffect, useState } from "react";


export default function Dashboard() {
    const [stats, setStats] = useState({
        guests: 0,
        reservations: 0,
        rooms: 0,
        services: 0,
        revenue: 0
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [
                    guestsResponse,
                    reservationsResponse,
                    roomsResponse,
                    servicesResponse
                ] = await Promise.all([
                    fetch("http://localhost:8000/guest"),
                    fetch("http://localhost:8000/reservation"),
                    fetch("http://localhost:8000/room"),
                    fetch("http://localhost:8000/service")
                ]);

                const guestsData = await guestsResponse.json();
                const reservationsData =
                    await reservationsResponse.json();
                const roomsData = await roomsResponse.json();
                const servicesData = await servicesResponse.json();

                const guests =
                    guestsData.guests ||
                    guestsData.guest ||
                    [];

                const reservations =
                    reservationsData.reservations ||
                    [];

                const rooms =
                    roomsData.rooms ||
                    [];

                const services =
                    servicesData.services ||
                    [];

                const revenue = reservations.reduce(
                    (total, reservation) => {
                        return (
                            total +
                            Number(
                                reservation.totalAmount || 0
                            )
                        );
                    },
                    0
                );

                setStats({
                    guests: Array.isArray(guests)
                        ? guests.length
                        : 1,

                    reservations:
                        reservations.length,

                    rooms:
                        rooms.length,

                    services:
                        services.length,

                    revenue
                });

            } catch (error) {
                console.error(
                    "Dashboard error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="dashboard">
                <h2>Loading dashboard...</h2>
            </div>
        );
    }

    return (
        <div className="dashboard">

            

            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>
                        Welcome to your hotel management
                        dashboard.
                    </p>
                </div>

                <div className="dashboard-actions">
                    <Link
                        to="/reservation"
                        className="btn btn-primary"
                    >
                        + New Reservation
                    </Link>
                </div>
            </div>


            

            <div className="dashboard-cards">

                <div className="dashboard-card">
                    <div className="card-icon">
                        👥
                    </div>

                    <div>
                        <h3>Total Guests</h3>
                        <h2>{stats.guests}</h2>

                        <Link to="/guest">
                            View Guests
                        </Link>
                    </div>
                </div>


                <div className="dashboard-card">
                    <div className="card-icon">
                        📅
                    </div>

                    <div>
                        <h3>Reservations</h3>
                        <h2>{stats.reservations}</h2>

                        <Link to="/reservation">
                            View Reservations
                        </Link>
                    </div>
                </div>


                <div className="dashboard-card">
                    <div className="card-icon">
                        🛏️
                    </div>

                    <div>
                        <h3>Total Rooms</h3>
                        <h2>{stats.rooms}</h2>

                        <Link to="/room">
                            View Room
                        </Link>
                    </div>
                </div>


                <div className="dashboard-card">
                    <div className="card-icon">
                        🛎️
                    </div>

                    <div>
                        <h3>Services</h3>
                        <h2>{stats.services}</h2>

                        <Link to="/service">
                            View Services
                        </Link>
                    </div>
                </div>


                <div className="dashboard-card revenue-card">
                    <div className="card-icon">
                        💰
                    </div>

                    <div>
                        <h3>Total Revenue</h3>

                        <h2>
                            Ksh{" "}
                            {stats.revenue.toLocaleString()}
                        </h2>

                        <Link to="/payment">
                            View Payments
                        </Link>
                    </div>
                </div>

            </div>


            {/* ================= QUICK ACTIONS ================= */}

            <div className="dashboard-section">

                <h2>Quick Actions</h2>

                <div className="quick-actions">

                    <Link
                        to="/guest"
                        className="quick-action"
                    >
                        <span>👤</span>
                        <h3>Guests</h3>
                        <p>Manage hotel guests</p>
                    </Link>


                    <Link
                        to="/reservation"
                        className="quick-action"
                    >
                        <span>📅</span>
                        <h3>Reservations</h3>
                        <p>Manage bookings</p>
                    </Link>


                    <Link
                        to="/room"
                        className="quick-action"
                    >
                        <span>🛏️</span>
                        <h3>Rooms</h3>
                        <p>Manage hotel rooms</p>
                    </Link>


                    <Link
                        to="/service"
                        className="quick-action"
                    >
                        <span>🛎️</span>
                        <h3>Services</h3>
                        <p>Manage hotel services</p>
                    </Link>


                    <Link
                        to="/payment"
                        className="quick-action"
                    >
                        <span>💳</span>
                        <h3>Payments</h3>
                        <p>View payments</p>
                    </Link>


                    <Link
                        to="/inventory"
                        className="quick-action"
                    >
                        <span>📦</span>
                        <h3>Inventory</h3>
                        <p>Manage inventory</p>
                    </Link>

                    
                    <Link
                        to="/employee"
                        className="quick-action"
                    >
                        <span></span>
                        <h3>Employee</h3>
                        <p>Manage employee</p>
                    </Link>

                </div>

            </div>


            {/* ================= SYSTEM OVERVIEW ================= */}

            <div className="dashboard-section">

                <h2>System Overview</h2>

                <div className="overview-grid">

                    <div className="overview-card">
                        <h3>Hotel Management</h3>

                        <p>
                            Manage guests, rooms,
                            reservations and payments
                            from one place.
                        </p>

                        <Link to="/reservation">
                            Manage Reservations →
                        </Link>
                    </div>


                    <div className="overview-card">
                        <h3>Guest Services</h3>

                        <p>
                            Track additional services
                            requested by hotel guests.
                        </p>

                        <Link to="/guestservice">
                            View Guest Services →
                        </Link>
                    </div>


                    <div className="overview-card">
                        <h3>Inventory</h3>

                        <p>
                            Monitor hotel stock and
                            inventory transactions.
                        </p>

                        <Link to="/inventory">
                            Manage Inventory →
                        </Link>
                    </div>

                </div>

            </div>

        </div>
    );
}