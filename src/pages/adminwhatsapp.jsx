import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AdminWhatsApp = () => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [form, setForm] = useState({
    title: "",
    phone: "",
    message: "",
  });

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= FETCH LINKS ================= */
  const fetchLinks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/whatsapp-links");
      setLinks(res.data.data || []);
    } catch (err) {
      setError("Failed to fetch WhatsApp links");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  /* ================= CREATE LINK ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setCreating(true);
    setSuccess("");
    setError("");

    try {
      await API.post("/whatsapp-links", form);

      setSuccess("WhatsApp link created successfully 🎉");

      setForm({
        title: "",
        phone: "",
        message: "",
      });

      fetchLinks(); // refresh list
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create WhatsApp link"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ marginBottom: "20px" }}>Manage WhatsApp Links</h2>

      {/* ================= FORM ================= */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#f9f9f9",
          padding: "20px",
          borderRadius: "10px",
          marginBottom: "30px",
        }}
      >
        <h3>Create New Link</h3>

        <input
          type="text"
          name="title"
          placeholder="Department Name (e.g Choir)"
          value={form.title}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number (e.g 2348012345678)"
          value={form.phone}
          onChange={handleChange}
          required
          style={inputStyle}
        />

        <textarea
          name="message"
          placeholder="Optional default message"
          value={form.message}
          onChange={handleChange}
          style={{ ...inputStyle, height: "80px" }}
        />

        <button
          type="submit"
          disabled={creating}
          style={{
            ...buttonStyle,
            background: creating ? "#999" : "#1e88e5",
          }}
        >
          {creating ? "Creating..." : "Create WhatsApp Link"}
        </button>

        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>

      {/* ================= LIST ================= */}
      <h3>All Created Links</h3>

      {loading ? (
        <p>Loading...</p>
      ) : links.length === 0 ? (
        <p>No WhatsApp links created yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "15px" }}>
          {links.map((item) => (
            <div
              key={item.id}
              style={{
                border: "1px solid #ddd",
                padding: "15px",
                borderRadius: "8px",
              }}
            >
              <h4>{item.title}</h4>
              <p><strong>Phone:</strong> {item.phone}</p>
              {item.message && (
                <p><strong>Message:</strong> {item.message}</p>
              )}
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1e88e5" }}
              >
                Open WhatsApp Link
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ================= STYLES ================= */

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const buttonStyle = {
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  color: "#fff",
  cursor: "pointer",
};

export default AdminWhatsApp;
