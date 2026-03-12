<?php
$conn = new mysqli("localhost", "root", "", "school_db");
$data = json_decode(file_get_contents("php://input"));

$name = $conn->real_escape_string($data->name);
$class = $conn->real_escape_string($data->class);
$result = $conn->real_escape_string($data->result);

$sql = "INSERT INTO students (name, class, result) VALUES ('$name', '$class', '$result')";
$conn->query($sql);
echo json_encode(["status" => "ok"]);
?>
