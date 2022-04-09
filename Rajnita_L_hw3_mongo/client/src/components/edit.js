import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";

export default function Edit() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    genre: "",
    records: [],
  });
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      const id = params.id.toString();
      const response = await fetch(`http://localhost:9000/record/${params.id.toString()}`);

      if (!response.ok) {
        const message = `An error has occured: ${response.statusText}`;
        window.alert(message);
        return;
      }

      const record = await response.json();
      if (!record) {
        window.alert(`Record with id ${id} not found`);
        navigate("/");
        return;
      }

      setForm(record);
    }

    fetchData();

    return;
  }, [params.id, navigate]);

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  async function onSubmit(e) {
    e.preventDefault();
    const editedBook = {
      title: form.title,
      author: form.author,
      genre: form.genre,
    };

    // This will send a post request to update the data in the database.
    await fetch(`http://localhost:9000/update/${params.id}`, {
      method: "POST",
      body: JSON.stringify(editedBook),
      headers: {
        'Content-Type': 'application/json'
      },
    });

    navigate("/");
  }

  // This following section will display the form that takes input from the user to update the data.
  return (
    <div>
      <h3>Update Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title: </label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={form.title}
            onChange={(e) => updateForm({ title: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author: </label>
          <input
            type="text"
            className="form-control"
            id="author"
            value={form.author}
            onChange={(e) => updateForm({ author: e.target.value })}
          />
        </div>
        <div className="form-group">
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="authorOptions"
              id="authorThriller"
              value="Thriller"
              checked={form.genre === "Thriller"}
              onChange={(e) => updateForm({ genre: e.target.value })}
            />
            <label htmlFor="authorThriller" className="form-check-label">Thriller</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="authorOptions"
              id="authorClassic"
              value="Classics"
              checked={form.genre === "Classics"}
              onChange={(e) => updateForm({ genre: e.target.value })}
            />
            <label htmlFor="authorClassic" className="form-check-label">Classics</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              name="authorOptions"
              id="authorSci"
              value="Sci-fi"
              checked={form.genre === "Sci-fi"}
              onChange={(e) => updateForm({ genre: e.target.value })}
            />
            <label htmlFor="authorSci" className="form-check-label">Sci-fi</label>
        </div>
        </div>
        <br />

        <div className="form-group">
          <input
            type="submit"
            value="Update Record"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
