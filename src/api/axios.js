import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tobi.altoservices.org/api/v1',
});

// Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth failure globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/* ================= BLOGS ================= */
API.getBlogs = () => API.get('/blogs');
API.createBlog = (data) => API.post('/blogs', data);
API.updateBlog = (id, data) => {
  data.append('_method', 'PATCH');
  return API.post(`/blogs/${id}`, data);
};
API.deleteBlog = (id) => API.delete(`/blogs/${id}`);

/* ================= USERS ================= */
API.getUsers = () => API.get('/users');
API.createUser = (data) => API.post('/register', data);
API.updateUser = (id, data) => API.put(`/users/${id}`, data);
API.deleteUser = (id) => API.delete(`/users/${id}`);

/* ================= ADMIN ================= */
API.getAdmins = () => API.get('/users');
API.createAdmin = (data) => API.post('/admins', data);
API.updateAdmin = (id, data) => API.put(`/admins/${id}`, data);
API.deleteAdmin = (id) => API.delete(`/admins/${id}`);

/* ================= EVENTS ================= */
API.getEvents = () => API.get('/events');
API.createEvent = (data) => API.post('/events', data);
API.updateEvent = (id, data) => API.put(`/events/${id}`, data);
API.deleteEvent = (id) => API.delete(`/events/${id}`);

/* ================= AUDIO ================= */
API.getAudio = () => API.get('/audio');
API.createAudio = (data) => API.post('/audio/upload', data);
API.updateAudio = (id, data) => API.put(`/audio/${id}`, data);
API.deleteAudio = (id) => API.delete(`/audio/${id}`);

/* ================= WATCH SECTIONS ================= */
API.getWatchSections = () => API.get('/watch-sections');
API.createWatchSection = (data) => API.post('/watch-sections', data);
API.updateWatchSection = (id, data) => API.put(`/watch-sections/${id}`, data);
API.deleteWatchSection = (id) => API.delete(`/watch-sections/${id}`);

/* ================= ROLES ================= */
API.getRoles = () => API.get('/roles');
API.createRole = (data) => API.post('/roles', data);

/* ================= ASSIGNMENTS ================= */
API.getAssignments = () => API.get('/assignments');
API.createAssignment = (data) => API.post('/assignments', data);
API.updateAssignment = (id, data) => API.put(`/assignments/${id}`, data);
API.deleteAssignment = (id) => API.delete(`/assignments/${id}`);

/* ================= VOLUNTEERS ================= */
API.getVolunteers = () => API.get('/volunteers');

/* ================= SCHEDULES ================= */
API.getSchedules = () => API.get('/schedules');
API.createSchedule = (data) => API.post('/schedules', data);
API.updateSchedule = (id, data) => API.put(`/schedules/${id}`, data);
API.deleteSchedule = (id) => API.delete(`/schedules/${id}`);
API.getMySchedule = () => API.get('/my-schedule');

/* ================= ANNOUNCEMENTS ================= */
API.createAnnouncement = (data) => API.post('/announcements', data);

/* ================= REPORTS ================= */
API.getReports = () => API.get('/reports/volunteers');

/* ================= SETTINGS ================= */
// Fetch current user
API.getProfile = () => API.get('/auth/me');

// Update profile (name + email)
API.updateProfile = (data) => API.put('/users/update-profile', data);

// Update password
API.updatePassword = (data) => API.put('/users/update-password', data);

export default API;
