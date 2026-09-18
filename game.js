const PROJECT_REFERENCE = "Rafa@@321---";
const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const statusElement = document.getElementById("status");
const startButton = document.getElementById("start-button");
const referenceElement = document.getElementById("project-reference");

const cellSize = 20;
const gridSize = canvas.width / cellSize;
const initialSpeed = 140;

let snake;
let direction;
let food;
let score;
let highScore = 0;
let loopId = null;
let speed = initialSpeed;

referenceElement.textContent = PROJECT_REFERENCE;

function randomCell() {
  return Math.floor(Math.random() * gridSize);
}

function placeFood() {
  do {
    food = { x: randomCell(), y: randomCell() };
  } while (snake.some((segment) => segment.x === food.x && segment.y === food.y));
}

function resetGame() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  score = 0;
  speed = initialSpeed;
  scoreElement.textContent = score;
  statusElement.textContent = "Partida en curso.";
  placeFood();
  draw();
}

function drawCell(x, y, color) {
  context.fillStyle = color;
  context.fillRect(x * cellSize, y * cellSize, cellSize - 2, cellSize - 2);
}

function draw() {
  context.fillStyle = "#0b1713";
  context.fillRect(0, 0, canvas.width, canvas.height);

  drawCell(food.x, food.y, "#ff7a59");
  snake.forEach((segment, index) => {
    drawCell(segment.x, segment.y, index === 0 ? "#c9ff8b" : "#8fd14f");
  });
}

function endGame() {
  clearInterval(loopId);
  loopId = null;
  statusElement.textContent = `Fin de la partida. Puntuación final: ${score}.`;
}

function step() {
  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };
  const willEat = head.x === food.x && head.y === food.y;
  const bodyToCheck = willEat ? snake : snake.slice(0, -1);

  const hitWall =
    head.x < 0 || head.y < 0 || head.x >= gridSize || head.y >= gridSize;
  const hitSelf = bodyToCheck.some(
    (segment) => segment.x === head.x && segment.y === head.y,
  );

  if (hitWall || hitSelf) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (willEat) {
    score += 1;
    highScore = Math.max(highScore, score);
    scoreElement.textContent = score;
    highScoreElement.textContent = highScore;
    placeFood();

    if (speed > 60) {
      speed -= 10;
      clearInterval(loopId);
      loopId = setInterval(step, speed);
    }
  } else {
    snake.pop();
  }

  draw();
}

function setDirection(nextX, nextY) {
  if (direction.x === -nextX && direction.y === -nextY) {
    return;
  }

  direction = { x: nextX, y: nextY };
}

document.addEventListener("keydown", (event) => {
  const actions = {
    ArrowUp: () => setDirection(0, -1),
    ArrowDown: () => setDirection(0, 1),
    ArrowLeft: () => setDirection(-1, 0),
    ArrowRight: () => setDirection(1, 0),
    w: () => setDirection(0, -1),
    s: () => setDirection(0, 1),
    a: () => setDirection(-1, 0),
    d: () => setDirection(1, 0),
  };

  const action = actions[event.key];
  if (action) {
    event.preventDefault();
    action();
  }
});

startButton.addEventListener("click", () => {
  resetGame();

  if (loopId) {
    clearInterval(loopId);
  }

  loopId = setInterval(step, speed);
});

resetGame();
