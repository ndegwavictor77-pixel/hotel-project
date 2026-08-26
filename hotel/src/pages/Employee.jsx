import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


export default function Employee() {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Form state
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        position: "",
        salary: ""
    });

    const [editingId, setEditingId] = useState(null);

    // =========================
    // FETCH EMPLOYEES
    // =========================
    const fetchEmployees = async () => {
        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8000/employee"
            );

            if (!response.ok) {
                throw new Error("Failed to fetch employees");
            }

            const data = await response.json();

            console.log("Employee response:", data);

            setEmployees(
                data.employees ||
                data.employee ||
                []
            );

        } catch (error) {
            console.error(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    // =========================
    // HANDLE INPUT
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // =========================
    // CREATE / UPDATE
    // =========================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = editingId
                ? `http://localhost:8000/employee/${editingId}`
                : "http://localhost:8000/employee";

            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to save employee"
                );
            }

            alert(
                editingId
                    ? "Employee updated successfully"
                    : "Employee created successfully"
            );

            // Reset form
            setFormData({
                firstName: "",
                lastName: "",
                email: "",
                phone: "",
                position: "",
                salary: ""
            });

            setEditingId(null);

            // Reload employees
            fetchEmployees();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // =========================
    // EDIT EMPLOYEE
    // =========================
    const handleEdit = (employee) => {
        setEditingId(employee.id);

        setFormData({
            firstName: employee.firstName || "",
            lastName: employee.lastName || "",
            email: employee.email || "",
            phone: employee.phone || "",
            position: employee.position || "",
            salary: employee.salary || ""
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // =========================
    // DELETE EMPLOYEE
    // =========================
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this employee?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8000/employee/${id}`,
                {
                    method: "DELETE"
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete employee"
                );
            }

            alert("Employee deleted successfully");

            fetchEmployees();

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    // =========================
    // CANCEL EDIT
    // =========================
    const cancelEdit = () => {
        setEditingId(null);

        setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            position: "",
            salary: ""
        });
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="employee-container">
                <h2>Loading employees...</h2>
            </div>
        );
    }

    return (
        <div className="employee-container">

            {/* HEADER */}
            <div className="employee-header">

                <div>
                    <h1>Employees</h1>
                    <p>
                        Manage your hotel employees.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="btn btn-secondary"
                >
                    Dashboard
                </Link>

            </div>


            {/* ERROR */}
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}


            {/* =========================
                EMPLOYEE FORM
            ========================= */}

            <div className="employee-form-card">

                <h2>
                    {editingId
                        ? "Edit Employee"
                        : "Add Employee"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="form-grid">

                        <div className="form-group">
                            <label className="form-label">
                                First Name
                            </label>

                            <input
                                className="form-input"
                        
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="form-label">
                            
                                Last Name
                            </label>

                            <input
                                className="form-input"
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="form-label">
                                Email
                            </label>

                            <input
                                className="form-input"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="form-label">
                                Phone
                            </label>

                            <input
                                className="form-input"
                                type="text"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="form-label">
                                Position
                            </label>

                            <input
                               className="form-input"
                                type="text"
                                name="position"
                                value={formData.position}
                                onChange={handleChange}
                                placeholder="e.g. Receptionist"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label className="form-label">
                                Salary
                            </label>

                            <input
                            className="form-input"
                                type="number"
                                name="salary"
                                value={formData.salary}
                                onChange={handleChange}
                                required
                            />
                        </div>

                    </div>


                    <div className="form-buttons">

                        <button
                            type="submit"
                            className="btn btn-primary"
                        >
                            {editingId
                                ? "Update Employee"
                                : "Add Employee"}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={cancelEdit}
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </form>

            </div>


            {/* =========================
                EMPLOYEE TABLE
            ========================= */}

            <div className="employee-table-card">

                <h2>Employee List</h2>

                {employees.length === 0 ? (

                    <p className="no-employees">
                        No employees found.
                    </p>

                ) : (

                    <div className="table-wrapper">

                        <table>

                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Position</th>
                                    <th>Salary</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>

                                {employees.map(
                                    (employee) => (

                                        <tr key={employee.id}>

                                            <td>
                                                {employee.id}
                                            </td>

                                            <td>
                                                {employee.firstName}{" "}
                                                {employee.lastName}
                                            </td>

                                            <td>
                                                {employee.email}
                                            </td>

                                            <td>
                                                {employee.phone}
                                            </td>

                                            <td>
                                                {employee.position}
                                            </td>

                                            <td>
                                                Ksh{" "}
                                                {Number(
                                                    employee.salary || 0
                                                ).toLocaleString()}
                                            </td>

                                            <td>

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleEdit(
                                                            employee
                                                        )
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() =>
                                                        handleDelete(
                                                            employee.id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

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