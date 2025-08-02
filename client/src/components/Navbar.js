import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import folderImg from "../images/folder.png";
import { useNavigate } from "react-router";
import { useExam } from "../ExamContext";
import { getExamList } from "../ApiRequest";

const MyNavbar = () => {
  const { setSelectedExamId, connectionStatus, currentExamJson } = useExam();
  
  let navigate = useNavigate();

  const [exams, setExams] = useState([]);

  useEffect(() => {
    getExamList().then(exams => {
      setExams(exams);
    });
  }, []);

  return (
    <Navbar expand="lg" className="bg-primary">
      <Container>
        <Navbar.Brand onClick={() => {navigate("/")}}>
          <Image
            alt=""
            src={folderImg}
            width="30"
            height="30"
            className="d-inline-block align-top"
          />{" "}
          Learning English
        </Navbar.Brand>{" "}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto" variant="underline">
            <div className="ms-3 text-white d-flex align-items-center">
              <span
                style={{
                  width: "10px",
                  height: "10px",
                  backgroundColor:
                    connectionStatus === "Backend unreachable 😢"
                      ? "red"
                      : "limegreen",
                  borderRadius: "50%",
                  marginRight: "8px",
                  display: "inline-block",
                }}/>
              <small style={{
                color: "black",
              }}>
                {connectionStatus || "Connecting..."}
              </small>
            </div>
            {currentExamJson && 
            <NavDropdown title={currentExamJson.name} id="basic-nav-dropdown" onChange={(e) => {setSelectedExamId(e.target.value)}}>
              {exams.map(exam => (
                <NavDropdown.Item
                  key={exam.id}
                  onClick={() => setSelectedExamId(exam.id)}
                >
                  {exam.name}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
            }
            <Nav.Link onClick={() => {navigate("/")}}>Home</Nav.Link>
            <Nav.Link onClick={() => {navigate("/WordsShowcase")}}>
              Words Showcase
            </Nav.Link>
            <Nav.Link onClick={() => {navigate("/ExamEditor")}}>
              Exam Editor
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
