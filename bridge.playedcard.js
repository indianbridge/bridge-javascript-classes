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
 * @param {Bridge.Card} card - the current played card
 * @param {Bridge.PlayedCard/string} previousCard - the previous card
 * @param {string} [annotation] - optional annotation for this call
 */
Bridge.PlayedCard = function( playNumber, card, previousCard, annotation ) {
	var prefix = "In Bridge.PlayedCard constructor";
	
	// Playnumber
	var intPlayNumber = _.parseInt( playNumber);
	if ( _.isNaN( intPlayNumber ) || intPlayNumber < 0 || intPlayNumber > 52 ) {
		Bridge._reportError( "Playnumber : " + playNumber + " is not valid!", prefix );
	}
	if ( intPlayNumber > 0 && intPlayNumber !== previousCard.getPlayNumber() + 1 ) {
		Bridge._reportError( "Playnumber : " + playNumber + " does not follow previous playNumber :" + previousCard.getPlayNumber() + "!", prefix );
	}
	
	/**
	 * The number of this play between 0 and 52.
	 * @member {number}
	 */
	this.playNumber = intPlayNumber;
	
	// Set some defaults and override them in update function
	/**
	 * Who plays next? Based on play number and winning card.
	 * @member {string}
	 */
	this.nextToPlay = null;
	
	/**
	 * The winning card to this trick after this card has been played.
	 * @member {Bridge.PlayedCard}
	 */
	this.winningCard = null;
	
	/**
	 * The card that was lead on this trick.
	 * @member {Bridge.PlayedCard}
	 */
	this.leadCard = null;
	
	/**
	 * The annotation if any associated with this play.
	 * @member {string}
	 */
	this.annotation = annotation;
	
	// Special case when playNumber is 0
	if ( intPlayNumber === 0 ) {
		Bridge._checkStrain( card );
		this.trump = card;
		Bridge._checkDirection( previousCard );
		this.leader = previousCard;
		this.nextToPlay = this.leader;
		this.direction = null;
		this.nsTricks = 0;
		this.ewTricks = 0;
		this.clearTableCards_();
		return;
	}
	
	/**
	 * The cards currently played on the table.
	 * @member {object}
	 */
	this.tableCards = _.clone( previousCard.tableCards );
	
	/**
	 * Num tricks won by north south so far.
	 * @member {number}
	 */
	this.nsTricks = previousCard.getNSTricks();
	
	/**
	 * Num tricks won by east west so far.
	 * @member {number}
	 */
	this.ewTricks = previousCard.getEWTricks();
	
	if ( !( card instanceof Bridge.Card ) || !( previousCard instanceof Bridge.PlayedCard) ) {
		Bridge._reportError( "Invalid card or previousCard!", prefix );
	}
	
	/**
	 * The card that has been played.
	 * @member {Bridge.Card}
	 */
	this.card = card;
	
	/**
	 * The card (possibly null) that was played previously.
	 * @member {Bridge.Card}
	 */
	this.previousCard = previousCard;
	
	/**
	 * The trump suit
	 * @member {string}
	 */
	this.trump = this.previousCard.trump;
	
	/**
	 * The original leader for this play
	 * @member {string}
	 */
	this.leader = this.previousCard.leader;
	
	/**
	 * The direction of this played card
	 * @member {string}
	 */
	this.direction = this.previousCard.nextToPlay;
	
	// Update the defaults with correct values
	this.updateInformation_();
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
 * Get the play number
 * @return {number} the play number
 */
Bridge.PlayedCard.prototype.getPlayNumber = function() {
	return this.playNumber;
};

/**
 * Get the trump
 * @return {string} the trump
 */
Bridge.PlayedCard.prototype.getTrump = function() {
	return this.trump;
};

/**
 * Get the leader
 * @return {string} the leade
 */
Bridge.PlayedCard.prototype.getLeader = function() {
	return this.leader;
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
	return this.direction;
};

/**
 * Get the direction that is next to play
 * @return {string} direction that is next to play
 */
Bridge.PlayedCard.prototype.getNextToPlay = function() {
	return this.nextToPlay;
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
 * Get the num tricks won by ns
 * @return {number} the num tricks won by ns
 */
Bridge.PlayedCard.prototype.getNSTricks = function() {
	return this.nsTricks;
};

/**
 * Get the num tricks won by ew
 * @return {number} the num tricks won by ew
 */
Bridge.PlayedCard.prototype.getEWTricks = function() {
	return this.ewTricks;
};

/**
 * Clear the cards played to the table.
 */
Bridge.PlayedCard.prototype.clearTableCards_  = function() {
	this.tableCards = {}
	for( var direction in Bridge.directions ) {
		this.tableCards[ direction ] = null;
	}
};

/**
 * Get a property from hand.
 * The properties that can be got are as follows<br/>
 * play_number - number - the play number <br/>
 * trump - string - the strain indicating trump <br/>
 * leader - string - the direction of original leader <br/>
 * card - string - the card of this play<br/>
 * suit - string - the suit of this card<br/>
 * rank - string - the rank of this card<br/>
 * direction - string - direction of hand that played this card<br/>
 * winning_card - Bridge.PlayedCard - the card winning after this play<br/>
 * lead_card - Bridge.PlayedCard - the card lead to this trick<br/>
 * ns_tricks - number - the number of tricks won by ns so far<br/>
 * ew_tricks - number - the number of tricks won by ew so far<br/>
 * next_to_play - string - who is next to play<br/>
 * @param {string} property - the property to get
 */
Bridge.PlayedCard.prototype.get = function( property ) {
	var prefix = "In Call.get";
	Bridge._checkRequiredArgument( property, "Property", prefix );	
	switch ( property ) {
		case "play_number" :
			return this.getPlayNumber();
			break;
		case "trump":
			return this.getTrump();
			break;
		case "leader":
			return this.getLeader();
			break;
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
		case "ns_tricks" :
			return this.getNSTricks();
			break;
		case "ew_tricks" :
			return this.getEWTricks();
			break;
		case "next_to_play" :
			return this.getNextToPlay();
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};


/**
 * Update information like lead, winning card, num tricks based previous and current card.
 */
Bridge.PlayedCard.prototype.updateInformation_ = function() {
	// Set to next to play to be lho. Will be changed if this is last card to trick.
	this.nextToPlay = (this.previousCard ? Bridge.getLHO( this.getDirection() ) : Bridge.getLHO( this.leader ) );
	// Update table cards
	if ( this.playNumber % 4 === 1 ) {
		this.clearTableCards_();
	}
	this.tableCards[ this.direction ] = this.card;
	// Start of a new trick
	if ( this.playNumber % 4 === 1 ) {
		this.winningCard = this;
		this.leadCard = this;
		return;
	}
	
	var winningCard = this. previousCard.winningCard;
	// Set lead to be same as previous card as this is same trick
	this.leadCard = winningCard.getLeadCard();
	var winningSuit = winningCard.getSuit();
	var winningRank = winningCard.getRank();
	var suit = this.getSuit();
	var rank = this.getRank();
	// Set winning card based on trump and rank of this card
	var trump = this.trump;
	if ( winningSuit === trump ) {
		if ( suit === trump && Bridge.isHigherRank( rank, winningRank ) ) this.winningCard = this;
		else this.winningCard = winningCard;
	}
	else {
		if ( suit === trump || ( suit === winningSuit && Bridge.isHigherRank( rank, winningRank ) ) ) this.winningCard = this;
		else this.winningCard = winningCard;
	}
	if ( this.playNumber % 4 === 0 ) {
		// Last card to the trick. Update num tricks and next to play.
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
	if ( this.annotation ) {
		output += "{" + this.annotation + "}";
	}		
	return output;		
};
