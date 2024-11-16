const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const MapSize = 20;
let gridSize = canvas.height / MapSize;

function resizeCanvas() {
  if (window.innerHeight > window.innerWidth) {
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerWidth * 0.8;
  } else {
    canvas.width = window.innerHeight * 0.8;
    canvas.height = window.innerHeight * 0.8;
  }
  gridSize = canvas.height / MapSize;
}
resizeCanvas();

class Game {
  constructor(ctx) {
    this.map = Array(20)
      .fill(0)
      .map(() => Array(20).fill(0));
    this.ctx = ctx;
    this.noFood = true;
    this.foodLocation = null;
    this.snakeHeadLocation = null;
    this.snakeLocationArray = [];
    this.keys = {
      w: { pressed: false },
      a: { pressed: false },
      s: { pressed: false },
      d: { pressed: false },
    };
    this.lastKey = "";
    this.speed = 500;
    this.score = 0;
    this.highScore = 0;
    this.playing = false;
    this.snakeGenerated = false;
  }
  randomEmptySpot() {
    let attempts = 100;
    while (attempts > 0) {
      let row = Math.floor(Math.random() * MapSize);
      let column = Math.floor(Math.random() * MapSize);
      if (this.map[row][column] === 0) {
        return { x: row, y: column };
      }
      attempts--;
    }
    for (let i = 0; i < MapSize; i++) {
      for (let j = 0; j < MapSize; j++) {
        if (this.map[i][j] === 0) {
          return { x: i, y: j };
        }
      }
    }

    console.warn("No empty spot found on the map!");
    return null;
  }
  drawFood() {
    if (!this.noFood) {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(
        this.foodLocation.x * gridSize + 2,
        this.foodLocation.y * gridSize + 2,
        gridSize - 4,
        gridSize - 4
      );
    }
  }
  generateFood() {
    if (this.noFood) {
      let spot = this.randomEmptySpot();
      if (spot) {
        this.map[spot.x][spot.y] = -1;
        console.log("Food generated at: ", spot);
        this.noFood = false;
        this.foodLocation = spot;
      }
    }
  }
  clearMap() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  drawGrid() {
    for (let i = 0; i < MapSize; i++) {
      for (let j = 0; j < MapSize; j++) {
        this.ctx.strokeRect(i * gridSize, j * gridSize, gridSize, gridSize);
      }
    }
  }
  generateSnake() {
    let spot = this.randomEmptySpot();
    if (spot) {
      this.map[spot.x][spot.y] = 1;
      console.log("Snake generated at: ", spot);
      this.snakeHeadLocation = spot;
      this.snakeLocationArray.push(this.snakeHeadLocation);
    }
  }
  drawSnake() {
    this.ctx.fillStyle = "#81b622";
    let list = [];
    this.snakeLocationArray.forEach((e) => {
      if (this.map[e.x][e.y] > 0) {
        this.ctx.fillRect(e.x * gridSize, e.y * gridSize, gridSize, gridSize);
        list.push(e);
      }
    });
    this.snakeLocationArray = list;
  }
  moveSnake() {
    let dx = 0,
      dy = 0;
    if (this.lastKey == "w") {
      console.log("W");
      dx = 0;
      dy = -1;
    } else if (this.lastKey == "a") {
      console.log("A");
      dx = -1;
      dy = 0;
    } else if (this.lastKey == "s") {
      console.log("S");
      dx = 0;
      dy = 1;
    } else if (this.lastKey == "d") {
      console.log("D");
      dx = 1;
      dy = 0;
    }

    if (dx !== 0 || dy !== 0) {
      const headx = this.snakeHeadLocation.x;
      const heady = this.snakeHeadLocation.y;
      const nextx = headx + dx;
      const nexty = heady + dy;

      if (nextx >= 0 && nextx < MapSize && nexty >= 0 && nexty < MapSize) {
        if (this.map[nextx][nexty] == -1) {
          this.map[nextx][nexty] = 1;
          this.snakeHeadLocation = { x: nextx, y: nexty };
          this.snakeLocationArray.unshift({ x: nextx, y: nexty });
          this.noFood = true;
          this.score++;
        } else if (this.map[nextx][nexty] == 0) {
          this.map[nextx][nexty] = 1;
          this.snakeHeadLocation = { x: nextx, y: nexty };
          this.snakeLocationArray.unshift({ x: nextx, y: nexty });
          const tail = this.snakeLocationArray.pop();
          this.map[tail.x][tail.y] = 0;
        } else {
          console.log("collison Game Over");
          this.highScore = this.score;
          this.playing = false;
        }
      } else {
        this.highScore = this.score;
        console.log("Out of bounds Game Over !");
        this.playing = false;
      }
    }
  }
  drawScores() {
    this.ctx.fillStyle = "#d0d0d0";
    this.ctx.font = `${0.5 * gridSize}px serif`;
    this.ctx.fillText(`Score : ${this.score}`, gridSize, gridSize);
    this.ctx.fillText(
      `High Score : ${this.highScore}`,
      16 * gridSize,
      gridSize,
      4 * gridSize
    );
  }
}
const game = new Game(ctx);
function animate() {
  if (game.playing) {
    game.clearMap();
    if (!game.snakeGenerated) {
      game.generateSnake();
      game.snakeGenerated = true;
    }
    game.moveSnake();
    game.drawFood();
    game.drawSnake();
    game.drawScores();

    if (game.noFood) {
      game.generateFood();
    }
  }
}

setInterval(animate, game.speed);

//EventListeners
window.addEventListener("resize", () => {
  resizeCanvas();
});
window.addEventListener("keydown", (e) => {
  if (e.key == "w") {
    game.keys.w.pressed = true;
    game.lastKey = "w";
  } else if (e.key == "s") {
    game.keys.s.pressed = true;
    game.lastKey = "s";
  } else if (e.key == "a") {
    game.keys.a.pressed = true;
    game.lastKey = "a";
  } else if (e.key == "d") {
    game.keys.d.pressed = true;
    game.lastKey = "d";
  }
});
window.addEventListener("keyup", (e) => {
  if (e.key == "w") {
    game.keys.w.pressed = false;
  } else if (e.key == "s") {
    game.keys.s.pressed = false;
  } else if (e.key == "a") {
    game.keys.a.pressed = false;
  } else if (e.key == "d") {
    game.keys.d.pressed = false;
  }
});
window.addEventListener("keydown", (e) => {
  if (e.key == " ") {
    game.playing = true;
  }
});

window.addEventListener(
  "touchmove",
  (e) => {
    e.preventDefault(); // Prevent scrolling on touchmove
  },
  { passive: false }
);

window.addEventListener("touchstart", () => {
  game.playing = true;
});

let touchstartX = 0;
let touchstartY = 0;
window.addEventListener("touchstart", (e) => {
  const touch = e.touches[0];
  touchstartX = touch.clientX;
  touchstartY = touch.clientY;
});
window.addEventListener("touchend", (e) => {
  const touch = e.changedTouches[0];
  const touchendX = touch.clientX;
  const touchendY = touch.clientY;

  const dx = touchendX - touchstartX;
  const dy = touchendY - touchstartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      game.lastKey = "d";
    } else {
      game.lastKey = "a";
    }
  } else {
    if (dy > 0) {
      game.lastKey = "s";
    } else {
      game.lastKey = "w";
    }
  }
});
