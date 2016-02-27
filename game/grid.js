function Grid(m, n) {
	var rows = n || 50;
	var cols = m || 50;
	
	
	this.tiles = [];
	this.tilew = 16;
	this.offset = [0, 0];
	
	for (var i = 0; i < rows; ++i) {
		var topush = [];
		for (var j = 0; j < cols; ++j) {
			topush.push(new Tile(j, i, "grass"));
		}
		this.tiles.push(topush);
	}
	
	//test
	for (var i = 2; i < 5; ++i) {
		for (var j = 3; j < 8; ++j) {
			this.tiles[i][j].type = "water";
		}
	}
	this.zoom = function(out) {
		var intensity = Math.round(this.tilew / 8);
		var sqFromZero = [(divPos.x - this.offset[0]) / this.tilew, (divPos.y - this.offset[1]) / this.tilew];
		var t = out ? -1 : 1
		this.offset[0] -= Math.round(sqFromZero[0] * intensity * t);
		this.offset[1] -= Math.round(sqFromZero[1] * intensity * t);
		console.log("Zoom, squares: " + sqFromZero);
		if (out) 
			this.tilew -= intensity;
		else
			this.tilew += Math.max(1, intensity);
	}
	this.draw = function() {
		for (var i = 0; i < this.tiles.length; ++i) {
			var row = this.tiles[i];
			for (var j = 0; j < row.length; ++j) {
				row[j].draw(this.offset[0] + this.tilew * j, this.offset[1] + this.tilew * i, this.tilew);
			}
		}
		ctx.strokeStyle = "rgba(0, 0, 0, 0.1)";
		ctx.lineWidth = this.tilew / 3;
		ctx.beginPath();
		for (var i = this.offset[0]; i < canvas.width; i += this.tilew) {
			
			ctx.moveTo(i, 0);
			ctx.lineTo(i, canvas.height);
			
		}
		for (var i = this.offset[1]; i < canvas.height; i += this.tilew) {
			ctx.moveTo(0, i);
			ctx.lineTo(canvas.width, i);
		}
		ctx.stroke();
	}
	
	this.changeOffset = function(x, y) {
		this.offset[0] += x;
		this.offset[1] += y;
	}
	this.getNeighbours = function(x, y) {
		return[this.tiles[y][x + 1], this.tiles[y + 1][x], this.tiles[y][x - 1], this.tiles[y - 1][x]];
	}
}

function Tile(x, y, type) {
	this.x = x;
	this.y = y;
	this.boolRand = Math.round(Math.random());
	this.type = type;
	
	this.draw = function(x, y, w) {
		var coords;
		switch(this.type) {
			case "grass":
				ctx.fillStyle = "green";
				break;
			case "water":
				ctx.fillStyle = "blue";
				break;
		}
		
		ctx.fillRect(x, y, w, w);
	}
	
}