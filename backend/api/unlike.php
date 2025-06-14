<?php
require '../config.php';
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'];
$postId = $data['post_id'];

$stmt = $pdo->prepare("DELETE FROM likes WHERE user_id = ? AND post_id = ?");
$stmt->execute([$userId, $postId]);

echo json_encode(["message" => "Unliked"]);