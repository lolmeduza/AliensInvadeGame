class Enemy {
  constructor(game) {
    this.game = game;
    this.spriteHeight = 100;
    this.spriteWidth = 100;
    this.sizeModifier = Math.random() * 0.3 + 0.8;
    this.height = this.spriteHeight * this.sizeModifier;
    this.width = this.spriteWidth * this.sizeModifier;
    this.x;
    this.y;
    this.speedX;
    this.speedY;
    this.frameX;
    this.lastFrame;
    this.frameY;
    this.minFrame;
    this.maxFrame;
    this.lives;
    this.free = true;
  }
  start() {
    this.x = Math.random() * this.game.width;
    this.y = -this.height;
    this.frameX = 0;
    this.frameY = Math.floor(Math.random() * 4);
    this.free = false;
  }
  reset() {
    this.free = true;
  }
  isAlive() {
    return this.lives >= 1;
  }
  hit() {
    //collision
    if (
      this.game.checkCollision(this, this.game.mouse) &&
      this.game.mouse.pressed &&
      !this.game.mouse.fired
    ) {
      this.lives--;
      this.game.mouse.fired = true;
    }
  }
  update() {
    if (!this.free) {
      //float in
      if (this.y < 0) this.y += 5;

      //always visible
      if (this.x > this.game.width - this.width) {
        this.x = this.game.width - this.width;
      }
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.y > this.game.height) {
        this.reset();
        if (!this.game.gameOver) this.game.lives--;
      }
      if (!this.isAlive()) {
        if (this.game.spriteUpdate) {
          this.frameX++;
          if (this.frameX > this.lastFrame) {
            this.reset();
            if (!this.game.gameOver) this.game.score++;
          }
        }
      }
    }
  }

  draw() {
    if (!this.free) {
      this.game.ctx.drawImage(
        this.image,
        this.frameX * this.spriteWidth,
        this.frameY * this.spriteHeight,
        this.spriteWidth,
        this.spriteHeight,
        this.x,
        this.y,
        this.width,
        this.height
      );
      if (this.game.debug) {
        this.game.ctx.strokeRect(this.x, this.y, this.width, this.height);
        this.game.ctx.fillText(
          this.lives,
          this.x + this.width * 0.5,
          this.y + this.height * 0.5
        );
      }
    }
  }
}

class Beetlemorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("beetlemorph");
  }
  start() {
    super.start();
    this.speedX = 0;
    this.speedY = Math.random() * 2 + 0.2;
    this.lives = 1;
    this.lastFrame = 3;
  }
  update() {
    super.update();
    if (!this.free) {
      if (this.isAlive()) {
        this.hit();
      }
    }
  }
}

class Lobstermorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("lobstermorph");
    this.lastFrame = 14;
  }
  start() {
    super.start();
    this.speedX = 0;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.lives = 3;
    this.lastFrame = 3;
  }
  update() {
    super.update();
    if (!this.free) {
      if (this.lives >= 3) {
        this.maxFrame = 0;
      } else if (this.lives == 2) {
        this.maxFrame = 3;
      } else if (this.lives === 1) {
        this.maxFrame = 7;
      }
      if (this.isAlive()) {
        this.hit();
        if (this.frameX < this.maxFrame && this.game.spriteUpdate) {
          this.frameX++;
        }
      }
    }
  }
}

class Phantommorph extends Enemy {
  constructor(game) {
    super(game);
    this.image = document.getElementById("phantommorph");
    this.lastFrame = 14;
  }
  start() {
    super.start();
    this.speedX = Math.random() * 2 - 1;
    this.speedY = Math.random() * 0.5 + 0.2;
    this.lives = 1;
    this.minFrame = 0;
    this.maxFrame = 2;
  }
  update() {
    super.update();
    if (!this.free) {
      if (this.isAlive()) {
        this.hit();
      }
    }
  }
}

// }
// start() {
//   super.start();
//   this.speedX = Math.random() * 2 - 1;
//   this.speedY = Math.random() * 0.5 + 0.2;
//   this.lives = 1;
//   this.minFrame = 0;
//   this.maxFrame = 2;
// }
// handleFrames() {
//   if (this.game.spriteUpdate) {
//     if (this.frameX < this.maxFrame) {
//       this.frameX++;
//     } else {
//       this.frameX = this.minFrame;
//     }
//   }
// }
// update() {
//   super.update();
//   if (!this.free) {
//     this.handleFrames();
//     if (this.x <= 0 || this.x >= this.game.width - this.width) {
//       this.speedX *= -1;
//     }
//     if (this.isAlive()) {
//       this.hit();
//     }
//   }
// }
// }
