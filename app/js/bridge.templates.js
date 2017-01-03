_.declareTemplate("deal.vulnerability.standard", `<vulnerabilities><%
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

  _.declareTemplate( "hand.cards.concise", `<cards><%
  	var count = 0;
  	_.each( hand.getSuits(config.alternateSuitColor), function( suit ) {
  		_.each( hand.getRanks(suit), function( item ) {
  			if (item.rank !== "-") {
  				count++;
  				%><card data-card-number="<%=count%>" data-suit="<%=suit%>" data-rank="<%=item.rank%>"><%=item.html%></card><%
  			}
  		});
  	});
  	while (count < 13) {
  		count++;
  		%><card data-card-number="<%=count%>" class="unassigned"></card><%
  	}
  %></cards>`);

  _.declareTemplate( "hand.concise",`<hand><content><%
  	html = _.renderTemplate("hand.cards.concise", {"hand": hand, "config": config});
  	%><%=html%></content></hand>`);

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
    var selectedLevel = auction.getSelectedLevel();
    var allowedCalls = auction.getContract().allowedCalls(auction.nextToCall);
  	var pass = ['p'];
  	var double = allowedCalls['r'] ? ['r'] : ['x'];
    var callOrder = pass.concat(double, ['c', 'd', 'h', 's', 'n']);
    _.each(callOrder, function(suit) {
      var call = ( Bridge.isStrain(suit) ? selectedLevel + suit : suit );
      %><call data-operation=addCall data-call=<%=call%> data-suit=<%=suit%> class="<%
  		if (allowedCalls[call]) {%> enabled<%} else {%> disabled<%}
  		%>"><%=Bridge.calls[suit].html%></call><%
    });
    %></calls>`);

  _.declareTemplate("auction.bidding-box.concise", `<bidding-box class="concise"><content><%
      html = _.renderTemplate("auction.bidding-box.levels", {"auction": auction, "config": config});
    %><%=html%><%
      html = _.renderTemplate("auction.bidding-box.calls", {"auction": auction, "config": config});
    %><%=html%></content></bidding-box>`);

  /** AUCTION TEMPLATES */
  _.declareTemplate("auction.directions", `
  	<directions><%
  		_.each(Bridge.getDirectionOrder(config.startDirection), function(direction) {
  			var name = auction.getName(direction);
        %><direction <% if (auction.isVulnerable(direction)) {%>data-vulnerable<%}
        %> data-direction="<%=direction%>"><%=name%></direction><%
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
