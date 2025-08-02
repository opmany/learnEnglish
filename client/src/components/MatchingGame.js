import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import { Button, Container, Row, Col, Card, Alert } from "react-bootstrap";
import { shuffleArray } from "../Utils";

const chunkSize = 5;

const MatchingGame = () => {
  const { currentExamJson } = useExam();

  const [roundIndex, setRoundIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState([]);
  const [words, setWords] = useState([]);
  const [translations, setTranslations] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const [matchedIds, setMatchedIds] = useState([]);
  const [feedback, setFeedback] = useState(null);

  useEffect(() => {
    if (currentExamJson?.words) {
      const allWords = shuffleArray(currentExamJson.words);
      const start = roundIndex * chunkSize;
      const chunk = allWords.slice(start, start + chunkSize);

      setCurrentChunk(chunk);
      setWords(shuffleArray(chunk));
      setTranslations(shuffleArray(chunk));
      setMatchedIds([]);
      setSelectedWord(null);
      setFeedback(null);
    }
  }, [currentExamJson, roundIndex]);

  useEffect(() => {
    setRoundIndex(0); // Reset round when switching exams
  }, [currentExamJson?.id]);

  const handleWordClick = (word) => {
    if (matchedIds.includes(word.id)) return;
    setSelectedWord(word);
    setFeedback(null);
  };

  const handleTranslationClick = (translation) => {
    if (!selectedWord || matchedIds.includes(translation.id)) return;

    if (selectedWord.id === translation.id) {
      setMatchedIds([...matchedIds, selectedWord.id]);
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
          {words.map((w) => (
            <Card
              key={w.id}
              onClick={() => handleWordClick(w)}
              bg={
                matchedIds.includes(w.id)
                  ? "success"
                  : selectedWord?.id === w.id
                  ? "primary"
                  : "light"
              }
              text={
                matchedIds.includes(w.id) || selectedWord?.id === w.id
                  ? "white"
                  : "dark"
              }
              className="mb-2 cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              <Card.Body>{w.word}</Card.Body>
            </Card>
          ))}
        </Col>

        <Col>
          <h5>Translations</h5>
          {translations.map((t) => (
            <Card
              key={t.id}
              onClick={() => handleTranslationClick(t)}
              bg={matchedIds.includes(t.id) ? "success" : "light"}
              text={matchedIds.includes(t.id) ? "white" : "dark"}
              className="mb-2 cursor-pointer"
              style={{ cursor: "pointer" }}
            >
              <Card.Body>{t.translation}</Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      {matchedIds.length === currentChunk.length && (
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
