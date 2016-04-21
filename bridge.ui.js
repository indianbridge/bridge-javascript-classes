// Get Namespace.
var Bridge = Bridge || {};

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
 * Utility to add a div wrapper around html
 * @param {object} config the object that has all configuration parameters
 * @param {string} html the html to wrap
 * @return {string} the wrapped html
 */
Bridge._addWrapper = function( config, html ) {
	var wrapped_html = "";
	wrapped_html += "<div";
	wrapped_html += config.rootID ? (" id='" + config.rootID + "'") : "";
	wrapped_html += config.containerClass ? " class='" + config.containerClass + "'" : "";
	wrapped_html += ">";
	wrapped_html += html;
	wrapped_html += "</div>";
	return wrapped_html;
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
 * Utility to generate table config classes
 */
Bridge.getTableConfig = function( prefix ) {
	var tags = {};
	tags[ prefix ] = "table";
	tags[ prefix + "-header" ] = "thead";
	tags[ prefix + "-content" ] = "tbody";
	tags[ prefix + "-footer" ] = "tfoot";
	tags[ prefix + "-row" ] = "tr";
	tags[ prefix + "-column" ] = "td";
	tags[ prefix + "-field" ] = "span";
	return tags;
};

/**
 * Utility to generate div config classes
 */
Bridge.getDivConfig = function( prefix ) {
	var tags = {};
	tags[ prefix ] = "div";
	tags[ prefix + "-header" ] = "div";
	tags[ prefix + "-content" ] = "div";
	tags[ prefix + "-footer" ] = "div";
	tags[ prefix + "-row" ] = "div";
	tags[ prefix + "-column" ] = "span";
	tags[ prefix + "-field" ] = "span";
	return tags;
};

/**
 * Utility to generate span config classes
 */
Bridge.getSpanConfig = function( prefix ) {
	var tags = {};
	tags[ prefix ] = "span";
	tags[ prefix + "-header" ] = "span";
	tags[ prefix + "-content" ] = "span";
	tags[ prefix + "-footer" ] = "span";
	tags[ prefix + "-row" ] = "span";
	tags[ prefix + "-column" ] = "span";
	tags[ prefix + "-field" ] = "span";
	return tags;
};

/**
 * Utility to generate a typical style hand diagram.
 * This is the standard configuration for BW and BBO styles.
 * Adding an appropriate top level class is only needed.
 * This just uses toHTML with appropriate configuration.
 * @param {object} config the config to use
 * @param {string} containerClass the class to apply at top level
 * @return {string} the html for this diagram
 */
 Bridge.Hand.prototype._toStandardHandDiagram = function( config, containerClass ) {
 	config = Bridge.assignDefault( config, {} );
 	_.defaults( config, {
 		containerClass: containerClass,
 		show: {}
 	});
 	_.defaults( config.show, {
 		direction: true,
 		name: true,
 		count: false,
 		suit: true,
 		cards: true
 	});
 	return this.toHTML( config );
 };

/**
 * Utility to generate a Bridge Winners style hand diagram.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Hand.prototype.toBWHandDiagram = function( config ) {
	return this._toStandardHandDiagram( config, "bw" );
};

/**
 * Utility to generate a Bridge Base Online style hand diagram.
 * This just uses toHTML with appropriate configuration
 */
 Bridge.Hand.prototype.toBBOHandDiagram = function( config ) {
 	return this._toStandardHandDiagram( config, "bbo" );
 };




/**
 * Get the generator for this field.
 */
Bridge.getGenerator = function getGenerator( type, config, generators, fieldName ) {
	generators = generators || {};
	if ( generators[ fieldName ] ) return generators[ fieldName ];
	if ( generators[ type ] && generators[ type ][ fieldName ] ) return generators[ type ][ fieldName ];
	if ( config && config.generator ) return config.generator;
	return null;
};


Bridge.Hand.prototype.getTemplateData = function getTemplateData( type, config, generators ) {
  config = config || {};
	var out = {};
	if ( config[ type ] ) {
		for ( var fieldName in config[ type ].fields ) {
			var generator = Bridge.getGenerator( type, config[ type ].fields[ fieldName ], generators, fieldName );
			if ( generator ) out[ fieldName ] = generator( this, config, fieldName );
		}
	}
	return out;
}

Bridge.Hand.getFieldHTML = function getFieldHTML( hand, config, fieldName ) {
	if ( ! config ) return '';
	var fieldConfig = config.hand.fields[ fieldName ];
	if ( !fieldConfig ) return '';
	var clickable = ( fieldConfig.click ? true : false );
	var fieldValue = hand.get( fieldName );
	var title = ( clickable ? fieldConfig.title : '' );
	var html = "<" + fieldName + "' title='" + title + "' data-clickable='" + clickable.toString() + "' data-" + fieldName + "='" +  fieldValue + "'>";
	html += fieldValue;
	html += "</" + fieldName + ">";
	return html;
};

Bridge.Hand.getCardsHTML = function getCardsHTML( hand, config, fieldName ) {
	if ( ! config ) return '';
	var fieldConfig = config.hand.fields[ fieldName ];
	if ( !fieldConfig ) return '';
	var html = ""
	var suitOrder = ( fieldConfig.alternateSuitColor ? hand.getAlternatingSuitOrder() : Bridge.suitOrder );
	_.each( suitOrder, function( suit ) {
		var count = hand.getCount( suit );
		html += "<cards data-count='" + count + "'" + ( count <= 0 ? " data-empty":"" ) + ">";
		html += "<suit data-suit='" + suit + "'>";
		html += Bridge.suits[ suit ].html;
		html += "</suit>";
		html += "<ranks>";
		_.each( Bridge.rankOrder, function( actualRank ) {
			if ( hand.cards[ suit ][ actualRank ] ) {
				var rank = hand.showAsX[ suit ][ actualRank ] ? 'x' : actualRank;
				var rankHTML = hand.showAsX[ suit ][ actualRank ] ? 'x' : Bridge.ranks[ rank ].html;
				var suitIndex = 3 - Bridge.suits[ suit ].index;
				if ( rank === 'x' ) var rankIndex = 13;
				else var rankIndex = 12 - Bridge.ranks[ rank ].index;
				var cardIndex = suitIndex * 14 + rankIndex;
				html += "<rank data-suit='" + suit + "' data-rank='" + rank + "'>";
				html += rankHTML;
				html += "</rank>";
			}
		}, hand);
		html += "</ranks>";
		html += "</cards>"
	}, hand);
	return html;
};

/**
 * A Registry of html generators.
 */
Bridge.defaultConfig = {
	"hand": {
		"template": _.template( Bridge.templates.hand.inline ),
		"fields": {
			"direction": {
				"generator": Bridge.Hand.getFieldHTML,
				"click": true,
				"title": "Click to make this hand active",
			},
			"name": {
				"generator": Bridge.Hand.getFieldHTML,
				"click": false,
				"title": "Click to change name",
			},
			"cards": {
				"generator": Bridge.Hand.getCardsHTML,
				"click": false,
				"title": "Click to change cards",
			}
		},
	}
};

/**
 * Generate html based on passed template and config.
 * If nothing is specified defaults are used.
 */
Bridge.Hand.prototype.toHTML = function toHTML( config, isCallback ) {
	config = config || {};
	_.defaults( config, Bridge.defaultConfig );
	var handTemplate = config.hand.template;
	var templateData = { "data": this.getTemplateData( "hand", config, config.generators ) };
	var html = handTemplate( templateData );
	return html;
};

/**
 * Generate a html display of this hand.
 * @param {object} config configuration parameters for display
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} HTML representation of this deal.
 */
Bridge.Hand.prototype.toHTML1 = function toHTML( config, isCallback ) {
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
		rootID: Bridge.IDManager.getID(),
		rootClass: null,
		alternateSuitColor: false,
		registerChangeHandler: true,
		registerClickHandler: true
	});
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: false,
		name: false,
		countInHeader: false,
		countInContent: false,
		suit: true,
		cards: true,
		text: true,
		emptySuit: true
	});

	// This cannot be done earlier because prefix will only be resolved at this point.
	_.defaults( config.tags, Bridge.getDivConfig( prefix ));

	var headerHTML = "";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "info" ] );
	if ( this.isActive() ) rowClasses.push( "active" );
	var rowTag = Bridge._getTag( config, rowClasses );
	if ( config.show.direction || config.show.name ) {
		headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		var columnClasses = [];
		var columnTag = ""
		var field = "direction";
		if ( config.show[ field ] ) {
			columnClasses = Bridge._generateClasses( prefix, [ "column", field ] );
			columnTag = Bridge._getTag( config, columnClasses );
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, [] );
			var classes = Bridge._generateClasses( prefix, [ "field", field ] );
			var data = [ "data-" + field + "='" + this.get( field ) + "'" ];
			if ( config.registerClickHandler ) {
				classes.push( "clickable" );
				data.push( "title='Click to make active hand'" );
			}
			var tag = Bridge._getTag( config, classes );
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
			if ( config.show.countInHeader ) {
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
	}

	// Content
	var contentHTML = "";
	// Cards in each suit
	var cardNumber = 0;
	var suitOrder = ( config.alternateSuitColor ? this.getAlternatingSuitOrder() : Bridge.suitOrder );
	_.each( suitOrder, function( suit ) {
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
			var data = [ "data-suit='" + suit + "'" ];
			var cards = "";
			var count = 0;
			_.each( Bridge.rankOrder, function( actualRank ) {
				if ( this.cards[ suit ][ actualRank ] ) {
					var rank = this.showAsX[ suit ][ actualRank ] ? 'x' : actualRank;
					var rankHTML = this.showAsX[ suit ][ actualRank ] ? 'x' : Bridge.ranks[ rank ].html;
					count++;
					classes = Bridge._generateClasses( prefix, [ "field", field, suit, rank ] );
					classes.push( prefix + "-field-" + field + "-" + cardNumber );
					tag = Bridge._getTag( config, classes );
					var suitIndex = 3 - Bridge.suits[ suit ].index;
					if ( rank === 'x' ) var rankIndex = 13;
					else var rankIndex = 12 - Bridge.ranks[ rank ].index;
					var cardIndex = suitIndex * 14 + rankIndex;
					var data = [ "data-suit='" + suit + "'", "data-rank='" + rank + "'", "data-card='" + suit + rank + "'", "data-card-order='" + cardIndex + "'" ];
					cards += Bridge._openTag( tag, config, classes, data );
					if ( config.show.text ) cards += rankHTML;
					cards += Bridge._closeTag( tag );
					cardNumber++;
				}
			}, this);
			if ( count === 0 && config.show.emptySuit && config.show.text ) cards += "-";
			contentHTML += cards;
			contentHTML += Bridge._closeTag( columnTag );
		}

		contentHTML += Bridge._closeTag( rowTag );
	}, this );
	if ( config.show.countInContent ) {
		var subField = "count";
		var classes = Bridge._generateClasses( prefix, [ "field", subField ] );
		var tag = Bridge._getTag( config, classes );
		var data = [ "data-" + subField + "='" + this.get( subField ) + "'" ];
		contentHTML += Bridge._openTag( tag, config, classes, data );
		contentHTML += "(" + this.get( subField ) + ")";
		contentHTML += Bridge._closeTag( tag );
	}
	// Footer
	var footerHTML = "";

	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	html = Bridge._embed( config, html, isCallback );
	Bridge._registerChangeHandler( this, config, arguments.callee.name );

	if ( !isCallback && config.registerClickHandler ) {
		var id = config.rootID;
		var selector = '#' + id + ' .' + config.prefix + "-field-direction";
		$( document ).on( "click", selector, { hand: this } , function( e ) {
			var hand = e.data.hand;
			if ( hand.deal ) {
				hand.deal.setActiveHand( hand.getDirection() );
			}
			else {
				hand.makeActive();
			}
		});
	}
	return html;
};

/**
 * Register a callback handler.
 * @param {object} owner - the object registering the handler
 * @param {object} config - config object passed to the handler
 * @param {function} callback - the callback method to call
 */
Bridge._registerChangeHandler = function( owner, config, callback ) {
	// No op is flag is not set
	if ( !config.registerChangeHandler ) return;
	var event = owner.getID() + Bridge.CONSTANTS.eventNameDelimiter + Bridge.CONSTANTS.eventName + '.' + config.rootID;
	$( document ).off( event );
	$( document ).on( event, { config: _.cloneDeep( config ), owner: owner, callback: callback, id: config.rootID, event: event }, function( e, args ) {
		var id = e.data.id;
		if ( $( '#' + id ).length === 0 ) {
			// block is not in dom. Turn off event handler.
			Bridge._logDebug( "Turning off event " + e.data.event );
			$( document ).off( e.data.event );
			return;
		}
		e.data.owner[e.data.callback]( e.data.config, true );
	});
};

/**
 * Utility to generate a typical style auction diagram.
 * This is the standard configuration for BW and BBO styles.
 * Adding an appropriate top level class is only needed.
 * This just uses toHTML with appropriate configuration.
 * @param {object} config the config to use
 * @param {string} containerClass the class to apply at top level
 * @return {string} the html for this diagram
 */
 Bridge.Auction.prototype._toStandardAuctionDiagram = function( config, containerClass ) {
	 config = Bridge.assignDefault( config, {} );
 	_.defaults( config, {
 		containerClass: containerClass,
 		addQuestionMark: true,
 		show: {}
 	});
 	// Since lodash does not have recursive defaults we need this hack
 	_.defaults( config.show, {
 		direction: true
 	});
 	return this.toHTML( config );
 };

/**
 * Utility to generate a Bridge Winners style auction diagram.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Auction.prototype.toBWAuctionDiagram = function( config ) {
	return this._toStandardAuctionDiagram( config, "bw" );
};

/**
 * Utility to generate a Bridge Base Online style auction diagram.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Auction.prototype.toBBOAuctionDiagram = function( config ) {
	return this._toStandardAuctionDiagram( config, "bbo" );
};



/**
 * Generate a html display of this auction.
 * @param {object} config configuration parameters for display
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html representation of this auction.
 */
Bridge.Auction.prototype.toHTML = function toHTML( config, isCallback ) {
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
		rootID: Bridge.IDManager.getID(),
		registerChangeHandler: true,
		addQuestionMark: true
	});
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		direction: false
	});
	var tags = Bridge.getDivConfig( prefix );
	_.defaults( config.tags, tags );

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
	html = Bridge._embed( config, html, isCallback );
	Bridge._registerChangeHandler( this, config, arguments.callee.name );
	return html;
};

/**
 * Convenience method to embed html.
 */
Bridge._embed = function( config, base_html, isCallback ) {
	if ( isCallback ) {
		// This is a callback so rootID should already be set.
		if ( config.rootID ) Bridge.embedHTML( config.rootID, base_html );
		// No need to register change handler again since we set it up the first time this was called.
	}
	else {
		// not a callback so this is the first time this is being called.
		// Add a wrapper with a rootID which can be used in callbacks.
		var html = Bridge._addWrapper( config, base_html );
		// Embed in container if requested in config.
		if ( config.containerID ) Bridge.embedHTML( config.containerID, html );
	}
	return html;
};

/**
 * Get the HTML for a given call.
 * @param {string} call the call to get html for
 * @return {string} the html
 */
Bridge.getCallHTML = function( call ) {
	var len = call.length;
	if ( len < 1 || len > 2 ) return call;
	call = call.toLowerCase();
	Bridge._checkBid( call );
	if ( len === 1 ) {
		return Bridge.calls[ call ].html;
	}
	else if ( len === 2 )  {
		return call[0] + Bridge.calls[ call[1] ].html;
	}
};

/**
 * Get the HTML for a given card.
 * @param {string} card the card to get html for
 * @return {string} the html
 */
Bridge.getCardHTML = function( card ) {
	var len = card.length;
	if ( len !== 2 ) return card;
	var rank = card[1].toLowerCase();
	var suit = card[0].toLowerCase();
	if ( rank !== 'x' ) Bridge._checkRank( rank );
	Bridge._checkSuit( suit );
	var html = '';
	html += Bridge.suits[ suit ].html;
	if ( rank === 'x' ) html += rank;
	else html += Bridge.ranks[ rank ].html;
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
 * Create the html for showing card deck to assign and unassign cards.
 * @return {string} html generated for card deck
 */
Bridge.Deal.prototype._getCardDeckHtml = function() {
	var html = "";
	html += "<div class='card-deck'>";
	html += "<div class='header'>";
	html += "<div class='title'>Assign / Unassign cards</div>";
	html += "<div class='assign-title'>Assign Cards to " + Bridge.directions[ this.getActiveHand() ].name + "</div>";
	html += "<div class='unassign-title'>Unassign from any hand</div>";
	html += "</div>";
	html += "<div class='content'>";
	_.each( Bridge.suitOrder, function( suit ) {
		html += "<div class='suit' data-suit='" + suit + "'>";
		_.each( Bridge.rankOrder, function( rank ) {
			var assignedTo = this.cards[ suit ][ rank ].getDirection();
			if ( !assignedTo ) assignedTo = "";
			var classes = [ 'rank' ];
			classes.push( assignedTo ? "assigned" : "unassigned" );
			var handName = Bridge.directions[ ( assignedTo ? assignedTo : this.getActiveHand() ) ].name;
			var title = ( assignedTo ? "Unassign from " : "Assign to " ) + handName;
			html += "<div class='" + classes.join(' ') + "' title='" + title + "' data-suit='" + suit + "' data-rank='" + rank + "' data-assigned_to='" + assignedTo + "'>";
			html += Bridge.suits[ suit ].html + Bridge.ranks[ rank ].html;
			if ( assignedTo ) {
				html += "<span class='assigned-to' data-direction='" + assignedTo + "'>(" + assignedTo.toUpperCase() + ")</span>";
			}
			html += "</div>";
		}, this);
		html += "</div>";
	}, this );
	html += "</div>";
	html += "<div class='footer'>";
	html += "</div>";
	html += "</div>";
	return html;
}

/**
 * Create a card deck configured according to the passed config parameters.
 * @param {object} config the config parameters
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html generated for bidding box
 */
Bridge.Deal.prototype.toCardDeck = function toCardDeck( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		prefix: "card-deck",
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		rootID: Bridge.IDManager.getID(),
		containerID: null,
		registerChangeHandler: true,
		registerClickHandler: true
	});
	var prefix = config.prefix;
	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		title: true,
		activeHand: true,
		text: true,
		assignedTo: true,
		reset: false
	});
	var tags = Bridge.getDivConfig( prefix );
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
			var assignedTo = this.cards[ suit ][ rank ].getDirection();
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
			if ( config.show.text ) contentHTML += Bridge.suits[ suit ].html + Bridge.ranks[ rank ].html;
			if ( config.show.assignedTo ) {
				if ( assignedTo ) contentHTML += "<span class='assigned-to'>(" + assignedTo.toUpperCase() + ")</span>";
			}
			contentHTML += Bridge._closeTag( tag );
			contentHTML += Bridge._closeTag( columnTag );
		}, this);

		contentHTML += Bridge._closeTag( rowTag );
	}, this );

	// Footer
	var footerHTML = "";
	if ( config.show.reset ) {
		var rowClasses = Bridge._generateClasses( prefix, [ "row", "reset" ] );
		var rowTag = Bridge._getTag( config, rowClasses );
		footerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		var columnClasses = [];
		var columnTag = "";
		var field = "reset";
		columnClasses = Bridge._generateClasses( prefix, [ "column", field ] );
		columnTag = Bridge._getTag( config, columnClasses );
		footerHTML += Bridge._openTag( columnTag, config, columnClasses, [ "colspan=13" ] );
		var classes = Bridge._generateClasses( prefix, [ "field", field ] );
		var tag = Bridge._getTag( config, classes );
		var data = [];
		footerHTML += Bridge._openTag( tag, config, classes, data );
		var text = "Reset/Clear Hand";
		footerHTML += text;
		footerHTML += Bridge._closeTag( tag );
		footerHTML += Bridge._closeTag( columnTag );
		footerHTML += Bridge._closeTag( rowTag );
	}
	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	html = Bridge._embed( config, html, isCallback );
	Bridge._registerChangeHandler( this, config, arguments.callee.name );

	if ( !isCallback && config.registerClickHandler ) {
		var id = config.rootID;
		$(  "#" + id ).on( "click", "." + config.prefix + "-field-cards", { deal: this } , function( e ) {
			var suit = $( this ).data( "suit" );
			var rank = $( this ).data( "rank" );
			var assignedTo = $( this ).data( "assignedto" );
			if ( assignedTo ) {
				e.data.deal.getHand( assignedTo ).removeCard( suit, rank );
			}
			else {
				e.data.deal.getHand( e.data.deal.getActiveHand() ).addCard( suit, rank );
			}
		});
		$(  "#" + id ).on( "click", "." + config.prefix + "-field-reset", { deal: this } , function( e ) {
			var deal = e.data.deal;
			deal.getHand( deal.getActiveHand() ).clearCards();
		});
	}
	return html;
};

/**
 * Utility to generate a typical style bidding box.
 * This is the standard configuration for BW and BBO styles.
 * Adding an appropriate top level class is only needed.
 * This just uses toHTML with appropriate configuration.
 * @param {object} config the config to use
 * @param {string} containerClass the class to apply at top level
 * @return {string} the html for this diagram
 */
 Bridge.Auction.prototype._toStandardBiddingBox = function( config, containerClass ) {
	config = Bridge.assignDefault( config, {} );
 	if ( config.layout && config.layout === "full" ) {
 		var containerClass = containerClass + " full";
 		var descendingSuitOrder = true;
 	}
 	else {
 		var containerClass = containerClass + " concise";
 		var descendingSuitOrder = false;
 	}
 	_.defaults( config, {
 		containerClass: containerClass,
 		descendingSuitOrder: descendingSuitOrder,
 		show: {}
 	});
 	_.defaults( config.show, {
 		allpass: true,
 		undo: true,
 		reset: true,
 	});
 	return this.toBiddingBox( config );
};

/**
 * Utility to generate a Bridge Winners style bidding box.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Auction.prototype.toBWBiddingBox = function( config ) {
	return this._toStandardBiddingBox( config, "bw" );
};

/**
 * Utility to generate a Bridge Base Online style bidding box.
 * This just uses toHTML with appropriate configuration
 */
Bridge.Auction.prototype.toBBOBiddingBox = function( config ) {
	return this._toStandardBiddingBox( config, "bbo" );
};

/**
 * Create a bidding box configured according to the passed config parameters.
 * @param {object} config the config parameters
 * @param {boolean} [isCallback] optional value indicating if this method was involed by a callback or not
 * This is used to determine whether enable click handlers or not (no if callback) default value is false
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype.toBiddingBox = function toBiddingBox( config, isCallback ) {
	isCallback = Bridge.assignDefault( isCallback, false );
	config = Bridge.assignDefault( config, {} );
	_.defaults( config, {
		layout: "concise",
		prefix: "bidding-box",
		descendingSuitOrder: false,
		show: {},
		tags: {},
		data: {},
		classes: {},
		idPrefix: null,
		containerID: null,
		rootID: Bridge.IDManager.getID(),
		registerChangeHandler: true,
		registerClickHandler: true
	});

	// Since lodash does not have recursive defaults we need this hack
	_.defaults( config.show, {
		allpass: true,
		undo: true,
		reset: true,
		abstain: false
	});
	var prefix = config.prefix;
	var tags = Bridge.getDivConfig( prefix );
	_.defaults( config.tags, tags);

	if ( config.layout === "concise" ) {
		var html = this._createConciseBiddingBox( config );
	}
	else if ( config.layout === "concise-level" ) {
		var html = this._createConciseBiddingBoxLevel( config );
	}
	else if ( config.layout === "concise-calls" ) {
		var html = this._createConciseBiddingBoxCalls( config );
	}
	else {
		var html = this._createFullBiddingBox( config );
	}
	html = Bridge._embed( config, html, isCallback );
	Bridge._registerChangeHandler( this, config, arguments.callee.name );

	if ( config.registerClickHandler && !isCallback ) {
		var id = config.rootID;
		$( "#" + id ).on( "click", "." + config.prefix + "-field-level.enabled", { auction: this }, function( e ) {
			var level = $( this ).data( "level" );
			e.data.auction.setSelectedLevel( level );
		});
		$(  "#" + id ).on( "click", "." + config.prefix + "-field-calls.enabled", { auction: this }, function( e ) {
			var call = $( this ).data( "call" );
			var auction = e.data.auction;
			if ( call === "allpass" ) auction.addAllPass();
			else if ( call === "undo" ) auction.removeCall();
			else if ( call === "reset" ) auction.clearCalls();
			else if ( call === "abstain" ) auction.abstain();
			else auction.addCall( call );
		});
	}
	return html;
};

/**
 * Create a split concise bidding box for level only
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createConciseBiddingBoxLevel = function( config ) {
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
	_.each( _.range( 1, 8 ), function( level ) {
		var columnClasses = Bridge._generateClasses( prefix, [ "column", field, level ] );
		var data = [ "data-level='" + level + "'" ];
		var columnTag = Bridge._getTag( config, columnClasses );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
		var classes = Bridge._generateClasses( prefix, [ "field", field, level ] );
		var tag = Bridge._getTag( config, classes );
		if ( level !== 0 && level === selectedLevel ) classes.push( "selected" );
		var allowedCall = ( level >= minimumLevel );
		if ( allowedCall ) classes.push( "enabled" );
		else {
			classes.push( "disabled" );
			data.push( "disabled" );
		}
		contentHTML += Bridge._openTag( tag, config, classes, data );
		if ( level !== 0 ) contentHTML += level;
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
	}, this );
	contentHTML += Bridge._closeTag( rowTag );


	// Footer
	var footerHTML = "";

	return Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
};

/**
 * Create a split concise bidding box for calls only
 * @param {object} config the config parameters
 * @return {string} html generated for bidding box
 */
Bridge.Auction.prototype._createConciseBiddingBoxCalls = function( config ) {
	var allowedCalls = this.getContract().allowedCalls( this.nextToCall );
	var selectedLevel = this.getSelectedLevel();
	var prefix = config.prefix;
	var minimumLevel = allowedCalls[ "minimum_level" ];

	// Header
	var headerHTML = "";

	// Content
	var contentHTML = "";
	var field = "calls";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", field ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var callOrder = ( config.descendingSuitOrder ? Bridge.callOrder : Bridge.callOrder.slice().reverse() );
	_.each( callOrder, function( suit ) {
		var text = ( Bridge.isStrain( suit ) ? Bridge.calls[ suit ].html : Bridge.calls[ suit ].text );
		var columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit ] );
		var call = ( Bridge.isStrain( suit ) ? selectedLevel + suit : suit );
		var data = [ "data-suit='" + suit + "'", "data-call='" + call + "'" ];
		var columnTag = Bridge._getTag( config, columnClasses );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
		var classes = Bridge._generateClasses( prefix, [ "field", field, suit ] );
		var tag = Bridge._getTag( config, classes );
		var allowedCall = selectedLevel ? true : false;
		if ( selectedLevel ) {
			allowedCall = ( Bridge.isStrain( suit ) ? allowedCalls[ selectedLevel + suit ] : allowedCalls[ suit ] );
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
	var footerHTML = "";
	return Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
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
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "special-bids" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	headerHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var columnClasses = [];
	var columnTag = "";
	var fields = [
		{ field: "abstain", text: "Abstain", call: "abstain", bid: "abstain" },
		{ field: "skip" },
		{ field: "pass", text: "Pass", call: "p", bid: "p" },
		{ field: "skip" },
		{ field: "double", text: "Double", call: "x", bid: "x" },
		{ field: "skip" },
		{ field: "redouble", text: "Rdbl", call: "r", bid: "r" }
	];
	_.each( fields, function( item ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", "calls", item.bid ] );
		columnTag = Bridge._getTag( config, columnClasses );
		var data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];
		if ( item.field !== "skip" ) {
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, data );
			var classes = Bridge._generateClasses( prefix, [ "field", "calls", item.bid ] );
			if ( allowedCalls[ item.bid ] || item.bid === 'abstain' ) classes.push( "enabled" );
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
	var field = "level";
	var rowClasses = Bridge._generateClasses( prefix, [ "row", "level" ] );
	var rowTag = Bridge._getTag( config, rowClasses );
	var columnClasses = null;
	var columnTag = null;
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	_.each( _.range( 0, 8 ), function( level ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, level ] );
		var data = [ "data-level='" + level + "'" ];
		columnTag = Bridge._getTag( config, columnClasses );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
		var classes = Bridge._generateClasses( prefix, [ "field", field, level ] );
		var tag = Bridge._getTag( config, classes );
		if ( level !== 0 && level === selectedLevel ) classes.push( "selected" );
		var allowedCall = ( level >= minimumLevel );
		if ( allowedCall ) classes.push( "enabled" );
		else {
			classes.push( "disabled" );
			data.push( "disabled" );
		}
		contentHTML += Bridge._openTag( tag, config, classes, data );
		if ( level !== 0 ) contentHTML += level;
		contentHTML += Bridge._closeTag( tag );
		contentHTML += Bridge._closeTag( columnTag );
	}, this );
	field = "calls";
	rowClasses = Bridge._generateClasses( prefix, [ "row", field ] );
	rowTag = Bridge._getTag( config, rowClasses );
	contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
	var callOrder = ( config.descendingSuitOrder ? Bridge.callOrder : Bridge.callOrder.slice().reverse() );
	_.each( callOrder, function( suit ) {
		var text = ( Bridge.isStrain( suit ) ? Bridge.calls[ suit ].html : Bridge.calls[ suit ].text );
		columnClasses = Bridge._generateClasses( prefix, [ "column", field, suit ] );
		var call = ( Bridge.isStrain( suit ) ? selectedLevel + suit : suit );
		var data = [ "data-suit='" + suit + "'", "data-call='" + call + "'" ];
		columnTag = Bridge._getTag( config, columnClasses );
		contentHTML += Bridge._openTag( columnTag, config, columnClasses, data );
		var classes = Bridge._generateClasses( prefix, [ "field", field, suit ] );
		var tag = Bridge._getTag( config, classes );
		var allowedCall = selectedLevel ? true : false;
		if ( selectedLevel ) {
			allowedCall = ( Bridge.isStrain( suit ) ? allowedCalls[ selectedLevel + suit ] : allowedCalls[ suit ] );
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
	if ( config.show.footer ) {
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
			var data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];
			var colspan = ( item.field !== "skip" ? "colspan=2" : "colspan=1" );
			data.push( colspan );
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
				footerHTML += "<" + columnTag + " " + colspan  + ">";
			}
			footerHTML += Bridge._closeTag( columnTag );
		}, this );
		footerHTML += Bridge._closeTag( rowTag );
	}

	var html = Bridge._generateHTMLModule( config, headerHTML, contentHTML, footerHTML );
	return html;
};

/**
 * Convenience utility to check if all bids at a level are not allowed.
 * @param {object} allowedCalls the status of all calls currently
 * @param {number} level the level to check
 * @return {boolean} true is calls are allowed at that level, false otherwise
 */
Bridge._levelHasAllowedCalls = function( allowedCalls, level ) {
	for ( var i = 0; i < Bridge.callOrder.length; ++i ) {
		var bid = Bridge.callOrder[i];
		var call = level + bid;
		if ( Bridge.isStrain( bid ) && allowedCalls[ call ] ) return true;
	};
	return false;
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
		{ field: "abstain", text: "Abstain", call: "abstain", bid: "abstain" },
		{ field: "skip",  },
		{ field: "pass", text: "Pass", call: "p", bid: "p" },
		{ field: "skip" },
		{ field: "double", text: "Double", call: "x", bid: "x" },
		{ field: "skip" },
		{ field: "redouble", text: "Rdbl", call: "r", bid: "r" }
	];
	_.each( fields, function( item ) {
		columnClasses = Bridge._generateClasses( prefix, [ "column", "calls", item.bid ] );
		columnTag = Bridge._getTag( config, columnClasses );
		var data = [ "data-bid='" + item.call + "'", "data-call='" + item.call + "'" ];
		if ( item.field !== "skip" ) {
			headerHTML += Bridge._openTag( columnTag, config, columnClasses, data );
			var classes = Bridge._generateClasses( prefix, [ "field", "calls", item.bid ] );
			if ( allowedCalls[ item.bid ] || item.bid === 'abstain' ) classes.push( "enabled" );
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
		if ( !Bridge._levelHasAllowedCalls( allowedCalls, level ) ) rowClasses.push( "disabled" );
		var rowTag = Bridge._getTag( config, rowClasses );
		contentHTML += Bridge._openTag( rowTag, config, rowClasses, [] );
		var callOrder = ( config.descendingSuitOrder ? Bridge.callOrder : Bridge.callOrder.slice().reverse() );
		_.each( callOrder, function( bid ) {
			if ( Bridge.isStrain( bid ) ) {
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
