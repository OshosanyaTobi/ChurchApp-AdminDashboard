import React, { useState, useEffect } from "react";
import API from "../api/axios";

const Settings = () => {
  const [form, setForm] = useState({
    email: "",
    full_name: "",
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchUser = async () => {
    try {
      const res = await API.getProfile();
      const user = res.data?.data || {};
      setForm({ email: user.email || "", full_name: user.name || "" });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchUser(); }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleProfileChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handlePasswordChange = (e) =>
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);

    try {
      await API.updateProfile(form);
      showToast("Profile updated successfully!");
      fetchUser();
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);

    if (passwordForm.new_password !== passwordForm.new_password_confirmation) {
      showToast("New passwords do not match!");
      setLoadingPassword(false);
      return;
    }

    try {
      await API.updatePassword(passwordForm);
      showToast("Password updated successfully!");
      setPasswordForm({
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
      });
    } catch (err) {
      console.error(err);
      showToast(err.response?.data?.message || "Something went wrong!");
    } finally {
      setLoadingPassword(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-900 min-h-screen">
      {toast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded shadow z-50 font-semibold">
          {toast}
        </div>
      )}

      <h1 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-50">
        ⚙️ Settings
      </h1>

      {/* PROFILE SETTINGS */}
      <form
        onSubmit={handleProfileSubmit}
        className="mb-8 p-6 rounded shadow-md bg-white dark:bg-slate-950"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Profile Settings
        </h3>

        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Full Name
        </label>
        <input
          type="text"
          name="full_name"
          value={form.full_name}
          onChange={handleProfileChange}
          className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleProfileChange}
          className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <button
          type="submit"
          disabled={loadingProfile}
          className={`px-4 py-2 rounded text-white ${
            loadingProfile ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingProfile ? "Saving..." : "Save Profile"}
        </button>
      </form>

      {/* PASSWORD CHANGE */}
      <form
        onSubmit={handlePasswordSubmit}
        className="p-6 rounded shadow-md bg-white dark:bg-slate-950"
      >
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50 mb-4">
          Change Password
        </h3>

        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Current Password
        </label>
        <input
          type="password"
          name="current_password"
          value={passwordForm.current_password}
          onChange={handlePasswordChange}
          className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          New Password
        </label>
        <input
          type="password"
          name="new_password"
          value={passwordForm.new_password}
          onChange={handlePasswordChange}
          className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
          Confirm New Password
        </label>
        <input
          type="password"
          name="new_password_confirmation"
          value={passwordForm.new_password_confirmation}
          onChange={handlePasswordChange}
          className="w-full p-3 mb-4 rounded border border-gray-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50"
        />

        <button
          type="submit"
          disabled={loadingPassword}
          className={`px-4 py-2 rounded text-white ${
            loadingPassword ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loadingPassword ? "Saving..." : "Change Password"}
        </button>
      </form>
    </div>
  );
};

export default Settings;
