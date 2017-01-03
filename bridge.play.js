/**
 * Defines Play class and all methods associated with it.
 */

// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Play.
 * @constructor
 * @memberof Bridge
 * @param {object} [deal] - the optional deal that this play belongs to
 */
Bridge.Play = function( deal ) {

	/**
	 * The deal that this play belongs to.
	 * @member {object}
	 */
	this.deal = deal;

	/**
	 * A unique id to identify this play.
	 * @member {string}
	 */
	this.id = deal ? deal.id : Bridge.IDManager.generateID();

	/**
	 * The type of this object.
	 * @member {string}
	 */
	this.type = "Play";

  /**
	 * Should events be triggered for this object.
	 * @member {bool}
	 */
	this.eventTriggersEnabled = true;

	/**
	 * The cards that are in this play
	 * @member {array}
	 */
	this.plays = [];
	for( var i = 0; i <= 52; ++i ) this.plays.push( null );

	/**
	 * The last added play to this play sequence.
	 * @member {number}
	 */
	this.lastPlayIndex = -1;

	/**
	 * The current play index when trying to play out the hand.
	 * @member {number}
	 */
	this.currentPlayIndex = 0;

	/**
	 * Which cards have been added to the play
	 * @member {object}
	 */
	this.cardAdded = {};
	for( var suit in Bridge.suits ) {
		this.cardAdded[ suit ] = {};
		for( var rank in Bridge.ranks ) {
			this.cardAdded[ suit ][ rank ] = false;
		}
	}

	/**
	 * Which cards have been played in the play
	 * @member {object}
	 */
	this.cardPlayed = {};
	for( var suit in Bridge.suits ) {
		this.cardPlayed[ suit ] = {};
		for( var rank in Bridge.ranks ) {
			this.cardPlayed[ suit ][ rank ] = false;
		}
	}

	/**
	 * Who is the leader (to the first trick)?
	 * @member {string}
	 */
	this.leader = 'w';

	/**
	 * What is the trump suit?
	 * @member {string}
	 */
	this.trump = 'n';

	this.initialize();

	// callbacks to called when things change.
	this.callbacks = {
		"": [],
	};
};

// Register a callback.
Bridge.Play.prototype.registerCallback = function(callback, operation) {
	operation = operation || "";
	if (!(operation in this.callbacks)) {
		this.callbacks[operation] = [];
	}
	this.callbacks[operation].push(callback);
};

/**
 * Set a unique id
 * @param {string} id - a unique identifier
 */
Bridge.Play.prototype.setID = function( id ) {
	Bridge._checkRequiredArgument( id );
	this.id = id;
};

/**
 * Get the unique id
 * @return {string} the id in string format
 */
Bridge.Play.prototype.getID = function() {
	return this.id;
};

/**
 * Set the trump
 * @param {string} trump - the new trump suit
 */
Bridge.Play.prototype.setTrump = function( trump ) {
	Bridge._checkRequiredArgument( trump );
	Bridge._checkStrain( trump )
	this.trump = trump;
	this.plays[0].setTrump( trump );
};

/**
 * Get the trump suit
 * @return {string} the trump suit
 */
Bridge.Play.prototype.getTrump = function() {
	return this.trump;
};

/**
 * Set the leader
 * @param {string} leader - the new leader
 */
Bridge.Play.prototype.setLeader = function( leader ) {
	Bridge._checkRequiredArgument( leader );
	Bridge._checkDirection( leader)
	this.leader = leader;
	this.plays[0].setLeader( leader );
};

/**
 * Get the leader
 * @return {string} the leader
 */
Bridge.Play.prototype.getLeader = function() {
	return this.leader;
};

/**
 * Set the play from string
 * @param {string} play - the play in string format
 */
Bridge.Play.prototype.setPlay = function( play ) {
	Bridge._checkRequiredArgument( play );
	this.fromString( play );
};

/**
 * Get the play in string format
 * @return {string} the play in string format
 */
Bridge.Play.prototype.getPlay = function() {
	return this.toString();
};

/**
 * Get a property in this auction.
 * The properties that can be got are as follows<br/>
 * id - string - an unique id for this play<br/>
 * trump - character [ n s h d c] -  the trump for this play<br/>
 * leader - character [ n e s w ] - the leader for this deal<br/>
 * play - string - play as a stirng<br/>
 * @param {string} property - the property to set<br/>
 * @return {mixed} the value of requested property
 * @throws unknown property
 */
Bridge.Play.prototype.get = function( property ) {
	var prefix = 'In Play.get';
	Bridge._checkRequiredArgument( property, 'Property', prefix );
	switch ( property ) {
		case 'id' :
			return this.getID();
			break;
		case 'trump' :
			return this.getTrump();
			break;
		case "leader" :
			return this.getLeader();
			break;
		case 'play' :
			return this.getPlay();
			break;
		default :
			Bridge._reportError( 'Unknown deal property ' + property, prefix );
	}
};

/**
 * Set a property in this play.
 * The properties that can be set are as follows<br/>
 * id - string - an unique id for this play<br/>
 * trump - character [ n s h d c] -  the trump for this play<br/>
 * leader - character [ n e s w ] - the leader for this deal<br/>
 * play - string - play as a stirng<br/>
 * @param {string} property - the property to set<br/>
 * @param {string} value - the value to set the property to
 * @return {boolean} true if property was set, false otherwise
 * @throws unknown property
 */
Bridge.Play.prototype.set = function( property, value ) {
	var prefix = 'In Play.set';
	Bridge._checkRequiredArgument( property, 'Property', prefix );
	Bridge._checkRequiredArgument( value, 'Value for Property ' + property, prefix );
	switch ( property ) {
		case 'id' :
			this.setID( value );
			break;
		case 'trump' :
			this.setTrump( value );
			break;
		case "leader" :
			this.setLeader( value );
		case 'play' :
			this.setPlay( value );
			break;
		default :
			Bridge._reportError( 'Unknown deal property ' + property, prefix );
	}
};


/**
 * Contract is complete, initialize the play
 */
Bridge.Play.prototype.initialize = function() {
	var prefix = "Bridge.Play initialize";
	if ( this.deal && this.deal.getAuction().getContract().isComplete ) {
		var contract = this.deal.getAuction().getContract();
		if ( !contract.isComplete ) {
			Bridge._reportError( "Cannot initialize play unless auction is complete", prefix );
		}
		this.trump = contract.getSuit();
		this.leader = contract.getLeader();
	}
	this.plays[0] = new Bridge.PlayedCard( 0, this.trump, this.leader );
	this.lastPlayIndex = 0;
};

/**
 * Who is next to play?
 * @return {string} nextToPlay
 */
Bridge.Play.prototype.getNextToPlay = function() {
	var prefix = "Bridge.Play getNextToPlay";
	if ( this.lastPlayIndex === -1 ) {
		Bridge._reportError( "No play entries have been added. Cannot get next to play", prefix );
	}
	return this.plays[ this.lastPlayIndex ].getNextToPlay();
};

/**
 * Add a card to this play.
 * @param {string} suit - The suit of this card
 * @param {string} rank - The rank of this card
 * @param {string} [annotation] - optional annotation for this play
 */
Bridge.Play.prototype.addCard = function( suit, rank, annotation ) {

	// Identify the card
	var prefix = "In Bridge.Play.addCard";
	suit = suit.toLowerCase();
	rank = rank.toLowerCase();
	Bridge._checkSuit( suit, prefix );
	Bridge._checkRank( rank, prefix );
	var card = ( this.deal ? this.deal.cards[ suit ][ rank ] : new Bridge.Card( suit, rank ) );

	// Find whose turn it is to play
	var direction = this.getNextToPlay();
	if ( this.deal && !this.deal.getHand( direction ).hasCard( suit, rank ) ) {
		Bridge._reportError( suit + rank + " does not belong to " + direction, prefix );
	}
	if ( this.cardAdded[ suit ][ rank ] ) {
		Bridge._reportError( suit + rank + " is already part of play", prefix );
	}

	// Get previous card to determine who wins the trick so far
	var playNumber = this.lastPlayIndex + 1;
	var previousCard = this.plays[ this.lastPlayIndex ];

	// Create a new play card and add it to play
	var playedCard = new Bridge.PlayedCard( playNumber, card, previousCard, annotation );
	this.plays[ this.lastPlayIndex + 1 ] = playedCard;
	this.lastPlayIndex++;

	// Mark card as played
	this.cardAdded[ suit ][ rank ] = true;

	// Trigger events if enabled
	this.onChange( "addCard", playedCard );

};

/**
 * Removes the last played card from the play
 */
Bridge.Play.prototype.removeCard = function() {
	var prefix = "In Bridge.Play.removeCard";
	if ( this.lastPlayIndex > 0 ) {

		// Remove the card
		var playedCard = this.plays[ this.lastPlayIndex ];
		this.plays[ this.lastPlayIndex ] = null;
		this.lastPlayIndex--;
		if ( this.currentPlayIndex > this.lastPlayIndex ) {
			this.currentPlayIndex = this.lastPlayIndex;
		}

		// Mark the card as unplayed
		this.cardAdded[ playedCard.getSuit()][ playedCard.getRank() ] = false;

		// Trigger events if enabled
		this.onChange( "removeCard", playedCard );
	}
	else {
		Bridge._reportError( "No more plays to remove", prefix );
	}
};

/**
 * Advances the play till the specified index.
 * @param {number} index - The play number to advance to.
 */
Bridge.Play.prototype.playCardTillIndex_ = function( index ) {
	var prefix = "In Bridge.Play.playCardTillIndex_";
	if ( index < 1 || index > this.lastPlayIndex) {
		Bridge._reportError( "Cannot advance because specified play number " + index + " is invalid", prefix );
	}
	if ( this.currentPlayIndex >= index ) {
		Bridge._reportError( "Cannot advance because current play number is at or greater than specified play number " + index, prefix );
	}
	while ( this.currentPlayIndex < index ) {
		this.currentPlayIndex++;
		var playedCard = this.plays[ this.currentPlayIndex ];
		this.cardPlayed[ play.getSuit() ][ play.getRank() ] = true;

		// Trigger events if enabled
		this.onChange( "playCard", playedCard );
	}
	this.onChange( "playCardCompleted", playedCard );
};

/**
 * Advance the play by one card.
 */
Bridge.Play.prototype.playCard = function() {
	this.playCardTillIndex_( this.currentPlayIndex + 1 );
};

/**
 * Advance the play by one trick.
 */
Bridge.Play.prototype.playTrick = function() {
	var index = this.currentPlayIndex + 1;
	while (index % 4 !== 0 ) index ++;
	this.playCardTillIndex_( index );
};

/**
 * Advance the play to the end.
 */
Bridge.Play.prototype.playAll = function() {
	var index = this.lastPlayIndex;
	this.playCardTillIndex_( index );
};

/**
 * Rewind the play till the specified index.
 * @param {number} index - The play number to rewind to.
 */
Bridge.Play.prototype.undoPlayCardTillIndex_ = function( index ) {
	var prefix = "In Bridge.Play.unplayCardTillIndex_";
	if ( index < 0 || index >= this.lastPlayIndex ) {
		Bridge._reportError( "Cannot rewind because specified play number " + index + " is invalid", prefix );
	}
	if ( this.currentPlayIndex <= index ) {
		Bridge._reportError( "Cannot rewind because current play number is at or lesser than specified play number " + index, prefix );
	}
	while ( this.currentPlayIndex > index ) {
		var playedCard = this.plays[ this.currentPlayIndex ];
		this.currentPlayIndex--;
		this.cardPlayed[ play.getSuit() ][ play.getRank() ] = false;

		// Trigger events if enabled
		this.onChange( "undoPlayCard", playedCard );
	}
	this.onChange( "undoPlayCardCompleted", playedCard );
};

/**
 * Undo the play by one card.
 */
Bridge.Play.prototype.undoPlayCard = function() {
	this.undoPlayCardTillIndex_( this.currentPlayIndex - 1 );
};

/**
 * Undo the play by one trick.
 */
Bridge.Play.prototype.undoPlayTrick = function() {
	var index = this.currentPlayIndex - 1;
	while (index % 4 !== 0 ) index --;
	this.undoPlayCardTillIndex_( index );
};

/**
 * Undo the play all the way to the start.
 */
Bridge.Play.prototype.undoPlayAll = function() {
	var index = 0;
	this.undoPlayCardTillIndex_( index );
};
Bridge.Play.prototype.rewind = Bridge.Play.prototype.undoPlayAll;

/**
 * Remove all added cards in this play
 */
Bridge.Play.prototype.clearCards = function() {
	while ( this.lastPlayIndex > 0 ) this.removeCard();
};

/**
 * Load the play from a string format of play
 * @param {string} play - the play in string format
 */
Bridge.Play.prototype.fromString = function ( play ) {
	this.clearCards();
	var prefix = 'In Play.fromString';
	var charIndex = 0;
	while( charIndex < play.length ) {
		var suit = play[ charIndex++ ].toLowerCase();
		if ( charIndex >= play.length ) {
			Bridge._reportError( "Play ends unexpectedly on suit with no rank", prefix );
		}
		var rank = play[ charIndex++ ].toLowerCase();
		var annotation = null;
		if ( play[ charIndex ] === '{' ) {
			var endChar = '}';
			var returnValue = Bridge._parseContainedText( play, charIndex, endChar, prefix );
			annotation = returnValue.text;
			charIndex = returnValue.position + 1;
		}
		this.addCard( suit, rank, annotation );
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
	for( var i = 1; i <= this.lastPlayIndex; ++i ) {
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
 * Raise an event
 */
Bridge.Play.prototype.onChange = function( operation, parameter ) {
	if (operation in this.callbacks) {
		_.each(this.callbacks[operation], function(callback) {
			callback(operation, parameter);
		});
	}
	_.each(this.callbacks[""], function(callback) {
		callback(operation, parameter);
	});
	if (this.deal) {
		this.deal.runCallbacks(operation, parameter);
	}
	// if (this.eventTriggersEnabled && (!this.deal || this.deal.eventTriggersEnabled)) {
	// 	Bridge.events.trigger(this, operation, parameter);
	// }
};
