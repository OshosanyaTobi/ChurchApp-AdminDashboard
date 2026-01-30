import { useEffect, useState } from "react";
import API from '@/api/axios';

export default function SchedulesList() {
  const [schedules, setSchedules] = useState([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await API.get("/schedules");
      setSchedules(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="page">
      <h2>All Schedules</h2>

      <table>
        <thead>
          <tr>
            <th>Volunteer</th>
            <th>Assignment</th>
            <th>Date</th>
            <th>Time</th>
            <th>Location</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map(s => (
            <tr key={s.id}>
              <td>{s.volunteer.name}</td>
              <td>{s.assignment.title}</td>
              <td>{s.schedule_date}</td>
              <td>{s.start_time} – {s.end_time}</td>
              <td>{s.location}</td>
              <td>{s.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
