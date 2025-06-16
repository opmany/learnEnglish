import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import folderImg from "../images/folder.png";
import { useNavigate } from "react-router";

const MyNavbar = () => {
  let navigate = useNavigate();

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
            <Nav.Link onClick={() => {navigate("/")}}>Home</Nav.Link>
            <Nav.Link onClick={() => {navigate("/WordsShowcase")}}>
              Words Showcase
            </Nav.Link>
            <Nav.Link onClick={() => {navigate("/DBHandler")}}>
              DB Handler
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
