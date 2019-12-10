<?php
$cwd = getcwd();
chdir(__DIR__ . '/engine');
exec('engine dev > NUL 2>&1');
chdir($cwd);
