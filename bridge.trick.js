/**
 * Defines Trick class and all methods associated with it.
 */
 
// Get Namespace.
var Bridge = Bridge || {};

/**
 * Creates a new Bridge Trick.
 * @constructor
 * @memberof Bridge
 */
Bridge.Trick = function() {
	this.playNumber = 0;
	this.trump = null;
	this.winningCard = null;
};
