var ship;
var asteroids = [];
var lasers = [];

var level = 1;
var points = 0;
var lives = 3;
var gameoverScreen = false;

function setup() {
	createCanvas(windowWidth, windowHeight);
	ship = new Ship();
	for (var i = 0; i < 3; i++) {
		asteroids.push(new Asteroid());
	}
}

function draw() {
	background(0);

	for (var i = 0; i < asteroids.length; i++) {
		if (ship.hits(asteroids[i])) {
			lives = lives - 1;

			ship.pos.x = width / 2;
			ship.pos.y = height / 2;

			if (lives == 0) {
				gameoverScreen = true;
			}
		}

		asteroids[i].render();
		asteroids[i].update();
		asteroids[i].edges();
	}

	for (var i = lasers.length - 1; i >= 0; i--) {
		if (!gameoverScreen) {
			lasers[i].render();
			lasers[i].update();
		}
		
		if (lasers[i].offscreen()) {
			lasers.splice(i, 1);
		} else {
			for (var j = asteroids.length - 1; j >= 0; j--) {
				if (lasers[i].hits(asteroids[j])) {
					if (asteroids[j].r > 10) {
						var newAsteroids = asteroids[j].breakup();
						asteroids = asteroids.concat(newAsteroids);
					}
					asteroids.splice(j, 1);
					lasers.splice(i, 1);
					points = points + 20;
					break;
				}
			}
		}
	}
	
	if (gameoverScreen) {
		textSize(46);
		text("Game Over", width / 2, height / 2);
		textAlign(CENTER);
		fill(255);

		textSize(22);
		text("Your Score: " + points, width / 2, (height / 2) + 40);
		textAlign(CENTER);
		fill(255);
	} else {
		ship.render();
		ship.turn();
		ship.update();
		ship.edges();

		textSize(32);
		text("Score: " + points, 20, 50);
		fill(255);

		textSize(22);
		text("Level: " + level, 20, 90);
		fill(255);

		textSize(22);
		text("Lives: " + lives, 20, 130);
		fill(255);
	}

	if (asteroids.length == 0) {
		level = level + 1;

		for (var i = 0; i < (3 * level); i++) {
			asteroids.push(new Asteroid());
		}
	}
	
}

function keyReleased() {
	if (key != ' ') {
		ship.setRoation(0);
		ship.boosting(false);
	}
}	

function keyPressed() {
	if (key == ' ') {
		lasers.push(new Laser(ship.pos, ship.heading));
	} else if (keyCode == RIGHT_ARROW || key == 'd') {
		ship.setRoation(0.1);
	} else if (keyCode == LEFT_ARROW || key == 'a') {
		ship.setRoation(-0.1);
	} else if (keyCode == UP_ARROW || key == 'w') {
		ship.boosting(true);
	}
}