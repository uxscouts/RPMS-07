<?php
// Get the domain making the request (the React frontend)
$http_origin = $_SERVER['HTTP_ORIGIN'] ?? '';

// Check if the request comes from localhost or a github preview domain
if (strpos($http_origin, 'localhost:3000') !== false || strpos($http_origin, 'github.dev') !== false) {
    header("Access-Control-Allow-Origin: " . $http_origin);
}

header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE, PUT");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Handle the preflight OPTIONS request that browsers send automatically
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---- Your Database Connection Code Below ----

/*
$host = 'mysql'; 
$db   = getenv('DB_NAME');
$user = getenv('DB_USER');
$pass = getenv('DB_PASS');
$charset = 'utf8mb4';
*/

/*
$host = getenv('DB_HOST') ?: 'mysql';
$db   = getenv('DB_DATABASE');
$user = getenv('DB_USERNAME');
$pass = getenv('DB_PASSWORD');
$charset = 'utf8mb4';
*/

$host = 'mysql'; 
$db   = 'my_database';
$user = 'dev_user';
$pass = 'dev_password';
$charset = 'utf8mb4';


$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
    
    // Example: Fetching the auto-built entries to send to React
    $stmt = $pdo->query('SELECT id, username, email FROM users');
    $users = $stmt->fetchAll();
    
    // Output the data as JSON for React to consume
    header('Content-Type: application/json');
    echo json_encode($users);

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Database connection failed: " . $e->getMessage()]);
}
?>
