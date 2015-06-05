/**
 * Defines Played Card class and all methods associated with it.
 */
 
// Check if namespace has been defined.
if ( !Bridge ) var Bridge = {};

/**
 * Creates a new Bridge Trick.
 * @constructor
 * @memberof Bridge
 * @param {number} playNumber - the number of this play
 * @param {string} card - a two character string indicating suit and rank of card
 */
Bridge.PlayedCard = function( playNumber, card ) {
	var prefix = "In Bridge.PlayedCard constructor";
	
	// Playnumber
	var intPlayNumber = _.parseInt( playNumber);
	if ( _.isNaN( intPlayNumber ) || intPlayNumber < 1 || intPlayNumber > 52 ) {
		Bridge._reportError( "Playnumber : " + playNumber + " is not valid!", prefix );
	}
	this.playNumber = intPlayNumber;
	
	// Card
	this.card = card;
	
	this.nextToPlay = Bridge.getLHO( this.card.getDirection() );
	this.winningCard = this;
	this.leadCard = this;
	this.nsTricks = 0;
	this.ewTricks = 0;
};

// 
// Getters and Setters
/**
 * Get the card in this playedcard object
 * @return {object} the card object
 */
Bridge.PlayedCard.prototype.getCard = function() {
	return this.card;
};

/**
 * Get the suit of this card
 * @return {string} the suit
 */
Bridge.PlayedCard.prototype.getSuit = function() {
	return this.card.getSuit();
};

/**
 * Get the rank of this card
 * @return {string} the rank
 */
Bridge.PlayedCard.prototype.getRank = function() {
	return this.card.getRank();
};

/**
 * Get the direction who played this card
 * @return {string} direction of hand that played this card
 */
Bridge.PlayedCard.prototype.getDirection = function() {
	return this.card.getDirection();
};

/**
 * Get the winning card after this play
 * @return {object} the winning card
 */
Bridge.PlayedCard.prototype.getWinningCard = function() {
	return this.winningCard;
};

/**
 * Get the lead card for this trick
 * @return {object} the lead card
 */
Bridge.PlayedCard.prototype.getLeadCard = function() {
	return this.leadCard;
};

/**
 * Get a property from hand.
 * The properties that can be got are as follows<br/>
 * card - string - the card of this play<br/>
 * suit - string - the suit of this card<br/>
 * rank - string - the rank of this card<br/>
 * direction - string - direction of hand that played this card<br/>
 * winning_card - object - the card winning after this play<br/>
 * @param {string} property - the property to get
 */
Bridge.PlayedCard.prototype.get = function( property ) {
	var prefix = "In Call.get";
	Bridge._checkRequiredArgument( property, "Property", prefix );	
	switch ( property ) {
		case "card" :
			return this.getCard();
			break;
		case "suit" :
			return this.getSuit();
			break;
		case "rank" :
			return this.getRank();
			break;
		case "direction" :
			return this.getDirection();
			break;
		case "winning_card" :
			return this.getWinningCard();
			break;
		case "lead_card" :
			return this.getLeadCard();
			break;			
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Calculate the winning card after this play
 * @param {object} winningCard - the card that was winning after previous play
 * @param {string} trump - the trump suit
 */
Bridge.PlayedCard.prototype.findWinningCard = function( winningCard, trump ) {
	// If first play automatically winning card
	if ( this.playNumber % 4 === 1 || !winningCard ) {
		this.winningCard = this;
		this.leadCard = this;
		return;
	}
	this.leadCard = winningCard.getLeadCard();
	var winningSuit = winningCard.getSuit();
	var winningRank = winningCard.getRank();
	var suit = this.getSuit();
	var rank = this.getRank();
	if ( winningSuit === trump ) {
		if ( suit === trump && Bridge.isHigherRank( rank, winningRank ) ) this.winningCard = this;
		else this.winningCard = winningCard;
	}
	else {
		if ( suit === trump || ( suit === winningSuit && Bridge.isHigherRank( rank, winningRank ) ) ) this.winningCard = this;
		else this.winningCard = winningCard;
	}
	if ( this.playNumber % 4 === 0 ) {
		var direction = this.winningCard.getDirection();
		if ( Bridge.isNorthSouth( direction ) ) this.nsTricks++;
		else this.ewTricks++;
		this.nextToPlay = direction;
	}
};

/**
 * Generate a string display of this card.
 * @return {string} string representation of this card.
 */
Bridge.PlayedCard.prototype.toString = function() {
	var output = "";
	output += this.card.toString();		
	return output;
};
