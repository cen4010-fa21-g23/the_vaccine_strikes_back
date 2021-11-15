//** 	Login Code	 *//

window.onload = loadLoginPage();

var database = firebase.database();

//username variable
var uname;

var hasSignedIn = false;
var authChecked = false;

var visiblePage;

function validateTextBox() {
	var val1 = document.getElementById("typeEmail").value;
	var val2 = document.getElementById("typeUsername").value;
	var val3 = document.getElementById("typePassword").value;
	var val4 = document.getElementById("typePasswordAgain").value;
	
	if(!val1.replace(/\s/g, '').length || !val2.replace(/\s/g, '').length || !val3.replace(/\s/g, '').length|| !val4.replace(/\s/g, '').length){
	alert('One of the inputs is invalid.');
		return false;
	}
	if(!validateEmail(val1)){
		alert("Email must be a valid email address.");
		return false;
	}
	if(val3.length < 8){
		alert("Password must contain 8 characters or more.");
		return false;
	}
	if(val3 != val4){
		alert("Passwords do not match");
		return false;
	}
	return true;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//unused for now
function loadLoadingPage(){
	visiblePage = "loading";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	//document.getElementById("loadingDiv").style.display = "block";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";
}

function loadCreateAcctPage(){
	visiblePage = "createAcct";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "block";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	//document.getElementById("loadingDiv").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";
}

function loadLoginPage(){
	visiblePage = "login";
	document.getElementById("login").style.display = "block";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	//document.getElementById("loadingDiv").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";
}

function loadGamePage(){
	visiblePage = "game";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "block";
	document.getElementById("mainMenu").style.display = "none";
	//document.getElementById("loadingDiv").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";
	restartGame();
}

function loadMainMenu(){
	visiblePage = "mainMenu";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "block";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";

	var user = firebase.auth().currentUser;
	if(user){
		getHighScore();
		
		if(score > highScore){
			highScore = score;
			writeUserHighScore(highScore);
		}

		getUsername();
	}
}

function loadLeaderboard(){
	visiblePage = "leaderboard";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	document.getElementById("leaderboard").style.display = "block";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "none";
}

function loadSettingsPage(){
	visiblePage = "settings";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "block";
	document.getElementById("changeUsername").style.display = "none";

	document.getElementById("changeUserDisplay").innerHTML = "Current username: " + uname;
}

function loadChangeUsernamePage(){
	visiblePage = "changeUsername";
	document.getElementById("login").style.display = "none";
	document.getElementById("createAcct").style.display = "none";
	document.getElementById("gameDiv").style.display = "none";
	document.getElementById("mainMenu").style.display = "none";
	document.getElementById("leaderboard").style.display = "none";
	document.getElementById("settings").style.display = "none";
	document.getElementById("changeUsername").style.display = "block";
}

function createAccount(){
	if(validateTextBox()){
		var email = document.getElementById("typeEmail").value;
		var password = document.getElementById("typePassword").value;
		var username = document.getElementById("typeUsername").value;

		firebase.auth().createUserWithEmailAndPassword(email, password)
		.then((userCredential) => {
		// Signed in 
		var user = userCredential.user;

		uname = username;
		var highScore = 0;
		writeUserHighScore(0);
		writeUsername(username);
		})
		.catch((error) => {
		var errorCode = error.code;
		var errorMessage = error.message;
		alert(error.message);
		// ..
		});
	}
}

function login(){
     var email = document.getElementById("email").value;
     var password = document.getElementById("password").value;
     firebase.auth().signInWithEmailAndPassword(email, password)
     .then((userCredential) => {
          // Signed in
          var user = userCredential.user;
          // ...
     })
     .catch((error) => {
          var errorCode = error.code;
          var errorMessage = error.message;
		  alert(error.message);
     });
}

function logout(){
     firebase.auth().signOut().then(function() {
       // Sign-out successful.
     }).catch(function(error) {
       // An error happened.
     });
	 loadLoginPage();
}

firebase.auth().onAuthStateChanged(function(user) {
     authChecked = true;
     if (user) {
          // User is signed in.
          var displayName = user.displayName;
          var email = user.email;
          var emailVerified = user.emailVerified;
          var photoURL = user.photoURL;
          var isAnonymous = user.isAnonymous;
          var uid = user.uid;
          var providerData = user.providerData;
          //alert('Hello ' + email + ', you are successfully signed in!');
          hasSignedIn = true;
          loadMainMenu();
          // ...
     } else {
          if(hasSignedIn == true && !alert('Signed out successfully!')){window.location.reload();}
          // User is signed out.
          // ...
		  loadLoginPage();
     }
});


function writeUserHighScore(newHighScore) {
	if(hasSignedIn && newHighScore){
		var user = firebase.auth().currentUser;
		if(!uname){
			getUsername();
		}
		highScore = newHighScore;
		var userId = firebase.auth().currentUser.uid;
		firebase.database().ref('users/'+userId).set({
			username: uname,
			highScore: highScore
		});
	}
}

function writeUsername(newUsername) {
	if(hasSignedIn && newUsername){
		var user = firebase.auth().currentUser;
		if(!highScore){
			getHighScore();
		}
		uname = newUsername;
		var userId = firebase.auth().currentUser.uid;
		firebase.database().ref('users/'+userId).set({
			username: uname,
			highScore: highScore
		});
	}
}

function updateUsername(){
	writeUsername(document.getElementById("typeUsernameChange").value);
	location.reload();
}

function getUsername(){
	if(hasSignedIn){
		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('users/'+userId ).once('value').then((snapshot) => {
			uname = (snapshot.val() && snapshot.val().username);
			document.getElementById("usernameDisplay").innerHTML = "Hello " + uname + "!";
		});
	}
}

function getHighScore(){
	if(hasSignedIn){
		var userId = firebase.auth().currentUser.uid;
		return firebase.database().ref('users/'+userId ).once('value').then((snapshot) => {
			highScore = (snapshot.val() && snapshot.val().highScore);
			document.getElementById("highScore").innerHTML = "Highscore: " + highScore;
		});
	}
}

let leaderboardBody = document.getElementById("leaderboardBody");
leaderboardBody.innerHTML = "";
let db = firebase.database().ref();
let usersRef = db.child("users");

usersRef.once("value").then(function(snapshot) {
	snapshot.forEach(function(userSnapshot) {
		trbase = document.createElement("tr");
		trbase.classList.add('table-dark');

		trbaseUsername = document.createElement("th");
		trbaseUsername.setAttribute('scope', 'row');
		trbaseUsername.innerHTML = userSnapshot.child("username").val();

		trbasehighScore = document.createElement("td");
		trbasehighScore.innerHTML = userSnapshot.child("highScore").val();

		trbase.appendChild(trbaseUsername);
		trbase.appendChild(trbasehighScore);

		leaderboardBody.appendChild(trbase);

		sortTable();
	});
});

function sortTable() {
	var table, rows, switching, i, x, y, shouldSwitch;
	table = document.getElementById("leaderboardTable");
	switching = true;
	/*Make a loop that will continue until
	no switching has been done:*/
	while (switching) {
	  //start by saying: no switching is done:
	  switching = false;
	  rows = table.rows;
	  /*Loop through all table rows (except the
	  first, which contains table headers):*/
	  for (i = 1; i < (rows.length - 1); i++) {
		//start by saying there should be no switching:
		shouldSwitch = false;
		/*Get the two elements you want to compare,
		one from current row and one from the next:*/
		x = rows[i].getElementsByTagName("TD")[0];
		y = rows[i + 1].getElementsByTagName("TD")[0];
		//check if the two rows should switch place:
		if (Number(x.innerHTML) < Number(y.innerHTML)) {
		  //if so, mark as a switch and break the loop:
		  shouldSwitch = true;
		  break;
		}
	  }
	  if (shouldSwitch) {
		/*If a switch has been marked, make the switch
		and mark that a switch has been done:*/
		rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
		switching = true;
	  }
	}
  }


//** 	Game Code	 *//

//canvas
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
	//This function runs before the game starts, therefore set a flag that is set to true when this function runs
	freshPage = true;

	//scale sprites depending on whether game is running on mobile or pc
	if(isMobile){
		spriteScaleFactor = 1;
		textScaleFactor = 1;
		movLimScaleFactor = 1;
	}
	else{
		spriteScaleFactor = 1;
		textScaleFactor = 1;
		movLimScaleFactor = 1;
	}

	if(isMobile){
		//Disable pixel scaling (reduces quality) to improve performance on mobile
		//pixelDensity(1);
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

	cnv.parent("gameDiv");
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
	if(uname){
		document.getElementById("playBtn").disabled = false;
		document.getElementById("settingsBtn").disabled = false;
	}
	//console.log(getHighScore());

	//console.log(score);

	if(firstRun){
		for (i = 0; i < enemyQty; i++) {
			enemies[i].position.y = 0;
			enemies[i].position.x = random(5, width-5);
		}
		firstRun = false;
	}

	if (isGameOver && visiblePage == "mainMenu") {
		loadMainMenu();
    }
	else if(isGameOver && visiblePage == "leaderboard"){
		loadLeaderboard();
	}
	else if (isGameOver && visiblePage == "settings") {
		loadSettingsPage();
    }
	else if (isGameOver && visiblePage == "changeUsername") {
		loadChangeUsernamePage();
    }
	else if (isGameOver && visiblePage == "createAcct") {
		loadCreateAcctPage();
    }
	else if(isGameOver && visiblePage == "login"){
		loadLoginPage();
	}
    else {
		for (i = 0; i < enemyQty; i++) {
			if(enemies[i].overlap(player)){
				isGameOver = true;
				loadMainMenu();
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
	//read user high score from firebase
	var user = firebase.auth().currentUser;
	if(user){
		getHighScore();
		
		if(score > highScore){
			highScore = score;
			writeUserHighScore(highScore);
		}

		getUsername();
	}

	background(0);
	textAlign(CENTER);
	fill("white");
	textSize(16*textScaleFactor);

	if(user && uname){
		text("Hello " + uname + "!", width / 2, height / 8);
	}
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
	if(user && highScore != 0 && highScore != null){
		text("Your highest score is: " + highScore, width / 2, height / 1.7);
	}

	textAlign(RIGHT);
	textSize(16*textScaleFactor/1.5);
	text(buildType + " " + buildVer, width-16, height-16);
}

function restartGame(){
	if (isGameOver){
		if(score > highScore){
			writeUserHighScore(score);
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
	//if(isGameOver){
	//	restartGame();
	//}
}

//runs when any key is pressed
function keyPressed() {
	//if (isGameOver){
	//	restartGame();
	//}
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