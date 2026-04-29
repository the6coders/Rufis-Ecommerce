import { useState } from "react";
import { createUser } from "../../api/services";

function CreateUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus("");

    const [first_name, ...rest] = form.name.trim().split(" ");
    const last_name = rest.join(" ") || "User";

    try {
      const userData = {
        first_name,
        last_name,
        email: form.email,
        phone: form.phone,
        password: form.password,
      };

      await createUser(userData);

      setStatus("User created successfully.");
      alert("User created successfully.");
      setForm({ name: "", email: "", phone: "", password: "" });
    } catch {
      setStatus("Failed to create user. Check values and API availability.");
      alert("Failed to create user. Check values and API availability.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Create User</h1>

      <form onSubmit={onSubmit} className="bg-white rounded shadow p-5 grid gap-4 max-w-2xl">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="John Doe"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="email"
            value={form.email}
            onChange={onChange}
            type="email"
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Phone Number</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="phone"
            value={form.phone}
            onChange={onChange}
            required
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            className="border rounded px-3 py-2 w-full"
            name="password"
            value={form.password}
            onChange={onChange}
            type="password"
            required
          />
        </div>

        <div className="flex items-center gap-3">
          <button disabled={submitting} className="bg-gray-900 text-white px-4 py-2 rounded disabled:opacity-60" type="submit">
            {submitting ? "Creating..." : "Create User"}
          </button>
          {status ? <p className="text-sm text-gray-700">{status}</p> : null}
        </div>
      </form>
    </div>
  );
}

export default CreateUser;