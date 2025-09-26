import React, { useEffect, useRef, useState } from "react";
import { useExam } from "../ExamContext";
import { Button, Container, Row, Col, Modal } from "react-bootstrap";
import { shuffleArray } from "../Utils";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const realWordsAmount = 3;

const matchColors = ["#FFA07A", "#90EE90", "#ADD8E6", "#DDA0DD", "#F0E68C"];

const MatchingGame = () => {
  const { currentExamJson } = useExam();

  const [roundIndex, setRoundIndex] = useState(0);
  const [currentChunk, setCurrentChunk] = useState([]);
  const [words, setWords] = useState([]);
  const [meanings, setMeanings] = useState([]);
  const [selectedWordIdx, setSelectedWordIdx] = useState(null);
  const [selectedMeaningIdx, setSelectedMeaningIdx] = useState(null);
  const [selectionType, setSelectionType] = useState(null); // 'word' or 'meaning'
  const [matchedPairs, setMatchedPairs] = useState([]); // {wordIdx, meaningIdx, color}
  const [mistakes, setMistakes] = useState([]); // {word, meaning}
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);

  useEffect(() => {
    if (currentExamJson?.words) {
      const allWords = shuffleArray(currentExamJson.words);
      const start = roundIndex * realWordsAmount;
      const chunk = allWords.slice(start, start + realWordsAmount);
      const correctMeanings = [...chunk];
      const otherWords = allWords.filter(w => !chunk.includes(w));
      const randomDistractors = shuffleArray(otherWords).slice(0, 3);
      setCurrentChunk(chunk);
      setWords(shuffleArray(chunk));
      setMeanings(shuffleArray([...correctMeanings, ...randomDistractors]));
      setMatchedPairs([]);
      setSelectedWordIdx(null);
      setSelectedMeaningIdx(null);
      // Do NOT reset mistakes or counts here
    }
  }, [currentExamJson, roundIndex]);

  useEffect(() => {
    setRoundIndex(0); // Reset round when switching exams
    setMistakes([]);
    setCorrectCount(0);
    setIncorrectCount(0);
  }, [currentExamJson?.id]);

  // Helper to get dot positions for SVG lines
  const wordDotRefs = useRef([]);
  const meaningDotRefs = useRef([]);

  const getPairColor = (wordIdx, meaningIdx) => {
    const pair = matchedPairs.find((p) => p.wordIdx === wordIdx && p.meaningIdx === meaningIdx);
    return pair?.color || null;
  };

  // Flexible selection logic, refactored for correctness
  const handleWordDotClick = (idx) => {
    if (matchedPairs.find((p) => p.wordIdx === idx)) return;
    if (selectionType === 'meaning' && selectedMeaningIdx !== null) {
      // Try to match selected meaning with this word
      const word = words[idx];
      const meaning = meanings[selectedMeaningIdx];
      if (word.id === meaning.id) {
        const newColor = matchColors[matchedPairs.length % matchColors.length];
        setMatchedPairs([...matchedPairs, { wordIdx: idx, meaningIdx: selectedMeaningIdx, color: newColor }]);
        setCorrectCount((prev) => prev + 1);
        toast.success("Correct Match! 🎉");
        setSelectedWordIdx(null);
        setSelectedMeaningIdx(null);
        setSelectionType(null);
      } else {
        setMistakes((prev) => [...prev, { word, meaning }]);
        setIncorrectCount((prev) => prev + 1);
        toast.error("Incorrect Match. Try again.");
        // Keep meaning selected, allow user to try again
        setSelectedWordIdx(null);
      }
    } else if (selectionType === null) {
      setSelectedWordIdx(idx);
      setSelectedMeaningIdx(null);
      setSelectionType('word');
    }
    // If selectionType is 'word', do nothing (already selected)
  };

  const handleMeaningDotClick = (idx) => {
    if (matchedPairs.find((p) => p.meaningIdx === idx)) return;
    if (selectionType === 'word' && selectedWordIdx !== null) {
      // Try to match selected word with this meaning
      const word = words[selectedWordIdx];
      const meaning = meanings[idx];
      if (word.id === meaning.id) {
        const newColor = matchColors[matchedPairs.length % matchColors.length];
        setMatchedPairs([...matchedPairs, { wordIdx: selectedWordIdx, meaningIdx: idx, color: newColor }]);
        setCorrectCount((prev) => prev + 1);
        toast.success("Correct Match! 🎉");
        setSelectedWordIdx(null);
        setSelectedMeaningIdx(null);
        setSelectionType(null);
      } else {
        setMistakes((prev) => [...prev, { word, meaning }]);
        setIncorrectCount((prev) => prev + 1);
        toast.error("Incorrect Match. Try again.");
        // Keep word selected, allow user to try again
        setSelectedMeaningIdx(null);
      }
    } else if (selectionType === null) {
      setSelectedMeaningIdx(idx);
      setSelectedWordIdx(null);
      setSelectionType('meaning');
    }
    // If selectionType is 'meaning', do nothing (already selected)
  };

  const nextRound = () => {
    setRoundIndex(roundIndex + 1);
  };

  const isGameOver = () =>
    currentExamJson &&
    (roundIndex + 1) * realWordsAmount >= currentExamJson.words.length;

  const [showResultModal, setShowResultModal] = useState(false);

  // Layout for SVG lines
  const [svgDims, setSvgDims] = useState({ width: 0, height: 0 });
  const svgRef = useRef();
  useEffect(() => {
    if (svgRef.current) {
      setSvgDims({
        width: svgRef.current.offsetWidth,
        height: svgRef.current.offsetHeight,
      });
    }
  }, [words, meanings]);

  return (
    <Container className="mt-5 text-center" style={{ position: "relative" }}>
      <ToastContainer position="top-center" autoClose={2000} hideProgressBar />
      <h2 className="mb-4">🧠 Connect the Dots!</h2>
      <h5>{currentExamJson?.name}</h5>
      <p>
        Round {roundIndex + 1} / {Math.ceil(currentExamJson?.words.length / realWordsAmount)}
      </p>
      <div style={{ position: "relative", minHeight: "350px" }} ref={svgRef}>
        {/* SVG for lines */}
        <svg
          style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}
          width={svgDims.width}
          height={svgDims.height}
        >
          {matchedPairs.map((pair, idx) => {
            const wordDot = wordDotRefs.current[pair.wordIdx];
            const meaningDot = meaningDotRefs.current[pair.meaningIdx];
            if (!wordDot || !meaningDot) return null;
            const wordRect = wordDot.getBoundingClientRect();
            const meaningRect = meaningDot.getBoundingClientRect();
            const parentRect = svgRef.current.getBoundingClientRect();
            const x1 = wordRect.left - parentRect.left + wordRect.width / 2;
            const y1 = wordRect.top - parentRect.top + wordRect.height / 2;
            const x2 = meaningRect.left - parentRect.left + meaningRect.width / 2;
            const y2 = meaningRect.top - parentRect.top + meaningRect.height / 2;
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={pair.color}
                strokeWidth={4}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
            </marker>
          </defs>
        </svg>
        <Row className="mt-4">
          <Col>
            <h5>Words</h5>
            {words.map((w, idx) => {
              const isMatched = matchedPairs.find((p) => p.wordIdx === idx);
              const isSelected = selectedWordIdx === idx;
              return (
                <div key={w.id} style={{ display: "flex", alignItems: "center", marginBottom: "24px", justifyContent: "flex-end" }}>
                  <span style={{ fontWeight: "bold", fontSize: "1.1em", marginRight: 12 }}>{w.word}</span>
                  <span
                    ref={el => wordDotRefs.current[idx] = el}
                    onClick={() => handleWordDotClick(idx)}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      minHeight: 24,
                      borderRadius: "50%",
                      background: isMatched ? "#ccc" : (isSelected ? "#0d6efd" : "#fff"),
                      border: "2px solid #0d6efd",
                      cursor: isMatched ? "not-allowed" : "pointer",
                      boxShadow: isSelected ? "0 0 8px #0d6efd" : "none",
                      transition: "box-shadow 0.2s",
                      flexShrink: 0,
                      flexGrow: 0,
                      aspectRatio: "1/1"
                    }}
                  />
                </div>
              );
            })}
          </Col>
          <Col>
            <h5>Meanings</h5>
            {meanings.map((m, idx) => {
              const isMatched = matchedPairs.find((p) => p.meaningIdx === idx);
              const isSelected = selectedMeaningIdx === idx;
              return (
                <div key={m.id} style={{ display: "flex", alignItems: "center", marginBottom: "24px" }}>
                  <span
                    ref={el => meaningDotRefs.current[idx] = el}
                    onClick={() => selectedWordIdx !== null && !isMatched ? handleMeaningDotClick(idx) : null}
                    style={{
                      width: 24,
                      height: 24,
                      minWidth: 24,
                      minHeight: 24,
                      borderRadius: "50%",
                      background: isMatched ? "#ccc" : (isSelected ? "#0d6efd" : "#fff"),
                      border: "2px solid #0d6efd",
                      marginRight: 12,
                      cursor: selectedWordIdx !== null && !isMatched ? "pointer" : "not-allowed",
                      boxShadow: isSelected ? "0 0 8px #0d6efd" : "none",
                      transition: "box-shadow 0.2s",
                      flexShrink: 0,
                      flexGrow: 0,
                      aspectRatio: "1/1"
                    }}
                  />
                  <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>{m.meaning}</span>
                  {isMatched && m.translation && <span className="ms-2">({m.translation})</span>}
                </div>
              );
            })}
          </Col>
        </Row>
      </div>
      {matchedPairs.length === currentChunk.length && (
        <div className="mt-4">
          {isGameOver() ? (
            <>
              <h4>🏁 You've completed all words in this exam!</h4>
              {!showResultModal && setTimeout(() => setShowResultModal(true), 300)}
            </>
          ) : (
            <Button onClick={nextRound}>▶️ Next Round</Button>
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
                      <strong>{m.word.word}</strong> → <span style={{ color: "red" }}>{m.meaning.meaning}</span>
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
