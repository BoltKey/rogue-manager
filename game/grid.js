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
	this.generateMap = function() {
		for (var i = 0; i < 80; ++i) {
			this.addBlob(["rock", "water"][Math.round(Math.random() + 0.3)], 
				10 + Math.floor(Math.random() * (rows - 20)), 
				10 + Math.floor(Math.random() * (cols - 20)), 
				60 + Math.floor(Math.random() * 150));
		}
		for (var i = 0; i < 30; ++i) {
			this.addEnemy();
		}
	}
	this.addEnemy = function() {
		var x = Math.floor(Math.random() * this.tiles[0].length);
		var y = Math.floor(Math.random() * this.tiles.length);
		var d = Math.diag(x - castle.x, y - castle.y)
		var hp = Math.pow(d, 2) * 5;
		var atk = Math.floor(Math.pow(d, 2) / 5);
		var as = 40;
		enemies.push(new Creep(x, y, hp, atk, as, 30));
	}
	this.addBlob = function(type, x, y, size) {
		if (Math.abs(x - castle.x) < 4 && Math.abs(y - castle.y) < 4) {
			x = castle.x + 5;
		}
		var nowFilled = [];
		this.tiles[y][x].type = type;
		nowFilled.push(this.tiles[y][x]);
		var i = 0;
		while (i < size) {
			var currTile = nowFilled[Math.floor(Math.random() * nowFilled.length)];
			var start = Math.floor(Math.random() * 4);
			var now = (start + 1) % 4;
			var nextTile;
			// 0 right, 1 up, 2 left, 3 down
			do {
				
				nextTile = this.tiles[currTile.y + now % 2 * (now % 2 + 1 - now)][currTile.x + (now + 1) % 2 * ((now + 1) % 2 - now)];
				now = (now + 1) % 4;
			} while (nowFilled.indexOf(nextTile) > -1 && start !== now)
			if (nowFilled.indexOf(nextTile) === -1 && (Math.abs(nextTile.x - castle.x) > 4 || Math.abs(nextTile.y - castle.y) > 4)) {
				nextTile.type = type;
				nowFilled.push(nextTile);
				
			}
			++i;
		}
	}
	this.zoom = function(out) {
		// zoom centering based on mouse pos
		var intensity = Math.round(this.tilew / 15);
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
		ctx.fillStyle = "black";
		ctx.fillRect(this.offset[0], this.offset[1], this.tiles[0].length * this.tilew, this.tiles.length * this.tilew);
		var c = ["rock", "water", "grass"];
		var d = ["#666666", "#0099CC", "green"];
		for (var h in c) {
			ctx.beginPath();
			var color = c[h];
			for (var i = 0; i < this.tiles.length; ++i) {
				var row = this.tiles[i];
				for (var j = 0; j < row.length; ++j) {
					var tile = row[j];
					if (tile.type === color && tile.discovered) {
						ctx.rect(this.offset[0] + this.tilew * j, this.offset[1] + this.tilew * i, this.tilew, this.tilew);
					}
					//row[j].draw(this.offset[0] + this.tilew * j, this.offset[1] + this.tilew * i, this.tilew);
				}
			}
			ctx.fillStyle = d[h];
			ctx.fill();
		}
		// grid
		/*if (this.tilew > 14) {
			var a = Math.min(0.2, this.tilew / 100);
			ctx.strokeStyle = "rgba(0, 0, 0, " + a + ")";
			ctx.lineWidth = Math.round(this.tilew / 8);
			ctx.beginPath();
			
			for (var i = Math.max(this.offset[0], this.offset[0] % this.tilew); i < canvas.width; i += this.tilew) {
				//ctx.beginPath();
				ctx.moveTo(i, 0);
				ctx.lineTo(i, canvas.height);
				//ctx.stroke();
				
			}
			for (var i = Math.max(this.offset[1], this.offset[1] % this.tilew); i < canvas.height; i += this.tilew) {
				//ctx.beginPath();
				ctx.moveTo(0, i);
				ctx.lineTo(canvas.width, i);
				//ctx.stroke();
			}
			ctx.stroke();
			ctx.closePath();
		}*/
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
	this.discovered = false;
	
	this.draw = function(x, y, w) {
		var coords;
		if (this.discovered) {
			switch(this.type) {
				case "grass":
					ctx.fillStyle = "green";
					break;
				case "water":
					ctx.fillStyle = "blue";
					break;
				case "rock":
					ctx.fillStyle = "#666666";
					break;
			}
			ctx.fillRect(x, y, w, w);
		}
	}
}