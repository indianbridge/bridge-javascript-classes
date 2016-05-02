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

_.declareTemplate("hand.cards.suit", `
<%count=hand.getCount(suit)%>
<%empty = (count <= 0) ? "" : "data-empty"%>
<cards data-count="<%=count%>" <%=empty%>>
	<suit data-suit="<%=suit%>"><%=Bridge.suits[ suit ].html%></suit><%
	html = _.renderTemplate("hand.cards.suit.ranks", {"hand": hand, "config": config, "suit": suit});
	%><%=html%>
</cards>
`);

_.declareTemplate( "hand.cards", `<%
	_.each( hand.getSuits(config.alternateSuitColor), function( suit ) {
		html = _.renderTemplate( "hand.cards.suit", {"hand": hand, "config": config, "suit": suit});
		%><%=html%><%
	});
%>`);

_.declareTemplate( "hand.standard",`<section class="standard"><hand><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand><section>`);

_.declareTemplate( "hand.bridgewinners",`<section class="bw"><hand><header><%
		%><direction><%= hand.getDirection() %></direction><%
		%><name><%= hand.getName() %></name><%
	%></header><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand><section>`);

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

_.declareTemplate("auction.standard", `<section class="standard"><auction><content><%
	html = _.renderTemplate("auction.calls", {"auction": auction, "config": config});
	%><%=html%></content></auction><section>`);

_.declareTemplate("auction.bridgewinners", `<section class="bw"><auction><header><%
    html = _.renderTemplate("auction.directions", {"auction": auction, "config": config});
  %><%=html%></header><content><%
	  html = _.renderTemplate("auction.calls", {"auction": auction, "config": config});
	%><%=html%></content></auction><section>`);

_.declareTemplate("auction.bidding-box.levels", `<levels><%
  _.each( _.range( 1, 8 ), function(level) {
    %><level<%if (level === selectedLevel) {%> data-selected<%}
    if (level >= minimumAllowedLevel) {%> data-enabled<%} else {%> data-disabled<%}
    %>><%=level%></level><%
  });
  %></levels>`)
