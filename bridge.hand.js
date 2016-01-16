/**
 * Defines Hand class and all methods associated with it.
 */
 
// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Hand.
 * @constructor
 * @memberof Bridge
 * @param {string} direction - The direction this hand is sitting
 * @param {object} [deal] - the optional deal that this hand belongs to
 */
Bridge.Hand = function( direction, deal ) {
	Bridge._checkDirection( direction );
	 
	/**
	 * The deal that this hand belongs to.
	 * @member {object}
	 */
	this.deal = deal;	
		
	/**
	 * Optional Unique id to identify this hand.
	 * @member {string}
	 */
	this.id = Bridge._generateID( deal ) + '-' + direction;
	
	/**
	 * The type of this object.
	 * @member {string}
	 */
	this.type = "Hand";
	 
	/**
	 * The direction of this hand
	 * @member {string}
	 */
	this.direction = direction;
	 
	/**
	 * The name of person holding this hand
	 * @member {string}
	 */	 
	this.name = Bridge.directions[ direction ].name;
	 
	/**
	 * The actual cards in this hand
	 * @member {object}
	 */
	this.cards = {};
	for( var suit in Bridge.suits ) {
		this.cards[ suit ] = {};
		for( var rank in Bridge.ranks ) {
			this.cards[ suit ][ rank ] = false;
		}
	}
	 
	/**
	 * Whether the card should be show as x or not
	 */
	this.showAsX = {};
	for( var suit in Bridge.suits ) {
		this.showAsX[ suit ] = {};
		for( var rank in Bridge.ranks ) {
			this.showAsX[ suit ][ rank ] = false;
		}
	}	
	 
	/**
	 * The number of cards this hand has
	 * @member {number}
	 */	 	 
	this.numCards = 0;
	 
	/** Is this the active hand? */
	this._isActive = false;	 
};

//
// Getters and Setters
//

/** Make this the active hand. */
Bridge.Hand.prototype.makeActive = function() {
	this._isActive = true;
	this.onChange( "makeActive" );
};

/** Make this hand inactive. */
Bridge.Hand.prototype.makeInactive = function() {
	this._isActive = false;
	this.onChange( "makeInactive" );
};

/**
 * Get the direction of this hand
 * @return {string} the direction of this hand
 */
Bridge.Hand.prototype.getDirection = function() {
	return this.direction;
};

/**
 * Set the name of the player holding this hand.
 * @param {string} name - the name of player
 */
Bridge.Hand.prototype.setName = function( name ) {
	Bridge._checkRequiredArgument( name );
	this.name = name;
	this.onChange( "setName", name );
};

/**
 * Get the name of the player holding this hand.
 * @return {string} the name of the player
 */
Bridge.Hand.prototype.getName = function() {
	return this.name;
};

/**
 * Get the count of number of cards in this hand
 * @return {number} the number of cards held by this hand
 */
Bridge.Hand.prototype.getCount = function() {
	return this.numCards;
};

/**
 * Set the hand from a BBO handviewer style string
 * @param {string} hand - the hand in string format
 */
Bridge.Hand.prototype.setHand = function( hand ) {
	Bridge._checkRequiredArgument( hand );
	this.fromString( hand );
};

/**
 * Get the hand in BBO handviewer style string format
 * @return {string} the hand in string format
 */
Bridge.Hand.prototype.getHand = function() {
	return this.toString();
};

/**
 * Set a unique id 
 * @param {string} id - a unique identifier
 */
Bridge.Hand.prototype.setID = function( id ) {
	Bridge._checkRequiredArgument( id );
	this.id = id;
};

/**
 * Get the unique id
 * @return {string} the id in string format
 */
Bridge.Hand.prototype.getID = function() {
	return this.id;
};

/**
 * Get the cards in a specific suit
 * @return {string} the cards in string format
 */
Bridge.Hand.prototype.getCards = function( suit ) {
	Bridge._checkSuit( suit );
	var output = "";
	_.each( Bridge.rankOrder, function( rank ) {
		if ( this.cards[ suit ][ rank ] ) {
			if ( this.showAsX[ suit ][ rank ] ) output += 'x';
			else output += rank;
		}
	}, this);	
	return output;
};

/**
 * Add a card to this hand.
 * @param {string} suit - The suit of this card
 * @param {string} rank - The rank of this card
 */
Bridge.Hand.prototype.addCard = function( suit, rank ) {
	var prefix = "In addCard";
	Bridge._checkSuit( suit, prefix );
	var showAsX = false;
	if ( typeof rank === "string" && rank.toLowerCase() === 'x' ) {
		for( var i = Bridge.rankOrder.length-1; i >= 0; --i ) {
			var newRank = Bridge.rankOrder[i];
			if ( this.deal ) {
				var card = this.deal.cards[ suit ][ newRank ];
				if ( !card.isAssigned() ) {
					rank = newRank;
					showAsX = true;
					i = -1;
				}
			}
			else {
				if ( ! this.cards[suit][newRank] ) {
					rank = newRank;
					showAsX = true;
					i = -1;					
				}
			}
		}
	}
	Bridge._checkRank( rank, prefix );
	if ( this.numCards === 13 ) {
		Bridge._reportError( this.name + "'s Hand : already has 13 cards. Cannot add " + suit + rank, prefix );
	}
	if ( this.cards[ suit ][ rank ] ) {
		Bridge._reportError( suit + rank + " is already assigned to " + this.direction + ". Cannot add again", prefix );
	} 	
	// If deal is specified then check if this card has been assigned
	if ( this.deal ) {
		var card = this.deal.cards[ suit ][ rank ];
		if ( card.isAssigned() ) {
			Bridge._reportError( suit + rank + " is already assigned to " + card.getDirection() + ". Cannot add again", prefix );
		}
	}
	this.cards[ suit ][ rank ] = true;
	this.showAsX[ suit ][ rank ] = showAsX;
	if ( this.deal ) {
		this.deal.cards[ suit ][ rank ].assign( this.direction );
	}
	this.numCards++;
	this.onChange( "addCard", {
		"suit": suit,
		"rank": rank
	});
};


/**
 * Remove a card from this hand.
 * @param {string} suit - The suit of this card
 * @param {string} rank - The rank of this card
 */
Bridge.Hand.prototype.removeCard = function( suit, rank ) {
	var prefix = "In removeCard";
	Bridge._checkSuit( suit, prefix );
	Bridge._checkRank( rank, prefix );
	// If deal is specified then check if this card has been assigned
	if ( this.deal ) {
		var card = this.deal.cards[ suit ][ rank ];
		if ( !card.isAssigned() ) {
			Bridge._reportError( suit + rank + " is not assigned to " + this.direction + ". Cannot remove", prefix );
		}
	}
	if ( !this.cards[ suit ][ rank ] ) {
		Bridge._reportError( suit + rank + " is not assigned to " + this.direction + ". Cannot remove", prefix );
	}
	this.cards[ suit ][ rank ] = false;
	this.numCards--;
	if ( this.deal ) {
		this.deal.cards[ suit ][ rank ].unAssign();
	}
	this.onChange( "removeCard", {
		"suit": suit,
		"rank": rank
	});
};


/**
 * Check if this hand has a card.
 * @param {string} suit - The suit of this card
 * @param {string} rank - The rank of this card
 * @return {boolean} Does this hand have the specified card?
 */
Bridge.Hand.prototype.hasCard = function( suit, rank ) {
	var prefix = "In hasCard"
	Bridge._checkSuit( suit, prefix );
	Bridge._checkRank( rank, prefix );
	return this.cards[ suit ][ rank ];
};

/**
 * Remove all cards from this hand
 */
Bridge.Hand.prototype.clearCards = function() {
	 for( var suit in Bridge.suits ) {
	 	for( var rank in Bridge.ranks ) {
			if ( this.cards[ suit ][ rank ] ) this.removeCard( suit, rank );
		}
	 }
};

/**
 * Set a property in this hand.
 * The properties that can be set are as follows<br/>
 * name - string - name of player holding this hand<br/>
 * hand - string - hand in BBO Handviewer string format<br/>
 * id - string - unique id for this hand<br/>
 * @param {string} property - the property to set
 * @param {string} value - the value to set the property to
 */
Bridge.Hand.prototype.set = function( property, value ) {
	var prefix = "In Hand.set";
	Bridge._checkRequiredArgument( property, "Property", prefix );
	Bridge._checkRequiredArgument( value, "Value for Property " + property, prefix );	
	switch ( property ) {
		case "name" :
			this.setName( value );
			break;
		case "hand" :
			this.setHand( value );
			break;
		case "id" :
			this.setID( value );
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Get value of a property .
 * The properties that can be got are as follows<br/>
 * direction - string - the direction of this hand
 * name - string - name of player holding this hand<br/>
 * id - string - a unique id for this hand<br/>
 * count - number - the number of cards this hand has<br/>
 * hand - string - hand in BBO Handviewer string format<br/>
 * @param {string} property - the property to get
 * @return {string} the value of requested property
 * @throws unknown property
 */
Bridge.Hand.prototype.get = function( property ) {
	var prefix = "In Hand.get";
	Bridge._checkRequiredArgument( property, "Property", prefix );
	switch ( property ) {
		case "direction" :
			return this.getDirection();
			break;
		case "name" :
			return this.getName();
			break;
		case "id" :
			return this.getID();
			break;
		case "count" :
			return this.getCount();
			break;
		case "hand" :
			return this.getHand();
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};


/**
 * Generate a string display of this hand.
 * @return {string} string representation of this hand.
 */
Bridge.Hand.prototype.toString = function() {
	var output = "";
	_.each( Bridge.suitOrder, function( suit ) {
		var item = "";
		_.each( Bridge.rankOrder, function( rank ) {
			if ( this.cards[ suit ][ rank ] ) {
				if ( this.showAsX[ suit ][ rank ] ) item += 'x';
				else item += rank;
			}
		}, this);	
		if ( item ) output += suit + item;	
	}, this);
	return output;
};

/**
 * Parse a hand given as BBO handviewer string format.
 * @param {string} handString - the hand in string format
 */
Bridge.Hand.prototype.fromString = function( handString ) {
	Bridge._checkRequiredArgument( handString );
	this.clearCards();
 	var seenSuits = {};
 	for( var direction in Bridge.directions ) {
		seenSuits[ direction ] = false;
	}
 	handString = handString.toLowerCase();
	var currentSuit = '';
	var currentRank = '';
	for( var i = 0; i < handString.length; ++i ) {
		var prefix = 'In hand for ' + this.direction + ' at position ' + (i+1);
		// Read the next character specified in hand
		var currentChar = handString.charAt( i );
		switch( currentChar ) {
			// Check if it specifies suit
			case 'c' :				
			case 'd' :
			case 'h' :
			case 's' :	
				currentSuit = currentChar;
				if ( seenSuits[ currentSuit ] ) {
					Bridge._reportError( ' suit ' + currentSuit + ' has already been seen before!', prefix );
				}
				seenSuits[ currentSuit ] = true;
				break;	
			
			// Special handing for numeric 10
			case '1' :
				if ( currentSuit === '' ) {
					Bridge._reportError( currentChar + ' was found when a suit was expected!', prefix );
				}			
				if ( i < handString.length - 1 && handString.charAt( i+1 ) === '0') {
					currentRank = 't';
					i++;
				}
				else {
					Bridge._reportError( 'a 1 is present without a subsequent 0. Use 10 or t to reprensent the ten.', prefix );
					continue;
				}
				this.addCard( currentSuit, currentRank );
				break;
			// All other characters
			default :
				if ( currentSuit === '' ) {
					Bridge._reportError( currentChar + ' was found when a suit was expected!', prefix );
					continue;
				}
				currentRank = currentChar;
				this.addCard( currentSuit, currentRank );
				break;											
		}	
	}	
	this.onChange( "setHand", handString );
 };
 
/**
 * Does this hand have any cards in the given suit?
 * @param {string} suit the suit to check cards in
 * @return {boolean} true if this hand has cards in the given suit
 */
Bridge.Hand.prototype._hasCards = function( suit ) {
	for( var rank in Bridge.ranks ) {
		if ( this.cards[ suit ][ rank ] ) return true;
	}	
	return false;
}; 
 
/**
 * Get the suit order for this hand by alternating colors
 * @return {array} an array of suits in alternating color order if possible
 */
Bridge.Hand.prototype.getAlternatingSuitOrder = function() {
	var numSuits = 0;
	var hasCards = {};
	_.each( Bridge.suitOrder, function( suit ) {	
		hasCards[ suit ] = this._hasCards( suit );
		if ( hasCards[ suit ] ) numSuits++;
	}, this );
	if ( numSuits < 3 ) return Bridge.suitOrder;
	if ( numSuits === 4 ) return [ 's', 'h', 'c', 'd' ];
	if ( hasCards[ 's' ] && hasCards[ 'c' ] ) return Bridge.suitOrder;
	else return [ 'h', 's', 'c', 'd' ];
}; 
 
/**
 * Generate a json format of this hand
 * @return {object} json representation of this hand.
 */
Bridge.Hand.prototype.toJSON= function() { 
	var output = {};
	output.direction = this.direction;
	output.name = this.name;
	output.hand = this.getHand();
	return output;
};
 
 /**
 * Parse a hand given in json format
 * @param {object} hand - the hand in json format
 */
Bridge.Hand.prototype.fromJSON = function( handString ) {
	Bridge._checkRequiredArgument( handString );
	// direction should not be set
	this.name = handString.name;
	this.setHand( handString.hand );
};


/**
 * Something in this hand has changed.
 * Raise an event
 */
Bridge.Hand.prototype.onChange = function( operation, parameter ) {
	Bridge._triggerEvents( this, operation, parameter );
};






