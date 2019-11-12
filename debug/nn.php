<?php
$files = glob(__DIR__ . '/../games/*.json');
$files = array_map(function ($file) {
    return [
        'file' => $file,
        'mtime' => filemtime($file),
        'size' => filesize($file),
    ];
}, $files);
usort($files, function ($a, $b) {
    return $a['mtime'] - $b['mtime'];
});
?>
<html>

<head>
    <style>
        * {
            box-sizing: border-box;
        }

        html,
        body {
            margin: 0;
            padding: 0;
            width: 100vw;
            height: 100vh;
            display: flex;
        }

        .wrapper {
            display: flex;
        }

        .scroll {
            overflow-y: scroll;
            padding: 10px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="bundle.js"></script>
    <script>train()</script>
</body>
</html>