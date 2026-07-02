import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ProjectPage from './pages/ProjectPage';
import ContextDetailPage from './pages/ContextDetailPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <div className="container">
            <Link to="/" className="logo">
              <h1>Design Context Pro</h1>
            </Link>
            <nav>
              <Link to="/">Projects</Link>
              <Link to="/settings">Settings</Link>
            </nav>
          </div>
        </header>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/project/:fileKey" element={<ProjectPage />} />
            <Route path="/project/:fileKey/context/:contextId" element={<ContextDetailPage />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <div className="container">
            <p>Design Context Pro - Add context to your design systems</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
