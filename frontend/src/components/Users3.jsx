import React, { useState, useEffect } from 'react';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State for the new user form
    const [formData, setFormData] = useState({ username: '', email: '' });

    const getCodespacesBackendUrl_02 = () => {
        const currentURL_02 = window.location.href;
        if (currentURL_02.includes('github.dev') || currentURL_02.includes('app.github.dev')) {
            return currentURL_02.replace('-3000.', '-8001.').replace(/\/$/, '');
        }
        return 'http://localhost:8000';
    };

    const BASE_URL2 = getCodespacesBackendUrl_02();
    const API_URL2 = BASE_URL2 + '/users3.php';

    // Fetch users function
    const fetchUsers = () => {
        fetch(API_URL2, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then((response) => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        })
        .then((data) => {
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
    };

    useEffect(() => {
        fetchUsers();
    }, []); 

    // Handle form submission to add a user
    const handleAddUser = (e) => {
        e.preventDefault();
        
        fetch(API_URL2, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                // Clear form and refresh user list
                setFormData({ username: '', email: '' });
                fetchUsers(); 
            } else {
                alert("Error adding user: " + (data.message || 'Unknown error'));
            }
        })
        .catch((err) => console.error("Error:", err));
    };

    if (loading) return <div style={{ padding: '20px' }}>Loading system users...</div>;
    if (error) return <div style={{ color: 'red', padding: '20px' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>Database Users ({users.length})</h2>

            {/* Add User Form */}
            <form onSubmit={handleAddUser} style={{ marginBottom: '30px', padding: '15px', border: '1px solid #ccc', borderRadius: '5px', maxWidth: '400px' }}>
                <h3>Add New User</h3>
                <div style={{ marginBottom: '10px' }}>
                    <label>Username: </label>
                    <input 
                        type="text" 
                        value={formData.username} 
                        onChange={(e) => setFormData({...formData, username: e.target.value})} 
                        required 
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email: </label>
                    <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})} 
                        required 
                    />
                </div>
                <button type="submit">Add User</button>
            </form>

            {/* Users Table */}
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
