$(function() {
	try {		
		var deal = new Bridge.Deal();
		deal.fromString( "b=4&d=n&v=-&t=test&n=skj976ht62d542c73&s=sq43h3daj9ckjt842&w=st82hak98dt8763cq&a=-6hxe" );
		var json = deal.toJSON();
		deal.fromJSON(json);
		//deal.fromString( deal.toString() );
		//deal.assignRest();
		$( "#output" ).append( deal.toHTML() );
		/*Bridge.useContext = true;
		var dealString;
		if ( !dealString ) dealString = "{}";
		dealString = JSON.parse(dealString);
		
		_.defaults( dealString, { "dealer": "n" } );
		alert( JSON.stringify(dealString) );
		return;
		var deal = new Bridge.Deal(); 	
    	//var linString = unescape( "pn|joy79,nsriram,rk5074,sandipdang|st%7C%7Cmd%7C3S23JQAH39AD89JKCA%2CS7KH6D3457TAC238T%2CS459H78TJQKD2QC9K%2C%7Crh%7C%7Cah%7CBoard%201%7Csv%7Co%7Cmb%7C1H%7Cmb%7Cp%7Cmb%7C4N%7Cmb%7Cp%7Cmb%7C5C%7Cmb%7Cp%7Cmb%7C6H%7Cmb%7Cp%7Cmb%7Cp%7Cmb%7Cp%7Cpc%7CD6%7Cpc%7CD8%7Cpc%7CDA%7Cpc%7CD2%7Cpc%7CDT%7Cpc%7CDQ%7Cpc%7CH2%7Cpc%7CD9%7Cpc%7CS6%7Cpc%7CSA%7Cpc%7CS7%7Cpc%7CS5%7Cpc%7CH3%7Cpc%7CH6%7Cpc%7CHQ%7Cpc%7CH4%7Cmc%7C11%7C" );
    	//deal.loadBBOLinString( linString );
    	var auctionString = "pp1c{precision}xppp";
    	auctionString = "pp1cxr";
    	//var auction = new Bridge.Auction( "Test", "n" );
    	//auction.set( "auction", auctionString );
    	//var calls = [ "1c", "1D", "p", "p", "1S", "2C", "p", "3h", "p", "p", "x", "P", "p", "R" ];
    	//for( var i = 0; i < calls.length; ++i ) {
			//auction.addCall( calls[i] );
		//}
    	//auction.clear();
    	//var bid = new Bridge.Bid( 1, "t" );
		deal.set( "hand", "sakqhakqdakqcakqj", "n" );
		deal.assignRest();
		//deal.removeCard( "c", "2" );
		deal.set( "board", "2" );
		deal.set( "dealer", "w" );
		deal.set( "vulnerability", "-" );
		deal.set( "name", "Sriram", "n" );
		var auctionName = "Default";
		deal.addAuction( auctionName );
		deal.set( "auction", auctionString, auctionName );
		//deal.loadBBOHandviewerString( "b=4&d=n&v=-&t=test&n=saqt97h6dak73ct72&e=s52hjt9754dj2cq96" );
		$( "#output" ).append( deal.getAuctionTable() );*/	
	}
	catch( err ) {
		alert( err );
	}
});

