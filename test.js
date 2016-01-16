
$(function() {
	try {	
		/*var auction = new Bridge.Auction();
		auction.setAuction( "1sp3ndrppp" );
		auction.toBBODiagram( { registerChangeHandler: false, containerID: 'auction' } );*/
		/*var hand = new Bridge.Hand( 'n' );
		hand.setHand("SQ982HT97DKQJ7CQ8");
		hand.toBBODiagram( { registerChangeHandler: false, containerID: 'auction' } );*/
		
		var deal = new Bridge.Deal();
		deal.getHand('n').toBBODiagram( { registerChangeHandler: true, containerID: 'hand-n' } );
		
		var linText = "|o2|st||md|1S2389JHTD3JC237KA,S7TH4QKD678TC4569,S456KAH25D25KACJQ,|rh||ah|Board 7|sv|b|mb|p|mb|p|mb|1S|mb|2H|mb|3S|mb|p|mb|4D|mb|p|mb|4S|mb|p|mb|p|mb|p|pg||pc|SQ|pc|S2|pc|S7|pc|SA|pg||pc|SK|pc|H3|pc|S8|pc|ST|pg||pc|CQ|pc|C8|pc|C2|pc|C4|pg||pc|CJ|pc|CT|pc|C3|pc|C5|pg||mc|13";
		var linText2 = "|o2|st||md|4SQ982HT97DKQJ7CQ8,SAKJT74H4DA8CA732,SHAKQJ832DT5CJT95,S653H65D96432CK64|sv|n|mb|1S|mb|p|mb|2H|mb|p|mb|2S|mb|p|mb|3H|mb|p|mb|4H|mb|p|mb|p|mb|p||";
		var deal2 = new Bridge.Deal();
		deal2.getHand('n').toBBODiagram( { registerChangeHandler: true, containerID: 'hand-s' } );
		deal.fromLIN( linText );
		deal2.fromLIN( linText2 );
		$("#output").empty().append(deal.toString());
		
		/*var auction = deal.getAuction();
	var prefix = "bw-bidding-box";
	var bbConfig = { 
		prefix: prefix,
		layout: "concise-level", 
		containerID: "bidding-box-level", 
		//idPrefix: "id",
		show: { allpass: false, undo: false, reset: false },
		tags: Bridge.getTableConfig( prefix ),
		registerChangeHandler: false
	};		
	auction.toBiddingBox( bbConfig );
	var prefix = "bw-bidding-box";
	var bbConfig = { 
		prefix: prefix,
		layout: "concise-calls", 
		containerID: "bidding-box-calls", 
		//idPrefix: "id",
		show: { allpass: false, undo: false, reset: false },
		tags: Bridge.getTableConfig( prefix ),
		registerChangeHandler: false
	};		
	auction.toBiddingBox( bbConfig );*/
	}
	catch ( err ) {
		alert(err.message);
	}	

});

