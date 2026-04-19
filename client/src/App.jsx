import { Route, Routes } from 'react-router'
//import './App.css'
import FeedbackForm from './pages/FeedbackForm'

function App() {

  return (
    <>
        <Routes>
          <Route path="feedback" element={<FeedbackForm />} />
        </Routes>
    </>
  )
}

export default App
