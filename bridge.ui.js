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

Bridge.getCardHTML = function(card) {
  return "<suit data-suit='" + card[0].toLowerCase() + "'>" + Bridge.suits[ card[0].toLowerCase() ].html + "</suit><rank data-rank='" + card[1] + "'>" + card[1] + "</rank>";
};

Bridge.getBidHTML = function(bid) {
  if (bid.length < 2) return bid;
  return bid[0] + "<suit data-suit='" + bid[1].toLowerCase() + "'>" + Bridge.calls[bid[1].toLowerCase()].html + "</suit>";
};

Bridge.getSuitHTML = function(suit) {
  suit = suit.toLowerCase();
  return "<suit data-suit='" + suit + "'>" + Bridge.suits[suit].html + "</suit>";
};

Bridge.replaceSuitSymbolsHTML = function(text) {
  _.each(Bridge.suits, function(suitData, suit) {
    var re = new RegExp('!' + suit, "gi");
    text = text.replace(re, Bridge.getSuitHTML(suit));
  });
  return text;
};

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
  html = "<section id='" + wrapperID + "'>" + html + "</section>";
  if (config.container) {
    var container = $(config.container);
    if (container.length) {
      container.empty().append(html);
      if (config.registerChangeHandlers) {
        self.registerCallback(function() {
          var wrapper = $('#' + wrapperID);
          if (wrapper.length) {
            var html = _.renderTemplate(config.template, parameters);
    			  wrapper.empty().append(html);
          }
        }, operation);
      }
      if (config.registerClickHandlers) {
        // Register a  click callback handler.
        var selector = '#' + wrapperID + ' [data-operation].enabled';
        $(document).on("click", selector, function() {
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
 * Generate html to show dealer and vulnerability based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's card deck using the passed template.
 */
 Bridge.Deal.prototype.showDealerAndVulnerability = function showDealerAndVulnerability(container, config) {
   config = config || {};
   _.defaults(config, {
     container: container,
     template: "deal.dealer_and_vulnerability",
   });
   return this.toHTML(config, ["setVulnerability", "setDealer"]);
 };

/**
 * Generate html to show card deck based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's card deck using the passed template.
 */
 Bridge.Deal.prototype.showCardDeck = function showCardDeck(container, config) {
   config = config || {};
   _.defaults(config, {
     container: container,
     template: "deal.card-deck.rows",
   });
   return this.toHTML(config);
 };

/**
 * Generate html to show vulnerability info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's vulnerability using the passed template.
 */
Bridge.Deal.prototype.showVulnerability = function showVulnerability(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "deal.vulnerability",
  });
  return this.toHTML(config, "setVulnerability");
};

/*
 * Generate html to show dealer info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's dealer using the passed template.
 */
Bridge.Deal.prototype.showDealer = function showDealer(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "deal.dealer",
  });
  return this.toHTML(config, "setDealer");
};

/*
 * Generate html to show scoring info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's scoring type using the passed template.
 */
Bridge.Deal.prototype.showScoring = function showScoring(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "deal.scoring",
    scoringTypes: [
      "MPs",
      "IMPs",
      "BAM",
      "Total",
    ],
  });
  return this.toHTML(config, "setScoring");
};

/*
 * Generate html to show problem type info based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this deal's problem type using the passed template.
 */
Bridge.Deal.prototype.showProblemType = function showProblemType(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "deal.problemType",
    problemTypes: [
      "Bidding",
      "Lead",
    ],
  });
  return this.toHTML(config, "setProblemType");
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
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.showHand = function showHand(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "hand.cards",
  });
  return this.toHTML(config);
};

/**
 * Generate html to show hand that is on leadbased on passed template name (which should be registered) and config.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this hand using the passed template.
 */
Bridge.Hand.prototype.showLead = function showHand(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "hand.lead",
  });
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
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this auction using the passed template.
 */
Bridge.Auction.prototype.showAuction = function showAuction(container, config) {
  config = config || {};
  _.defaults(config, {
    container: container,
    template: "auction.full",
    "addQuestionMark": true,
  });
  return this.toHTML(config);
};

/**
 * Generate html to show bidding box based on configuration options.
 * If nothing is specified defaults are used.
 * @param {string} container the container css selector to embed html in
 * @param {object} config the configuration options to use
 * @return {string} html display of this auction's bidding box using the passed template.
 */
 Bridge.Auction.prototype.showBiddingBox = function showBiddingBox(container, config) {
   config = config || {};
   _.defaults(config, {
     container: container,
     template: "auction.bidding-box.concise",
   });
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
