import React from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/esm/Container";

const WordMatch = (props) => {
  return (
    <Container className="text-center">
      <Row className="mt-1 justify-content-md-center">
        <Col lg="2">{props.word}</Col>
        <Col lg="auto">----</Col>
        <Col lg="2">{props.match}</Col>
      </Row>
    </Container>
  );
};

export default WordMatch;
