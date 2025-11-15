import React, { useEffect, useState } from "react";
import { useExam } from "../ExamContext";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import { shuffleArray } from "../Utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Game configuration - number of words and meanings per round
const REAL_WORDS = 3;
const DISTRACTOR_WORDS = 3;
const DISTRACTOR_MEANINGS = 0;

const matchColors = ["#FFA07A", "#90EE90", "#ADD8E6", "#DDA0DD", "#F0E68C"];

const MatchingGame = ({ roundAmount, startAll, onRestart }) => {
  const { currentExamJson } = useExam();

  const [roundIndex, setRoundIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState([]);
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [selectedWordIdx, setSelectedWordIdx] = useState(null);
  const [matchedPairs, setMatchedPairs] = useState([]); // {wordIdx, meaningIdx, color}
  const [mistakes, setMistakes] = useState([]); // {word, meaning}
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  const totalRounds = startAll
    ? (currentExamJson?.words ? Math.ceil(currentExamJson.words.length / REAL_WORDS) : 0)
    : roundAmount || 1;

  useEffect(() => {
    if (currentExamJson?.words) {
      const allWords = shuffleArray(currentExamJson.words);
      const start = roundIndex * REAL_WORDS;
      const chunk = allWords.slice(start, start + REAL_WORDS);
      const correctMeanings = chunk;
      const otherWords = allWords.filter(w => !chunk.includes(w));
      const distractorWords = shuffleArray(otherWords).slice(0, DISTRACTOR_WORDS);
      const distractorMeanings = shuffleArray(otherWords).slice(0, DISTRACTOR_MEANINGS);
      setCurrentChunk(chunk);
      setWords(shuffleArray([...chunk, ...distractorWords]));
      setMeanings(shuffleArray([...correctMeanings, ...distractorMeanings]));
      setMatchedPairs([]);
      setSelectedWordIdx(null);
    }
  }, [currentExamJson, roundIndex]);

  useEffect(() => {
    setRoundIndex(0); // Reset round when switching exams
    setMistakes([]);
    setCorrectCount(0);
    setIncorrectCount(0);
  }, [currentExamJson?.id]);

  // Restore simple click word then click meaning flow
  const handleWordClick = (idx) => {
    if (matchedPairs.find((p) => p.wordIdx === idx)) return;
    setSelectedWordIdx(idx);
  };

  const handleMeaningClick = (idx) => {
    if (selectedWordIdx === null) return;

    const word = words[selectedWordIdx];
    const meaning = meanings[idx];

    if (word.id === meaning.id) {
      const newColor = matchColors[matchedPairs.length % matchColors.length];
      setMatchedPairs([...matchedPairs, { wordIdx: selectedWordIdx, meaningIdx: idx, color: newColor }]);
      setCorrectCount((prev) => prev + 1);
      toast.success("Correct Match! 🎉");
      setSelectedWordIdx(null);
    } else {
      setMistakes((prev) => [...prev, { word, meaning }]);
      setIncorrectCount((prev) => prev + 1);
      toast.error("Incorrect Match. Try again.");
    }
  };

  const nextRound = () => {
    if (roundIndex + 1 < totalRounds) {
      setRoundIndex(roundIndex + 1);
    }
  };

  // Game ends when last round is completed
  const isGameOver = React.useCallback(() => {
    return roundIndex >= totalRounds - 1;
  }, [roundIndex, totalRounds]);

  const [showResultModal, setShowResultModal] = useState(false);
  const [resultsShown, setResultsShown] = useState(false);

  useEffect(() => {
    // Only show results modal once after last round is completed and all pairs are matched
    if (isGameOver() && matchedPairs.length === currentChunk.length && !resultsShown) {
      const timer = setTimeout(() => {
        setShowResultModal(true);
        setResultsShown(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, matchedPairs, currentChunk, resultsShown]);

  return (
    <Container className="mt-5 text-center">
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h2 className="mb-4">🧠 Match the Words!</h2>
      <h5>{currentExamJson?.name}</h5>
      <p style={{ fontSize: 18, marginBottom: 16 }}>
        Round <span style={{ fontWeight: 600 }}>{roundIndex + 1}</span> / <span style={{ fontWeight: 600 }}>{totalRounds}</span>
      </p>
        <Row className="mt-4">
          <Col>
            <h5>Words</h5>
            {words.map((w, idx) => {
              const match = matchedPairs.find((p) => p.wordIdx === idx);
              const isMatched = !!match;
              const isSelected = selectedWordIdx === idx;
              const color = match ? match.color : undefined;
              // Determine text color for readability
              let textColor = undefined;
              if (color) {
                // Use black for light backgrounds, white for dark
                const lightColors = ["#FFA07A", "#90EE90", "#ADD8E6", "#F0E68C"];
                textColor = lightColors.includes(color) ? "#111" : "#fff";
              }
              return (
                <div key={w.id} style={{ display: "flex", alignItems: "center", marginBottom: "24px", justifyContent: "center" }}>
                  <Button
                    variant={isSelected ? "primary" : isMatched ? "secondary" : "outline-primary"}
                    onClick={() => handleWordClick(idx)}
                    disabled={isMatched}
                    style={{ marginRight: 12, backgroundColor: color, borderColor: color, color: textColor }}
                  >
                    {w.word}
                  </Button>
                  {((isMatched && w.translation) || (matchedPairs.length === currentChunk.length)) && (<span className="ms-2">({w.translation})</span>)}
                </div>
              );
            })}
          </Col>
          <Col>
            <h5>Meanings</h5>
            {meanings.map((m, idx) => {
              const match = matchedPairs.find((p) => p.meaningIdx === idx);
              const isMatched = !!match;
              const color = match ? match.color : undefined;
              let textColor = undefined;
              if (color) {
                const lightColors = ["#FFA07A", "#90EE90", "#ADD8E6", "#F0E68C"];
                textColor = lightColors.includes(color) ? "#222" : "#fff";
              }
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", marginBottom: "24px", justifyContent: "center" }}>
                  <Button
                    variant={isMatched ? "secondary" : "outline-success"}
                    onClick={() => handleMeaningClick(idx)}
                    disabled={isMatched || selectedWordIdx === null}
                    style={{ backgroundColor: color, borderColor: color, color: textColor }}
                  >
                    {m.meaning}
                  </Button>
                  {((isMatched && m.translation) || (matchedPairs.length === currentChunk.length)) && <span className="ms-2">({m.translation})</span>}
                </div>
              );
            })}
          </Col>
        </Row>
      {matchedPairs.length === currentChunk.length && (
        <div className="mt-4">
          {isGameOver() ? (
            <>
              <h4>🏁 You've completed all words in this exam!</h4>
              {!showResultModal && resultsShown && (
                <Button variant="info" className="mt-3" onClick={() => setShowResultModal(true)}>
                  Show Results Again
                </Button>
              )}
            </>
          ) : (
            <Button onClick={nextRound} disabled={matchedPairs.length < REAL_WORDS}>▶️ Next Round</Button>
          )}
        </div>
      )}

      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Exam Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h5>Results:</h5>
          <p>Correct matches: <strong>{correctCount}</strong></p>
          <p>Incorrect matches: <strong>{incorrectCount}</strong></p>
          {mistakes.length > 0 && (
            <div className="mt-3">
              <h6>Mistakes:</h6>
              <div style={{ maxHeight: 200, overflowY: "auto", border: "1px solid #eee", borderRadius: 4, padding: 8 }}>
                <ul style={{ textAlign: "left", margin: 0, padding: 0, listStyle: "none" }}>
                  {mistakes.map((m, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>
                      <strong>{m.word.word}</strong> → 
                      <span style={{ color: "red" }}>{m.meaning.meaning}</span> → 
                      <span style={{ color: "green" }}>{m.word.meaning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MatchingGame;
