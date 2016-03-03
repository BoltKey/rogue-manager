Fighter = {
	lastMove: 0,
	lastAtk: 0,
	infight: false,
	fra: function() {
		++this.lastMove;
		++this.lastAtk;
		if (this.lastMove >= this.currStats.movesp) {
			this.move();
		}
		if (this.infight) {
			if (this.lastAtk >= this.as) {
				// TODO: dodge
				this.doAtk();
			}
		}
	},
	move: function() {},
	doAtk: function() {
		this.infight.hp -= Math.max(0, this.currStats.atk);
		this.lastAtk = 0;
		if (this.infight.hp <= 0) {
			this.infight.die();
			this.infight = false;
		}
	},
	drawHp: function() {
		var r = this.hp / this.maxHp;
		ctx.fillStyle = getColorScale(r);
		ctx.fillRect(this.x * grid.tilew + grid.offset[0] - grid.tilew / 5, this.y * grid.tilew - grid.tilew / 4 + grid.offset[1], grid.tilew * 1.4 * r, grid.tilew / 10);
	},
	drawRect: function() {
		var m = Math.max(0, -Math.abs(this.lastAtk) + 10) / 3;
		var mx = 0;
		var my = 0;
		if (this.infight) {
			mx = m * (this.infight.x - this.x);
			my = m * (this.infight.y - this.y);
		}
		ctx.fillRect(
			this.x * grid.tilew + grid.offset[0] + mx, 
			this.y * grid.tilew + grid.offset[1] + my, 
			grid.tilew, grid.tilew
		);
	}
}

function Rogue(hp, atk, as, def, dodge, sight, movesp, grass, rock, water) {
	var ret = Object.create(Fighter);
	ret.maxHp = hp;
	ret.hp = hp;
	ret.atk = atk;
	ret.as = as;
	ret.dodge = dodge;
	ret.sight = sight;
	ret.movesp = movesp;
	ret.def = def;
	ret.grass = grass;
	ret.rock = rock;
	ret.water = water;
	ret.currStats = {
		atk: atk * grass,
		movesp: Math.floor(movesp / grass),
	}
	ret.fra = function() {
		++ret.lastMove;
		++ret.lastAtk;
		if (ret.lastMove >= ret.currStats.movesp) {
			ret.move();
		}
		if (ret.infight) {
			if (ret.lastAtk >= ret.as) {
				// TODO: dodge
				ret.doAtk();
			}
		}
	},
	
	ret.inCastle = true;
	ret.x = castle.x;
	ret.y = castle.y;
	ret.nextx = castle.x;
	ret.nexty = castle.y;
	ret.path = [];
	
	var vert = Math.round(Math.random());
	ret.dest = {x: vert ? 0 : Math.floor(Math.random() * grid.tiles.length),
	y: vert ? Math.floor(Math.random() * grid.tiles[0].length) : 0};
	ret.calculatePath = function() {
		var iters = 0;
		var bestPaths = [];
		for (var i = 0; i < grid.tiles.length; ++i) {
			var toPush = [];
			for (var j = 0; j < grid.tiles[0].length; ++j) {
				var a = [];
				a.time = Infinity;
				toPush.push(a);
			}
			bestPaths.push(toPush);
		}
		var fifo = [grid.tiles[ret.y][ret.x]];
		bestPaths[ret.y][ret.x] = [[ret.y, ret.x]];
		bestPaths[ret.y][ret.x].time = 0;
		while(fifo.length > 0 && iters < 1000000) {  // just to prevent infi cycles
			var currTile = fifo.splice(0, 1)[0];
			for (var i = 0; i < 4; ++i) {
				// 0 right, 1 up, 2 left, 3 down
				var nextx = currTile.x + (i + 1) % 2 * ((i + 1) % 2 - i);
				var nexty = currTile.y + i % 2 * (i % 2 + 1 - i);
				if (nexty < 0 || nextx < 0 || nextx >= grid.tiles[0].length || nexty >= grid.tiles.length) {
					continue;
				}
				var nextTile = grid.tiles[nexty][nextx];
				var nextBest = bestPaths[nextTile.y][nextTile.x].time;
				var thisBest = bestPaths[currTile.y][currTile.x].time;
				var toNext = Math.floor(ret.movesp / ret[nextTile.type]);
				if (nextBest > thisBest + toNext) {
					bestPaths[nextTile.y][nextTile.x] = bestPaths[currTile.y][currTile.x].concat([[nextTile.y, nextTile.x]]);
					bestPaths[nextTile.y][nextTile.x].time = thisBest + toNext;
					fifo.push(nextTile);
				}
			}
			
			
			++iters;
			if (iters === 100000) {
				alert("100 000");
			}
		}
		ret.path = bestPaths[ret.dest.y][ret.dest.x];
		return bestPaths[ret.dest.y][ret.dest.x];
	}
	
	ret.pathTime = function(path) {
		if (typeof(path) === 'undefined' || path.length === 0) 
			return Infinity;
		var total = 0;
		for (var i in path) {
			var p = path[i];
			var tile = grid.tiles[p[0]][p[1]];
			total += Math.floor(ret.movesp / ret[tile.type]);
		}
		return total;
	}
	
	ret.move = function() {
		for (var i in enemies) {
			var e = enemies[i];
			if (Math.abs(e.x - ret.x) < 2 && Math.abs(e.y - ret.y) < 2) {
				ret.infight = e;
				e.infight = ret;
			}
		}
		if (!ret.inCastle && !ret.infight) {
			// move alg here
			/*ret.x = ret.nextx;
			ret.y = ret.nexty;
			var factor;
			var x = Math.abs(ret.dest.x - ret.x);
			var y = Math.abs(ret.dest.y - ret.y)
			if (x === 0 || y === 0) {
				if (x === 0 && y === 0) {
					//dest reached
					factor = 0;
				}
				else {
					factor = Math.sign(x);
				}
			}
			else {
				factor = (1 / (x + y)) * x;
			}
			// factor === 0 -> y, factor === 1 -> x
			if (Math.random() > factor) {
				ret.nexty += Math.sign(ret.dest.y - ret.y);
			}
			else {
				ret.nextx += Math.sign(ret.dest.x - ret.x);
			}
			ret.lastMove = 0;*/
			if (ret.path.length > 0) {
				ret.x = ret.path[0][1];
				ret.y = ret.path[0][0];
				ret.lastMove = 0;
			}
			ret.path.splice(0, 1);
			if (ret.path.length > 0) {
				ret.currStats = {
					atk: ret.atk * ret[grid.tiles[ret.path[0][0]][ret.path[0][1]].type],
					movesp: Math.floor(ret.movesp / ret[grid.tiles[ret.path[0][0]][ret.path[0][1]].type]),
				}
			}
			//++ret.x;
			
			
		}
		for (var i = -ret.sight; i < ret.sight + 1; ++i) {
			for (var j = -ret.sight; j < ret.sight + 1; ++j) {
				var x = ret.x + i;
				var y = ret.y + j;
				if (y > 0 && y < grid.tiles.length && x > 0 && x < grid.tiles[0].length)
					grid.tiles[y][x].discovered = true;
			}
		}
	}
	
	ret.stats = function(which, value) {
		ret[which] += value;
		ret.hp = ret.maxHp;
		makeMenu();
	}
	ret.up = function(which) {
		var t = ret.nextUp(which);
		if (money >= t[1]) {
			money -= t[1];
			ret[which] += t[0];
			ret.hp = ret.maxHp;
		}
		makeMenu();
	}
	ret.nextUp = function(which) {
		switch(which) {
			case "maxHp":
				return [Math.ceil(ret.maxHp / 10), Math.ceil(ret.maxHp / 5)];
			case "atk":
				return [Math.ceil(ret.atk / 10), Math.ceil(ret.atk / 10)];
			case "as":
				return [ret.as > 2 ? -Math.ceil(ret.as / 10) : 0, Math.round(Math.pow(35 - ret.as, 2) / 8)];
			case "dodge":
				return [1, 20];
			case "sight":
				return [1, Math.pow(ret.sight, 2)];
			case "movesp":
				return [ret.movesp > 2 ? -Math.ceil(ret.movesp / 10) : 0, Math.round(Math.pow(35 - ret.movesp, 2) / 8)];
			case "def":
				return [1, Math.pow(ret.def, 2)];
			case "water": case "grass": case "rock":
				return [2, ret[which] * 8];
			default:
				return [0, 0];
		}
	}
	
	ret.sendOut = function() {
		ret.inCastle = false;
		ret.calculatePath();
	}
	
	ret.draw = function() {
		ctx.fillStyle = "black";
		ret.drawRect();
		ret.drawHp();
	}
	ret.die = function() {
		rogues.kill(this);
	}
	return ret;
}

function Creep(x, y, hp, atk, as, movesp) {
	var ret = Object.create(Fighter);
	ret.maxHp = hp;
	ret.hp = hp;
	ret.atk = atk;
	ret.as = as;
	ret.currStats = {atk: atk, movesp: movesp};
	ret.def = 0;
	ret.movesp = movesp;
	ret.x = x;
	ret.y = y;
	ret.move = function() {
		// ???
		// profit
		ret.lastMove = 0;
	}
	ret.die = function() {
		enemies.kill(this);
	}
	ret.draw = function() {
		if (grid.tiles[ret.y][ret.x].discovered) {
			ctx.fillStyle = "red";
			ret.drawRect();
			ret.drawHp();
		}
	}
	return ret;
}