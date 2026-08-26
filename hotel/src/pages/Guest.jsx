import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Guest() {
    const API_URL = "http://localhost:8000/guest";

    // ==============================
    // STATE
    // ==============================

    const [guests, setGuests] = useState([]);

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        idNumber: "",
        nationality: "",
        address: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");

    const [loading, setLoading] = useState(false);

    const [message, setMessage] = useState("");

    const [error, setError] = useState("");

    // ==============================
    // FETCH GUESTS
    // ==============================

    const fetchGuests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const text = await response.text();

            console.log("Guest server response:", text);

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
                    data.message || "Failed to fetch guests"
                );
            }

            // Supports:
            // []
            // { guests: [] }

            if (Array.isArray(data)) {
                setGuests(data);
            } else {
                setGuests(data.guests || []);
            }

        } catch (err) {
            console.error(
                "FETCH GUESTS ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // LOAD GUESTS
    // ==============================

    useEffect(() => {
        fetchGuests();
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
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            idNumber: "",
            nationality: "",
            address: ""
        });

        setEditingId(null);

        setError("");

        setMessage("");
    };

    // ==============================
    // VALIDATE FORM
    // ==============================

    const validateForm = () => {
        if (!formData.firstName.trim()) {
            return "First name is required";
        }

        if (!formData.lastName.trim()) {
            return "Last name is required";
        }

        if (!formData.phone.trim()) {
            return "Phone number is required";
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
                formData.email.trim()
            )
        ) {
            return "Please enter a valid email address";
        }

        return "";
    };

    // ==============================
    // CREATE GUEST
    // ==============================

    const createGuest = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const validationError = validateForm();

            if (validationError) {
                throw new Error(validationError);
            }

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    firstName:
                        formData.firstName.trim(),

                    lastName:
                        formData.lastName.trim(),

                    email:
                        formData.email.trim() || null,

                    phone:
                        formData.phone.trim(),

                    idNumber:
                        formData.idNumber.trim() || null,

                    nationality:
                        formData.nationality.trim() || null,

                    address:
                        formData.address.trim() || null
                })
            });

            const text = await response.text();

            console.log(
                "Create guest response:",
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
                    "Failed to create guest"
                );
            }

            setMessage(
                "Guest created successfully!"
            );

            resetForm();

            await fetchGuests();

        } catch (err) {
            console.error(
                "CREATE GUEST ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // UPDATE GUEST
    // ==============================

    const updateGuest = async () => {
        try {
            setLoading(true);
            setError("");
            setMessage("");

            const validationError = validateForm();

            if (validationError) {
                throw new Error(validationError);
            }

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        firstName:
                            formData.firstName.trim(),

                        lastName:
                            formData.lastName.trim(),

                        email:
                            formData.email.trim() || null,

                        phone:
                            formData.phone.trim(),

                        idNumber:
                            formData.idNumber.trim() || null,

                        nationality:
                            formData.nationality.trim() ||
                            null,

                        address:
                            formData.address.trim() ||
                            null
                    })
                }
            );

            const text = await response.text();

            console.log(
                "Update guest response:",
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
                    "Failed to update guest"
                );
            }

            setMessage(
                "Guest updated successfully!"
            );

            resetForm();

            await fetchGuests();

        } catch (err) {
            console.error(
                "UPDATE GUEST ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // SUBMIT FORM
    // ==============================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        if (editingId) {
            await updateGuest();
        } else {
            await createGuest();
        }
    };

    // ==============================
    // EDIT GUEST
    // ==============================

    const handleEdit = (guest) => {
        setEditingId(guest.id);

        setFormData({
            firstName:
                guest.firstName || "",

            lastName:
                guest.lastName || "",

            email:
                guest.email || "",

            phone:
                guest.phone || "",

            idNumber:
                guest.idNumber || "",

            nationality:
                guest.nationality || "",

            address:
                guest.address || ""
        });

        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==============================
    // DELETE GUEST
    // ==============================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this guest?"
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

            console.log(
                "Delete guest response:",
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
                    "Failed to delete guest"
                );
            }

            setMessage(
                "Guest deleted successfully!"
            );

            await fetchGuests();

        } catch (err) {
            console.error(
                "DELETE GUEST ERROR:",
                err
            );

            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // ==============================
    // SEARCH
    // ==============================

    const filteredGuests = guests.filter(
        (guest) => {
            const search =
                searchTerm
                    .toLowerCase()
                    .trim();

            if (!search) {
                return true;
            }

            return (
                String(guest.id)
                    .toLowerCase()
                    .includes(search) ||

                (guest.firstName || "")
                    .toLowerCase()
                    .includes(search) ||

                (guest.lastName || "")
                    .toLowerCase()
                    .includes(search) ||

                (guest.email || "")
                    .toLowerCase()
                    .includes(search) ||

                (guest.phone || "")
                    .toLowerCase()
                    .includes(search) ||

                (guest.idNumber || "")
                    .toLowerCase()
                    .includes(search) ||

                (guest.nationality || "")
                    .toLowerCase()
                    .includes(search)
            );
        }
    );

    // ==============================
    // JSX
    // ==============================

    return (
        <div className="guest-container">

            {/* ==========================
                HEADER
            ========================== */}

            <div className="guest-header">

                <div>

                    <Link
                        to="/"
                        className="btn btn-secondary"
                    >
                        Back Home
                    </Link>

                    <h1>
                        Guests
                    </h1>

                    <p>
                        Manage hotel guests and
                        their information
                    </p>

                </div>


                <div className="guest-count">

                    <strong>
                        {guests.length}
                    </strong>

                    <span>
                        Total Guests
                    </span>

                </div>

            </div>


            {/* ==========================
                MESSAGES
            ========================== */}

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


            {/* ==========================
                FORM
            ========================== */}

            <div className="guest-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Guest"
                            : "Register Guest"}
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


                <form
                    onSubmit={handleSubmit}
                >

                    {/* FIRST NAME */}

                    <div className="form-group">

                        <label>
                            First Name *
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="firstName"
                            value={
                                formData.firstName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter first name"
                            required
                        />

                    </div>


                    {/* LAST NAME */}

                    <div className="form-group">

                        <label>
                            Last Name *
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="lastName"
                            value={
                                formData.lastName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter last name"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="form-group">

                        <label>
                            Email
                        </label>

                        <input
                            className="form-input"
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="guest@example.com"
                        />

                    </div>


                    {/* PHONE */}

                    <div className="form-group">

                        <label>
                            Phone *
                        </label>

                        <input
                            className="form-input"
                            type="tel"
                            name="phone"
                            value={
                                formData.phone
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. 0712345678"
                            required
                        />

                    </div>


                    {/* ID NUMBER */}

                    <div className="form-group">

                        <label>
                            ID / Passport Number
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="idNumber"
                            value={
                                formData.idNumber
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter ID or passport number"
                        />

                    </div>


                    {/* NATIONALITY */}

                    <div className="form-group">

                        <label>
                            Nationality
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="nationality"
                            value={
                                formData.nationality
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Kenyan"
                        />

                    </div>


                    {/* ADDRESS */}

                    <div className="form-group">

                        <label>
                            Address
                        </label>

                        <textarea
                            className="form-input"
                            name="address"
                            value={
                                formData.address
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Enter guest address"
                            rows="4"
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
                                ? "Update Guest"
                                : "Register Guest"}
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


            {/* ==========================
                GUEST LIST
            ========================== */}

            <div className="guest-list">

                <div className="list-header">

                    <div>

                        <h2>
                            All Guests
                        </h2>

                    </div>


                    <button
                        onClick={fetchGuests}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        {loading
                            ? "Loading..."
                            : "Refresh"}
                    </button>

                </div>


                {/* SEARCH */}

                <div className="search-box">

                    <input
                        className="form-input"
                        type="text"
                        value={searchTerm}
                        onChange={(e) =>
                            setSearchTerm(
                                e.target.value
                            )
                        }
                        placeholder="Search by name, phone, email, ID..."
                    />

                </div>


                {/* LOADING */}

                {loading &&
                guests.length === 0 ? (

                    <div className="loading">
                        Loading guests...
                    </div>

                ) : filteredGuests.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No guests found
                        </h3>

                        <p>
                            {searchTerm
                                ? "No guests match your search."
                                : "Register a guest to see them here."}
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
                                        Email
                                    </th>

                                    <th>
                                        Phone
                                    </th>

                                    <th>
                                        ID / Passport
                                    </th>

                                    <th>
                                        Nationality
                                    </th>

                                    <th>
                                        Address
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredGuests.map(
                                    (guest) => (

                                        <tr
                                            key={
                                                guest.id
                                            }
                                        >

                                            <td>
                                                {
                                                    guest.id
                                                }
                                            </td>


                                            <td>

                                                <strong>
                                                    {
                                                        guest.firstName
                                                    }{" "}
                                                    {
                                                        guest.lastName
                                                    }
                                                </strong>

                                            </td>


                                            <td>
                                                {
                                                    guest.email ||
                                                    "N/A"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    guest.phone
                                                }
                                            </td>


                                            <td>
                                                {
                                                    guest.idNumber ||
                                                    "N/A"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    guest.nationality ||
                                                    "N/A"
                                                }
                                            </td>


                                            <td>
                                                {
                                                    guest.address ||
                                                    "N/A"
                                                }
                                            </td>


                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                guest
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
                                                                guest.id
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