/**
 * @fileOverview Lodash templates for hand diagrams, auctions etc.
 * @author Sriram Narasimhan
 * @version 1.0.0
 */
// Get Namespace.
var Bridge = Bridge || {};

/** ALL TEMPLATES. **/
/**
 * Templates to be used for display of hand, auction, deal etc.
 */
Bridge.templates = {
	"hand": {},
	"auction": {},
};

/**
 * A inline display of hand with suit symbols.
 */
Bridge.templates.hand["inline1"] = `
<section class="inline">
<hand>
	<content><%= data.cards %></content>
</hand>
<section>
`;

/**
 * A inline display of hand with suit symbols.
 */
Bridge.templates.hand["inline"] = `
<section class="inline">
<hand>
	<content>
		<%_.each( hand.getAlternatingSuitOrder(), function( suit ) {%>
			<cards data-count="">
				<%=hand.getCount(suit)%>
			</cards>
		<%})%>
	</content>
</hand>
<section>
`;

/**
 * A bridge winners style display of hand.
 */
Bridge.templates.hand["bw"] = `
<section class="bw">
<hand>
	<header>
		<direction><%= data.direction %></direction>
		<name><%= data.name %></name>
	</header>
	<content><%= data.cards %></content>
</hand>
</section>
`;

/**
 * Register a template to display hands.
 * @param {string} name - the name of this template.
 * @param {string} template - the lodash/underscore template string.
 */
Bridge.Hand.registerTemplate = function registerTemplate( name, template ) {
	this.templates = this.templates || {};
	if ( this.templates.hasOwnProperty( name ) ) {
		Bridge._reportError( 'There is already a registered hand template with name : ' + name );
	}
	this.templates[name] = _.template( template );
};

/**
 * Generate html based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {string} templateName the name of template to used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.toHTML = function toHTML( templateName, config ) {
	templateName = templateName || "inline";
	config = config || {};
	if ( !this.templates || !this.templates.hasOwnProperty( templateName ) ) {
		Bridge._reportError( 'There is not a registered hand template with name : ' + templateName );
	}
	return this.templates[templateName]( { "hand": this, "config": config } );
};

/**
 * Generate html based on passed template and config.
 * If nothing is specified defaults are used.
 */
Bridge.Hand.prototype.toHTML1 = function toHTML1( config ) {
	config = config || {};
	_.defaults( config, Bridge.defaultConfig );
	var handTemplate = config.hand.template;
	var templateData = { "data": this.getTemplateData( "hand", config, config.generators ) };
	var html = handTemplate( templateData );
	return html;
};

Bridge.Hand.prototype.getTemplateData = function getTemplateData() {
	var out = {
		"hand": this,
		"core": Bridge,
	};
	return out;
};

Bridge.Hand.prototype.getTemplateData1 = function getTemplateData1( type, config, generators ) {
  config = config || {};
	var out = {};
	if ( config[ type ] ) {
		for ( var fieldName in config[ type ].fields ) {
			var generator = Bridge.getGenerator( type, config[ type ].fields[ fieldName ], generators, fieldName );
			if ( generator ) out[ fieldName ] = generator( this, config, fieldName );
		}
	}
	return out;
};

/**
 * Gets the html display of a directions in a auction.
 * @param {Bridge.Auction} auction - the auction whose directions are to be displayed.
 * @param {object} config - configuration options to customize display.
 * @param {string} fieldName - the string name of field to display.
 * @retruns {string} html representation of the field to be displayed.
 */
Bridge.Hand.getDirectionsHTML = function getDirectionsHTML( auction, config, fieldName ) {
	if ( ! config ) return '';
	var fieldConfig = config.auction.fields[ fieldName ];
	if ( !fieldConfig ) return '';
	var html = ""
	startDirection = config.auction.startDirection || 'w';
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


/**
 * Gets the html display of a single field in a hand.
 * This is used name and direction fields.
 * @param {Bridge.Hand} hand - the hand whose fields are to be displayed.
 * @param {object} config - configuration options to customize display.
 * @param {string} fieldName - the string name of field to display.
 * @retruns {string} html representation of the field to be displayed.
 */
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

/**
 * Gets the html display of the cards in a single hand.
 * @param {Bridge.Hand} hand - the hand whose fields are to be displayed.
 * @param {object} config - configuration options to customize display.
 * @param {string} fieldName - the string name of field to display.
 * @retruns {string} html representation of the cards in this hand.
 */
Bridge.Hand.getCardsHTML = function getCardsHTML( hand, config, fieldName ) {
	if ( ! config ) return '';
	var fieldConfig = config.hand.fields[ fieldName ];
	if ( !fieldConfig ) return '';
	var html = ""
	var suitOrder = ( config.alternateSuitColor ? hand.getAlternatingSuitOrder() : Bridge.suitOrder );
	_.each( suitOrder, function( suit ) {
		var count = hand.getCount( suit );
		html += "<cards data-count='" + count + "'" + ( count <= 0 ? " data-empty":"" ) + ">";
		html += "<suit data-suit='" + suit + "'>";
		html += Bridge.suits[ suit ].html;
		html += "</suit>";
		html += "<ranks>";
		if ( config.hand.showEmpty && count === 0 ) {
			html += "<rank data-suit='" + suit + "' data-rank='-'>-</rank>";
		}
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
 * Get the generator for this field.
 */
Bridge.getGenerator = function getGenerator( type, config, generators, fieldName ) {
	generators = generators || {};
	if ( generators[ fieldName ] ) return generators[ fieldName ];
	if ( generators[ type ] && generators[ type ][ fieldName ] ) return generators[ type ][ fieldName ];
	if ( config && config.generator ) return config.generator;
	return null;
};

/**
 * Default configs for all displays.
 */
Bridge.templates.defaultConfig = {}

/**
 * The default config for hand display.
 */
Bridge.templates.defaultConfig.hand = {
	"template": _.template( Bridge.templates.hand.inline ),
	"showEmpty": false,
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
};

/**
 * The default config for auction display.
 */
Bridge.templates.defaultConfig.auction = {
	"template": _.template( Bridge.templates.auction.inline ),
	"startDirection": 'w',
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
};

// Inline hand display
Bridge.templates.inlineConfig = _.cloneDeep( Bridge.templates.defaultConfig );
Bridge.templates.inlineConfig.hand.showEmpty = true;

// Bridge Winners style hand display
Bridge.templates.bwConfig = _.cloneDeep( Bridge.templates.defaultConfig );
Bridge.templates.bwConfig.hand.template = _.template( Bridge.templates.hand.bw );
Bridge.templates.bwConfig.hand.showEmpty = true;
Bridge.templates.bwConfig.alternateSuitColor = true;
