function Rogue(hp, atk, as, def, dodge, sight, movesp) {
	this.hp = hp;
	this.atk = atk;
	this.as = as;
	this.def = def;
	this.dodge = dodge;
	this.sight = sight;
	this.movesp = movesp;
	this.inCastle = true;
	
	this.x = 10;
	this.y = 10;
	this.lastMove = 0;
	
	this.fra = function() {
		++this.lastMove;
		if (this.lastMove >= this.movesp) {
			this.move();
		}
	}
	
	this.move = function() {
		// move alg here
		if (!this.inCastle) {
			this.lastMove = 0;
			++this.x;
			console.log("move");
		}
	}
	
	this.sendOut = function() {
		this.inCastle = false;
	}
	
	this.draw = function() {
		ctx.fillStyle = "black";
		ctx.fillRect(this.x * grid.tilew + grid.offset[0], this.y * grid.tilew + grid.offset[1], grid.tilew, grid.tilew);
	}
	
	return this;
}