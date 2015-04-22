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
	var containerClasses = [ config.prefix ];
	var containerTag = Bridge._getTag( config, containerClasses );
	html += Bridge._openTag( containerTag, config, containerClasses, [] );
	
	// header
	if ( header ) {
		var headerClasses = [ config.prefix + "-header" ];
		var headerTag = Bridge._getTag( config, headerClasses );
		html += Bridge._openTag( headerTag, config, headerClasses, [] );	
		html += header;
		html += Bridge._closeTag( headerTag );
	}
	
	// Content
	if ( content ) {
		var contentClasses = [ config.prefix + "-content" ];
		var contentTag = Bridge._getTag( config, contentClasses );
		html += Bridge._openTag( contentTag, config, contentClasses, [] );		
		html += content;
		html += Bridge._closeTag( contentTag );
	}
	
	// Footer
	if (footer ) {
		var footerClasses = [ config.prefix + "-footer" ];
		var footerTag = Bridge._getTag( config, footerClasses );
		html += Bridge._openTag( footerTag, config, footerClasses, [] );
		html += footer;	
		html += Bridge._closeTag( footerTag );
	}
	
	html += Bridge._closeTag( containerTag );	
	return html;
};

/**
 * Utility to generate classes
 * A layer is added for each element in passed array
 * @param {string} prefix the prefix to use
 * @param {array} additional classes to add
 */
Bridge._generateClasses = function( prefix, additionalClasses ) {
	var classes = [];
	_.each( additionalClasses, function( value ) {
		prefix += "-" + value;
		classes.push( prefix );
	}, this );
	return classes.reverse();
}; 

/**
 * Utility to generate a BBO style hand diagram.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Hand.prototype.toBBODiagram = function( config ) {
	config = Bridge.assignDefault( config, {} );	
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		prefix: "hand-diagram",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true
	});	
	config.show.direction = true;
	config.show.name = true;
	config.show.count = false;
	config.show.suit = true;
	config.show.cards = true;
	var prefix = config.prefix
	if( _.has( config.classes , prefix ) ) config.classes[ prefix ].push( "bbo" );
	else config.classes[ prefix ] = [ "bbo" ];
	var prefix = config.prefix;
	config.tags[ prefix ] = "table";
	config.tags[ prefix + "-header" ] = "thead";
	config.tags[ prefix + "-content" ] = "tbody";
	config.tags[ prefix + "-footer" ] = "tfoot";
	config.tags[ prefix + "-row" ] = "tr";
	config.tags[ prefix + "-column" ] = "td";
	config.tags[ prefix + "-field" ] = "span";		
	return this.toHTML( config );
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
		prefix: "hand-diagram",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true
	});	
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: false,
		name: false,
		count: false,
		suit: true,
		cards: true		
	});
	var tags = {};
	tags[ prefix ] = "div";
	tags[ prefix + "-header" ] = "div";
	tags[ prefix + "-content" ] = "div";
	tags[ prefix + "-footer" ] = "div";
	tags[ prefix + "-row" ] = "span";
	tags[ prefix + "-column" ] = "span";
	tags[ prefix + "-field" ] = "span";	
	_.defaults( config.tags, tags);	
	if ( config.registerChangeHandler && !config.idPrefix ) {
		Bridge._reportError( "idPrefix is required if change handler has to registered" );
	}

	var headerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "info" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = ""	
	var field = "direction";
	if ( config.show[ field ] ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field ] );
		columnTag = Bridge._getTag( config, columnClasses );	
		headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field ] );
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='" + this.get( field ) + "'" ];
		headerHTML += Bridge._openTag( tag, config, classes, data );
		headerHTML += this.get( field ).toUpperCase();
		headerHTML += Bridge._closeTag( tag );
		headerHTML += Bridge._closeTag( columnTag );
	}		
	field = "name";
	if ( config.show[ field ] ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field ] );
		columnTag = Bridge._getTag( config, columnClasses );
		headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field ] );
		var tag = Bridge._getTag( config, classes );		
		var data = [ "data-" + field + "='" + this.get( field ) + "'" ];
		headerHTML += Bridge._openTag( tag, config, classes, data );
		headerHTML += this.get( field );
		if ( config.show.count ) {
			var subField = "count";
			var classes = Bridge._generateClasses( prefix, [ "field", subField ] );
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
		rowClasses = Bridge._generateClasses( prefix, [ "row", suit ] );
		rowTag = Bridge._getTag( config, rowClasses );		
		contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		field = "suit";
		if ( config.show[ field ] ) {
			columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit ] );
			columnTag = Bridge._getTag( config, columnClasses );	
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = Bridge._generateClasses( prefix, [ "field", field, suit ] );
			var tag = Bridge._getTag( config, classes );		
			var data = [ "data-" + field + "='" + suit + "'" ];		
			contentHTML += Bridge._openTag( tag, config, classes, data );
			contentHTML += Bridge.suits[ suit ].html;
			contentHTML += Bridge._closeTag( tag );
			contentHTML += Bridge._closeTag( columnTag );
		}	
		field = "cards";
		if ( config.show[ field ] ) {
			columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit ] );
			columnTag = Bridge._getTag( config, columnClasses );
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = Bridge._generateClasses( prefix, [ "field", field, suit ] );
			var tag = Bridge._getTag( config, classes );		
			var data = [ "data-" + field + "='" + suit + "'" ];					
			var cards = "";
			var count = 0;
			_.each( Bridge.rankOrder, function( rank ) {
				if ( this.cards[ suit ][ rank ] ) {
					count++;
					classes = Bridge._generateClasses( prefix, [ "field", field, suit, rank ] );
					tag = Bridge._getTag( config, classes );					
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
		var id = config.idPrefix + "-" + config.prefix;
		var event = "hand:changed." + id;
		$( document ).on( event, { config: _.cloneDeep( config ), id: id, event: event, direction: this.getDirection() }, function( e, hand ) {
			var id = e.data.id;
			if ( $( '#' + id ).length === 0 ) {
				// block has been removed. Turn off event handler.
				var event = e.data.event;
				$( document ).off( event );
				return;
			}
			if ( hand.getDirection() === e.data.direction ) hand.toHTML( e.data.config, true );
		});
	}	
	return html;
};

/**
 * Utility to generate a BBO style auction diagram.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Auction.prototype.toBBODiagram = function( config ) {
	config = Bridge.assignDefault( config, {} );	
	_.defaults( config, {
		prefix: "auction-diagram",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true,
		addQuestionMark: true
	});	
	var prefix = config.prefix;
	config.show.direction = true;
	if( _.has( config.classes , prefix ) ) config.classes[ prefix ].push( "bbo" );
	else config.classes[ prefix ] = [ "bbo" ];
	config.tags[ prefix ] = "table";
	config.tags[ prefix + "-header" ] = "thead";
	config.tags[ prefix + "-content" ] = "tbody";
	config.tags[ prefix + "-footer" ] = "tfoot";
	config.tags[ prefix + "-row" ] = "tr";
	config.tags[ prefix + "-column" ] = "td";
	config.tags[ prefix + "-field" ] = "span";		
	return this.toHTML( config );
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
	_.defaults( config, {
		prefix: "auction-diagram",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true,
		addQuestionMark: true
	});	
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: false
	});
	var tags = {};
	tags[ prefix ] = "div";
	tags[ prefix + "-header" ] = "div";
	tags[ prefix + "-content" ] = "div";
	tags[ prefix + "-footer" ] = "div";
	tags[ prefix + "-row" ] = "span";
	tags[ prefix + "-column" ] = "span";
	tags[ prefix + "-field" ] = "span";		
	_.defaults( config.tags, tags );	
	if ( config.registerChangeHandler && !config.idPrefix ) {
		Bridge._reportError( "idPrefix is required if change handler has to registered" );
	}	
	
	// Header
	var headerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "directions" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var field = "direction";
	var vul = this.vulnerability;
	if ( config.show[ field ] ) {
		_.each( Bridge.directionOrder, function( direction ) {
			columnClasses = Bridge._generateClasses( prefix, [ "column", field, direction ] );
			columnTag = Bridge._getTag( config, columnClasses );
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = Bridge._generateClasses( prefix, [ "field", field, direction ] );
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
	
	// Content
	var contentHTML = "";
	var field = "call";
	var row = 0;
	rowClasses = Bridge._generateClasses( prefix, [ "row", "calls", row ] );
	rowTag = Bridge._getTag( config, rowClasses );
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var direction = 'w';
	var firstTime = true;
		
	while( this.dealer !== direction ) {
		firstTime = false;
		direction = Bridge.getLHO( direction );
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, direction ] );
		columnTag = Bridge._getTag( config, columnClasses );				
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field, direction ] );
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
				row++;
				rowClasses = Bridge._generateClasses( prefix, [ "row", "calls", row ] );
				rowTag = Bridge._getTag( config, rowClasses );
				contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
			}
		}
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, direction ] );
		columnTag = Bridge._getTag( config, columnClasses );				
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field, direction ] );
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
			row++;
			rowClasses = Bridge._generateClasses( prefix, [ "row", "calls", row ] );
			rowTag = Bridge._getTag( config, rowClasses );
			contentHTML += Bridge._closeTag( rowTag );
			contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		}
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, direction ] );
		columnTag = Bridge._getTag( config, columnClasses );				
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field, direction ] );
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='?' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += "?"
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );		
		direction = Bridge.getLHO( direction );
	}
	while( direction !== 'w' ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, direction ] );
		columnTag = Bridge._getTag( config, columnClasses );				
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
		var classes = Bridge._generateClasses( prefix, [ "field", field, direction ] );
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + field + "='' data-direction='" + direction + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
		direction = Bridge.getLHO( direction );
	}
	contentHTML += Bridge._closeTag( rowTag );
	
	// Footer
	var footerHTML = "";
	
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	if ( !isCallback && config.registerChangeHandler ) {
		var id = config.idPrefix + "-" + config.prefix;
		var event = "auction:changed." + id;
		$( document ).on( event, { config: _.cloneDeep( config ), id: id, event: event }, function( e, auction ) {
			var id = e.data.id;
			if ( $( '#' + id ).length === 0 ) {
				// block has been removed. Turn off event handler.
				var event = e.data.event;
				$( document ).off( event );
				return;
			}
			auction.toHTML( e.data.config, true );
		});
	}	
	return html;
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
		prefix: "card-deck",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		registerChangeHandler: true
	});	
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		title: true,
		activeHand: true,
		card: true,
		assignedTo: true
	});
	var tags = {};
	tags[ prefix ] = "table";
	tags[ prefix + "-header" ] = "thead";
	tags[ prefix + "-content" ] = "tbody";
	tags[ prefix + "-footer" ] = "tfoot";
	tags[ prefix + "-row" ] = "tr";
	tags[ prefix + "-column" ] = "td";
	tags[ prefix + "-field" ] = "span";	
	_.defaults( config.tags, tags);	
	
	// Header
	var headerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "title" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var field = "title";
	if ( config.show[ field ] ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field ] );
		columnTag = Bridge._getTag( config, columnClasses );
		headerHTML += Bridge._openTag( columnTag, config, columnClasses, [ "colspan=13" ] );
		var classes = Bridge._generateClasses( prefix, [ "field", field ] );
		var tag = Bridge._getTag( config, classes );
		var data = [];	
		headerHTML += Bridge._openTag( tag, config, classes, data );
		var text = "Assign / Unassign cards";
		if ( config.show.activeHand ) {
			text = "Assign Cards to Active Hand : " + Bridge.directions[ this.getActiveHand() ].name + " / Unassign from any hand";
		}
		headerHTML += text;
		headerHTML += Bridge._closeTag( tag );
		headerHTML += Bridge._closeTag( columnTag );							
	}		
	headerHTML += Bridge._closeTag( rowTag );	
	
	// Content
	var contentHTML = "";	
	field = "cards";
	// Cards in each suit
	_.each( Bridge.suitOrder, function( suit ) {
		rowClasses = Bridge._generateClasses( prefix, [ "row", field, suit ] );
		rowTag = Bridge._getTag( config, rowClasses );	
		var data = [ "data-suit='" + suit + "'" ];		
		contentHTML += Bridge._openTag( rowTag, config, rowClasses, data );
		_.each( Bridge.rankOrder, function( rank ) {
			var assignedTo = this._cardAssignedTo[ suit ][ rank ];
			if ( !assignedTo ) assignedTo = "";
			columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit, rank ] );
			if ( assignedTo ) columnClasses.push( "assigned" );
			columnTag = Bridge._getTag( config, columnClasses );
			data = [ "data-suit='" + suit + "'", "data-rank='" + rank + "'", "data-assignedto='" + assignedTo + "'" ];					
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );			
			classes = Bridge._generateClasses( prefix, [ "field", field, suit, rank ] );
			if ( assignedTo ) {
				classes.push( "assigned" );
				classes.push( "assigned-" + assignedTo );
			}
			else classes.push( "unassigned" );
			tag = Bridge._getTag( config, classes );	
			contentHTML += Bridge._openTag( tag, config, classes, data );
			contentHTML += Bridge.suits[ suit ].html + Bridge.ranks[ rank ].html;
			if ( config.show.assignedTo ) {
				if ( assignedTo ) contentHTML += "(" + assignedTo.toUpperCase() + ")";
			}
			contentHTML += Bridge._closeTag( tag );
			contentHTML += Bridge._closeTag( columnTag );
		}, this);		
					
		contentHTML += Bridge._closeTag( rowTag );
	}, this );	
	
	// Footer	
	var footerHTML = "";
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );	
	if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	if ( config.registerChangeHandler ) {
		var id = config.idPrefix + "-" + config.prefix;
		$(  "#" + id ).on( "click", ".card-deck-field-cards", { deal: this } , function( e ) {
			try {
				var suit = $( this ).data( "suit" );
				var rank = $( this ).data( "rank" );
				var assignedTo = $( this ).data( "assignedto" );
				if ( assignedTo ) {
					e.data.deal.getHand( assignedTo ).removeCard( suit, rank );
				}
				else {
					e.data.deal.getHand( e.data.deal.getActiveHand() ).addCard( suit, rank );
				}
			}
			catch ( err ) {
				alert( err.message );
			}
		});	
		if ( !isCallback ) {
			var event = "hand:changed." + id;
			$( document ).on( event, { deal: this, config: _.cloneDeep(config), id: id, event:event }, function( e, hand ) {
				var id = e.data.id;
				console.log("Event id = " + id );
				if ( $( '#' + id ).length === 0 ) {
					// block has been removed. Turn off event handler.
					var event = e.data.event;
					$( document ).off( event );
					return;
				}				
				e.data.deal.toCardDeck( e.data.config, true );
			});
		}		
	}			
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
		layout: "full",
		prefix: "bidding-box",
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
		allpass: true,
		undo: true,
		reset: true
	});
	var prefix = config.prefix;
	var tags = {};
	tags[ prefix ] = "table";
	tags[ prefix + "-header" ] = "thead";
	tags[ prefix + "-content" ] = "tbody";
	tags[ prefix + "-footer" ] = "tfoot";
	tags[ prefix + "-row" ] = "tr";
	tags[ prefix + "-column" ] = "td";
	tags[ prefix + "-field" ] = "span";	
	_.defaults( config.tags, tags);	
	
	if ( config.layout === "concise" ) {
		var html = this._createConciseBiddingBox( config );
	}
	else {
		var html = this._createFullBiddingBox( config );
	}
	
	if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	if ( config.registerChangeHandler ) {
		var id = config.idPrefix + "-" + config.prefix;
		$( "#" + id ).on( "click", ".bidding-box-field-level.enabled", { auction: this }, function( e ) {
			var level = $( this ).data( "level" );
			console.log("Level is " + level);
			e.data.auction.setSelectedLevel( level );
		});
		$(  "#" + id ).on( "click", ".bidding-box-field-calls.enabled", { auction: this }, function( e ) {
			try {
				var call = $( this ).data( "call" );
				var auction = e.data.auction;
				console.log("Call is " + call);
				if ( call === "allpass" ) auction.addAllPass();
				else if ( call === "undo" ) auction.removeCall();
				else if ( call === "reset" ) auction.clearCalls();
				else auction.addCall( call );
			}
			catch ( err ) {
				alert( err.message );
			}				
		});		
		if ( !isCallback ) {
			var event = "bidding-box:changed." + id;
			$(  document ).on( event, { config: _.cloneDeep(config), id: id, event: event }, function( e, auction ) {
				var id = e.data.id;
				if ( $( '#' + id ).length === 0 ) {
					// block has been removed. Turn off event handler.
					var event = e.data.event;
					$( document ).off( event );
					return;
				}			
				auction.toBiddingBox( e.data.config, true );
			});	
		}
	}			
	return html;
};

/**
 * Create a concise bidding box
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createConciseBiddingBox = function( config ) {
	var allowedCalls = this.getContract().allowedCalls( this.nextToCall );
	var selectedLevel = this.getSelectedLevel();
	var prefix = config.prefix;
	var minimumLevel = allowedCalls[ "minimum_level" ];
	
	// Header
	var headerHTML = "";										
	
	// Content
	var contentHTML = "";	
	var field = "level";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "level" ] );
	var rowTag = Bridge._getTag( config, rowClasses );		
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	_.each( _.range( 0, 8 ), function( level ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, level ] );
		data = [ "data-level='" + level + "'" ];	
		columnTag = Bridge._getTag( config, columnClasses );
		if ( level === 0 ) {
			contentHTML += "<" + columnTag + "/>";
		}
		else {
			contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
			var classes = Bridge._generateClasses( prefix, [ "field", field, level ] );
			var tag = Bridge._getTag( config, classes );
			if ( level === selectedLevel ) classes.push( "selected" );	
			var allowedCall = ( level >= minimumLevel );		
			if ( allowedCall ) classes.push( "enabled" );
			else {
				classes.push( "disabled" );
				data.push( "disabled" );
			}				
			contentHTML += Bridge._openTag( tag, config, classes, data );
			contentHTML += level;
			contentHTML += Bridge._closeTag( tag );	
		}			
		contentHTML += Bridge._closeTag( columnTag );				
	}, this );
	field = "calls";
	rowClasses = Bridge._generateClasses( prefix, [ "row", field ] );
	rowTag = Bridge._getTag( config, rowClasses );		
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );	
	_.each( Bridge.callOrder.slice().reverse(), function( suit ) {
		var text = ( Bridge.isBid( suit ) ? Bridge.calls[ suit ].html : Bridge.calls[ suit ].text );
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit ] );
		var call = ( Bridge.isBid( suit ) ? selectedLevel + suit : suit );
		data = [ "data-suit='" + suit + "'", "data-call='" + call + "'" ];	
		columnTag = Bridge._getTag( config, columnClasses );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
		var classes = Bridge._generateClasses( prefix, [ "field", field, suit ] );
		var tag = Bridge._getTag( config, classes );
		var allowedCall = selectedLevel ? true : false;
		if ( selectedLevel ) {
			allowedCall = ( Bridge.isBid( suit ) ? allowedCalls[ selectedLevel + suit ] : allowedCalls[ suit ] );
		}
		if ( allowedCalls[ call ] ) classes.push( "enabled" );
		else {
			classes.push( "disabled" );
			data.push( "disabled" );
		}				
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += text;
		contentHTML += Bridge._closeTag( tag );				
		contentHTML += Bridge._closeTag( columnTag );				
	}, this );
	contentHTML += Bridge._closeTag( rowTag );	
	
	
	// Footer	
	var footerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "utilities" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	footerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var fields = [
		{ field: "allpass", text: "All Pass", call: "allpass", bid: "p" },
		{ field: "skip" },
		{ field: "undo", text: "Undo", call: "undo", bid: "u" },
		{ field: "skip" },
		{ field: "reset", text: "Reset", call: "reset", bid: "u" }
	];
	field = "calls";
	_.each( fields, function( item ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, item.field ] );
		columnTag = Bridge._getTag( config, columnClasses );
		data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];
		data.push( "colspan=2" );
		if ( config.show[ item.field ] && item.field !== "skip" ) {
			footerHTML += Bridge._openTag( columnTag, config, columnClasses,data );
			var classes = Bridge._generateClasses( prefix, [ "field", field, item.field ] );
			var tag = Bridge._getTag( config, classes );
			if ( allowedCalls[ item.bid ] ) classes.push( "enabled" );
			else {
				classes.push( "disabled" );
				data.push( "disabled" );
			}			
			footerHTML += Bridge._openTag( tag, config, classes, data );
			footerHTML += item.text;
			footerHTML += Bridge._closeTag( tag );
		}
		else {
			footerHTML += "<" + columnTag + "/>";
		}		
		footerHTML += Bridge._closeTag( columnTag );										
	}, this );
	
	footerHTML += Bridge._closeTag( rowTag );		
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );	
	return html;
};

/**
 * Create a full bidding box.
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createFullBiddingBox = function( config ) {
	var allowedCalls = this.getContract().allowedCalls( this.nextToCall );
	var prefix = config.prefix;
	
	// Header
	var headerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "special-bids" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var fields = [
		{ field: "pass", text: "Pass", call: "p", bid: "p" },
		{ field: "skip" },
		{ field: "double", text: "X", call: "x", bid: "x" },
		{ field: "skip" },
		{ field: "redouble", text: "XX", call: "r", bid: "r" }
	];
	_.each( fields, function( item ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", "calls", item.bid ] );
		columnTag = Bridge._getTag( config, columnClasses );
		var data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];	
		if ( item.field !== "skip" ) {
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, data );
			var classes = Bridge._generateClasses( prefix, [ "field", "calls", item.bid ] );
			if ( allowedCalls[ item.bid ] ) classes.push( "enabled" );
			else {
				classes.push( "disabled" );
				data.push( "disabled" );
			}
			var tag = Bridge._getTag( config, classes );
			headerHTML += Bridge._openTag( tag, config, classes, data );
			headerHTML += item.text;
			headerHTML += Bridge._closeTag( tag );
		}
		else {
			headerHTML += "<" + columnTag + "/>";
		}
		headerHTML += Bridge._closeTag( columnTag );										
	}, this );
	
	headerHTML += Bridge._closeTag( rowTag );	
	
	// Content
	var contentHTML = "";	
	var field = "calls";
	_.each( _.range( 1, 8 ), function( level ) {
		var rowClasses = Bridge._generateClasses( prefix, [ "row", "level", level ] );
		var rowTag = Bridge._getTag( config, rowClasses );		
		contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		_.each( Bridge.callOrder.slice().reverse(), function( bid ) {
			if ( Bridge.isBid( bid ) ) {
				var call = level + bid;
				var text = level + Bridge.calls[ bid ].html;	
				columnClasses = Bridge._generateClasses( prefix, [ "column", field, level, bid ] );
				var data = [ "data-level='" + level + "'", "data-bid='" + bid + "'", "data-call='" + call + "'" ];	
				columnTag = Bridge._getTag( config, columnClasses );
				contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
				var classes = Bridge._generateClasses( prefix, [ "field", field, level, bid ] );
				var tag = Bridge._getTag( config, classes );
				if ( allowedCalls[ call ] ) classes.push( "enabled" );
				else {
					classes.push( "disabled" );
					data.push( "disabled" );
				}				
				contentHTML += Bridge._openTag( tag, config, classes, data );
				contentHTML += text;
				contentHTML += Bridge._closeTag( tag );				
				contentHTML += Bridge._closeTag( columnTag );				
			}
		}, this );
		contentHTML += Bridge._closeTag( rowTag );	
	}, this );
	
	
	// Footer	
	var footerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "utilities" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	footerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var fields = [
		{ field: "allpass", text: "All Pass", call: "allpass", bid: "p" },
		{ field: "skip" },
		{ field: "undo", text: "Undo", call: "undo", bid: "u" },
		{ field: "skip" },
		{ field: "reset", text: "Reset", call: "reset", bid: "u" }
	];
	_.each( fields, function( item ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", "calls", item.field ] );
		columnTag = Bridge._getTag( config, columnClasses );
		var data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];
		if ( config.show[ item.field ] && item.field !== "skip" ) {
			footerHTML += Bridge._openTag( columnTag, config, columnClasses,data );
			var classes = Bridge._generateClasses( prefix, [ "field", "calls", item.field ] );
			var tag = Bridge._getTag( config, classes );
			if ( allowedCalls[ item.bid ] ) classes.push( "enabled" );
			else {
				classes.push( "disabled" );
				data.push( "disabled" );
			}			
			footerHTML += Bridge._openTag( tag, config, classes, data );
			footerHTML += item.text;
			footerHTML += Bridge._closeTag( tag );
		}
		else {
			footerHTML += "<" + columnTag + "/>";
		}		
		footerHTML += Bridge._closeTag( columnTag );										
	}, this );
	
	footerHTML += Bridge._closeTag( rowTag );		
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	return html;	
};
