// Use the handviewer parameters to load deal
Bridge.Deal.prototype.importFromHandviewer = function( parameters ) {
	var q = parameters;
	var numHands = 0;
	var numCardsAssigned = 0;
	for ( var parameter in q ) {
		switch ( parameter ) {
			// The hands
			case 'n' :
			case 'e' :
			case 's' :
			case 'w' :
				numCardsAssigned += this.assignHand( parameter, q[ parameter ] );
				numHands++;
				break;
				
			// The names
			case 'nn' :
			case 'en' :
			case 'sn' :
			case 'wn' :
				this.setName( parameter[0], q[ parameter ] );
				break;
				
			// Deal information
			case 'b' :
				this.setBoard( q[ parameter ] );
				break;
			case 'd' :
				this.setDealer( q[ parameter ] );
				break;
			case 'v' :
				this.setVulnerability( q[ parameter ] );
				
			default :
				break;
		}	
	}
	if ( numHands === 3 && numCardsAssigned === 39 ) this.assignRest();
	// Auction and play after rest have been parsed
	for ( var parameter in q ) {
		if ( parameter.charAt(0) === 'a' ) {
			var auctionName = ( parameter.length === 1 ) ? 'default' : parameter.slice(1);
			this.auctions[ auctionName ] = this._parseAuctionString( auctionName, q[ parameter ] );
		}
		else if ( parameter.charAt(0) === 'a' ) {
			var playName = ( parameter.length === 1 ) ? 'default' : parameter.slice(1);
			this.plays[ playName ] = this._parsePlayString( playName, q[ parameter ] );
		}
	}	
};

// Read the query parameters
Bridge._readQueryParameters = function( splitCharacter ) {
	splitCharacter = Bridge.getDefault( splitCharacter, '?' );
	var otherCharacter = ( splitCharacter === '?' ? '#' : '?' );
	
	var vars = {};
	var hash;
	// Retrieve the part after the ? in url
	var url = document.URL;
	var splitCharacterIndex = url.indexOf( splitCharacter );
	if ( splitCharacterIndex === -1 || splitCharacterIndex === url.length - 1 ) return vars;
	var q = url.slice( splitCharacterIndex + 1 );
	if( q !== undefined && q !== null && q ){
		// Remove the part after # if it exists
		q = q.split( otherCharacter )[0];
		
		// trim the string
		q = q.trim();
		if ( q ) {		
			// Get all the different components
			q = q.split('&');
			for(var i = 0; i < q.length; i++){
				hash = q[i].split('=');
				if ( hash.length < 2 ) hash[1] = '';
				vars[hash[0]] = hash[1];
			}
		}
	}
	return vars;
};

Bridge.Hand.prototype.getName = function() {
	if ( this.name ) return this.direction + 'n=' + this.name;
	else return null;
};

Bridge.Hand.prototype.getHand = function() {
	var outputString = Bridge.Direction.toString( this.direction ) + '=';
	for ( var i = 0; i < Bridge.SuitOrder.length; ++i ) {
		var suit = Bridge.SuitOrder[ i ];
		var cardString = ''
		var numCards = 0;
		for ( var j = 0; j < Bridge.RankOrder.length; ++j ) {
			var rank = Bridge.RankOrder[ j ];
			if ( this.cards[ suit ].hasOwnProperty( rank ) && this.cards[ suit ][ rank ] ) {
				cardString += rank;
				numCards++;
			}
		}
		if ( numCards !== 0 ) {
			outputString += suit + cardString;
		}
	};
	if ( outputString )	return this.direction + '=' + outputString;
};


Bridge.Deal.prototype._parseAuctionString = function( auctionName, auctionString ) {
	contractString = auctionString.toLowerCase();
	if ( contractString.charAt(0) !== '-' ) {
		var auction = new Bridge.Auction( auctionName, this.dealer );
		for( var i = 0;i < contractString.length; ++i ) {
			var prefix = 'In auction specified at position ' + (i+1) + ' - ';							
			var currentChar = contractString.charAt( i );
			var level = 1;
			var suit = '';
			var annotation = null, explanation = null;			
			if ( currentChar === 'd' || currentChar === 'x'  ) {
				suit = 'x';
			}
			else if ( currentChar === 'p' || currentChar === 'r' ) {
				suit = currentChar;
			}
			else {
				// First should be number
				level = parseInt( currentChar );
				i++;
				suit = contractString.charAt( i );
			}
			// Check if there is an explanation or ignore annotation
			var nextChar = contractString.charAt( i + 1 );
			var endChar = '';
			var value = '';
			if ( nextChar === '('  || nextChar === '{' ) {  
				endChar = nextChar === '(' ? ')' : '}';
				value = Bridge._parseAnnotation( auctionString, i + 1, endChar );
				if ( ! value ) {
					throw prefix + ' No closing ) found!';	
				}
				if ( nextChar === '(' ) {	
					explanation = value.annotation;
				}
				else {
					annotation = value.annotation;
				}
				i = value.endBracePosition;			
			}
			// Check if there is an explanation or ignore annotation
			nextChar = contractString.charAt( i + 1 );
			if ( nextChar === '('  || nextChar === '{' ) {  
				endChar = nextChar === '(' ? ')' : '}';
				value = Bridge._parseAnnotation( auctionString, i + 1, endChar );
				if ( ! value ) {
					throw prefix + ' No closing ) found!' ;	
				}
				if ( nextChar === '(' ) {	
					explanation = value.annotation;
				}
				else {
					annotation = value.annotation;
				}
				i = value.endBracePosition;			
			}		
			auction.addBid( level, suit, explanation, annotation );
		}
		return auction;
	}
	else {
		return this._parseContractString( auctionName, auctionString );
	}
	return null;	
	
};

// Parse an annotation or explanation
Bridge._parseAnnotation = function( originalString, startBracePosition, endBraceCharacter ) {
	if ( endBraceCharacter === undefined ) endBraceCharacter = '}';
	var endBracePosition = originalString.indexOf( endBraceCharacter, startBracePosition + 1 );
	if ( endBracePosition === -1 ) {
		return null;
	}
	var annotation = originalString.slice( startBracePosition + 1, endBracePosition );
	return {
		annotation: annotation,
		endBracePosition: endBracePosition
	};
};


Bridge.Deal.prototype._parseContractString = function( auctionName, auctionString) {
	var auction = new Bridge.Auction( auctionName, this.dealer );
	var contractString = auctionString.toLowerCase();
	var trumpSuit, doubled, redoubled, declarer;
	var level = parseInt( contractString.charAt(1) );
	if ( isNaN( level ) ) {
		trumpSuit = contractString.charAt(1);	
		doubled = false;
		redoubled = false;
		var leader = contractString.charAt(2);
		if ( leader === 'd' || leader === 'x' || leader === 'r' ) {
			redoubled = ( leader === 'r' );
			doubled = !redoubled;
			leader = contractString.charAt(3);
		}
		declarer = Bridge.getRHO( leader );
		level = 1;			
	}
	else {
		trumpSuit = contractString.charAt(2);
		declarer = contractString.charAt(3);
		doubled = false;
		redoubled = false;	
		if ( declarer === 'd' || declarer === 'x' || declarer === 'r' ) {
			redoubled = ( declarer === 'r' );
			doubled = !redoubled;
			declarer = contractString.charAt(4);
		}			
	}
	var currentBidder = this.dealer;
	while ( currentBidder !== declarer ) {
		auction.addBid( 1, 'p' );
		currentBidder = Bridge.Directions[ currentBidder ].lho;
	}
	auction.addBid( level, trumpSuit );
	if ( doubled ) {
		auction.addBid( level, 'x' );
	}
	else if ( redoubled ) {
		auction.addBid( level, 'x' );
		auction.addBid( level, 'r' );
	}
	auction.addBid( level, 'p' );
	auction.addBid( level, 'p' );
	auction.addBid( level, 'p' );
	return auction;
};