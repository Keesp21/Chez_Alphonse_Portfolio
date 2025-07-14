import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import PublicSite from './components/PublicSite'
import AdminPanel from './components/AdminPanel'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PublicSite />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

