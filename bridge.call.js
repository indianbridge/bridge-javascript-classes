/**
 * Defines Call class and all methods associated with it.
 */
 
// Check if namespace has been defined.
if ( !Bridge ) var Bridge = {};

/**
 * Creates a new Bridge Call.
 * @constructor
 * @memberof Bridge
 * @param {string} call  - a one character or two character string representing call
 * @param {string} direction - the direction of hand that makes this call
 */
Bridge.Call = function( call, direction ) {
	Bridge._checkBid( call );
	Bridge._checkDirection( direction );
	this.call = call;
	this.direction = direction;
	this.annotation = "";
	this.explanation = "";
};

// 
// Getters and Setters
/**
 * Get the call in this call object
 * @return {string} the call string
 */
Bridge.Call.prototype.getCall = function() {
	return this.call;
};

/**
 * Get the level of this call
 * @return {string} the level
 */
Bridge.Call.prototype.getLevel = function() {
	if ( this.call.length === 1 ) return 0;
	else return _.parseInt( this.call[0] );
};

/**
 * Get the suit of this call
 * @return {string} the level
 */
Bridge.Call.prototype.getSuit = function() {
	if ( this.call.length === 1 ) return this.call[0];
	else return this.call[1];
};

/**
 * Set the direction for who made this call
 * @param {string} direction - of hand that made this call
 */
Bridge.Call.prototype.setDirection = function( direction ) {
	Bridge._checkDirection( direction );
	this.direction = direction;
};

/**
 * Get the direction who made this call
 * @return {string} direction of hand that made this call
 */
Bridge.Call.prototype.getDirection = function() {
	return this.direction;
};

/**
 * Get the annotation associated with this call
 * @return {string} annotation
 */
Bridge.Call.prototype.getAnnotation = function() {
	return this.annotation;
};

/**
 * Set the annotation associated with this call
 * @param {string} annotation - the annotation to set to
 */
Bridge.Call.prototype.setAnnotation = function( annotation ) {
	Bridge._checkRequiredArgument( annotation );
	this.annotation = annotation;
};

/**
 * Get the explanation associated with this call
 * @return {string} explanation
 */
Bridge.Call.prototype.getExplanation = function() {
	return this.explanation;
};

/**
 * Set the explanation associated with this call
 * @param {string} explanation - the explanation to set to
 */
Bridge.Call.prototype.setExplanation = function( explanation ) {
	Bridge._checkRequiredArgument( explanation );
	this.explanation = explanation;
};

/**
 * Set a property in this hand.
 * The properties that can be got are as follows<br/>
 * direction - string - hand in BBO Handviewer string format<br/>
 * annotation - string - annotation associated with this call<br/>
 * explanation - string - explanation associated with this call<br/>
 * @param {string} property - the property to get
 * @param {string} value - the value to set the property to.
 */
Bridge.Call.prototype.set = function( property, value ) {
	var prefix = "In Call.set";
	Bridge._checkRequiredArgument( property, "Property", prefix );	
	Bridge._checkRequiredArgument( value, "Value for Property " + property, prefix );	
	switch ( property ) {
		case "direction" :
			this.setDirection( value );
			break;
		case "annotation" :
			this.setAnnotation( value );
			break;
		case "explanation" :
			this.setExplanation( value );
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Get a property from hand.
 * The properties that can be got are as follows<br/>
 * call - string - name of player holding this hand<br/>
 * direction - string - hand in BBO Handviewer string format<br/>
 * annotation - string - annotation associated with this call<br/>
 * explanation - string - explanation associated with this call<br/>
 * @param {string} property - the property to get
 */
Bridge.Call.prototype.get = function( property ) {
	var prefix = "In Call.get";
	Bridge._checkRequiredArgument( property, "Property", prefix );	
	switch ( property ) {
		case "call" :
			return this.getCall();
			break;
		case "direction" :
			return this.getDirection();
			break;
		case "annotation" :
			return this.getAnnotation();
			break;
		case "explanation" :
			return this.getExplanation();
			break;
		default :
			Bridge._reportError( "Unknown property " + property, prefix );
	}
};

/**
 * Generate a string display of this call.
 * @return {string} string representation of this call.
 */
Bridge.Call.prototype.toString = function() {
	var output = "";
	output += this.call;
	if ( this.explanation ) {
		output += "{" + this.explanation + "}";
	}
	if ( this.annotation ) {
		output += "(" + this.annotation + ")";
	}		
	return output;
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
