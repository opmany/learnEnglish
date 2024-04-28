import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Image from "react-bootstrap/Image";
import Navbar from "react-bootstrap/Navbar";
import folderImg from "../images/folder.png";

const MyNavbar = () => {
  return (
    <Navbar expand="lg" className="bg-primary">
      <Container>
        <Navbar.Brand href="/">
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
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/WordsShowcase">
              Words Showcase
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MyNavbar;
