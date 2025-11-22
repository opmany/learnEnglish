import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { useExam } from "../contexts/ExamContext";
import { useNavigate } from "react-router";

export default function Home() {
  const { myClasses, refreshClasses } = useExam();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  let navigate = useNavigate();

useEffect(() => {
  const fetchClasses = async () => {
    try {
      setLoading(true);
      await refreshClasses(); // make sure this is actually fetching classes
      setError(null);
    } catch (err) {
      console.error("Failed to load classes:", err);
      setError("Could not load your classes.");
    } finally {
      setLoading(false);
    }
  };

  fetchClasses();
}, []);


  if (loading) return <p>Loading classes...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <Container className="text-center mt-5">
      <h1>Learning English With Matching</h1>
      <h1>Please Click On The Mode Of Practicing</h1>
      <Row className="mt-5">
        <Col>
          <Button onClick={() => {navigate("/MatchingGamePage")}} variant="primary">
            Matching Game
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/MultipleChoiceQuizPage")}} variant="primary">
            Multiple Choice Quiz
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/FlashCardsPage")}} variant="primary">
            Flash Cards
          </Button>
        </Col>
      </Row>
          <div style={{ padding: "20px" }}>
      <h1>My Classes</h1>
      {myClasses?.length > 0 ? (
        <ul>
          {myClasses.map((cls) => (
            <li key={cls.id}>
              {cls.name}{" "}
              <button
                onClick={() => window.location.href = `/class/${cls.id}`}
                style={{ marginLeft: "10px" }}
              >
                Go to Class
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>You are not enrolled in any classes yet.</p>
      )}
    </div>
    </Container>
  );
}
