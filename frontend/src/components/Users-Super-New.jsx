import React, { useState, useEffect } from 'react';

// 1. Dynamically calculate the backend URL based on your browser's address bar
const getCodespacesBackendUrl = () => {
  const currentUrl = window.location.href; // e.g., https://github.dev

  if (currentUrl.includes('github.dev') || currentUrl.includes('app.github.dev')) {
    // Automatically replaces your React port (3000) with your PHP container port (8000)
    return currentUrl.replace('-3000.', '-8000.').replace(/\/$/, '');
  }

  // Fallback if you run this outside of Codespaces on standard local docker
  return 'http://localhost:8000';
};

const BASE_URL = getCodespacesBackendUrl();

export default function Users() {
  // Table Data States
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form Input States
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // 2. Function to fetch the user list from the backend mysql container
  const fetchUsers = () => {
    // 👇 CHANGED FROM /api/ TO /backend/ 👇
    fetch(`${BASE_URL}/backend/users.php`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setError("Invalid data format received from server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  // Run the fetch on initial component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // 3. Handle Form Submission to save new user input into database
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!username || !email) {
      setFormMessage('Please fill out all fields.');
      return;
    }

    // 👇 CHANGED FROM /api/ TO /backend/ 👇
    fetch(`${BASE_URL}/backend/create_user.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, email }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create user');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setFormMessage('User created successfully! 🎉');
          setUsername(''); // Reset input boxes
          setEmail('');
          fetchUsers();   // Instantly refresh table with new database data!
        } else {
          setFormMessage(`Error: ${data.message}`);
        }
      })
      .catch((err) => {
        setFormMessage(`Network Error: ${err.message}`);
      });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading application users...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error loading data: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
      
      {/* 🛠️ ADD USER CONTAINER */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
        <h3 style={{ marginTop: 0 }}>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="e.g. JohnDoe"
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' }}
              placeholder="e.g. john@example.com"
            />
          </div>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            Save User to MySQL
          </button>
        </form>
        {formMessage && <p style={{ marginTop: '12px', fontWeight: 'bold', color: formMessage.includes('Error') ? 'red' : 'green' }}>{formMessage}</p>}
      </div>

      {/* 📊 DATABASE TABLE VISUALIZATION */}
      <h2>Database Users ({users.length})</h2>
      {users.length === 0 ? (
        <p>No records found in the user table.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', borderRadius: '4px', overflow: 'hidden', border: '1px solid #ddd' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
