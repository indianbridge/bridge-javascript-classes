/**
 * Defines Auction class and all methods associated with it.
 */
 
// Define namespace if necessary
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Auction.
 * @constructor
 * @memberof Bridge
 * @param {object} deal - The deal that this auction belongs to.
 */
Bridge.Auction = function( deal ) {
	
	/**
	 * The deal that this play belongs to.
	 * @member {object}
	 */
	this.deal = deal;
	
	/**
	 * A unique id to identify this auction.
	 * @member {string}
	 */
	this.id = Bridge._generateID( deal );
	
	/**
	 * The type of this object.
	 * @member {string}
	 */
	this.type = "Auction";
	
	/**
	 * The dealer for this auction.
	 * @member {string}
	 */
	this.dealer = ( deal ? deal.getDealer() : "n" );
	
	/**
	 * The vulnerability for this auction.
	 * @member {string}
	 */
	this.vulnerability = ( deal ? deal.getVulnerability() : "-" );
	
	/**
	 * Who is next to call?
	 * @member {string}
	 */
	this.nextToCall = this.dealer;
	
	// these two should be in sync
	/**
	 * The calls in this auction
	 * @member {array}
	 */
	this.calls = [];	

	/**
	 * The contracts at end of corresponding call.
	 * @member {array}
	 */
	this.contracts = [];
	
	// If the bidding box uses a split level and suit then we select level first
	/**
	 * The currently selected level in bidding box.
	 * @member {object}
	 * @todo This probably does not belong in this class.
	 */
	this.selectedLevel = 0;
	
	/**
	 * The current call index when trying to step through the auction.
	 * @member {number}
	 */
	this.currentAuctionIndex = -1;
};

//
// Getters and Setters
//

/**
 * Get the direction who is next to call
 * @return {string} the direction that is next to call
 */
Bridge.Auction.prototype.getNextToCall = function() {
	return this.nextToCall;
};

/**
 * Get the dealer of this auction
 * @return {string} the dealer
 */
Bridge.Auction.prototype.getDealer = function() {
	return this.dealer;
};

/**
 * Set the dealer for this auction.
 * If calls exist then propagate the change.
 * @param {string} dealer - the new dealer
 */
Bridge.Auction.prototype.setDealer = function( dealer ) {
	Bridge._checkDirection( dealer );
	this.dealer = dealer;
	var direction = dealer;
	_.each( this.calls, function( call ) {
		call.setDirection( direction );
		direction = Bridge.getLHO( direction );
	}, this);
	this.nextToCall = direction;
	this.onChange( "setDealer", dealer );
};

/**
 * Get the vulnerability of this auction
 * @return {string} the vulnerability
 */
Bridge.Auction.prototype.getVulnerability = function() {
	return this.vulnerability;
};

/**
 * Set the vulnerability for this auction.
 * @param {string} vulnerability - the new vulnerability
 */
Bridge.Auction.prototype.setVulnerability = function( vulnerability ) {
	Bridge._checkVulnerability( vulnerability );
	this.vulnerability = vulnerability;
	this.onChange( "setVulnerability", vulnerability );
};

/**
 * Get the selected level of this auction
 * @return {number} the selected level
 */
Bridge.Auction.prototype.getSelectedLevel = function() {
	return this.selectedLevel;
};

/**
 * Set the selected level for this auction.
 * @param {number} level - the new selected level
 */
Bridge.Auction.prototype.setSelectedLevel = function( level ) {
	Bridge._checkLevel( level );
	this.selectedLevel = level;
	this.onChange( "setSelectedLevel", level );
};

/**
 * Unset the selected level
 */
Bridge.Auction.prototype.unsetSelectedLevel = function() {
	this.selectedLevel = null;
	this.onChange( "setSelectedLevel", this.selectedLevel  );
};

/**
 * Set this auction from a BBO handviewer like string
 * @param {string} auction - the auction in string format
 */
Bridge.Auction.prototype.setAuction = function( auction ) {
	Bridge._checkRequiredArgument( auction );
	this.fromString( auction );
	this.onChange( "setAuction", auction  );
};

/**
 * Get this auction in a BBO handviewer like string
 * @return {string} the auction in string format
 */
Bridge.Auction.prototype.getAuction = function() {
	return this.toString();
};

/**
 * Set the contract (and generate an auction ) from a specified contract string
 * @param {string} contract - the contract in string format
 */
Bridge.Auction.prototype.setContract = function( contract ) {
	Bridge._checkRequiredArgument( contract );
	var prefix = "In Bridge.setContract";
	var charIndex = 0; 
	if ( contract.length < charIndex + 1 ) {
		Bridge._reportError( 'Contract string ' + contract + ' does not specify level!', prefix );
	}
	var level = _.parseInt( contract[ charIndex++ ] );
	if ( contract.length < charIndex + 1 ) {
		Bridge._reportError( 'Contract string ' + contract + ' does not specify suit!', prefix );
	}	
	var suit = contract[ charIndex++ ].toLowerCase();
	Bridge._checkBid( level + suit, prefix );
	if ( !Bridge.isStrain( suit ) ) {
		Bridge._reportError( 'Contract string ' + contract + ' does not specify a valid suit!', prefix );			
	}
	var doubled = false;
	var redoubled = false;
	if ( contract.length > charIndex && contract[ charIndex ].toLowerCase() === 'x' ) {
		doubled = true;
		charIndex++;
		if ( contract.length > charIndex && contract[ charIndex ].toLowerCase() === 'x' ) {
			redoubled = true;
			charIndex++;
		}
	}
	if ( contract.length < charIndex + 1 ) {
		Bridge._reportError( 'Contract string ' + contract + ' does not specify declarer!', prefix );
	}	
	var declarer = contract[ charIndex ].toLowerCase();
	Bridge._checkDirection( declarer );
	this.clearCalls();
	while( this.nextToCall !== declarer ) {
		this.addCall( 'p' );
	}
	this.addCall( level + suit );
	if ( doubled ) this.addCall( 'x' );
	if ( redoubled ) this.addCall( 'r' );
	this.addCall( 'p' );
	this.addCall( 'p' );
	this.addCall( 'p' );
	this.onChange( "setContract", contract  );
	this.onChange( "setAuction", this.getAuction()  );
};	

/**
 * Get the final or latest contract
 * @return {object} the contract
 */
Bridge.Auction.prototype.getContract = function() {
	var numCalls = this.calls.length;
	if ( numCalls === 0 ) return new Bridge.Contract();
	return this.contracts[ numCalls - 1 ];
};

/**
 * Set a unique id 
 * @param {string} id - a unique identifier
 */
Bridge.Auction.prototype.setID = function( id ) {
	Bridge._checkRequiredArgument( id );
	this.id = id;
};

/**
 * Get the unique id
 * @return {string} the id in string format
 */
Bridge.Auction.prototype.getID = function() {
	return this.id;
};


/**
 * Get a property in this auction.
 * The properties that can be got are as follows<br/>
 * dealer - character [ n e s w ] - the dealer for this auction<br/>
 * vulnerability - character [ - n e b ] - the vulnerability for this deal<br/>
 * level - number between 1 and 7 the selected level
 * contract - string - a prespecified contract <br/>
 * auction - string - the auction as a string <br/>
 * @param {string} property - the property to set<br/>
 * @return {mixed} the value of requested property
 * @throws unknown property
 */
Bridge.Auction.prototype.get = function( property ) {
	var prefix = 'In Auction.get';
	Bridge._checkRequiredArgument( property, 'Property', prefix );
	switch ( property ) {
		case 'dealer' :
			return this.getDealer();
			break;
		case 'vulnerability' :
			return this.getVulnerability();
			break;	
		case "level" :
			return this.getSelectedLevel();
			break;
		case 'contract' :
			return this.getContract();
			break;
		case 'auction' :
			return this.getAuction();
			break;		
		case 'id' :
			return this.getID();
			break;
		default :
			Bridge._reportError( 'Unknown deal property ' + property, prefix );
	}
};

/**
 * Set a property in this auction.
 * The properties that can be set are as follows<br/>
 * dealer - character [ n e s w ] - the dealer for this auction<br/>
 * level - number between 1 and 7 the selected level 
 * vulnerability - character [ - n e b ] - the vulnerability for this deal<br/>
 * contract - string - a prespecified contract <br/>
 * auction - string - the auction as a string <br/>
 * @param {string} property - the property to set<br/>
 * @param {string} value - the value to set the property to
 * @return {boolean} true if property was set, false otherwise
 * @throws unknown property
 */
Bridge.Auction.prototype.set = function( property, value ) {
	var prefix = 'In Auction.set';
	Bridge._checkRequiredArgument( property, 'Property', prefix );
	Bridge._checkRequiredArgument( value, 'Value for Property ' + property, prefix );
	switch ( property ) {
		case 'dealer' :
			this.setDealer( value );
			break;
		case 'vulnerability' :
			this.setVulnerability( value );
			break;
		case "level" :
			this.setSelectedLevel( value );
		case 'contract' :
			this.setContract( value  );
			break;
		case 'auction' :
			this.setAuction( value );
			break;
		case 'id' :
			this.setID( value );
			break;
		default :
			Bridge._reportError( 'Unknown deal property ' + property, prefix );
	}
};

/**
 * Add a call to the auction.
 * @param {string} call - The call as a single character (p, x, r) or as two characters
 * representing level and suit.
 * @param {string} [explanation] - optional explanation for this call
 * @param {string} [annotation] - optional annotation for this call
 */
Bridge.Auction.prototype.addCall = function( call, explanation, annotation ) {
	var prefix = 'In Auction.addCall';
	call = call.toLowerCase();
	Bridge._checkBid( call, prefix );
	var call = new Bridge.Call( call, this.nextToCall );
	if ( annotation ) call.setAnnotation( annotation );
	if ( explanation ) call.setExplanation( explanation );
	if ( this.calls.length === 0 ) var contract = new Bridge.Contract();
	else {
		var contract = this.getContract().clone();
	}
	contract.update( call );
	this.calls.push( call );
	this.contracts.push( contract );
	this.nextToCall = Bridge.getLHO( this.nextToCall );
	this.selectedLevel = 0;
	this.onChange( "addCall", {
		"call": call,
		"contract": this.getContract()
	});
	if ( this.getContract().isComplete ) {
		this.onChange( "auctionComplete", {
			"call": call,
			"contract": this.getContract()
		});
	}
};

/**
 * Add passes to complete the auction
 */
Bridge.Auction.prototype.addAllPass = function() {
	while( !this.getContract().isComplete ) {
		this.addCall( 'p' );
	}
};

/**
 * Clear all calls in this auction
 */
Bridge.Auction.prototype.clearCalls = function() {
	while ( this.calls.length > 0 ) this.removeCall();
};

/**
 * Removes the last call from the auction.
 */
Bridge.Auction.prototype.removeCall = function() {
	if ( this.calls.length > 0 ) {
		var call = this.calls[ this.calls.length - 1 ];
		this.calls.pop();
		this.contracts.pop();
		this.nextToCall = Bridge.getRHO( this.nextToCall );
		this.selectedLevel = 0;
		this.onChange( "removeCall", call.getCall() );
	}
};

/**
 * Advances the auction till the specified index
 * @param {number} index - The call number to advance to.
 */
Bridge.Auction.prototype.advanceAuctionTillIndex_ = function( index ) {
	var prefix = "In Bridge.Auction.advanceAuctionTillIndex_";
	if ( index < 0 || index >= this.calls.length ) {
		Bridge._reportError( "Cannot advance because specified call number " + index + " is invalid", prefix );
	}
	if ( this.currentAuctionIndex >= index ) {
		Bridge._reportError( "Cannot advance because current call number is at or greater than specified call number " + index, prefix );
	}
	while ( this.currentAuctionIndex < index ) {
		this.currentAuctionIndex++;
		var call = this.calls[ this.currentAuctionIndex ];
		
		// Trigger events if enabled
		this.onChange( "advanceAuction", call );
	}
	this.onChange( "advanceAuctionCompleted", call );
};

/**
 * Advance the auction by one call
 */
Bridge.Auction.prototype.advanceAuction = function() {
	this.advanceAuctionTillIndex_( this.currentAuctionIndex + 1 );
};


/**
 * Advance the auction to the end.
 */
Bridge.Auction.prototype.advanceAuctionAll = function() {
	var index = this.calls.length - 1;
	this.advanceAuctionTillIndex_( index );
};

/**
 * Rewind the auction till the specified index.
 * @param {number} index - The play number to rewind to.
 */
Bridge.Auction.prototype.rewindAuctionTillIndex_ = function( index ) {
	var prefix = "In Bridge.Auction.rewindAuctionTillIndex_";
	if ( index < -1 || index >= this.calls.length - 1 ) {
		Bridge._reportError( "Cannot rewind because specified call number " + index + " is invalid", prefix );
	}
	if ( this.currentAuctionIndex <= index ) {
		Bridge._reportError( "Cannot rewind because current call number is at or lesser than specified call number " + index, prefix );
	}
	while ( this.currentAuctionIndex > index ) {
		var call = this.calls[ this.currentAuctionIndex ];
		this.currentAuctionIndex--;
		
		// Trigger events if enabled
		this.onChange( "rewindAuction", call );
	}
	this.onChange( "rewindAuctionCompleted", call );
};

/**
 * Rewind the auction by one call.
 */
Bridge.Auction.prototype.rewindAuction = function() {
	this.rewindAuctionTillIndex_( this.currentAuctionIndex - 1 );
};

/**
 * Rewind the auction to the start.
 */
Bridge.Auction.prototype.rewindAuctionAll = function() {
	var index = -1;
	this.rewindAuctionTillIndex_( index );
};
Bridge.Auction.prototype.rewind = Bridge.Auction.prototype.rewindAuctionAll;



/**
 * Load the auction from a string format of auction
 * @param {string} auction - the auction in string format
 */
Bridge.Auction.prototype.fromString = function ( auction ) {
	this.clearCalls();
	var prefix = 'In Auction.fromString';
	var charIndex = 0;
	while( charIndex < auction.length ) {
		var nextChar = auction[ charIndex++ ].toLowerCase();
		if ( nextChar === 'd' ) nextChar = 'x';
		if ( _.has( Bridge.calls, nextChar ) && !Bridge.isStrain( nextChar ) ) {
			var call = nextChar;
		}
		else {
			var call = nextChar + auction[ charIndex++ ].toLowerCase();
		}
		var explanation = null;
		var annotation = null;
		while( charIndex < auction.length && ( auction[ charIndex ] === '(' || auction[ charIndex ] === '{' ) ) {
			if ( auction[ charIndex ] === '(' ) {
				var endChar = ')';
				var returnValue = Bridge._parseContainedText( auction, charIndex, endChar, prefix );
				explanation = returnValue.text;
			}
			else {
				var endChar = '}';
				var returnValue = Bridge._parseContainedText( auction, charIndex, endChar, prefix );		
				annotation = returnValue.text;
			}
			charIndex = returnValue.position + 1;
		}
		this.addCall( call, explanation, annotation );
	}
};

/**
 * Load auction from a json representation of this auction.
 * json is just a string
 * @param {object} json - json representation of this auction.
 */
Bridge.Auction.prototype.fromJSON = function(json) {
	return this.fromString( json );
};

/**
 * Generate a string display of this auction.
 * @return {string} string representation of this auction.
 */
Bridge.Auction.prototype.toString = function( ) {
	var output = '';
	for( var i = 0; i < this.calls.length; ++i ) {
		output += this.calls[i].toString();
	}
	return output;
};

/**
 * Generate a json representation of this auction.
 * This is just the string represntation
 * @return {object} json representation of this auction.
 */
Bridge.Auction.prototype.toJSON = function( ) {
	return this.toString();
};

/**
 * Something in this auction has changed.
 * Raise an event
 */
Bridge.Auction.prototype.onChange = function( operation, parameter ) {
	Bridge._triggerEvents( this, operation, parameter );
};

