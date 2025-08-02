import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router";

const Home = () => {
  let navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <h1>Learning English With Matching</h1>
      <h1>Please Click On The Mode Of Practicing</h1>
      <Row className="mt-5">
        <Col>
          <Button onClick={() => {navigate("/MatchingGamePage")}} variant="primary">
            Matching Game
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/MultipleChoiceQuizPage")}} variant="primary">
            Multiple Choice Quiz
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/FlashCardsPage")}} variant="primary">
            Flash Cards
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
