import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useExam } from "../contexts/ExamContext";
import FlashCard from "../components/FlashCard";
import { shuffleArray } from "../Utils";

const FlashcardsGrid = () => {
  const { currentExamJson } = useExam();

  const [shuffledWords, setShuffledWords] = useState([]);
  const [flippedStates, setFlippedStates] = useState({});
  const [page, setPage] = useState(0);
  const [cardsPerRow, setCardsPerRow] = useState(3);

  useEffect(() => {
    const updateCardsPerRow = () => {
      if (window.innerWidth < 576) {
        setCardsPerRow(1); // phones
      } else if (window.innerWidth < 992) {
        setCardsPerRow(2); // tablets
      } else {
        setCardsPerRow(3); // desktops
      }
    };

    updateCardsPerRow();
    window.addEventListener("resize", updateCardsPerRow);

    return () => window.removeEventListener("resize", updateCardsPerRow);
  }, []);

  useEffect(() => {
    if (currentExamJson?.words?.length > 0) {
      setShuffledWords(shuffleArray(currentExamJson.words));
      setFlippedStates({});
      setPage(0);
    }
  }, [currentExamJson]);

  if (!currentExamJson?.words?.length) {
    return <p>No words loaded.</p>;
  }

  const toggleFlip = (id) => {
    setFlippedStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const startIndex = page * cardsPerRow;
  const endIndex = startIndex + cardsPerRow;
  const currentCards = shuffledWords.slice(startIndex, endIndex);

  const totalPages = Math.ceil(shuffledWords.length / cardsPerRow);

  const prevPage = () => setPage((p) => (p > 0 ? p - 1 : p));
  const nextPage = () => setPage((p) => (p < totalPages - 1 ? p + 1 : p));

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Flashcards</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cardsPerRow}, 1fr)`,
          gap: "1.5rem",
          padding: "0 1rem",
        }}
      >
        {currentCards.map((word) => (
          <FlashCard
            key={word.id}
            wordData={word}
            isFlipped={flippedStates[word.id] || false}
            onToggleFlip={() => toggleFlip(word.id)}
          />
        ))}
      </div>

      <div className="d-flex justify-content-center align-items-center mt-4 gap-3">
        <Button variant="danger" onClick={prevPage} disabled={page === 0}>
          Previous
        </Button>
        <span style={{ minWidth: 80, textAlign: "center" }}>
          Page {page + 1} / {totalPages}
        </span>
        <Button variant="success" onClick={nextPage} disabled={page === totalPages - 1}>
          Next
        </Button>
      </div>
    </Container>
  );
};

export default FlashcardsGrid;
