function Castle(x, y) {
	this.x = x;
	this.y = y;
	this.sight = 3;
	this.ranks = [[30, 1, 30, 2, 2, 50, 50, 5, 1, 0]];
	for (var i = -this.sight; i < this.sight + 1; ++i) {
		for (var j = -this.sight; j < this.sight + 1; ++j) {
			grid.tiles[this.y + j][this.x + i].discovered = true;
		}
	}
	this.recruit = function(rank) {
		var cost = 10;
		if (money >= cost) {
			var r = this.ranks[rank];
			rogues.push(new Rogue(...r));
			trans(-cost);
			
		}
		
	}
	this.sendOut = function(id) {
		rogues[id].sendOut();
		makeMenu();
	}
}