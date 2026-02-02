import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api/axios';

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: '30px',
    maxWidth: '900px',
    margin: 'auto',
    fontFamily: 'Arial, sans-serif',
  },
  header: { marginBottom: '20px' },
  form: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '30px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
  },
  select: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    height: '45px',
  },
  search: {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
  },
  primaryBtn: {
    backgroundColor: '#2563eb',
    color: '#ffffff',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#e5e7eb',
    color: '#111827',
    padding: '10px 18px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  dangerBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    padding: '8px 14px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    marginLeft: '10px',
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    border: '1px solid #2563eb',
    color: '#2563eb',
    padding: '8px 14px',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  card: {
    background: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    marginBottom: '20px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
  },
  meta: {
    color: '#6b7280',
    fontSize: '14px',
    marginBottom: '10px',
  },
  actions: { marginTop: '15px' },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  pageBtn: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
  },
};

/* ================= COMPONENT ================= */
const Assignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignment_date: '',
    volunteer_ids: [],
  });
  const [volunteers, setVolunteers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const perPage = 5;

  /* ===== FETCH ASSIGNMENTS ===== */
  const fetchAssignments = async () => {
    try {
      const res = await API.getAssignments();
      setAssignments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    }
  };

  /* ===== FETCH VOLUNTEERS ===== */
  const fetchVolunteers = async () => {
    try {
      const res = await API.getVolunteers();
      setVolunteers(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setVolunteers([]);
    }
  };

  useEffect(() => {
    fetchAssignments();
    fetchVolunteers();
  }, []);

  /* ===== HANDLERS ===== */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleMultiSelect = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setForm({ ...form, volunteer_ids: selected });
  };

  const resetForm = () => {
    setForm({ title: '', description: '', assignment_date: '', volunteer_ids: [] });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.assignment_date) return;

    setLoading(true);

    try {
      if (editingId) {
        await API.updateAssignment(editingId, form);
      } else {
        await API.createAssignment(form);
      }
      resetForm();
      fetchAssignments();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
      assignment_date: assignment.assignment_date || '',
      volunteer_ids: assignment.volunteers
        ? assignment.volunteers.map((v) => String(v.id))
        : [],
    });
    setEditingId(assignment.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;
    try {
      await API.deleteAssignment(id);
      fetchAssignments();
    } catch (err) {
      console.error(err);
    }
  };

  /* ===== FILTER & PAGINATION ===== */
  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssignments.length / perPage);
  const paginatedAssignments = filteredAssignments.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📋 Assignment Management</h1>

      {/* ===== FORM ===== */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <h3>{editingId ? 'Edit Assignment' : 'Create Assignment'}</h3>

        <input
          name="title"
          placeholder="Assignment title"
          value={form.title}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <ReactQuill
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
          style={{ marginBottom: '15px' }}
        />

        <input
          type="date"
          name="assignment_date"
          value={form.assignment_date}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <select
          multiple
          value={form.volunteer_ids}
          onChange={handleMultiSelect}
          style={styles.select}
        >
          {volunteers.map((v) => (
            <option key={v.id} value={v.id}>
              {v.name} ({v.email})
            </option>
          ))}
        </select>

        <div style={{ marginTop: '15px' }}>
          <button
            type="submit"
            style={{
              ...styles.primaryBtn,
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            disabled={loading}
          >
            {loading
              ? editingId
                ? 'Updating...'
                : 'Creating...'
              : editingId
              ? 'Update Assignment'
              : 'Create Assignment'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              style={styles.secondaryBtn}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ===== SEARCH ===== */}
      <input
        placeholder="Search assignments..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={styles.search}
      />

      {/* ===== ASSIGNMENT LIST ===== */}
      {paginatedAssignments.map((assignment) => (
        <div key={assignment.id} style={styles.card}>
          <h2>{assignment.title}</h2>

          <p style={styles.meta}>
            {assignment.assignment_date}
          </p>

          <div dangerouslySetInnerHTML={{ __html: assignment.description }} />

          {assignment.volunteers && assignment.volunteers.length > 0 && (
            <p style={styles.meta}>
              Assigned to: {assignment.volunteers.map((v) => v.name).join(', ')}
            </p>
          )}

          <div style={styles.actions}>
            <button
              onClick={() => handleEdit(assignment)}
              style={styles.outlineBtn}
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(assignment.id)}
              style={styles.dangerBtn}
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ===== PAGINATION ===== */}
      <div style={styles.pagination}>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            style={{
              ...styles.pageBtn,
              background: page === i + 1 ? '#2563eb' : '#e5e7eb',
              color: page === i + 1 ? '#fff' : '#000',
            }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
