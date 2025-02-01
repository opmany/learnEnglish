import React from "react";
import { WordDB } from "../WordDB";
import Training from "../components/Training";

const shuffle = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};

const newShuffledArray = shuffle(WordDB);

const RandomOrderPractice = () => {

  return (
    <Training 
    WordDB={newShuffledArray}
    />
  );
};

export default RandomOrderPractice;