import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GuestService() {
    const [guestServices, setGuestServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchGuestServices = async () => {
            try {
                const response = await fetch(
                    "http://localhost:8000/guestservice"
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch guest services");
                }

                const data = await response.json();

                console.log("Guest services:", data);

                setGuestServices(
                    data.guestServices ||
                    data.services ||
                    []
                );

            } catch (error) {
                console.error(
                    "Guest service error:",
                    error
                );

                setError(
                    error.message ||
                    "Failed to load guest services"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchGuestServices();
    }, []);

    // Loading
    if (loading) {
        return (
            <div className="guest-service-container">
                <h2>Loading guest services...</h2>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="guest-service-container">
                <h2>{error}</h2>

                <button
                    onClick={() => window.location.reload()}
                    className="btn btn-primary"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="guest-service-container">

            {/* Header */}
            <div className="guest-service-header">

                <div>
                    <h1>My Services</h1>
                    <p>
                        Services added to your hotel reservations
                    </p>
                </div>

                <Link
                    to="/"
                    className="btn btn-secondary"
                >
                    Back Home
                </Link>

            </div>


            {/* Services */}
            {guestServices.length === 0 ? (

                <div className="no-services">

                    <h2>No guest services found.</h2>

                    <p>
                        You haven't added any services to your
                        reservations yet.
                    </p>

                    <Link
                        to="/service"
                        className="btn btn-primary"
                    >
                        View Services
                    </Link>

                </div>

            ) : (

                <div className="guest-service-list">

                    {guestServices.map((guestService) => (

                        <div
                            className="guest-service-card"
                            key={guestService.id}
                        >

                            <div className="service-info">

                                <h2>
                                    {guestService.service?.name ||
                                        guestService.name ||
                                        "Service"}
                                </h2>

                                <p>
                                    <strong>Quantity:</strong>{" "}
                                    {guestService.quantity || 0}
                                </p>

                                <p>
                                    <strong>Price:</strong>{" "}
                                    Ksh{" "}
                                    {guestService.service?.price ||
                                        guestService.price ||
                                        0}
                                </p>

                                <p>
                                    <strong>Total:</strong>{" "}
                                    Ksh{" "}
                                    {guestService.totalPrice || 0}
                                </p>

                            </div>


                            <div className="service-booking">

                                <p>
                                    <strong>Reservation ID:</strong>{" "}
                                    {guestService.reservationId ||
                                        "N/A"}
                                </p>

                                <span className="service-status">
                                    Active
                                </span>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}