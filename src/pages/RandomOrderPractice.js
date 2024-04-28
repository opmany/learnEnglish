import React, { useState } from "react";
import { WordBank } from "../WordBank";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const shuffleArray = (array) => {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
};

const newShuffledArray = shuffleArray(WordBank);

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
