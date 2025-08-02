import React from "react";
import "../styles/FlashCard.css";

const FlashCard = ({ wordData, isFlipped, onToggleFlip }) => {
  return (
    <div className="card-container" onClick={onToggleFlip}>
      <div className={`card-inner ${isFlipped ? "flipped" : ""}`}>
        <div className="card-face card-front">
          <h3 className="card-title">{wordData.word}</h3>
          <small className="text-muted">Click to flip</small>
        </div>
        <div className="card-face card-back">
          <h3 className="card-title">{wordData.word}</h3>
          <p><strong>Meaning:</strong> {wordData.meaning}</p>
          <p><strong>Translation:</strong> {wordData.translation}</p>
          <small className="text-muted">Click to flip back</small>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
