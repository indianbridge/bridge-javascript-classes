/**
 * Defines Play class and all methods associated with it.
 */
 
// Check if namespace has been defined.
if ( !Bridge ) var Bridge = {};

/**
 * Creates a new Bridge Play.
 * @constructor
 * @memberof Bridge
 * @param {object} [deal] - the optional deal that this play belongs to
 */
Bridge.Play = function( deal ) {
	 
	/**
	 * The deal that this hand belongs to.
	 * @member {object}
	 */
	this.deal = deal;
	this.id = ( deal ? deal.getID() : null );	
	this.currentPlayNumber = 1;
	this.plays = [];
	this.initialized = false;
	this.leader = null;
	this.trump = null;
	 
	// Should an event be raised if anything changes.
	this.triggerEvents = true;		 

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
 * Contract is complete, initialize the play
 */
Bridge.Play.prototype.initialize = function() {
	var contract = this.deal.getAuction().getContract();
	if ( !contract.isComplete ) {
		var prefix = "Bridge.Play constructor";
		Bridge._reportError( "Cannot set up play unless auction is complete", prefix );
	}
	this.trump = contract.getSuit();
	this.leader = contract.getLeader();
	this.initialized = true;
};

/**
 * Who is next to play?
 * @return {string} nextToPlay
 */
Bridge.Play.prototype.getNextToPlay = function() {
	if ( this.currentPlayNumber === 1 ) return this.leader;
	else return this.plays[ this.currentPlayNumber - 2 ].nextToPlay;
};

/**
 * Add a card to this play.
 * @param {string} suit - The suit of this card
 * @param {string} rank - The rank of this card
 */
Bridge.Play.prototype.addPlayedCard = function( suit, rank ) {
	if ( !this.initialized ) this.initialize();
	var prefix = "In Bridge.Play.addPlayedCard";
	suit = suit.toLowerCase();
	rank = rank.toLowerCase();
	Bridge._checkSuit( suit, prefix );
	Bridge._checkRank( rank, prefix );	
	if ( this.deal ) { 
		var card = this.deal.cards[ suit ][ rank ];
		card.play( this.getNextToPlay() );
		var playNumber = this.currentPlayNumber
		var playedCard = new Bridge.PlayedCard( playNumber, card );
		var winningCard = ( playNumber === 1 ? null : this.plays[ playNumber - 2 ].getWinningCard() );
		playedCard.findWinningCard( winningCard, this.trump );
		this.plays[ playNumber - 1 ] = playedCard;
		var numberOfItemsToDelete = this.plays.length - playNumber;
		if ( numberOfItemsToDelete > 0 ) _.dropRight( this.plays, numberOfItemsToDelete );
		this.playCard();
		this.onChange( "addPlayedCard", suit + rank );		
	}
	else {
		Bridge._reportError( "Cannot set up play without corresponding deal", prefix );		
	}
};

/**
 * Removes the last played card from the play
 */
Bridge.Play.prototype.removePlayedCard = function() {
	if ( this.plays.length > 0 ) {
		var playedCard = this.plays.pop();
		this.currentPlayNumber--;
		var suit = playedCard.getSuit();
		var rank = playedCard.getRank();
		this.played[ suit ][ rank ] = -1;
		this.onChange( "removeCall", call.getCall() );
	}
};

/**
 * Clear all played cards in this play
 */
Bridge.Play.prototype.clearPlayedCards = function() {
	while ( this.plays.length > 0 ) this.removePlayedCard();
};

/**
 * Play the card from an already added play.
 */
Bridge.Play.prototype.playCard = function() {
	if ( this.plays.length >= this.currentPlayNumber ) {
		var play = this.plays[ this.currentPlayNumber - 1 ];
		this.currentPlayNumber++;
	}
};


/**
 * Load the play from a string format of play
 * @param {string} play - the play in string format
 */
Bridge.Play.prototype.fromString = function ( play ) {
	this.clearPlayedCards();
	var prefix = 'In Play.fromString';
	var charIndex = 0;
	while( charIndex < play.length ) {
		var suit = play[ charIndex++ ].toLowerCase();
		if ( charIndex >= play.length ) {
			Bridge._reportError( "Play ends unexpectedly on suit with no rank", prefix );
		}
		var rank = play[ charIndex++ ].toLowerCase();
		this.addPlayedCard( suit, rank );
	}
};

/**
 * Load play from a json representation of this play.
 * json is just a string
 * @param {object} json - json representation of this play.
 */
Bridge.Play.prototype.fromJSON = function(json) {
	return this.fromString( json );
};

/**
 * Generate a string display of this play.
 * @return {string} string representation of this play.
 */
Bridge.Play.prototype.toString = function( ) {
	var output = '';
	for( var i = 0; i < this.plays.length; ++i ) {
		output += this.plays[i].toString();
	}
	return output;
};

/**
 * Generate a json representation of this play.
 * This is just the string representation
 * @return {object} json representation of this play.
 */
Bridge.Play.prototype.toJSON = function( ) {
	return this.toString();
};


/**
 * Something in this play has changed.
 * Raise an event, call all registered change callbacks etc.
 */
Bridge.Play.prototype.onChange = function( operation, parameter ) {
	if ( this.triggerEvents && !this.deal || this.deal.triggerEvents ) {
		if ( Bridge.options.enableDebug ) console.log( "play:changed " + operation + " - " + parameter );
		// Raise the event and pass this object so handler can have access to information.
		$( document ).trigger( "play:changed",  [ this, operation, parameter ]);	
		/*var id = this.getID();
		if ( id ) $( document ).trigger( id + ":play:changed",  [ this, operation, parameter ]);*/
			
	}
	if ( this.deal && this.deal.triggerEvents ) {
		if ( Bridge.options.enableDebug ) console.log( "deal:changed " + operation + " - " + parameter );
		$( document ).trigger( "deal:changed",  [ this.deal, operation, parameter ]);
		var id = this.deal.getID();
		if ( id ) $( document ).trigger( id + ":deal:changed",  [ this.deal, operation, parameter ]);
	}
};




