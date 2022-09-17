<?php
session_start();

$response = [];

function checkDot($x, $y, $z, $r) {
  return $x >= 4 - $r && $x <= 4 + $r && $y >= 4 - $r && $y <= 4 + $r && $z >= 5 - $r && $z <= 5 + $r;
}

function validate_x($x) {
  return is_numeric($x) && $x >= 0 && $x <= 8;
}

function validate_y($y) {
  return is_numeric($y) && $y >= 0 && $y <= 10;
}

function validate_z($z) {
  return is_numeric($z) && $z >= 0 && $z <= 10;
}

function validate_r($r) {
  return is_numeric($r) && $r >= 1 && $r <= 3;
}

function validate_xyzr($x, $y, $z, $r) {
  return validate_x($x) && validate_y($y) && validate_z($z) && validate_r($r);
}

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  if(!isset($_SESSION['lab1_table'])) {
    $_SESSION['lab1_table'] = '';
  }

  $response = $_SESSION['lab1_table'];

  exit($response);
}

if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
  $_SESSION['lab1_table'] = '';

  exit();
}

if (isset($_REQUEST['x']) && isset($_REQUEST['y']) && isset($_REQUEST['z']) && isset($_REQUEST['r'])) {
  $x = $_REQUEST['x'];
  $y = $_REQUEST['y'];
  $z = $_REQUEST['z'];
  $r = $_REQUEST['r'];

  $isHit = checkDot($x, $y, $z, $r) ? 'true' : 'false';
  $isValid = validate_xyzr($x, $y, $z, $r) ? 'true' : 'false';

  $currentTime = date('H:i:s', time());
  $executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);
  if ($isValid == 'true') {
    $row = "<tr><td>" . strval($x) . "</td><td>" . strval($y) . "</td><td>" . strval($z) . "</td><td>" . strval($r) . "</td><td>" .
      strval($currentTime) . "</td><td>" . strval($executionTime) . "</td><td>" . $isHit . "</td></tr>";
    if (!isset($_SESSION['lab1_table'])) {
      $_SESSION['lab1_table'] = $row;
    } else {
      $_SESSION['lab1_table'] = $_SESSION['lab1_table'] . $row;
    }
    $response = $_SESSION['lab1_table'];
  } else {
    $response = "500";
    http_response_code(500);
  }
}
echo $response;
?>
