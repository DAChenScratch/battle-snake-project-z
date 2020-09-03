<?php
function readJsonFile($file)
{
    $content = gzfile($file);
    $content = implode($content);
    if (!$content) {
        throw new \Exception('Could not load file: ' . $file);
    }
    $content = json_decode($content, true);
    if (json_last_error()) {
        throw new \Exception('JSON error: ' . json_last_error_msg());
    }
    return $content;
}

$selectedGame = $_GET['game'] ?? null;
$selectedSnake = $_GET['snake'] ?? null;
$selectedTurn = $_GET['turn'] ?? null;

$moveJson = null;
$files = glob(__DIR__ . '/../games/*', GLOB_ONLYDIR);
$files = array_map(function ($path) use (&$moveJson, $selectedGame, $selectedSnake, $selectedTurn) {
    return [
        'path' => $path,
        'gameId' => basename($path),
        'mtime' => filemtime($path),
        'snakes' => array_map(function ($snakePath) use ($path, &$moveJson, $selectedGame, $selectedSnake, $selectedTurn) {
            $start = readJsonFile($snakePath . '/0000_start.json.gz');
            $moves = array_map(function ($movePath) {
                return trim(preg_replace('/_|move|start|end|.json.gz/', ' ', basename($movePath)));
            }, glob($snakePath . '/*.json.gz'));
            natsort($moves);
            $moves = array_combine($moves, $moves);
            if (basename($path) == $selectedGame && $start['body']['you']['id'] == $selectedSnake && isset($moves[$selectedTurn])) {
                $name = 'move';
                if ($selectedTurn == '0000') {
                    $name = 'start';
                }
                if ($selectedTurn == '9999') {
                    $name = 'end';
                }
                $moveJson = readJsonFile($snakePath . '/' . $moves[$selectedTurn] . '_' . $name . '.json.gz');
            }
            return [
                'id' => $start['body']['you']['id'],
                'name' => $start['body']['you']['name'],
                'moves' => $moves,
            ];
        }, glob($path . '/*', GLOB_ONLYDIR)),
    ];
}, $files);
usort($files, function ($a, $b) {
    return $b['mtime'] <=> $a['mtime'];
});
$files = array_slice($files, 0, 50);
// $files = array_map(function ($file) {
//     var_dump($file);
//     $content = file_get_contents($file['file']);
//     // $content = file_get_contents($file['file']);
//     // if (!$content) {
//     //     throw new \Exception('Could not load file: ' . $file['file']);
//     // }
//     // $content = json_decode($content, true);
//     // $file['content'] = [
//     //     'snake' => $content['snake'],
//     // ];
//     return $file;
// }, $files);
?>
<html>

<head>
    <!-- @todo use a cache buster -->
    <link rel="stylesheet" href="styles.css?cache=<?= md5_file(__DIR__ . '/styles.css'); ?>" />
</head>

<body>
    <div class="wrapper">
        <div class="grid">
        </div>
        <div class="scroll">
            <div class="games">
                <a href="debug-delete.php">Delete</a>
                <?php foreach ($files as $file) : ?>
                    <div>
                        <?= date(DATE_ISO8601, $file['mtime']); ?>
                        <?php foreach ($file['snakes'] as $snake) : ?>
                            <div>
                                <a href="?game=<?= $file['gameId']; ?>&snake=<?= $snake['id']; ?>"><?= $snake['name']; ?></a>
                            </div>
                        <?php endforeach; ?>
                    </div>
                <?php endforeach; ?>
            </div>
        </div>
        <div class="scroll">
            <div class="moves">
                <?php foreach ($files as $file) : ?>
                    <?php if ($_GET['game'] !== $file['gameId']) continue; ?>
                    <?php foreach ($file['snakes'] as $snake) : ?>
                        <?php if ($_GET['snake'] !== $snake['id']) continue; ?>
                        <?php foreach ($snake['moves'] as $move) : ?>
                            <div>
                                <a href="?game=<?= $file['gameId']; ?>&snake=<?= $snake['id']; ?>&turn=<?= $move; ?>"><?= $move; ?></a>

                            </div>
                        <?php endforeach; ?>
                    <?php endforeach; ?>
                <?php endforeach; ?>
            </div>
        </div>
        <pre class="scroll">
            <div class="log"></div>
        </pre>
        <pre class="scroll">
            <div class="data"><?= json_encode($moveJson, JSON_PRETTY_PRINT); ?></div>
        </pre>
    </div>
    <script src="https://code.jquery.com/jquery-3.3.1.min.js"></script>
    <script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.7.8/angular.js"></script>
    <script src="bundle.js?cache=<?= md5_file(__DIR__ . '/bundle.js'); ?>"></script>
    <script>
        loadGrid(<?= json_encode($moveJson, JSON_PRETTY_PRINT); ?>);
    </script>
</body>

</html>