/**
 * <p>Provides a set of static utility functions.</p>
 * 
 * @module josm/util
 */
// -- imports 
var MessageFormat = java.text.MessageFormat;

/**
 * Checks whether a value is null or undefined.
 * 
 * @param {Object} value  the value to check
 * @type {Boolean}
 * @return false, if <code>value</code> is null or undefined; true, otherwise  
 */
exports.isNothing = function(value) {
	return value === null || value === void 0;
};

/**
 * Checks whether a value is neither null nor undefined.
 * 
 * @param {Object} value  the value to check
 * @type {Boolean}
 * @return false, if <code>value</code> is null or undefined; true, otherwise  
 */
exports.isSomething = function(val) {
	return ! exports.isNothing(val);
};

/**
 * <p>Trims leading and trailing whitespace from <code>s</code>.</p> 
 * 
 * <p>Replies s, if s is null
 * or undefined. Any other value is converted to a string, then leading and trailing white
 * space is removed.</p>
 * 
 * @param {String} s  the string to be trimmed
 * @type {String} 
 */
exports.trim = function(s){
	if (s == null || s == undefined) return s;
	return String(s).replace(/^\s+|\s+$/, '');
};

/**
 * <p>Assert a condition and throw an Error if the condition isn't met.</p>
 * 
 * <p><strong>Usage:</strong>
 * <dl>
 *   <dt><code>assert()</code></dt>
 *   <dd>Does nothing</dd>
 *   
 *    <dt><code>assert(cond)</code></dt>
 *    <dd>Checks the condition <code>cond</code>. If it is false, throws an Error.</dd>
 *    
 *    <dt><code>assert(cond, msg)</code></dt>
 *    <dd>Checks the condition <code>cond</code>. If it is false, throws an Error, whose <code>description</code> property
 *    is set to <code>msg</code>.</dd>
 *
 *	  <dt><code>assert(cond, msg, objs...)</code></dt>
 *    <dd>Checks the condition <code>cond</code>. If it is false, throws an Error, whose <code>description</code> property
 *    is set to the formatted message <code>msg</code>. Internally uses <code>java.text.MessageFormat</code> to format the message.</dd>
 *
 * </dl>
 * 
 * @example
 * // throws an Error
 * assert(false);                  
 * 
 * // throws an Error e, with e.description == "My message"
 * assert(false, "My message");    
 * 
 * // throws an Error e, with e.description == "My message: test"
 * assert(false, "My message: {0}", "test");    
 * 
 */
exports.assert = function() {
	switch(arguments.length) {
	case 0: 
		return;
	case 1:			
		if (arguments[0]) return;
		var error = new Error();
		error.name = "AssertionError";
		error.description = "An assertion failed";
		throw error;
		
	case 2: 
		if (arguments[0]) return;
		var error = new Error();
	    error.name = "AssertionError";
	    error.description = arguments[1];
	    throw error;
	    
	default:
		if (arguments[0]) return;
	    var error = new Error();
	    error.name = "AssertionError";
	    var args = Array.prototype.slice.call(arguments,0)
	    error.description = MessageFormat.format(arguments[1], args.slice(2));
	    throw error;
	}
};

/**
 * Asserts that <code>val</code> is defined and non-null.
 * 
 * @example
 * josm.util.assertSomething(null);    // -> throws an exception
 * josm.util.assertSomething(void 0);  // -> throws an exception
 * 
 * josm.util.assertSomting("test");    // -> OK 
 * josm.util.assertSomething(5);       // -> OK 
 * 
 * @param {Anything} val the value to check
 * @param {String} msg  (optional) message if the assertion fails
 * @param {Object...} values (optional) additional values used in <code>msg</code> placeholders 
 */
exports.assertSomething = function(val) {
	var args;
	if (arguments.length <= 1) {
		args = [exports.isSomething(val), "Expected a defined non-null value, got {0}", val];
	} else {
		args = [exports.isSomething(val)].concat(Array.prototype.slice.call(arguments,1));
	}
	exports.assert.apply(args);
};

/**
 * Asserts that <code>val</code> is a number.
 * 
 * @param {Anything} val the value to check
 * @param {String} msg  (optional) message if the assertion fails
 * @param {Object...} values (optional) additional values used in <code>msg</code> placeholders 
 */
exports.assertNumber = function(val) {
	var args;
	if (arguments.length <= 1) {
	   args = [exports.isSomething(val), "Expected a number, got {0}", val];
	} else {
	   args = [exports.isSomething(val)].concat(Array.prototype.slice.call(arguments,1));
	}
	exports.assert.apply(args);
};

/**
 * Returns true if  <code>val</code> is defined.
 * 
 * @param {Anything} val the value to check
 */
exports.isDef = function(val) {
	return val !== void 0;  
};

/**
 * Returns true if  <code>val</code> is a number.
 * 
 * @param {Anything} val the value to check
 */	
exports.isNumber = function(val) {
	return typeof val === "number";
};

/**
 * Returns true if  <code>val</code> is a string.
 * 
 * @param {Anything} val the value to check
 * @return true, if val is a string or a String object 
 */		
exports.isString = function(val) {
	return exports.isDef(val) && (typeof val === "string" || val instanceof String);
};

/**
 * Replies the number of properties owned by <code>o</code>.
 * 
 * @example
 * 
 * var o = {p1: "v1", p2: "v2"};
 * var c = util.countProperties(o);   // ->  2
 * 
 * o = {};
 * c = util.countProperties(o);       // ->  0
 * 
 * o = undefined;
 * c = util.countProperties(o);       // ->  undefined 
 * 
 */
exports.countProperties  = function(o) {
	if (exports.isNothing(o)) return void 0;
	if (! (typeof o === "object")) return void 0;
	var count = 0;
	for (var p in o) {
		if (o.hasOwnProperty(p)) count++;
	}
	return count;
};

/**
 * Replies true, if <code>o</code> owns at least one property.
 * 
 * @example
 * 
 * var o = {p1: "v1", p2: "v2"};
 * var c = util.hasProperties(o);   // ->  true
 * 
 * o = {};
 * c = util.hasProperties(o);       // ->  false
 * 
 * o = undefined;
 * c = util.hasProperties(o);       // ->  false 
 * 
 */
exports.hasProperties = function(o) {
	var count = exports.countProperties(o);
	if (count === void 0) return false;
	return count > 0;
};	


