import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import { Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { shuffleArray } from "../Utils";

const chunkSize = 5;
const matchColors = ["#FFA07A", "#90EE90", "#ADD8E6", "#DDA0DD", "#F0E68C"];

const MatchingGame = () => {
  const { currentExamJson } = useExam();

  const [roundIndex, setRoundIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState([]);
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (currentExamJson?.words) {
      const allWords = shuffleArray(currentExamJson.words);
      const start = roundIndex * chunkSize;
      const chunk = allWords.slice(start, start + chunkSize);

      setCurrentChunk(chunk);
      setWords(shuffleArray(chunk));
      setMeanings(shuffleArray(chunk));
      setMatchedPairs([]);
      setSelectedWord(null);
      setFeedback(null);
    }
  }, [currentExamJson, roundIndex]);

  useEffect(() => {
    setRoundIndex(0); // Reset round when switching exams
  }, [currentExamJson?.id]);

  const getPairColor = (id) => {
    const pair = matchedPairs.find((p) => p.id === id);
    return pair?.color || null;
  };

  const handleWordClick = (word) => {
    if (matchedPairs.find((p) => p.id === word.id)) return;
    setSelectedWord(word);
    setFeedback(null);
  };

  const handleMeaningClick = (meaningItem) => {
    if (!selectedWord || matchedPairs.find((p) => p.id === meaningItem.id)) return;

    if (selectedWord.id === meaningItem.id) {
      const newColor = matchColors[matchedPairs.length % matchColors.length];
      setMatchedPairs([...matchedPairs, { id: selectedWord.id, color: newColor }]);
      setFeedback({ type: "success", message: "Correct Match! 🎉" });
      setSelectedWord(null);
    } else {
      setFeedback({ type: "danger", message: "Incorrect Match. Try again." });
    }
  };

  const nextRound = () => {
    setRoundIndex(roundIndex + 1);
  };

  const isGameOver = () =>
    currentExamJson &&
    (roundIndex + 1) * chunkSize >= currentExamJson.words.length;

  return (
    <Container className="mt-5 text-center">
      <h2 className="mb-4">🧠 Match the Words!</h2>
      <h5>{currentExamJson?.name}</h5>
      <p>
        Round {roundIndex + 1} /{" "}
        {Math.ceil(currentExamJson?.words.length / chunkSize)}
      </p>

      <Row className="mt-4">
        <Col>
          <h5>Words</h5>
          {words.map((w) => {
            const color = getPairColor(w.id);
            const isSelected = selectedWord?.id === w.id;

            return (
              <Card
                key={w.id}
                onClick={() => handleWordClick(w)}
                style={{
                  cursor: "pointer",
                  backgroundColor: color || (isSelected ? "#0d6efd" : "#f8f9fa"),
                  color: isSelected ? "white" : "black",
                }}
                className="mb-2"
              >
                <Card.Body>
                  <strong>{w.word}</strong>
                </Card.Body>
              </Card>
            );
          })}
        </Col>

        <Col>
          <h5>Meanings</h5>
          {meanings.map((m) => {
            const color = getPairColor(m.id);

            return (
              <Card
                key={m.id}
                onClick={() => handleMeaningClick(m)}
                style={{
                  cursor: "pointer",
                  backgroundColor: color || "#f8f9fa",
                  color: "black",
                }}
                className="mb-2"
              >
                <Card.Body>
                  <div>
                    <strong>{m.meaning}</strong>
                    {color && <span className="ms-2">({m.translation})</span>}
                  </div>
                </Card.Body>
              </Card>
            );
          })}
        </Col>
      </Row>

      {matchedPairs.length === currentChunk.length && (
        <div className="mt-4">
          {isGameOver() ? (
            <h4>🏁 You've completed all words in this exam!</h4>
          ) : (
            <Button onClick={nextRound}>▶️ Next Round</Button>
          )}
        </div>
      )}

      {feedback && (
        <Alert variant={feedback.type} className="mt-3">
          {feedback.message}
        </Alert>
      )}
    </Container>
  );
};

export default MatchingGame;
