<?php
$files = glob(__DIR__ . '/../games/*.json');
foreach ($files as $file) {
    unlink($file);
}
header('Location: debug.php');
