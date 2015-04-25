window.onload = init;

var gCanvas;
var g2d;
var width= 854;
var height = 480;

var title="Text Adventure";
var gameState = 3;

var charName = "";
var inventory = [];

function init(){
  gCanvas = document.getElementById("gameCanvas");
  gCanvas.width = width;
  gCanvas.height = height;

  g2d = gCanvas.getContext("2d");
  g2d.imageSmoothingEnabled = false;
  g2d.webkitImageSmothEnabled = false;
  g2d.mozImageSmoothingEnabled = false;

  console.log("Game canvas initialized");
  draw();

}

function draw(){
	var options={};
	var text="";
	var searchables={};
	gCanvas.onclick = function(){draw()};


	if (gameState == 0){

		g2d.font = "60px Courier New BOLD";
		g2d.fillStyle = "#FFFFFF";
		puts(title, 140);

		text = "1. Play Game\n2. Exit Game";
		options = {play: 2, exit: 1};
		room(options, text);
	}

	if (gameState == 1){
		g2d.font = "30px Courier New";
		g2d.fillStyle = "#FFFFFF"
		puts("Thanks for playing.", 140);
		puts("Type reset to try again", 400);

	
		var thumbs = new Image;
		thumbs.src = "thumbs.png";
		//required to work on chrome
		thumbs.onload = function() {
    		g2d.drawImage(thumbs, (width/2)-(thumbs.width /2), 200);
		}
		options = {reset: 0}

	}

	if (gameState == 2){
		text = "Please enter your character name";
		options = {"Type Your Name": ""};
		room(options, text);
	}

	if (gameState == 3){
		text = "You wake up in a dark room.\-nYou have no recollection of how you came to be here.\-nYou see an ominous looking door ahead of you";
		options = {"Enter the Door": 4};
		room(options, text);
	}

	if (gameState == 4){
		if (inventory.indexOf("torch") != -1){
			text= "You find yourself in a large cavernous cave.\-nYou flick on your flashlight.\-nThere is a path to the North and the West";
			options = {North: 5, West: 6};
		}else{
			text = "You find yourself in a large cavernous cave. \-nIt is too dark to see anything";
			options = {"You can't see": 4};
		}
		searchables = {torch: "You can now see in the dark", compass: "You can now tell your direction"};
		room(options, text, searchables);
	}




	console.log("Gamestate " +gameState+" drawn successfully");
}

function room(options, text, searchables) {
	g2d.font = "24px Courier New";
	g2d.fillStyle = "#CCCCCC";
	if (/-n/.test(text)){
		var arr = text.split("\-n");
		for (var i = 0; i < arr.length; i++){
			puts(arr[i], 100 + (i * 30));
		}
	} else{
		puts(text, 230);
	}
	var arr = Object.keys(options);
	arr = arr.join(" or ");

	if (gameState > 2) puts("You can 'search' the room, check your 'inventory',", 330);
	puts("You can go " + arr, 400);



	input = new CanvasInput({
			canvas: gCanvas,
			x: 3,
			y: 450,
			width: 830,
			backgroundColor: "#000000",
			borderWidth: 0,
			boxShadow: "0px 0px 0px rgba(255, 255, 255, 1)",
			selectionColor: "#FFFFFF",
			fontColor: "#FFFFFF",
			fontSize: 18,
			fontFamily: "Courier New",
			placeHolder: "Enter choice here..",
			onsubmit: function(){
				var choice = input._value;
				if (choice.toLowerCase() == "reset") {
					enterState(0);
				}

				if (gameState == 2){
					if (confirm("Are you sure you want the name "+choice+"?")){
						charName = choice;
						console.log("name set to "+charName);
						enterState(3);
					} 
				}

				if (choice.toLowerCase() == "search"){
					searchRoom(searchables);
				}

				if (choice.toLowerCase() =="inventory"){
					checkInventory();
				}
				if (choice == "return"){
					enterState(gameState);
				}

				crawler(choice, options);

				
			}
		});

		input.focus();
}

function crawler(choice, options){
	for (var key in options){
		if (key.toLowerCase() == choice.toLowerCase()){
			enterState(options[key])
		}
	} 
}

function enterState(state){
	gameState = state;
	clearCanvas(g2d, gCanvas);
	draw();
}

function searchRoom(searchables){
	clearCanvas(g2d, gCanvas);
	g2d.font = "24px Courier New";
	g2d.fillStyle = "#CCCCCC";
	if (searchables){
		var i = 0;
		for (var key in searchables){
			puts("you found a " +key+"!", 100 + (i * 30));
			puts(searchables[key], 150+ (i * 30))
			if (inventory.indexOf(key) != -1){
				puts("You already own this treasure!", 180+ (i * 30));
			} else{
				puts("You place the treasure in your bag", 180+ (i * 30));
				inventory.push(key)
			}
			i+=5;
		}

	}else{
		puts("You scour the room, but turn up nothing", 250);
	}

	puts("type 'return' to return to the room", 400);
	

}

function checkInventory(){
	clearCanvas(g2d, gCanvas);
	g2d.font = "24px Courier New";
	g2d.fillStyle = "#CCCCCC";
	console.log(inventory);
	if (inventory == false) puts("You have no items in your inventory", 200);
	
	for (var i = 0; i<inventory.length;i++){
		puts(inventory[i], 200 + (i * 30));
	}
	puts("type 'return' to return to the room", 400);
}

function puts(text, height){
	g2d.fillText(text, (width/2) - (g2d.measureText(text).width/2), height);

}

function clearCanvas(context, canvas){
	context.clearRect(0, 0, canvas.width, canvas.height);
	var w = canvas.width;
	canvas.width = 1;
	canvas.width = w;
}

/*if (g2d.measureText(text).width > 800){
		console.log("line2");
		var line1= text.slice(0, text.length/2);
		g2d.fillText(line1, (width/2)-(g2d.measureText(line1).width/2), 230);

		var line2= text.slice(text.length/2, text.length);
		if (g2d.measureText(line2)>800){
			console.log("line3");
			var line3 = line2.slice(line2.length/2, line2.length);
			var line2 = line2.slice(0, line2.length/2);
			g2d.fillText(line2, (width/2)-(g2d.measureText(line2).width/2), 250);
			g2d.fillText(line3, (width/2)-(g2d.measureText(line3).width/2), 270);

		}else{
			g2d.fillText(line2, (width/2)-(g2d.measureText(line2).width/2), 250);

		}*/


//	g2d.font = "24px Courier New";
//		g2d.fillStyle = "#CCCCCC";
		
//g2d.fillText("1. Play Game", (width/2) - (g2d.measureText("1. Play Game").width/2), 300);
//		g2d.fillText("2. Exit Game", (width/2) - (g2d.measureText("2. Exit Game").width/2), 330);
