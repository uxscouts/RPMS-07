import React, {
    useState,
    useEffect
} from 'react';

export default function Users() {
    // 1. Initialize state as an empty array to prevent .map() crashes
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        // You could just copy the URL and write it like this 
        // https://animated-space-umbrella-g4p4xpwj6jr939wxr-8001.app.github.dev/user.php
        // but it is better to create the URL programatically by using the environment variable,
        // unfortunately me and Google AI could not make that work because of how
        // retarded the whole container in container thing is.  Codespaces (containers) using
        // docker containers with contained instances of MySQL, PHP and REACT causes problemns.
        // The nost simnple solution is old-school JavaScript (window.location.href) and do the
        // function  getCodespacesBackendUrl_02()
        // See below:

        const getCodespacesBackendUrl_02 = () => {
            const currentURL_02 = window.location.href;
            if (currentURL_02.includes('github.dev') || currentUrl.includes('app.github.dev')) {
                return currentURL_02.replace('-3000.', '-8001.').replace(/\/$/, '');
            }
            return 'http://localhost:8000';
        }

        const BASE_URL2 = getCodespacesBackendUrl_02();

        // Add the PHP Endpoint to the base URL, /user.php 
        const API_URL2 = BASE_URL2 + '/users3.php'

        // See how I did that? I mean Google AI showed me how, take whatever the URL
        // as save it const and then add the php page which does the datbase query


        fetch(API_URL2, {
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