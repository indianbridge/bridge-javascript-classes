QUnit.module( "Bridge.Call" );
QUnit.test( "Constructor", function( assert ) {
	assert.throws(
		function() {
			var call = new Bridge.Call();
		},
		"Bridge.Call constructor needs 2 arguments"
	);	
	assert.throws(
		function() {
			var call = new Bridge.Call( "a" );
		},
		"Bridge.Call constructor needs valid call argument"
	);	
	
	assert.throws(
		function() {
			var call = new Bridge.Call( "p" );
		},
		"Bridge.Call constructor needs second argument"
	);		
	for( var direction in Bridge.directions ) {
		for( var i = 1; i <= 7; ++i ) {
			for( var bid in Bridge.calls ) {
				if ( Bridge.isStrain( bid ) ) {
					var call = new Bridge.Call( i + bid, direction );
					assert.equal( call.get( "direction" ), direction, "Direction matches" );
					assert.equal( call.get( "call" ), i + bid, "Call matches" );
					assert.equal( call.get( "annotation" ), "", "Annotation matches" );
					assert.equal( call.get( "explanation" ), "", "Explanation matches" ); 					
				}
				else {
					assert.throws(
						function() {
							var call = new Bridge.Call( i + bid, direction );
						},
						"Level not valid for non bid"
					);					
				}
			}
		}
		for( var bid in Bridge.calls ) {
			if ( !Bridge.isStrain( bid ) ) {
				var call = new Bridge.Call( bid, direction );
				assert.equal( call.get( "direction" ), direction, "Direction matches" );
				assert.equal( call.get( "call" ), bid, "Call matches" );
				assert.equal( call.get( "annotation" ), "", "Annotation matches" );
				assert.equal( call.get( "explanation" ), "", "Explanation matches" ); 				
			}
			else {
				assert.throws(
					function() {
						var call = new Bridge.Call( bid, direction );
					},
					"Missing Level for bid"
				);				
			}
		}		
	}	
});

QUnit.test( "Getter and Setter", function( assert ) {
	var call = "p";
	var direction = "n";
	var call = new Bridge.Call( call, direction );
	assert.throws(
		function() {
			call.set();
		},
		"Bridge.Call.set needs property argument"
	);
	assert.throws(
		function() {
			call.set( "name" );
		},
		"Bridge.Call.set needs a value argument"
	);	
	
	assert.throws(
		function() {
			call.set( "random_property", "value" );
		},
		"Bridge.Call.set valid property"
	);	
	assert.throws(
		function() {
			call.get();
		},
		"Bridge.Call.get needs property argument"
	);	
	assert.throws(
		function() {
			call.get( "random_property" );
		},
		"Bridge.Call.get needs a known property argument"
	);	
	var annotation = "some_annotation";
	call.set( "annotation", annotation );
	assert.equal( call.get( "annotation" ), annotation, "Annotation matches" );	
	var explanation = "some_explanation";
	call.set( "explanation", explanation );
	var output = "p(" + explanation + "){" + annotation + "}";
	assert.equal( call.get( "explanation" ), explanation, "Explanation matches" );
	assert.equal( call.toString(), output, "toString matches" );
	for( var direction in Bridge.directions ) {
		call.set( "direction", direction );
		assert.equal( call.get( "direction" ), direction, "Direction matches" );
	}
});
