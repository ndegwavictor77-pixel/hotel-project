import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function RoomType() {
    const API_URL = "http://localhost:8000/roomtype";

    // ==============================
    // STATE
    // ==============================

    const [roomTypes, setRoomTypes] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        pricePerNight: "",
        capacity: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================
    // FETCH ROOM TYPES
    // ==============================

    const fetchRoomTypes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const text = await response.text();

            console.log("Room type response:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch (parseError) {
                console.error("JSON PARSE ERROR:", parseError);

                throw new Error(
                    "Server returned a non-JSON response. Check your backend."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch room types"
                );
            }

            setRoomTypes(data.roomTypes || []);

        } catch (err) {
            console.error("FETCH ROOM TYPES ERROR:", err);
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {
        fetchRoomTypes();
    }, []);

    // ==============================
    // HANDLE INPUT
    // ==============================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==============================
    // RESET FORM
    // ==============================

    const resetForm = () => {
        setFormData({
            name: "",
            description: "",
            pricePerNight: "",
            capacity: ""
        });

        setEditingId(null);
        setError("");
        setMessage("");
    };

    // ==============================
    // CREATE ROOM TYPE
    // ==============================

    const createRoomType = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const price = Number(formData.pricePerNight);
            const capacity = Number(formData.capacity);

            if (!formData.name.trim()) {
                throw new Error("Room type name is required");
            }

            if (
                formData.pricePerNight === "" ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                throw new Error(
                    "Price per night must be a valid number"
                );
            }

            if (
                formData.capacity === "" ||
                !Number.isInteger(capacity) ||
                capacity < 1
            ) {
                throw new Error(
                    "Capacity must be a valid number"
                );
            }

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: formData.name.trim(),

                    description:
                        formData.description.trim(),

                    pricePerNight: price,

                    capacity: capacity
                })
            });

            const text = await response.text();

            console.log(
                "Create room type response:",
                text
            );

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
                    data.message ||
                    "Failed to create room type"
                );
            }

            setMessage(
                "Room type created successfully!"
            );

            resetForm();

            await fetchRoomTypes();

        } catch (err) {
            console.error(
                "CREATE ROOM TYPE ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // UPDATE ROOM TYPE
    // ==============================

    const updateRoomType = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const price = Number(formData.pricePerNight);
            const capacity = Number(formData.capacity);

            if (!formData.name.trim()) {
                throw new Error(
                    "Room type name is required"
                );
            }

            if (
                formData.pricePerNight === "" ||
                !Number.isFinite(price) ||
                price < 0
            ) {
                throw new Error(
                    "Price per night must be a valid number"
                );
            }

            if (
                formData.capacity === "" ||
                !Number.isInteger(capacity) ||
                capacity < 1
            ) {
                throw new Error(
                    "Capacity must be a valid number"
                );
            }

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        name: formData.name.trim(),

                        description:
                            formData.description.trim(),

                        pricePerNight: price,

                        capacity: capacity
                    })
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
                    data.message ||
                    "Failed to update room type"
                );
            }

            setMessage(
                "Room type updated successfully!"
            );

            resetForm();

            await fetchRoomTypes();

        } catch (err) {
            console.error(
                "UPDATE ROOM TYPE ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // SUBMIT
    // ==============================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (editingId) {
            await updateRoomType();
        } else {
            await createRoomType();
        }
    };

    // ==============================
    // EDIT
    // ==============================

    const handleEdit = (roomType) => {
        setEditingId(roomType.id);

        setFormData({
            name: roomType.name || "",

            description:
                roomType.description || "",

            pricePerNight:
                roomType.pricePerNight ?? "",

            capacity:
                roomType.capacity ?? ""
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==============================
    // DELETE
    // ==============================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this room type?"
        );

        if (!confirmed) {
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
                    data.message ||
                    "Failed to delete room type"
                );
            }

            setMessage(
                "Room type deleted successfully!"
            );

            await fetchRoomTypes();

        } catch (err) {
            console.error(
                "DELETE ROOM TYPE ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // FORMAT PRICE
    // ==============================

    const formatPrice = (price) => {
        const number = Number(price);

        if (!Number.isFinite(number)) {
            return "0";
        }

        return number.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    // ==============================
    // JSX
    // ==============================

    return (
        <div className="roomtype-container">

            {/* HEADER */}

            <div className="roomtype-header">

                <div>

                    <Link
                        to="/"
                        className="btn btn-secondary"
                    >
                        Back Home
                    </Link>

                    <h1>Room Types</h1>

                    <p>
                        Manage hotel room categories
                        and pricing
                    </p>

                </div>

                <div className="roomtype-count">

                    <strong>
                        {roomTypes.length}
                    </strong>

                    <span>
                        Total Room Types
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

            <div className="roomtype-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Room Type"
                            : "Create Room Type"}
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

                    {/* NAME */}

                    <div className="form-group">

                        <label>
                            Room Type Name
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Deluxe"
                            required
                        />

                    </div>


                    {/* DESCRIPTION */}

                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            className="form-input"
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder="Describe the room type"
                            rows="4"
                        />

                    </div>


                    {/* PRICE */}

                    <div className="form-group">

                        <label>
                            Price Per Night
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="pricePerNight"
                            value={
                                formData.pricePerNight
                            }
                            onChange={handleChange}
                            placeholder="e.g. 5000"
                            min="0"
                            step="0.01"
                            required
                        />

                    </div>


                    {/* CAPACITY */}

                    <div className="form-group">

                        <label>
                            Capacity
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="capacity"
                            value={
                                formData.capacity
                            }
                            onChange={handleChange}
                            placeholder="e.g. 2"
                            min="1"
                            step="1"
                            required
                        />

                    </div>


                    {/* BUTTONS */}

                    <div className="form-buttons">

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn btn-primary"
                        >
                            {loading
                                ? "Processing..."
                                : editingId
                                ? "Update Room Type"
                                : "Create Room Type"}
                        </button>


                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={loading}
                            className="btn btn-secondary"
                        >
                            Clear
                        </button>

                    </div>

                </form>

            </div>


            {/* ROOM TYPE LIST */}

            <div className="roomtype-list">

                <div className="list-header">

                    <h2>
                        All Room Types
                    </h2>

                    <button
                        onClick={fetchRoomTypes}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </button>

                </div>


                {/* LOADING */}

                {loading &&
                roomTypes.length === 0 ? (

                    <div className="loading">
                        Loading room types...
                    </div>

                ) : roomTypes.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No room types found
                        </h3>

                        <p>
                            Create a room type to see
                            it here.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        ID
                                    </th>

                                    <th>
                                        Name
                                    </th>

                                    <th>
                                        Description
                                    </th>

                                    <th>
                                        Price / Night
                                    </th>

                                    <th>
                                        Capacity
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {roomTypes.map(
                                    (roomType) => (

                                        <tr
                                            key={
                                                roomType.id
                                            }
                                        >

                                            <td>
                                                {
                                                    roomType.id
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        roomType.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    roomType.description ||
                                                    "No description"
                                                }
                                            </td>

                                            <td>
                                                KSh{" "}
                                                {formatPrice(
                                                    roomType.pricePerNight
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    roomType.capacity
                                                }{" "}
                                                guest(s)
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                roomType
                                                            )
                                                        }
                                                        className="edit-button"
                                                    >
                                                        Edit
                                                    </button>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                roomType.id
                                                            )
                                                        }
                                                        className="delete-button"
                                                    >
                                                        Delete
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>

                    </div>

                )}

            </div>

        </div>
    );
}