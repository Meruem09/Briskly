import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import SignUpPage from './component/SignUpPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>  
    <SignUpPage/>
    </>
  )
}

export default App
