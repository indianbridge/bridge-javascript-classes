/**
 * @fileOverview Lodash templates for hand diagrams, auctions etc.
 * @author Sriram Narasimhan
 * @version 1.0.0
 */

/** HAND TEMPLATES */
_.declareTemplate("hand.cards.suit.rank",
	`<rank data-suit="<%=suit%>" data-rank="<%=rank%>"><%=html%></rank>`);

_.declareTemplate("hand.cards.suit.ranks", `
	<ranks data-suit="<%=suit%>"><%
		_.each( hand.getRanks(suit), function( item ) {
			html = _.renderTemplate("hand.cards.suit.rank", {"suit": suit, "rank": item.rank, "html": item.html});
			%><%=html%><%
		});
	%></ranks>
`);

_.declareTemplate("hand.cards.suit", `<%
	count=hand.getCount(suit);
	empty = (count <= 0) ? "" : "data-empty";
	%><cards data-count="<%=count%>" <%=empty%>><%
	%><suit data-suit="<%=suit%>"><%=Bridge.suits[ suit ].html%></suit><%
	html = _.renderTemplate("hand.cards.suit.ranks", {"hand": hand, "config": config, "suit": suit});
	%><%=html%></cards>`);

_.declareTemplate( "hand.cards", `<%
	_.each( hand.getSuits(config.alternateSuitColor), function( suit ) {
		html = _.renderTemplate( "hand.cards.suit", {"hand": hand, "config": config, "suit": suit});
		%><%=html%><%
	});
%>`);

_.declareTemplate( "hand.concise",`<hand><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand>`);

_.declareTemplate( "hand.full",`<hand<%if (hand.isActive()){%> class="active"<%}%>><header><%
		%><direction><%= hand.getDirection() %></direction><%
		%><name data-enabled data-direction=<%= hand.getDirection() %> data-operation=setActiveHand><%= hand.getName() %></name><%
	%></header><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand>`);

_.declareTemplate( "hand.standard",`<%
	html = _.renderTemplate("hand.full", {"hand": hand, "config": config});
	%><%=html%>`);

/** AUCTION TEMPLATES */
_.declareTemplate("auction.directions", `
	<directions><%
		_.each(auction.getDirectionOrder(config.startDirection), function(direction) {
      %><direction <% if (auction.isVulnerable(direction)) {%>data-vulnerable<%}
      %> data-direction="<%=direction%>"><%=direction%></direction><%
		});
	%></directions>
`);

_.declareTemplate("call", `<call data-call="<%=call.toString()%>"><%
    if (call.call.length === 1) {
      html = Bridge.calls[call.call].html;
      %><%=html%><%
    }
    else {
      %><level data-level="<%=call.getLevel()%>"><%=call.call[0]%></level><%
      %><suit data-suit="<%=call.getSuit()%>"><%=Bridge.calls[call.call[1]].html%></suit><%
    }
  %></call>`);

_.declareTemplate( "auction.calls", `
  <calls><%
    _.each(auction.getCalls(config.startDirection, config.addQuestionMark), function(callRow) {
      %><row><%
        _.each(callRow, function(call) {
          if (call instanceof Bridge.Call) {
            html = _.renderTemplate("call", {"call": call});
            %><%=html%><%
          }
          else {
            %><call data-level="0" data-bid="<%=call%>" data-suit="<%=call%>"><%=call%></call><%
          }
        });
      %></row>
      <%
    });
  %></calls>
`);

_.declareTemplate("auction.concise", `<auction><content><%
	html = _.renderTemplate("auction.calls", {"auction": auction, "config": config});
	%><%=html%></content></auction>`);

_.declareTemplate("auction.full", `<auction><header><%
    html = _.renderTemplate("auction.directions", {"auction": auction, "config": config});
  %><%=html%></header><content><%
	  html = _.renderTemplate("auction.calls", {"auction": auction, "config": config});
	%><%=html%></content></auction>`);

_.declareTemplate( "auction.standard",`<%
	html = _.renderTemplate("auction.full", {"auction": auction, "config": config});
	%><%=html%>`);

_.declareTemplate("auction.bidding-box.levels", `<levels><%
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var minimumAllowedLevel = allowedCalls["minimum_level"];
  _.each( _.range( 1, 8 ), function(level) {
    %><level<%if (level === selectedLevel) {%> data-selected<%}
    if (level >= minimumAllowedLevel) {%> data-enabled<%} else {%> data-disabled<%}
    %> data-operation=setSelectedLevel data-level=<%=level%>><%=level%></level><%
  });
  %></levels>`);

_.declareTemplate("auction.bidding-box.calls", `<calls><%
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var callOrder = ['p', 'x', 'r', 'c', 'd', 'h', 's', 'n'];
  _.each(callOrder, function(suit) {
    var call = ( Bridge.isStrain(suit) ? selectedLevel + suit : suit );
    %><call<%if (allowedCalls[call]) {%> data-enabled<%} else {%> data-disabled<%}
    %> data-operation=addCall data-call=<%=call%> data-suit=<%=suit%>><%=Bridge.calls[suit].html%></call><%
  });
  %></calls>`);

_.declareTemplate("auction.bidding-box.concise", `<bidding-box class="concise"><content><%
    html = _.renderTemplate("auction.bidding-box.levels", {"auction": auction, "config": config});
  %><%=html%><%
    html = _.renderTemplate("auction.bidding-box.calls", {"auction": auction, "config": config});
  %><%=html%></content></bidding-box>`);

_.declareTemplate("auction.bidding-box.levels+suits", `<calls><%
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var minimumAllowedLevel = allowedCalls["minimum_level"];
  _.each( _.range( 1, 8 ), function(level) {
    %><row data-level="<%=level%>"><%
    var callOrder = ['c', 'd', 'h', 's', 'n'];
    _.each(callOrder, function(suit) {
      var call = level + suit;
      %><call<%if (allowedCalls[call]) {%> data-enabled<%} else {%> data-disabled<%}
      %> data-operation=addCall data-call=<%=call%>><%
      %><level data-level="<%=level%>"><%=level%></level><%
      %><suit data-suit="<%=suit%>"><%=Bridge.calls[suit].html%></suit></call><%
    });
    %></row><%
  });
  %></calls>`);
_.declareTemplate("auction.bidding-box.utilities", `<row><%
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var callOrder = [
    {call: 'p', 'text': 'all pass', 'operation': 'addAllPass'},
    {call: 'u', 'text': 'undo', 'operation': 'removeCall'},
    {call: 'u', 'text': 'reset', 'operation': 'clearCalls'},
  ];
  _.each(callOrder, function(bid) {
    var call = bid.call;
    var text = bid.text;
    %><call<%if (allowedCalls[call]) {%> data-enabled<%} else {%> data-disabled<%}
    %> data-operation=<%=bid.operation%> data-call=<%=call%>><%=text%></call><%
  });
  %></row>`);
_.declareTemplate("auction.bidding-box.special_calls", `<row><%
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var callOrder = [
    {call: 'p', 'text': 'pass'},
    {call: 'x', 'text': 'x'},
    {call: 'r', 'text': 'xx'},
  ];
  _.each(callOrder, function(bid) {
    var call = bid.call;
    var text = bid.text;
    %><call<%if (allowedCalls[call]) {%> data-enabled<%} else {%> data-disabled<%}
    %> data-operation=addCall data-call=<%=call%>><%=text%></call><%
  });
  %></row>`);
_.declareTemplate("auction.bidding-box.full", `<bidding-box class="full"><header><%
  html = _.renderTemplate("auction.bidding-box.special_calls", {"auction": auction, "config": config});
  %><%=html%></header><content><%
    html = _.renderTemplate("auction.bidding-box.levels+suits", {"auction": auction, "config": config});
  %><%=html%></content><%
  if (config.showUtilities) {
    html = _.renderTemplate("auction.bidding-box.utilities", {"auction": auction, "config": config});
    %><footer><%=html%></footer><%
  }
  %></bidding-box>`);

_.declareTemplate("deal.card-deck.standard", `<card-deck><%
  var activeHand = deal.getActiveHand();
  %><header>Active Hand: <%=deal.getHand(activeHand).getName()%></header><content><%
	_.each(Bridge.suitOrder, function(suit) {
		%><row data-suit=<%=suit%>><%
		_.each(Bridge.rankOrder, function(rank) {
			var assignedTo = deal.cards[suit][rank].getDirection();
			%><card <% if (assignedTo) {
				if (assignedTo === activeHand) {
					%>data-enabled data-operation=removeCard data-direction=<%=activeHand%> <%
				} else {
					%>data-disabled <%
				}
				%>data-assigned=<%=assignedTo%> <%
			} else {
				%> data-enabled data-operation=addCard data-direction=<%=activeHand%> <%
			}
			%>data-suit=<%=suit%> data-rank=<%=rank%>><%
			%><suit data-suit=<%=suit%>><%=Bridge.suits[suit].html%></suit><%
			%><rank data-rank=<%=rank%>><%=Bridge.ranks[rank].html%></rank><%
			%></card><%
		});
		var rank = 'x';
		%><card data-enabled data-operation=addCard data-direction=<%=activeHand%> <%
		%>data-suit=<%=suit%> data-rank=<%=rank%>><%
		%><suit data-suit=<%=suit%>><%=Bridge.suits[suit].html%></suit><%
		%><rank data-rank=<%=rank%>><%=rank%></rank><%
		%></card><%
		%></row><%
	});
  %></content></card-deck>`);

_.declareTemplate("deal.standard", `<deal><%
	%><section><%
		%><block><%
		%></block><%
		%><block><%
			var hand = deal.getHand('n');
			html = _.renderTemplate("hand.standard", {"hand": hand, "config": config});
		%><%=html%></block><%
		%><block><%
			html = _.renderTemplate("auction.standard", {"auction": deal.getAuction(), "config": config});
		%><%=html%></block><%
	%></section><%
	%><section><%
		%><block><%
			var hand = deal.getHand('w');
			html = _.renderTemplate("hand.standard", {"hand": hand, "config": config});
		%><%=html%></block><%
		%><block><%
		%></block><%
		%><block><%
			var hand = deal.getHand('e');
			html = _.renderTemplate("hand.standard", {"hand": hand, "config": config});
		%><%=html%></block><%
	%></section><%
	%><section><%
		%><block><%
		%></block><%
		%><block><%
			var hand = deal.getHand('s');
			html = _.renderTemplate("hand.standard", {"hand": hand, "config": config});
		%><%=html%></block><%
		%><block><%
		%></block><%
	%></row><%
	%></section>`);
