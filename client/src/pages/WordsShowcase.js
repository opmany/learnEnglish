import React from "react";
import Container from "react-bootstrap/Container";
import { useExam } from "../contexts/ExamContext";
import Table from 'react-bootstrap/Table';

const WordsShowcase = (props) => {
  const { currentExamJson } = useExam();

  return (
    <Container className="text-center mt-5">
      <h1>This is the words showcase</h1>
      {currentExamJson && <h1 className="mb-4">of {currentExamJson.name}</h1>}


        {currentExamJson && <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Meaning</th>
            <th>Translation</th>
          </tr>
        </thead>

        <tbody>
          {currentExamJson && currentExamJson.words.map((wordObj, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{wordObj.word}</td>
                <td>{wordObj.meaning}</td>
                <td>{wordObj.translation}</td>
              </tr>
            );
          })}
        </tbody>

      </Table>
 }
    </Container>
  );
};

export default WordsShowcase;
