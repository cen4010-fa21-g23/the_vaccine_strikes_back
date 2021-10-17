var cnv;

//player related variables
var player;
var playerSize;
var playerHeight;
var playerWidth;
var playerAccelFactor;
var isPlayerDragged;

//bullet variables
var bullets;
var bulletQty;
var bulletIndex;
var bulletQtyBar;
var bulletRefill;

//enemy variables
var enemies;
var enemyQty;

//gameplay variables
var firstRun;
var isGameOver;
var score;
var highScore;

//scale variables
var spriteScaleFactor;
var textScaleFactor;

//mouse/touch offset
var offsetX;
var offsetY;

//version
var buildType = "DEMO"
var buildVer = "";

//true if player is using a mobile device
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

//Don't allow page to be moved or zoomed in on mobile
function preventBehavior(e) {
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, {passive: false});

p5.disableFriendlyErrors = true; // disable FES for performance

//This function runs once the first time the game is launched
function setup() {
	//scale sprites depending on whether game is running on mobile or pc
	if(isMobile){
		spriteScaleFactor = 2.5;
		textScaleFactor = 4;
		movLimScaleFactor = 2;
	}
	else{
		spriteScaleFactor = 1;
		textScaleFactor = 1;
		movLimScaleFactor = 1;
	}

	if(isMobile){
		//Disable pixel scaling (reduces quality) to improve performance on mobile
		pixelDensity(1);
	}

	frameRate(60);

	playerSize = 50*spriteScaleFactor;
	playerHeight = playerSize*1.5;
	playerWidth = playerSize/1.5;
	playerAccelFactor = 8;
	isPlayerDragged = false;

	score = 0;
	highScore = 0;
	isGameOver = true;

	if(isMobile){
		cnv = createCanvas(windowWidth, windowHeight);
	}
	else{
		cnv = createCanvas(500, windowHeight);
	}

	cnv.style('display', 'block');
	centerCanvas();
	player = createSprite(width/2, height-(height/8), playerWidth, playerHeight);
	player.shapeColor = color('white');

	enemies = [];
	enemyQty = 7;

	for (i = 0; i < enemyQty; i++) {
		var enemy = createSprite(width/2, 0, 20*spriteScaleFactor, 20*spriteScaleFactor);
		enemy.shapeColor = color('red');
		enemies.push(enemy);
	}

	bullets = [];
	bulletQty = 50;
	bulletIndex = 0;

	for (i = 0; i < bulletQty; i++) {
		var bullet = createSprite(width/2, height, 10*spriteScaleFactor, 10*spriteScaleFactor);
		bullet.shapeColor = color('cyan');
		bullet.visible = false;
		bullets.push(bullet);
	}

	bulletRefill = createSprite(width/2, 0, 20*spriteScaleFactor, 20*spriteScaleFactor);
	bulletRefill.shapeColor = color('cyan');
	bulletRefill.visible = false;

	bulletQtyBar = createSprite(width/2, height, width, 25*spriteScaleFactor);
	bulletQtyBar.shapeColor = color('cyan');
}


//This function runs every frame
function draw() {
	//console.log(score);

	if(firstRun){
		for (i = 0; i < enemyQty; i++) {
			enemies[i].position.y = 0;
			enemies[i].position.x = random(5, width-5);
		}
		firstRun = false;
	}

	if (isGameOver) {
        showStartScreen();
    } 
    else {
		for (i = 0; i < enemyQty; i++) {
			if(enemies[i].overlap(player)){
				isGameOver = true;
				showStartScreen();
			}
		}
		for(i = 0; i < bulletQty; i++){
			for(j = 0; j < enemyQty; j++){
				if(bullets[i].overlap(enemies[j])){
					enemies[j].position.y = 0;
					enemies[j].position.x = random(5, width-5);
					
					bullets[i].setVelocity(0,0);
					bullets[i].position.x = width/2; 
					bullets[i].position.y = height;
					bullets[i].visible = false;

					score++;
				}
			}
		}
		if(bulletRefill.overlap(player)){
			refillBullets();
			bulletRefill.visible = false;
		}

		background(0, 0, 51);
		fill("white");
		textSize(32*textScaleFactor);
		textAlign(CENTER, CENTER);
		text(score, width / 2, height/15);
		textSize(16*textScaleFactor);
		//text("Bullets: " + (bulletQty - bulletIndex), width / 4, height/15);

		//control player by dragging with mouse
		if (isPlayerDragged) {
			//print("Current pos:" + player.position.x + ", " + player.position.y);
			var newX = mouseX + offsetX;
			if(newX > width - playerSize/2){
				newX = width - playerSize/2;
			}
			if(newX < playerSize/2){
				newX = playerSize/2;
			}

			var newY = mouseY + offsetY;
			if(newY > height - playerSize/2){
				newY = height - playerSize/2;
			}
			if(newY < playerSize/2){
				newY = playerSize/2;
			}


			player.position.x = newX;
			player.position.y = newY;
			
		}

		//control player with arrows or WSAD
		if ((keyDown(RIGHT_ARROW) || keyDown(68)) && player.position.x < (width - playerSize/2)) {
			player.position.x = player.position.x + playerAccelFactor;
		}
		if ((keyDown(LEFT_ARROW) || keyDown(65)) && player.position.x > playerSize/2) {
			player.position.x = player.position.x - playerAccelFactor;
		}
		if ((keyDown(DOWN_ARROW) || keyDown(83)) && player.position.y < (height - playerSize/2)) {
			player.position.y = player.position.y + playerAccelFactor;
		}
		if ((keyDown(UP_ARROW) || keyDown(87)) && player.position.y > playerSize/2) {
			player.position.y = player.position.y - playerAccelFactor;
		}

		//speed of enemies falling down, made to increase slowly alongside the player's score
		posFactor = (5 + Math.round(Math.sqrt(score)/4))*spriteScaleFactor;

		//for each enemy, move the enemy in the y position by the current posFactor, then increase posFactor
		//by 1 so the next enemy moves faster. This way, all enemies have different speeds.
		for (i = 0; i < enemyQty; i++) {
			enemies[i].position.y = enemies[i].position.y + posFactor;
			posFactor++;
		}

		//for each enemy, when they reach the bottom of the screen, increase player's score by 1, and then
		//move the enemy to the top of the screen, at a random x position
		for (i = 0; i < enemyQty; i++) {
			if (enemies[i].position.y > height) {
				enemies[i].position.y = 0;
				enemies[i].position.x = random(5, width-5);
			}
		}

		//for each bullet, when they reach the top of the screen, stop moving it, and move it to the bottom
		//behind bulletQtyBar
		for (i = 0; i < bulletQty; i++) {
			if (bullets[i].position.y < 0) {
				bullets[i].setVelocity(0,0);
				bullets[i].position.x = width/2; 
				bullets[i].position.y = height;
				bullets[i].visible = false;
			}
		}

		//Every frame, refill has a very small chance of spawning
		if(Math.random() < 0.01){
			if(!bulletRefill.visible){
				bulletRefill.visible = true;
				bulletRefill.position.y = 0;
				bulletRefill.position.x = random(5, width-5);
			}
		}
		if(bulletRefill.visible){
			bulletRefill.position.y = bulletRefill.position.y + posFactor;
			if(bulletRefill.position.y > height){
				bulletRefill.visible = false;
				bulletRefill.position.x = width/2; 
				bulletRefill.position.y = height;
			}
		}
		else{
			bulletRefill.position.x = width/2; 
			bulletRefill.position.y = height;
		}


		//draws all the sprites on the screen
		drawSprites();
	}
}

function showStartScreen() {
	if(score > highScore){
		highScore = score;
	}
	background(0);
	textAlign(CENTER);
	fill("white");
	textSize(32*textScaleFactor);
	if(isMobile){
		text("The Vaccine", width / 2, height / 3.5);
		text("Strikes Back", width / 2, height / 2.8);
	}
	else{
		text("The Vaccine Strikes Back", width / 2, height / 4);
	}
	textSize(16*textScaleFactor);
	text("PLAY", width / 2, height / 2);
	if(isMobile){
		text("Tap anywhere to start!", width / 2, height / 1.5);
	}
	else{
		text("Click or press any button to start!", width / 2, height / 1.5);
	}
	//text("PixelDensity is " + pixelDensity(), width / 2, height / 1.3);
	//text("isMobile is " + isMobile, width / 2, height / 1.1);
	if(highScore != 0){
		text("Your highest score is: " + highScore, width / 2, height / 1.7);
	}
	textAlign(RIGHT);
	textSize(16*textScaleFactor/1.5);
	text(buildType + " " + buildVer, width-16, height-16);
}

function restartGame(){
	if (isGameOver){
		if(score > highScore){
			highScore = score;
		}
		score = 0;
		firstRun = true;
		isGameOver = false;
		player.position.x = width/2;
		player.position.y = height-(height/8);
		bulletIndex = 0;
		bulletQtyBar.width = width;

		for (i = 0; i < enemyQty; i++) {
			enemies[i].position.x = width/2;
			enemies[i].position.y = 0;
		}

		for (i = 0; i < bulletQty; i++) {
			bullets[i].setVelocity(0,0);
			bullets[i].position.x = width/2; 
			bullets[i].position.y = height;
			bullets[i].visible = false;
		}
	}
}

/*	This function is called when the space key is pressed, or when the player is double tapped
	it moves a bullet to the player's position, and gives it a velocity vector going
	upward at a velocity of 10, and sets the width of the bulletQtyBar to the width of the screen times
	the current bullets available divided by the total amount of bullets, which will be a percentage,
	allowing the bar to show the percentage of bullets available.
*/
function shoot(){
	if(bulletIndex < bullets.length){
		bullets[bulletIndex].visible = true;
		bullets[bulletIndex].position.x = player.position.x;
		bullets[bulletIndex].position.y = player.position.y;
		bullets[bulletIndex].setVelocity(0,-10*spriteScaleFactor);
		bulletIndex++;

		/*	bulletIndex starts at 0, increases by 1 with every shot,
			so bulletIndex - bullets.length gives the current amount of bullets available
			((bulletQty - bulletIndex)/bulletQty = <current qty of bullets>/<total bullet qty>, a percentage
			multiplying the canvas width by that percentage gives the correct width for the bar
		*/
		bulletQtyBar.width = width * ((bulletQty - bulletIndex)/bulletQty);
	}
}

//run shoot function every 0.15 of a second
setInterval(shoot, 150);

function refillBullets(){
	bulletIndex = 0;
	bulletQtyBar.width = width;
}

//runs when the mouse is clicked **and released** or the screen is tapped **and released**
function mouseClicked() {
	if(isGameOver){
		restartGame();
	}
}

//runs when any key is pressed
function keyPressed() {
	if (isGameOver){
		restartGame();
	}
}

//runs when the mouse is clicked or screen is tapped
function mousePressed() {
	if(!isGameOver){
		if (mouseX > player.position.x - (playerWidth)/2 && mouseX < player.position.x + (playerWidth)/2 && mouseY > player.position.y - (playerHeight)/2 && mouseY < player.position.y + (playerHeight)/2) {
			//print("clicked on player");
			isPlayerDragged = true;
			offsetX = player.position.x - mouseX;
			offsetY = player.position.y - mouseY;
		  }
	}
}

function mouseReleased() {
	//print("mouse was released");
  	isPlayerDragged = false;
}

function centerCanvas() {
	var x = (windowWidth - width) / 2;
	var y = (windowHeight - height) / 2;
	cnv.position(x, y);
}

function windowResized() {
	if(isMobile){
		resizeCanvas(windowWidth, windowHeight);
		centerCanvas();
	}
	else{
		resizeCanvas(500, windowHeight);
		centerCanvas();
	}
}