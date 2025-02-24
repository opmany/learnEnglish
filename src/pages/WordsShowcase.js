import React from "react";
import WordMatch from "../components/WordMatch";
import { getCurrWordBank } from "../WordDB";
import Container from "react-bootstrap/Container";

const WordsShowcase = (props) => {

  const currentMap = getCurrWordBank(props.currentDBIndex).words;

  return (
    <Container className="text-center mt-5">
      <h1 className="mb-4">This is the words showcase</h1>
      {currentMap.map((currWord) => (
        <WordMatch word={currWord.word} meaning={currWord.meaning} translation={currWord.translation}></WordMatch>
      ))}
    </Container>
  );
};

export default WordsShowcase;
