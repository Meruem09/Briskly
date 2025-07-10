import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



const Main = () => {
    return ( 
    <Router>
      <Routes>
        <Route path="/" element={<SignUpPage/>} />
        <Route path="/signIn" element={<SignInPage/>} />
        <Route path="/main" element={<Main/>} />
        <Route path="/onBoard" element={<Onboarding/>} />
      </Routes>
    </Router>
     );
}
 
export default Main;