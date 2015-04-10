/**
 * Generate a html display of this deal.
 * @return {string} HTML representation of this deal.
 */
Bridge.Deal.prototype.toHTML = function() {
	var html = '';
	html += '<h3>Deal Information</h3>';
	html += 'Board : ' + this.getBoard() + '<br/>';
	html += 'Dealer : ' + Bridge.directions[ this.getDealer() ].html + '<br/>';
	html += 'Vulnerability : ' + Bridge.vulnerabilities[ this.getVulnerability() ].html + '<br/>';
	html += 'Notes : ' + this.getNotes() + '<br/>';
	html += '<h3>Hands</h3>';
	for(var direction in Bridge.directions) {
		html += this.getHand( direction ).toHTML() + '<br/>';
	};
	html += '<h3>Auction</h3>';
	html += this.getAuction().toHTML();	
	return html;	
};

/**
 * Generate a html display of this hand.
 * @param {boolean} expandedFormat - should exanded format be used
 * @return {string} HTML representation of this deal.
 */
Bridge.Hand.prototype.toHTML = function( expandedFormat ) {
	expandedFormat = Bridge.assignDefault( expandedFormat, false );
	var html = "";
	if ( expandedFormat ) {
		html += 'Direction : ' + Bridge.directions[ this. direction ].html;
		html += ', Name : ' + this.name + ' - ';
	}
	_.each( Bridge.suitOrder, function( suit ) {
		var item = "";
		_.each( Bridge.rankOrder, function( rank ) {
			if ( this.cards[ suit ][ rank ] ) {
				item += Bridge.ranks[ rank ].html;
			}
		}, this);	
		if ( item ) html += Bridge.suits[ suit ].html + " " + item + " ";
		else html += Bridge.suits[ suit ].html + " ";
	}, this);	
	return html;
};



/**
 * Generate a html display of this auction.
 * @return {string} html representation of this auction.
 */
Bridge.Auction.prototype.toHTML = function( ) {
	var html = "Auction: ";
	for( var i = 0; i < this.calls.length; ++i ) {
		html += this.calls[i].toHTML() + " ";
	}
	html += "<br/>Contract: " + this.getContract().toHTML();
	return html;
};

/**
 * Generate a html table display of this auction.
 * No styling is added
 * @return {string} HTML table representation of this auction.
 */
Bridge.Auction.prototype.toHTMLTable = function( tableID ) {
	tableID = Bridge.assignDefault( tableID, "auction-table" );
	var html = "<table id='" + tableID + "'>";
	var ewClass = "";
	var nsClass = "";
	if ( this.vulnerability === 'n' || this.vulnerability === 'b' ) {
		nsClass = " style='background-color:#cc0000;' ";
	}
	if ( this.vulnerability === 'e' || this.vulnerability === 'b' ) {
		ewClass = " style='background-color:#cc0000;' ";
	}	
	html += "<thead id='auction-table-header'><tr>";
	html += "<th" + ewClass + ">W</th>";
	html += "<th" +nsClass + ">N</th>";
	html += "<th" + ewClass + ">E</th>";
	html += "<th" + nsClass + ">S</th>";
	html += "</tr></thead>";
	html += "<tbody id='auction-table-body'><tr>";
	var direction = 'w';
	var firstTime = true;
	while( this.dealer !== direction ) {
		firstTime = false;
		direction = Bridge.getLHO( direction );
		html += "<td>-</td>";
	}
	for( var i = 0; i < this.calls.length; ++i ) {
		var call = this.calls[i];
		direction = call.getDirection();
		if ( direction === 'w' ) {
			if ( !firstTime ) {
				html += "</tr><tr>";
			}
		}
		html += "<td>" + call.toHTML() + "</td>";
		firstTime = false;
	}
	if ( this.calls.length > 0 ) direction = Bridge.getLHO( direction );
	var isComplete = this.getContract().isComplete;
	if ( !isComplete ) {
		if ( direction === 'w' ) {
			html += "</tr><tr>";
		}
		html += "<td>?</td>";
		direction = Bridge.getLHO( direction );
	}
	while( direction !== 'w' ) {
		html += "<td></td>";
		direction = Bridge.getLHO( direction );
	}
	html += "</tr></tbody></table>";
	return html
};

/**
 * Generate a html display of this call.
 * @param {string} explanationClass - the option class to apply to span that will have explanation as title
 * @return {string} HTML representation of this bid.
 */
Bridge.Call.prototype.toHTML = function( explanationClass ) {
	var html = "";
	if ( this.call.length === 1 ) {
		html += Bridge.calls[ this.call ].html
	}
	else {
		html += this.call[0] + Bridge.calls[ this.call[1] ].html
	}
	if ( this.explanation ) {
		var spanHTML = "<span";
		if ( explanationClass ) spanHTML += " class='" + explanationClass + "'";
		spanHTML += " title='" + this.explanation + "'>" + html + "<span>";
	}

	return html;
};

/**
 * Generate a html display of this contract.
 * @return {string} HTML representation of this contract.
 */
Bridge.Contract.prototype.toHTML = function() {
	var html = "";
	if ( this.level ) {
		html += this.level;
		html += Bridge.calls[ this.suit ].html;
		if ( this.redoubled ) html += Bridge.calls[ 'r' ].html;
		else if ( this.doubled ) html += Bridge.calls[ 'x' ].html;		
		html += " by " + Bridge.directions[ this.declarer ].html;		
	}
	return html;
};

