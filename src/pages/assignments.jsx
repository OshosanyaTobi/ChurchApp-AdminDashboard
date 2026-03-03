import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useTheme } from '@/hooks/use-theme';
import API from '../api/axios';

const Assignments = () => {
  const { theme } = useTheme();

  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [quillKey, setQuillKey] = useState(Date.now());

  // ✅ SUCCESS POPUP STATE
  const [successMessage, setSuccessMessage] = useState('');

  const perPage = 5;

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await API.getAssignments();
      setAssignments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setAssignments([]);
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const resetForm = () => {
    setForm({ title: '', description: '' });
    setEditingId(null);
    setQuillKey(Date.now());
  };

  // ✅ SUCCESS POPUP HELPER
  const showSuccess = (message) => {
    setSuccessMessage(message);

    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) return;

    setLoading(true);

    try {
      if (editingId) {
        await API.updateAssignment(editingId, form);
        showSuccess('Assignment updated successfully ✅');
      } else {
        await API.createAssignment(form);
        showSuccess('Assignment created successfully ✅');
      }

      resetForm();
      await fetchAssignments();

    } catch (err) {
      console.error(err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assignment) => {
    setForm({
      title: assignment.title || '',
      description: assignment.description || '',
    });
    setEditingId(assignment.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this assignment?')) return;

    try {
      await API.deleteAssignment(id);
      await fetchAssignments();
      setPage(1);
      showSuccess('Assignment deleted successfully 🗑️');
    } catch (err) {
      console.error(err.response?.data || err);
    }
  };

  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAssignments.length / perPage);

  const paginatedAssignments = filteredAssignments.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} p-6 rounded-md max-w-3xl mx-auto`}>
      
      <h1 className="text-2xl font-bold mb-6">
        Create New Assignment
      </h1>

      {/* ✅ SUCCESS POPUP */}
      {successMessage && (
        <div className="mb-4 bg-green-600 text-white px-4 py-2 rounded shadow animate-pulse text-center">
          {successMessage}
        </div>
      )}

      {/* ===== FORM ===== */}
      <form
        onSubmit={handleSubmit}
        className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 rounded-md mb-6 shadow`}
      >
        <input
          name="title"
          placeholder="Assignment title"
          value={form.title}
          onChange={handleChange}
          required
          className={`${theme === 'dark'
              ? 'bg-gray-700 text-gray-100 border-gray-600'
              : 'bg-white text-gray-900 border-gray-300'
            } w-full p-2 rounded mb-4 border`}
        />

        <ReactQuill
          key={quillKey}
          value={form.description}
          onChange={(value) => setForm({ ...form, description: value })}
        />

        <div className="flex items-center gap-2 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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
              className="bg-gray-400 text-black px-4 py-2 rounded"
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
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className={`${theme === 'dark'
            ? 'bg-gray-700 text-gray-100 border-gray-600'
            : 'bg-white text-gray-900 border-gray-300'
          } w-full p-2 rounded mb-4 border`}
      />

      {/* ===== ASSIGNMENT LIST ===== */}
      {paginatedAssignments.map((a) => (
        <div
          key={a.id}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 rounded mb-4 shadow`}
        >
          <h2 className="font-bold">{a.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: a.description }} />

          <div className="flex gap-2 mt-2">
            <button
              onClick={() => handleEdit(a)}
              className="border border-blue-600 text-blue-600 px-3 py-1 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(a.id)}
              className="bg-red-600 text-white px-3 py-1 rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* ===== PAGINATION ===== */}
      <div className="flex justify-center gap-2 mt-4">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded ${
              page === i + 1
                ? 'bg-blue-600 text-white'
                : theme === 'dark'
                ? 'bg-gray-700 text-gray-100'
                : 'bg-gray-200 text-black'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Assignments;
