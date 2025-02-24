import React, { useState } from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import WordsShowcase from "./pages/WordsShowcase";
import OrderPractice from "./pages/OrderPractice";
import RandomOrderPractice from "./pages/RandomOrderPractice";
import DBHandler from "./pages/DBHandler";


function App() {
    const [dbIndex, setDbIndex] = useState(0);
  

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/WordsShowcase" element={<WordsShowcase currentDBIndex={dbIndex} />} />
        <Route path="/OrderPractice" element={<OrderPractice currentDBIndex={dbIndex}/>}  />
        <Route path="/RandomOrderPractice" element={<RandomOrderPractice currentDBIndex={dbIndex} />} />
        <Route path="/DBHandler" element={<DBHandler currentDBIndex={dbIndex} setDbIndex={setDbIndex}/>} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
