import React, { useState } from "react";
import { WordBank } from "../WordBank";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const shuffle = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

const newShuffledArray = shuffle(WordBank);

const RandomOrderPractice = () => {
  const [index, setIndex] = useState(0);
  const [RevealAnswer, setRevealAnswer] = useState(false);

  return (
    <Container className="mt-5 text-center">
      {index < newShuffledArray.length ? (
        <div>
          <Row className="mt-5">
            <Col>{newShuffledArray[index].word}</Col>
            {RevealAnswer ? (
              <Col dir="rtl">{newShuffledArray[index].match}</Col>
            ) : (
              <Col>
                <Button
                  onClick={() => {
                    setRevealAnswer(true);
                  }}
                  variant="primary"
                >
                  Reveal Answer
                </Button>
              </Col>
            )}
          </Row>
          {index !== 0 && (
            <Button
              className="mt-5 bg-danger"
              onClick={() => {
                setIndex(index - 1);
                setRevealAnswer(false);
              }}
              variant="primary"
            >
              previous Word
            </Button>
          )}{" "}
          <Button
            className="mt-5"
            onClick={() => {
              setIndex(index + 1);
              setRevealAnswer(false);
            }}
            variant="primary"
          >
            Next Word
          </Button>
        </div>
      ) : (
        <h1>You Finished All The Words. Well Done!</h1>
      )}
    </Container>
  );
};

export default RandomOrderPractice;
