<?php
require '../config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$postId = $data['post_id'];
$userId = $data['user_id'];
$content = $data['content'];

$stmt = $pdo->prepare("INSERT INTO replies (post_id, user_id, content) VALUES (?, ?, ?)");
$stmt->execute([$postId, $userId, $content]);

echo json_encode(["message" => "Reply added"]);