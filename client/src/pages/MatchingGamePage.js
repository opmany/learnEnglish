import React, { useState } from "react";
import MatchingGame from "../components/MatchingGame";

const MatchingGamePage = () => {
  const [roundAmount, setRoundAmount] = useState(25);
  const [startAll, setStartAll] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="mt-4 text-center" style={{ maxWidth: 420, margin: "0 auto", padding: "0 12px" }}>
      {!gameStarted && (
        <div className="mb-4" style={{ background: "#f8f9fa", borderRadius: 12, padding: 18, boxShadow: "0 2px 8px #eee" }}>
          <div style={{ marginBottom: 18 }}>
            <label htmlFor="roundAmount" style={{ fontWeight: "bold", fontSize: 16, marginRight: 8 }}>Number of Rounds:</label>
            <input
              id="roundAmount"
              type="number"
              min={1}
              value={roundAmount}
              onChange={e => setRoundAmount(Math.max(1, Number(e.target.value)))}
              style={{ width: 70, fontSize: 18, padding: "6px 10px", borderRadius: 6, border: "1px solid #ccc", marginRight: 12 }}
              disabled={startAll}
            />
          </div>
          <div style={{ marginBottom: 18 }}>
            <label style={{ fontSize: 16, marginRight: 8 }}>
              <input
                type="checkbox"
                checked={startAll}
                onChange={e => setStartAll(e.target.checked)}
                style={{ marginRight: 6, transform: "scale(1.3)" }}
              />
              Play with all words
            </label>
          </div>
          <button
            className="btn btn-primary"
            style={{ fontSize: 20, padding: "10px 32px", borderRadius: 8, boxShadow: "0 1px 4px #ddd" }}
            onClick={() => setGameStarted(true)}
          >
            Start Game
          </button>
        </div>
      )}
      {gameStarted && (
        <MatchingGame
          roundAmount={startAll ? null : roundAmount}
          startAll={startAll}
          onRestart={() => {
            setGameStarted(false);
            setStartAll(false);
          }}
        />
      )}
    </div>
  );
};

export default MatchingGamePage;