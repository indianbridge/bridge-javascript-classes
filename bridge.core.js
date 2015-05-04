/**
 * Bridge Namespace
 * @namespace
 * @property {object} directions - The compass directions
 * @property {array} directionOrder - directions in order they should be presented
 * @property {object} suits - The suits of cards
 * @property {array} suitOrder - The suits in order of priority
 * @property {object} ranks - The ranks of cards
 * @property {array} rankOrder - The ranks in order of priority
 * @property {object} vulnerabilities - The list of possible vulnerabilities
 */
var Bridge = {
	directions : { 
		'n' : { name : 'North', lho: 'e', rho: 'w', cho: 's', index: 1, html: 'North' },
		'e' : { name : 'East',  lho: 's', rho: 'n', cho: 'w', index: 2, html: 'East' },
		's' : { name : 'South', lho: 'w', rho: 'e', cho: 'n', index: 3, html: 'South' },
		'w' : { name : 'West',  lho: 'n', rho: 's', cho: 'e', index: 0, html: 'West' }
	},
	directionOrder: [],

	suits : {
		's' : { name : 'Spades', index : 0, html : '<span class="suit-spades">&spades;</span>' }, 
		'h' : { name : 'Hearts', index : 1, html : '<span class="suit-hearts">&hearts;</span>' }, 
		'd' : { name : 'Diamonds', index : 2, html : '<span class="suit-diamonds">&diams;</span>' }, 
		'c' : { name : 'Clubs', index : 3, html : '<span class="suit-clubs">&clubs;</span>' }
	},
	suitOrder: [],
	
	calls : {
		'n' : { name : 'No Trump', index : 0, isStrain: true, bid: true, text: "NT", html : '<span class="suit-NT">NT</span>' }, 
		's' : { name : 'Spades', index : 1, isStrain: true, bid: true, text: "&spades;", html : '<span class="suit-spades">&spades;</span>' }, 
		'h' : { name : 'Hearts', index : 2, isStrain: true, bid: true, text: "&hearts;", html : '<span class="suit-hearts">&hearts;</span>' }, 
		'd' : { name : 'Diamonds', index : 3, isStrain: true, bid: true, text: "&diams;", html : '<span class="suit-diamonds">&diams;</span>' }, 
		'c' : { name : 'Clubs', index : 4, isStrain: true, bid: true, text: "&clubs;", html : '<span class="suit-clubs">&clubs;</span>' },	
		'p' : { name : 'Pass', index : 7, isStrain: false, bid: false, text: "P", html : '<span class="bid-pass">P</span>' }, 
		'x' : { name : 'Double', index : 6, isStrain: false, bid: false, text: "X", html : '<span class="bid-double">X</span>' }, 
		'r' : { name : 'Redouble', index : 5, isStrain: false, bid: false, text: "XX", html : '<span class="bid-redouble">XX</span>' }
	},	
	callOrder: [],

	ranks : { 
		'a' : { name : 'Ace',	index : 0, html: 'A' }, 
		'k' : { name : 'King',	index : 1, html: 'K' }, 
		'q' : { name : 'Queen',	index : 2, html: 'Q' }, 
		'j' : { name : 'Jack',	index : 3, html: 'J' }, 
		't' : { name : 'Ten',	index : 4, html: 'T' }, 
		'9' : { name : 'Nine',	index : 5, html: '9' }, 
		'8' : { name : 'Eight',	index : 6, html: '8' }, 
		'7' : { name : 'Seven',	index : 7, html: '7' }, 
		'6' : { name : 'Six',	index : 8, html: '6' }, 
		'5' : { name : 'Five',	index : 9, html: '5' }, 
		'4' : { name : 'Four',	index : 10, html: '4' }, 
		'3' : { name : 'Three',	index : 11, html: '3' }, 
		'2' : { name : 'Two',	index : 12, html: '2' }
	},
	rankOrder: [],
	
	vulnerabilities : {
		'-' : { name: 'None', index: 0, html: 'None' },
		'n' : { name: 'NS', index: 0, html: 'North-South' },
		'e' : { name: 'EW', index: 0, html: 'East-West' },
		'b' : { name: 'Both', index: 0, html: 'Both' }
	}
};

/**
 * Adds a key field to enumeration (stored as an object)
 * @param {string} list - The enumeration
 * @private
 */
Bridge._addKey = function( list ) {
	for( var item in list ) {
		list[ item ].key = item;
	}	
};

/**
 * Use the index field to create an array (from keys) in order of index
 * @param {string} list - The list to convert into array
 * @private
 */
Bridge._createIndexArray = function( list ) {
	var returnArray = [];
	for( var item in list ) {
		returnArray[ list[ item ].index ] = item;
	}
	return returnArray;
};

/**
 * Check to see if a symbol belongs to a list and throw an exception if not.
 * @param {string} element - The element whose membership is being checked
 * @param {string} list - The list whose membership is checked
 * @param {string} listName - The string name of the list whose membership is checked
 * @param {string} [context] - The context ( for example the method ) of this call
 * @private
 * @throws element does not belong to the list
 */
Bridge._checkListMembership = function( element, list, listName, context ) {
	if ( !_.has( list, element ) ) {
		var message = element + ' is not a valid ' + listName;
		Bridge._reportError( message, context );
	}	
};

/**
 * Check to see if a symbol belongs to a list and return false if not
 * @param {string} element - The element whose membership is being checked
 * @param {string} list - The list whose membership is checked
 * @private
 * @return {boolean} true is element belongs, false if not
 */
Bridge._belongsTo = function( element, list ) {
	return _.has( list, element );
};

/**
 * Check to see if a required argument is provided
 * @param {*} value - The reuired argument
 * @param {string} name - The name of the argument for printing
 * @param {string} [context] - The context ( for example the method ) of this call 
 * @private
 * @throws {Error} required value is not specified
 */
Bridge._checkRequiredArgument = function( value, name, context ) {
	if ( !value && value !== '' ) {
		Bridge._reportError( 'Required argument ' + name + ' has not been specified', context );
	}
};

Bridge._addKey( Bridge.directions );
Bridge._addKey( Bridge.suits );
Bridge._addKey( Bridge.calls );
Bridge._addKey( Bridge.ranks );
Bridge._addKey( Bridge.vulnerabilities );

Bridge.directionOrder = Bridge._createIndexArray( Bridge.directions );
Bridge.suitOrder = Bridge._createIndexArray( Bridge.suits );
Bridge.callOrder = Bridge._createIndexArray( Bridge.calls );
Bridge.rankOrder = Bridge._createIndexArray( Bridge.ranks );


/**
 * Configuration options object.
 * Use this to store all options you might use to configure stuff.
 */
Bridge.options = {
	// Should error message include context?
	useContextInErrorMessage: false,
	enableDebug: false
};


/**
 * Get the LHO of the specified direction.
 * No check is performed since it is assumed caller will check this is a valid direction.
 * @param {string} direction - the direction whose LHO is needed.
 * @return {string} the lho of specified direction
 */
Bridge.getLHO = function( direction ) { return Bridge.directions[ direction ].lho; }

/**
 * Get the LHO of the specified direction.
 * No check is performed since it is assumed caller will check this is a valid direction.
 * @param {string} direction - the direction whose LHO is needed.
 * @return {string} the lho of specified direction
 */
Bridge.getRHO = function( direction ) { return Bridge.directions[ direction ].rho; }

/**
 * Get the partner of the specified direction.
 * No check is performed since it is assumed caller will check this is a valid direction.
 * @param {string} direction - the direction whose LHO is needed.
 * @return {string} the lho of specified direction
 */
Bridge.getPartner = function( direction ) { return Bridge.directions[ direction ].cho; }

/**
 * Check if two directions are opponents.
 * No check is performed since it is assumed caller will check this is a valid direction. 
 * @param {string} direction1 - the first direction
 * @param {string} direction2 - the second direction
 * @return true if direction1 and direction2 are opponents, false otherwise
 */
Bridge.areOpponents = function( direction1, direction2 ) {
	return Bridge.getLHO( direction1 ) === direction2 || Bridge.getRHO( direction1 ) === direction2
};

/**
 * Check if two directions are partners.
 * No check is performed since it is assumed caller will check this is a valid direction. 
 * @param {string} direction1 - the first direction
 * @param {string} direction2 - the second direction
 * @return true if direction1 and direction2 are opponents, false otherwise
 */
Bridge.arePartners = function( direction1, direction2 ) {
	return Bridge.getPartner( direction1 ) === direction2;
};

/**
 * Check if call is a bid ( not pass double or redouble )
 * @param {string} suit - the suit of the call
 * @return true if it is a bid
 */
/*Bridge.isBid = function( suit ) {
	if ( !_.has( Bridge.calls, suit ) ) return false;
	return Bridge.calls[ suit ].bid;
};*/

/**
 * Check if suit is a strain ( not pass double or redouble )
 * @param {string} suit - the suit of the call
 * @return true if it is a strain
 */
Bridge.isStrain = function( suit ) {
	return _.has( Bridge.calls, suit ) && Bridge.calls[ suit ].isStrain;
};

/**
 * Convert text to a valid identifier.
 * @param {string} text - the text to make an identifier
 * @return {string} the text stripped of invalid id characters
 */
Bridge.makeIdentifier = function(text) {
  return text.trim().replace(/[^a-zA-Z0-9]+/g,'_');
}; 

/**
 * Assign a default value to variable if it is not defined.
 * @param {mixed} variable - the variable to check
 * @param {mixed} value - the default value to assign
 * @return the variable value if assigned else the default value
 */
Bridge.assignDefault = function( variable, value ) {
	if ( typeof variable === 'undefined' ) return value;
	return variable;
};

/**
 * Parse the hash in the url and return as an associative array of paramters.
 * @param {string} delimiter - any delimiter that should be stripped
 * @return {object} an associative array of parameter values
 */
Bridge.getHash = function( delimiter ) {
	return Bridge._getParameters( location.hash, '#', delimiter );
};

/**
 * Parse the query string in the url and return as an associative array of paramters.
 * @param {string} delimiter - any delimiter that should be stripped
 * @return {object} an associative array of parameter values
 */
Bridge.getQuery = function( delimiter ) {
	return Bridge._getQuery( document.URL, delimiter );
};

// This is just to test Bridge.getQuery since we dont want to change document.URL
Bridge._getQuery = function( text, delimiter ) {
	return Bridge._getParameters( text, '?', delimiter );
};

//
// Some utilities. Internal only.
//

/**
 * Parse the string and return as an associative array of parameters based on specified delimiters
 * @param {string} text - the text containing parameter values
 * @param {string} delimiter1 - the delimiter separating parameters
 * @param {string} delimiter2 - the delimiter separating parameter from value
 * @return {object} an associative array of parameter values
 */
Bridge._getParameters = function( text, delimiter1, delimiter2 ) {
	var values = text.split( delimiter1 );
	if ( values.length < 2 ) return {};
	var queryString = values[1];
	if ( delimiter2 ) {
		queryString = queryString.split( delimiter2 )[0];
	}
	return Bridge._parseParameterValues( queryString, '&', '=' );	
};

/**
 * Parse a string with parameter value entries separated by delimiters
 * into an associative array.
 * @param {string} text - the text containing parameter values
 * @param {string} delimiter1 - the delimiter separating parameters
 * @param {string} delimiter2 - the delimiter separating parameter from value
 * @return {object} an associative array of parameter value pairs
 */
Bridge._parseParameterValues = function( text, delimiter1, delimiter2 ) {
	delimiter1 = Bridge.assignDefault( delimiter1, '&' );
	delimiter2 = Bridge.assignDefault( delimiter2, '=' );
	var parameters = {};
	text = text.trim();
	if ( !text ) return parameters;
	var pairs = text.split( delimiter1 );
	for( var i = 0; i < pairs.length; ++i ) {
		var values = pairs[i].split( delimiter2 );
		if ( values.length < 2 ) parameters[ values ] = true;
		else parameters[ values[0] ] = values[1];
	}
	return parameters;
};

/**
 * Parse string to get text between delimiters.
 * @param {string} the text string to parse
 * @param {number} the position of starting delimiter
 * @param {string} the ending delimiter
 * @return associative array with contained text and position after ending delimiter
 */
Bridge._parseContainedText = function( text, start, delimiter, context ) {
	var returnValue = {};
	returnValue.position = text.indexOf( delimiter, start );
	if ( returnValue.position === -1 ) {
		Bridge._reportError( 'Ending delimiter ' + delimiter + ' not found in ' + text, context );
	}
	returnValue.text = text.slice( start+1, returnValue.position );
	return returnValue;
};


/**
 * What to do when an error is seen?
 * Default if to throw an exception.
 * @param {string} message - The error message
 * @param {string} [context] - The context ( for example the method ) of the Error
 * @throws Error with message context + message
 */
Bridge._reportError = function( message, context ) {
	if ( !Bridge.options.useContextInErrorMessage ) throw new Error( message );
	throw new Error( ( context ? context + " - " : '' ) + message );
};


//
// Checks on some parameters. Internal only.
//

/**
 * Check to see if direction is a valid direction
 * @param {string} direction - The direction to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws direction is not a valid direction
 */
Bridge._checkDirection = function( direction, context ) {
	Bridge._checkListMembership( direction, Bridge.directions, 'Direction', context );
};

/**
 * Check to see if direction is a valid direction
 * @param {string} direction - The direction to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isDirection = function( direction ) {
	return Bridge._belongsTo( direction, Bridge.directions );
};

/**
 * Check to see if suit is a valid suit
 * @param {string} suit - The suit to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws suit is not a valid suit
 */
Bridge._checkSuit = function( suit, context ) {
	Bridge._checkListMembership( suit, Bridge.suits, 'Suit', context );
};

/**
 * Check to see if suit is a valid suit
 * @param {string} suit - The suit to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isSuit = function( suit ) {
	return Bridge._belongsTo( suit, Bridge.suits );
};

/**
 * Check to see if suit of a call is a valid
 * @param {string} call - The call to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws suit is not a valid call
 */
Bridge._checkCall = function( call, context ) {
	Bridge._checkListMembership( call, Bridge.calls, 'Call', context );
};

/**
 * Check to see if suit of a call is a valid
 * @param {string} call - The call to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isCall = function( call ) {
	return Bridge._belongsTo( call, Bridge.calls );
};

/**
 * Check to see if level of a call is valid
 * @param {string} level - The level to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws level is not a valid level
 */
Bridge._checkLevel = function( level, context ) {
	var levelNum = parseInt( level );
	if ( isNaN( levelNum ) || String( levelNum ) !== String( level ) || levelNum < 1 || levelNum > 7 ) {
		Bridge._reportError( level + ' is not a valid level', context );
	}	
};

/**
 * Check to see if level of a call is valid
 * @param {string} level - The level to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isLevel = function( level ) {
	var levelNum = parseInt( level );
	if ( isNaN( levelNum ) || String( levelNum ) !== String( level ) || levelNum < 1 || levelNum > 7 ) {
		return false;
	}	
	return true;
};

/**
 * Check to see if bid is valid
 * @param {string} bid - the bid as single character or 2 characters
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws bid is not a valid bid
 */
Bridge._checkBid = function( bid, context ) {
	if ( bid.length < 1 || bid.length > 2 ) {
		Bridge._reportError( "Bid " + bid + " does not have length 1 or 2", context );
	}
	if ( bid.length === 1 ) {
		var suit = bid[0];
		Bridge._checkCall( suit, context );
		if ( Bridge.isStrain( suit ) ) {
			Bridge._reportError( "Invalid bid " + bid, context );			
		}
		return;
	}
	var level = bid[0];
	var suit = bid[1];
	Bridge._checkCall( suit, context );
	if ( !Bridge.isStrain( suit ) ) {
		Bridge._reportError( "Invalid bid " + bid, context );
	}
	Bridge._checkLevel( level, context );
};

/**
 * Check to see if bid is valid
 * @param {string} bid - the bid as single character or 2 characters
 * @return {boolean} true if valid, false if not
 */
Bridge.isBid = function( bid ) {
	if ( bid.length < 1 || bid.length > 2 ) {
		return false;
	}
	if ( bid.length === 1 ) {
		var suit = bid[0];
		return Bridge.isCall( suit ) && !Bridge.isStrain( suit );
	}
	var level = bid[0];
	var suit = bid[1];
	return Bridge.isLevel( level ) && Bridge.isCall( suit ) && Bridge.isStrain( suit );
};

/**
 * Check to see if rank is a valid rank
 * @param {string} rank - The rank to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws rank is not a valid rank
 */
Bridge._checkRank = function( rank, context ) {
	Bridge._checkListMembership( rank, Bridge.ranks, 'Rank', context );
};

/**
 * Check to see if rank is a valid rank
 * @param {string} rank - The rank to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isRank = function( rank ) {
	return Bridge._belongsTo( rank, Bridge.ranks );
};

/**
 * Check to see if vulnerability is a valid vulnerability
 * @param {string} vulnerability - The vulnerability to check
 * @param {string} [context] - The context ( for example the method ) of this call
 * @throws vulnerability is not a valid vulnerability
 */
Bridge._checkVulnerability = function( vulnerability, context ) {
	Bridge._checkListMembership( vulnerability, Bridge.vulnerabilities, 'Vulnerability', context );
};

/**
 * Check to see if vulnerability is a valid vulnerability
 * @param {string} vulnerability - The vulnerability to check
 * @return {boolean} true if valid, false if not
 */
Bridge.isVulnerability = function( vulnerability ) {
	return Bridge._belongsTo( vulnerability, Bridge.vulnerabilities );
};
