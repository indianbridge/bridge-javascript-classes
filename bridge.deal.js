/**
 * Defines Deal class and all methods associated with it.
 */
 
// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Deal.
 * @constructor
 * @memberof Bridge
 */
Bridge.Deal = function( id ) {
	
	/**
	 * Optional Unique id to identify this deal.
	 * @member {string}
	 */
	this.id = id || Bridge._generateID();
	
	/**
	 * The type of this object.
	 * @member {string}
	 */
	this.type = "Deal";
		
	/**
	 * The 52 card objects
	 * @member {object}
	 */
	this.cards = {};
	for( var suit in Bridge.suits ) {
		this.cards[ suit ] = {};
		for( var rank in Bridge.ranks ) {
			this.cards[ suit ][ rank ] = new Bridge.Card( suit, rank );
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
	
	/**
	 * The play associated with this deal
	 * @member {object}
	 */
	this.play = new Bridge.Play( this );
};

//
// Getters and Setters
//

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
		Bridge._reportError( board + " is not a valid board number", "In setBoard");
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
 * Set a unique id 
 * @param {string} id - a unique identifier
 */
Bridge.Deal.prototype.setID = function( id ) {
	Bridge._checkRequiredArgument( id );
	this.id = id;
};

/**
 * Get the unique id
 * @return {string} the id in string format
 */
Bridge.Deal.prototype.getID = function() {
	return this.id;
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
 * Get the play associated with this deal
 * @return {object} the play object
 */
Bridge.Deal.prototype.getPlay = function() {
	return this.play;
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
		case "id" :
			this.setID( value );
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
		case "play" :
			return this.getPlay();			
		case "id" :
			return this.getID();
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
			if ( !this.cards[ suit ][ rank ].isAssigned() ) {
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
	this.onChange( "assignRest", unassigned );
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
			case 'p' :
				this.getPlay().fromString( value );
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
	// Set up trump and leader for play
	this.getPlay().initialize();
	// Load the play after auction.
	_.each( parameters, function( value, key ) {
		switch ( key ) {
			case 'p' :
				this.getPlay().fromString( value );
				break;								
			default :
				break;
		}
	}, this);
	this.onChange( "setDeal", deal );
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
	var auctionString = this.getAuction().toString();
	if ( auctionString ) items.push ( "a=" + auctionString );	
	var playString = this.getPlay().toString();
	if ( playString ) items.push( "p=" + playString );
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
	output.auction = this.getAuction().toJSON();
	output.play = this.getPlay().toJSON();
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
	if ( _.has( json, "auction" ) ) this.getAuction().fromJSON( json.auction );
	// Set up trump and leader for play
	this.getPlay().initialize();
	if ( _.has( json, "play" ) ) this.getPlay().fromJSON( json.play );
	this.onChange( "setDeal", this.toString() );
};

/**
 * Load the deal from BBO lin representation
 * @param {string} the lin representation of deal
 */
Bridge.Deal.prototype.fromLIN = function( lin ) {
	var prefix = "In Bridge.Deal.fromLin - ";
	var tokens = lin.split( '|' );
	var directions = [ 's', 'w', 'n', 'e' ];
	for ( var i = 0; i < tokens.length; ++i ) {
		if ( _.startsWith( tokens[i].toLowerCase(), "board" ) ) {
			this.setBoard( tokens[i].trim().slice(5).trim() );
		}
		switch ( tokens[i].toLowerCase() ) {
			case "pn" :
				Bridge._checkIndex( tokens, i+1, prefix + "processing pn - " );
				var names = tokens[ i + 1 ].split( ',' );
				for ( var j = 0; j < directions.length; ++j ) {
					if ( j < names.length ) {
						var direction = directions[j];
						var name = names[j]
						if ( _.startsWith( name, "~~" ) ) name = "Robot";
						this.getHand( direction ).setName( name );
					}
				}
				break;
			case "md" :
				Bridge._checkIndex( tokens, i+1, prefix + "processing md - " );
				var hands = tokens[ i + 1 ].split( ',' );
				var directionNumbers = {
					'1' : 's',
					'2' : 'w',
					'3' : 'n',
					'4' : 'e'
				};
				var dealer = directionNumbers[ hands[0][0] ];
				this.setDealer( dealer );
				var hand = hands[0].slice(1);
				var direction = 's';
				this.getHand( direction ).setHand( hand );
				for ( var j = 1; j < hands.length; ++j ) {
					var direction = Bridge.getLHO( direction );
					var hand = hands[j]
					this.getHand( direction ).setHand( hand );
				}	
				this.assignRest();			
				break;
			case "mb" :
				Bridge._checkIndex( tokens, i+1, prefix + "processing mb - " );
				var bid = tokens[ i + 1 ].split("!")[0].slice(0,2).toLowerCase();
				if ( bid === 'd' ) bid = 'x';
				var annotation = null;
				if ( i + 2 < tokens.length && tokens[ i + 2 ].toLowerCase() === "an" ) {
					var annotation = tokens[ i + 3 ];
					annotation = annotation.replace( '(', '' );
					annotation = annotation.replace( ')', '' );
				}
				this.getAuction().addCall( bid, null, annotation );
				break;
			case "sv" :
				Bridge._checkIndex( tokens, i+1, prefix + "processing sv - " );
				var vulnerability = tokens[ i + 1 ];
				if ( vulnerability === 'o' ) vulnerability = '-';
				this.setVulnerability( vulnerability );
			default:
				break;
		}
	}
	// Set up trump and leader for play
	this.getPlay().initialize();
	// Load the play after auction.
	for ( var i = 0; i < tokens.length; ++i ) {
		if ( _.startsWith( tokens[i].toLowerCase(), "board" ) ) {
			this.setBoard( tokens[i].trim().slice(5).trim() );
		}
		switch ( tokens[i].toLowerCase() ) {
			case "pc" :
				Bridge._checkIndex( tokens, i+1, prefix + "processing pc - " );
				var play = tokens[ i + 1 ].slice(0,2);
				this.getPlay().addCard( play[0], play[1] ); 
				break;
			default:
				break;
		}
	}
	this.onChange( "setDeal", this.toString() );
};

/**
 * Something in this deal has changed.
 * Raise an event
 */
Bridge.Deal.prototype.onChange = function( operation, parameter ) {
	Bridge._triggerEvents( this, operation, parameter );
};
