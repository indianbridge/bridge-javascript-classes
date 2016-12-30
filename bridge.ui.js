/**
 * @fileOverview UI methods for display of bridge entities.
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
	if (config.wrapperID) return html;
	config.wrapperID = Bridge.IDManager.getID();
  config.wrapperClass = config.wrapperClass || "standard";
	return "<section id='" + config.wrapperID + "' class='" + config.wrapperClass + "'>" + html + "</section>";
};

/**
 * Register a  clickcallback handler.
 * @param {object} owner - the object registering the handler
 * @param {object} config - config object passed to the handler
 * @param {function} callback - the callback method to call
 */
Bridge._registerClickHandler = function( owner, config, objectType ) {
	// No op if flag is not set
	if (config.handlers && config.handlers.click) {
    var selector = '#' + config.wrapperID + ' .enabled';
    $(selector).one("click", {owner: owner}, function(e) {
      var eventName = Bridge.getEventName([owner.getID(), Bridge.CONSTANTS.changeEventName, objectType]);
      var operation = $(this).data("operation");
      if (operation) {
        $(document).trigger( eventName, { "operation" : operation, "parameters": $(this).data()});
      }
    });
	}
};

/**
 * Register a change callback handler.
 * @param {object} owner - the object registering the handler
 * @param {object} config - config object passed to the handler
 * @param {function} callback - the callback method to call
 */
Bridge._registerChangeHandler = function( owner, config, callback ) {
	// No op if flag is not set
	if (config.handlers && config.handlers.change) {
		var eventName = Bridge.getEventName([owner.getID(), Bridge.CONSTANTS.changedEventName]) + '.' + config.wrapperID;
		$(document).one(eventName, { config: config, owner: owner, callback: callback }, function(e, args) {
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
 * Perform additional operations with html like adding wrapper, embedding in container.
 * @param {string} html the html to wrap and embed.
 * @param {Object} config some configuration options.
 * @return {string} the wrapped html. Side effect is embedding of html in containerID if specified.
 */
Bridge._wrapAndEmbedHTML = function _wrapAndEmbedHTML(html, config) {
  if (config.wrapperID) {
    $('#' + config.wrapperID).empty().append(html);
  }
  else {
    html = Bridge._addWrapper(config, html);
    if (config.containerID) {
      $('#' + config.containerID).empty().append(html);
    }
  }
  return html;
};

/**
 * Make a deep copy of the config.
 * @param {Object} config the config to clone.
 * @return a clone of the config.
 */
Bridge._cloneConfig = function _cloneConfig(config) {
  if (config) return _.cloneDeep(config);
  else return {};
};

/**
 * Generate html to show hand based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.showHand = function showHand(config) {
	config = Bridge._cloneConfig(config);
	config.template = config.template || "standard";
  var template = "hand." + config.template;
	var html = _.renderTemplate(template, { "hand": this, "config": config });
  Bridge._wrapAndEmbedHTML(html, config);
	Bridge._registerChangeHandler(this, config, 'toHTML');
	return html;
};
Bridge.Hand.prototype.toHTML = Bridge.Hand.prototype.showHand;

/**
 * Generate html to show auction based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this auction using the passed template.
 */
Bridge.Auction.prototype.showAuction = function showAuction(config) {
	config = Bridge._cloneConfig(config);
	config.template = config.template || "standard";
  var template = "auction." + config.template;
	var html = _.renderTemplate(template, { "auction": this, "config": config });
	Bridge._wrapAndEmbedHTML(html, config);
	Bridge._registerChangeHandler(this, config, 'toHTML');
	return html;
};
Bridge.Auction.prototype.toHTML = Bridge.Auction.prototype.showAuction;

/**
 * Generate html to show bidding box based on configuration options.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this auction's bidding box using the passed template.
 */
Bridge.Auction.prototype.showBiddingBox = function showBiddingBox(config) {
	config = Bridge._cloneConfig(config);
	config.template = config.template || "standard";
  var template = "auction.bidding-box." + config.template;
	var html = _.renderTemplate(template, { "auction": this, "config": config });
	Bridge._wrapAndEmbedHTML(html, config);
	Bridge._registerChangeHandler(this, config, 'showBiddingBox');
  Bridge._registerClickHandler(this, config, 'auction');
	return html;
};

/**
 * Generate html to show card deck based on configuration options.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this deal's card deck using the passed template.
 */
Bridge.Deal.prototype.showCardDeck = function showCardDeck(config) {
	config = Bridge._cloneConfig(config);
	config.template = config.template || "standard";
  var template = "deal.card-deck." + config.template;
	var html = _.renderTemplate(template, { "deal": this, "config": config });
	Bridge._wrapAndEmbedHTML(html, config);
	Bridge._registerChangeHandler(this, config, 'showCardDeck');
  Bridge._registerClickHandler(this, config, 'deal');
	return html;
};

/**
 * Generate html to show deal based on configuration options.
 * If nothing is specified defaults are used.
 * @param {Object} config custom configuration options.
 * @return {string} html display of this deal using the passed template.
 */
Bridge.Deal.prototype.showDeal = function showDeal(config) {
	config = Bridge._cloneConfig(config);
	config.template = config.template || "standard";
  var template = "deal." + config.template;
	var html = _.renderTemplate(template, { "deal": this, "config": config });
	Bridge._wrapAndEmbedHTML(html, config);
	Bridge._registerChangeHandler(this, config, 'showDeal');
  Bridge._registerClickHandler(this, config, 'deal');
	return html;
};
Bridge.Deal.prototype.toHTML = Bridge.Deal.prototype.showDeal;
