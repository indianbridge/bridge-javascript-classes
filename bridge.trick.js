/**
 * Defines Trick class and all methods associated with it.
 */
 
// Check if namespace has been defined.
if ( !Bridge ) var Bridge = {};

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
