/** HAND TEMPLATES */

_.declareTemplate("deal.vulnerability", `<vulnerabilities><%
  var currentVulnerability = deal.getVulnerability();
  var names = {
    '-': "None",
    'n': "Us",
    'e': "Them",
    'b': "Both",
  };
  if (Bridge.isEastWest(deal.getActiveHand())) {
    names['n'] = "Them";
    names['e'] = "Us";
  }
  _.each(Bridge.vulnerabilities, function(item, vulnerability) {
    %><vulnerability data-operation="setVulnerability" data-vulnerability=<%=vulnerability%> <%
    if (vulnerability != currentVulnerability) {
      %>class="enabled" <%
    } else {
      %>class="disabled current" <%
    }
    %>><%=names[vulnerability]%></vulnerability><%
  });
  %></vulnerabilities>`);

_.declareTemplate("deal.scoring", `<scoringtypes><%
  var currentScoring = deal.getScoring();
  _.each(config.scoringTypes, function(scoringType) {
    %><scoringtype data-operation="setScoring" data-scoring=<%=scoringType%> <%
    if (scoringType != currentScoring) {
      %>class="enabled" <%
    } else {
      %>class="disabled current" <%
    }
    %>><%=scoringType%></scoringtype><%
  });
  %></scoringtypes>`);

_.declareTemplate("deal.dealer", `<directions><%
  var currentDealer = deal.getDealer();
  var activeHand = deal.getActiveHand();
  var dealers = {};
  dealers[activeHand] = "Me";
  dealers[Bridge.getLHO(activeHand)] = "LHO";
  dealers[Bridge.getRHO(activeHand)] = "RHO";
  dealers[Bridge.getPartner(activeHand)] = "Partner";
  _.each(Bridge.getDirectionOrder(Bridge.getLHO(activeHand)), function(direction) {
    %><direction data-operation="setDealer" data-dealer=<%=direction%> <%
    if (direction != currentDealer) {
      %>class="enabled" <%
    } else {
      %>class="disabled current" <%
    }
    %>><%=dealers[direction]%></direction><%
  });
  %></directions>`);

_.declareTemplate("deal.card-deck.rows", `<card-deck><%
  var activeHand = deal.getActiveHand();
  var count = 0;
  %><content><%
  _.each(Bridge.suitOrder, function(suit) {
    %><row data-suit=<%=suit%>><%
    _.each(Bridge.rankOrder, function(rank) {
      var assignedTo = deal.cards[suit][rank].getDirection();
      count++;
      %><card data-card-number="<%=count%>" <% if (assignedTo) {
        if (assignedTo === activeHand) {
          %>class="enabled assigned" data-operation=removeCard data-direction=<%=activeHand%> <%
        } else {
          %>class="disabled assigned" <%
        }
        %>data-assigned=<%=assignedTo%> <%
      } else {
        if (deal.getHand(activeHand).getCount() < 13) {
          %> class="enabled unassigned" data-operation=addCard data-direction=<%=activeHand%> <%
        } else {
          %> class="disabled unassigned" data-operation=addCard data-direction=<%=activeHand%> <%
        }
        %> class="enabled unassigned" data-operation=addCard data-direction=<%=activeHand%> <%
      }
      %>data-suit=<%=suit%> data-rank=<%=rank%>></card><%
    });
    %></row><%
  });
  %></content></card-deck>`);

/** HAND TEMPLATES */
_.declareTemplate( "hand.concise", `<cards><%
	_.each(Bridge.suitOrder, function(suit) {
    %><row><suit data-suit="<%=suit%>"><%=Bridge.suits[ suit ].html%></suit><%
		_.each( hand.getRanks(suit), function( item ) {
				%><rank data-suit="<%=suit%>" data-rank="<%=item.rank%>"><%=item.html%></rank><%
		});
    %></row><%
	});
%></cards>`);
_.declareTemplate( "hand.cards",`<hand><content><%
    var cards = hand.getCards();
    var count = 0;
    _.each(cards, function(card) {
      count++;
      %><card class="enabled<%
      if (hand.isSelectedCard(card.suit, card.rank)) {
        %> selected<%
      }
      %>" data-operation="removeCard" data-card-number="<%=count%>" data-suit="<%=card.suit%>" data-rank="<%=card.rank%>"></card><%
    });
    while (count < 13) {
  		count++;
  		%><card data-card-number="<%=count%>" class="unassigned"></card><%
  	}
	%></content></hand>`);

_.declareTemplate( "hand.lead",`<hand><content><%
    var cards = hand.getCards();
    var count = 0;
    _.each(cards, function(card) {
      count++;
      %><card class="enabled<%
      if (hand.isSelectedCard(card.suit, card.rank)) {
        %> selected<%
      }
      %>" data-operation="setSelectedCard" data-card-number="<%=count%>" data-suit="<%=card.suit%>" data-rank="<%=card.rank%>"></card><%
    });
    while (count < 13) {
  		count++;
  		%><card data-card-number="<%=count%>" class="unassigned"></card><%
  	}
	%></content></hand>`);

/** AUCTION TEMPLATES */
_.declareTemplate("auction.directions", `
	<directions><%
		_.each(Bridge.getDirectionOrder(config.startDirection), function(direction) {
			var name = auction.getName(direction);
      %><direction <% if (auction.isVulnerable(direction)) {%>data-vulnerable<%}
      %> data-direction="<%=direction%>"><%=name%></direction><%
		});
	%></directions>`);

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

_.declareTemplate("auction.full", `<auction><header><%
    html = _.renderTemplate("auction.directions", {"auction": auction, "config": config});
  %><%=html%></header><content><%
	  html = _.renderTemplate("auction.calls", {"auction": auction, "config": config});
	%><%=html%></content></auction>`);

_.declareTemplate("auction.bidding-box.levels", `<levels><%
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var minimumAllowedLevel = allowedCalls["minimum_level"];
  _.each( _.range( 1, 8 ), function(level) {
    %><level data-operation=setSelectedLevel data-level=<%=level%> class="<%
		if (level === selectedLevel) {%> selected<%}
		if (level >= minimumAllowedLevel) {%> enabled<%} else {%> disabled<%}
		%>"><%=level%></level><%
  });
  %></levels>`);

_.declareTemplate("auction.bidding-box.calls", `<calls><%
  var selectedCall = auction.getSelectedCall();
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
	var pass = ['p'];
	var double = allowedCalls['r'] ? ['r'] : ['x'];
  var callOrder = pass.concat(double, ['c', 'd', 'h', 's', 'n']);
  _.each(callOrder, function(call) {
    var bid = ( Bridge.isStrain(call) ? selectedLevel + call : call );
    %><call data-operation="setSelectedCall" data-call=<%=call%> data-bid=<%=bid%> class="<%
		if (allowedCalls[bid]) {%> enabled<%} else {%> disabled<%}
    if (selectedCall == call) {%> selected<%}
		%>"><suit data-suit="<%=call%>"><%=Bridge.calls[call].html%></suit></call><%
  });
  %></calls>`);

_.declareTemplate("auction.bidding-box.concise", `<bidding-box class="concise"><content><%
    html = _.renderTemplate("auction.bidding-box.levels", {"auction": auction, "config": config});
  %><%=html%><%
    html = _.renderTemplate("auction.bidding-box.calls", {"auction": auction, "config": config});
  %><%=html%></content></bidding-box>`);

_.declareTemplate("auction.bidding-box.full", `<bidding-box class="full"><content><calls><%
  var selectedLevel = auction.getSelectedLevel();
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  var minimumAllowedLevel = allowedCalls["minimum_level"];
  _.each( _.range( 1, 8 ), function(level) {
    %><row data-level="<%=level%>"><%
    var callOrder = ['c', 'd', 'h', 's', 'n'];
    _.each(callOrder, function(suit) {
      var call = level + suit;
      %><call data-operation="addCall" data-call=<%=call%> class="<%
			if (allowedCalls[call]) {%> enabled<%} else {%> disabled<%}
			%>"><%
      %><level data-level="<%=level%>"><%=level%></level><%
      %><suit data-suit="<%=suit%>"><%=Bridge.calls[suit].html%></suit></call><%
    });
    %></row><%
  });
  %></calls></content></bidding-box>`);

_.declareTemplate("auction.bidding-box.special_calls", `<row><%
  var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  %><call data-operation="removeCall" data-call="u" class="<%
  if (allowedCalls["u"]) {%> enabled<%} else {%> disabled<%}
  %>"><suit data-suit="u">Undo</suit></call><%
  if (allowedCalls['r']) {
  %><call data-operation="addCall" data-call="r" class="<%
  if (allowedCalls["r"]) {%> enabled<%} else {%> disabled<%}
  %>">Redouble</call><%
  } else {
  %><call data-operation="addCall" data-call="x" class="<%
  if (allowedCalls["x"]) {%> enabled<%} else {%> disabled<%}
  %>">Double</call><%
  }
  %><call data-operation="addCall" data-call="p" class="<%
  if (allowedCalls["p"]) {%> enabled<%} else {%> disabled<%}
  %>">Pass</call></row>`);
