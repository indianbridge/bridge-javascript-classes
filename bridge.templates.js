/**
 * Generate a handlebar context to be used by a template
 * @return {object} template representation of this hand.
 */
Bridge.Hand.prototype.toTemplate= function() { 
	var output = {};
	output.suitOrder = Bridge.suitOrder;
	output.alternatingSuitOrder = this.getAlternatingSuitOrder();
	output.direction = this.direction;
	output.name = this.name;
	output.hand = [];
	_.each( Bridge.suitOrder, function( suit ) {
		var item = { 'suit': Bridge.suits[ suit ].html, 'cards': [] };
		_.each( Bridge.rankOrder, function( rank ) {
			if ( this.cards[ suit ][ rank ] ) {
				if ( this.showAsX[ suit ][ rank ] ) item.cards.push( 'x' );
				else item.cards.push( Bridge.ranks[ rank ].html );
			}
		}, this);	
		output.hand.push( item );
	}, this);
	return output;
};

/**
 * Generate a template representation of this auction.
 * @return {object} template representation of this auction.
 */
Bridge.Auction.prototype.toTemplate = function( ) {
	var output = {};
	output.directions = [];
	var vul = this.vulnerability;
	_.each( Bridge.directionOrder, function( direction ) {
		if ( vul == 'b' || vul == direction || vul == Bridge.getPartner( direction ) ) output.directions.push( "<span class='vulnerable'>" + direction + "</span>" );
		else output.directions.push( direction );
	});
	output.bids = [];
	var callNumber = 0;
	var bids = [];
	var direction = 'w';	
	while( this.dealer !== direction ) {
		direction = Bridge.getLHO( direction );
		bids.push( '' );
		callNumber++;
		if ( callNumber % 4 === 0 ) {
			output.bids.push(bids);
			bids = [];
		}
	}
	_.each( this.calls, function( call ) {
		bids.push( call.toHTML() );
		callNumber++;
		if ( callNumber % 4 === 0 ) {
			output.bids.push(bids);
			bids = [];
		}
	});
	
	return output;
};
