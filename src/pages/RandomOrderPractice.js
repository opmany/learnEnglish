import React from "react";
import { WordDB, getCurrWordBank } from "../WordDB";
import Training from "../components/Training";

const shuffle = (array) => {
  return array
    .map((a) => ({ sort: Math.random(), value: a }))
    .sort((a, b) => a.sort - b.sort)
    .map((a) => a.value);
};


const RandomOrderPractice = (props) => {

  const newShuffledArray = shuffle(getCurrWordBank(props.currentDBIndex).words);

  return (
    <Training 
    WordDB={newShuffledArray}
    />
  );
};

export default RandomOrderPractice;