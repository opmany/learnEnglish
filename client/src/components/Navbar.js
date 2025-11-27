import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import { PersonCircle } from "react-bootstrap-icons";
import folderImg from "../images/folder.png";
import { useNavigate } from "react-router";
import { useExam } from "../contexts/ExamContext";
import { useUser } from "../contexts/UserContext";

const MyNavbar = () => {
  const { setSelectedExamId, connectionStatus, currentExamJson, allExams } = useExam();
  const { user, logout } = useUser();

  let navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
            {allExams?.length > 0 && currentExamJson &&
              <NavDropdown title={currentExamJson.name} id="basic-nav-dropdown">
                {allExams.map(exam => (
                  <NavDropdown.Item
                    key={exam.id}
                    onClick={() => setSelectedExamId(exam.id)}
                  >
                    {exam.name} (Class: {exam.class_name})
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

            {/* User / Auth Links */}
            {user ? (
              <NavDropdown
                align="end"
                title={<PersonCircle size={28} className="text-white" />}
                id="user-nav-dropdown"
              >
                <NavDropdown.Item onClick={() => navigate("/account")}>
                  Account Settings
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/change-password")}>
                  Change Password
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => navigate("/change-username")}>
                  Change Username
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link onClick={() => navigate("/login")}>Login</Nav.Link>
                <Nav.Link onClick={() => navigate("/signup")}>Signup</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
