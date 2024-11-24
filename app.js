'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const PORT = 5600;
const path = require('path');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (CSS, JS, Sounds, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Game state variables
let targetNumber = Math.floor(Math.random() * 10) + 1;
let attempts = 0;
let guesses = [];
let timer;  // Variable to handle countdown timer
let timeLeft = 30;  // Countdown from 30 seconds

// Welcome Page
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Game Tebak Angka</title>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background: linear-gradient(45deg, #141e30, #243b55);
                color: #fff;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                margin: 0;
                text-align: center;
            }
            h1 {
                font-size: 3rem;
                margin-bottom: 1rem;
                text-transform: uppercase;
                letter-spacing: 2px;
                background: linear-gradient(to right, #ff7e5f, #feb47b);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            p {
                font-size: 1.5rem;
                margin: 20px 0;
                animation: bounce 2s infinite;
            }
            a {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 30px;
                font-size: 1.2rem;
                color: #fff;
                background: #00c6ff;
                border: none;
                border-radius: 30px;
                text-decoration: none;
                transition: background 0.3s ease-in-out, transform 0.3s ease;
            }
            a:hover {
                background: #0072ff;
                transform: scale(1.1);
            }
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
            }
        </style>
    </head>
    <body>
        <h1>Game Tebak Angka</h1>
        <p>Bisakah kamu menebak angka yang saya pikirkan?</p>
        <a href="/game">Mulai Game</a>
    </body>
    </html>
    `);
});

// Game Page
app.get('/game', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Game Tebak Angka</title>
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background: linear-gradient(45deg, #373b44, #4286f4);
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                min-height: 100vh;
                margin: 0;
            }
            form {
                background: rgba(255, 255, 255, 0.1);
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }
            input {
                padding: 10px;
                margin: 10px 0;
                border: none;
                border-radius: 5px;
                font-size: 1.2rem;
                width: calc(100% - 20px);
            }
            button {
                padding: 10px 20px;
                background: #00c6ff;
                border: none;
                color: #fff;
                border-radius: 50px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            button:hover {
                background: #0072ff;
            }
            #timer {
                font-size: 2rem;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <form action="/game" method="post">
            <h1>Tebak Angka Saya</h1>
            <input type="number" name="guess" placeholder="Tulis angka (1-10)" required>
            <button type="submit">Tebak</button>
            <div id="timer">Waktu: 30 detik</div>
        </form>

        <script>
            let timeLeft = 30;
            const timerElement = document.getElementById("timer");

            // Countdown timer function
            const countdown = setInterval(function() {
                if (timeLeft > 0) {
                    timeLeft--;
                    timerElement.textContent = "Waktu: " + timeLeft + " detik";
                } else {
                    clearInterval(countdown);
                    alert("Waktu habis! Coba lagi.");
                    window.location.href = '/game'; // Reset the game if time runs out
                }
            }, 1000);
        </script>
    </body>
    </html>
    `);
});

// Handle Tebakan
app.post('/game', (req, res) => {
    const guess = parseInt(req.body.guess, 10);
    let message;
    let animation;
    let bgColor;

    // Track number of attempts
    attempts++;
    guesses.push(guess);

    // Check if attempts exceed 5
    if (attempts > 5) {
        message = `Game over! Anda sudah mencoba 5 kali. Angka yang saya pikirkan adalah ${targetNumber}.`;
        animation = "shake";
        bgColor = "#ff5733";
        targetNumber = Math.floor(Math.random() * 10) + 1; // Reset angka
        attempts = 0; // Reset attempts
        guesses = []; // Reset guesses
    } else if (guess === targetNumber) {
        message = `🎉 Kamu benar! Angka yang saya pikirkan adalah ${targetNumber}!`;
        animation = "success";
        bgColor = "#00ff00";
        targetNumber = Math.floor(Math.random() * 10) + 1; // Reset angka
        attempts = 0; // Reset attempts
        guesses = []; // Reset guesses
    } else if (guess > targetNumber) {
        message = `😅 Terlalu besar! Coba lagi!`;
        animation = "shake";
        bgColor = "#ff5733";
    } else {
        message = `😅 Terlalu kecil! Coba lagi!`;
        animation = "shake";
        bgColor = "#f39c12";
    }

    // Display history of guesses
    const guessesList = guesses.map(g => `<li>${g}</li>`).join('');

    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Hasil Tebakan</title>
        <style>
            body {
                font-family: 'Roboto', sans-serif;
                background: ${bgColor};
                color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                text-align: center;
                animation: ${animation} 1s;
            }
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-10px); }
                50% { transform: translateX(10px); }
                75% { transform: translateX(-10px); }
            }
            @keyframes success {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            button {
                padding: 10px 20px;
                background: #00c6ff;
                border: none;
                color: #fff;
                border-radius: 50px;
                font-size: 1.2rem;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            button:hover {
                background: #0072ff;
            }
            ul {
                list-style-type: none;
                padding: 0;
            }
        </style>
    </head>
    <body>
        <div>
            <h1>${message}</h1>
            <p>Riwayat Tebakan:</p>
            <ul>${guessesList}</ul>
            <a href="/game"><button>Kembali ke Game</button></a>
        </div>
    </body>
    </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
