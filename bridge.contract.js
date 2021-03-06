/**
 * Defines Contract class and all methods associated with it.
 */

// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Contract.
 * @constructor
 * @memberof Bridge
 * @param {number} level - The level of the contract
 * @param {string} suit - the suit of the contract
 * @param {string} direction - the direction making this bid
 */
Bridge.Contract = function() {
	this.level = null;
	this.suit = null;
	this.doubled = false;
	this.redoubled = false;
	this.declarer = null;
	this.firstToBid =  {};
	for( var call in Bridge.calls ) {
		if ( Bridge.isStrain( call ) ) {
			this.firstToBid[ call ] = {};
			for ( var direction in Bridge.directions) {
				this.firstToBid[ call ][ direction ] = null;
			}
		}
	}
	this.numPasses = 0;
	this.isComplete = false;
};

Bridge.Contract.prototype.rotateClockwise = function() {
  if (this.getDeclarer()) {
    this.declarer = Bridge.getLHO(this.getDeclarer());
  }
  for( var call in Bridge.calls ) {
		if ( Bridge.isStrain( call ) ) {
			for ( var direction in Bridge.directions) {
        if (this.firstToBid[ call ][ direction ]) {
          this.firstToBid[ call ][ direction ] = Bridge.getLHO(this.firstToBid[ call ][ direction ]);
        }
				this.firstToBid[ call ][ direction ] = null;
			}
		}
	}
};


/**
 * Get the suit of this contract
 * @return {string} the suit
 */
Bridge.Contract.prototype.getSuit = function() {
	return this.suit;
};

/**
 * Get the declarer of this contract
 * @return {string} the declarer
 */
Bridge.Contract.prototype.getDeclarer = function() {
	return this.declarer;
};


/**
 * Get the leader is this becomes contract
 * @return {string} the leader
 */
Bridge.Contract.prototype.getLeader = function() {
	return Bridge.getLHO( this.declarer );
};

/**
 * Determine what bids are allowed next for specified direction.
 * @param {string} direction the direction whose bids are being checked
 * @return {object} parameters indicating what bids are allowed
 * @private
 */
Bridge.Contract.prototype.allowedCalls = function( direction ) {
	Bridge._checkDirection( direction );
	var output = {};
	output[ "p" ] = !this.isComplete;
	output[ "ap" ] = output[ "p" ];
	output[ "x" ] = false;
	output[ "r" ] = false
	for( var i = 1; i <= 7; ++i ) {
		for( var call in Bridge.calls ) {
			if ( Bridge.isStrain( call ) ) {
				output[ i + call ] = ( !this.isComplete );
			}
		}
	}
	output[ "u" ] = ( ! ( this.suit === null && this.numPasses === 0 ) );
	output[ "minimum_level" ] = 8;
	if ( this.suit === null || this.isComplete ) {
		if ( !this.isComplete ) output[ "minimum_level" ] = 1;
		return output;
	}

	for( var i = 1; i <= 7; ++i ) {
		for( var call in Bridge.calls ) {
			if ( Bridge.isStrain( call ) ) {
				if ( i > this.level || ( i === this.level && Bridge.calls[ call ].index < Bridge.calls[ this.suit ].index ) ) {
					output[ i + call ] = true;
					if ( i < output[ "minimum_level" ] ) output[ "minimum_level" ] = i;
				}
				else {
					output[ i + call ] = false;
				}
			}
		}
	}
	output[ "p" ] = true;
	output[ "x" ] = !this.doubled && !this.redoubled && Bridge.areOpponents( direction, this.declarer );
	output[ "r" ] = this.doubled && !this.redoubled && !Bridge.areOpponents( direction, this.declarer );
	return output
};

/**
 * Make a clone of this contract.
 * @return a clone of the contract.
 */
Bridge.Contract.prototype.clone = function() {
	var contract = new Bridge.Contract();
	var fields = [ 'level', 'suit', 'doubled', 'redoubled', 'declarer', 'numPasses', 'isComplete' ];
	_.each( fields, function( field ) {
		contract[ field ] = this[ field ];
	}, this);
	contract.firstToBid = _.cloneDeep( this.firstToBid );
	return contract;
};

/**
 * Update contract after a call.
 * @param {string} call - the call to use to update contract
 */
Bridge.Contract.prototype.update = function( call ) {
	if ( this.isComplete ) {
		Bridge._reportError( 'Auction is already complete. Cannot make another call' );
	}
	var level = call.getLevel();
	var suit = call.getSuit();
	var direction = call.getDirection();
	switch ( suit ) {
		case 'p':
			this.numPasses++;
			if ( ( this.declarer && this.numPasses === 3 ) || this.numPasses === 4 ) {
				this.isComplete = true;
			}
			break;
		case 'x':
			if ( !this.declarer || !Bridge.areOpponents( this.declarer, direction ) || this.redoubled || this.doubled ) {
				Bridge._reportError( 'Double is not allowed at this point in the auction' );
			}
			this.doubled = true;
			this.numPasses = 0;
			break;
		case 'r':
			if ( !this.doubled || Bridge.areOpponents( this.declarer, direction ) || this.redoubled ) {
				Bridge._reportError( 'ReDouble is not allowed at this point in the auction' );
			}
			this.redoubled = true;
			this.numPasses = 0;
			break;
		default:

			if ( level < this.level || ( level === this.level && Bridge.calls[ suit ].index >= Bridge.calls[ this.suit ].index ) ) {
				Bridge._reportError( call.toString() + ' is not allowed at this point in the auction' );
			}
			this.doubled = false;
			this.redoubled = false;
			this.numPasses = 0;
			if ( !this.firstToBid[ suit ][ direction ] ) {
				this.firstToBid[ suit ][ direction ] = direction;
				this.firstToBid[ suit ][ Bridge.getPartner( direction ) ] = direction;
			}
			this.declarer = this.firstToBid[ suit ][ direction ];
			this.suit = suit;
			this.level = level;
			break;
	}

};

/**
 * Generate a string display of this contract.
 * @return {string} string representation of this contract.
 */
Bridge.Contract.prototype.toString = function() {
	var output = "";
	if ( this.level ) {
		output += this.level;
		output += this.suit;
		if ( this.redoubled ) output += "xx";
		else if ( this.doubled ) output += "x";
		output += this.declarer;
	}
	return output;
};
