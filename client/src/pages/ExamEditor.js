import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Table from 'react-bootstrap/Table';
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import { Modal, Button, Form } from "react-bootstrap";
import { updateExamWords, parseExcel, insertExam } from "../ApiRequest";
import { useExam } from "../ExamContext";
import { Toast, ToastContainer } from "react-bootstrap";

const ExamEditor = (props) => {
  const { selectedExamId, currentExamJson, setCurrentExamJson, refreshExams } = useExam();

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("Saved!");
  const [toastVariant, setToastVariant] = useState("success"); // or "danger"
  const [showExcelModel, setShowExcelModel] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [rows, setRows] = useState([]);
  const [step, setStep] = useState("upload"); // upload | preview

  const handleClose = () => {
    setShowExcelModel(false);
    setFile(null);
    setRows([]);
    setStep("upload");
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
  if (!file) {
    setToastMessage("No file selected!");
    setToastVariant("danger");
    setShowToast(true);
    return;
  }

  try {
    const { fileName, rows } = await parseExcel(file);

    if (!rows || rows.length === 0) {
      setToastMessage("Excel file contains no valid rows!");
      setToastVariant("danger");
      setShowToast(true);
      return;
    }

    setRows(rows);
    setFileName(fileName);

    setToastMessage(`File "${fileName}" parsed successfully!`);
    setToastVariant("success");
    setShowToast(true);

    setStep("preview"); // move to preview step
  } catch (err) {
    setToastMessage(err.message || "Failed to parse Excel file");
    setToastVariant("danger");
    setShowToast(true);
  }
};


  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const handleConfirm = async () => {
    try {
      const exam = await insertExam(rows, fileName);

      setToastMessage(`Inserted exam "${exam.name}" with ${exam.words.length} words`);
      setToastVariant("success");
      setShowToast(true);  

      await refreshExams();
      
      handleClose();
    } catch (err) {
      setToastMessage(err.message || "Insert failed");
      setToastVariant("danger");
      setShowToast(true);
    }
  };

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

        <Col>
          <button className="btn btn-success" onClick={() => setShowExcelModel(true)}>
            Parse Excel
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

      
      <Modal show={showExcelModel} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {step === "upload" ? "Upload Excel File" : "Preview Exam"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {step === "upload" ? (
            <div>
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => e.preventDefault()}
                style={{
                  border: "2px dashed #007bff",
                  borderRadius: "10px",
                  padding: "40px",
                  textAlign: "center",
                  cursor: "pointer",
                  background: file ? "#e6f2ff" : "#f9f9f9",
                }}
                onClick={() => document.getElementById("fileInput").click()}
              >
                {file ? (
                  <p>{file.name}</p>
                ) : (
                  <p>Drag & Drop Excel file here, or click to select</p>
                )}
                <Form.Control
                  type="file"
                  accept=".xlsx,.xls"
                  id="fileInput"
                  style={{ display: "none" }}
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </div>
              <div style={{ flex: 1 }}>
                <img
                  src="/excelExample.png"
                  alt="Excel Example"
                  style={{ width: "100%", border: "1px solid #ddd", borderRadius: "8px" }}
                />
                <p style={{ fontSize: "0.9em", marginTop: "5px", textAlign: "center" }}>
                  Example Excel Format
                </p>
              </div>
            </div>
          ) : (
            <div>
              <h5>Exam: {fileName ? fileName.replace(/\.[^/.]+$/, "") : "New Exam"}</h5>
              <Table bordered hover responsive>
                <thead>
                  <tr>
                    <th>Word</th>
                    <th>Meaning</th>
                    <th>Translation</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.word || ""}
                          onChange={(e) =>
                            handleChange(i, "word", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.meaning || ""}
                          onChange={(e) =>
                            handleChange(i, "meaning", e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <Form.Control
                          type="text"
                          value={row.translation || ""}
                          onChange={(e) =>
                            handleChange(i, "translation", e.target.value)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {step === "upload" ? (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                variant="primary"
                disabled={!file}
                onClick={handleUpload}
              >
                Parse
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="success" onClick={handleConfirm}>
                Add Exam
              </Button>
            </>
          )}
        </Modal.Footer>
      </Modal>

    </Container>
  );
};

export default ExamEditor;
