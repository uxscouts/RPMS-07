CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Automatically insert many entries
INSERT INTO users (username, email) VALUES 
('alice_dev', 'alice@example.com'),
('bob_builder', 'bob@example.com'),
('charlie_test', 'charlie@example.com'),
('david_admin', 'david@example.com'),
('eve_engine', 'eve@example.com');
