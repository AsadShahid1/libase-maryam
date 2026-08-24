<?php

// Vercel PHP Runtime entry point for Laravel
// This file routes all PHP requests into Laravel's bootstrap

$_SERVER['SCRIPT_FILENAME'] = __DIR__ . '/../public/index.php';
$_SERVER['SCRIPT_NAME']     = '/index.php';
$_SERVER['PHP_SELF']        = '/index.php';

require __DIR__ . '/../public/index.php';
