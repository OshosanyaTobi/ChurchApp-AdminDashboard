import { useEffect, useState } from "react";
import api from "../api/axios";

export default function WatchSection() {
  const [watchsection, setWatchSection] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/watch-section")
      .then((res) => {
        setWatchSection(res.data.data);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Watch Section</h2>

      {watchsection.map((watchsection => (
        <div key={watchsection.id}>
          <p>{watchsection.title}</p>
          <p>{watchsection.image}</p>
        </div>
      )))}
    </div>
  );
}
