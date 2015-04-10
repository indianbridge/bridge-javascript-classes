QUnit.module( "Bridge.Auction" );
QUnit.test( "Constructor", function( assert ) {
	var auction = new Bridge.Auction();
	assert.equal( auction.dealer, "n", "Default dealer" );
	assert.equal( auction.vulnerability, "-", "Default vul" );	
	assert.equal( auction.nextToCall, "n", "Default nextToCall" );	
	assert.equal( auction.calls.length, 0, "no calls" );
	assert.deepEqual( auction.contracts.length, 0, "no contracts" );	
});

QUnit.test( "Getter and Setter", function( assert ) {
	var auction = new Bridge.Auction();
	assert.equal( auction.get( "dealer" ), "n", "Default dealer" );
	for( var direction in Bridge.directions ) {
		auction.set( "dealer", direction );
		assert.equal( auction.get( "dealer" ), direction, "dealer matches" );
		assert.equal( auction.nextToCall, direction, "nextocall matches" );
	}
	assert.equal( auction.get ( "vulnerability" ), "-", "Default vul" );
	for( var vulnerability in Bridge.vulnerabilities ) {
		auction.set( "vulnerability", vulnerability );
		assert.equal( auction.get ( "vulnerability" ), vulnerability, "vul matches" );
	}	
	
	assert.equal( auction.get( "auction" ), "", "auction is empty" );
	assert.equal( auction.get( "contract" ).toString(), "", "contract is empty" );
	
	var bids = {
		"" : { dealer: "n", auction: "", contract: "" },
		"ppp" : { dealer: "n", auction: "ppp", contract: "" },
		"pppp" : { dealer: "n", auction: "pppp", contract: "" },
		"1c" : { dealer: "n", auction: "1c", contract: "1cn" },
		"1d" : { dealer: "e", auction: "1d", contract: "1de" },
		"1h" : { dealer: "s", auction: "1h", contract: "1hs" },
		"1s" : { dealer: "w", auction: "1s", contract: "1sw" },
		"p1c" : { dealer: "n", auction: "p1c", contract: "1ce" },
		"pp1c" : { dealer: "n", auction: "pp1c", contract: "1cs" },
		"ppp1c" : { dealer: "n", auction: "ppp1c", contract: "1cw" },
		"1c{precision}x" : { dealer: "n", auction: "1c{precision}x", contract: "1cxn" },
		"1cx(!)r" : { dealer: "n", auction: "1cx(!)r", contract: "1cxxn" },
		"p1cppx" : { dealer: "n", auction: "p1cppx", contract: "1cxe" },
		"p1cppxrp2hp2sp3nppp" : { dealer: "n", auction: "p1cppxrp2hp2sp3nppp", contract: "3nw" }
	};
	for( var bid in bids ) {
		auction = new Bridge.Auction();
		auction.setDealer( bids[ bid ].dealer );
		auction.set( "auction", bid );
		assert.equal( auction.get( "auction" ), bids[ bid ].auction, "auction matches" );
		assert.equal( auction.get( "contract" ).toString(), bids[ bid ].contract, "contract matches" );		
	}
	
	var contracts = {
		"1cn" : { dealer: "s", auction: "pp1cppp", contract: "1cn" },
		"1dn" : { dealer: "n", auction: "1dppp", contract: "1dn" },
		"6sxe" : { dealer: "n", auction: "p6sxppp", contract: "6sxe" },
		"4dxxs" : { dealer: "w", auction: "ppp4dxrppp", contract: "4dxxs" }
	};
	for( var contract in contracts ) {
		auction = new Bridge.Auction();
		auction.setDealer( contracts[ contract ].dealer );
		auction.set( "contract", contract );
		assert.equal( auction.get( "auction" ), contracts[ contract ].auction, "auction matches" );
		assert.equal( auction.get( "contract" ).toString(), contracts[ contract ].contract, "contract matches" );		
	}	
	
	var badBids = [ "a", "x", "r", "1cpppx", "1cr", "1cpx", "1cxpr", "1c[test]", "1c{test", "8c" ];
	_.each( badBids, function( bid ) {
		auction = new Bridge.Auction();
		assert.throws(
			function() {
				auction.set( "auction", bid );
			},
			"bad auction"
		);						
	}, this);

	var badContracts = [ "a", "4h", "1cx", "2sxx", "1cxr", "7nr", "cxe", "1sx", "5dxx" ];
	_.each( badContracts, function( contract ) {
		auction = new Bridge.Auction();
		assert.throws(
			function() {
				auction.set( "contract", contract );
			},
			"bad contract"
		);						
	}, this);
});

QUnit.test( "add remove calls", function( assert ) {
	var auction = new Bridge.Auction();
	assert.throws(
		function() {
			auction.addCall( "x" );
		},
		"double not allowed"
	);	
	auction.addCall( "p" );
	auction.addCall( "1c" );	
	assert.equal( auction.get( "auction" ), "p1c", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "1ce", "contract matches" );
	auction.removeCall();
	assert.equal( auction.get( "auction" ), "p", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "", "contract matches" );
	auction.addCall( "1c" );	
	assert.equal( auction.get( "auction" ), "p1c", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "1ce", "contract matches" );
	auction.addCall( "x" );	
	assert.equal( auction.get( "auction" ), "p1cx", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "1cxe", "contract matches" );
	auction.addCall( "r" );	
	assert.equal( auction.get( "auction" ), "p1cxr", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "1cxxe", "contract matches" );	
	auction.removeCall();
	assert.equal( auction.get( "auction" ), "p1cx", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "1cxe", "contract matches" );
	auction.addCall( "3n" );	
	assert.equal( auction.get( "auction" ), "p1cx3n", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );
	auction.addCall( "p" );	
	assert.equal( auction.get( "auction" ), "p1cx3np", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );
	auction.addCall( "p" );	
	assert.equal( auction.get( "auction" ), "p1cx3npp", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );
	auction.addCall( "p" );	
	assert.equal( auction.get( "auction" ), "p1cx3nppp", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );	
	assert.throws(
		function() {
			auction.addCall( "4n" );
		},
		"auction complete"
	);		
	auction.removeCall();
	auction.addAllPass();
	assert.equal( auction.get( "auction" ), "p1cx3nppp", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );
	auction.removeCall();
	auction.removeCall();
	auction.addAllPass();
	assert.equal( auction.get( "auction" ), "p1cx3nppp", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );
	auction.removeCall();	
	auction.removeCall();
	auction.removeCall();
	auction.addAllPass();
	assert.equal( auction.get( "auction" ), "p1cx3nppp", "auction matches" );
	assert.equal( auction.get( "contract" ).toString(), "3nw", "contract matches" );							
});
