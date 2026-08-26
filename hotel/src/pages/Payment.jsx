import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Payment() {
    const API_URL = "http://localhost:8000/payment";

    const [payments, setPayments] = useState([]);

    const [formData, setFormData] = useState({
        amount: "",
        paymentMethod: "CASH",
        paymentStatus: "PENDING",
        transactionCode: "",
        paidAt: "",
        reservationId: ""
    });

    const [editingId, setEditingId] = useState(null);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==========================================
    // FETCH PAYMENTS
    // ==========================================

    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(API_URL);

            const text = await response.text();

            console.log("Payment response:", text);

            if (!response.ok) {
                throw new Error(
                    `Server error ${response.status}: ${text}`
                );
            }

            let data;

            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(
                    "Server returned non-JSON response"
                );
            }

            console.log("Payments:", data);

            if (Array.isArray(data)) {
                setPayments(data);
            } else {
                setPayments(data.payments || []);
            }

        } catch (err) {
            console.error("FETCH PAYMENTS ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    // ==========================================
    // HANDLE INPUT
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // ==========================================
    // RESET FORM
    // ==========================================

    const resetForm = () => {
        setFormData({
            amount: "",
            paymentMethod: "CASH",
            paymentStatus: "PENDING",
            transactionCode: "",
            paidAt: "",
            reservationId: ""
        });

        setEditingId(null);
    };

    // ==========================================
    // CREATE PAYMENT
    // ==========================================

    const createPayment = async () => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const response = await fetch(API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    amount: Number(formData.amount),

                    paymentMethod:
                        formData.paymentMethod,

                    paymentStatus:
                        formData.paymentStatus,

                    transactionCode:
                        formData.transactionCode || null,

                    paidAt: formData.paidAt
                        ? formData.paidAt
                        : null,

                    reservationId:
                        Number(formData.reservationId)
                })
            });

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
                    "Failed to create payment"
                );
            }

            setMessage(
                "Payment created successfully!"
            );

            resetForm();

            await fetchPayments();

        } catch (err) {
            console.error("CREATE PAYMENT ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UPDATE PAYMENT
    // ==========================================

    const updatePayment = async () => {
        try {
            setLoading(true);
            setMessage("");
            setError("");

            const response = await fetch(
                `${API_URL}/${editingId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        amount: Number(formData.amount),

                        paymentMethod:
                            formData.paymentMethod,

                        paymentStatus:
                            formData.paymentStatus,

                        transactionCode:
                            formData.transactionCode || null,

                        paidAt: formData.paidAt
                            ? formData.paidAt
                            : null,

                        reservationId:
                            Number(formData.reservationId)
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
                    "Failed to update payment"
                );
            }

            setMessage(
                "Payment updated successfully!"
            );

            resetForm();

            await fetchPayments();

        } catch (err) {
            console.error("UPDATE PAYMENT ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        if (!formData.amount) {
            setError("Payment amount is required");
            return;
        }

        if (Number(formData.amount) <= 0) {
            setError(
                "Payment amount must be greater than 0"
            );
            return;
        }

        if (!formData.reservationId) {
            setError(
                "Reservation ID is required"
            );
            return;
        }

        if (
            editingId !== null &&
            editingId !== undefined
        ) {
            await updatePayment();
        } else {
            await createPayment();
        }
    };

    // ==========================================
    // EDIT
    // ==========================================

    const handleEdit = (payment) => {
        setEditingId(payment.id);

        setMessage("");
        setError("");

        setFormData({
            amount: payment.amount ?? "",

            paymentMethod:
                payment.paymentMethod || "CASH",

            paymentStatus:
                payment.paymentStatus || "PENDING",

            transactionCode:
                payment.transactionCode || "",

            paidAt: payment.paidAt
                ? new Date(payment.paidAt)
                    .toISOString()
                    .slice(0, 16)
                : "",

            reservationId:
                payment.reservationId || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // DELETE PAYMENT
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this payment?"
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
                    "Failed to delete payment"
                );
            }

            setMessage(
                "Payment deleted successfully!"
            );

            await fetchPayments();

        } catch (err) {
            console.error("DELETE PAYMENT ERROR:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {
            case "PAID":
                return "status paid";

            case "FAILED":
                return "status failed";

            case "PENDING":
            default:
                return "status pending";
        }
    };

    // ==========================================
    // PAYMENT METHOD LABEL
    // ==========================================

    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case "MPESA":
                return "M-Pesa";

            case "CARD":
                return "Card";

            case "BANK":
                return "Bank";

            case "CASH":
                return "Cash";

            default:
                return method;
        }
    };

    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (date) => {
        if (!date) {
            return "N/A";
        }

        const parsedDate = new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "N/A";
        }

        return parsedDate.toLocaleString();
    };

    // ==========================================
    // JSX
    // ==========================================

    return (
        <div className="payment-container">

            {/* HEADER */}

            <div className="payment-header">

                <Link
                    to="/"
                    className="btn btn-secondary"
                >
                    Back Home
                </Link>

                <div>
                    <h1>Payments</h1>

                    <p>
                        Manage hotel reservation payments
                    </p>
                </div>

                <div className="payment-count">

                    <strong>
                        {payments.length}
                    </strong>

                    <span>
                        Total Payments
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

            <div className="payment-form">

                <div className="form-header">

                    <h2>
                        {editingId
                            ? "Update Payment"
                            : "Record Payment"}
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

                    {/* RESERVATION ID */}

                    <div className="form-group">

                        <label>
                            Reservation ID
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="reservationId"
                            value={
                                formData.reservationId
                            }
                            onChange={handleChange}
                            min="1"
                            placeholder="Enter reservation ID"
                            required
                        />

                    </div>

                    {/* AMOUNT */}

                    <div className="form-group">

                        <label>
                            Amount
                        </label>

                        <input
                            className="form-input"
                            type="number"
                            name="amount"
                            value={formData.amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="Enter payment amount"
                            required
                        />

                    </div>

                    {/* PAYMENT METHOD */}

                    <div className="form-group">

                        <label>
                            Payment Method
                        </label>

                        <select
                            className="form-input"
                            name="paymentMethod"
                            value={
                                formData.paymentMethod
                            }
                            onChange={handleChange}
                        >

                            <option value="CASH">
                                Cash
                            </option>

                            <option value="MPESA">
                                M-Pesa
                            </option>

                            <option value="CARD">
                                Card
                            </option>

                            <option value="BANK">
                                Bank
                            </option>

                        </select>

                    </div>

                    {/* PAYMENT STATUS */}

                    <div className="form-group">

                        <label>
                            Payment Status
                        </label>

                        <select
                            className="form-input"
                            name="paymentStatus"
                            value={
                                formData.paymentStatus
                            }
                            onChange={handleChange}
                        >

                            <option value="PENDING">
                                Pending
                            </option>

                            <option value="PAID">
                                Paid
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>

                        </select>

                    </div>

                    {/* TRANSACTION CODE */}

                    <div className="form-group">

                        <label>
                            Transaction Code
                        </label>

                        <input
                            className="form-input"
                            type="text"
                            name="transactionCode"
                            value={
                                formData.transactionCode
                            }
                            onChange={handleChange}
                            placeholder="e.g. QWE123XYZ"
                        />

                    </div>

                    {/* PAID AT */}

                    <div className="form-group">

                        <label>
                            Paid At
                        </label>

                        <input
                            className="form-input"
                            type="datetime-local"
                            name="paidAt"
                            value={formData.paidAt}
                            onChange={handleChange}
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
                                    ? "Update Payment"
                                    : "Record Payment"}
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

            {/* PAYMENT LIST */}

            <div className="payment-list">

                <div className="list-header">

                    <h2>
                        All Payments
                    </h2>

                    <button
                        onClick={fetchPayments}
                        disabled={loading}
                        className="btn btn-primary"
                    >
                        Refresh
                    </button>

                </div>

                {loading && payments.length === 0 ? (

                    <p className="loading">
                        Loading payments...
                    </p>

                ) : payments.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No payments found
                        </h3>

                        <p>
                            Record a payment to see it
                            here.
                        </p>

                    </div>

                ) : (

                    <div className="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>ID</th>

                                    <th>
                                        Reservation
                                    </th>

                                    <th>
                                        Guest
                                    </th>

                                    <th>
                                        Amount
                                    </th>

                                    <th>
                                        Method
                                    </th>

                                    <th>
                                        Transaction Code
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Paid At
                                    </th>

                                    <th>
                                        Actions
                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {payments.map(
                                    (payment) => (

                                        <tr
                                            key={
                                                payment.id
                                            }
                                        >

                                            <td>
                                                {
                                                    payment.id
                                                }
                                            </td>

                                            <td>
                                                {
                                                    payment.reservationId
                                                }
                                            </td>

                                            <td>

                                                {payment.reservation?.guest ? (
                                                    <>
                                                        {
                                                            payment
                                                                .reservation
                                                                .guest
                                                                .firstName
                                                        }{" "}
                                                        {
                                                            payment
                                                                .reservation
                                                                .guest
                                                                .lastName
                                                        }
                                                    </>
                                                ) : (
                                                    "N/A"
                                                )}

                                            </td>

                                            <td>
                                                KSh{" "}
                                                {Number(
                                                    payment.amount
                                                ).toLocaleString()}
                                            </td>

                                            <td>
                                                {getPaymentMethodLabel(
                                                    payment.paymentMethod
                                                )}
                                            </td>

                                            <td>
                                                {payment.transactionCode ||
                                                    "N/A"}
                                            </td>

                                            <td>

                                                <span
                                                    className={getStatusClass(
                                                        payment.paymentStatus
                                                    )}
                                                >
                                                    {
                                                        payment.paymentStatus
                                                    }
                                                </span>

                                            </td>

                                            <td>
                                                {formatDate(
                                                    payment.paidAt
                                                )}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        onClick={() =>
                                                            handleEdit(
                                                                payment
                                                            )
                                                        }
                                                        className="edit-button"
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        onClick={() =>
                                                            handleDelete(
                                                                payment.id
                                                            )
                                                        }
                                                        className="cancel-button"
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