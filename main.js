const gameFiled = document.getElementById('game-filed');
const scoreInfo = document.getElementById('score');
const restart = document.getElementById('restart-game');
const hightScoreNode = document.getElementById('hight-score')

const context = gameFiled.getContext('2d');

let hightScore;

document.addEventListener("DOMContentLoaded", () => {
    hightScore = localStorage.getItem("hightScore");
    if (hightScore) { 
        hightScore = JSON.parse(hightScore);
        hightScoreNode.textContent = `Лучший результат: ${hightScore}`;
    } else {
        hightScore = 0;
    }
});

const filedColor = 'black';
const snakeColor = 'green';
const targetColor = 'red';

const filedWidth = gameFiled.width;
const filedHeight = gameFiled.height;
//размер одной клетки на поле
const cellSize = 30;

//создаем нач координаты змейки(3клетк)
const initialSnake = [
  {x: cellSize * 2, y: 0},
  {x: cellSize, y: 0},
  {x: 0, y: 0},
];

let snake = JSON.parse(JSON.stringify(initialSnake));
let snakeHead = {
  x: snake[0].x,
  y: snake[0].y,
};

const target = {
  x: 0,
  y: 0,
};

const speed = {
  x: cellSize,
  y: 0,
};

let score = 0;

let interval;

function drawFiled() {
  context.fillStyle = filedColor;
  context.fillRect(0, 0, filedWidth, filedHeight)
};

function drawSnake() {
  for(let index = 0; index < snake.length; index++) {
    const snakePart = snake[index];
    if(index !== 0 && snakePart.x === snakeHead.x && snakePart.y === snakeHead.y) {
      return finishGame();
    }
    context.fillStyle = snakeColor;
    context.fillRect(snakePart.x, snakePart.y, cellSize, cellSize);
  }
}

function drawTarget() {
  context.fillStyle = targetColor;
  context.fillRect(target.x, target.y, cellSize, cellSize)
}

function getRandomCoords() {
  return Math.floor(Math.random() * (filedWidth / cellSize)) * cellSize;
}

function getTargetCoords() {
  target.x = getRandomCoords();
  target.y = getRandomCoords();
}

function updateScore(newScore) {
  score = newScore;
  scoreInfo.textContent = `Очки: ${score}`;
}

function chekEatTarget() {
  if(snakeHead.x === target.x && snakeHead.y === target.y) {
    getTargetCoords();
    updateScore(score + 1);
    return true;
  } else if (score > hightScore) {
        hightScore = score;
        hightScoreNode.textContent = `Лучший результат: ${hightScore}`;
        localStorage.setItem("hightScore",JSON.stringify(hightScore));
  }
  return false;
}

function moveSnake() {
  snakeHead.x += speed.x;
  snakeHead.y += speed.y;
  
  if(snakeHead.x < 0) {
    snakeHead.x = filedWidth - cellSize;
  } else if(snakeHead.x > filedWidth - cellSize) {
    snakeHead.x = 0;
  } else if(snakeHead.y < 0) {
    snakeHead.y = filedHeight - cellSize;
  } else if(snakeHead.y > filedHeight - cellSize) {
    snakeHead.y = 0;
  }
  snake.unshift( {
    x: snakeHead.x,
    y: snakeHead.y,
  });
  if(!chekEatTarget()) {
    snake.pop();
  }
}

function changeDirection(event) {
  const right = speed.x > 0;
  const left = speed.x < 0;
  const up = speed.y < 0;
  const down = speed.y > 0;
  
  if(event.key === "ArrowRight" && !left) {
    speed.x = cellSize;
    speed.y = 0;
  } else if(event.key === "ArrowLeft" && !right) {
    speed.x = -cellSize;
    speed.y = 0;
  } else if(event.key === "ArrowUp" && !down) {
    speed.x = 0;
    speed.y = -cellSize;
  } else if(event.key === "ArrowDown" && !up) {
    speed.x = 0;
    speed.y = cellSize;
  }
}

function startGame() {
  drawFiled();
  drawTarget();
  drawSnake();
  moveSnake();
}

function finishGame() {
  context.clearRect(0, 0, filedWidth, filedHeight);
  clearInterval(interval);
  context.fillStyle = 'green';
  context.font = '25px cursive';
  context.fillText('Игра окончена!', 200, 200);
}

function gameFeel() {
  snake = JSON.parse(JSON.stringify(initialSnake));
  snakeHead = {
    x: snake[0].x,
    y: snake[0].y,
  }
  speed.x = cellSize;
  speed.y = 0;
  updateScore(0);
  getTargetCoords();
  restart.addEventListener('click', restartGame);
  window.addEventListener('keydown', changeDirection);
  interval = setInterval(startGame, 300);
}

function restartGame() {
  finishGame();
  gameFeel();
}

window.addEventListener('load', gameFeel);