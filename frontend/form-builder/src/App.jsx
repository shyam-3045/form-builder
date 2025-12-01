import { useState } from 'react'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import FormPage from './pages/FormPage'
import HomePage from './pages/Home'
import { Dashboard } from './pages/Dashboard'
import FormPreviewPage from './pages/FormPreviewPage'
import ResponsesPage from './pages/ResponsesPage'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path ="/" element={<HomePage/>}/>
        <Route path="/forms/:formID/responses" element={<ResponsesPage/>}/>
        <Route path="/form/:formID/preview" element={<FormPreviewPage />} />
        <Route path ="/dashboard" element={<Dashboard/>}/>
        <Route path ="/form/:formID" element={<FormPage/>}/>
      </Routes>
    
    </BrowserRouter>
  )
}

export default App
