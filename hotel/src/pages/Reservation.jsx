import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Reservation() {
    const API_URL = "http://localhost:8000/reservations";

    // ==========================================
    // STATE
    // ==========================================

    const [reservations, setReservations] = useState([]);

    const [formData, setFormData] = useState({
        guestId: "",
        roomId: "",
        checkIn: "",
        checkOut: "",
        adults: 1,
        children: 0,
        totalAmount: "",
        status: "PENDING",
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // GET ALL RESERVATIONS
    // ==========================================

    const fetchReservations = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            console.log("Reservation status:", response.status);

            const data = await response.json();

            console.log("Reservation response:", data);

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch reservations"
                );
            }

            setReservations(
                Array.isArray(data)
                    ? data
                    : data.reservations || []
            );

        } catch (err) {
            console.error("FETCH RESERVATIONS ERROR:", err);

            setError(
                err.message || "Failed to fetch reservations"
            );

            setReservations([]);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD RESERVATIONS
    // ==========================================

    useEffect(() => {
        fetchReservations();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            guestId: "",
            roomId: "",
            checkIn: "",
            checkOut: "",
            adults: 1,
            children: 0,
            totalAmount: "",
            status: "PENDING",
        });

        setEditingId(null);
        setError("");
        setMessage("");
    };

    // ==========================================
    // CREATE RESERVATION
    // ==========================================

    const createReservation = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    guestId: Number(formData.guestId),
                    roomId: Number(formData.roomId),

                    checkIn: formData.checkIn,
                    checkOut: formData.checkOut,

                    adults: Number(formData.adults),
                    children: Number(formData.children),

                    totalAmount: Number(formData.totalAmount),

                    status: formData.status,
                }),
            });

            const data = await response.json();

            console.log("Create reservation:", data);

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create reservation"
                );
            }

            setMessage(
                "Reservation created successfully!"
            );

            resetForm();

            await fetchReservations();

        } catch (err) {
            console.error(
                "CREATE RESERVATION ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to create reservation"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UPDATE RESERVATION
    // ==========================================

    const updateReservation = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        guestId: Number(formData.guestId),
                        roomId: Number(formData.roomId),

                        checkIn: formData.checkIn,
                        checkOut: formData.checkOut,

                        adults: Number(formData.adults),
                        children: Number(formData.children),

                        totalAmount:
                            Number(formData.totalAmount),

                        status: formData.status,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update reservation"
                );
            }

            setMessage(
                "Reservation updated successfully!"
            );

            resetForm();

            await fetchReservations();

        } catch (err) {
            console.error(
                "UPDATE RESERVATION ERROR:",
                err
            );

            setError(
                err.message ||
                "Failed to update reservation"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        // Validate Guest ID
        if (!formData.guestId) {
            setError("Guest ID is required");
            return;
        }

        // Validate Room ID
        if (!formData.roomId) {
            setError("Room ID is required");
            return;
        }

        // Validate Check In
        if (!formData.checkIn) {
            setError("Check-in date is required");
            return;
        }

        // Validate Check Out
        if (!formData.checkOut) {
            setError("Check-out date is required");
            return;
        }

        // Validate dates
        const checkInDate = new Date(formData.checkIn);
        const checkOutDate = new Date(formData.checkOut);

        if (checkOutDate <= checkInDate) {
            setError(
                "Check-out date must be after check-in date"
            );
            return;
        }

        // Validate amount
        if (
            !formData.totalAmount ||
            Number(formData.totalAmount) < 0
        ) {
            setError("Please enter a valid total amount");
            return;
        }

        if (editingId) {
            await updateReservation();
        } else {
            await createReservation();
        }
    };

    // ==========================================
    // EDIT RESERVATION
    // ==========================================

    const handleEdit = (reservation) => {
        setEditingId(reservation.id);

        setMessage("");
        setError("");

        setFormData({
            guestId: reservation.guestId || "",
            roomId: reservation.roomId || "",

            checkIn: reservation.checkIn
                ? formatDateForInput(reservation.checkIn)
                : "",

            checkOut: reservation.checkOut
                ? formatDateForInput(reservation.checkOut)
                : "",

            adults: reservation.adults || 1,

            children:
                reservation.children !== undefined
                    ? reservation.children
                    : 0,

            totalAmount:
                reservation.totalAmount || "",

            status:
                reservation.status || "PENDING",
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // FORMAT DATE FOR INPUT
    // ==========================================

    const formatDateForInput = (date) => {
        if (!date) {
            return "";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "";
        }

        const year = parsedDate.getFullYear();

        const month = String(
            parsedDate.getMonth() + 1
        ).padStart(2, "0");

        const day = String(
            parsedDate.getDate()
        ).padStart(2, "0");

        const hours = String(
            parsedDate.getHours()
        ).padStart(2, "0");

        const minutes = String(
            parsedDate.getMinutes()
        ).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    // ==========================================
    // CANCEL RESERVATION
    // ==========================================

   const handleCancel = async (id) => {
    if (!window.confirm(
        "Are you sure you want to cancel this reservation?"
    )) {
        return;
    }

    try {
        setLoading(true);
        setError("");
        setMessage("");

        const response = await fetch(
            `${API_URL}/${id}`,
            {
                method: "DELETE"
            }
        );

        const text = await response.text();

        let data;

        try {
            data = JSON.parse(text);
        } catch {
            throw new Error(
                `Server returned non-JSON response: ${text}`
            );
        }

        if (!response.ok) {
            throw new Error(
                data.message || "Failed to cancel reservation"
            );
        }

        setMessage(
            "Reservation cancelled successfully!"
        );

        await fetchReservations();

    } catch (error) {
        console.error("CANCEL ERROR:", error);
        setError(error.message);

    } finally {
        setLoading(false);
    }
};
    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {
            case "CONFIRMED":
                return "status confirmed";

            case "CHECKED_IN":
                return "status checked-in";

            case "CHECKED_OUT":
                return "status checked-out";

            case "CANCELLED":
                return "status cancelled";

            case "PENDING":
            default:
                return "status pending";
        }
    };

    // ==========================================
    // FORMAT DISPLAY DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Invalid date";
        }

        return parsedDate.toLocaleString();
    };

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="reservation-container">

            {/* HEADER */}

            <div className="reservation-header">

                <Link
                    to="/"
                    className="btn btn-secondary"
                >
                    Back Home
                </Link>

                <div>
                    <h1>Reservations</h1>

                    <p>
                        Manage hotel guest reservations
                    </p>
                </div>

                <div className="reservation-count">

                    <strong>
                        {reservations.length}
                    </strong>

                    <span>
                        Total Reservations
                    </span>

                </div>

            </div>

            {/* MESSAGES */}

            {message && (
                <div className="success-message">
                    {message}
                </div>
            )}

            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}

            {/* FORM */}

            <div className="reservation-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Reservation"
                            : "Create Reservation"}
                    </h2>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn btn-secondary"
                        >
                            Cancel Edit
                        </button>
                    )}

                </div>

                <form onSubmit={handleSubmit}>

                    {/* Guest ID */}

                    <div className="form-group">

                        <label>
                            Guest ID
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="guestId"
                            value={formData.guestId}
                            onChange={handleChange}
                            placeholder="Enter guest ID"
                            min="1"
                            required
                        />

                    </div>

                    {/* Room ID */}

                    <div className="form-group">

                        <label>
                            Room ID
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="roomId"
                            value={formData.roomId}
                            onChange={handleChange}
                            placeholder="Enter room ID"
                            min="1"
                            required
                        />

                    </div>

                    {/* Check In */}

                    <div className="form-group">

                        <label>
                            Check In
                        </label>

                        <input
                            className="form-input"
                            type="datetime-local"
                            name="checkIn"
                            value={formData.checkIn}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Check Out */}

                    <div className="form-group">

                        <label>
                            Check Out
                        </label>

                        <input
                            className="form-input"
                            type="datetime-local"
                            name="checkOut"
                            value={formData.checkOut}
                            onChange={handleChange}
                            required
                        />

                    </div>

                    {/* Adults */}

                    <div className="form-group">

                        <label>
                            Adults
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="adults"
                            value={formData.adults}
                            onChange={handleChange}
                            min="1"
                            required
                        />

                    </div>

                    {/* Children */}

                    <div className="form-group">

                        <label>
                            Children
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="children"
                            value={formData.children}
                            onChange={handleChange}
                            min="0"
                        />

                    </div>

                    {/* Total Amount */}

                    <div className="form-group">

                        <label>
                            Total Amount
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="totalAmount"
                            value={formData.totalAmount}
                            onChange={handleChange}
                            placeholder="Enter amount"
                            min="0"
                            step="0.01"
                            required
                        />

                    </div>

                    {/* Status */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            className="form-input"
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                        >

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="CONFIRMED">
                                Confirmed
                            </option>

                            <option value="CHECKED_IN">
                                Checked In
                            </option>

                            <option value="CHECKED_OUT">
                                Checked Out
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>

                        </select>

                    </div>

                    {/* BUTTONS */}

                    <div className="reservation-buttons">

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading
                                ? "Processing..."
                                : editingId
                                ? "Update Reservation"
                                : "Create Reservation"}
                        </button>

                        <button
                            type="button"
                            onClick={resetForm}
                            className="btn btn-secondary"
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </div>

            {/* RESERVATION LIST */}

            <div className="reservation-list">

                <div className="list-header">

                    <h2>
                        All Reservations
                    </h2>

                    <button
                        onClick={fetchReservations}
                        disabled={loading}
                        className="btn btn-secondary"
                    >
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </button>

                </div>

                {/* LOADING */}

                {loading &&
                    reservations.length === 0 && (
                        <p className="loading">
                            Loading reservations...
                        </p>
                    )}

                {/* EMPTY */}

                {!loading &&
                    reservations.length === 0 &&
                    !error && (
                        <div className="empty-state">

                            <h3>
                                No reservations found
                            </h3>

                            <p>
                                Create a reservation
                                to see it here.
                            </p>

                        </div>
                    )}

                {/* TABLE */}

                {reservations.length > 0 && (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>Guest</th>

                                    <th>Room</th>

                                    <th>Check In</th>

                                    <th>Check Out</th>

                                    <th>Adults</th>

                                    <th>Children</th>

                                    <th>Amount</th>

                                    <th>Status</th>

                                    <th>Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {reservations.map(
                                    (reservation) => (

                                    <tr
                                        key={
                                            reservation.id
                                        }
                                    >

                                        {/* ID */}

                                        <td>
                                            {
                                                reservation.id
                                            }
                                        </td>

                                        {/* Guest */}

                                        <td>

                                            {reservation.guest ? (
                                                <div>

                                                    <strong>
                                                        {
                                                            reservation
                                                                .guest
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            reservation
                                                                .guest
                                                                .lastName
                                                        }
                                                    </strong>

                                                    <br />

                                                    <small>
                                                        {
                                                            reservation
                                                                .guest
                                                                .email
                                                        }
                                                    </small>

                                                </div>
                                            ) : (
                                                reservation.guestId
                                            )}

                                        </td>

                                        {/* Room */}

                                        <td>

                                            {reservation.room
                                                ? reservation
                                                    .room
                                                    .roomNumber
                                                : reservation.roomId}

                                        </td>

                                        {/* Check In */}

                                        <td>
                                            {formatDate(
                                                reservation.checkIn
                                            )}
                                        </td>

                                        {/* Check Out */}

                                        <td>
                                            {formatDate(
                                                reservation.checkOut
                                            )}
                                        </td>

                                        {/* Adults */}

                                        <td>
                                            {
                                                reservation.adults
                                            }
                                        </td>

                                        {/* Children */}

                                        <td>
                                            {
                                                reservation.children
                                            }
                                        </td>

                                        {/* Amount */}

                                        <td>
                                            KSh{" "}
                                            {Number(
                                                reservation.totalAmount
                                            ).toLocaleString()}
                                        </td>

                                        {/* Status */}

                                        <td>

                                            <span
                                                className={getStatusClass(
                                                    reservation.status
                                                )}
                                            >
                                                {
                                                    reservation.status
                                                }
                                            </span>

                                        </td>

                                        {/* Actions */}

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleEdit(
                                                            reservation
                                                        )
                                                    }
                                                    disabled={
                                                        reservation.status ===
                                                        "CANCELLED"
                                                    }
                                                    className="edit-button"
                                                >
                                                    Edit
                                                </button>

                                                {reservation.status !==
                                                    "CANCELLED" && (

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleCancel(
                                                                reservation.id
                                                            )
                                                        }
                                                        disabled={
                                                            loading
                                                        }
                                                        className="cancel-button"
                                                    >
                                                        Cancel
                                                    </button>

                                                )}

                                            </div>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}