'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 3000;
const HOST = '127.0.0.1';

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Menetapkan view engine menjadi EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Rute untuk halaman utama
app.get('/', (req, res) => {
    res.render('index');
});

// Rute untuk halaman permainan
app.get('/game', (req, res) => {
    res.render('game');
});

// Rute untuk mengolah tebakan
app.post('/game', (req, res) => {
    const guess = parseInt(req.body.guess); // Mengambil angka yang dimasukkan oleh pengguna
    const correctAnswer = Math.floor(Math.random() * 10) + 1; // Angka acak antara 1-10

    let message = '';
    let status = '';

    // Mengecek tebakan
    if (isNaN(guess) || guess < 1 || guess > 10) {
        message = 'Tebakan harus berupa angka antara 1 dan 10!';
        status = 'warning';
    } else if (guess === correctAnswer) {
        message = 'Selamat, tebakan Anda benar!';
        status = 'success';
    } else {
        message = `Sayang sekali, tebakan Anda salah. Angka yang benar adalah ${correctAnswer}.`;
        status = 'danger';
    }

    // Mengirimkan hasil ke halaman hasil
    res.render('result', { message, status });
});

// Menjalankan server
app.listen(PORT, HOST, () => {
    console.log(`Server running at http://${HOST}:${PORT}`);
});
