QUnit.module( "Bridge.Card" );
QUnit.test( "Constructor", function( assert ) {
	assert.throws(
		function() {
			var card = new Bridge.Card();
		},
		"Bridge.Card constructor needs 2 arguments"
	);	
	
	assert.throws(
		function() {
			var card = new Bridge.Call( "a" );
		},
		"Bridge.Card constructor needs valid suit argument"
	);	
	
	assert.throws(
		function() {
			var card = new Bridge.Call( "s" );
		},
		"Bridge.card constructor needs second rank argument"
	);	
	
	assert.throws(
		function() {
			var card = new Bridge.Call( "s", "s" );
		},
		"Bridge.card constructor needs valid rank argument"
	);	
	
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			var card = new Bridge.Card( suit, rank );
			assert.equal( card.get( "suit" ), suit, "Suit " + suit + " matches" );
			assert.equal( card.get( "rank" ), rank, "Rank " + rank + " matches" );
			assert.equal( card.get( "direction" ), null, "Direction is null" );
		}
	}		
});

QUnit.test( "Getter and Setters", function( assert ) {
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			var card = new Bridge.Card( suit, rank );
			assert.equal( card.get( "suit" ), suit, "Suit " + suit + " matches" );
			assert.equal( card.get( "rank" ), rank, "Rank " + rank + " matches" );			
			for( var direction in Bridge.directions ) {
				card.set( "direction", direction );
				assert.equal( card.get( "direction" ), direction, "Direction " + direction + "matches" );
			}
		}
	}		
});

