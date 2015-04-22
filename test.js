var hand;
$(function() {

		try {

		var deal = new Bridge.Deal();
		/*for( var direction in Bridge.directions ) {
			var hand = deal.getHand( direction );
			hand.toBBODiagram( { containerID: "hand-" + direction, idPrefix: direction } );
		}
		hand = deal.getHand('n');
		$(".hand").click( { deal: deal }, function( e ) {
			var direction = $(this).data("hand");
			e.data.deal.setActiveHand( direction );
		});	*/	
		
		var auction = deal.getAuction();
		auction.toBBODiagram( { containerID: "auction", idPrefix: "a" } );
		auction.toBBODiagram( { containerID: "auction2", idPrefix: "a2" } );
		deal.toCardDeck( { containerID: "card-deck", idPrefix: "cd", classes: { "card-deck": ["bbo"] } } );
		$( document ).on( "deal:changed", function( e, deal, operation ) {
			$("#deal").empty().append(deal.toString());
		});		
		auction.toBiddingBox( { layout: "full", containerID: "bidding-box", idPrefix: "bb", classes: { "bidding-box": ["bbo"] } } );
		auction.toBiddingBox( { layout: "full", containerID: "bidding-box2", registerChangeHandler: true, idPrefix: "bb2", classes: { "bidding-box": ["bbo"] } } );
		$("#remove").click( function() { $("#bidding-box2").empty(); } );
	}
	catch ( err ) {
		alert(err.message);
	}	

});

