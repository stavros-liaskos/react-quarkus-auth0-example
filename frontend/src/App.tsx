import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Profile from './components/Profile';
import ProtectedApi from './components/ProtectedApi';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/protected-api" element={<ProtectedApi />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
