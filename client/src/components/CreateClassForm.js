import React, { useState } from "react";
import { Form, Button, Alert, Card } from "react-bootstrap";
import { createClass } from "../ApiRequest";

export default function CreateClassForm({ onCreated }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const newClass = await createClass(name);
      setSuccess(`Class "${newClass.name}" created!`);
      setName("");
      if (onCreated) onCreated(newClass); // Close modal after creation
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Card className="p-3 shadow-sm">
      <Form onSubmit={handleSubmit}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>Class Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter class name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </Form.Group>

        <Button type="submit" variant="success" className="w-100 fw-bold">
          Create Class
        </Button>
      </Form>
    </Card>
  );
}
