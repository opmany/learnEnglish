import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WordsShowcase from "./pages/WordsShowcase";
import OrderPractice from "./pages/OrderPractice";
import RandomOrderPractice from "./pages/RandomOrderPractice";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/learnEnglish/" element={<Home />} />
        <Route path="/learnEnglish/WordsShowcase" element={<WordsShowcase />} />
        <Route path="/learnEnglish/OrderPractice" element={<OrderPractice />} />
        <Route path="/learnEnglish/RandomOrderPractice" element={<RandomOrderPractice />} />
      </Routes>
    </Router>
  );
}

export default App;
