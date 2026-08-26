import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Service() {
    const API_URL = "http://localhost:8000/service";

    // ==========================================
    // STATE
    // ==========================================

    const [services, setServices] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // FETCH ALL SERVICES
    // ==========================================

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const text = await response.text();

            console.log("Service response:", text);

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Server returned non-JSON response: ${text.slice(
                        0,
                        200
                    )}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch services"
                );
            }

            setServices(
                Array.isArray(data)
                    ? data
                    : data.services || []
            );
        } catch (err) {
            console.error("FETCH SERVICES ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD SERVICES
    // ==========================================

    useEffect(() => {
        fetchServices();
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
            name: "",
            description: "",
            price: "",
        });

        setEditingId(null);
        setMessage("");
        setError("");
    };

    // ==========================================
    // CREATE SERVICE
    // ==========================================

    const createService = async () => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const price = Number(formData.price);

            if (!Number.isFinite(price) || price < 0) {
                throw new Error(
                    "Price must be a valid positive number"
                );
            }

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    name: formData.name.trim(),
                    description:
                        formData.description.trim() || null,
                    price,
                }),
            });

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Server returned non-JSON response: ${text.slice(
                        0,
                        200
                    )}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create service"
                );
            }

            setMessage(
                "Service created successfully!"
            );

            resetForm();

            await fetchServices();
        } catch (err) {
            console.error("CREATE SERVICE ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UPDATE SERVICE
    // ==========================================

    const updateService = async () => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const price = Number(formData.price);

            if (!Number.isFinite(price) || price < 0) {
                throw new Error(
                    "Price must be a valid positive number"
                );
            }

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        name: formData.name.trim(),
                        description:
                            formData.description.trim() || null,
                        price,
                    }),
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Server returned non-JSON response: ${text.slice(
                        0,
                        200
                    )}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update service"
                );
            }

            setMessage(
                "Service updated successfully!"
            );

            resetForm();

            await fetchServices();
        } catch (err) {
            console.error("UPDATE SERVICE ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SUBMIT FORM
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.name.trim()) {
            setError("Service name is required");
            return;
        }

        if (!formData.price) {
            setError("Service price is required");
            return;
        }

        const price = Number(formData.price);

        if (!Number.isFinite(price) || price < 0) {
            setError("Price must be a valid number");
            return;
        }

        if (editingId) {
            await updateService();
        } else {
            await createService();
        }
    };

    // ==========================================
    // EDIT SERVICE
    // ==========================================

    const handleEdit = (service) => {
        setEditingId(service.id);

        setFormData({
            name: service.name || "",
            description: service.description || "",
            price:
                service.price !== null &&
                service.price !== undefined
                    ? service.price
                    : "",
        });

        setMessage("");
        setError("");

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // ==========================================
    // DELETE SERVICE
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this service?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setLoading(true);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                }
            );

            const text = await response.text();

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    `Server returned non-JSON response: ${text.slice(
                        0,
                        200
                    )}`
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete service"
                );
            }

            setMessage(
                "Service deleted successfully!"
            );

            await fetchServices();
        } catch (err) {
            console.error("DELETE SERVICE ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // FORMAT PRICE
    // ==========================================

    const formatPrice = (price) => {
        const number = Number(price);

        if (!Number.isFinite(number)) {
            return "KSh 0.00";
        }

        return `KSh ${number.toLocaleString("en-KE", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;
    };

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="service-container">

            {/* HEADER */}

            <div className="service-header">

                <Link
                    to="/"
                    className="btn btn-secondary"
                >
                    Back Home
                </Link>

                <div>
                    <h1>Hotel Services</h1>

                    <p>
                        Manage hotel services and their prices
                    </p>
                </div>

                <div className="service-count">
                    <strong>
                        {services.length}
                    </strong>

                    <span>
                        Total Services
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

            <div className="service-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Service"
                            : "Create Service"}
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

                    {/* SERVICE NAME */}

                    <div className="form-group">

                        <label>
                            Service Name
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Room Service"
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
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter service description"
                            rows="4"
                        />

                    </div>

                    {/* PRICE */}

                    <div className="form-group">

                        <label>
                            Price
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="Enter price"
                            min="0"
                            step="0.01"
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
                                ? "Update Service"
                                : "Create Service"}
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

            {/* SERVICE LIST */}

            <div className="service-list">

                <div className="list-header">

                    <h2>
                        All Services
                    </h2>

                    <button
                        onClick={fetchServices}
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
                services.length === 0 ? (
                    <p className="loading">
                        Loading services...
                    </p>
                ) : services.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No services found
                        </h3>

                        <p>
                            Create a service to see it
                            here.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {services.map(
                                    (service) => (

                                        <tr
                                            key={
                                                service.id
                                            }
                                        >

                                            <td>
                                                {
                                                    service.id
                                                }
                                            </td>

                                            <td>
                                                <strong>
                                                    {
                                                        service.name
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                {
                                                    service.description ||
                                                    "No description"
                                                }
                                            </td>

                                            <td>
                                                {formatPrice(
                                                    service.price
                                                )}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                service
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
                                                                service.id
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