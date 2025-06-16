import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";

const WordMatch = (props) => {
  return (
    <Container className="text-center">
      <Row className="mt-1 justify-content-md-center border-bottom">
        <Col xs lg="2">{props.word}</Col>
        <Col xs lg="auto">----</Col>
        <Col xs lg="2">{props.meaning}</Col>
        <Col xs lg="auto">----</Col>
        <Col xs lg="2">{props.translation}</Col>
      </Row>
    </Container>
  );
};

export default WordMatch;
