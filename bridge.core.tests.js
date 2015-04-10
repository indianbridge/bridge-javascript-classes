QUnit.module( "Bridge Core" );
QUnit.test( "Directions", function( assert ) {
	Bridge._checkDirection( "n" );
	Bridge._checkDirection( "e" );
	Bridge._checkDirection( "s" );
	Bridge._checkDirection( "w" );
	assert.throws(
		function() {
			Bridge._checkDirection();
		},
		"No Direction specified should throw exception"
	);
	
	assert.throws(
		function() {
			Bridge._checkDirection(null);
		},
		"Null Direction specified should throw exception"
	);	

	var Direction;
	assert.throws(
		function() {
			Bridge._checkDirection( Direction );
		},
		"undefined Direction specified should throw exception"
	);	

	assert.throws(
		function() {
			Bridge._checkDirection( "a" );
		},
		"Bad Direction specified should throw exception"
	);	
	
	// LHO
	var lho = { "n" : "e", "e" : "s", "s" : "w", "w" : "n" };
	for( var direction in lho ) {
		assert.equal( Bridge.getLHO( direction ), lho[ direction ], lho[ direction ] + " is lho of " + direction );
	}
	
	// RHO
	var rho = { "n" : "w", "e" : "n", "s" : "e", "w" : "s" };
	for( var direction in rho ) {
		assert.equal( Bridge.getRHO( direction ), rho[ direction ], rho[ direction ] + " is rho of " + direction );
	}	
	
	// Partner
	var partner = { "n" : "s", "e" : "w", "s" : "n", "w" : "e" };
	for( var direction in partner ) {
		assert.equal( Bridge.getPartner( direction ), partner[ direction ], partner[ direction ] + " is partner of " + direction );
	}	
	
	// opponents
	for( var direction in lho ) {
		assert.ok( Bridge.areOpponents( direction, lho[ direction ] ), direction + " and  " + lho[ direction] + " are opponents" );
	}
	for( var direction in rho ) {
		assert.ok( Bridge.areOpponents( direction, rho[ direction ] ), direction + " and  " + rho[ direction] + " are opponents" );
	}		
	// Not opponents
	for( var direction in partner ) {
		assert.ok( !Bridge.areOpponents( direction, partner[ direction ] ), partner[ direction ] + " is not opponent of " + direction );
	}	
	
	// not partners
	for( var direction in lho ) {
		assert.ok( !Bridge.arePartners( direction, lho[ direction ] ), direction + " and  " + lho[ direction] + " are not partners" );
	}
	for( var direction in rho ) {
		assert.ok( !Bridge.arePartners( direction, rho[ direction ] ), direction + " and  " + rho[ direction] + " are not partners" );
	}		
	// partners
	for( var direction in partner ) {
		assert.ok( Bridge.arePartners( direction, partner[ direction ] ), partner[ direction ] + " is partner of " + direction );
	}		
});

QUnit.test( "Suits", function( assert ) {
	Bridge._checkSuit( "s" );
	Bridge._checkSuit( "h" );
	Bridge._checkSuit( "d" );
	Bridge._checkSuit( "c" );
	assert.throws(
		function() {
			Bridge._checkSuit();
		},
		"No suit specified should throw exception"
	);
	
	assert.throws(
		function() {
			Bridge._checkSuit(null);
		},
		"Null suit specified should throw exception"
	);	

	var suit;
	assert.throws(
		function() {
			Bridge._checkSuit( suit );
		},
		"undefined suit specified should throw exception"
	);	

	assert.throws(
		function() {
			Bridge._checkSuit( "n" );
		},
		"Bad suit specified should throw exception"
	);	
	
});

QUnit.test( "Calls", function( assert ) {
	Bridge._checkCall( "n" );
	Bridge._checkCall( "s" );
	Bridge._checkCall( "h" );
	Bridge._checkCall( "d" );
	Bridge._checkCall( "c" );
	Bridge._checkCall( "p" );
	Bridge._checkCall( "x" );
	Bridge._checkCall( "r" );

	assert.throws(
		function() {
			Bridge._checkCall();
		},
		"No suit specified should throw exception"
	);
	
	assert.throws(
		function() {
			Bridge._checkCall(null);
		},
		"Null suit specified should throw exception"
	);	

	var suit;
	assert.throws(
		function() {
			Bridge._checkCall( suit );
		},
		"undefined suit specified should throw exception"
	);	

	assert.throws(
		function() {
			Bridge._checkSuit( "a" );
		},
		"Bad suit specified should throw exception"
	);	
	
	var bids = [ "n", "s", "h", "d", "c" ];
	for ( var i = 0; i < bids.length; ++i ) {
		assert.ok( Bridge.isBid( bids[i] ), bids[i] + " is a bid" );
	}
	var notBids = [ "p", "x", "r", "a", "", " " ];
	for ( var i = 0; i < notBids.length; ++i ) {
		assert.ok( !Bridge.isBid( notBids[i] ), notBids[i] + " is not a bid" );
	}	
});

QUnit.test( "Level", function( assert ) {
	for( var i = 1; i <= 7; ++i ) {
		Bridge._checkLevel(i);
		var level = "" + i;
		Bridge._checkLevel( level );
	}
	assert.throws(
		function() {
			Bridge._checkLevel();
		},
		"No Level specified should throw exception"
	);
	assert.throws(
		function() {
			Bridge._checkLevel(0);
		},
		"1 is minimum level"
	);		
	assert.throws(
		function() {
			Bridge._checkLevel(8);
		},
		"7 is maximum level"
	);	
	assert.throws(
		function() {
			Bridge._checkLevel("");
		},
		"has to be number"
	);	
	assert.throws(
		function() {
			Bridge._checkLevel("s");
		},
		"has to be number"
	);		
});

QUnit.test( "Bids", function( assert ) {
	for( var i = 1; i <= 7; ++i ) {
		for( var call in Bridge.calls ) {
			if ( Bridge.isBid( call ) ) {
				Bridge._checkBid( i + call );
				assert.throws(
					function() {
						Bridge._checkBid( call );
					},
					"Missing level"
				);				
			}
			else {
				Bridge._checkBid( call );
				assert.throws(
					function() {
						Bridge._checkBid( i + call );
					},
					"Level should not be specified"
				);				
			}
		}
	}
	assert.throws(
		function() {
			Bridge._checkBid();
		},
		"Length has to be 1 or 2"
	);	
	assert.throws(
		function() {
			Bridge._checkBid(null);
		},
		"Length has to be 1 or 2"
	);		
	assert.throws(
		function() {
			Bridge._checkBid("");
		},
		"Length has to be 1 or 2"
	);	
	assert.throws(
		function() {
			Bridge._checkBid( "a" );
		},
		"Length has to be 1 or 2"
	);	
	assert.throws(
		function() {
			Bridge._checkBid( "1cd" );
		},
		"Length has to be 1 or 2"
	);				
});

QUnit.test( "Ranks", function( assert ) {
	Bridge._checkRank( "a" );
	Bridge._checkRank( "k" );
	Bridge._checkRank( "q" );
	Bridge._checkRank( "j" );
	Bridge._checkRank( "t" );
	Bridge._checkRank( "9" );
	Bridge._checkRank( "8" );
	Bridge._checkRank( "7" );	
	Bridge._checkRank( "6" );
	Bridge._checkRank( "5" );
	Bridge._checkRank( "4" );
	Bridge._checkRank( "3" );
	Bridge._checkRank( "2" );	
	assert.throws(
		function() {
			Bridge._checkRank();
		},
		"No Rank specified should throw exception"
	);
	
	assert.throws(
		function() {
			Bridge._checkRank(null);
		},
		"Null Rank specified should throw exception"
	);	

	var Rank;
	assert.throws(
		function() {
			Bridge._checkRank( Rank );
		},
		"undefined Rank specified should throw exception"
	);	

	assert.throws(
		function() {
			Bridge._checkRank( "n" );
		},
		"Bad Rank specified should throw exception"
	);	
});

QUnit.test( "Vulnerabilities", function( assert ) {
	Bridge._checkVulnerability( "-" );
	Bridge._checkVulnerability( "n" );
	Bridge._checkVulnerability( "e" );
	Bridge._checkVulnerability( "b" );
	assert.throws(
		function() {
			Bridge._checkVulnerability();
		},
		"No Vulnerability specified should throw exception"
	);
	
	assert.throws(
		function() {
			Bridge._checkVulnerability(null);
		},
		"Null Vulnerability specified should throw exception"
	);	

	var Vulnerability;
	assert.throws(
		function() {
			Bridge._checkVulnerability( Vulnerability );
		},
		"undefined Vulnerability specified should throw exception"
	);	

	assert.throws(
		function() {
			Bridge._checkVulnerability( "a" );
		},
		"Bad Vulnerability specified should throw exception"
	);	
});

QUnit.test( "MakeIdentifier", function( assert ) {
	var values = {
		"" : "",
		" " : "",
		"abc" : "abc",
		" abc   " : "abc",
		"sriram narasimhan" : "sriram_narasimhan",
		"Bridge+Winners" : "Bridge_Winners",
		"Bridge Base Online" : "Bridge_Base_Online",
		"test_case" : "test_case",
		"a+b-c=d" : "a_b_c_d",
		"double  space" : "double_space",
		"a+=b-+*&^%c" : "a_b_c"
	};
	for( var value in values ) {
		assert.equal( Bridge.makeIdentifier( value ), values[ value ], value + " converted to identifier is " + values[ value ] );
	}
});

QUnit.test( "getHash", function( assert ) {
	var values = {
		"#" : {},
		"#a" : { "a" : true },
		"#a=b" : { "a" : "b" },
		"#a=1" : { "a" : "1" },
		"#name=sriram" : { "name" : "sriram" },
		"#name=sriram&advanced" : { "name" : "sriram", "advanced" : true },
		"#name=sriram&level=advanced" : { "name" : "sriram", "level" : "advanced" },
		"name=sriram" : { "name" : "sriram" }
	};
	for( var value in values ) {
		location.hash = value;
		var parameters = Bridge.getHash();
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}
	
	// With delimiter
	var delimiter = "?";
	values = {
		"#name=sriram?level=advanced" : { "name" : "sriram" },
		"#name=sriram?advanced" : { "name" : "sriram" },
		"#name=sriram&level=advanced?name=narasimhan" : { "name" : "sriram", "level" : "advanced" }
	};
	for( var value in values ) {
		location.hash = value;
		var parameters = Bridge.getHash( delimiter );
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}	
	location.hash = "";
});

QUnit.test( "getQuery", function( assert ) {
	var values = {
		"?" : {},
		"?a" : { "a" : true },
		"?a=b" : { "a" : "b" },
		"?a=1" : { "a" : "1" },
		"?name=sriram" : { "name" : "sriram" },
		"?name=sriram&advanced" : { "name" : "sriram", "advanced" : true },
		"?name=sriram&level=advanced" : { "name" : "sriram", "level" : "advanced" },
		"name=sriram" : {}
	};
	var url = document.URL;
	for( var value in values ) {
		var text = url + value;
		var parameters = Bridge._getQuery( text );
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}
	
	// With delimiter
	var delimiter = "#";
	values = {
		"?name=sriram#level=advanced" : { "name" : "sriram" },
		"?name=sriram#advanced" : { "name" : "sriram" },
		"?name=sriram&level=advanced#name=narasimhan" : { "name" : "sriram", "level" : "advanced" }
	};
	for( var value in values ) {
		var text = url + value;
		var parameters = Bridge._getQuery( text, delimiter );
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}	
});

QUnit.test( "_parseParameterValues", function( assert ) {
	var values = {
		"" : {},
		"a" : { "a" : true },
		"a=b" : { "a" : "b" },
		"a=1" : { "a" : "1" },
		"name=sriram" : { "name" : "sriram" },
		"name=sriram&advanced" : { "name" : "sriram", "advanced" : true },
		"name=sriram&level=advanced" : { "name" : "sriram", "level" : "advanced" }
	};
	for( var value in values ) {
		var parameters = Bridge._parseParameterValues( value );
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}
	
	// With delimiter
	values = {
		"name#sriram?level#advanced" : { "name" : "sriram", "level" : "advanced" },
		"name#sriram?advanced" : { "name" : "sriram", "advanced" : true },
		"name#sriram?level#advanced?name#narasimhan" : { "name" : "narasimhan", "level" : "advanced" }
	};
	for( var value in values ) {
		var parameters = Bridge._parseParameterValues( value, "?", "#" );
		var result = values[ value ];
		assert.deepEqual( parameters, result, JSON.stringify( parameters ) + " should match " + JSON.stringify( result ) );
	}	
});

QUnit.test( "assignDefault", function( assert ) {
	var variable;
	variable = Bridge.assignDefault( variable );
	assert.equal( typeof variable, "undefined", "Default value was undefined");
	assert.ok( !variable, "variable is undefined");
	var values = [ 1, true, "test" ];
	for( var i = 0; i < values.length; ++i ) {
		variable = undefined
		var value = values[i];
		variable = Bridge.assignDefault( variable, value );
		assert.strictEqual( variable, value, "default is " + value );
	}
	for( var i = 0; i < values.length; ++i ) {
		var value = values[i];
		variable = Bridge.assignDefault( variable, value );
		assert.strictEqual( variable, "test", "variable should be equal to test" );
	}	
});

QUnit.test( "reportError", function( assert ) {
	var context = "Test";
	var error = "Some Error";
	assert.throws(
		function() {
			Bridge._reportError( error );
		},
		function( err ) {
			return err.message === error;
		},
		"raised error instance satisfies the callback function"
	);
	
	assert.throws(
		function() {
			Bridge._reportError( error, context );
		},
		function( err ) {
			return err.message === error;
		},
		"raised error instance satisfies the callback function"
	);	
	
	Bridge.options.useContextInErrorMessage = true;
	assert.throws(
		function() {
			Bridge._reportError( error, context );
		},
		function( err ) {
			return err.message === context + " - " + error;
		},
		"raised error instance satisfies the callback function"
	);		
});


QUnit.test( "parseContainedText", function( assert ) {
	var values = {
		"{test}" : { start:0, delimiter: "}", result: { "position": 5, "text": "test" } },
		"sriram[narasim{han}]" : { start:6, delimiter: "]", result: { "position": 19, "text": "narasim{han}" } },
	};
	for( var value in values ) {
		var result = values[ value ].result;
		var text = Bridge._parseContainedText( value, values[ value ].start, values[ value ].delimiter );
		assert.deepEqual( text, result, text + " should match " + result );
	}
	values = {
		"{test" : { start:0, delimiter: "}", result: { "position": 5, "text": "test" } },
		"sriram[narasim{han}" : { start:6, delimiter: "]", result: { "position": 19, "text": "narasim{han}" } },
	};	
	assert.throws(
		function() {
			var result = values[ value ].result;
			var text = Bridge._parseContainedText( value, values[ value ].start, values[ value ].delimiter );
		},
		"No closing delimiter"
	);	
});
