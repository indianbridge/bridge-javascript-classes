/**
 * @fileOverview Lodash templates for hand diagrams, auctions etc.
 * @author Sriram Narasimhan
 * @version 1.0.0
 */

 /**
  * Define template registry in lodash/underscore.
  */
 var templateRegistry = (function(){
     var templateCache = {};

     var mixin = {
         declareTemplate: function(name, template) {
					 templateCache[name] = _.template(template);
         },
         renderTemplate: function(name, data) {
					 if (templateCache.hasOwnProperty(name)) {
             return templateCache[name](data);
					 }
					 else {
						 return "No template with name " + name + " was found!";
					 }
         }
     };

     return mixin;

 })();
_.mixin(templateRegistry);

// Get Namespace.
var Bridge = Bridge || {};

/**
 * Register a template to display hands.
 * @param {string} name - the name of this template.
 * @param {string} template - the lodash/underscore template string.
 */
Bridge.Hand.registerTemplate = function registerTemplate(name, template) {
	_.declareTemplate("hand." + name, template);
};

/**
 * Utility to add a div wrapper around html with an auto generated id.
 * @param {object} config the object that has all configuration parameters
 * @param {string} html the html to wrap
 * @return {string} the wrapped html
 */
Bridge._addWrapper = function( config, html ) {
	if ( config.wrapperID ) return html;
	config.wrapperID = Bridge.IDManager.getID();
	return "<div id='" + config.wrapperID + "'>" + html + "</div>";
};

/**
 * Register a callback handler.
 * @param {object} owner - the object registering the handler
 * @param {object} config - config object passed to the handler
 * @param {function} callback - the callback method to call
 */
Bridge._registerChangeHandler = function( owner, config, callback ) {
	// No op if flag is not set
	if (config.handlers && config.handlers.change) {
		var event = owner.getID() + Bridge.CONSTANTS.eventNameDelimiter + Bridge.CONSTANTS.eventName + '.' + config.wrapperID;
		$( document ).one( event, { config: _.cloneDeep( config ), owner: owner, callback: callback }, function( e, args ) {
			var id = e.data.config.wrapperID;
			if ( $( '#' + id ).length === 0 ) {
				// block is not in dom. Turn off event handler.
				return;
			}
			e.data.owner[e.data.callback](e.data.config);
		});
	}
};

/**
 * Generate html based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.toHTML = function toHTML(config) {
	config = config || {};
	config.template = config.template || "inline";
	var html = _.renderTemplate("hand." + config.template, { "hand": this, "config": config });
	if (config.wrapperID) {
		$('#' + config.wrapperID).empty().append(html);
	}
	else if (config.containerID) {
		$('#' + config.containerID).empty().append(Bridge._addWrapper(config, html));
	}
	Bridge._registerChangeHandler(this, config, arguments.callee.name);
	return html;
};

/** Register some default templates. */

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

_.declareTemplate( "hand.inline",`<section class="inline"><hand><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand><section>`);

_.declareTemplate( "hand.bridgewinners",`<section class="bw"><hand><header><%
		%><direction><%= hand.getDirection() %></direction><%
		%><name><%= hand.getName() %></name><%
	%></header><content><%
	html = _.renderTemplate("hand.cards", {"hand": hand, "config": config});
	%><%=html%></content></hand><section>`);

/** AUCTION TEMPLATES */
