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

// Optional default values
$fName = isset($data['fName']) ? trim($data['fName']) : '';
$lName = isset($data['lName']) ? trim($data['lName']) : '';
$profile_picture = isset($data['profile_picture']) ? trim($data['profile_picture']) : '';

if (!preg_match('/.+@.+\.com$/', $email)) {
    http_response_code(400);
    echo json_encode(["message" => "Email must end with @...com"]);
    exit;
}

$stmt = $mysqli->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["message" => "User already exists."]);
    exit;
}
$stmt->close();

$hashed = password_hash($password, PASSWORD_DEFAULT);

$stmt = $mysqli->prepare("INSERT INTO users (email, password, fName, lName, profile_picture, created_at) VALUES (?, ?, ?, ?, ?, NOW())");
$stmt->bind_param("sssss", $email, $hashed, $fName, $lName, $profile_picture);

if ($stmt->execute()) {
    $userId = $stmt->insert_id;

    echo json_encode([
        "message" => "User registered successfully.",
        "id" => $userId,
        "email" => $email,
        "fName" => $fName,
        "lName" => $lName,
        "profile_picture" => $profile_picture
    ]);
} else {
    http_response_code(500);
    echo json_encode(["message" => "Error registering user."]);
}
$stmt->close();
$mysqli->close();
?>