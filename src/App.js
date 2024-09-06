import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

// Import router components
import Login from "./components/login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App; // Ensure you export the App component as default
