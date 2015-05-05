var hand;
$(function() {

	try {
	var handString = "sakqjhakqdakqcakq";
	var hand = new Bridge.Hand( 'n' );
	hand.set( "hand", handString );	
	var config = {
		prefix: "bw-hand-diagram",
		show: {
			direction: false,
			name: false
		},
		tags: Bridge.getDivConfig( "bw-hand-diagram" ),
		data: {},
		classes: {},
		idPrefix: "h",
		containerID: "hand-n",
		alternateSuitColor: true,
		registerChangeHandler: false
	};		
	hand.toHTML( config );

		//var deal = new Bridge.Deal();
		//deal.fromString( "n=sakqhakqdakqjt98&a=1c1hppxr" );
		/*auction.toBBODiagram( { containerID: "auction", idPrefix: "a" } );
		auction2.toBBODiagram( { containerID: "auction2", idPrefix: "a2" } );
		auction.toBiddingBox( { layout: "full", containerID: "bidding-box", idPrefix: "bb", classes: { "bidding-box": ["bbo"] } } );
		auction2.toBiddingBox( { layout: "full", containerID: "bidding-box2", registerChangeHandler: true, idPrefix: "bb2", classes: { "bidding-box": ["bbo"] } } );		*/
		
		//var direction = 'n';
		//hand = deal.getHand( direction );	
		//$("#hand-n").html( hand.toHTML( { tags: Bridge.getTableConfig( "hand-diagram" ) } ) );
		//var auction = deal.getAuction();
		//$( "#auction").html( auction.toHTML( { tags: Bridge.getTableConfig( "auction-diagram" ) } ) );
		/*hand.toBBODiagram( { containerID: "hand-"+direction, idPrefix: direction } );	
		direction = 's';
		deal2.setActiveHand( 's' );
		hand = deal2.getHand( direction );	
		hand.toBBODiagram( { containerID: "hand-"+direction, idPrefix: direction } );
		deal.toCardDeck( { containerID: "card-deck1", idPrefix: "cd1", show: { reset: true, text:true, title: true, activeHand: true, assignedTo: false }, classes: { "card-deck": ["bbo"] } } );			
		deal2.toCardDeck( { containerID: "card-deck2", idPrefix: "cd2", show: { reset: true, text:true, title: true, activeHand: true, assignedTo: false }, classes: { "card-deck": ["bbo"] } } );			*/
		//$( ".hand" ).click( { deal: deal }, function( e ) { e.data.deal.setActiveHand( $( this ).data( "hand" ) ); } );
		/*
		var direction = 'n';
		hand = deal.getHand( direction );	
		var config = { 
			containerID: "hand-" + direction, 
			idPrefix: direction, 
			classes: { "hand-diagram": ["images"] },
			show: { suit: false, emptySuit: false, text: false, cards: true, countInContent: false } 
		};
		hand.toHTML( config );	
		for( var i = 0; i <= 12; ++i ) {
			var className = "hand-diagram-field-cards-" + i;
			var left = -1*i*50;
			var rotate = -24 + 4*i;
			$( "." + className ).css( { left: left, transform: 'rotate(' + rotate + 'deg)' } );
		}	
		$( ".hand-diagram-field-cards" ).width( 74 ).height( 100 );
		var auction = deal.getAuction();
		auction.toBBODiagram( { containerID: "auction", idPrefix: "a" } );
		config = { 
			layout: "concise", 
			containerID: "bidding-box", 
			idPrefix: "bb",
			classes: { "bidding-box": ["bbo"] },
			show: { allpass: false, undo: false, reset: false },
			tags: {}
		}
		var prefix = "bidding-box";
		config.tags[ prefix ] = "div";
		config.tags[ prefix + "-header" ] = "div";
		config.tags[ prefix + "-content" ] = "div";
		config.tags[ prefix + "-footer" ] = "div";
		config.tags[ prefix + "-row" ] = "div";
		config.tags[ prefix + "-column" ] = "span";
		config.tags[ prefix + "-field" ] = "span";	
		auction.toBiddingBox( config );*/
		/*$( document ).on( "auction:changed", function( e, auction, operation, parameter ) {
			if ( operation === "addCall" ) alert( "op: " + operation + " param: " + parameter );
		});*/
		/*hand = deal.getHand( direction );	
		hand.toHTML( { containerID: "hand-" + direction, idPrefix: direction, show: { countInContent: true } } );
		
		var auction = deal.getAuction();
		auction.toBBODiagram( { containerID: "auction", idPrefix: "a" } );
		auction.toBBODiagram( { containerID: "auction2", idPrefix: "a2" } );
		deal.toCardDeck( { containerID: "card-deck", idPrefix: "cd", show: { reset: true, text:true, title: true, activeHand: false, assignedTo: false }, classes: { "card-deck": ["bbo"] } } );
		$( document ).on( "deal:changed", function( e, deal, operation ) {
			$("#deal").empty().append(deal.toString());
		});		
		auction.toBiddingBox( { layout: "full", containerID: "bidding-box", idPrefix: "bb", classes: { "bidding-box": ["bbo"] } } );
		auction.toBiddingBox( { layout: "full", containerID: "bidding-box2", registerChangeHandler: true, idPrefix: "bb2", classes: { "bidding-box": ["bbo"] } } );
		$("#remove").click( function() { $("#bidding-box2").empty(); } );*/
	}
	catch ( err ) {
		alert(err.message);
	}	

});

