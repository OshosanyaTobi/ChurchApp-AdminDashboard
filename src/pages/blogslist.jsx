import { useEffect, useState } from "react";
import api from "../api/axios";

export default function BlogsList() {
  const [blogs, setBlogsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/blogs")
      .then((res) => {
        setBlogsList(res.data.data);
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
      <h2>Blogs List</h2>

      {blogs.map((blogs => (
        <div key={blogs.id}>
          <p>{blogs.title}</p>
          <p>{blogs.image}</p>
        </div>
      )))}
    </div>
  );
}
