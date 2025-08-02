import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import WordsShowcase from "./pages/WordsShowcase";
import MatchingGamePage from "./pages/MatchingGamePage";
import MultipleChoiceQuizPage from "./pages/MultipleChoiceQuizPage";
import FlashCardsPage from "./pages/FlashCardsPage";
import ExamEditor from "./pages/ExamEditor";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/WordsShowcase" element={<WordsShowcase/>} />
        <Route path="/MatchingGamePage" element={<MatchingGamePage/>}  />
        <Route path="/MultipleChoiceQuizPage" element={<MultipleChoiceQuizPage />} />
        <Route path="/FlashCardsPage" element={<FlashCardsPage />} />
        <Route path="/ExamEditor" element={<ExamEditor/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
