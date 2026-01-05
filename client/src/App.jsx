import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import api from './services/api';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';

function Home() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const { token, logout } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/items');
        setItems(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [token]);

  const saveData = async () => {
    if (!inputValue) return;
    try {
      const res = await api.post('/items', { content: inputValue });
      setItems([...items, res.data]);
      setInputValue('');
    } catch (err) {
      console.error("Error saving data:", err);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Vite + React + Node</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New entry..."
          style={{ padding: '8px', marginRight: '8px' }}
        />
        <button onClick={saveData} style={{ padding: '8px 16px', cursor: 'pointer' }}>
          Save to DB
        </button>
        {token && <button onClick={logout} style={{ marginLeft: 8 }}>Logout</button>}
      </div>
      <ul style={{ lineHeight: '2' }}>
        {items.map(item => <li key={item._id}>{item.content}</li>)}
      </ul>
    </div>
  );
}

function AppWrapper() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ padding: 12 }}>
          <nav style={{ marginBottom: 12 }}>
            <Link to="/" style={{ marginRight: 8 }}>Home</Link>
            <Link to="/login" style={{ marginRight: 8 }}>Login</Link>
            <Link to="/register">Register</Link>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppWrapper;