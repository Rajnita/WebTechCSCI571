import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Create() {
  const [form, setForm] = useState({
    book: "",
    author: "",
    genre: "",
  });
  const navigate = useNavigate();

  // These methods will update the state properties.
  function updateForm(value) {
    return setForm((prev) => {
      return { ...prev, ...value };
    });
  }

  // This function will handle the submission.
  async function onSubmit(e) {
    e.preventDefault();

    // When a post request is sent to the create url, we'll add a new record to the database.
    const newPerson = { ...form };

    await fetch("http://localhost:9000/record/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newPerson),
    })
    .catch(error => {
      window.alert(error);
      return;
    });

    setForm({ book: "", author: "", genre: "" });
    navigate("/");
  }

  // This following section will display the form that takes the input from the user.
  return (
    <div>
      <h3>Create New Record</h3>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="book">Book</label>
          <input
            type="text"
            className="form-control"
            id="book"
            value={form.book}
            onChange={(e) => updateForm({ book: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label htmlFor="author">Author</label>
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
              book="authorOptions"
              id="authorIntern"
              value="Thriller"
              checked={form.genre === "Thriller"}
              onChange={(e) => updateForm({ genre: e.target.value })}
              />
            <label htmlFor="authorIntern" className="form-check-label">Thriller</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              book="authorOptions"
              id="authorJunior"
              value="Classics"
              checked={form.genre === "Classics"}
              onChange={(e) => updateForm({ genre: e.target.value })}
            />
            <label htmlFor="authorJunior" className="form-check-label">Classics</label>
          </div>
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              book="authorOptions"
              id="authorSenior"
              value="Sci-fi"
              checked={form.genre === "Sci-fi"}
              onChange={(e) => updateForm({ genre: e.target.value })}
            />
            <label htmlFor="authorSenior" className="form-check-label">Sci-fi</label>
          </div>
        </div>
        <div className="form-group">
          <input
            type="submit"
            value="Create book"
            className="btn btn-primary"
          />
        </div>
      </form>
    </div>
  );
}
