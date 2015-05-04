/**
 * Defines Deal class and all methods associated with it.
 */
 
// Check if namespace has been defined.
if ( !Bridge ) var Bridge = {};

/**
 * Creates a new Bridge Deal.
 * @constructor
 * @memberof Bridge
 */
Bridge.Deal = function() {
	/**
	 * Information about who is assigned which card
	 * This is just for error checking.
	 * @private
	 * @member {object}
	 */
	this._cardAssignedTo = {};
	for( var suit in Bridge.suits ) {
		this._cardAssignedTo[ suit ] = {};
		for ( var rank in Bridge.ranks ) {
			this._cardAssignedTo[ suit ][ rank ] = null;
		}
	}	
	
	/**
	 * The 4 hands in this deal
	 * @member {object}
	 */	
	this.hands = {};
	for( var direction in Bridge.directions ) {
		this.hands[ direction ] = new Bridge.Hand( direction, this );
	}	
	
	/** The currently active hand. */
	this._activeHand = 'n';
	
	/**
	 * The board number of this deal.
	 * @member {number}
	 */
	this.board = 1;
	
	/**
	 * The vulnerability of this deal.
	 * @member {string}
	 */
	this.vulnerability = "-";
	
	/**
	 * The dealer of this deal.
	 * @member {string}
	 */
	this.dealer = "n";
	
	/**
	 * The form of scoring for this deal.
	 * @member {string}
	 */
	this.scoring = "KO";	
	
	/**
	 * Any notes associated with this deal.
	 * @member {string}
	 */
	this.notes = "";	
	
	/**
	 * The auction associated with this deal.
	 * @member {object}
	 */
	this.auction = new Bridge.Auction( this );	
	
	// Should an event be raised if anything changes.
	this.triggerEvents = true;	
};

//
// Getters and Setters
//

/**
 * Enable trigger of events when deal changes.
 */
Bridge.Deal.prototype.enableEventTrigger = function() { this.triggerEvents = true; }

/**
 * Disable trigger of events when deal changes.
 */
Bridge.Deal.prototype.disableEventTrigger = function() { this.triggerEvents = false; }


/** 
 * Get the hand for the specified direction
 * @param {string} direction - the direction whose hand is needed
 * @return {object} the hand object.
 */
Bridge.Deal.prototype.getHand = function( direction ) {
	Bridge._checkDirection( direction );
	return this.hands[ direction ];
};

/**
 * Get the active hand of this deal.
 * @return {string} the active hand.
 */
Bridge.Deal.prototype.getActiveHand = function() { return this._activeHand; }

/**
 * Set the active hand for this deal.
 * @param {string} direction - the active hand
 */
Bridge.Deal.prototype.setActiveHand = function( direction ) {
	Bridge._checkDirection( direction );
	this.getHand( this.getActiveHand() ).makeInactive();
	this._activeHand = direction;
	this.getHand( direction ).makeActive();
	this.onChange( "setActiveHand", direction );
};

/**
 * Get the board number of this deal.
 * @return {number} the board number.
 */
Bridge.Deal.prototype.getBoard = function() { return this.board; }

/**
 * Set the board number for this deal.
 * @param {string|number} board - the board number as a string or number
 */
Bridge.Deal.prototype.setBoard = function( board ) {
	var boardNum = parseInt( board );
	if ( isNaN( boardNum ) || String( boardNum ) !== String( board ) || boardNum < 1 ) {
		Bridge.Utilities.reportError( board + " is not a valid board number", "In setBoard");
	}
	this.board = boardNum;
	this.onChange( "setBoard", this.board );
};

/**
 * Get the dealer of this deal.
 * @return {string} the dealer.
 */
Bridge.Deal.prototype.getDealer = function() { return this.dealer; }

/**
 * Set the dealer for this deal.
 * @param {string} dealer - the dealer
 */
Bridge.Deal.prototype.setDealer = function( dealer ) {
	dealer = dealer.toLowerCase();
	Bridge._checkDirection( dealer );
	this.dealer = dealer;
	this.getAuction().setDealer( dealer );
	this.onChange( "setDealer", dealer );
};

/**
 * Get the vulnerability of this deal.
 * @return {string} the vulnerability.
 */
Bridge.Deal.prototype.getVulnerability = function() { return this.vulnerability; }

/**
 * Set the vulnerability for this deal.
 * @param {string} vulnerability - the vulnerability
 */
Bridge.Deal.prototype.setVulnerability = function( vulnerability ) {
	vulnerability = vulnerability.toLowerCase();
	if ( vulnerability === "0" ) vulnerability = "-";
	Bridge._checkVulnerability( vulnerability );
	this.vulnerability = vulnerability;
	this.getAuction().setVulnerability( vulnerability );
	this.onChange( "setVulnerability", vulnerability );
};

/**
 * Get the scoring of this deal.
 * @return {string} the scoring.
 */
Bridge.Deal.prototype.getScoring = function() { return this.scoring; }

/**
 * Set the scoring for this deal.
 * @param {string} scoring - the scoring
 */
Bridge.Deal.prototype.setScoring = function( scoring ) {
	Bridge._checkRequiredArgument( scoring );
	this.scoring = scoring;
	this.onChange( "setScoring", scoring );
};

/**
 * Get the notes of this deal.
 * @return {string} the notes.
 */
Bridge.Deal.prototype.getNotes = function() { return this.notes; }

/**
 * Set the notes for this deal.
 * @param {string} notes - the notes
 */
Bridge.Deal.prototype.setNotes = function( notes ) {
	Bridge._checkRequiredArgument( notes );
	this.notes = notes;
	this.onChange( "setNotes", notes );
};

/**
 * Get the auction associated with this deal
 * @return {object} the auction object
 */
Bridge.Deal.prototype.getAuction = function() {
	return this.auction;
};


/**
 * Set a property in this deal.
 * The properties that can be set are as follows<br/>
 * board - number - board number<br/>
 * vulnerability - character [ - n e b ] - the vulnerability<br/>
 * dealer - character [ n e s w ] - the dealer <br/>
 * scoring - string the scoring type for this deal in free format <br/>
 * notes - string - Any notes for this deal <br/>
 * @param {string} property - the property whose value should be set
 * @param {*} value - the value to set for property
 */
Bridge.Deal.prototype.set = function( property, value ) {
	var prefix = "In Bridge.Deal.prototype.set";
	Bridge._checkRequiredArgument( property, "Property", prefix );
	Bridge._checkRequiredArgument( value, "Value for Property " + property, prefix );
	switch ( property ) {
		case "board" :
			this.setBoard( value );
			break;
		case "vulnerability" :
			this.setVulnerability( value );
			break;
		case "dealer" :
			this.setDealer( value );
			break;
		case "scoring" :
			this.setScoring( value );
			break;
		case "notes" :
			this.setNotes( value );
			break;			
		default :
			Bridge._reportError( "Unknown deal property " + property, prefix );
	}
};

/**
 * Get value of a property .
 * See {@link Bridge.Deal#set} for list of properties
 * @param {string} property - the property to get
 * @return {*} the value of requested property
 */
Bridge.Deal.prototype.get = function( property ) {
	var prefix = "In Bridge.Deal.prototype.get - "
	Bridge._checkRequiredArgument( property, "Property", prefix );
	switch ( property ) {
		case "board" :
			return this.getBoard();
		case "vulnerability" :
			return this.getVulnerability();
		case "dealer" :
			return this.getDealer();
		case "scoring" :
			return this.getScoring();
		case "notes" :
			return this.getNotes();
		case "auction" :
			return this.getAuction();
		default :
			Bridge._reportError( "Unknown deal property " + property, prefix );
	}
};

/**
 * Assign the rest of the unassigned cards.
 */
Bridge.Deal.prototype.assignRest = function() {
	/** Get the unassigned cards and shuffle them. */
	var unassigned = [];
	for( var suit in Bridge.suits ) {
		for ( var rank in Bridge.ranks ) {
			if ( !this._cardAssignedTo[ suit ][ rank ] ) {
				unassigned.push( suit + rank );
			}
		}
	}		
	if ( _.isEmpty( unassigned ) ) return;
	unassigned = _.shuffle( unassigned );
	var assignedCardCount = 0;
	var direction = "n";
	var fullDirection = null;
	_.each( unassigned, function( card ) {
		while ( this.getHand( direction ).getCount() === 13 ) {
			if ( !fullDirection ) fullDirection = direction;
			direction = Bridge.getLHO( direction );
			if ( fullDirection === direction ) {
				Bridge._reportError( "Unable to assign remaining cards" );
			}		
		}		
		this.getHand( direction ).addCard( card[0], card[1] );		
	}, this);
};

/**
 * Load this deal from BBO Handviewer like string format
 * @param {string} deal - the deal in string format
 */
Bridge.Deal.prototype.fromString = function( deal ) {
	var parameters = {};
	_.each( deal.split( '&' ), function( pairs ) {
		var values = pairs.split( '=' );
		parameters[ values[0] ] = decodeURIComponent( values[1] );
	});	
	var numHandsSpecified = 0;
	_.each( parameters, function( value, key ) {
		switch ( key ) {
			case 'b' :
				this.set( 'board', value );
				break;
			case 'd' :
				this.set( 'dealer', value );
				break;
			case 'v' :
				this.set( 'vulnerability', value );
				break;		
			case 't' :
				this.set( 'notes', value );
				break;	
			case 'a' :
				var auction = this.getAuction();
				if ( value[0] === '-' ) {
					auction.setContract( value.slice(1) );
				}
				else {
					auction.setAuction( value );
				}
				break;
			case 'n' :
			case 'e' :
			case 's' :
			case 'w' :
				var hand = this.getHand( key );
				hand.setHand( value );
				if ( hand.getCount()  === 13 ) {
					numHandsSpecified++;
				}	
				break;	
			case 'nn' :
			case 'en' :
			case 'sn' :
			case 'wn' :
				var hand = this.getHand( key[0] );
				hand.setName( value );	
				break;									
			default :
				break;
		}
	}, this);
	if ( numHandsSpecified === 3 ) {
		this.assignRest();
	}	
};

/**
 * Generate a string display of this deal.
 * @param {boolean} should expanded format used by Bridge Hand Player be used?
 * @return {string} string representation of this deal.
 */
Bridge.Deal.prototype.toString = function( expandedFormat ) {
	expandedFormat = Bridge.assignDefault( expandedFormat, false );
	var output = "";
	var items = [];
	if ( this.board ) items.push( "b=" + this.getBoard() );
	if ( this.dealer ) items.push( "d=" + this.getDealer() );
	if ( this.vulnerability ) items.push( "v=" + this.getVulnerability() );
	if ( expandedFormat && this.notes ) items.push( "t=" + this.getNotes() );
	for(var direction in Bridge.directions) {
		var hand = this.getHand( direction );
		var handString = hand.toString();
		if ( hand ) items.push( direction + "=" + hand );
		items.push( direction + "n=" + hand.getName() );
	};
	if ( this.auction ) items.push ( "a=" + this.auction.toString() );	
	return items.join( "&" );
};

/**
 * Generate a JSON representation of this deal.
 * @return {object} json representation of this deal.
 */
Bridge.Deal.prototype.toJSON = function() {
	var output = {};
	output.version = "1.0";
	var fields = [ 'board', 'dealer', 'vulnerability', 'scoring', 'notes' ];
	_.each( fields, function( field ) {
		output[ field ] = this.get( field );
	}, this);
	output.hands = {};
	for(var direction in Bridge.directions) {
		var hand = this.getHand( direction );
		output.hands[ direction ] = hand.toJSON();
	};
	output.auction = this.auction.toJSON();
	return output;
};

/**
 * Load the deal from a json representation
 * @param {object} the json representation of this deal.
 */
Bridge.Deal.prototype.fromJSON = function( json ) {
	var fields = [ 'board', 'dealer', 'vulnerability', 'scoring', 'notes' ];
	_.each( fields, function( field ) {
		if ( _.has( json, field ) ) this.set( field, json[ field ] );
	}, this);
	if ( _.has( json, "hands" ) ) {
		for(var direction in Bridge.directions) {
			if ( _.has( json.hands, direction ) ) {
				var hand = this.getHand( direction );
				hand.fromJSON( json.hands[ direction ] );
			}
		};
	}
	if ( _.has( json, "auction" ) ) this.auction.fromJSON( json.auction );
};

/**
 * Something in this deal has changed.
 * Raise corresponding events.
 */
Bridge.Deal.prototype.onChange = function( operation, parameter ) {
	if ( this.triggerEvents ) {
		if ( Bridge.options.enableDebug ) console.log( "deal:changed " + operation + " - " + parameter );
		$( document ).trigger( "deal:changed",  [ this, operation, parameter ]);	
	}
};
