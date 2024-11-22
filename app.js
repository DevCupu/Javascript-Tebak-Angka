'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 'localhost';
const HOST = '5600';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Target angka untuk ditebak (1-10)
let targetNumber = Math.floor(Math.random() * 10) + 1;

// Static files (CSS, JS, etc.)
app.use(express.static('public'));

/* [ROUTE] '/' [Welcome Page] */
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Game Tebak Angka</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { padding: 20px; background-color: #f8f9fa; font-family: Arial, sans-serif; }
                .container { margin-top: 50px; }
                .btn-custom { background-color: #007bff; color: white; }
            </style>
        </head>
        <body>
            <div class="container text-center">
                <h1 class="mb-4">Selamat Datang di Game Tebak Angka!</h1>
                <p class="lead">Saya telah memilih angka antara <strong>1</strong> hingga <strong>10</strong>. Bisakah Anda menebaknya?</p>
                <a href="/game" class="btn btn-primary btn-lg">Mulai Bermain</a>
            </div>
        </body>
        </html>
    `);
});

/* [ROUTE] '/game' [Game Page] */
app.get('/game', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Game Tebak Angka</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { padding: 20px; background-color: #f8f9fa; }
                .container { margin-top: 50px; }
            </style>
        </head>
        <body>
            <div class="container text-center">
                <h1 class="mb-4">Game Tebak Angka</h1>
                <p class="lead">Saya sudah memilih angka. Silakan coba tebak!</p>
                <form action="/game" method="post">
                    <div class="mb-3">
                        <label for="guess" class="form-label">Masukkan tebakan Anda:</label>
                        <input type="number" class="form-control" id="guess" name="guess" placeholder="1-10" min="1" max="10" required>
                    </div>
                    <button type="submit" class="btn btn-success btn-lg">Kirim Tebakan</button>
                </form>
                <div class="text-center mt-4">
                    <a href="/" class="btn btn-secondary btn-sm">Kembali ke Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

/* [ROUTE] '/game' [Handle Tebakan] */
app.post('/game', (req, res) => {
    const guess = parseInt(req.body.guess, 10);
    let message;
    let status;

    if (guess === targetNumber) {
        message = `🎉 Selamat! Anda menebak angka <strong>${targetNumber}</strong> dengan benar!`;
        status = 'success';
        targetNumber = Math.floor(Math.random() * 10) + 1; // Reset angka untuk permainan baru
    } else if (guess > targetNumber) {
        message = `❌ Tebakan Anda <strong>terlalu besar</strong>. Coba lagi!`;
        status = 'danger';
    } else {
        message = `❌ Tebakan Anda <strong>terlalu kecil</strong>. Coba lagi!`;
        status = 'warning';
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Game Tebak Angka</title>
            <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
            <style>
                body { padding: 20px; background-color: #f8f9fa; }
                .container { margin-top: 50px; }
            </style>
        </head>
        <body>
            <div class="container text-center">
                <h1 class="mb-4">Game Tebak Angka</h1>
                <div class="alert alert-${status}" role="alert">
                    ${message}
                </div>
                <form action="/game" method="post">
                    <div class="mb-3">
                        <label for="guess" class="form-label">Masukkan tebakan baru:</label>
                        <input type="number" class="form-control" id="guess" name="guess" placeholder="1-10" min="1" max="10" required>
                    </div>
                    <button type="submit" class="btn btn-success btn-lg">Coba Lagi</button>
                </form>
                <div class="text-center mt-4">
                    <a href="/" class="btn btn-secondary btn-sm">Kembali ke Home</a>
                </div>
            </div>
        </body>
        </html>
    `);
});

// Start server
app.listen(PORT, HOST, () => {
    console.log(`Running on http://${HOST}:${PORT}`);
});
