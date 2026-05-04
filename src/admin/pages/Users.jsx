import { useEffect, useState } from "react";
import { deleteUser, extractList, getUsers, updateUser } from "../../api/services";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  });

  const loadUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getUsers();
      setUsers(extractList(response.data));
    } catch {
      setError("Could not fetch users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const beginEdit = (user) => {
    const id = user.id || user.user_id || user._id;
    setEditingId(String(id));
    setForm({
      first_name: user.first_name || "",
      last_name: user.last_name || "",
      email: user.email || "",
      phone: user.phone || "",
    });
  };

  const cancelEdit = () => {
    setEditingId("");
    setForm({ first_name: "", last_name: "", email: "", phone: "" });
  };

  const saveEdit = async (user) => {
    const userId = user.id || user.user_id || user._id;
    if (!userId) return;

    try {
      await updateUser(userId, form);
      await loadUsers();
      cancelEdit();
    } catch {
      setError("User update failed.");
    }
  };

  const handleDelete = async (user) => {
    const userId = user.id || user.user_id || user._id;
    if (!userId) return;

    const isConfirmed = window.confirm("Delete this user?");
    if (!isConfirmed) return;

    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((item) => String(item.id || item.user_id || item._id) !== String(userId)));
    } catch {
      setError("User delete failed. API may not support delete users.");
    }
  };

  return (
    <div className="space-y-4 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <h1 className="text-xl sm:text-2xl font-bold">Users</h1>
        <button onClick={loadUsers} className="bg-gray-900 text-white px-4 py-2 rounded w-full sm:w-auto">
          Refresh
        </button>
      </div>

      {error ? <p className="mb-4 rounded bg-red-100 text-red-700 px-3 py-2">{error}</p> : null}
      {loading ? <p>Loading users...</p> : null}

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3">First Name</th>
              <th className="text-left px-4 py-3">Last Name</th>
              <th className="text-left px-4 py-3">Email</th>
              <th className="text-left px-4 py-3">Phone</th>
              <th className="text-left px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-4 text-gray-500">
                  No users available.
                </td>
              </tr>
            ) : (
              users.map((user, index) => {
                const id = String(user.id || user.user_id || user._id || index);
                const isEditing = editingId === id;
                return (
                  <tr key={id} className="border-t">
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={form.first_name}
                          onChange={(e) => setForm((prev) => ({ ...prev, first_name: e.target.value }))}
                        />
                      ) : (
                        user.first_name || "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={form.last_name}
                          onChange={(e) => setForm((prev) => ({ ...prev, last_name: e.target.value }))}
                        />
                      ) : (
                        user.last_name || "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={form.email}
                          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      ) : (
                        user.email || "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <input
                          className="border rounded px-2 py-1 w-full"
                          value={form.phone}
                          onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      ) : (
                        user.phone || "-"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {isEditing ? (
                        <div className="flex gap-2">
                          <button onClick={() => saveEdit(user)} className="bg-green-600 text-white px-2 py-1 rounded">
                            Save
                          </button>
                          <button onClick={cancelEdit} className="bg-gray-200 px-2 py-1 rounded">
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button onClick={() => beginEdit(user)} className="bg-blue-600 text-white px-2 py-1 rounded">
                            Edit
                          </button>
                          <button onClick={() => handleDelete(user)} className="bg-red-600 text-white px-2 py-1 rounded">
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;