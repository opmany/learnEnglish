import React from "react";
import { getCurrWordBank } from "../WordDB";
import Training from "../components/Training";


const OrderPractice = (props) => {


  return (
    <Training 
    WordDB={getCurrWordBank(props.currentDBIndex).words}
    />
    
  );
};

export default OrderPractice;