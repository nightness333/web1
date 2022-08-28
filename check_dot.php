<?php
$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];

function checkRectangle($x, $y, $r) {
  return $x <= 0 && $y <= 0 && $x >= (-1)*$r && $y >= (-1)*$y;
}

function checkTriangle($x, $y, $r) {
  return $x <= 0 && $y >= 0 && $x + $y <= $r;
}

function checkCircle($x, $y, $r) {
  return $x >= 0 && $y <= 0 && sqrt($x*$x+$y*$y) <= $r;
}

function checkDot($x, $y, $r) {
  return checkTriangle($x, $y, $r) || checkRectangle($x, $y, $r) || checkCircle($x, $y, $r);
}

$isValid = 'true';
$isHit = checkDot($x, $y, $r) ? 'true' : 'false';

$currentTime = date('H:i:s', time());
$executionTime = round(microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'], 7);

$response = json_encode([
    'x' => $x,
    'y' => $y,
    'r' => $r,
    'currentTime' => $currentTime,
    'executionTime' => $executionTime,
    'hitResult' => $isHit,
]);

echo $response;
?>
