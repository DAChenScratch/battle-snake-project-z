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
    return $b['mtime'] <=> $a['mtime'];
});
$files = array_slice($files, 0, 50);
$files = array_map(function ($file) {
    $content = file_get_contents($file['file']);
    if (!$content) {
        throw new \Exception('Could not load file: ' . $file['file']);
    }
    $content = json_decode($content, true);
    $file['content'] = [
        'snake' => $content['snake'],
    ];
    return $file;
}, $files);
?>
<html>

<head>
    <!-- @todo use a cache buster -->
    <link rel="stylesheet" href="styles.css" />
</head>

<body>
    <div class="wrapper">
        <div class="grid">
        </div>
        <div class="scroll">
            <div class="games">
                <a href="debug-delete.php">Delete</a>
                <?php foreach ($files as $file) : ?>
                    <div class="game" data-game="<?= basename($file['file']); ?>"><?= date(DATE_ISO8601, $file['mtime']); ?> <?= $file['content']['snake']; ?></div>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="scroll">
            <div class="moves"></div>
        </div>
        <pre class="scroll">
            <div class="log"></div>
        </pre>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.js"></script>
    <!-- @todo use a better cache -->
    <script src="bundle.js?cache=<?= time(); ?>"></script>
    <script>
        loadGrid();
    </script>
</body>

</html>