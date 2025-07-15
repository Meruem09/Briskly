import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './component/SignUpPage'
import SignInPage from './component/SignInPage';
import Main from './component/Main';
import Onboarding from './component/OnBoarding';
import LandingPage from './component/LandingPage';
import Features from './component/Features';
function App() {

  return (
    <>  
    <Router>
      <Routes>
        <Route path="/signUp" element={<SignUpPage/>} />
        <Route path="/" element={<LandingPage/>} />
        <Route path="/signIn" element={<SignInPage/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/onBoard" element={<Onboarding/>} />
        <Route path="/features" element={<Features/>} />
        
      </Routes>
    </Router>
    </>
  )
}

export default App
