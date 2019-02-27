<?php
$files = glob(__DIR__ . '/../games/*.json');
$files = array_map(function($file) {
    return [
        'file' => $file,
        'mtime' => filemtime($file),
        'size' => filesize($file),
    ];
}, $files);
usort($files, function($a, $b) {
    return $a['mtime'] - $b['mtime'];
});
?>
<html>

<head>
    <style>
        .wrapper {
            display: flex;
        }

        .games,
        .moves {
            padding: 10px;
            flex-direction: column-reverse;
            display: flex;
            justify-content: flex-end;
        }

        .game,
        .move {
            cursor: pointer;
            text-decoration: underline;
        }

        .grid {
            width: 800px;
            height: 800px;
            display: flex;
            flex-direction: column;
        }

        .row {
            display: flex;
            flex: 1;
        }

        .col {
            border-top: 1px dashed #bbb;
            border-left: 1px dashed #bbb;
            display: flex;
            flex-direction: column;
            flex: 1;
            align-items: center;
            justify-content: center;
            position: relative;
        }

        .row:last-child .col {
            border-bottom: 1px dashed #bbb;
        }

        .col:last-child {
            border-right: 1px dashed #bbb;
        }

        .food {
            background: #3498db;
            width: 25px;
            height: 25px;
            border-radius: 25px;
            margin: 1px;
        }

        .path {
            background: #e67e22;
            width: 25px;
            height: 25px;
            margin: 1px;
        }

        .snake {
            flex: 1;
            width: 100%;
            border: 1px dotted #eee;
        }

        .weight {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            text-align: center;
            font-size: 10px;
        }
    </style>
</head>

<body>
    <div class="wrapper">
        <div>
            <div class="grid">
            </div>
            <div class="log">
            </div>
        </div>
        <div class="games">
            <?php foreach ($files as $file): ?>
                <div class="game" data-game="<?= basename($file['file']); ?>"><?= date(DATE_ISO8601, $file['mtime']); ?></div>
            <?php endforeach; ?>
        </div>
        <div class="moves">
        </div>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="bundle.js"></script>
</body>
</html>