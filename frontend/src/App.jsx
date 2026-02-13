import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from "./Components/Pages/MainPage";
import LoginPage from "./Components/Pages/LoginPage";
import NotFoundPage from "./Components/Pages/NotFoundPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
