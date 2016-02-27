var rogues = [];
var grid;
var castle;

var mouseDown;
var lastmd;
var divPos;
var lastDivPos;

var assets = {map: new Image()};
assets.map.src = 'graphics/assetsmap.png';

function main() {
	console.log("Main");
	grid = new Grid();
	rogues.push(new Rogue(100, 10, 45, 20, 5, 4, 20));
	castle = new Castle(20, 30);
	
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
        if(e.originalEvent.wheelDelta /120 > 0) {
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
	
	mainloop();
}

function mainloop() {
	requestAnimationFrame(mainloop);
	for (var i in rogues) {
		rogues[i].fra();
	}
	
	
	lastmd = mouseDown;
	lastDivPos = divPos;
	draw();
}