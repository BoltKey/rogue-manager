var rogues = [];
rogues.kill = function(who) {
	var i = this.indexOf(who);
	this.splice(i, 1);
}
var enemies = [];
enemies.kill = rogues.kill;
var grid;
var castle;
var money = 0;
var mouseDown;
var lastmd;
var divPos;
var lastDivPos;

var assets = {map: new Image()};
assets.map.src = 'graphics/assetsmap.png';

function main() {
	console.log("Main");
	grid = new Grid(100, 100);
	castle = new Castle(50, 50);
	grid.generateMap();
	
	//mouse
	var offset = $("#game").offset();
	$(document).bind('mousemove', function(e){
        divPos = {
            x: e.pageX - offset.left,
            y: e.pageY - offset.top
        }
        if(mouseDown) { drag() }
	})
	$(document).bind('mousewheel', function(e){
        if(e.originalEvent.wheelDelta / 120 > 0) {
            // scrolling up
			grid.zoom(false);
        }
        else{
            // down
			grid.zoom(true);
        }
    });
	lastDivPos = {x: 0, y: 0};
	lastmd = 0;
	mouseDown = false;
	document.body.onmousedown = function() { 
		mouseDown = true;
		click();
	}
	document.body.onmouseup = function() { 
		mouseDown = false;
	}
	
	startGame();
	trans(100000);
	
	enemies.push(new Creep(50, 1, 60, 1000));
	
	mainloop();
}

function startGame() {
	makeMenu();
}

function trans(amt) {
	makeMenu();
	money += amt;
	$("#money").html(money);
	
}

function makeMenu() {
	$("#menu").html("<div id='top'><button id='hirebut' onclick='castle.recruit(0)'>Hire</button><div id='money'>" + money + "</div></div>");
	var a;
	for (var i in rogues) {
		var r = rogues[i];
		if (r.inCastle) {
			var s = "<br><div>Rogue" + 
			"<button class='sendBut' onclick='castle.sendOut(" + i + ")'>Send out</button><br>";
			var ups = ["maxHp", "atk", "as", "dodge", "sight", "movesp", "def", "grass", "rock", "water"]
			for (var j in ups) {
				s += "<button class='upg' onclick='rogues[" + i +"].up(\"" + ups[j] + "\", 5)'>Up " + ups[j] + "</button><div class='statDisp'>" + r[ups[j]] + "</div><br>"
			}

			var a = $(s);
			$("#menu").append(a);
		}
	}
}

function mainloop() {
	requestAnimationFrame(mainloop);
	for (var i = 0; i < rogues.length; ++i) {
		rogues[i].fra();
	}
	for (var i = 0; i < enemies.length; ++i) {
		enemies[i].fra();
	}
	
	lastmd = mouseDown;
	lastDivPos = divPos;
	draw();
}

Math.diag = function(a, b) {
	return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
}	