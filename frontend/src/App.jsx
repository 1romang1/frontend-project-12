import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "./Components/Pages/MainPage";
import LoginPage from "./Components/Pages/LoginPage";
import NotFoundPage from "./Components/Pages/NotFoundPage";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><MainPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
