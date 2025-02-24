import React from "react";
import Container from "react-bootstrap/Container";
import { WordDB, getCurrWordBank } from "../WordDB";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const DBHandler = (props) => {
  return (
    <Container className="text-center mt-5">
      <h1>This is the DB Handler</h1>
      <h1>Current Exam: {getCurrWordBank(props.currentDBIndex).name}</h1>
      <Row className="mt-5">
        {WordDB.map((body, index) => {
          return (
            <Col>
              <Button
                onClick={() => {
                  props.setDbIndex(index);
                }}
                variant="primary"
              >
                {body.name}
              </Button>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default DBHandler;
