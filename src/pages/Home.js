import React from "react";
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
          <Button onClick={() => {navigate("/OrderPractice")}} variant="primary">
            Order Practice
          </Button>
        </Col>
        <Col>
          <Button onClick={() => {navigate("/RandomOrderPractice")}} variant="primary">
            Random Order Practice
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
