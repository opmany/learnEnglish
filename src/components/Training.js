import React, { useState, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import PossibleAnswer from "./PossibleAnswer";
import ListGroup from 'react-bootstrap/ListGroup';

const Training = (props) => {
  const [index, setIndex] = useState(0);
  const [RevealAnswer, setRevealAnswer] = useState(false);

    let DBWithoutCurrent;

    let currentAnswersWords = [];

    let currentRefs = useRef([]);

    let currentAnswers = [];


    const shuffle = (array) => {
        return array
          .map((a) => ({ sort: Math.random(), value: a }))
          .sort((a, b) => a.sort - b.sort)
          .map((a) => a.value);
      };
      
    let newShuffledArray = shuffle(props.WordDB);



    const removeIndex = (array) => {
        return array.filter(
            (item) => item !== props.WordDB[index]);
    };

    const refresh = () => {
        DBWithoutCurrent = removeIndex(props.WordDB);

        currentAnswersWords.length = 0;

        currentAnswersWords.push(props.WordDB[index]);

        while (currentAnswersWords.length < 5) {
            const randomNum = Math.floor(Math.random()*DBWithoutCurrent.length);
        
            if (!currentAnswersWords.includes(props.WordDB[randomNum])) {
              currentAnswersWords.push(props.WordDB[randomNum]);
            }
        }

        newShuffledArray = shuffle(props.WordDB)
    };

    refresh()

    const nextQuestion = () => {
      setIndex(index+1);
      setRevealAnswer(false);
      currentRefs.current.forEach((element, index) => {
        if (currentRefs.current[index] != null) {
          currentRefs.current[index].refreshAnswer()
        }      
      });
    };
  
    const previousQuestion = () => {
      setIndex(index-1);
      setRevealAnswer(false);
      currentRefs.current.forEach((element, index) => {
        if (currentRefs.current[index] != null) {
          currentRefs.current[index].refreshAnswer()
        }
      });
    };

    const getAnswerComponents = () => {
      currentRefs.current.length = 0;
      currentAnswers.length = 0;

      newShuffledArray.map((currWord) => (
        (currWord === currentAnswersWords[0] ||
            currWord === currentAnswersWords[1] ||
            currWord === currentAnswersWords[2] ||
            currWord === currentAnswersWords[3] ||
            currWord === currentAnswersWords[4] 
        ) &&
        (
        currentAnswers.push(
        <PossibleAnswer
           word={currWord}
           correctAnswer={(currWord === props.WordDB[index])}
           key={currWord.word} 
           ref={element => currentRefs.current[currentRefs.current.length] = (element)}
           />)
        )
      ))

      return currentAnswers
    };

  return (
    <Container className="mt-5 text-center">
      {index < props.WordDB.length ? (
        <div>
          <Row className="mt-5">
            <Col>{index + 1}. {props.WordDB[index].word}</Col>
            {RevealAnswer ? (
              <Col dir="rtl">{props.WordDB[index].translation}</Col>
            ) : (
              <Col>
                <ListGroup>
                    {getAnswerComponents()}
                </ListGroup>
              </Col>
            )}
          </Row>
          {index !== 0 && (
            <Button
              className="mt-5 bg-danger"
              onClick={() => {
                previousQuestion();
                refresh();
              }}
              variant="primary"
            >
              previous Word
            </Button>
          )}{" "}
          <Button
            className="mt-5 bg-success"
            onClick={() => {
                nextQuestion();
                refresh();
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

export default Training;