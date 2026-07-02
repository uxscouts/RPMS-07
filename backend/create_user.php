<?php
// 1. Handle CORS securely via dynamic origin reflection matching your setup
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin"); 
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle Preflight OPTIONS request instantly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// 3. Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "message" => "Method Not Allowed"]);
    exit();
}

// 4. Capture incoming raw JSON body payload from React
$jsonInput = file_get_contents("php://input");
$data = json_decode($jsonInput, true);

$username = $data['username'] ?? null;
$email = $data['email'] ?? null;

// Validate input variables are present
if (!$username || !$email) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing required fields: username and email"]);
    exit();
}

// 5. Connect to the database using your environment configurations
$host = getenv('DB_HOST') ?: 'mysql';
$db   = getenv('DB_DATABASE') ?: 'my_database';
$user = getenv('DB_USERNAME') ?: 'dev_user';
$pass = getenv('DB_PASSWORD') ?: 'dev_password';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // 6. Securely insert data using prepared parameters
    $sql = "INSERT INTO `user` (username, email) VALUES (:username, :email)";
    $stmt = $pdo->prepare($sql);
    
    $success = $stmt->execute([
        ':username' => htmlspecialchars(strip_tags($username)),
        ':email'    => filter_var($email, FILTER_SANITIZE_EMAIL)
    ]);

    if ($success) {
        http_response_code(201); // 201 Created
        echo json_encode(["success" => true, "message" => "User inserted successfully!"]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Failed to write user to database."]);
    }

} catch (\PDOException $e) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database write failure: " . $e->getMessage()
    ]);
}
