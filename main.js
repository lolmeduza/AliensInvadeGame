class Game {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = this.canvas.width;
    this.height = this.canvas.height;

    this.enemyPool = [];
    this.numberOfEnemies = 50;
    this.createEnemyPool();
    this.enemyTimer = 0;
    this.enemyInterval = 1000;

    this.score = 0;
    this.lives;
    this.winningScore = 20;
    this.message1 = "Run!";
    this.message2 = "Or get eaten!";
    this.message3 = 'Press "Enter" or "R" to start!';
    this.crewImage = document.getElementById("crewSprite");
    this.crewMembers = [];
    this.gameOver = true;
    this.debug = false;
    this.spriteTimer = 0;
    this.spriteInterval = 120;
    this.spriteUpdate = false;

    this.mouse = {
      x: undefined,
      y: undefined,
      width: 1,
      height: 1,
      pressed: false,
      fired: false,
    };

    this.resize(window.innerWidth, window.innerHeight);
    this.resetButton = document.getElementById("resetButton");
    this.resetButton.addEventListener("click", (e) => {
      this.start();
    });
    this.fullScreenButton = document.getElementById("fullScreenButton");
    this.fullScreenButton.addEventListener("click", (e) => {
      this.toggleFullScreen();
    });

    window.addEventListener("resize", (e) => {
      this.resize(e.target.innerWidth, e.target.innerHeight);
    });
    window.addEventListener("mousedown", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });
    window.addEventListener("mouseup", (e) => {
      this.mouse.x = e.x;
      this.mouse.y = e.y;
      this.mouse.pressed = false;
    });
    window.addEventListener("touchstart", (e) => {
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = true;
      this.mouse.fired = false;
    });
    window.addEventListener("touchend", (e) => {
      this.mouse.x = e.changedTouches[0].pageX;
      this.mouse.y = e.changedTouches[0].pageY;
      this.mouse.pressed = false;
    });
    window.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "r") {
        this.start();
      } else if (e.key === "" || e.key.toLowerCase() === "f") {
        this.toggleFullScreen();
      } else if (e.key.toLowerCase() === "d") {
        this.debug = !this.debug;
      }
    });
  }

  start() {
    this.resize(window.innerWidth, window.innerHeight);
    this.score = 0;
    this.lives = 15;
    this.generateCrew();
    this.gameOver = false;
    this.enemyPool.forEach((enemy) => {
      enemy.reset();
    });
    for (let i = 0; i < 2; i++) {
      const enemy = this.getEnemy();
      if (enemy) enemy.start();
    }
  }
  generateCrew() {
    this.crewMembers = [];
    for (let i = 0; i < this.lives; i++) {
      this.crewMembers.push({
        frameX: Math.floor(Math.random() * 5),
        frameY: Math.floor(Math.random() * 5),
      });
    }
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.width = width;
    this.height = height;
    this.ctx.fillStyle = "white";
    this.ctx.strokeStyle = "white";
    this.ctx.font = "30px Bangers";
    this.ctx.textAlign = "center";
    this.ctx.textBaseline = "middle";
  }

  toggleFullScreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.y + rect1.height > rect2.y
    );
  }

  createEnemyPool() {
    for (let i = 0; i < this.numberOfEnemies; i++) {
      const randomNumber = Math.random();
      if (randomNumber < 0.8) {
        this.enemyPool.push(new Lobstermorph(this));
      }
      if (randomNumber < 0.5) {
        this.enemyPool.push(new Beetlemorph(this));
        this.enemyPool.push(new Phantommorph(this));
      } else {
      }
    }
  }

  getEnemy() {
    for (let i = 0; i < this.enemyPool.length; i++) {
      if (this.enemyPool[i].free) return this.enemyPool[i];
    }
  }

  handleEnemies(deltaTime) {
    if (this.enemyTimer < this.enemyInterval) {
      this.enemyTimer += deltaTime;
    } else {
      this.enemyTimer = 0;
      const enemy = this.getEnemy();
      if (enemy) {
        enemy.start();
      }
    }
  }

  triggerGameOver() {
    if (!this.gameOver) {
      this.gameOver = true;
      if (this.lives < 1) {
        this.message1 = "Aargh!";
        this.message2 = "The crew was eaten!";
      } else if (this.score >= this.winningScore) {
        this.message1 = "Well done!";
        this.message2 = "You escaped the swarm!";
      }
    }
  }
  handleSpriteTimer(deltaTime) {
    if (this.spriteTimer < this.spriteInterval) {
      this.spriteTimer += deltaTime;
      this.spriteUpdate = false;
    } else {
      this.spriteTimer = 0;
      this.spriteUpdate = true;
    }
  }

  drawStatusText() {
    this.ctx.save();
    this.ctx.textAlign = "left";
    this.ctx.fillText("Score: " + this.score, 20, 40);
    for (let i = 0; i < this.lives; i++) {
      const w = 20;
      const h = 45;
      this.ctx.drawImage(
        this.crewImage,
        w * this.crewMembers[i].frameX,
        h * this.crewMembers[i].frameY,
        w,
        h,
        20 + 16 * i,
        60,
        w,
        h
      );
    }
    if (this.lives < 1 || this.score >= this.winningScore) {
      this.triggerGameOver();
    }
    if (this.gameOver) {
      this.ctx.textAlign = "center";
      this.ctx.font = "80px Bangers";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - 25
      );
      this.ctx.font = "20px Bangers";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 + 25
      );
      this.ctx.fillText(
        this.message3,
        this.width * 0.5,
        this.height * 0.5 + 50
      );
    }
    this.ctx.restore();
  }
  render(deltaTime) {
    this.handleSpriteTimer(deltaTime);
    this.drawStatusText();
    if (!this.gameOver) this.handleEnemies(deltaTime);

    for (let i = this.enemyPool.length - 1; i >= 0; i--) {
      this.enemyPool[i].update(deltaTime);
    }
    this.enemyPool.forEach((enemy) => {
      enemy.draw();
    });
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const game = new Game(canvas, ctx);

  let lastTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
