<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

$mysqli = new mysqli("localhost", "root", "", "social_media");
if ($mysqli->connect_error) {
    http_response_code(500);
    echo json_encode(["message" => "Database connection failed."]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['email']) || !isset($data['password'])) {
    http_response_code(400);
    echo json_encode(["message" => "Email and password required."]);
    exit;
}

$email = strtolower(trim($data['email']));
$password = $data['password'];

$stmt = $mysqli->prepare("SELECT id, password, fName, lName, email, profile_picture FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($user = $result->fetch_assoc()) {
    if (password_verify($password, $user['password'])) {
        echo json_encode([
            "message" => "Login successful.",
            "id" => $user['id'],
            "fName" => $user['fName'],
            "lName" => $user['lName'],
            "email" => $user['email'],
            "profile_picture" => $user['profile_picture'],
            "token" => "" // Optional: add token here if needed
        ]);
    } else {
        http_response_code(401);
        echo json_encode(["message" => "Invalid credentials."]);
    }
} else {
    http_response_code(404);
    echo json_encode(["message" => "User not found."]);
}

$stmt->close();
$mysqli->close();
?>