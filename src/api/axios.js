import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tobi.altoservices.org/api/v1',
});

// Attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Handle auth failure
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

// USERS
API.getUsers = () => API.get('/users');
API.createUser = (data) => API.post('/register', data);
API.updateUser = (id, data) => API.put(`/users/${id}`, data);
API.deleteUser = (id) => API.delete(`/users/${id}`);

// DONATIONS
API.getDonations = () => API.get('/donations');
API.createDonation = (data) => API.post('/donations', data);

// ADMIN
API.getAdmins = () => API.get('/users');
API.createAdmin = (data) => API.post('/admins', data);
API.updateAdmin = (id, data) => API.put(`/workers/${id}`, data);
API.deleteAdmin = (id) => API.delete(`/workers/${id}`);

// EVENTS
export const getEvents = () => API.get('/events');
export const createEvent = (formData) => API.post('/events', formData); // <-- no headers
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// AUDIO FILES
API.getAudio = () => API.get('/audio');
API.createAudio = (data) => API.post('/audio/upload', data);
API.updateAudio = (id, data) => API.put(`/audio/${id}`, data);
API.deleteAudio = (id) => API.delete(`/audio/${id}`);

// WATCH SECTION
API.getWatchSection = () => API.get('/watch-sections');
API.createWatchSection = (data) => API.post('/watch-sections', data);
API.updateWatchSection = (id, data) => API.put(`/watch-sections/${id}`, data);
API.deleteWatchSection = (id) => API.delete(`/watch-sections/${id}`);

// Blogs
API.getBlogs = () => API.get('/blogs');
API.createBlog = (data) => API.post('/blogs', data);
API.updateBlog = (id, data) => API.put(`/blogs/${id}`, data);
API.deleteBlog = (id) => API.delete(`/blogs/${id}`);

// RECORDS
API.getRecords = () => API.get('/records');

// ASSIGNMENTS
API.getAssignments = () => API.get('/assignments');
API.createAssignment = (data) => API.post('/assignments', data);
API.updateAssignment = (id, data) => API.put(`/assignments/${id}`, data);
API.deleteAssignment = (id) => API.delete(`/assignments/${id}`);

// VOLUNTEERS (Admin use)
API.getVolunteers = () => API.get('/volunteers');

// SCHEDULES
API.getSchedules = () => API.get('/schedules');          // Admin: view all
API.createSchedule = (data) => API.post('/schedules', data); // Admin: create
API.getMySchedule = () => API.get('/schedules/my');      // Volunteer: my schedule


export default API;