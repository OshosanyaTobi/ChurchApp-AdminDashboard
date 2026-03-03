import { useEffect, useState } from "react";
import API from "@/api/axios";
import toast from "react-hot-toast";

export default function AdminWhatsApp() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    phone: "",
    message: "",
  });

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const res = await API.get("/whatsapp-links");
      setLinks(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch WhatsApp links");
      setLinks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await API.post("/whatsapp-links", form);
      toast.success("WhatsApp link created successfully 🎉");

      setForm({
        title: "",
        phone: "",
        message: "",
      });

      fetchLinks();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to create WhatsApp link"
      );
    } finally {
      setCreating(false);
    }
  };

  const copyToClipboard = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="page p-6 max-w-6xl mx-auto text-gray-900 dark:text-gray-100">
      <h2 className="text-2xl font-bold mb-6">
        Manage WhatsApp Links
      </h2>

      {/* CREATE FORM */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-10 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4">
          Create New WhatsApp Link
        </h3>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Department Name (e.g Choir)"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            required
            className="w-full border px-3 py-2 rounded-lg 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="text"
            placeholder="Phone Number (e.g 2348012345678)"
            value={form.phone}
            onChange={(e) =>
              setForm({ ...form, phone: e.target.value })
            }
            required
            className="w-full border px-3 py-2 rounded-lg 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <textarea
            placeholder="Optional default message"
            value={form.message}
            onChange={(e) =>
              setForm({ ...form, message: e.target.value })
            }
            className="md:col-span-2 w-full border px-3 py-2 rounded-lg 
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={creating}
              className="bg-green-600 hover:bg-green-700 
                text-white px-6 py-2 rounded-lg 
                font-semibold transition disabled:opacity-60"
            >
              {creating ? "Creating..." : "Create WhatsApp Link"}
            </button>
          </div>
        </form>
      </div>

      {/* LIST */}
      <h3 className="text-xl font-semibold mb-4">
        All Created Links
      </h3>

      {loading ? (
        <p className="dark:text-gray-300">Loading links...</p>
      ) : links.length === 0 ? (
        <p className="dark:text-gray-300">
          No WhatsApp links created yet.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {links.map((link) => (
            <div
              key={link.id}
              className="bg-white dark:bg-gray-800 
                p-5 rounded-xl shadow 
                border border-gray-200 dark:border-gray-700"
            >
              <h4 className="text-lg font-bold mb-2">
                {link.title}
              </h4>

              <p className="text-sm mb-1">
                <span className="font-semibold">Phone:</span>{" "}
                {link.phone}
              </p>

              {link.message && (
                <p className="text-sm mb-3">
                  <span className="font-semibold">Message:</span>{" "}
                  {link.message}
                </p>
              )}

              <div className="flex gap-4 mt-4">
                <a
                  href={link.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 dark:text-green-400 
                    font-semibold hover:underline"
                >
                  Open
                </a>

                <button
                  onClick={() => copyToClipboard(link.link)}
                  className="text-blue-600 dark:text-blue-400 
                    font-semibold hover:underline"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}