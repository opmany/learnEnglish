import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import { useExam } from "../ExamContext";
import { shuffleArray } from "../Utils";

const amountOfChoices = 4;

const MultipleChoiceQuiz = () => {
  const { currentExamJson } = useExam();
  const [shuffledWords, setShuffledWords] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);

  // Shuffle words once on exam load
  useEffect(() => {
    if (currentExamJson?.words?.length > 0) {
      const shuffled = shuffleArray(currentExamJson.words);
      setShuffledWords(shuffled);
      setQuestionIndex(0);
    }
  }, [currentExamJson]);

  // Generate question when questionIndex or shuffledWords changes
  useEffect(() => {
    if (shuffledWords.length === 0) return;
    if (questionIndex >= shuffledWords.length) return;

    const correctWord = shuffledWords[questionIndex];
    const otherOptions = currentExamJson.words
      .filter((w) => w.word !== correctWord.word)
      .sort(() => 0.5 - Math.random())
      .slice(0, amountOfChoices - 1);

    const allOptions = shuffleArray([...otherOptions, correctWord]);

    setCurrentQuestion(correctWord);
    setOptions(allOptions);
    setFeedback(null);
  }, [questionIndex, shuffledWords, currentExamJson]);

  const handleAnswer = (selected) => {
    if (selected.meaning === currentQuestion.meaning) {
      setFeedback({
        type: "success",
        message: (
          <>
            Correct! 🎉 <br />
            Translation: <strong>{currentQuestion.translation}</strong>
          </>
        ),
      });
    } else {
      setFeedback({
        type: "danger",
        message: (
          <>
            Wrong. Correct answer: <strong>{currentQuestion.meaning}</strong> <br />
            Translation: <strong>{currentQuestion.translation}</strong>
          </>
        ),
      });
    }
  };

  const nextQuestion = () => {
    setQuestionIndex((prev) => prev + 1);
    setFeedback(null);
  };

  if (!currentExamJson?.words?.length) return <p>No words loaded.</p>;

  const isFinished = questionIndex >= shuffledWords.length;
  if (isFinished) {
    return (
      <Container className="mt-5 text-center">
        <h2>Quiz Complete! 🎉</h2>
        <p>You finished all questions in this exam.</p>
        <Button onClick={() => {
          const reshuffled = shuffleArray(currentExamJson.words);
          setShuffledWords(reshuffled);
          setQuestionIndex(0);
          setFeedback(null);
        }}>
          Restart Quiz
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-5 text-center">
      <h2>Multiple Choice Quiz</h2>
      <h4>
        What is the meaning of: <strong>{currentQuestion?.word}</strong>?
      </h4>

      <div className="d-flex flex-column align-items-center mt-4">
        {options.map((option, idx) => (
          <Button
            key={idx}
            variant="outline-primary"
            className="mb-2"
            onClick={() => handleAnswer(option)}
            disabled={!!feedback}
          >
            {option.meaning}
          </Button>
        ))}
      </div>

      {feedback && (
        <Alert variant={feedback.type} className="mt-4">
          {feedback.message}
        </Alert>
      )}

      {feedback && (
        <Button variant="success" className="mt-2" onClick={nextQuestion}>
          Next Question
        </Button>
      )}
    </Container>
  );
};

export default MultipleChoiceQuiz;
