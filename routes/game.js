// routes/game.js

const express = require('express');
const path = require('path');
const router = express.Router();

// Target angka untuk ditebak (1-10)
let targetNumber = Math.floor(Math.random() * 10) + 1;

// [Route] untuk tampilan home
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

// [Route] tampilan game
router.get('/game', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/game.html'));
});

// [Route] menangani tebakan
router.post('/game', (req, res) => {
    const guess = parseInt(req.body.guess, 10);
    let message;
    let status;

    if (guess === targetNumber) {
        message = `🎉 Selamat! Anda menebak angka ${targetNumber} dengan benar!`;
        status = 'success';
        targetNumber = Math.floor(Math.random() * 10) + 1; // Reset angka untuk permainan baru
    } else if (guess > targetNumber) {
        message = `❌ Tebakan Anda terlalu besar. Coba lagi!`;
        status = 'danger';
    } else {
        message = `❌ Tebakan Anda terlalu kecil. Coba lagi!`;
        status = 'warning';
    }

    res.render('result', { message, status });
});

module.exports = router;
