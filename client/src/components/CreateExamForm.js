import React, { useState } from "react";
import { createExam } from "../ApiRequest";

export default function CreateExamForm({ classId, onCreated }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name) return;

    try {
      setLoading(true);
      setError(null);
      const newExam = await createExam(name, classId); // send classId!
      setName("");
      onCreated(newExam); // notify parent to refresh
    } catch (err) {
      console.error(err);
      setError("Failed to create exam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Exam Name"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Creating..." : "Create Exam"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
