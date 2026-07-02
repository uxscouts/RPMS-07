import React, { useState, useEffect } from 'react';

export default function Users() {
  // 1. Initialize state as an empty array to prevent .map() crashes
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Fetch the data inside useEffect on component mount
  useEffect(() => {
    // Replace with your exact Codespaces local port URL or relative proxy path
   // const API_URL = 'http://localhost:8000/api/users.php'; 
    const API_URL = 'https://organic-tribble-gxpgrp4w4j29pqq-8001.app.github.dev/user.php';
    // const API_URL = '/api/users.php';
  //  const API_URL = `${import.meta.env.VITE_API_URL}/api/users.php`; 

    fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Handle both standard arrays and fallback arrays
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error("Expected array but received:", data);
          setError("Invalid data format received from server.");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this only runs once

  // 3. Handle loading state
  if (loading) return <div style={{ padding: '20px' }}>Loading system users...</div>;

  // 4. Handle error state
  if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

  // 5. Render the UI Table
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Database Users ({users.length})</h2>
      
      {users.length === 0 ? (
        <p>No users found in the database.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
              <th>ID</th>
              <th>Username</th>
              <th>Email</th>
              <th>Created At</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.created_at}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
