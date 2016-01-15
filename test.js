
$(function() {
	try {	
		var deal = new Bridge.Deal();
		var linText = "|o2|st||md|4SQ982HT97DKQJ7CQ8,SAKJT74H4DA8CA732,SHAKQJ832DT5CJT95,S653H65D96432CK64|sv|n|mb|1S|mb|p|mb|2H|mb|p|mb|2S|mb|p|mb|3H|mb|p|mb|4H|mb|p|mb|p|mb|p|pc|d9|pc|dJ|pc|dQ|pc|dA|pg||pc|c2|pc|c3|pc|cQ|pc|cK|pg||pc|dK|pc|d2|pc|s8|pc|d5|pg||pc|d3|pc|d6|pc|h3|pc|d7|pg||pc|c6|pc|h4|pc|c5|pc|cJ|pg||pc|h8|pc|h2|pc|hQ|pc|hK|pg||pc|s5|pc|sA|pc|s6|pc|s7|pg||pc|sK|pc|s2|pc|s9|pc|hT|pg||mc|8|pg||";
		deal.fromLIN( linText );
		$("#output").empty().append(deal.toString());
		var auction = deal.getAuction();
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
	auction.toBiddingBox( bbConfig );
	}
	catch ( err ) {
		alert(err.message);
	}	

});

