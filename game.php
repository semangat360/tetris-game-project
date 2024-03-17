<?php
// game.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Mendapatkan skor dari permintaan POST
    $score = $_POST['score'];

    // Simpan skor ke dalam file teks
    $file = 'scores.txt';
    file_put_contents($file, $score . PHP_EOL, FILE_APPEND);

    // Menampilkan pesan berhasil
    echo 'Skor berhasil disimpan!';
} else {
    // Menampilkan daftar skor dari file
    $file = 'scores.txt';
    if (file_exists($file)) {
        $scores = file_get_contents($file);
        $scoresArray = explode(PHP_EOL, $scores);
        $scoresArray = array_filter($scoresArray); // Hapus baris kosong
        rsort($scoresArray); // Urutkan skor dari yang tertinggi
        echo '<h1>Daftar Skor</h1>';
        echo '<ul>';
        foreach ($scoresArray as $score) {
            echo '<li>' . $score . '</li>';
        }
        echo '</ul>';
    } else {
        echo 'Belum ada skor yang tersimpan.';
    }
}