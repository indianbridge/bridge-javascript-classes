QUnit.module( "Bridge.Contract" );
QUnit.test( "Constructor", function( assert ) {
	var contract = new Bridge.Contract();
	assert.equal( contract.level, null, "level is null" );
	assert.equal( contract.suit, null, "suit is null" );
	assert.ok( !contract.doubled, "not doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, null, "declarer is null" );
	for( var call in Bridge.calls ) {
		for ( var direction in Bridge.directions) {
			if ( Bridge.isBid( call ) ) {
				assert.equal( contract.firstToBid[ call ][ direction ], null, "First bid for " + call + direction + " is null" );
			}			
		}
	}	
	assert.equal( contract.numPasses, 0, "0 passes" );
	assert.ok( !contract.isComplete, "auction not complete" );
});

QUnit.test( "Other methods", function( assert ) {
	var contract = new Bridge.Contract();
	var clone = contract.clone();
	assert.deepEqual( contract, clone, "clone should be same" );
	var calls = [ "p", "p", "p" ];
	contract = new Bridge.Contract();
	var direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, null, "level matches" );
	assert.equal( contract.suit, null, "suit matches" );
	assert.ok( !contract.doubled, "not doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, null, "declarer matches" );
	assert.equal( contract.numPasses, 3, "3 passes" );
	assert.ok( !contract.isComplete, "auction not complete" );
	var allowedCalls = contract.allowedCalls( direction );
	assert.ok( allowedCalls[ "p" ] );
	assert.ok( !allowedCalls[ "x" ] );
	assert.ok( !allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( allowedCalls[ "1c" ] );
	assert.ok( allowedCalls[ "7n" ] );
	
	var calls = [ "p", "p", "p", "p" ];
	contract = new Bridge.Contract();
	var direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, null, "level matches" );
	assert.equal( contract.suit, null, "suit matches" );
	assert.ok( !contract.doubled, "not doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, null, "declarer matches" );
	assert.equal( contract.numPasses, 4, "4 passes" );
	assert.ok( contract.isComplete, "auction iscomplete" );	
	var allowedCalls = contract.allowedCalls( direction );
	assert.ok( !allowedCalls[ "p" ] );
	assert.ok( !allowedCalls[ "x" ] );
	assert.ok( !allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( !allowedCalls[ "1c" ] );
	assert.ok( !allowedCalls[ "7n" ] );			
	
	calls = [ "1c", "p", "p", "1h", "p" ];
	contract = new Bridge.Contract();
	var direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, 1, "level matches" );
	assert.equal( contract.suit, 'h', "suit matches" );
	assert.ok( !contract.doubled, "not doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, "w", "declarer matches" );
	assert.equal( contract.firstToBid[ "c" ][ "n" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "c" ][ "s" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "e" ], "w", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "w" ], "w", "First bid for c is n" );	
	assert.equal( contract.numPasses, 1, "1 passes" );
	assert.ok( !contract.isComplete, "auction not complete" );	
	allowedCalls = contract.allowedCalls( direction );
	assert.ok( allowedCalls[ "p" ] );
	assert.ok( !allowedCalls[ "x" ] );
	assert.ok( !allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( !allowedCalls[ "1h" ] );
	assert.ok( allowedCalls[ "1s" ] );		
	
	calls = [ "1c", "p", "p", "1h", "p", "2h" ];
	contract = new Bridge.Contract();
	var direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, 2, "level matches" );
	assert.equal( contract.suit, 'h', "suit matches" );
	assert.ok( !contract.doubled, "not doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, "w", "declarer matches" );
	assert.equal( contract.firstToBid[ "c" ][ "n" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "c" ][ "s" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "e" ], "w", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "w" ], "w", "First bid for c is n" );	
	assert.equal( contract.numPasses, 0, "0 passes" );
	assert.ok( !contract.isComplete, "auction not complete" );	
	allowedCalls = contract.allowedCalls( direction );
	assert.ok( allowedCalls[ "p" ] );
	assert.ok( allowedCalls[ "x" ] );
	assert.ok( !allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( !allowedCalls[ "2h" ] );
	assert.ok( allowedCalls[ "2s" ] );
	
	calls = [ "1h", "p", "p", "2h", "p", "3h", "x", "p", "p", ];
	contract = new Bridge.Contract();
	var direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, 3, "level matches" );
	assert.equal( contract.suit, 'h', "suit matches" );
	assert.ok( contract.doubled, "doubled" );
	assert.ok( !contract.redoubled, "not redoubled" );
	assert.equal( contract.declarer, "w", "declarer matches" );
	assert.equal( contract.firstToBid[ "h" ][ "n" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "s" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "e" ], "w", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "w" ], "w", "First bid for c is n" );	
	assert.equal( contract.numPasses, 2, "2 passes" );
	assert.ok( !contract.isComplete, "auction not complete" );	
	allowedCalls = contract.allowedCalls( direction );
	assert.ok( allowedCalls[ "p" ] );
	assert.ok( !allowedCalls[ "x" ] );
	assert.ok( allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( !allowedCalls[ "2h" ] );
	assert.ok( allowedCalls[ "3s" ] );		
		
	var calls = [ "1c", "p", "p", "1h", "p", "2h", "x", "r", "p", "p", "p" ];
	contract = new Bridge.Contract();
	direction = "n";
	_.each( calls, function( call ) {
		var call = new Bridge.Call( call, direction );
		direction = Bridge.getLHO( direction );
		contract.update( call );
	}, this);
	assert.equal( contract.level, 2, "level matches" );
	assert.equal( contract.suit, 'h', "suit matches" );
	assert.ok( contract.doubled, "doubled" );
	assert.ok( contract.redoubled, "redoubled" );
	assert.equal( contract.declarer, "w", "declarer matches" );
	assert.equal( contract.firstToBid[ "c" ][ "n" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "c" ][ "s" ], "n", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "e" ], "w", "First bid for c is n" );	
	assert.equal( contract.firstToBid[ "h" ][ "w" ], "w", "First bid for c is n" );	
	assert.equal( contract.numPasses, 3, "1 passes" );
	assert.ok( contract.isComplete, "auction is complete" );	
	allowedCalls = contract.allowedCalls( direction );
	assert.ok( !allowedCalls[ "p" ] );
	assert.ok( !allowedCalls[ "x" ] );
	assert.ok( !allowedCalls[ "r" ] );
	assert.ok( allowedCalls[ "u" ] );
	assert.ok( !allowedCalls[ "1c" ] );
	assert.ok( !allowedCalls[ "7n" ] );	
});
