function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	grid.draw();
	
	for (var i in rogues) {
		rogues[i].draw();
	}
}