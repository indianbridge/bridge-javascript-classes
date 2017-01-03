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
 * Render a template.
 */
Bridge.toHTML = function toHTML(self, config, parameters, operation) {
  config = Bridge._cloneConfig(config);
  _.defaults(config, {
    registerClickHandlers: true,
    registerChangeHandlers: true,
  });
	var html = _.renderTemplate(config.template, parameters);
  var wrapperID = Bridge.IDManager.generateID();
  console.log("wrapperID " + wrapperID)
  html = "<section id='" + wrapperID + "'>" + html + "</section>";
  if (config.containerID) {
    var container = $('#' + config.containerID);
    if (container.length) {
      container.empty().append(html);
      if (config.registerChangeHandlers) {
        self.registerCallback(function() {
          console.log("calling back " + wrapperID);
          var wrapper = $('#' + wrapperID);
          if (wrapper.length) {
            var html = _.renderTemplate(config.template, parameters);
    			  wrapper.empty().append(html);
          }
        }, operation);
        // Register a change callback handler.
        // var eventName = Bridge.events.getEventName(self, operation);
        // $(document).on(eventName, function() {
        //   console.log("responding to " + eventName)
        //   console.log("wrapperid " + wrapperID);
        //   var wrapper = $('#' + wrapperID);
        //   console.log("wrapper " + wrapper);
        //   if (wrapper.length) {
        //     var html = _.renderTemplate(config.template, parameters);
    		// 	   wrapper.empty().append(html);
        //   } else {
        //     $(document).off(eventName);
        //   }
    		// });
      }
      if (config.registerClickHandlers) {
        // Register a  click callback handler.
        var selector = '#' + wrapperID + ' [data-operation].enabled';
        $(document).on("click", selector, function() {
          console.log(selector + "clicked");
          self[$(this).data("operation")]($(this).data());
        });
      }
    }
  }
	return html;
};

/**
 * Render a deal template.
 */
Bridge.Deal.prototype.toHTML = function toHTML(config, operation) {
  return Bridge.toHTML(this, config, { "deal": this, "config": config }, operation);
};

/**
 * Generate html to show card deck based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this deal's card deck using the passed template.
 */
 Bridge.Deal.prototype.showCardDeck = function showCardDeck(containerID, template) {
   template = template || "deal.card-deck.rows";
   var config = {
     "template": template,
 		 "containerID": containerID,
 	 }
   return this.toHTML(config);
 };

/**
 * Generate html to show vulnerability info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this deal's vulnerability using the passed template.
 */
Bridge.Deal.prototype.showVulnerability = function showVulnerability(containerID, template) {
  template = template || "deal.vulnerability";
  var config = {
    "template": template,
		"containerID": containerID,
	}
  return this.toHTML(config, "setVulnerability");
};
/*
*
 * Generate html to show dealer info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this deal's dealer using the passed template.
 */
Bridge.Deal.prototype.showDealer = function showDealer(containerID, template) {
  template = template || "deal.dealer";
  var config = {
    "template": template,
		"containerID": containerID,
	}
  return this.toHTML(config, "setDealer");
};


/**
 * Render a hand template.
 */
Bridge.Hand.prototype.toHTML = function toHTML(config, operation) {
  return Bridge.toHTML(this, config, { "hand": this, "config": config }, operation);
};

/**
 * Generate html to show hand based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.showHand = function showHand(containerID, template) {
  template = template || "hand.concise";
  var config = {
    "template": template,
		"containerID": containerID,
    "alternateSuitColor": true,
	}
  return this.toHTML(config);
};

/**
 * Render a auction template.
 */
Bridge.Auction.prototype.toHTML = function toHTML(config, operation) {
  return Bridge.toHTML(this, config, { "auction": this, "config": config }, operation);
};

/**
 * Generate html to show auction based on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this auction using the passed template.
 */
Bridge.Auction.prototype.showAuction = function showAuction(containerID, template) {
  template = template || "auction.full";
  var config = {
    "template": template,
		"containerID": containerID,
    "addQuestionMark": true,
	}
  return this.toHTML(config);
};

/**
 * Generate html to show bidding box based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} containerID the id of the container to embed html in
 * @return {string} html display of this auction's bidding box using the passed template.
 */
 Bridge.Auction.prototype.showBiddingBox = function showBiddingBox(containerID, template) {
   template = template || "auction.bidding-box.concise";
   var config = {
     "template": template,
 		 "containerID": containerID,
 	}
   return this.toHTML(config);
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
