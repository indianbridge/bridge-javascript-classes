Bridge.Deal.prototype.toString = function() {
	var outputString = '';
	outputString += '<h3>Deal Information</h3>';
	outputString += 'Board : ' + this.board + '<br/>';
	outputString += 'Dealer : ' + Bridge.Direction.toString( this.dealer ) + '<br/>';
	outputString += 'Vulnerability : ' + Bridge.Vulnerability.toString( this.vulnerability ) + '<br/>';
	outputString += 'Notes : ' + this.notes + '<br/>';
	outputString += '<h3>Hands</h3>';
	for(var direction in Bridge.Directions) {
		outputString += this.hands[ direction ].toString() + '<br/>';
	};
	outputString += '<h3>Auctions</h3>';
	for( var auctionName in this.auctions ) {
		outputString += '<h4>' + auctionName + '</h4>';
		outputString += this.auctions[ auctionName ].toString();	
	};
	outputString += '<h3>Plays</h3>';
	for( var playName in this.plays ) {
		outputString += '<h4>' + playName + '</h4>';
		outputString += this.plays[ playName ].toString();	
	};	
	return outputString;
};

Bridge.Direction = {};
Bridge.Direction.toString = function( direction ) {
		return Bridge.Directions[ direction ].stringName;
};

Bridge.Vulnerability = {};
Bridge.Vulnerability.toString = function( vulnerability ) {
		return Bridge.Vulnerabilities[ vulnerability ].stringName;
}

Bridge.Rank = {};
Bridge.Rank.toString = function( rank ) {
	return Bridge.Ranks[ rank ].stringName;
};

Bridge.Suit = {};
Bridge.Suit.toString = function( suit ) {
	return Bridge.Suits[ suit ].stringName;
};

Bridge.BidSuit = {};
Bridge.BidSuit.toString = function( suit ) {
	return Bridge.BidSuits[ suit ].stringName;
};

Bridge.Hand.prototype.toString = function() {
	var outputString = Bridge.Direction.toString( this.direction ) + ' ';
	if ( this.name ) outputString += '(' + this.name + ') ';
	for ( var i = 0; i < Bridge.SuitOrder.length; ++i ) {
		var suit = Bridge.SuitOrder[ i ];
		outputString += Bridge.Suit.toString( suit );
		var numCards = 0;
		for ( var j = 0; j < Bridge.RankOrder.length; ++j ) {
			var rank = Bridge.RankOrder[ j ];
			if ( this.cards[ suit ].hasOwnProperty( rank ) && this.cards[ suit ][ rank ] ) {
				outputString += Bridge.Rank.toString( rank );
				numCards++;
			}
		}
		if ( numCards === 0 ) {
			outputString += '-';
		}
		outputString += '  ';
	};	
	return outputString;
};

Bridge.Auction.prototype.toString = function() {
	var outputString = '';
	outputString += 'Dealer : ' + Bridge.Direction.toString( this.dealer ) + '<br/>';
	outputString += 'Bidding : ';
	for( var i = 0;i < this.bids.length; ++i ) {
		outputString += this.bids[ i ].toString();
	}	
	outputString += '<br/>';
	outputString += 'Contract : ' + this.contract.level + Bridge.BidSuit.toString( this.contract.suit ) + ( this.contract.doubled ? 'X' : '' ) + ( this.contract.redoubled ? 'X' : '' ) + '<br/>';
	outputString += 'Declarer : ' + ( this.declarer ? Bridge.Direction.toString( this.declarer ) : 'NONE' ) + '<br/>';
	outputString += 'Num Passes : ' + this.numPasses + '<br/>';
	outputString += 'Auction Complete : ' + ( this.isComplete ? 'YES' : 'NO' ) + '<br/>';
	return outputString;
};

Bridge.Bid.prototype.toString = function() {
	var bidString = '';
	switch ( this.suit ) {
		case 'x' :
		case 'r' :
		case 'p' :
			bidString = Bridge.BidSuit.toString( this.suit );
			break;
		default :
			bidString = this.level + Bridge.BidSuit.toString( this.suit );
	}
	if ( this.explanation ) return '<span title="' + unescape(this.explanation) + '">' + bidString + '</span>';
	else return bidString;	
};