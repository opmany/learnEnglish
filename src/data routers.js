import React from "react";
import ReactDOM from "react-dom/client";
import { createHashRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import "./styles/index.css";


const router = createHashRouter([
  {
    path: "/*",
    element: <App />,
  },
  {
    path: "/WordsShowcase",
    element: <App />,
  },
  {
    path: "/OrderPractice",
    element: <App />,
  },
  {
    path: "/RandomOrderPractice",
    element: <App />,
  },
]);

// ReactDOM.createRoot(document.getElementById("root")).render(
//   <React.StrictMode>
//     <RouterProvider router={router} />
//   </React.StrictMode>
// );