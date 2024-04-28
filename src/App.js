import React from "react";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import WordsShowcase from "./pages/WordsShowcase";
import OrderPractice from "./pages/OrderPractice";
import RandomOrderPractice from "./pages/RandomOrderPractice";
// import Blogs from "./pages/blogs";
// import SignUp from "./pages/signup";
// import Contact from "./pages/contact";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/WordsShowcase" element={<WordsShowcase />} />
        <Route path="/OrderPractice" element={<OrderPractice />} />
        <Route path="/RandomOrderPractice" element={<RandomOrderPractice />} />
        {/* <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/sign-up" element={<SignUp />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
