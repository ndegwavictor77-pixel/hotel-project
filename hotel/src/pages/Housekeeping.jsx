
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

function Housekeeping() {
  const [housekeeping, setHousekeeping] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [form, setForm] = useState({
    roomId: "",
    status: "PENDING",
    notes: "",
    cleanedAt: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // =========================
  // FETCH HOUSEKEEPING
  // =========================
  const fetchHousekeeping = async () => {
    try {
      const response = await fetch(`${API_URL}/housekeeping`);

      if (!response.ok) {
        throw new Error("Failed to fetch housekeeping records");
      }

      const data = await response.json();

      setHousekeeping(Array.isArray(data) ? data : data.housekeeping || []);
    } catch (error) {
      console.error(error);
      setMessage("Failed to load housekeeping records");
    }
  };

  // =========================
  // FETCH ROOMS
  // =========================
  const fetchRooms = async () => {
    try {
      const response = await fetch(`${API_URL}/rooms`);

      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }

      const data = await response.json();

      setRooms(Array.isArray(data) ? data : data.rooms || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchHousekeeping();
    fetchRooms();
  }, []);

  // =========================
  // FORM CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roomId) {
      setMessage("Please select a room");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        roomId: Number(form.roomId),
        status: form.status,
        notes: form.notes || null,
        cleanedAt: form.cleanedAt
          ? new Date(form.cleanedAt).toISOString()
          : null,
      };

      const url = editingId
        ? `${API_URL}/housekeeping/${editingId}`
        : `${API_URL}/housekeeping`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned a non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Operation failed");
      }

      setMessage(
        editingId
          ? "Housekeeping record updated successfully"
          : "Housekeeping record created successfully"
      );

      resetForm();
      fetchHousekeeping();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // EDIT
  // =========================
  const handleEdit = (item) => {
    setEditingId(item.id);

    setForm({
      roomId: item.roomId?.toString() || "",
      status: item.status || "PENDING",
      notes: item.notes || "",
      cleanedAt: item.cleanedAt
        ? new Date(item.cleanedAt).toISOString().slice(0, 16)
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this housekeeping record?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/housekeeping/${id}`, {
        method: "DELETE",
      });

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        throw new Error(text || "Server returned a non-JSON response");
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete record");
      }

      setMessage("Housekeeping record deleted successfully");

      fetchHousekeeping();
    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // =========================
  // RESET FORM
  // =========================
  const resetForm = () => {
    setForm({
      roomId: "",
      status: "PENDING",
      notes: "",
      cleanedAt: "",
    });

    setEditingId(null);
  };

  // =========================
  // ROOM NUMBER
  // =========================
  const getRoomNumber = (roomId) => {
    const room = rooms.find((r) => r.id === roomId);

    return room ? room.roomNumber : `Room ${roomId}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Housekeeping
          </h1>

          <p className="text-gray-500 mt-1">
            Manage room cleaning and housekeeping activities.
          </p>
        </div>

        {/* MESSAGE */}
        {message && (
          <div className="mb-5 rounded-lg bg-blue-100 px-4 py-3 text-blue-800">
            {message}
          </div>
        )}

        {/* FORM */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-5">
            {editingId
              ? "Edit Housekeeping Record"
              : "Add Housekeeping Record"}
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-5"
          >
            {/* ROOM */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Room
              </label>

              <select
                name="roomId"
                value={form.roomId}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
              >
                <option value="">Select room</option>

                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    Room {room.roomNumber}
                  </option>
                ))}
              </select>
            </div>

            {/* STATUS */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="CLEAN">Clean</option>
                <option value="DIRTY">Dirty</option>
                <option value="INSPECTED">Inspected</option>
              </select>
            </div>

            {/* CLEANED AT */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cleaned At
              </label>

              <input
                type="datetime-local"
                name="cleanedAt"
                value={form.cleanedAt}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* NOTES */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>

              <input
                type="text"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                placeholder="e.g. Bathroom needs maintenance"
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Record"
                  : "Add Record"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">
              Housekeeping Records
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3">ID</th>
                  <th className="text-left px-6 py-3">Room</th>
                  <th className="text-left px-6 py-3">Status</th>
                  <th className="text-left px-6 py-3">Notes</th>
                  <th className="text-left px-6 py-3">Cleaned At</th>
                  <th className="text-left px-6 py-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {housekeeping.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500"
                    >
                      No housekeeping records found.
                    </td>
                  </tr>
                ) : (
                  housekeeping.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        {item.id}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {getRoomNumber(item.roomId)}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-gray-100">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        {item.notes || "-"}
                      </td>

                      <td className="px-6 py-4">
                        {item.cleanedAt
                          ? new Date(
                              item.cleanedAt
                            ).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Housekeeping;

