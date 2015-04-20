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
 * Utility to check if an id exists and if so embed some html in id
 * @param {string} id the id to check
 * @param {string} html the html to embed
 */
Bridge.embedHTML = function( id, html ) {
	if ( $( '#' + id ).length === 0 ) {
		Bridge._reportError( "Container with id : " + id + " does not exist!" );
	}
	else $( '#' + id ).empty().append( html );	
};

/**
 * Utility to generate id string based on whether idPrefix is specified or not.
 * @param {string} idPrefix the id prefix to use
 * @param {string} idSuffix the id suffix to use
 * @return {string} the string to use for setting id for element.
 */
Bridge._getID = function( idPrefix, idSuffix ) {
	return ( idPrefix ? "id='" + idPrefix + "-" + idSuffix + "'" : "" );
};

/**
 * Utility function to build a list of classes.
 * External classes specify additional data for each entry in localClasses
 * This will work for data tags as well.
 * @param {array} localClasses the local classes to add
 * @param {array} externalClasses additional classes to add
 * @return {string} the list of classes as a string
 */
Bridge._getClasses = function( localClasses, externalClasses ) {
	var output = [];
	output = _.union( output, localClasses );
	_.each( localClasses, function( item ) {
		if ( externalClasses[ item ] ) output = _.union( output, externalClasses[ item ] );
	}, this );	
	var classes = output.join( " " );
	return ( classes ? "class='" + classes + "'" : "" );
};

/**
 * Utility function to build a list of data tags.
 * External data specify additional data for each entry in localClasses
 * @param {array} localClasses the local classes to lookup external data
 * @param {array} localData the local data to add
 * @param {array} externalData additional data to add
 * @return {string} the data list as a string
 */
Bridge._getData = function( localClasses, localData, externalData ) {
	var output = [];
	output = _.union( output, localData );
	_.each( localClasses, function( item ) {
		if ( externalData[ item ] ) output = _.union( output, externalData[ item ] );
	}, this );
	var data = output.join( " " );
	return data;
};

/**
 * Utilitiy to determine tag name based on tags associated with
 * classes in the order of classes.
 * @param {object} config that specified tags
 * @param {array} classes the local classes to search
 * @return {string} the tag name
 */
Bridge._getTag = function( config, classes ) {
	for ( var i = 0; i < classes.length; ++i ) {
		if ( _.has( config.tags, classes[i] ) ) return config.tags[ classes[i] ];
	}
	return "div";
};

/**
 * Utility to create an opening tag with id, class and data added.
 * @param {string} tagName the tag to use
 * @param {object} config that specified external classes and data
 * @param {array} classes the local classes to apply
 * @param {array} data the local data to apply
 * @param {boolean} generateID should the id be generated or not
 * @return {string} the generated opening tagName.
 */
Bridge._openTag = function( tagName, config, classes, data, generateID ) {
	if ( !tagName ) return "";
	generateID = Bridge.assignDefault( generateID, true );
	var output = "<" + tagName;
	if ( generateID ) output += " " + Bridge._getID( config.idPrefix, classes[0] );
	output += " " + Bridge._getClasses( classes, config.classes );
	output += " " + Bridge._getData( classes, data, config.data );
	output += ">";
	return output;
};

/** 
 * Utility to create closing tag for specified tagName
 * @param {string} tagName the tag  name to create closing tag for
 * @return {string} html for closing tag;
 */
Bridge._closeTag = function( tagName ) {
	return ( tagName ? "</" + tagName + ">" : "" );
};

/**
 * Utility to create html structure given the header, content and footer
 * @param {object} config the object that has all configuration parameters
 * @param {string} header the header html
 * @param {string} content the content html
 * @param {string} footer the footer html
 * @return {string} the full html for the requested container
 */
Bridge._generateHTMLModule = function( config, header, content, footer ) {
	var html = "";
	// Main container
	var containerClasses = [ config.prefix + "-diagram" ];
	var containerTag = Bridge._getTag( config, containerClasses );
	html += Bridge._openTag( containerTag, config, containerClasses, [] );
	
	// header
	if ( header ) {
		var headerClasses = [ config.prefix + "-diagram-header" ];
		var headerTag = Bridge._getTag( config, headerClasses );
		html += Bridge._openTag( headerTag, config, headerClasses, [] );	
		html += header;
		html += Bridge._closeTag( headerTag );
	}
	
	// Content
	if ( content ) {
		var contentClasses = [ config.prefix + "-diagram-content" ];
		var contentTag = Bridge._getTag( config, contentClasses );
		html += Bridge._openTag( contentTag, config, contentClasses, [] );		
		html += content;
		html += Bridge._closeTag( contentTag );
	}
	
	// Footer
	if (footer ) {
		var footerClasses = [ config.prefix + "-diagram-footer" ];
		var footerTag = Bridge._getTag( config, footerClasses );
		html += Bridge._openTag( footerTag, config, footerClasses, [] );
		html += footer;	
		html += Bridge._closeTag( footerTag );
	}
	
	html += Bridge._closeTag( containerTag );	
	return html;
};

/**
 * Generate a html display of this hand.
 * @param {object} config configuration parameters for display 
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} HTML representation of this deal.
 */
Bridge.Hand.prototype.toHTML = function( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		prefix: "hand",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true
	});	
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: false,
		name: false,
		count: false,
		suit: true,
		cards: true		
	});
	_.defaults( config.tags, {
		"hand-diagram": "div",
		"hand-diagram-header": "div",
		"hand-diagram-content": "div",
		"hand-diagram-footer": "div",
		"hand-diagram-row": "span",
		"hand-diagram-column": "span",
		"hand-diagram-field": "span"
	});	

	var headerHTML = "";
	var rowClasses = [ "hand-diagram-row" ];
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [ "hand-diagram-column" ];
	var columnTag = Bridge._getTag( config, columnClasses );	
	var field = "direction";
	if ( config.show[ field ] ) {
		headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "hand-diagram-" + field, "hand-diagram-field" ];
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='" + this.get( field ) + "'" ];
		headerHTML += Bridge._openTag( tag, config, classes, data );
		headerHTML += this.get( field ).toUpperCase();
		headerHTML += Bridge._closeTag( tag );
		headerHTML += Bridge._closeTag( columnTag );
	}		
	field = "name";
	if ( config.show[ field ] ) {
		headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "hand-diagram-" + field, "hand-diagram-field" ];
		var tag = Bridge._getTag( config, classes );		
		var data = [ "data-" + field + "='" + this.get( field ) + "'" ];
		headerHTML += Bridge._openTag( tag, config, classes, data );
		headerHTML += this.get( field );
		if ( config.show.count ) {
			var subField = "count";
			var classes = [ "hand-diagram-" + subField, "hand-diagram-field" ];
			var tag = Bridge._getTag( config, classes );		
			var data = [ "data-" + subField + "='" + this.get( subField ) + "'" ];		
			headerHTML += Bridge._openTag( tag, config, classes, data );
			headerHTML += "(" + this.get( subField ) + ")";
			headerHTML += Bridge._closeTag( tag );			
		}
		headerHTML += Bridge._closeTag( tag );
		headerHTML += Bridge._closeTag( columnTag );
	}	
	
	headerHTML += Bridge._closeTag( rowTag );
	
	// Content
	var contentHTML = "";	
	// Cards in each suit
	_.each( Bridge.suitOrder, function( suit ) {
		contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		field = "suit";
		if ( config.show[ field ] ) {
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = [ "hand-diagram-" + field + "-" + suit, "hand-diagram-" + field, "hand-diagram-field" ];
			var tag = Bridge._getTag( config, classes );		
			var data = [ "data-" + field + "='" + suit + "'" ];		
			contentHTML += Bridge._openTag( tag, config, classes, data );
			contentHTML += Bridge.suits[ suit ].html;
			contentHTML += Bridge._closeTag( tag );
			contentHTML += Bridge._closeTag( columnTag );
		}	
		field = "cards";
		if ( config.show[ field ] ) {
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = [ "hand-diagram-" + field + "-" + suit, "hand-diagram-" + field, "hand-diagram-field" ];
			var tag = Bridge._getTag( config, classes );		
			var data = [ "data-" + field + "='" + suit + "'" ];					
			var cards = "";
			var count = 0;
			_.each( Bridge.rankOrder, function( rank ) {
				if ( this.cards[ suit ][ rank ] ) {
					count++;
					cards += Bridge._openTag( tag, config, classes, data );
					cards += Bridge.ranks[ rank ].html;
					cards += Bridge._closeTag( tag );
				}
			}, this);	
			if ( count === 0 ) cards += "-";			
			contentHTML += cards;
			contentHTML += Bridge._closeTag( columnTag );
		}				
		contentHTML += Bridge._closeTag( rowTag );
	}, this );
	
	// Footer
	var footerHTML = "";
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	
	if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	if ( !isCallback && config.registerChangeHandler ) {
		$( document ).on( "hand:changed", { config: _.cloneDeep( config ), direction: this.getDirection() }, function( e, hand ) {
			if ( hand.getDirection() === e.data.direction ) hand.toHTML( e.data.config, true );
		});
	}	
	return html;
	/*if ( config.type === "BBO" ) {
		var html = this._toBBODiagram( config );
	}
	else {
		var html = "";
		_.each( Bridge.suitOrder, function( suit ) {
			html += Bridge.suits[ suit ].html + " ";
			var item = "";
			_.each( Bridge.rankOrder, function( rank ) {
				if ( this.cards[ suit ][ rank ] ) {
					item += Bridge.ranks[ rank ].html;
				}
			}, this);	
			if ( item ) html += item + " ";
		}, this);	
		if ( config.showCount ) html += " (" + this.getCount() + ")";
	}
	
	if ( !isCallback && config.registerChangeHandler ) {
		$( document ).on( "hand:changed", { config: _.clone( config ), direction: this.getDirection() }, function( e, hand ) {
			console.log("called");
			if ( hand.getDirection() === e.data.direction ) hand.toHTML( e.data.config, true );
		});
	}
	return html;*/
};

/**
 * Generate a BBO like html display of this hand.
 * @param {object} config configuration parameters for display 
 * @return {string} HTML representation of this deal.
 * @private should be called through toHTML setting type to BBO not directly
 */
Bridge.Hand.prototype._toBBODiagram = function( config ) {
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		idPrefix: null,
		showName: false,
		showDirection: true,
		embed: false,
		containerID: null
	});	
	var html = "";
	var classes = "hand-diagram-div";
	var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );	
	html += "<div" + Bridge.addClassAndId( classes, id ) + ">";
	classes = "hand-diagram-table";
	if ( this._isActive ) classes += " active";
	id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );
	html += "<table" + Bridge.addClassAndId( classes, id ) + ">";	
	if ( config.showDirection ) {
		classes = "hand-diagram-info";
		html += "<thead" + Bridge.addClassAndId( classes ) + ">";
		html += "<tr>";	
		classes = "hand-diagram-direction";	
		html += "<td" + Bridge.addClassAndId( classes ) + ">" + this.getDirection().toUpperCase() + "</td>";
		classes = "hand-diagram-name";
		var name = ( config.showName ? this.getName() : "" );
		html += "<td" + Bridge.addClassAndId( classes ) + ">" + name + "</td>";
		html += "</tr></thead>";
	}
	classes = "hand-diagram-cards";
	html += "<tbody" + Bridge.addClassAndId( classes ) + ">";
	_.each( Bridge.suitOrder, function( suit ) {
		html += "<tr>";
		classes = "hand-diagram-suit";
		html += "<td data-suit='" + suit + "'" + Bridge.addClassAndId( classes ) + ">" + Bridge.suits[ suit ].html + "</td>";
		var item = "";
		classes = "hand-diagram-card";
		_.each( Bridge.rankOrder, function( rank ) {
			if ( this.cards[ suit ][ rank ] ) {
				item += "<span data-card='" + suit + rank + "'" + Bridge.addClassAndId( classes ) + ">" + Bridge.ranks[ rank ].html + "</span>";
			}
		}, this);	
		classes = "hand-diagram-suit-cards";
		html += "<td" + Bridge.addClassAndId( classes ) + ">" + item + "</td>";
		html += "</tr>";
	}, this);	
	html += "</tbody></table></div>";
	return html;
};


/**
 * Generate a html display of this auction.
 * @param {object} config configuration parameters for display
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html representation of this auction.
 */
Bridge.Auction.prototype.toHTML = function( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	/*_.defaults( config, {
		type: "html",
		idPrefix: null,
		addQuestionMark: true
	});	*/
	_.defaults( config, {
		prefix: "auction",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true,
		addQuestionMark: true
	});	
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: true
	});
	_.defaults( config.tags, {
		"auction-diagram": "table",
		"auction-diagram-header": "thead",
		"auction-diagram-content": "tbody",
		"auction-diagram-footer": "tfoot",
		"auction-diagram-row": "tr",
		"auction-diagram-column": "td",
		"auction-diagram-field": "span"
	});		
	
	var headerHTML = "";
	var rowClasses = [ "auction-diagram-row" ];
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [ "auction-diagram-column" ];
	var columnTag = Bridge._getTag( config, columnClasses );
	var field = "direction";
	var vul = this.vulnerability;
	if ( config.show[ field ] ) {
		_.each( Bridge.directionOrder, function( direction ) {
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = [ "auction-diagram-" + field + "-" + direction, "auction-diagram-field" ];
			if ( vul == 'b' || vul == direction || vul == Bridge.getPartner( direction ) ) classes.push( "vulnerable" );
			var tag = Bridge._getTag( config, classes );
			var data = [ "data-" + field + "='" + direction + "'" ];	
			headerHTML += Bridge._openTag( tag, config, classes, data );
			headerHTML += direction.toUpperCase();
			headerHTML += Bridge._closeTag( tag );
			headerHTML += Bridge._closeTag( columnTag );					
		}, this);		
	}		
	headerHTML += Bridge._closeTag( rowTag );
	var contentHTML = "";
	var field = "call";
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var direction = 'w';
	var firstTime = true;
	while( this.dealer !== direction ) {
		firstTime = false;
		direction = Bridge.getLHO( direction );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "auction-diagram-" + field + "-" + direction, "auction-diagram-field" ];
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
	}
	for( var i = 0; i < this.calls.length; ++i ) {
		var call = this.calls[i];
		direction = call.getDirection();
		if ( direction === 'w' ) {
			if ( !firstTime ) {
				contentHTML += Bridge._closeTag( rowTag );
				contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
			}
		}
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "auction-diagram-" + field + "-" + direction, "auction-diagram-field" ];
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='" + call.toString() + "' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += call.toHTML();
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
		firstTime = false;
	}
	if ( this.calls.length > 0 ) direction = Bridge.getLHO( direction );
	var isComplete = this.getContract().isComplete;
	if ( !isComplete && config.addQuestionMark ) {
		if ( direction === 'w' ) {
			contentHTML += Bridge._closeTag( rowTag );
			contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		}
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "auction-diagram-" + field + "-" + direction, "auction-diagram-field" ];
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='?' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += "?"
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );		
		direction = Bridge.getLHO( direction );
	}
	while( direction !== 'w' ) {
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = [ "auction-diagram-" + field + "-" + direction, "auction-diagram-field" ];
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
		direction = Bridge.getLHO( direction );
	}
	contentHTML += Bridge._closeTag( rowTag );
	
	var footerHTML = "";
	//var footerHTML = "<tr><td></td><td></td><td></td><td></td></tr>";
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	/*if ( config.type === "BBO" ) { 
		var html = this._toBBODiagram( config );
	}
	else {
		var html = "Auction: ";
		for( var i = 0; i < this.calls.length; ++i ) {
			html += this.calls[i].toHTML() + " ";
		}
		if ( this.getContract().isComplete ) html += "<br/>Contract: " + this.getContract().toHTML();
	}*/
	if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	if ( !isCallback && config.registerChangeHandler ) {
		console.log( "registering container = " + config.containerID );
		$( document ).on( "auction:changed", { config: _.clone( config ) }, function( e, auction ) {
			auction.toHTML( e.data.config, true );
		});
	}	
	return html;
};

/** 
 * Utility to add id and class to a tag.
 * @param {string} classes the class to set to
 * @param {string} [identifier] the optional id to set
 */
Bridge.addClassAndId = function( classes, id ) {
	var output = "";
	if ( id ) output += " id='" + id + "'";
	output += " class='" + classes + "'";
	return output;
};

/**
 * Generate a html table display of this auction similar to BBO hand viewer.
 * @param {object} config configuration parameters for display
 * @return {string} HTML table representation of this auction.
 */
Bridge.Auction.prototype._toBBODiagram = function( config ) {
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		idPrefix: null,
		addQuestionMark: true
	});
	var html = "";
	var classes = "auction-diagram-div";
	var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );
	html += "<div" + Bridge.addClassAndId( classes, id ) + ">";
	classes = "auction-diagram-table";
	id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );
	html += "<table" + Bridge.addClassAndId( classes, id ) + ">";
	classes = "auction-diagram-directions";
	html += "<thead" + Bridge.addClassAndId( classes ) + ">";
	html += "<tr>";
	var vul = this.vulnerability;
	_.each( Bridge.directionOrder, function( direction ) {
		classes = "auction-diagram-direction-" + direction + " vulnerability-";
		if ( vul == 'b' || vul == direction || vul == Bridge.getPartner( direction ) ) {
			classes += "red";
		}
		else {
			classes += "white";
		}
		html += "<th data-direction='" + direction + "' " + Bridge.addClassAndId( classes ) + ">" + direction.toUpperCase() + "</th>";
	}, this);
	html += "</tr></thead>";
	classes = "auction-diagram-calls";
	html += "<tbody" + Bridge.addClassAndId( classes ) + ">";
	html += "<tr>";
	classes = "auction-diagram-call";
	var direction = 'w';
	var firstTime = true;
	while( this.dealer !== direction ) {
		firstTime = false;
		direction = Bridge.getLHO( direction );
		html += "<td data-call=''" + Bridge.addClassAndId( classes ) + "></td>";
	}
	for( var i = 0; i < this.calls.length; ++i ) {
		var call = this.calls[i];
		direction = call.getDirection();
		if ( direction === 'w' ) {
			if ( !firstTime ) {
				html += "</tr><tr>";
			}
		}
		html += "<td data-call='" + call.toString() + "'" + Bridge.addClassAndId( classes ) + ">" + call.toHTML() + "</td>";
		firstTime = false;
	}
	if ( this.calls.length > 0 ) direction = Bridge.getLHO( direction );
	var isComplete = this.getContract().isComplete;
	if ( !isComplete && config.addQuestionMark ) {
		if ( direction === 'w' ) {
			html += "</tr><tr>";
		}
		html += "<td data-call='?'" + Bridge.addClassAndId( classes ) + ">?</td>";
		direction = Bridge.getLHO( direction );
	}
	while( direction !== 'w' ) {
		html += "<td data-call=''" + Bridge.addClassAndId( classes ) + "></td>";
		direction = Bridge.getLHO( direction );
	}
	html += "</tr></tbody></table></div>";
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

/**
 * Create a card deck configured according to the passed config parameters.
 * @param {object} config the config parameters
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html generated for bidding box
 */
Bridge.Deal.prototype.toCardDeck = function( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		type: "html",
		idPrefix: null,
		embed: false,
		containerID: null,
		registerChangeHandler: false,
		elementData: [],
		elementClasses: [],
		imagesPath: "",
		showCardback: false
	});
	if ( config.type === "images" ) {
		var classes = "card-deck-div";
		var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );	
		var html = "";
		html += "<div" + Bridge.addClassAndId( classes, id ) + ">";
		_.each( Bridge.suitOrder, function( suit ) {
			classes = "card-deck-row card-deck-row-" + suit;
			html += "<div" + Bridge.addClassAndId( classes ) + ">";			
			_.each( Bridge.rankOrder, function( rank ) {
				var text = Bridge.suits[ suit ].html + Bridge.ranks[ rank ].html;
				var classes = _.clone( config.elementClasses );
				classes.push( "card-deck-card-image" );
				var data = _.clone( config.elementData );
				data.push( "data-card='" + suit + rank + "'" );
				var assignedTo = this._cardAssignedTo[ suit ][ rank ];
				if ( assignedTo ) {
					classes.push( "card-deck-card-image-assigned" );
					data.push( "data-assignedto='" + assignedTo + "'" );
					text += "(" + assignedTo + ")";
					var src = config.imagesPath + "cb.png";
					var title = "Click to remove from " + Bridge.directions[ assignedTo ].name + " hand";
				}
				else {
					data.push( "data-assignedto=''" );
					classes.push( "card-deck-card-image-unassigned" );
					var src = config.imagesPath + suit + rank + ".png";
					var title = "Click to add to " + Bridge.directions[ this.getActiveHand() ].name + " hand";
				}
				html += "<img ";
				if ( config.height ) html += "height=" + config.height;
				if ( config.width ) html += "width=" + config.width;
				html += " title='" + title + "' src='" + src + "' class='" + classes.join( " " ) + "' " + data.join( " " ) + "/>"; 
			}, this );
		}, this );	
		html += "</div>";
		html += "</div>";		
	}
	else {
		var classes = "card-deck-div";
		var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );	
		var html = "";
		html += "<div" + Bridge.addClassAndId( classes, id ) + ">";
		_.each( Bridge.suitOrder, function( suit ) {
			classes = "card-deck-row card-deck-row-" + suit;
			html += "<div" + Bridge.addClassAndId( classes ) + ">";			
			_.each( Bridge.rankOrder, function( rank ) {
				var text = Bridge.suits[ suit ].html + Bridge.ranks[ rank ].html;
				var classes = _.clone( config.elementClasses );
				var data = _.clone( config.elementData );
				var assignedTo = this._cardAssignedTo[ suit ][ rank ];
				if ( assignedTo ) {
					classes.push( "card-deck-card-assigned" );
					data.push( "data-assignedto='" + assignedTo + "'" );
					text += "(" + assignedTo + ")";
				}
				else {
					data.push( "data-assignedto=''" );
					classes.push( "card-deck-card-unassigned" );
				}
				html += Bridge._makeElement( { prefix: "card-deck", elementType: "card", data: data, classes: classes, value:suit + rank, disabled:false, text:text, idPrefix:config.idPrefix } );
			}, this );
		}, this );	
		html += "</div>";
		html += "</div>";
	}
	if ( config.embed ) Bridge.embedHTML( config.containerID, html );
	if ( !isCallback && config.registerChangeHandler ) {
	$( document ).on( "click", ".card-deck-card, .card-deck-card-image", { deal: this } , function( e ) {
		try {
			var card = $( this ).data( "card" );
			var assignedTo = $( this ).data( "assignedto" );
			console.log("Card is " + card);
			console.log("Assigned To is " + assignedTo);
			if ( assignedTo ) {
				e.data.deal.getHand( assignedTo ).removeCard( card[0], card[1] );
			}
			else {
				e.data.deal.getHand( e.data.deal.getActiveHand() ).addCard( card[0], card[1] );
			}
		}
		catch ( err ) {
			alert( err.message );
		}
	});	
	$( document ).on( "hand:changed", { deal: this, config: _.clone(config) }, function( e, hand ) {
		e.data.deal.toCardDeck( e.data.config, true );
	});
	}			
	return html;	
};


/**
 * Make a bidding box element
 * @param {object} config the configuration parameters to make this elements
 * includes call, allowedCall, text and idPrefix
 * @return {string} generated html for element
 * @private
 */
Bridge._makeElement = function( config ) {
	_.defaults( config, {
		type: "button",
		text: "Click Me!",
		classes: [],
		data: [],
		idPrefix: null,
		prefix: "bidding-box",
		elementType: "call"
	});
	config.classes.push( config.prefix + "-" + config.elementType );
	config.classes.push( config.prefix + "-" + config.elementType + "-" + config.value );
	config.id = ( config.idPrefix ? config.idPrefix + "-" + config.prefix + "-" + config.elementType + "-" + config.value : null );
	config.data.push("data-" + config.elementType + "='" + config.value + "'");
	if ( config.disabled ) config.classes.push( config.prefix + "-" + config.elementType + "-disabled" );
	var html = "";
	html += "<" + config.type;
	if ( config.id ) html += " id='" + config.id + "'";
	html += " class='" + config.classes.join( " " ) + "'";
	html += " " + config.data.join( " " );
	if ( config.disabled ) html += " disabled";
	html += ">" + config.text + "</" + config.type + ">";
	return html;
};

/**
 * Create a bidding box configured according to the passed config parameters.
 * @param {object} config the config parameters
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype.toBiddingBox = function( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		type: "full",
		idPrefix: null,
		embed: false,
		containerID: null,
		registerChangeHandler: false,
		includeAllPass: false,
		includeUndo: false,
		includeReset: false,
		elementData: [],
		elementClasses: []
	});	

	if ( config.type === "concise" ) {
		var html = this._createBBOBiddingBox( config );
	}
	else {
		var html = this._createFullBiddingBox( config );
	}
	var auction = this;
	if ( config.embed ) Bridge.embedHTML( config.containerID, html );
	if ( !isCallback && config.registerChangeHandler ) {
		$( document ).on( "click", ".bidding-box-level", function() {
			var level = $( this ).data( "level" );
			//console.log("Level is " + level);
			auction.setSelectedLevel( level );
		});
		$( document ).on( "click", ".bidding-box-call", function() {
			var call = $( this ).data( "call" );
			//console.log("Call is " + call);
			if ( call === "all_pass" ) auction.addAllPass();
			else if ( call === "undo" ) auction.removeCall();
			else if ( call === "reset" ) auction.clearCalls();
			else if ( Bridge.isBid( call ) ) auction.addCall( auction.getSelectedLevel() + call );
			else auction.addCall( call );
		});		
		$( document ).on( "bidding-box:changed", { config: _.clone(config) }, function( e, auction ) {
			auction.toBiddingBox( e.data.config, true );
		});
	}			
	return html;
};

/**
 * Create a full bidding box.
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createFullBiddingBox = function( config ) {
	var allowedCalls = this.getContract().allowedCalls( this.nextToCall );
	var classes = "bidding-box-div";
	var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );	
	var html = "";
	html += "<div" + Bridge.addClassAndId( classes, id ) + ">";	
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	_.each( Bridge.callOrder, function( call ) {
		if ( !Bridge.isBid( call ) ) {
			var text = Bridge.calls[ call ].name;
			var classes = _.clone( config.elementClasses );
			var data = _.clone( config.elementData );
			html += Bridge._makeElement( { data: data, classes: classes, value:call, disabled:!allowedCalls[ call ], text:text, idPrefix:config.idPrefix } );
		}
	}, this );	
	html += "</div>";
	classes = "bidding-box-row";
	for ( var level = 1; level <= 7; ++level ) {
		html += "<div" + Bridge.addClassAndId( classes ) + ">";
		_.each( Bridge.callOrder.slice().reverse(), function( bid ) {
			if ( Bridge.isBid( bid ) ) {
				var call = level + bid;
				var text = level + Bridge.calls[ bid ].html;
				var classes = _.clone( config.elementClasses );
				var data = _.clone( config.elementData );				
				html += Bridge._makeElement( { data: data, classes: classes, value:call, disabled:!allowedCalls[ call ], text:text, idPrefix:config.idPrefix } );		
			}	
		}, this);
		html += "</div>";
	}
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	var additionalElements = [
		{ call: "all_pass", text: "All Pass", field: "p", include: config.includeAllPass },
		{ call: "undo", text: "Undo", field: "u", include: config.includeUndo },
		{ call: "reset", text: "Reset", field: "u", include: config.includeReset },
	];
	_.each( additionalElements, function( element ) {
		if ( element.include ) {
			var classes = _.clone( config.elementClasses );
			var data = _.clone( config.elementData );	
			html += Bridge._makeElement( { data: data, classes: classes, value:element.call, disabled:!allowedCalls[ element.field ], text:element.text, idPrefix:config.idPrefix } );					
		}
	}, this );
	html += "</div>";
	html += "</div>";	
	return html;	
};
/**
 * Create a bidding box that looks like BBO bidding box
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createBBOBiddingBox = function( config ) {
	var allowedCalls = this.getContract().allowedCalls( this.nextToCall );
	var selectedLevel = this.getSelectedLevel();
	var classes = "bidding-box-div";
	var id = ( config.idPrefix ? config.idPrefix + "-" + classes : null );	
	var html = "";
	var disabled = "";
	html += "<div" + Bridge.addClassAndId( classes, id ) + ">";	
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	_.each( Bridge.callOrder, function( call ) {
		if ( !Bridge.isBid( call ) ) {
			var text = Bridge.calls[ call ].name;
			var classes = _.clone( config.elementClasses );
			var data = _.clone( config.elementData );			
			html += Bridge._makeElement( { data: data, classes: classes, value:call, disabled:!allowedCalls[ call ], text:text, idPrefix:config.idPrefix } );
		}
	}, this );	
	html += "</div>";
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	var minimumLevel = allowedCalls[ "minimum_level" ]
	for ( var level = 1; level <= 7; ++level ) {
		var call = level;
		var text = level;
		var classes = _.clone( config.elementClasses );
		var data = _.clone( config.elementData );	
		if ( level === selectedLevel ) classes.push( "bidding-box-call-selected" );	
		var allowedCall = ( level >= minimumLevel );
		html += Bridge._makeElement( { elementType: "level", data: data, classes: classes, value:call, disabled:!allowedCall, text:text, idPrefix:config.idPrefix } );
	}
	html += "</div>";
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	_.each( Bridge.callOrder.slice().reverse(), function( call ) {
		if ( Bridge.isBid( call ) ) {
			var text = Bridge.calls[ call ].html;
			var classes = _.clone( config.elementClasses );
			var data = _.clone( config.elementData );	
			var allowedCall = !( !selectedLevel || !allowedCalls[ selectedLevel + call ] );
			html += Bridge._makeElement( { data: data, classes: classes, value:call, disabled:!allowedCall, text:text, idPrefix:config.idPrefix } );
		}
	}, this );
	html += "</div>";
	classes = "bidding-box-row";
	html += "<div" + Bridge.addClassAndId( classes ) + ">";
	var additionalElements = [
		{ call: "all_pass", text: "All Pass", field: "p", include: config.includeAllPass },
		{ call: "undo", text: "Undo", field: "u", include: config.includeUndo },
		{ call: "reset", text: "Reset", field: "u", include: config.includeReset },
	];
	_.each( additionalElements, function( element ) {
		if ( element.include ) {
			var classes = _.clone( config.elementClasses );
			var data = _.clone( config.elementData );	
			html += Bridge._makeElement( { data: data, classes: classes, value:element.call, disabled:!allowedCalls[ element.field ], text:element.text, idPrefix:config.idPrefix } );					
		}
	}, this );	
	html += "</div>";
	html += "</div>";	
	return html;
};




