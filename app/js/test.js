
$(function() {
	try {
		var deal = new Bridge.Deal();
		deal.fromString( "s=sakqhakqdakxcakqj&v=b&a=pp1dp1np2cp3hp3nppp" );
		var hand = deal.getHand( 's' );
		var auction = deal.getAuction();
		$("#hand1").html(hand.toBBOHandDiagram());
		$("#card-deck1").html(deal._getCardDeckHtml());
		//deal.toCardDeck({containerID:"card-deck1",registerChangeHandler:true});
		/*var deal2 = new Bridge.Deal();
		deal2.fromString( "s=sakqhakqdakx&v=n&a=pp1s" );
		deal2.getHand('s').toBWHandDiagram( {
			containerID: "hand2"
		});
		//hand.removeCard( 's', 'a' );
		deal.getAuction().toBBOAuctionDiagram({containerID: "auction1"});
		deal2.getAuction().toBWAuctionDiagram({containerID: "auction2"});
		auction.toBWBiddingBox({containerID: "bidding-box1", layout:"full"});
		deal2.getAuction().toBBOBiddingBox( {containerID: "bidding-box2", layout: "concise"} );
		auction.removeCall();*/
	}
	catch ( err ) {
		alert(err.message);
	}

});
