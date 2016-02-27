function Castle(x, y) {
	this.x = x;
	this.y = y;
	this.ranks = [[10, 1, 10, 2, 2, 2, 30]]
	
	this.recruit = function(rank) {
		var r = this.ranks[rank];
		rogues.push(new (Rogue.bind.apply(Rogue, r)));
	}
}