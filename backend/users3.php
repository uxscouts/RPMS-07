<?php
// 1. Handle CORS securely and fix the Allow-Credentials wildcard bug
$origin = $_SERVER['HTTP_ORIGIN'] ?? '*';
header("Access-Control-Allow-Origin: $origin"); 
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json; charset=UTF-8");

// 2. Handle Preflight instantly
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// 3. Database Credentials
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

// Fallback updated to an array of objects to prevent frontend map() crashes
$fallbackUsers = [[
    'id' => 14,
    'username' => 'Leif (Fallback)',
    'email' => 'leif@leif.com',
    'created_at' => '2026-07-01',
]];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
try {
    $pdo = new PDO($dsn, $user, $pass, $options);

    // Use FETCHALL to get up to 10 users as an array
    $stmt = $pdo->prepare("SELECT * FROM `users` LIMIT 10");
    $stmt->execute();
    $userData = $stmt->fetchAll(); 

    if (!empty($userData)) {
        echo json_encode($userData);
    } else {
        // Table is empty, return empty array so React doesn't crash
        echo json_encode([]); 
    }

    } catch (\PDOException $e) {
        // CRITICAL: Temporarily return a 500 error and the message so you can see it in Network tab
        http_response_code(500);
        echo json_encode([
            "error" => "Database connection failed",
            "message" => $e->getMessage()
        ]);
    }
}
?>


<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
         
    if (isset($data['username']) && isset($data['email'])) {
        $username = $data['username'];
        $email = $data['email'];

        try {
            $pdo = new PDO($dsn, $user, $pass, $options);
            $stmt = $pdo->prepare("INSERT INTO users (username, email) VALUES (:username, :email)");
            // Execute the statement by passing an array of data
            $stmt->execute([
                ':username' => $username,
                ':email' => $email
            ]);

            echo json_encode(["success" => true, "message" => "User added successfully"]);
        } catch (PDOException $e) {
            // Output error message if the query fails
            echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
    }
         
    exit();
}

?>






<?php
/*
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$host = 'localhost'; 
$db   = 'your_database_name';
$user = 'your_db_username';
$pass = 'your_db_password';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die(json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    
    if (isset($data['username']) && isset($data['email'])) {
        $username = $conn->real_escape_string($data['username']);
        $email = $conn->real_escape_string($data['email']);

        $sql = "INSERT INTO users (username, email) VALUES ('$username', '$email')";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["success" => true, "message" => "User added successfully"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error: " . $conn->error]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Missing required fields"]);
    }
    
    $conn->close();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC";
    $result = $conn->query($sql);
    
    $users = [];
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $users[] = $row;
        }
    }
    
    echo json_encode($users);
    $conn->close();
    exit();
}
*/
?>
