import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { updateExamWords } from "../ApiRequest";
import { useExam } from "../ExamContext";
import { Toast, ToastContainer } from "react-bootstrap";

const ExamEditor = (props) => {
  const { selectedExamId, currentExamJson, setCurrentExamJson } = useExam();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Saved!");
  const [toastVariant, setToastVariant] = useState("success"); // or "danger"

  return (
    <Container className="text-center mt-5">
      <h1>This is the Exam Editor</h1>
      {currentExamJson ? <h1>Current Exam: {currentExamJson.name}</h1> : <h1>No Exam is selected</h1>}

      {currentExamJson && <p>Words In The Current Exam: {currentExamJson.name}</p>}

      {currentExamJson && 
      
      <Row className="mb-3">
        <Col>
          <button
          className="btn btn-success"
          onClick={async () => {
            try {
              await updateExamWords(selectedExamId, currentExamJson.words);
              setToastVariant("success");
              setToastMessage("✅ Words updated successfully!");
              setShowToast(true);
            } catch (err) {
              setToastVariant("danger");
              setToastMessage("❌ Failed to update words.");
              setShowToast(true);
            }
          }}
          >
            Save Changes
          </button>
        </Col>

        <Col>
          <button
            className="btn btn-success"
            onClick={() => {
              const newWord = { word: "", meaning: "", translation: "" };
              setCurrentExamJson({
                ...currentExamJson,
                words: [newWord, ...currentExamJson.words]
              });
            }}
          >
            ➕ Add New Word
          </button>
        </Col>
      </Row>
      }

      {currentExamJson && <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Word</th>
            <th>Meaning</th>
            <th>Translation</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentExamJson && currentExamJson.words.map((wordObj, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}</td>

                <td>
                  <input
                    type="text"
                    value={wordObj.word}
                    onChange={(e) => {
                      const updated = [...currentExamJson.words];
                      updated[index].word = e.target.value;
                      setCurrentExamJson({ ...currentExamJson, words: updated });
                    }}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={wordObj.meaning}
                    onChange={(e) => {
                      const updated = [...currentExamJson.words];
                      updated[index].meaning = e.target.value;
                      setCurrentExamJson({ ...currentExamJson, words: updated });
                    }}
                  />
                </td>

                <td>
                  <input
                    type="text"
                    value={wordObj.translation}
                    onChange={(e) => {
                      const updated = [...currentExamJson.words];
                      updated[index].translation = e.target.value;
                      setCurrentExamJson({ ...currentExamJson, words: updated });
                    }}
                  />
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => {
                      const updated = [...currentExamJson.words];
                      updated.splice(index, 1);
                      setCurrentExamJson({ ...currentExamJson, words: updated });
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>

      </Table>
      }

      <ToastContainer position="bottom-end" className="p-3">
        <Toast
          onClose={() => setShowToast(false)}
          show={showToast}
          delay={3000}
          autohide
          bg={toastVariant}
        >
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>

    </Container>
  );
};

export default ExamEditor;
