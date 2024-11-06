
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import CreatePost from './pages/CreatePostPage';
import ListViewPage from './pages/ListViewPage';
import MapPage from './pages/MapPage';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/post" element={<CreatePost />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/list" element={<ListViewPage />} />
        <Route path="/map" element={<MapPage />} />
        
      </Routes>
    </BrowserRouter>
    );
  }

export default App;