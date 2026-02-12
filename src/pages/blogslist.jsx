import React, { useEffect, useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import API from '../api/axios';

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [form, setForm] = useState({ title: '', body: '' });
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const formRef = useRef(null);
  const fileRef = useRef(null);

  const perPage = 5;

  const fetchBlogs = async () => {
    try {
      const res = await API.getBlogs();
      setBlogs(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error(err);
      setBlogs([]);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setForm({ title: '', body: '' });
    setImage(null);
    setEditingId(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const isQuillEmpty = (html) => {
    return !html || html === '<p><br></p>' || html.replace(/<(.|\n)*?>/g, '').trim() === '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedBody = isQuillEmpty(form.body) ? '' : form.body;

    if (!form.title && !cleanedBody && !image) {
      return alert('Provide at least one field.');
    }

    setLoading(true);

    const data = new FormData();

    if (form.title) data.append('title', form.title);
    if (cleanedBody) data.append('body', cleanedBody);
    if (image) data.append('image', image);

    try {
      if (editingId) {
        await API.updateBlog(editingId, data);
        showToast('Updated successfully!');
      } else {
        if (!form.title || !cleanedBody) {
          return alert('Title and body are required.');
        }

        await API.createBlog(data);
        showToast('Blog created!');
      }

      resetForm();
      fetchBlogs();

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (blog) => {
    setForm({
      title: blog.title || '',
      body: blog.body || ''
    });

    setEditingId(blog.id);
    setImage(null);

    formRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this blog?')) return;

    try {
      await API.deleteBlog(id);
      fetchBlogs();
      showToast('Blog deleted!');
    } catch (err) {
      console.error(err);
      showToast('Something went wrong!');
    }
  };

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBlogs.length / perPage);
  const paginatedBlogs = filteredBlogs.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white dark:bg-slate-900 min-h-screen">

      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow z-50 font-semibold">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">
        📝 Blog Management
      </h1>

      <form ref={formRef} onSubmit={handleSubmit} className="mb-6 p-6 rounded shadow-md bg-white dark:bg-slate-950">

        <h3 className="text-lg font-semibold">
          {editingId ? 'Edit Blog Post' : 'Create Blog Post'}
        </h3>

        <input
          name="title"
          placeholder="Blog title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-3 my-2 rounded border"
        />

        <ReactQuill
          value={form.body}
          onChange={(v) => setForm({ ...form, body: v })}
          style={{ marginBottom: '15px', backgroundColor: 'white' }}
        />

        <input
          ref={fileRef}
          type="file"
          onChange={handleImageChange}
        />

        <div className="mt-4 flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded text-white bg-blue-600"
          >
            {loading ? (editingId ? 'Updating...' : 'Creating...') : editingId ? 'Update Blog' : 'Create Blog'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded bg-gray-200"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <input
        placeholder="Search blog posts..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="w-full p-3 mb-4 rounded border"
      />

      {paginatedBlogs.map((blog) => (
        <div key={blog.id} className="mb-4 p-4 rounded shadow-md">

          <h2 className="font-bold text-lg">{blog.title}</h2>

          {blog.image && (
            <img
              src={blog.image}
              alt={blog.title}
              className="w-full max-h-64 object-cover rounded my-2"
            />
          )}

          <div dangerouslySetInnerHTML={{ __html: blog.body }} />

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => handleEdit(blog)}
              className="px-3 py-1 border border-blue-600 text-blue-600 rounded"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(blog.id)}
              className="px-3 py-1 bg-red-600 text-white rounded"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}

    </div>
  );
};

export default Blogs;
