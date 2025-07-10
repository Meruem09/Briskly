import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './component/SignUpPage'
import SignInPage from './component/SIgnInPage';

function App() {

  return (
    <>  
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage/>} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
        <Route path="signIn" element={<SignInPage/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
