/**
 * Defines Card class and all methods associated with it.
 */
 
// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Card.
 * @constructor
 * @memberof Bridge
 * @param {string} suit - the suit of this card
 * @param {string} rank - the rank of this card
 */
Bridge.Card = function( suit, rank ) {
	var prefix = "In Bridge.Card constructor";
	
	// Suit
	Bridge._checkSuit( suit );
	this.suit = suit;
	
	// Rank
	Bridge._checkRank( rank );
	this.rank = rank;
	
	this.direction = null;
	
	// Has this card been played
	this.played = false;
};

// 
// Getters and Setters

/**
 * Get the suit of this card
 * @return {string} the suit
 */
Bridge.Card.prototype.getSuit = function() {
	return this.suit;
};

/**
 * Get the rank of this card
 * @return {string} the rank
 */
Bridge.Card.prototype.getRank = function() {
	return this.rank;
};

/**
 * Get the direction that has this card
 * @return {string} direction of hand that has this card
 */
Bridge.Card.prototype.getDirection = function() {
	return this.direction;
};

/**
 * Set the direction that has this card
 * @param {string} direction of hand that has this card
 */
Bridge.Card.prototype.setDirection = function( direction ) {
	Bridge._checkDirection( direction );
	this.direction = direction;
};

/**
 * Assign this card to a direction.
 * @param {string} direction of hand that has this card
 */
Bridge.Card.prototype.assign = function( direction ) {
	this.setDirection( direction );
};

/**
 * Unassign this card.
 */
Bridge.Card.prototype.unAssign = function() {
	this.direction = null;
};

/** 
 * Is this card assigned to a direction?
 * @return {boolean} true if card is assigned to a direction, false otherwise
 */
Bridge.Card.prototype.isAssigned = function() {
	return this.direction !== null;
};

/**
 * Play this card
 * @param {string} direction - whose turn is to play
 */
Bridge.Card.prototype.play = function( direction ) {
	var prefix = "In Card.play";
	if ( !this.direction ) {
		Bridge._reportError( "Cannot play card : " + this.getSuit() + this.getRank() + " since it is not assigned to any direction", prefix );
	}
	if ( direction !== this.direction ) {
		Bridge._reportError( "Cannot play card : " + this.getSuit() + this.getRank() + " since it is does not belong to " + direction, prefix );
	}
	if ( this.played ) {
		Bridge._reportError( "Cannot play card : " + this.getSuit() + this.getRank() + " since it is already played", prefix );
	}
	this.played = true;
};

/**
 * Get a property from card.
 * The properties that can be got are as follows<br/>
 * suit - string - the suit of this card<br/>
 * rank - string - the rank of this card<br/>
 * direction - string - direction of hand that played this card<br/>
 * @param {string} property - the property to get
 */
Bridge.Card.prototype.get = function( property ) {
	var prefix = "In Card.get";
	Bridge._checkRequiredArgument( property, "Property", prefix );	
	switch ( property ) {
		case "suit" :
			return this.getSuit();
			break;
		case "rank" :
			return this.getRank();
			break;
		case "direction" :
			return this.getDirection();
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Set a property in this card.
 * The properties that can be set are as follows<br/>
 * direction - string - direction of hand that played this card<br/>
 * @param {string} property - the property to set
 * @param {string} value - the value to set the property to
 */
Bridge.Card.prototype.set = function( property, value ) {
	var prefix = "In Card.set";
	Bridge._checkRequiredArgument( property, "Property", prefix );
	Bridge._checkRequiredArgument( value, "Value for Property " + property, prefix );	
	switch ( property ) {
		case "direction" :
			return this.setDirection( value );
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Generate a string display of this card.
 * @return {string} string representation of this card.
 */
Bridge.Card.prototype.toString = function() {
	return this.suit + this.rank;
};


