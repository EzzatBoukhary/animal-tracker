
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePost from './pages/CreatePostPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post" element={<CreatePost />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        
      </Routes>
    </BrowserRouter>
    );
  }

export default App;