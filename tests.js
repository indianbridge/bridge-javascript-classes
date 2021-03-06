QUnit.module( 'Bridge' );
QUnit.test( 'Directions', function( assert ) {
	Bridge.checkDirection( 'n' );
	Bridge.checkDirection( 'e' );
	Bridge.checkDirection( 's' );
	Bridge.checkDirection( 'w' );
	assert.throws(
		function() {
			Bridge.checkDirection();
		},
		'No Direction specified should throw exception'
	);
	
	assert.throws(
		function() {
			Bridge.checkDirection(null);
		},
		'Null Direction specified should throw exception'
	);	

	var Direction;
	assert.throws(
		function() {
			Bridge.checkDirection( Direction );
		},
		'undefined Direction specified should throw exception'
	);	

	assert.throws(
		function() {
			Bridge.checkDirection( 'a' );
		},
		'Bad Direction specified should throw exception'
	);	
});

QUnit.test( 'Suits', function( assert ) {
	Bridge.checkSuit( 's' );
	Bridge.checkSuit( 'h' );
	Bridge.checkSuit( 'd' );
	Bridge.checkSuit( 'c' );
	assert.throws(
		function() {
			Bridge.checkSuit();
		},
		'No suit specified should throw exception'
	);
	
	assert.throws(
		function() {
			Bridge.checkSuit(null);
		},
		'Null suit specified should throw exception'
	);	

	var suit;
	assert.throws(
		function() {
			Bridge.checkSuit( suit );
		},
		'undefined suit specified should throw exception'
	);	

	assert.throws(
		function() {
			Bridge.checkSuit( 'n' );
		},
		'Bad suit specified should throw exception'
	);	
});

QUnit.test( 'Ranks', function( assert ) {
	Bridge.checkRank( 'a' );
	Bridge.checkRank( 'k' );
	Bridge.checkRank( 'q' );
	Bridge.checkRank( 'j' );
	Bridge.checkRank( 't' );
	Bridge.checkRank( '9' );
	Bridge.checkRank( '8' );
	Bridge.checkRank( '7' );	
	Bridge.checkRank( '6' );
	Bridge.checkRank( '5' );
	Bridge.checkRank( '4' );
	Bridge.checkRank( '3' );
	Bridge.checkRank( '2' );	
	assert.throws(
		function() {
			Bridge.checkRank();
		},
		'No Rank specified should throw exception'
	);
	
	assert.throws(
		function() {
			Bridge.checkRank(null);
		},
		'Null Rank specified should throw exception'
	);	

	var Rank;
	assert.throws(
		function() {
			Bridge.checkRank( Rank );
		},
		'undefined Rank specified should throw exception'
	);	

	assert.throws(
		function() {
			Bridge.checkRank( 'n' );
		},
		'Bad Rank specified should throw exception'
	);	
});

QUnit.test( 'Vulnerabilities', function( assert ) {
	Bridge.checkVulnerability( '-' );
	Bridge.checkVulnerability( 'n' );
	Bridge.checkVulnerability( 'e' );
	Bridge.checkVulnerability( 'b' );
	assert.throws(
		function() {
			Bridge.checkVulnerability();
		},
		'No Vulnerability specified should throw exception'
	);
	
	assert.throws(
		function() {
			Bridge.checkVulnerability(null);
		},
		'Null Vulnerability specified should throw exception'
	);	

	var Vulnerability;
	assert.throws(
		function() {
			Bridge.checkVulnerability( Vulnerability );
		},
		'undefined Vulnerability specified should throw exception'
	);	

	assert.throws(
		function() {
			Bridge.checkVulnerability( 'a' );
		},
		'Bad Vulnerability specified should throw exception'
	);	
});

QUnit.module( 'Bridge.Hand' );
QUnit.test( 'Constructor', function( assert ) {
	var direction = 'n';
	var hand = new Bridge.Hand( direction );
	// All default values
	assert.deepEqual( hand.direction, direction, 'Direction matches passed argument' );
	assert.deepEqual( hand.name, Bridge.directions[ direction ].name, 'Name match name of passed direction' );
	 var cards = {};
	 for( var suit in Bridge.suits ) {
	 	cards[ suit ] = {};
	 }		
	 assert.deepEqual( hand.cards, cards, 'Hand has suits but no cards in any suit initially' );
	 assert.deepEqual( hand.numCards, 0, 'No cards initially' );

	var direction = 'n';
	assert.throws(
		function() {
			var hand = new Bridge.Hand( );
		},
		'Bridge.Hand constructor needs direction argument'
	);
	var direction = 'n';
	assert.throws(
		function() {
			var hand = new Bridge.Hand( 'a' );
		},
		'Bridge.Hand constructor needs valid direction argument'
	);	
});

QUnit.test( 'Set and Get', function( assert ) {
	var direction = 'n';
	var hand = new Bridge.Hand( direction );
	var name = 'Sriram';
	assert.throws(
		function() {
			hand.set();
		},
		'Bridge.Hand.set needs property argument'
	);
	assert.throws(
		function() {
			hand.set( 'random_property' );
		},
		'Bridge.Hand.set needs a known property argument'
	);	
	assert.throws(
		function() {
			hand.set( 'name' );
		},
		'Bridge.Hand.set needs a value argument'
	);			
	hand.set( 'name', name );
	assert.deepEqual( hand.name, name, 'Name match passed name' );
	assert.throws(
		function() {
			hand.get();
		},
		'Bridge.Hand.get needs property argument'
	);	
	assert.throws(
		function() {
			hand.get( 'random_property' );
		},
		'Bridge.Hand.get needs a known property argument'
	);	
	assert.deepEqual( hand.get( 'name' ), name, 'Name matches passed name' );	
	assert.deepEqual( hand.get( 'name' ), hand.name, 'Get retrieves the correct name' );	
	assert.deepEqual( hand.get( 'count' ), 0, 'Num cards should be 0' );
	assert.deepEqual( hand.get( 'count' ), hand.numCards, 'Get retrieves num cards' );	
});

QUnit.test( 'Add and Remove Cards', function( assert ) {
	var direction = 'n';
	var hand = new Bridge.Hand( direction );
	var suit = 's';
	var rank = 'a';
	// Hand should not have any cards
	assert.ok( !hand._hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 0, direction + ' hand has 0 cards initially' );
	
	// Add invalid cards
	assert.throws(
		function() {
			hand.addCard();
		},
		'Bridge.Hand.addCard needs suit'
	);	
	assert.throws(
		function() {
			hand.addCard( suit );
		},
		'Bridge.Hand.addCard needs rank'
	);
	
	// Add a card	
	assert.ok( hand.addCard( suit, rank ), suit + rank + ' added to ' + direction );
	assert.ok( hand._hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );	
	
	// Try to add same card
	assert.ok( !hand.addCard( suit, rank ), suit + rank + ' already added to ' + direction );
	assert.ok( hand._hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );
	
	// Add another card		
	suit = 'c';
	rank = '2';
	assert.ok( hand.addCard( suit, rank ), suit + rank + ' added to ' + direction );
	assert.ok( hand._hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 2, direction + ' hand now has 2 cards' );	
	
	// remove a card
	assert.ok( hand.removeCard( suit, rank ), suit + rank + ' removed from ' + direction );
	assert.ok( !hand._hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );	
	
	// remove same card	
	assert.ok( !hand.removeCard( suit, rank ), suit + rank + ' already removed from ' + direction );
	assert.ok( !hand._hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );
	
	// remove other card
	suit = 's';
	rank = 'a';
	assert.ok( hand._hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
	assert.ok( hand.removeCard( suit, rank ), suit + rank + ' removed from ' + direction );
	assert.ok( !hand._hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( hand.get( 'count' ), 0, direction + ' hand now has 0 cards' );	
	
	// Add 13 cards
	suit = 's';
	for( var rank in Bridge.ranks ) {
		hand.addCard( suit, rank );
	}	
	assert.deepEqual( hand.get( 'count' ), 13, direction + ' hand now has 13 cards' );
	// add one more	
	suit = 'c';
	rank = '2';	
	assert.throws(
		function() {
			hand.addCard( suit, rank );
		},
		'Adding more than 13 cards'
	);
});

QUnit.module( 'Bridge.Deal' );
QUnit.test( 'Constructor', function( assert ) {
	var deal = new Bridge.Deal();
	for ( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.deepEqual( deal.cardAssignedTo[ suit ][ rank ], null, 'None of the cards are assigned' );
		}
	}	
	assert.deepEqual( deal.board, null, 'board is null' );
	assert.deepEqual( deal.dealer, null, 'dealer is null' );
	assert.deepEqual( deal.vulnerability, null, 'vulnerability is null' );
	assert.deepEqual( deal.notes, null, 'notes is null' );

	
});

QUnit.test( 'Set and Get', function( assert ) {
	var deal = new Bridge.Deal();
	assert.throws(
		function() {
			deal.set();
		},
		'Bridge.Deal.set needs property argument'
	);
	assert.throws(
		function() {
			deal.set( 'random_property' );
		},
		'Bridge.Deal.set needs a known property argument'
	);
	assert.throws(
		function() {
			deal.set( 'name' );
		},
		'Bridge.Deal.set needs a value argument'
	);	
	// get
	assert.throws(
		function() {
			hand.get();
		},
		'Bridge.Deal.get needs property argument'
	);	
	assert.throws(
		function() {
			hand.get( 'random_property' );
		},
		'Bridge.Deal.get needs a known property argument'
	);
		
	// Board
	deal.set( 'board', 1 );		
	assert.deepEqual( deal.board, 1, 'board number is 1' );
	assert.deepEqual( deal.board, deal.get( 'board' ), 'board number is 1' );
	deal.set( 'board', '1' );		
	assert.deepEqual( deal.board, 1, 'board number is 1' );
	assert.deepEqual( deal.board, deal.get( 'board' ), 'board number is 1' );	
	assert.throws(
		function() {
			deal.set( 'board', 0 );
		},
		'Board Number cannot be less than 1'
	);	
	assert.throws(
		function() {
			deal.set( 'board', 'nan' );
		},
		'Board Number has to be a number'
	);	
	
	assert.throws(
		function() {
			deal.set( 'board', 2.5 );
		},
		'Board Number has to be a integer'
	);	
	
	// Vulnerability
	for( var vul in Bridge.vulnerabilities ) {
		deal.set( 'vulnerability' , vul );
		assert.deepEqual( deal.vulnerability, vul, 'vulnerability as set' );
		assert.deepEqual( deal.vulnerability, deal.get( 'vulnerability' ), 'vulnerability as set' );			
	}	
	assert.throws(
		function() {
			deal.set( 'vulnerability', 'o' );
		},
		'vulnerability has to be one of -,n,e,b'
	);	
	
	// Dealer
	for( var d in Bridge.directions ) {
		deal.set( 'dealer' , d );
		assert.deepEqual( deal.dealer, d, 'dealer as set' );
		assert.deepEqual( deal.dealer, deal.get( 'dealer' ), 'dealer as set' );			
	}	
	assert.throws(
		function() {
			deal.set( 'dealer', 'o' );
		},
		'dealer has to be one of n,e,s,w'
	);	
	
	// notes
	var notes = 'Anything Goes here';
	deal.set( 'notes', notes );	
	assert.deepEqual( deal.notes, notes, 'notes as set' );
	assert.deepEqual( deal.notes, deal.get( 'notes' ), 'notes as set' );	
	
	// names
	var name = 'Sriram';
	var dir = 'n';
	assert.throws(
		function() {
			deal.set( 'name', name );
		},
		'Setting name needs a direction'
	);	
	deal.set( 'name', name, dir );
	assert.deepEqual( deal.get( 'name', dir ), name, 'name as set' );		
	deal = new Bridge.Deal();
	for( var dir in Bridge.directions ) {
		assert.deepEqual( deal.get( 'name', dir ), Bridge.directions[ dir ].name, 'default name is direction' );				
	}
	
	// count
	for( var dir in Bridge.directions ) {
		assert.deepEqual( deal.get( 'count', dir), 0, 'No cards in any hand' );
	}
	
	// hands
	deal = new Bridge.Deal();
	var hand = 'SAKQJHAKQDAKQXAKQ';
	var dir = 'n';
	assert.throws(
		function() {
			deal.set( 'hand', hand, dir );
		},
		'hand string has bad suit/rank'
	);	
	deal = new Bridge.Deal();
	var hand = 'SAKQAHAKQDAKQCAKQ';
	var dir = 'n';
	assert.throws(
		function() {
			deal.set( 'hand', hand, dir );
		},
		'hand string has same card again'
	);	
	deal = new Bridge.Deal();
	var hand = 'SAKQJHAKQDAKQCAKQ';
	var dir = 'n';	
	var rank = 'a';
	deal.set( 'hand', hand, dir );
	assert.deepEqual( deal.get( 'count', dir ), 13, dir + ' should have 13 cards' );
	for( var suit in Bridge.suits ) {
		assert.ok( deal._hasCard( suit, rank, dir ), dir + ' hand should have ' + suit + rank ); 
	}
	assert.deepEqual( deal.get( 'hand', dir ), dir + "=" + hand.toLowerCase(), 'Should return same hand' );
	var hand2 = 'sjkqahAqKDKAqCAKQ';
	deal = new Bridge.Deal();
	deal.set( 'hand', hand2, dir );
	assert.deepEqual( deal.get( 'hand', dir ), dir + "=" + hand.toLowerCase(), 'Should return same hand' );
	
});
QUnit.test( 'Add and Remove Cards', function( assert ) {
	var deal = new Bridge.Deal();

	// no card assigned
	for( var direction in Bridge.directions ) {
		for( var suit in Bridge.suits ) {
			for( var rank in Bridge.ranks ) {
				assert.ok( !deal._hasCard( suit, rank, direction ), direction + ' should not have ' + suit + rank );				
			}
		}
		assert.deepEqual( deal.get( 'count', direction ), 0, direction + ' Hand has 0 cards initially' );
	}
	
	// Add invalid cards
	assert.throws(
		function() {
			deal.addCard();
		},
		'Bridge.Deal.addCard needs suit'
	);	
	assert.throws(
		function() {
			deal.addCard( suit );
		},
		'Bridge.Deal.addCard needs rank'
	);
	
	// Add a card	
	var direction = 'n';
	var suit = 's';
	var rank = 'a';	
	assert.ok( deal.addCard( suit, rank, direction ), suit + rank + ' added' );
	assert.ok( deal._hasCard( suit, rank, direction ), direction + ' hand should have ' + suit + rank );	
	assert.deepEqual( deal.get( 'count', direction ), 1, direction + ' hand now has 1 card' );	
	
	// Try to add same card
	assert.throws(
		function() {
			deal.addCard( suit, rank, direction )
		},
		suit + rank + ' already added'
	);	
	assert.ok( deal._hasCard( suit, rank, direction ), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 1, direction + ' hand still has one card' );
	
	// try adding to another direction
	var direction2 = 'e';
	assert.throws(
		function() {
			deal.addCard( suit, rank, direction2 )
		},
		suit + rank + ' already added'
	);	
	assert.ok( deal._hasCard( suit, rank, direction ), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 1, direction + ' hand still has one card' );	
	assert.ok( !deal._hasCard( suit, rank, direction2 ), direction2 + 'hand should not have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction2 ), 0, direction2 + ' hand still has no cards' );	
	
	// Add another card		
	suit = 'c';
	rank = '2';
	assert.ok( deal.addCard( suit, rank, direction ), suit + rank + ' added' );
	assert.ok( deal._hasCard( suit, rank, direction ), direction + ' hand should have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 2, direction + ' hand now has 2 cards' );	
	
	// remove a card
	assert.ok( deal.removeCard( suit, rank, direction ), suit + rank + ' removed from ' + direction );
	assert.ok( !deal._hasCard( suit, rank, direction ), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 1, direction + ' hand now has 1 card' );	
	
	// remove same card	
	assert.throws(
		function() {
			deal.removeCard( suit, rank, direction )
		},
		suit + rank + ' already removed from ' + direction
	);		
	assert.ok( !deal._hasCard( suit, rank, direction ), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 1, direction + ' hand still has 1 card' );
	
	
	
	suit = 's';
	rank = 'a';
	
	// remove from wrong hand
	assert.throws(
		function() {
			deal.removeCard( suit, rank, direction2 )
		},
		suit + rank + ' does not belong to ' + direction2
	);	
	assert.ok( !deal._hasCard( suit, rank, direction2 ), direction2 + ' hand should not have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction2 ), 0, direction2 + ' hand still has 0 cards' );
		
	// remove other card
	assert.ok( deal._hasCard( suit, rank, direction ), direction + ' hand should have ' + suit + rank );
	assert.ok( deal.removeCard( suit, rank, direction ), suit + rank + ' removed from ' + direction );
	assert.ok( !deal._hasCard( suit, rank, direction ), direction + ' hand should not have ' + suit + rank );
	assert.deepEqual( deal.get( 'count', direction ), 0, direction + ' hand now has 0 cards' );	
	
	// Add 13 cards
	suit = 's';
	var count = 0;
	for( var rank in Bridge.ranks ) {
		deal.addCard( suit, rank, direction );
		count++;
		assert.deepEqual( deal.get( 'count', direction ), count, direction + ' hand has ' + count + ' cards' );
	}	
	assert.deepEqual( deal.get( 'count', direction ), 13, direction + ' hand has 13 cards' );
	// add one more	
	suit = 'c';
	rank = '2';	
	assert.throws(
		function() {
			deal.addCard( suit, rank, direction );
		},
		'Adding more than 13 cards'
	);
	
	deal.assignRest();
	for( var direction in Bridge.directions ) {
		assert.deepEqual( deal.get( 'count', direction ), 13, direction + ' hand has 13 cards' );
	}
});

QUnit.module( 'Bridge.Auction' );
QUnit.test( 'Constructor', function( assert ) {
	
	// Constructor needs a name
	assert.throws(
		function() {
			var auction = new Bridge.Auction();
		},
		'Bridge.Auction constructor needs name and dealer argument'
	);	
	
	var name = 'Default Auction';
	// Constructor needs a dealer
	assert.throws(
		function() {
			var auction = new Bridge.Auction( name );
		},
		'Bridge.Auction constructor needs dealer argument'
	);		
	for( var direction in Bridge.directions ) {
		var auction = new Bridge.Auction( name, direction );
		assert.deepEqual( auction.name, name, 'Name matches for ' + name );
		assert.deepEqual( auction.dealer, direction, 'Dealer matches for ' + direction );
		assert.deepEqual( auction.nextToCall, direction, 'Next to bid matches dealer for ' + direction );
		assert.deepEqual( auction.calls.length, 0, 'Number of calls should be 0' );
	}
});
QUnit.test( 'Good Auctions', function( assert ) {
	var name = 'Good Auction';
	var goodAuctions = [
		[ 'p', 'P', 'p', 'p' ],
		[ 'p', 'P', 'p', '1c', 'p', 'p', 'p' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'x', 'p' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'x', 'r', 'p' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'x', 'p', 'p', 'r' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'p', 'p', 'X' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'p', 'p', 'x', 'r' ],
		[ '1c', '1D', 'p', 'p', '1S', '2C', 'p', '3h', 'p', 'p', 'x', 'P', 'p', 'R' ]
	];
	for( var direction in Bridge.directions ) {	
		var auction = new Bridge.Auction( name, direction );
		for( var i = 0; i < goodAuctions.length; ++i ) {
			auction.clear();
			var count = 0;
			var nextToCall = direction;
			for( var j = 0; j < goodAuctions[i].length; ++j ) {
				var call = goodAuctions[i][j];
				auction.addCall( call );
				count++;
				nextToCall = Bridge.directions[ nextToCall ].lho;
				assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
				assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );				
			}
		}
	}
});
QUnit.test( 'Bad Auctions', function( assert ) {	
	var name = 'Bad Auction';
	var badAuctions = [
		[ 'p', 'P', 'p', 'p', 'p' ],
		[ 'p', 'P', 'p', 'x' ],
		[ 'p', 'P', 'p', 'r' ],
		[ '1s', 'p', 'p', 'p', 'p' ],
		[ '1s', '1c' ],
		[ '1s', 'r' ],
		[ '1s', 'p', 'x' ],
		[ '1s', 'x', 'p', 'r' ]
	];	
	for( var direction in Bridge.directions ) {	
		for( var i = 0; i < badAuctions.length; ++i ) {
			var auction = new Bridge.Auction( name, direction );
			var count = 0;
			var nextToCall = direction;			
			for( var j = 0; j < badAuctions[i].length-1; ++j ) {
				var call = badAuctions[i][j];
				auction.addCall( call );
				count++;
				nextToCall = Bridge.directions[ nextToCall ].lho;
				assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
				assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );				
				
			}
			var call = badAuctions[i][j];
			assert.throws(
				function() {
					auction.addCall( call );
				},
				'Bad auction because of ' + call
			);					
		}
	}	
});
QUnit.test( 'Remove Calls and clear', function( assert ) {	
	var name = 'Default Auction';
	var direction = 'n';
	var auction = new Bridge.Auction( name, direction );
	var count = 0;
	var nextToCall = direction;
	auction.removeCall();		
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
	auction.clear();
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
	
	// Passes
	auction.addCall('p');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
	auction.removeCall();
	count--;
	nextToCall = Bridge.directions[ nextToCall ].rho;
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
		
	auction.addCall('P');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.clear();
	count = 0;	
	nextToCall = direction;
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
	
	auction.addCall('1s');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.addCall('p');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.addCall('2c');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.addCall('2d');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.addCall('p');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.addCall('p');
	count++;
	nextToCall = Bridge.directions[ nextToCall ].lho;
	auction.removeCall();
	count--;
	nextToCall = Bridge.directions[ nextToCall ].rho;
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );	
	auction.clear();
	count = 0;	
	nextToCall = direction;
	assert.deepEqual( auction.nextToCall, nextToCall, 'Next to bid matches ' + nextToCall );
	assert.deepEqual( auction.calls.length, count, 'Number of calls should be ' + count );		
});

QUnit.test( 'Set Contracts', function( assert ) {
	var name = 'Set Contract';
	for ( var dealer in Bridge.directions) {
		for ( var direction in Bridge.directions) {
			var auction = new Bridge.Auction( name, dealer );
			for( var level = 1; level <= 7; ++level ) {
				for( var suit in Bridge.calls ) {
					if ( Bridge.Utilities.isBid( suit ) ) {
						var contract = level + suit + direction;
						auction._setContract( contract );
						assert.equal( auction.contract.toHTML( true ), contract, 'contract matches set contract : ' + contract );
						contract = level + suit + 'x' + direction;
						auction._setContract( contract );
						assert.equal( auction.contract.toHTML( true ), contract, 'contract matches set contract : ' + contract );
						contract = level + suit + 'xx' + direction;
						auction._setContract( contract );
						assert.equal( auction.contract.toHTML( true ), contract, 'contract matches set contract : ' + contract );
					}
				}
			}
		}
	}
});


QUnit.test( 'Final Contracts', function( assert ) {
	var name = 'Good Auction';
	var dealer = [ 'n', 'n', 'n', 'n' ]
	var auctions = [
		[ 'p', 'P', 'p', 'p' ],
		[ '1c', 'p', 'p', 'p' ],
		[ '1c', 'x', 'p', 'p', 'p' ],
		[ '1c', 'x', 'r', 'p', 'p', 'p' ]
	];
	var contracts = [
		'',
		'1cn',
		'1cxn',
		'1cxxn'
	];
	for( var i = 0; i < dealer.length; ++i ) {
		var auction = new Bridge.Auction( name, dealer[i] );
		auction.clear();
		for( var j = 0; j < auctions[i].length; ++j ) {
			var call = auctions[i][j];
			auction.addCall( call );
		}		
		assert.deepEqual( auction.contract.toHTML( true ), contracts[i], auction.contract.toHTML( true ) + ' does not match expected contract ' + contracts[i] );
	}
});

QUnit.module( 'Bridge.Contract' );
QUnit.test( 'Constructor', function( assert ) {
	var contract = new Bridge.Contract();
	assert.equal( contract.level, null, 'Level is null' );
	assert.equal( contract.suit, null, 'Suit is null' );
	assert.equal( contract.declarer, null, 'Declarer is null' );
	assert.ok( !contract.doubled, 'Not doubled' );
	assert.ok( !contract.redoubled, 'Not redoubled' );
	for( var call in Bridge.calls ) {
		for ( var direction in Bridge.directions) {
			if ( Bridge.Utilities.isBid( call ) ) {
				assert.equal( contract.firstToBid[ call ][ direction ], null, 'first to bid for ' + call + ' ' + direction + ' is null' );
			}			
		}
	}	
	assert.equal( contract.numPasses, 0, 'Num Passes is 0' );
	assert.ok( !contract.isComplete, 'Contract is not complete' );
	assert.equal( contract.toHTML( true ), '', 'String format is empty string' );
	assert.equal( contract.toHTML( false ), '', 'HTML format is empty string' );
	contract = contract.clone();
	assert.equal( contract.level, null, 'Level is null' );
	assert.equal( contract.suit, null, 'Suit is null' );
	assert.equal( contract.declarer, null, 'Declarer is null' );
	assert.ok( !contract.doubled, 'Not doubled' );
	assert.ok( !contract.redoubled, 'Not redoubled' );
	for( var call in Bridge.calls ) {
		for ( var direction in Bridge.directions) {
			if ( Bridge.Utilities.isBid( call ) ) {
				assert.equal( contract.firstToBid[ call ][ direction ], null, 'first to bid for ' + call + ' ' + direction + ' is null' );
			}			
		}
	}	
	assert.equal( contract.numPasses, 0, 'Num Passes is 0' );
	assert.ok( !contract.isComplete, 'Contract is not complete' );
	assert.equal( contract.toHTML( true ), '', 'String format is empty string' );
	assert.equal( contract.toHTML( false ), '', 'HTML format is empty string' );
	
	var call = new Bridge.Call( 1, 'c', 'n' );
	contract.update( call );
	assert.equal( contract.level, 1, 'Level is 1' );
	assert.equal( contract.suit, 'c', 'Suit is c' );
	assert.equal( contract.declarer, 'n', 'Declarer is n' );
	assert.ok( !contract.doubled, 'Not doubled' );
	assert.ok( !contract.redoubled, 'Not redoubled' );
	for( var call in Bridge.calls ) {
		for ( var direction in Bridge.directions) {
			if ( Bridge.Utilities.isBid( call ) ) {
				if ( call === 'c' && ( direction === 'n' || direction === 's' ) ) {
					assert.equal( contract.firstToBid[ call ][ direction ], 'n', 'first to bid for ' + call + ' ' + direction + ' is null' );
				}
				else {
					assert.equal( contract.firstToBid[ call ][ direction ], null, 'first to bid for ' + call + ' ' + direction + ' is n' );
				}
			}			
		}
	}	
	assert.equal( contract.numPasses, 0, 'Num Passes is 0' );
	assert.ok( !contract.isComplete, 'Contract is not complete' );
	assert.equal( contract.toHTML( true ), '1cn', 'String format matches' );		
});



QUnit.module( 'Bridge.Call' );
QUnit.test( 'Constructor', function( assert ) {
	
	// Constructor needs a call
	assert.throws(
		function() {
			var call = new Bridge.Call();
		},
		'Bridge.Call constructor needs suit argument and optional level argument'
	);	
	
	// All valid calls
	for( var direction in Bridge.directions ) {
		for( var level = 1; level <= 7; ++level ) {
			for( var suit in Bridge.calls ) {
				var call = new Bridge.Call( level, suit, direction );
				assert.deepEqual( call.level, level, 'Level matches for ' + level + suit );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + level + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
				call = new Bridge.Call( String(level), suit.toUpperCase(), direction.toUpperCase() );
				assert.deepEqual( call.level, level, 'Level matches for ' + level + suit );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + level + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
				
			}
		}
	}
	
	for( var direction in Bridge.directions ) {
		for( var suit in Bridge.calls ) {
			// Valid calls without level specified
			if ( !Bridge.Utilities.isBid( suit ) ) {
				var call = new Bridge.Call( suit, direction );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
			}
			// InValid calls without level specified
			else {
				assert.throws(
					function() {
						var call = new Bridge.Call( suit, direction );
					},
					'Bridge.Call constructor needs level argument when suit is ' + suit
				);			
			}
		}	
	}
	
	// InValid level
	level = 0;
	for( var direction in Bridge.directions ) {
		for( var suit in Bridge.calls ) {
			// Valid calls without level specified
			if ( !Bridge.Utilities.isBid( suit ) ) {
				var call = new Bridge.Call( level, suit, direction );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
			}
			// InValid calls without level specified
			else {
				assert.throws(
					function() {
						var call = new Bridge.Call( level, suit, direction );
					},
					'Invalid level ' + level + ' for suit ' + suit
				);			
			}
		}
	}
	level = 8;
	for( var direction in Bridge.directions ) {
		for( var suit in Bridge.calls ) {
			// Valid calls without level specified
			if ( !Bridge.Utilities.isBid( suit ) ) {
				var call = new Bridge.Call( level, suit, direction );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
			}
			// InValid calls without level specified
			else {
				assert.throws(
					function() {
						var call = new Bridge.Call( level, suit, direction );
					},
					'Invalid level ' + level + ' for suit ' + suit
				);			
			}
		}
	}
	level = 'sriram';
	for( var direction in Bridge.directions ) {
		for( var suit in Bridge.calls ) {
			// Valid calls without level specified
			if ( !Bridge.Utilities.isBid( suit ) ) {
				var call = new Bridge.Call( level, suit, direction );
				assert.deepEqual( call.suit, suit, 'Suit matches for ' + suit );
				assert.deepEqual( call.direction, direction, 'Direction matches for ' + direction );
			}
			// InValid calls without level specified
			else {
				assert.throws(
					function() {
						var call = new Bridge.Call( level, suit, direction );
					},
					'Invalid level ' + level + ' for suit ' + suit
				);			
			}
		}	
	}		
});


