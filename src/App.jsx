import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Upload from "./pages/Upload"
import Analyze from "./pages/Analyze"
import Home from "./pages/Home"
import {Toaster} from 'sonner'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Home/> } />
          <Route path='/upload' element={<Upload />} />
          <Route path='/analyze' element={<Analyze />} />
        </Routes>
        <Toaster />
      </Router>
    </>
  )
}

export default App;