var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

// Загрузка изображений
bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeBottom.src = "img/pipeBottom.png";

var fly = new Audio();
var score_audio = new Audio();
var game_over_audio = new Audio();
var music = new Audio();

// Загрузка аудио файлов
fly.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";
game_over_audio.src = "audio/game_over.mp3";
music.src = "audio/music.mp3";

var gap = 90;

var isGameStarted = false; // Флаг для отслеживания начала игры

document.addEventListener("keydown", moveUp);

function moveUp() {
    if (!isGameStarted) {
        startGame();
    } else {
        yPos -= 38;
        fly.play();
    }
}

var pipe = [];

function startGame() {
    isGameStarted = true;
    music.loop = true; // Устанавливаем зацикливание музыки
    music.play(); // Начинаем воспроизведение музыки
    yPos = 150; // Сброс позиции птицы
    score = 0; // Сброс счета
    pipe = []; // Сброс труб
    pipe[0] = { x: cvs.width, y: 0 }; // Первая труба
    draw(); // Начать отрисовку
}

var score = 0;

var xPos = 10;
var yPos = 150;
var grav = 1.9;

function draw() {
    ctx.drawImage(bg, 0, 0);

    for (var i = 0; i < pipe.length; i++) {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);

        pipe[i].x--;

        if (pipe[i].x == 125) {
            pipe.push({
                x: cvs.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }

        // Отслеживание касания
        if (xPos + bird.width >= pipe[i].x
            && xPos <= pipe[i].x + pipeUp.width
            && (yPos <= pipe[i].y + pipeUp.height
                || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
            game_over_audio.play();
            showGameOver();
            return; // Прекращаем выполнение функции draw
        }

        if (pipe[i].x == 5) {
            score++;
            score_audio.play();
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += grav;

    // Вывод счетчика
    ctx.fillStyle = "#ffffff";
    ctx.font = "28px B612";
    ctx.fillText("Check: " + score, 3, cvs.height - 490);

    requestAnimationFrame(draw);
}

pipeBottom.onload = function() {
    showStartButton(); // Показать кнопку "Старт" при загрузке
};

function showStartButton() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "16px B612";
    ctx.fillText("Нажмите любую клавишу, чтобы начать", 5, cvs.height / 2);
}

function showGameOver() {
    music.pause(); // Останавливаем музыку
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fillRect(0, 0, cvs.width, cvs.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "25px B612";
    ctx.fillText("Игра окончена", 60, cvs.height / 2 - 40);
    ctx.font = "13px B612";
    ctx.fillText("Нажмите любую клавишу, чтобы начать сначала", 10, cvs.height / 2 + 10);

    document.addEventListener("keydown", restartGame);
}

function restartGame() {
    document.removeEventListener("keydown", restartGame); // Удаляем обработчик, чтобы не было повторных нажатий
    startGame(); // Перезапускаем игру
}