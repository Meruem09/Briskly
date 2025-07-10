import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './component/SignUpPage'
import SignInPage from './component/SIgnInPage';
import Main from './component/Main';

function App() {

  return (
    <>  
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage/>} />
        <Route path="/signIn" element={<SignInPage/>} />
        <Route path="/main" element={<Main/>} />
      </Routes>
    </Router>
    </>
  )
}

export default App
