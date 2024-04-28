import React from "react";
import WordMatch from "../components/WordMatch";
import { WordBank } from "../WordBank";
import Container from "react-bootstrap/Container";

const WordsShowcase = () => {
  return (
    <Container className="mt-5">
      {WordBank.map((currWord) => (
        <WordMatch word={currWord.word} match={currWord.match}></WordMatch>
      ))}
    </Container>
  );
};

export default WordsShowcase;
