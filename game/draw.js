function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	grid.draw();
	
	for (var i = 0; i < rogues.length; ++i) {
		rogues[i].draw();
	}
	for (var i = 0; i < enemies.length; ++i) {
		enemies[i].draw();
	}
}

function getColorScale(scale) {
	t = Math.floor(scale * 255);
	green = (t >= 128 ? 255 : t * 2);
	red = (t < 128 ? 255 : 2 * (255 - t));
	if (red < 0) red = 0;
	if (red > 255) red = 255;
	return "rgb(" + red + "," + green + ",0)";
}
