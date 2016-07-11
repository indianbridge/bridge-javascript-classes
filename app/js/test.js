//_.templateSettings.variable = "bt";
$(function() {
	try {
		Bridge.options.log.DEBUG.enabled = true;
		var config = {
			"template": "concise",
			"wrapperClass": "images",
			"alternateSuitColor": false,
			"containerID": "hand1",
			"handlers": {
				"change": true,
			}
		}
		var deal = new Bridge.Deal();
		deal.setActiveHand('s');
		deal.fromString( "s=hakqdakxcakqj&n=s234hxxdjt9&v=b&a=pp1dp1np2cp3hp3nppxppp" );
		var deal2 = new Bridge.Deal();
		deal2.fromString(deal.toString());
		var hand = deal.getHand( 's' );
		var hand2 = deal2.getHand( 's' );
		hand.toHTML(config);
		config.containerID = "hand2";
		hand2.toHTML(config);
		hand.removeCard('h', 'k');
		var eventName = Bridge.getEventName([hand.getID(), Bridge.CONSTANTS.changeEventName, "hand", 's']);
		$(document).trigger( eventName, { "operation" : "addCard", "parameters": {"suit":'s', "rank": 'a'}});
		//hand.addCard('s', 'a');
		var auctionConfig = {
			"template": "full",
			"wrapperClass": "bw",
			"addQuestionMark": true,
			"containerID": "auction1",
			"handlers": {
				"change": true,
			}
		}
		var auction = deal.getAuction();
		var auction2 = deal2.getAuction();
		auction.toHTML(auctionConfig);
		auctionConfig.containerID = "auction2";
		auction2.toHTML(auctionConfig);
		//auction.removeCall();
		var eventName = Bridge.getEventName([auction.getID(), Bridge.CONSTANTS.changeEventName, "auction"]);
		$(document).trigger( eventName, { "operation" : "removeCall", "parameters": {"hand": "sakqhakqdakqca"}});
		//$(document).trigger( eventName, { "operation" : "addCall", "parameters": {"call": "4C"}});
		//$(document).trigger( eventName, { "operation" : "addAllPass", "parameters": {"call": "4C"}});

		var bbConfig = {
			"template": "full",
			"wrapperClass": "bw",
			"addQuestionMark": true,
			"containerID": "bidding-box1",
			"showUtilities": true,
			"handlers": {
				"change": true,
				"click": true,
			}
		};
		auction.showBiddingBox(bbConfig);
		auction.respondToEvents = false;
		bbConfig.containerID = "bidding-box2";
		bbConfig.template = 'concise';
		auction2.showBiddingBox(bbConfig);
		var cdConfig = {
			"template": "standard",
			"wrapperClass": "bw",
			"containerID": "card-deck1",
			"handlers": {
				"change": true,
				"click": true,
			}
		};
		deal.showDeal(cdConfig);
		//$('#auction1').html(_.renderTemplate("auction.calls", {"auction": deal.getAuction(), "config": {}));
		//hand.triggerEvents = false;
		//$("#hand1").html(hand.toHTML());
		//hand.removeCard('s','k');

		/*var auction = deal.getAuction();
		$("#hand1").html(deal.getHand( 's' ).toBBOHandDiagram());
		//deal.getAuction().toBBOAuctionDiagram({containerID: "auction1"});
		auction.removeCall();
		//deal.toCardDeck( {containerID: "card-deck1"} );
		hand.removeCard('s','k');
		deal.toCardDeck({containerID:"card-deck1",registerChangeHandler:true});
		var deal2 = new Bridge.Deal();
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
