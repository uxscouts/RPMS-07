import React, { useState, useEffect } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form input states
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [formMessage, setFormMessage] = useState('');

  // Base API configuration from your working environment variables
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Function to fetch the user list
  const fetchUsers = () => {
    fetch(`${BASE_URL}/api/users.php`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormMessage('');

    if (!username || !email) {
      setFormMessage('Please fill out all fields.');
      return;
    }

    // Send data to the new create_user.php backend script
    fetch(`${BASE_URL}/api/create_user.php`, {
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
          setUsername(''); // Clear form inputs
          setEmail('');
          fetchUsers(); // Refresh the table list immediately!
        } else {
          setFormMessage(`Error: ${data.message}`);
        }
      })
      .catch((err) => {
        setFormMessage(`Network Error: ${err.message}`);
      });
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px' }}>
      
      {/* 🛠️ ADD USER FORM */}
      <div style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
        <h3>Add New User</h3>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '10px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
          <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '3px', cursor: 'pointer' }}>
            Save User
          </button>
        </form>
        {formMessage && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{formMessage}</p>}
      </div>

      {/* 📊 USERS TABLE */}
      <h2>Database Users ({users.length})</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
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
