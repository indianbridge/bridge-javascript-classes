QUnit.module( "Bridge.Hand" );
QUnit.test( "Constructor", function( assert ) {
	assert.throws(
		function() {
			var hand = new Bridge.Hand();
		},
		"Bridge.Hand constructor needs direction argument"
	);	
	assert.throws(
		function() {
			var hand = new Bridge.Hand( "a" );
		},
		"Bridge.Hand constructor needs valid direction argument"
	);	
	for( var direction in Bridge.directions ) {
		var hand = new Bridge.Hand( direction );
		// All default values
		assert.deepEqual( hand.direction, direction, "Direction matches passed argument" );
		assert.deepEqual( hand.name, Bridge.directions[ direction ].name, "Name match name of passed direction" );
		var cards = {};
		for( var suit in Bridge.suits ) {
			cards[ suit ] = {};
			for( var rank in Bridge.ranks ) {
				cards[ suit ][ rank ] = false;
			}
		}		
		assert.deepEqual( hand.cards, cards, "Hand has suits but no cards in any suit initially" );
		assert.deepEqual( hand.numCards, 0, "No cards initially" );
	}
	
});

QUnit.test( "Set and Get", function( assert ) {
	assert.throws(
		function() {
			hand.set();
		},
		"Bridge.Hand.set needs property argument"
	);
	assert.throws(
		function() {
			hand.set( "name" );
		},
		"Bridge.Hand.set needs a value argument"
	);	
	
	assert.throws(
		function() {
			hand.set( "random_property", "value" );
		},
		"Bridge.Hand.set valid property"
	);	
	assert.throws(
		function() {
			hand.get();
		},
		"Bridge.Hand.get needs property argument"
	);	
	assert.throws(
		function() {
			hand.get( "random_property" );
		},
		"Bridge.Hand.get needs a known property argument"
	);	
	
	for( var direction in Bridge.directions ) {
		var hand = new Bridge.Hand( direction );		
		assert.deepEqual( hand.get( "direction" ), direction, "direction matches" );		
		assert.deepEqual( hand.get( "name" ), Bridge.directions[ direction ].name, "Name matches passed name" );		
		assert.deepEqual( hand.get( "count" ), 0, "Num cards is 0" );
		assert.deepEqual( hand.get( "hand" ), "", "hand is empty" );
	}			
	
	var name = "Sriram";
	// Set name
	for( var direction in Bridge.directions ) {
		var hand = new Bridge.Hand( direction );		
		hand.set( "name", name );
		assert.deepEqual( hand.name, name, "Name match passed name" );	
		assert.deepEqual( hand.get( "name" ), name, "Name matches passed name" );		
	}
	
	// Set hand
	var hands = {
		"sakqjhakq" : { hand : "sakqjhakq", count : 7, cards : [ "sa", "sk", "sq", "sj", "ha", "hk", "hq" ] },
		"hKqaskAjq" : { hand : "sakqjhakq", count : 7, cards : [ "sa", "sk", "sq", "sj", "ha", "hk", "hq" ] },
		"cat9HKQ10sakq7d453" : { hand : "sakq7hkqtd543cat9", count : 13, cards : [ "ct", "ht" ] }
	}
	for( var direction in Bridge.directions ) {	
		for ( var handString in hands ) {	
			var hand = new Bridge.Hand( direction );
			hand.set( "hand", handString );
			assert.deepEqual( hand.get( "count" ), hands[ handString ].count, "Number of cards matches" );
			_.each( hands[ handString ].cards, function( card ) {
				assert.ok( hand.hasCard( card[0], card[1] ), "Hand should have " + card );
			}, this );
			assert.deepEqual( hand.get( "hand" ), hands[ handString ].hand, "hand string should match" );
		}
	}	
	
	var badHands = [ "a", "saa", "sahask", "c1k", "dt10" ];
	for( var direction in Bridge.directions ) {	
		_.each( badHands, function( handString) {
			assert.throws(
				function() {
					var hand = new Bridge.Hand( direction );
					hand.set( "hand", handString );
				},
				handString + " is not a valid hand"
			);
		});
	}	
	
	for( var direction in Bridge.directions ) {	
		hand = new Bridge.Hand( direction );
		var handString = "sakq7hkqtd543cat9";
		hand.set( "hand", "cat9HKQ10sakq7d453" );
		var name = hand.get( "name" );
		var count = hand.get( "count" );
		assert.deepEqual( hand.get( "hand" ), handString, "hand string should match" );		
		var json = hand.toJSON();
		hand = new Bridge.Hand( direction );
		hand.fromJSON( json );
		assert.deepEqual( hand.get( "direction" ), direction, "direction should match" );
		assert.deepEqual( hand.get( "name" ), name, "name should match" );
		assert.deepEqual( hand.get( "count" ), count, "count should match" );
		assert.deepEqual( hand.get( "hand" ), handString, "hand string should match" );	
	}
});

QUnit.test( 'Add and Remove Cards', function( assert ) {
	for( var direction in Bridge.directions ) {	
		var hand = new Bridge.Hand( direction );
		var suit = 's';
		var rank = 'a';
		// Hand should not have any cards
		assert.ok( !hand.hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
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
		
		// Add invalid cards
		assert.throws(
			function() {
				hand.removeCard();
			},
			'Bridge.Hand.removeCard needs suit'
		);	
		assert.throws(
			function() {
				hand.addCard( suit );
			},
			'Bridge.Hand.removeCard needs rank'
		);		
		
		// Add a card	
		hand.addCard( suit, rank );
		assert.ok( hand.hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );	
		assert.deepEqual( hand.get( "hand" ), "sa", "handstring matches" );
		
		// Try to add same card
		assert.throws(
			function() {
				hand.addCard( suit, rank );
			},
			suit + rank + ' already added to ' + direction
		);		
		assert.ok( hand.hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );
		assert.deepEqual( hand.get( "hand" ), "sa", "handstring matches" );
		
		// Add another card		
		suit = 'c';
		rank = '2';
		hand.addCard( suit, rank );
		assert.ok( hand.hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 2, direction + ' hand now has 2 cards' );
		assert.deepEqual( hand.get( "hand" ), "sac2", "handstring matches" );	
		
		// remove a card
		hand.removeCard( suit, rank );
		assert.ok( !hand.hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );	
		assert.deepEqual( hand.get( "hand" ), "sa", "handstring matches" );
		
		// remove same card	
		assert.throws(
			function() {
				hand.removeCard( suit, rank )
			},
			suit + rank + ' does not belong to ' + direction
		);			
		assert.ok( !hand.hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 1 card' );
		assert.deepEqual( hand.get( "hand" ), "sa", "handstring matches" );
		
		// remove other card
		suit = 's';
		rank = 'a';
		assert.ok( hand.hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
		hand.removeCard( suit, rank );
		assert.ok( !hand.hasCard( suit, rank), direction + ' hand should not have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 0, direction + ' hand now has 0 cards' );
		assert.deepEqual( hand.get( "hand" ), "", "handstring matches" );	
		
		// Add 13 cards
		suit = 's';
		for( var rank in Bridge.ranks ) {
			hand.addCard( suit, rank );
		}	
		assert.deepEqual( hand.get( 'count' ), 13, direction + ' hand now has 13 cards' );
		assert.deepEqual( hand.get( "hand" ), "sakqjt98765432", "handstring matches" );
		// add one more	
		suit = 'c';
		rank = '2';	
		assert.throws(
			function() {
				hand.addCard( suit, rank );
			},
			'Adding more than 13 cards'
		);
		hand.clearCards();
		assert.deepEqual( hand.get( 'count' ), 0, direction + ' hand now has 0 cards' );
		assert.deepEqual( hand.get( "hand" ), "", "handstring matches" );
		hand.addCard( suit, rank );	
		assert.ok( hand.hasCard( suit, rank), direction + ' hand should have ' + suit + rank );
		assert.deepEqual( hand.get( 'count' ), 1, direction + ' hand now has 0 cards' );
		assert.deepEqual( hand.get( "hand" ), "c2", "handstring matches" );			
	}
});

QUnit.test( "Miscellaneous", function( assert ) {
	var hands = {
		"sakqj" : { count: 1, hasCards: { 's': true, 'h': false, 'd': false, 'c': false }, output: "shdc" },
		"sakqjhakq" : { count: 2, hasCards: { 's': true, 'h': true, 'd': false, 'c': false }, output: "shdc" },
		"sakqjdakq" : { count: 2, hasCards: { 's': true, 'h': false, 'd': true, 'c': false }, output: "shdc" },
		"sakqjcakq" : { count: 2, hasCards: { 's': true, 'h': false, 'd': false, 'c': true }, output: "shdc" },
		"hakqjdakq" : { count: 2, hasCards: { 's': false, 'h': true, 'd': true, 'c': false }, output: "shdc" },
		"hakqjcakq" : { count: 2, hasCards: { 's': false, 'h': true, 'd': false, 'c': true }, output: "shdc" },
		"dakqjcakq" : { count: 2, hasCards: { 's': false, 'h': false, 'd': true, 'c': true }, output: "shdc" },
		"sahada" : { count: 3, hasCards: { 's': true, 'h': true, 'd': true, 'c': false }, output: "hscd" },
		"sahaca" : { count: 3, hasCards: { 's': true, 'h': true, 'd': false, 'c': true }, output: "shdc" },
		"sadaca" : { count: 3, hasCards: { 's': true, 'h': false, 'd': true, 'c': true }, output: "shdc" },
		"hadaca" : { count: 3, hasCards: { 's': false, 'h': true, 'd': true, 'c': true }, output: "hscd" },
		"sahadaca" : { count: 4, hasCards: { 's': true, 'h': true, 'd': true, 'c': true }, output: "hsdc" }
	};
	for( var direction in Bridge.directions ) {
		for( var handString in hands ) {
			var hand = new Bridge.Hand( direction );
			hand.set( "hand", handString );	
			for( var suit in Bridge.suits ) {
				assert.equal( hands[ handString ].hasCards[ suit ], hand._hasCards( suit ), "has cards matches for " + handString + " in suit " + suit );
			}	
			assert.equal( hands[ handString ].output, hand.getAlternatingSuitOrder().join( '' ), "suit order for " + handString + " matches" );
		};	
	}
});

