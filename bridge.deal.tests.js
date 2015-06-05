QUnit.module( "Bridge.Deal" );
QUnit.test( "Constructor", function( assert ) {
	var deal = new Bridge.Deal();
	for ( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( !deal.cards[ suit ][ rank ].isAssigned(), "None of the cards are assigned" );
		}
	}	
	assert.deepEqual( deal.board, 1, "board is default" );
	assert.deepEqual( deal.dealer, "n", "dealer is default" );
	assert.deepEqual( deal.vulnerability, "-", "vulnerability is default" );
	assert.deepEqual( deal.scoring, "KO", "vulnerability is default" );
	assert.deepEqual( deal.notes, "", "notes is default" );
	
	for( var direction in Bridge.directions ) {
		assert.ok( deal.hands[ direction ], "Hand objects should exist" );
	}
	assert.ok( deal.auction, "Default Auction should exist" );
});

QUnit.test( "Setters and Getters", function( assert ) {
	var deal = new Bridge.Deal();
	
	assert.throws(
		function() {
			deal.set();
		},
		"Bridge.Deal.set needs property argument"
	);
	assert.throws(
		function() {
			deal.set( "random_property" );
		},
		"Bridge.Deal.set needs a value argument"
	);	
	assert.throws(
		function() {
			deal.set( "random_property", "value" );
		},
		"Bridge.Deal.set needs a valid property"
	);
	
	assert.throws(
		function() {
			deal.get();
		},
		"Bridge.Deal.get needs property argument"
	);
	assert.throws(
		function() {
			deal.set( "random_property" );
		},
		"Bridge.Deal.get needs a valid property"
	);	
	
	// Hands
	for( var direction in Bridge.directions ) {
		assert.deepEqual( deal.getHand( direction ), deal.hands[ direction ], "get hand should match" );
	}	
	
	// Board
	deal.set( "board", 1 );		
	assert.equal( deal.board, 1, "board number is 1" );
	assert.equal( deal.board, deal.get( "board" ), "board number is 1" );
	deal.set( "board", "1" );		
	assert.equal( deal.board, 1, "board number is 1" );
	assert.equal( deal.board, deal.get( "board" ), "board number is 1" );	
	assert.throws(
		function() {
			deal.set( "board", 0 );
		},
		"Board Number cannot be less than 1"
	);	
	assert.throws(
		function() {
			deal.set( "board", "nan" );
		},
		"Board Number has to be a number"
	);	
	
	assert.throws(
		function() {
			deal.set( "board", 2.5 );
		},
		"Board Number has to be a integer"
	);	
	
	// Vulnerability
	for( var vul in Bridge.vulnerabilities ) {
		deal.set( "vulnerability" , vul );
		assert.deepEqual( deal.vulnerability, vul, "vulnerability as set" );
		assert.deepEqual( deal.vulnerability, deal.get( "vulnerability" ), "vulnerability as set" );			
	}	
	deal.set( "vulnerability", "0" );
	assert.deepEqual( deal.vulnerability, "-", "0 is treated as -" );
	assert.throws(
		function() {
			deal.set( "vulnerability", "o" );
		},
		"vulnerability has to be one of -,n,e,b"
	);	
	
	// Dealer
	for( var d in Bridge.directions ) {
		deal.set( "dealer" , d );
		assert.deepEqual( deal.dealer, d, "dealer as set" );
		assert.deepEqual( deal.dealer, deal.get( "dealer" ), "dealer as set" );			
	}	
	assert.throws(
		function() {
			deal.set( "dealer", "o" );
		},
		"dealer has to be one of n,e,s,w"
	);	
	
	// scoring
	var scoring = "Anything Goes here";
	deal.set( "scoring", scoring );	
	assert.deepEqual( deal.scoring, scoring, "scoring as set" );
	assert.deepEqual( deal.scoring, deal.get( "scoring" ), "scoring as set" );	
	
	// notes
	var notes = "Anything Goes here";
	deal.set( "notes", notes );	
	assert.deepEqual( deal.notes, notes, "notes as set" );
	assert.deepEqual( deal.notes, deal.get( "notes" ), "notes as set" );	
	
	// auction
	assert.deepEqual( deal.auction, deal.get( "auction" ), "get works for auction" );
});
