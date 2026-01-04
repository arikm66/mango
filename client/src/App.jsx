import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [items, setItems] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // Use the full URL for local testing, or relative path for production
  // const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/items';

  // No more localhost or environment variables needed here
  const API_URL = '/api/items';

  useEffect(() => {
    const fetchItems = async () => {
      const res = await axios.get(API_URL);
      setItems(res.data);
    };
    fetchItems();
  }, []);

  const saveData = async () => {
    if (!inputValue) return;
    try {
      const res = await axios.post(API_URL, { content: inputValue });
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
      </div>
      <ul style={{ lineHeight: '2' }}>
        {items.map(item => <li key={item._id}>{item.content}</li>)}
      </ul>
    </div>
  );
}

export default App;