import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './index.css'

import LoginSelection from './pages/LoginSelection.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Signup from './pages/signup.jsx'
// import Dashboard from './pages/Dashboard.jsx'
import AdminDashboard from './pages/adminDashboard/AdminDashboard.jsx'
import ContractorDashboard from './pages/contractorDashboard.jsx'
import Logs from './pages/Logs.jsx'
import Reports from './pages/Reports.jsx'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/loginselection" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/loginselection" element={<LoginSelection />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/contractordashboard" element={<ContractorDashboard />} />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="/logs" element={<Logs />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="*" element={<Navigate to="/loginselection" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
