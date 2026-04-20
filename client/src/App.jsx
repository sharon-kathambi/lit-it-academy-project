import { Route, Routes } from 'react-router'
//import './App.css'
import FeedbackForm from './pages/FeedbackForm'
import Login from './pages/Login'

function App() {

  return (
    <>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="feedback" element={<FeedbackForm />} />
        </Routes>
    </>
  )
}

export default App
