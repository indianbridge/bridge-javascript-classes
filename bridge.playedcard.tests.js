QUnit.module( "Bridge.PlayedCard" );
QUnit.test( "Constructor", function( assert ) {
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard();
		},
		"Bridge.PlayedCard constructor needs at least 3 arguments"
	);	
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard( 1 );
		},
		"Bridge.PlayedCard constructor needs at least 3 arguments"
	);	
	var card = new Bridge.Card( 's', '8' );
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard( 1, card );
		},
		"Bridge.PlayedCard constructor needs at least 3 arguments"
	);	
	// Special Card
	for( var leader in Bridge.directions ) {
		for( var trump in Bridge.calls ) {
			if ( Bridge.isStrain( trump ) ) {
			
				var playedCard = new Bridge.PlayedCard( 0, trump, leader );
			}
			else {
				assert.throws(
					function() {
						var playedCard = new Bridge.PlayedCard( 0, trump, leader );
					},
					"Bridge.PlayedCard constructor " + trump + " is invalid trump suit"
				);	
			}
		}
	}
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard( 0, 's', 'a' );
		},
		"Bridge.PlayedCard constructor invalid leader"
	);	
	var trump = 's';
	var leader = 'w';
	var dummyPlayedCard = new Bridge.PlayedCard( 0, trump, leader );
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			var card = new Bridge.Card( suit, rank );
			var playedCard = new Bridge.PlayedCard( 1, card, dummyPlayedCard);
			assert.equal( playedCard.get( "play_number" ), 1, "PlayNumber matches" );
			assert.equal( playedCard.get( "trump" ), trump, "Trump matches" );
			assert.equal( playedCard.get( "leader" ), leader, "Direction matches" );
			assert.equal( playedCard.get( "card" ), card, "Card matches" );
			assert.equal( playedCard.get( "suit" ), card.getSuit(), "Suit matches" );
			assert.equal( playedCard.get( "rank" ), card.getRank(), "Rank matches" ); 
			assert.equal( playedCard.get( "direction" ), leader, "Direction matches" ); 
			assert.equal( playedCard.get( "winning_card" ), playedCard, "Winning Card matches" ); 
			assert.equal( playedCard.get( "lead_card" ), playedCard, "lead Card matches" ); 
			assert.equal( playedCard.previousCard, dummyPlayedCard, "previous Card matches" ); 
			assert.deepEqual( playedCard.tableCards, { 'n' : null, 'e' : null, 's' : null, 'w' : card }, "table cards match" );
		}
	}	
	var card = new Bridge.Card( 'h', 'a' );
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard( 2, card, dummyPlayedCard );
		},
		"Bridge.PlayedCard constructor play number not in sequence"
	);		
	var playedCards = [];
	var cards = [];
	playedCards.push( dummyPlayedCard );
	var plays = [ 'ha', 'h2', 's2', 'h3', 'dk' ];
	_.each( plays, function( nextCardData, index ) {
		var nextCard = new Bridge.Card( nextCardData[0], nextCardData[1] );
		cards.push( nextCard );
		var nextPlayedCard = new Bridge.PlayedCard( index+1, nextCard, playedCards[ index ] );
		playedCards.push( nextPlayedCard );
	});
	
	nextPlayedCard = playedCards[1];
	assert.equal( nextPlayedCard.get( "play_number" ), 1, "PlayNumber matches" );
	assert.equal( nextPlayedCard.get( "trump" ), trump, "Trump matches" );
	assert.equal( nextPlayedCard.get( "leader" ), leader, "Leader matches" );
	assert.equal( nextPlayedCard.get( "suit" ), 'h', "Suit matches" );
	assert.equal( nextPlayedCard.get( "rank" ), 'a', "Rank matches" ); 
	assert.equal( nextPlayedCard.get( "direction" ), 'w', "Direction matches" ); 
	assert.equal( nextPlayedCard.get( "winning_card" ), playedCards[1], "Winning Card matches" ); 
	assert.equal( nextPlayedCard.get( "lead_card" ), playedCards[1], "lead Card matches" ); 
	assert.equal( nextPlayedCard.previousCard, dummyPlayedCard, "previous Card matches" );
	assert.equal( nextPlayedCard.nextToPlay, 'n', "next to play matches" ); 
	assert.deepEqual( nextPlayedCard.tableCards, { 'n' : null, 'e' : null, 's' : null, 'w' : cards[0] }, "table cards match" );

	nextPlayedCard = playedCards[2];
	assert.equal( nextPlayedCard.get( "play_number" ), 2, "PlayNumber matches" );
	assert.equal( nextPlayedCard.get( "trump" ), trump, "Trump matches" );
	assert.equal( nextPlayedCard.get( "leader" ), leader, "Leader matches" );
	assert.equal( nextPlayedCard.get( "suit" ), 'h', "Suit matches" );
	assert.equal( nextPlayedCard.get( "rank" ), '2', "Rank matches" ); 
	assert.equal( nextPlayedCard.get( "direction" ), 'n', "Direction matches" ); 
	assert.equal( nextPlayedCard.get( "winning_card" ), playedCards[1], "Winning Card matches" ); 
	assert.equal( nextPlayedCard.get( "lead_card" ), playedCards[1], "lead Card matches" ); 
	assert.equal( nextPlayedCard.previousCard, playedCards[1], "previous Card matches" );
	assert.equal( nextPlayedCard.nextToPlay, 'e', "next to play matches" ); 
	assert.deepEqual( nextPlayedCard.tableCards, { 'n' : cards[1], 'e' : null, 's' : null, 'w' : cards[0] }, "table cards match" );
	
	nextPlayedCard = playedCards[3];
	assert.equal( nextPlayedCard.get( "play_number" ), 3, "PlayNumber matches" );
	assert.equal( nextPlayedCard.get( "trump" ), trump, "Trump matches" );
	assert.equal( nextPlayedCard.get( "leader" ), leader, "Leader matches" );
	assert.equal( nextPlayedCard.get( "suit" ), 's', "Suit matches" );
	assert.equal( nextPlayedCard.get( "rank" ), '2', "Rank matches" ); 
	assert.equal( nextPlayedCard.get( "direction" ), 'e', "Direction matches" ); 
	assert.equal( nextPlayedCard.get( "winning_card" ), playedCards[3], "Winning Card matches" ); 
	assert.equal( nextPlayedCard.get( "lead_card" ), playedCards[1], "lead Card matches" ); 
	assert.equal( nextPlayedCard.previousCard, playedCards[2], "previous Card matches" );
	assert.equal( nextPlayedCard.nextToPlay, 's', "next to play matches" ); 
	assert.deepEqual( nextPlayedCard.tableCards, { 'n' : cards[1], 'e' : cards[2], 's' : null, 'w' : cards[0] }, "table cards match" );
	
	nextPlayedCard = playedCards[4];
	assert.equal( nextPlayedCard.get( "play_number" ), 4, "PlayNumber matches" );
	assert.equal( nextPlayedCard.get( "trump" ), trump, "Trump matches" );
	assert.equal( nextPlayedCard.get( "leader" ), leader, "Leader matches" );
	assert.equal( nextPlayedCard.get( "suit" ), 'h', "Suit matches" );
	assert.equal( nextPlayedCard.get( "rank" ), '3', "Rank matches" ); 
	assert.equal( nextPlayedCard.get( "direction" ), 's', "Direction matches" ); 
	assert.equal( nextPlayedCard.get( "winning_card" ), playedCards[3], "Winning Card matches" ); 
	assert.equal( nextPlayedCard.get( "lead_card" ), playedCards[1], "lead Card matches" ); 
	assert.equal( nextPlayedCard.previousCard, playedCards[3], "previous Card matches" );
	assert.equal( nextPlayedCard.nextToPlay, 'e', "next to play matches" ); 
	assert.deepEqual( nextPlayedCard.tableCards, { 'n' : cards[1], 'e' : cards[2], 's' : cards[3], 'w' : cards[0] }, "table cards match" );
	
	nextPlayedCard = playedCards[5];
	assert.equal( nextPlayedCard.get( "play_number" ), 5, "PlayNumber matches" );
	assert.equal( nextPlayedCard.get( "trump" ), trump, "Trump matches" );
	assert.equal( nextPlayedCard.get( "leader" ), leader, "Leader matches" );
	assert.equal( nextPlayedCard.get( "suit" ), 'd', "Suit matches" );
	assert.equal( nextPlayedCard.get( "rank" ), 'k', "Rank matches" ); 
	assert.equal( nextPlayedCard.get( "direction" ), playedCards[3].getDirection(), "Direction matches" ); 
	assert.equal( nextPlayedCard.get( "winning_card" ), playedCards[5], "Winning Card matches" ); 
	assert.equal( nextPlayedCard.get( "lead_card" ), playedCards[5], "lead Card matches" ); 
	assert.equal( nextPlayedCard.get( "ns_tricks" ), 0, "ns tricks matches" ); 
	assert.equal( nextPlayedCard.get( "ew_tricks" ), 1, "ew tricks matches" );
	assert.equal( nextPlayedCard.previousCard, playedCards[4], "previous Card matches" );
	assert.equal( nextPlayedCard.nextToPlay, 's', "next to play matches" );
	assert.deepEqual( nextPlayedCard.tableCards, { 'n' : null, 'e' : cards[4], 's' : null, 'w' : null }, "table cards match" );
});
