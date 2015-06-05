QUnit.module( "Bridge.PlayedCard" );
QUnit.test( "Constructor", function( assert ) {
	assert.throws(
		function() {
			var playedCard = new Bridge.PlayedCard();
		},
		"Bridge.PlayedCard constructor needs 3 arguments"
	);	
	assert.throws(
		function() {
			var call = new Bridge.Call( "a" );
		},
		"Bridge.Hand constructor needs valid call argument"
	);	
	
	assert.throws(
		function() {
			var call = new Bridge.Call( "p" );
		},
		"Bridge.Hand constructor needs second argument"
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
