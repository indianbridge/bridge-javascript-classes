QUnit.module( "Bridge.Play" );
QUnit.test( "Constructor", function( assert ) {
	var play = new Bridge.Play();
	var trump = 'n';
	var leader = 'w';
	assert.equal( play.deal, null, "Deal matches" );	
	assert.equal( play.id, null, "id matches" );	
	assert.equal( play.plays.length, 53, "num plays matches" );	
	for( var i = 1; i <= 52; ++i ) {
		assert.equal( play.plays[i], null, "Play " + i + " matches" );	
	}
	assert.equal( play.lastPlayIndex, 0, "Last play index matches" );	
	assert.equal( play.trump, trump, "Default trump" );
	assert.equal( play.leader, leader, "Default leader" );	
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( !play.cardAdded[ suit ][ rank ], "Card Added status matches" );
		}
	}	
	var dummyPlay = play.plays[0];
	assert.equal( dummyPlay.getPlayNumber(), 0, "Play Number matches" );
	assert.equal( dummyPlay.getTrump(), trump, "Play Number matches" );
	assert.equal( dummyPlay.getLeader(), leader, "Play Number matches" );
});

QUnit.test( "Getter and Setter", function( assert ) {
	var play = new Bridge.Play();
	// ID
	var id = "random id";
	play.setID(id);
	assert.equal( play.get( "id" ), id, "id matches" );
	assert.equal( play.getID(), id, "id matches" );
	
	// Trump
	for( var call in Bridge.calls ) {
		if ( Bridge.isStrain( call ) ) {
			play.setTrump( call );
			assert.equal( play.get( "trump" ), call, "trump matches" );
			assert.equal( play.getTrump(), call, "trump matches" );
		}
		else {
			assert.throws(
				function() {
					play.setTrump( call );
				},
				"Bridge.Play.setTrump got a bad strain " + call
			);	
		}
	}
	
	// Leader
	for( var direction in Bridge.directions ) {
		play.setLeader( direction );
		assert.equal( play.get( "leader" ), direction, "Leader matches" );
		assert.equal( play.getLeader(), direction, "Leader matches" );
	}
	var leader = 'a';
	assert.throws(
		function() {
			play.setLeader( leader );
		},
		"Bridge.Play.setLeader got a bad direction " + leader
	);
	
	// Play
	var playString = 'sasksqsj';
	play.setPlay( playString );	
	assert.equal( play.get( "play" ), playString, "play matches" );
	assert.equal( play.getPlay(), playString, "play matches" );
});

QUnit.test( "add remove cards", function( assert ) {
	var play = new Bridge.Play();
	play.addCard( 's', 'a' );
	assert.equal( play.get( "play" ), "sa", "play matches" );	
	assert.equal( play.lastPlayIndex, 1, "play index matches" );
	assert.throws(
		function() {
			play.addCard( 's', 'a' );
		},
		"Bridge.Play.addCard - already added"
	);
	play.addCard( 'h', 'k' );	
	assert.equal( play.get( "play" ), "sahk", "play matches" );	
	assert.equal( play.lastPlayIndex, 2, "play index matches" );	
	play.addCard( 'd', 'q' );	
	assert.equal( play.get( "play" ), "sahkdq", "play matches" );	
	assert.equal( play.lastPlayIndex, 3, "play index matches" );	
	play.addCard( 'c', 't' );	
	assert.equal( play.get( "play" ), "sahkdqct", "play matches" );	
	assert.equal( play.lastPlayIndex, 4, "play index matches" );
	play.removeCard();	
	assert.equal( play.get( "play" ), "sahkdq", "play matches" );	
	assert.equal( play.lastPlayIndex, 3, "play index matches" );
	play.removeCard();
	assert.equal( play.get( "play" ), "sahk", "play matches" );	
	assert.equal( play.lastPlayIndex, 2, "play index matches" );	
	play.removeCard();
	assert.equal( play.get( "play" ), "sa", "play matches" );	
	assert.equal( play.lastPlayIndex, 1, "play index matches" );
	play.removeCard();
	assert.equal( play.get( "play" ), "", "play matches" );	
	assert.equal( play.lastPlayIndex, 0, "play index matches" );
	assert.throws(
		function() {
			play.removeCard();
		},
		"Bridge.Play.removeCard - no more cards to remove"
	);
	play.addCard( 's', 'a' );
	assert.equal( play.get( "play" ), "sa", "play matches" );	
	assert.equal( play.lastPlayIndex, 1, "play index matches" );
	play.addCard( 'h', 'k' );	
	assert.equal( play.get( "play" ), "sahk", "play matches" );	
	assert.equal( play.lastPlayIndex, 2, "play index matches" );	
	play.addCard( 'd', 'q' );	
	assert.equal( play.get( "play" ), "sahkdq", "play matches" );	
	assert.equal( play.lastPlayIndex, 3, "play index matches" );	
	play.addCard( 'c', 't' );	
	assert.equal( play.get( "play" ), "sahkdqct", "play matches" );	
	assert.equal( play.lastPlayIndex, 4, "play index matches" );
	play.clearCards();
	assert.equal( play.get( "play" ), "", "play matches" );	
	assert.equal( play.lastPlayIndex, 0, "play index matches" );
	play.clearCards();
	assert.equal( play.get( "play" ), "", "play matches" );	
	assert.equal( play.lastPlayIndex, 0, "play index matches" );
	play.addCard( 's', 'a' );
	assert.equal( play.get( "play" ), "sa", "play matches" );	
	assert.equal( play.lastPlayIndex, 1, "play index matches" );
	play.addCard( 'h', 'k' );	
	assert.equal( play.get( "play" ), "sahk", "play matches" );	
	assert.equal( play.lastPlayIndex, 2, "play index matches" );	
	play.addCard( 'd', 'q' );	
	assert.equal( play.get( "play" ), "sahkdq", "play matches" );	
	assert.equal( play.lastPlayIndex, 3, "play index matches" );	
	play.addCard( 'c', 't' );	
	assert.equal( play.get( "play" ), "sahkdqct", "play matches" );	
	assert.equal( play.lastPlayIndex, 4, "play index matches" );
	play.removeCard();
	play.removeCard();
	play.addCard( 'c', 'q' );
	play.addCard( 'd', 't' );
	assert.equal( play.get( "play" ), "sahkcqdt", "play matches" );	
	assert.equal( play.lastPlayIndex, 4, "play index matches" );
});

QUnit.test( "play undo cards", function( assert ) {
	var play = new Bridge.Play();
	play.set( "play", "sasksqsjsts9s8s7s6s5s4s3s2hahkhqhjhth9h8h7h6h5h4h3h2dadkdqdjdtd9d8d7d6d5d4d3d2cackcqcjctc9c8c7c6c5c4c3c2");
	assert.equal(play.deal, null, "Deal matches");
	assert.equal(play.id, null, "Id matches");
	for ( var i = 0; i <= 52; ++i ) {
		assert.notEqual( play.plays[i], null, "Play exists");
	}
	assert.equal(play.lastPlayIndex, 52, "last play index matches");
	assert.equal(play.currentPlayIndex, 0, "current index matches");
	for ( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok(play.cardAdded[ suit ][ rank ], suit + rank + " Card added");
		}
	}
	for ( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok(!play.cardPlayed[ suit ][ rank ], suit + rank + " Card not played");
		}
	}
	assert.equal(play.leader, 'w', "leader matches");
	assert.equal(play.trump , 'n', "trump matches");
	for ( var i = 1; i <= 52; ++i ) {
		play.playCard();
		assert.equal(play.currentPlayIndex, i, "current play index matches");
	}
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( play.cardPlayed[ suit ][ rank ], suit + rank + " played" );
		}
	}
	assert.throws(
		function() {
			play.playCard();
		},
		"cannot play past the last card "
	);
	for ( var i = 1; i <= 52; ++i ) {
		play.undoPlayCard();
		assert.equal(play.currentPlayIndex, 52-i, "current play index matches");
	}
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( !play.cardPlayed[ suit ][ rank ], suit + rank + " undo played" );
		}
	}
	assert.throws(
		function() {
			play.undoPlayCard();
		},
		"cannot undo play past the first card "
	);
	
	for ( var i = 1; i <= 13; ++i ) {
		play.playTrick();
		assert.equal(play.currentPlayIndex, i*4, "current play index matches");
	}
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( play.cardPlayed[ suit ][ rank ], suit + rank + " played" );
		}
	}
	assert.throws(
		function() {
			play.playCard();
		},
		"cannot play past the last card "
	);
	for ( var i = 1; i <= 13; ++i ) {
		play.undoPlayTrick();
		assert.equal(play.currentPlayIndex, (13-i)*4, "current play index matches");
	}
	assert.throws(
		function() {
			play.undoPlayCard();
		},
		"cannot undo play past the first card "
	);
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( !play.cardPlayed[ suit ][ rank ], suit + rank + " undo played" );
		}
	}
	play.playAll();
	assert.throws(
		function() {
			play.playCard();
		},
		"cannot play past the last card "
	);
	play.undoPlayAll();
	assert.throws(
		function() {
			play.undoPlayCard();
		},
		"cannot undo play past the first card "
	);
	assert.throws(
		function() {
			play.undoPlayTrick();
		},
		"cannot undo play past the first card "
	);
	for( var suit in Bridge.suits ) {
		for( var rank in Bridge.ranks ) {
			assert.ok( !play.cardPlayed[ suit ][ rank ], suit + rank + " undo played" );
		}
	}
	play.playCard();
	play.playTrick();
	assert.equal(play.currentPlayIndex, 4, "current play index matches");
	play.playCard();
	play.playCard();
	play.playTrick();
	assert.equal(play.currentPlayIndex, 8, "current play index matches");
	play.playCard();
	play.playCard();
	play.playCard();
	play.playTrick();	
	assert.equal(play.currentPlayIndex, 12, "current play index matches");
	play.playCard();
	play.playCard();
	play.playCard();
	play.playCard();
	play.playTrick();	
	assert.equal(play.currentPlayIndex, 20, "current play index matches");
	play.undoPlayCard();
	assert.equal(play.currentPlayIndex, 19, "current play index matches");
	play.undoPlayTrick();
	assert.equal(play.currentPlayIndex, 16, "current play index matches");
	play.undoPlayCard();
	play.undoPlayTrick();
	assert.equal(play.currentPlayIndex, 12, "current play index matches");
	play.undoPlayCard();
	play.undoPlayCard();
	play.undoPlayTrick();
	assert.equal(play.currentPlayIndex, 8, "current play index matches");
	play.undoPlayCard();
	play.undoPlayCard();
	play.undoPlayCard();
	play.undoPlayTrick();
	assert.equal(play.currentPlayIndex, 4, "current play index matches");
});

QUnit.test( "from to string", function( assert ) {
	var play = new Bridge.Play();
	var playStrings = [
		"ct",
		"sasksqsjsts9s8s7s6s5s4s3s2hahkhqhjhth9h8h7h6h5h4h3h2dadkdqdjdtd9d8d7d6d5d4d3d2cackcqcjctc9c8c7c6c5c4c3c2",
		"sa{test}"
	];
	_.each( playStrings, function( playString ) {
		play.fromString( playString );
		assert.equal( play.toString(), playString, "play string matches" );
	});
	
	var badPlayStrings = [
		"x",
		"cts",
		"sasa",
		"sa{test"
	];
	_.each( badPlayStrings, function( playString ) {
		assert.throws(
			function() {
				play.fromString( playString );
			},
			"invalid play string"
		);
	});
	
	play = new Bridge.Play();
	var annotation = "Ruffing with Ace";
	play.addCard( 's', 'a' );
	play.addCard( 'h', 'a', annotation );
	assert.equal( play.toString(), "saha{" + annotation + "}", "playstring matches");
});
