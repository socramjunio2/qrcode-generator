import React from "react";
import { Routes, Route } from "react-router-dom";
import QRCodeForm from "./components/QRCodeForm";

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<QRCodeForm />} />
    </Routes>
  );
};

export default App;
