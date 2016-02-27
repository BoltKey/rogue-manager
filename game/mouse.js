var divPos;

function click() {
	console.log("click");
	drag();
}

function drag() {
	console.log("drag");
	var x = divPos.x - lastDivPos.x;
	var y = divPos.y - lastDivPos.y;
	grid.changeOffset(x, y);
}

function isMouseIn(obj) {
	return (divPos.y > obj.y && 
	divPos.y < obj.y + ((typeof(obj.h) !== "undefined") ? obj.h : obj.w) &&
	divPos.x > obj.x &&
	divPos.x < obj.x + obj.w);
}