import { useState, useEffect } from "react";
import API from "../api/axios";
import { toast } from "react-hot-toast";

export default function AdminRoleCreate() {
  const [name, setName] = useState("");
  const [availability, setAvailability] = useState("");
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const perPage = 5;

  const loadRoles = async () => {
    try {
      const res = await API.getRoles();
      setRoles(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setRoles([]);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.createRole({ name, availability });
      toast.success(res.data.message);
      setName("");
      setAvailability("");
      await loadRoles();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create role");
    } finally {
      setLoading(false);
    }
  };

  const filteredRoles = roles.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredRoles.length / perPage);

  const paginatedRoles = filteredRoles.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-slate-900 rounded-md text-slate-900 dark:text-slate-50">
      <h1 className="text-2xl font-bold mb-6">Create New Role</h1>

      {/* ===== CREATE ROLE FORM ===== */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block font-semibold mb-1">Role Name</label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
            placeholder="e.g., volunteer"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block font-semibold mb-1">
            Availability (optional)
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 dark:border-slate-700 rounded px-3 py-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
            placeholder="e.g., Mon-Fri 9am-5pm"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Creating..." : "Create Role"}
        </button>
      </form>

      {/* ===== SEARCH ===== */}
      <input
        type="text"
        placeholder="Search roles..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border p-2 w-full mb-4 rounded border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
      />

      {/* ===== ROLE LIST ===== */}
      {paginatedRoles.length > 0 ? (
        paginatedRoles.map((role) => (
          <div
            key={role.id}
            className="border p-4 mb-3 rounded bg-white dark:bg-slate-950"
          >
            <h4 className="font-bold">{role.name}</h4>
            {role.availability && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {role.availability}
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No roles found.</p>
      )}

      {/* ===== PAGINATION ===== */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${
                page === i + 1
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-slate-50 hover:bg-gray-300 dark:hover:bg-slate-600"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
