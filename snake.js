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
    this.ctx.fillStyle = "blue";
    let list = [];
    this.snakeLocationArray.forEach((e) => {
      if (this.map[e.x][e.y] > 0) {
        this.ctx.fillRect(e.x * gridSize, e.y * gridSize, gridSize, gridSize);
        list.push(e);
      }
    });
    this.snakeLocationArray = list;
  }
  updateState() {
    let dx = 0,
      dy = 0;
    if (this.keys.w.pressed && this.lastKey == "w") {
      console.log("W");
      dx = 0;
      dy = -1;
    } else if (this.keys.a.pressed && this.lastKey == "a") {
      console.log("A");
      dx = -1;
      dy = 0;
    } else if (this.keys.s.pressed && this.lastKey == "s") {
      console.log("S");
      dx = 0;
      dy = 1;
    } else if (this.keys.d.pressed && this.lastKey == "d") {
      console.log("D");
      dx = 1;
      dy = 0;
    }

    if (dx !== 0 || dy !== 0) {
      const headx = game.snakeHeadLocation.x;
      const heady = game.snakeHeadLocation.y;
      const nextx = headx + dx;
      const nexty = heady + dy;

      if (nextx >= 0 && nextx < MapSize && nexty >= 0 && nexty < MapSize) {
        if (game.map[nextx][nexty] == -1) {
          game.map[nextx][nexty] = 1;
          game.snakeHeadLocation = { x: nextx, y: nexty };
          game.snakeLocationArray.unshift({ x: nextx, y: nexty });
          game.noFood = true;
        } else if (game.map[nextx][nexty] == 0) {
          game.map[nextx][nexty] = 1;
          game.snakeHeadLocation = { x: nextx, y: nexty };
          game.snakeLocationArray.unshift({ x: nextx, y: nexty });
          const tail = game.snakeLocationArray.pop();
          game.map[tail.x][tail.y] = 0;
        } else {
          console.log("collison Game Over");
          console.log(this.map);
        }
      } else {
        console.log("Out of bounds Game Over !");
      }
    }
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
      const headx = game.snakeHeadLocation.x;
      const heady = game.snakeHeadLocation.y;
      const nextx = headx + dx;
      const nexty = heady + dy;

      if (nextx >= 0 && nextx < MapSize && nexty >= 0 && nexty < MapSize) {
        if (game.map[nextx][nexty] == -1) {
          game.map[nextx][nexty] = 1;
          game.snakeHeadLocation = { x: nextx, y: nexty };
          game.snakeLocationArray.unshift({ x: nextx, y: nexty });
          game.noFood = true;
        } else if (game.map[nextx][nexty] == 0) {
          game.map[nextx][nexty] = 1;
          game.snakeHeadLocation = { x: nextx, y: nexty };
          game.snakeLocationArray.unshift({ x: nextx, y: nexty });
          const tail = game.snakeLocationArray.pop();
          game.map[tail.x][tail.y] = 0;
        } else {
          console.log("collison Game Over");
          console.log(this.map);
        }
      } else {
        console.log("Out of bounds Game Over !");
      }
    }
  }
}
const game = new Game(ctx);
game.generateSnake();
function animate() {
  game.clearMap();
  game.moveSnake();
  game.drawGrid();
  game.drawFood();
  game.drawSnake();
  if (game.noFood) {
    game.generateFood();
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
