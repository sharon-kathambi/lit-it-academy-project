import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import FeedbackForm from "./pages/FeedbackForm";


function ProtectedAdmin() {
  const [authed, setAuthed] = useState(
    () => sessionStorage.getItem("admin_authed") === "true"
  );

  if (!authed) {
    return <Login onLogin={() => setAuthed(true)} />;
  }

  return <AdminDashboard onLogout={() => {
    sessionStorage.removeItem("admin_authed");
    setAuthed(false);
  }} />;
}

export default function App() {
  return (
      <Routes>
        <Route path="/feedback" element={<FeedbackForm />} />
        <Route path="/admin"    element={<ProtectedAdmin />} />
        <Route path="*"         element={<Navigate to="/feedback" replace />} />
      </Routes>
  );
}

