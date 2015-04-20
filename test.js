$(function() {

		try {

		var deal = new Bridge.Deal();
		deal.fromString( "v=n&d=w&n=sakqjhakqdakqca&a=1cp1sp1nxpprp" );
		//deal.fromString( "d=n&v=n&n=skj976ht62d542&a=1cp1sp1nxpprp" );
		var handConfig = {
			show: {
				direction: true,
				name: true,
				count: true,
				suit: true,
				cards: true
			},
			tags: {
			"hand-diagram": "table",
			"hand-diagram-header": "thead",
			"hand-diagram-content": "tbody",
			"hand-diagram-footer": "tfoot",
			"hand-diagram-row": "tr",
			"hand-diagram-column": "td",
			"hand-diagram-field": "span"				
			},
			data: {
			},
			classes: {
				"hand-diagram": ["bbo"]
			},
			idPrefix: "n",
			containerID: "hand-n",
			registerChangeHandler: true
		};
		var hand = deal.getHand( 'n' );
		//hand.toHTML( { containerID: "hand-n", classes: { "hand-diagram": ["plain"] } } );
		hand.toHTML( handConfig );
		handConfig.containerID = "hand-s";
		//handConfig.registerChangeHandler = false;
		hand.toHTML( handConfig );
		hand.addCard( 'c', '7' );
		hand.addCard( 'c', '3' );
		var auction = deal.getAuction();
		auction.toHTML( { containerID: "auction", classes: { "auction-diagram": ["bbo"]	}, idPrefix: "a" } );
		return;
		//deal.fromString( "d=n&v=n&n=skj976ht62d542c73&a=1cp1sp1nxpprp" );
		//deal.fromString( "d=w&v=b&n=skqhakqdakqcakqj&a=1cp1sp1nxpprp" );
		/*deal.fromString( "b=4&d=n&v=-&t=test&n=skj976ht62d542c73&s=sq43h3daj9ckjt842&w=st82hak98dt8763cq&a=-6hxe" );
		var json = deal.toJSON();
		deal.fromJSON(json);
		deal.setDealer( "e" );
		deal.setVulnerability( "n" );*/
		//deal.fromString( deal.toString() );
		//deal.assignRest();
		$( document ).on( "deal:changed", function( e, deal, operation ) {
			$("#deal").empty().append(deal.toString());
		});
		var handConfig = { 
			type: "html",
			direction: 'n',
			idPrefix:'a',
			addQuestionMark: false,
			showName: true,
			showCount: true,
			embed: true,
			containerID: "hand",
			registerChangeHandler: true
		};
		var auctionConfig = { 
			type: "BBO",
			idPrefix:'a',
			addQuestionMark: false,
			showName: true,
			embed: true,
			containerID: "auction",
			registerChangeHandler: true
		};	
		for( var direction in Bridge.directions ) {
			var config = _.clone( handConfig );
			var hand = deal.getHand( direction );
			config.direction = direction;
			config.idPrefix = "hand-" + direction;
			config.containerID = "hand-" + direction;
			hand.toHTML( config );
		}
		
		var auction = deal.getAuction();
		auction.toHTML( auctionConfig );
		auctionConfig.idPrefix = "a2";
		auctionConfig.containerID = "auction2";
		auction.toHTML( auctionConfig );
		
		var bbConfig = {
			type: "full",
			idPrefix:'a',
			embed: true,
			containerID: "bidding-box",
			registerChangeHandler: true,
			includeAllPass: true,
			includeUndo: true,
			includeReset: true					
		};
		
		var cdConfig = {
			type: "images",
			idPrefix:'a',
			embed: true,
			containerID: "card-deck",
			registerChangeHandler: true,
			imagesPath: "img/cards/",
			showCardback: true,
			height: 75			
		};		
		auction.toBiddingBox( bbConfig );
		deal.toCardDeck( cdConfig );
		$(".hand").click( { deal: deal }, function( e ) {
			var direction = $(this).data("hand");
			e.data.deal.setActiveHand( direction );
		});
	}
	catch ( err ) {
		alert(err.message);
	}	

});

