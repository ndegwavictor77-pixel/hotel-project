import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Room() {
    const API_URL = "http://localhost:8000/room";
    const ROOM_TYPE_URL = "http://localhost:8000/roomtype";

    // ==============================
    // STATE
    // ==============================

    const [rooms, setRooms] = useState([]);
    const [roomTypes, setRoomTypes] = useState([]);

    const [formData, setFormData] = useState({
        roomNumber: "",
        floor: "",
        status: "AVAILABLE",
        roomTypeId: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================
    // FETCH ROOMS
    // ==============================

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);
            const text = await response.text();

            console.log("Rooms response:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    "Server returned a non-JSON response while fetching rooms."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch rooms"
                );
            }

            setRooms(
                Array.isArray(data)
                    ? data
                    : data.rooms || []
            );

        } catch (err) {
            console.error("FETCH ROOMS ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // FETCH ROOM TYPES
    // ==============================

    const fetchRoomTypes = async () => {
        try {
            const response = await fetch(ROOM_TYPE_URL);
            const text = await response.text();

            console.log("Room types response:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    "Server returned a non-JSON response while fetching room types."
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch room types"
                );
            }

            setRoomTypes(
                Array.isArray(data)
                    ? data
                    : data.roomTypes || []
            );

        } catch (err) {
            console.error(
                "FETCH ROOM TYPES ERROR:",
                err
            );

            setError(err.message);
        }
    };

    // ==============================
    // LOAD DATA
    // ==============================

    useEffect(() => {
        fetchRooms();
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
            roomNumber: "",
            floor: "",
            status: "AVAILABLE",
            roomTypeId: ""
        });

        setEditingId(null);
        setError("");
        setMessage("");
    };

    // ==============================
    // CREATE ROOM
    // ==============================

    const createRoom = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            if (!formData.roomNumber.trim()) {
                throw new Error(
                    "Room number is required"
                );
            }

            const floor = Number(formData.floor);
            const roomTypeId = Number(
                formData.roomTypeId
            );

            if (
                formData.floor === "" ||
                !Number.isInteger(floor)
            ) {
                throw new Error(
                    "Floor must be a valid number"
                );
            }

            if (
                formData.roomTypeId === "" ||
                !Number.isInteger(roomTypeId) ||
                roomTypeId < 1
            ) {
                throw new Error(
                    "Please select a room type"
                );
            }

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    roomNumber:
                        formData.roomNumber.trim(),

                    floor: floor,

                    status: formData.status,

                    roomTypeId: roomTypeId
                })
            });

            const text = await response.text();

            console.log(
                "Create room response:",
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
                    "Failed to create room"
                );
            }

            setMessage(
                "Room created successfully!"
            );

            resetForm();

            await fetchRooms();

        } catch (err) {
            console.error(
                "CREATE ROOM ERROR:",
                err
            );

            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // UPDATE ROOM
    // ==============================

    const updateRoom = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const floor = Number(formData.floor);
            const roomTypeId = Number(
                formData.roomTypeId
            );

            if (!formData.roomNumber.trim()) {
                throw new Error(
                    "Room number is required"
                );
            }

            if (
                formData.floor === "" ||
                !Number.isInteger(floor)
            ) {
                throw new Error(
                    "Floor must be a valid number"
                );
            }

            if (
                formData.roomTypeId === "" ||
                !Number.isInteger(roomTypeId) ||
                roomTypeId < 1
            ) {
                throw new Error(
                    "Please select a room type"
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
                        roomNumber:
                            formData.roomNumber.trim(),

                        floor: floor,

                        status: formData.status,

                        roomTypeId: roomTypeId
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
                    "Failed to update room"
                );
            }

            setMessage(
                "Room updated successfully!"
            );

            resetForm();

            await fetchRooms();

        } catch (err) {
            console.error(
                "UPDATE ROOM ERROR:",
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
            await updateRoom();
        } else {
            await createRoom();
        }
    };

    // ==============================
    // EDIT ROOM
    // ==============================

    const handleEdit = (room) => {
        setEditingId(room.id);

        setFormData({
            roomNumber: room.roomNumber || "",

            floor:
                room.floor !== undefined
                    ? room.floor
                    : "",

            status:
                room.status || "AVAILABLE",

            roomTypeId:
                room.roomTypeId !== undefined
                    ? room.roomTypeId
                    : room.roomType?.id || ""
        });

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==============================
    // DELETE ROOM
    // ==============================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this room?"
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
                    "Failed to delete room"
                );
            }

            setMessage(
                "Room deleted successfully!"
            );

            await fetchRooms();

        } catch (err) {
            console.error(
                "DELETE ROOM ERROR:",
                err
            );

            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // STATUS CLASS
    // ==============================

    const getStatusClass = (status) => {
        switch (status) {
            case "AVAILABLE":
                return "status available";

            case "OCCUPIED":
                return "status occupied";

            case "RESERVED":
                return "status reserved";

            case "MAINTENANCE":
                return "status maintenance";

            default:
                return "status";
        }
    };

    // ==============================
    // JSX
    // ==============================

    return (
        <div className="room-container">

            {/* HEADER */}

            <div className="room-header">

                <div>

                    <Link
                        to="/"
                        className="btn btn-secondary"
                    >
                        Back Home
                    </Link>

                    <h1>Rooms</h1>

                    <p>
                        Manage hotel rooms and
                        availability
                    </p>

                </div>

                <div className="room-count">

                    <strong>
                        {rooms.length}
                    </strong>

                    <span>
                        Total Rooms
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

            <div className="room-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Room"
                            : "Create Room"}
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

                    {/* ROOM NUMBER */}

                    <div className="form-group">

                        <label>
                            Room Number
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="roomNumber"
                            value={
                                formData.roomNumber
                            }
                            onChange={handleChange}
                            placeholder="e.g. 101"
                            required
                        />

                    </div>


                    {/* FLOOR */}

                    <div className="form-group">

                        <label>
                            Floor
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="floor"
                            value={formData.floor}
                            onChange={handleChange}
                            placeholder="e.g. 1"
                            min="0"
                            step="1"
                            required
                        />

                    </div>


                    {/* ROOM TYPE */}

                    <div className="form-group">

                        <label>
                            Room Type
                        </label>

                        <select
                            className="form-input"
                            name="roomTypeId"
                            value={
                                formData.roomTypeId
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                -- Select Room Type --
                            </option>

                            {roomTypes.map(
                                (roomType) => (

                                    <option
                                        key={
                                            roomType.id
                                        }
                                        value={
                                            roomType.id
                                        }
                                    >
                                        {roomType.name}
                                        {" - KSh "}
                                        {
                                            roomType.pricePerNight
                                        }
                                        /night
                                    </option>

                                )
                            )}

                        </select>

                        {roomTypes.length === 0 && (
                            <small>
                                No room types found.
                                Create a room type
                                first.
                            </small>
                        )}

                    </div>


                    {/* STATUS */}

                    <div className="form-group">

                        <label>
                            Status
                        </label>

                        <select
                            className="form-input"
                            name="status"
                            value={
                                formData.status
                            }
                            onChange={handleChange}
                        >

                            <option value="AVAILABLE">
                                Available
                            </option>

                            <option value="OCCUPIED">
                                Occupied
                            </option>

                            <option value="RESERVED">
                                Reserved
                            </option>

                            <option value="MAINTENANCE">
                                Maintenance
                            </option>

                        </select>

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
                                ? "Update Room"
                                : "Create Room"}
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


            {/* ROOM LIST */}

            <div className="room-list">

                <div className="list-header">

                    <h2>
                        All Rooms
                    </h2>

                    <button
                        onClick={fetchRooms}
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
                rooms.length === 0 ? (

                    <div className="loading">
                        Loading rooms...
                    </div>

                ) : rooms.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No rooms found
                        </h3>

                        <p>
                            Create a room to see it
                            here.
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
                                        Room Number
                                    </th>

                                    <th>
                                        Floor
                                    </th>

                                    <th>
                                        Room Type
                                    </th>

                                    <th>
                                        Price/Night
                                    </th>

                                    <th>
                                        Capacity
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {rooms.map(
                                    (room) => (

                                        <tr
                                            key={
                                                room.id
                                            }
                                        >

                                            {/* ID */}

                                            <td>
                                                {
                                                    room.id
                                                }
                                            </td>


                                            {/* ROOM NUMBER */}

                                            <td>
                                                <strong>
                                                    {
                                                        room.roomNumber
                                                    }
                                                </strong>
                                            </td>


                                            {/* FLOOR */}

                                            <td>
                                                {
                                                    room.floor
                                                }
                                            </td>


                                            {/* ROOM TYPE */}

                                            <td>

                                                {room.roomType
                                                    ? room
                                                          .roomType
                                                          .name
                                                    : room.roomTypeId}

                                            </td>


                                            {/* PRICE */}

                                            <td>

                                                {room.roomType
                                                    ? `KSh ${Number(
                                                          room
                                                              .roomType
                                                              .pricePerNight
                                                      ).toLocaleString(
                                                          "en-KE",
                                                          {
                                                              minimumFractionDigits: 2
                                                          }
                                                      )}`
                                                    : "N/A"}

                                            </td>


                                            {/* CAPACITY */}

                                            <td>

                                                {room.roomType
                                                    ? room
                                                          .roomType
                                                          .capacity
                                                    : "N/A"}

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        room.status
                                                    )}
                                                >
                                                    {
                                                        room.status
                                                    }
                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                room
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
                                                                room.id
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