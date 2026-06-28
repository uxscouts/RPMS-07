import React, { useState, useEffect } from 'react';

function UserList() {
  // State to hold our database entries
  const [users, setUsers] = useState([]);
  // State to handle loading feedback
  const [loading, setLoading] = useState(true);
  // State to handle any network or backend errors
  const [error, setError] = useState(null);

  useEffect(() => {
// Find the unique Codespace name from the environment variables you passed in
const codespaceName = import.meta.env.VITE_CODESPACE_NAME;
// If inside a Codespace, use its secure URL structure. Otherwise, fall back to localhost.
const backendUrl = codespaceName 
  ? `https://${codespaceName}-8001.app.github.dev/index.php`
  : 'http://localhost:8001/index.php';

    fetch(backendUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []); // Empty array means this runs exactly once when the component mounts

  if (loading) return <p>Loading users from the database...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div>
      <h2>Automatically Generated Database Users</h2>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
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

export default UserList;
