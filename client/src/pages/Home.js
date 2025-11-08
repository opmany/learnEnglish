import React from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router";

const Home = () => {
  let navigate = useNavigate();

  const learningModes = [
    {
      title: "Matching Game",
      description: "Match words with their meanings in an interactive game",
      icon: "🎮",
      path: "/MatchingGamePage",
      color: "var(--primary)"
    },
    {
      title: "Multiple Choice Quiz",
      description: "Test your knowledge with multiple choice questions",
      icon: "📝",
      path: "/MultipleChoiceQuizPage",
      color: "var(--secondary)"
    },
    {
      title: "Flash Cards",
      description: "Practice with digital flash cards",
      icon: "🗂️",
      path: "/FlashCardsPage",
      color: "var(--accent)"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 py-12">
      <Container>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "var(--primary)" }}>
            Learn English Interactively
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your preferred learning mode and start improving your English skills today
          </p>
        </div>

        <Row className="g-4 justify-content-center">
          {learningModes.map((mode, index) => (
            <Col key={index} xs={12} md={6} lg={4}>
              <div
                className="card h-100 p-4 text-center hover-lift"
                onClick={() => navigate(mode.path)}
                style={{ cursor: "pointer" }}
              >
                <div 
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    backgroundColor: `${mode.color}15`,
                    fontSize: "2rem"
                  }}
                >
                  {mode.icon}
                </div>
                <h3 className="h4 mb-3" style={{ color: mode.color }}>
                  {mode.title}
                </h3>
                <p className="text-muted mb-4">
                  {mode.description}
                </p>
                <Button
                  variant="outline-primary"
                  className="w-100"
                  style={{
                    "--bs-btn-color": mode.color,
                    "--bs-btn-border-color": mode.color,
                    "--bs-btn-hover-bg": mode.color,
                    "--bs-btn-hover-border-color": mode.color
                  }}
                >
                  Start Learning
                </Button>
              </div>
            </Col>
          ))}
        </Row>

        <div className="text-center mt-4">
          <p className="text-muted">
            Track your progress and learn at your own pace
          </p>
        </div>
      </Container>
    </div>
  );
};

export default Home;
