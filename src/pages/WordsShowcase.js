import React from "react";
import WordMatch from "../components/WordMatch";
import { WordDB } from "../WordDB";
import Container from "react-bootstrap/Container";

const WordsShowcase = () => {
  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">This is the words showcase</h1>
      {WordDB.map((currWord) => (
        <WordMatch word={currWord.word} meaning={currWord.meaning} translation={currWord.translation}></WordMatch>
      ))}
    </Container>
  );
};

export default WordsShowcase;
