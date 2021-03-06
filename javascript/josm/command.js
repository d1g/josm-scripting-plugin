(function(){
	
/**
 * <p>A collection of functions to create commands which can be applied, undone and redone on
 * {@class org.opoenstreetmap.josm.gui.layer.OsmDataLayer}s.</p>
 * 
 * @module josm/command
 */		
var util = require("josm/util");
var layers = require("josm/layers");

var OsmPrimitive = org.openstreetmap.josm.data.osm.OsmPrimitive;
var OsmDataLayer = org.openstreetmap.josm.gui.layer.OsmDataLayer;

function checkAndFlatten(primitives) {
	var HashSet = java.util.HashSet;
	var ret = new HashSet();
	function visit(value) {
		if (util.isNothing(value)) return;
		if (util.isCollection(value)) {
			util.each(value, visit);
		} else if (value instanceof OsmPrimitive) {
			ret.add(value);
		} else {
			util.assert(false, "Unexpected object to add as OSM primitive, got {0}", value);
		}
	};
	visit(primitives);
	return ret;
};

function applyTo(layer) {
	var OsmDataLayer = org.openstreetmap.josm.gui.layer.OsmDataLayer;
	util.assert(util.isSomething(layer), "layer: must not be null or undefined");
	util.assert(layer instanceof OsmDataLayer, "layer: expected OsmDataLayer, got {0}", layer);
	layer.apply(this);
};


function toArray(collection){
	if (util.isArray(collection)) return collection;
	if (collection instanceof java.util.Collection) {
		var ret = [];
		for(var it=collection.iterator();it.hasNext();) ret.push(it.next());
		return ret;
	}
};

/**
 * A command to add a collection of objects to a data layer.
 * 
 * @class
 * @name AddCommand
 * @memberOf josm/command
 * @param {java.util.Collection|array} objs the objects to add
 */
exports.AddCommand = function (objs) {
	util.assert(objs, "objs: mandatory parameter missing");
	this._objs = toArray(checkAndFlatten(objs));
};

/**
 * Applies the command to a layer.
 * 
 * @method
 * @instance
 * @name applyTo
 * @summary Applies the command to a layer.
 * @memberOf AddCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 */
exports.AddCommand.prototype.applyTo = applyTo;

/**
 * Creates the internal JOSM command for this command
 * 
 * @method
 * @instance
 * @name createJOSMCommand
 * @summary Creates the internal JOSM command for this command
 * @memberOf AddCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 * @type {org.openstreetmap.josm.command.Command}
 */
exports.AddCommand.prototype.createJOSMCommand = function(layer) {
	var OsmDataLayer = org.openstreetmap.josm.gui.layer.OsmDataLayer;
	var AddMultiCommand = org.openstreetmap.josm.plugins.scripting.js.api.AddMultiCommand;	
	util.assert(util.isSomething(layer), "layer: must not be null or undefined");
	util.assert(layer instanceof OsmDataLayer, "layer: expected OsmDataLayer, got {0}", layer);
	return new AddMultiCommand(layer, this._objs);	
};

/**
 * <p>Creates a command to add a collection of objects to a data layer.</p>
 * 
 * <strong>Signatures</strong>
 * <dl>
 *   <dt><code class="signature">add(obj, obj, ...)</code> </dt>
 *   <dd><code>obj</code> are {@class org.openstreetmap.josm.data.osm.Node}s,
 *   {@class org.openstreetmap.josm.data.osm.Way}s, or
 *   {@class org.openstreetmap.josm.data.osm.Relations}s. Or javascript array
 *   or Java collections thereof.</dd>
 * </dl>
 * 
 * @example
 * var cmd = require("josm/command");
 * var layers = require("josm/layer");
 * var layer  = layers.get("Data Layer 1");
 * 
 * // add two nodes 
 * cmd.add(n1,n1).applyTo(layer);
 * 
 * // add an array of two nodes and a way  
 * layer.apply(
 *    cmd.add([n1,n2,w2])
 * );
 * 
 * @method
 * @name add
 * @summary Creates a command to add a collection of objects
 * @memberOf josm/command
 */
exports.add = function() {
	return new exports.AddCommand(checkAndFlatten(arguments));
};

/**
 * A command to delete a collection of objects in a data layer.
 * 
 * @class
 * @name DeleteCommand
 * @memberOf josm/command
 * @param {java.util.Collection|array} objs the objects to add 
 */
exports.DeleteCommand = function (objs) {
	this._objs = checkAndFlatten(objs);
};

/**
 * Applies the command to a layer.
 * 
 * @method
 * @instance
 * @name applyTo
 * @summary   Applies the command to a layer.
 * @memberOf DeleteCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 */
exports.DeleteCommand.prototype.applyTo = applyTo;

/**
 * Creates the internal JOSM command for this command
 * 
 * @method
 * @instance
 * @name createJOSMCommand
 * @summary Creates the internal JOSM command for this command
 * @memberOf DeleteCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 * @type {org.openstreetmap.josm.command.Command}
 */
exports.DeleteCommand.prototype.createJOSMCommand = function(layer) {
	var OsmDataLayer = org.openstreetmap.josm.gui.layer.OsmDataLayer;
	var DeleteCommand = org.openstreetmap.josm.command.DeleteCommand;	
	util.assert(util.isSomething(layer), "layer: must not be null or undefined");
	util.assert(layer instanceof OsmDataLayer, "layer: expected OsmDataLayer, got {0}", layer);
	return new DeleteCommand.delete(layer, this._objs, true /* alsoDeleteNodesInWay */, true /* silent */);	
};

/**
 * <p>Creates a command to delete a collection of objects in  a data layer.</p>
 * 
 * <strong>Signatures</strong>
 * <dl>
 *   <dt><code class="signature">delete(obj,obj,..., ?options)</code> </dt>
 *   <dd><code>obj</code> are {@class org.openstreetmap.josm.data.osm.Node}s,
 *   {@class org.openstreetmap.josm.data.osm.Way}s, or
 *   {@class org.openstreetmap.josm.data.osm.Relations}s. Or javascript array
 *   or Java collections thereof.</dd>
 * </dl>
 * 
 * @example
 * var cmd = require("josm/command");
 * var layers= require("josm/layer");
 * var layer = layers.get("Data Layer 1");
 * 
 * // delete two nodes 
 * cmd.delete(n1,n1).applyTo(layer);
 * 
 * // delete an array of two nodes and a way  
 * layer.apply(
 *    cmd.delete([n1,n2,w2])
 * );
 * 
 * @method
 * @name delete
 * @summary Creates a command to delete a collection of objects
 * @memberOf josm/command
 */
exports.delete = function() {
	return new exports.DeleteCommand(checkAndFlatten(arguments));
};

function scheduleLatChangeFromPara(para, change) {
	var LatLon = org.openstreetmap.josm.data.coor.LatLon;	
	if (!para || ! util.isDef(para.lat)) return;
	util.assert(util.isNumber(para.lat), "lat: lat must be a number, got {0}", para.lat);
	util.assert(LatLon.isValidLat(para.lat), "lat: expected a valid lat, got {0}", para.lat);
	change.withLatChange(para.lat);
};

function scheduleLonChangeFromPara(para, change) {
	var LatLon = org.openstreetmap.josm.data.coor.LatLon;
	if (!para || ! util.isDef(para.lon)) return;
	util.assert(util.isNumber(para.lon), "lon: lon must be a number, got {0}", para.lon);
	util.assert(LatLon.isValidLon(para.lon), "lon: expected a valid lon, got {0}", para.lon);
	change.withLonChange(para.lon);
};

function schedulePosChangeFromPara(para, change) {
	var LatLon = org.openstreetmap.josm.data.coor.LatLon;
	if (!para || ! util.isDef(para.pos)) return;
	util.assert(para.pos, "pos must no be null");
	var pos = para.pos;
	if (pos instanceof LatLon) {
		// OK
	} else if (typeof pos === "object") {
		pos = LatLon.make(pos);
	} else {
		util.assert(false, "pos: unexpected value, expected LatLon or object, got {0}", pos);
	}
	change.withPosChange(pos);
};

function scheduleNodeChangeFromPara(para, change) {
	if (!para || ! util.isDef(para.nodes)) return;	
	change.withNodeChange(para.nodes);
};

function scheduleMemberChangeFromPara(para, change) {
	if (!para || ! util.isDef(para.members)) return;	
	change.withMemberChange(para.members);
};

function scheduleTagsChangeFromPara(para, change) {
	var Map = java.util.Map;
	var HashMap = java.util.HashMap;
	
	if (!para || ! util.isDef(para.tags)) return;
	util.assert(para.tags, "tags must no be null");
	var tags = para.tags;
	if (tags instanceof Map) {
		// OK
	} else if (typeof tags === "object") {
		var map = new HashMap();
		for (var key in tags) {
			if (!tags.hasOwnProperty(key)) continue;
			key = util.trim(key);
			value = tags[key];
			map.put(key,value);
		}
		tags = map;
	} else {
		util.assert(false, "tags: unexpected value, expected Map or object, got {0}", tags);
	}
	change.withTagsChange(tags);
};

function changeFromParameters(para) {
	var Change = org.openstreetmap.josm.plugins.scripting.js.api.Change;
	var change = new Change();
	scheduleLatChangeFromPara(para,change);
	scheduleLonChangeFromPara(para,change);
	schedulePosChangeFromPara(para,change);
	scheduleTagsChangeFromPara(para,change);
	scheduleNodeChangeFromPara(para, change);
	scheduleMemberChangeFromPara(para,change);
	return change;
};

/**
 * A command to change a collection of objects in a data layer.
 * 
 * @class
 * @name ChangeCommand
 * @memberOf josm/command
 * @param {java.util.Collection|array}  objs  the objects to change
 * @param {org.openstreetmap.josm.plugins.scripting.js.api.Change} change the change specification
 */
exports.ChangeCommand = function (objs, change) {
	this._objs = checkAndFlatten(objs);
	this._change = change;
};

/**
 * Applies the command to a layer.
 * 
 * @method
 * @instance
 * @name applyTo
 * @summary Applies the command to a layer.
 * @memberOf ChangeCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 */
exports.ChangeCommand.prototype.applyTo = applyTo;

/**
 * Creates the internal JOSM command for this command
 * 
 * @method
 * @instance
 * @name createJOSMCommand
 * @summary Creates the internal JOSM command for this command
 * @memberOf ChangeCommand
 * @param {org.openstreetmap.josm.gui.layer.OsmDataLayer} layer the data layer
 * @type {org.openstreetmap.josm.command.Command}
 */
exports.ChangeCommand.prototype.createJOSMCommand = function(layer) {
	var OsmDataLayer = org.openstreetmap.josm.gui.layer.OsmDataLayer;
	var ChangeMultiCommand = org.openstreetmap.josm.plugins.scripting.js.api.ChangeMultiCommand;	
	util.assert(util.isSomething(layer), "layer: must not be null or undefined");
	util.assert(layer instanceof OsmDataLayer, "layer: expected OsmDataLayer, got {0}", layer);
	return new ChangeMultiCommand(layer, this._objs, this._change);	
};

/**
 * <p>Creates a command to change a collection of objects in  a data layer.</p>
 * 
 * <strong>Signatures</strong>
 * <dl>
 *   <dt><code class="signature">change(obj,obj,..., options)</code> </dt>
 *   <dd><code>obj</code> are {@class org.openstreetmap.josm.data.osm.Node}s,
 *   {@class org.openstreetmap.josm.data.osm.Way}s, or
 *   {@class org.openstreetmap.josm.data.osm.Relations}s. Or javascript array
 *   or Java collections thereof.</dd>
 * </dl>
 * 
 * The mandatory last argument is an object with named parameters. It accepts the following
 * named parameters:
 * <dl>
 *   <dt><code class="signature">lat:number</code></dt>
 *   <dd>Changes the latitude of the target nodes to <code>lat</code>.</dd>
 *   
 *   <dt><code class="signature">lon:number</code></dt>
 *   <dd>Changes the longitude of the target nodes to <code>lon</code>.</dd>
 *   
 *   <dt><code class="signature">pos:{@class org.openstreetmap.josm.data.coor.LatLon}|object</code></dt>
 *   <dd>Changes the position of the target nodes to <code>pos</code>. pos is either a
 *   {@class org.openstreetmap.josm.data.coor.LatLon} or an object <code>{lat:..., lon:...}</code> 
 *   </dd>
 *   
 *   <dt><code class="signature">tags:{@class java.util.Map}|object</code></dt>
 *   <dd>Changes the tags of the target objects to <code>tags</code>.</dd>
 *   
 *   <dt><code class="signature">nodes:{@class java.util.List}|array</code></dt>
 *   <dd>Changes the nodes of the target way sto <code>nodes</code>.</dd>
 *   
 *   <dt><code class="signature">members:{@class java.util.List}|array</code></dt>
 *   <dd>Changes the nodes of the target relations to <code>members</code>.</dd>
 * </dl>
 * 
 * @example
 * var cmd = require("josm/command");
 * var layers = require("josm/layer");
 * var layer = layers.get("Data Layer 1");
 * 
 * // change the position of a node  
 * cmd.change(n1,n1, {lat: 123.45, lon: 44.234}).applyTo(layer);
 * 
 * // change the nodes of a way 
 * layer.apply(
 *    cmd.change(w2, {nodes: [n1,n2,3]})
 * );
 * 
 * // change the tags of a collection of primitives
 * cmd.change(n1,n3, w1,r1, {
 *    tags: {"mycustommtag": "value"}
 * }).applyTo(layer);
 * 
 * @method
 * @name change
 * @summary Creates a command to change a collection of objects
 * @static
 * @memberOf josm/command
 */
exports.change = function() {
	var objs = [];
	var change;
	switch(arguments.length) {
	case 0: 
		util.assert(false, "Unexpected number of arguments, got {0} arguments", arguments.length);
	default:
		var a = arguments[arguments.length -1];
		if (a instanceof OsmPrimitive) {
			util.assert(false, "Argument {0}: unexpected last argument, expected named parameters, got {0}", a);
		} else if (typeof a === "object") {
			// last argument is an object with named parameters
			objs = Array.prototype.slice.call(arguments,0,-1);
			change = changeFromParameters(a);
		} else {
			util.assert(false, "Argument {0}: unexpected type of value, got {1}", arguments.length -1, a);
		}
		break;
	}
	
	var tochange = checkAndFlatten(objs);
	return new exports.ChangeCommand(tochange, change);
};

/**
 * <p>Accessor to the global command history.</p>
 * 
 * <p>Provides static methods to redo and undo commands.</p>
 * 
 * @name CommandHistory
 * @namespace
 * @summary Accessor to the global command history.
 */
exports.CommandHistory = {};

/**
 * Undoes the last <code>depth</code> commands.
 * 
 * @method
 * @name undo
 * @memberOf CommandHistory
 * @static
 * @summary Undoes the last <code>depth</code> commands.
 * @param {number} depth (optional) the number of commands to be undone. Default if missing: 1 
 */
exports.CommandHistory.undo = function(depth) {
	var Main = org.openstreetmap.josm.Main;
	
	if (util.isDef(depth)) {
		util.assert(util.isNumber(depth), "depth: expected a number, got {0}", depth);
		util.assert(depth > 0, "depth: expected number > 0, got {0}", depth);
	}
	if (!Main.main || !Main.main.undoRedo) return;
	if (depth){
		Main.main.undoRedo.undo(depth);
	} else {
		Main.main.undoRedo.undo();
	}
};

/**
 * Redoes the last <code>depth</code> commands.
 * 
 * @memberOf CommandHistory
 * @method
 * @name redo
 * @memberOf CommandHistory
 * @static
 * @summary Redoes the last <code>depth</code> commands.
 * @param {number} depth (optional) the number of commands to be redone. Default if missing: 1 
 */
exports.CommandHistory.redo = function(depth) {
	var Main = org.openstreetmap.josm.Main;
	
	if (util.isDef(depth)) {
		util.assert(util.isNumber(depth), "depth: expected a number, got {0}", depth);
		util.assert(depth > 0, "depth: expected number > 0, got {0}", depth);
	}
	if (!Main.main || !Main.main.undoRedo) return;
	if (depth){
		Main.main.undoRedo.redo(depth);
	} else {
		Main.main.undoRedo.redo();
	}
};

/**
 * Removes commands in the command history, either all commands, or only the commands 
 * applied to a specific layer.
 * 
 * @memberOf CommandHistory
 * @method
 * @static
 * @name clear
 * @summary Removes commands in the command history 
 * @param {org.openstreetmap.josm.gui.layer.Layer} layer (optional) the reference layer. Only commands 
 * applied to this layer are remove. Default if missing: <strong>all</strong> commands are removed.
 */
exports.CommandHistory.clear = function(layer) {
	var Main = org.openstreetmap.josm.Main;
	var Layer = org.openstreetmap.josm.gui.layer.Layer;
	
	function clearAll() {
		if (!Main.main || !Main.main.undoRedo) return;
		Main.main.undoRedo.clean();
	}
	
	function clearForLayer(layer) {
		if (!Main.main || !Main.main.undoRedo) return;
		Main.main.undoRedo.clean(layer);
	}
	
	switch(arguments.length) {
	case 0: clearAll(); break;
	case 1: 
		var layer = arguments[0];
		util.assert(layer instanceof Layer, "Expected a Layer, got {0}", layer);
		clearForLayer(layer);
		break;
	default:
		util.assert(false, "Unexpected number of arguments");
	}
};

/**
* Combines two or more ways into one resulting way. 
* 
* Reuses the logic behind the JOSM standard menu entry Tools-&gt;Combine Ways.
* If invoked from a script, this may trigger modal dialogs which are presented
* to the user, in particular if the direction of the ways has to be reversed 
* because otherwise they could not be combined.
* 
* @param ways the ways to be combined
* @example
* var cmd = require("josm/command");
* var layers = require("josm/layer");
* var ds = layers.activeLayer.data; 
* var ways  = [ds.way(1), ds.way(2), ds.way(3)];
* 
* // pass in an array ...
* cmd.combineWays(ways);
* // ... or the individual ways ...
* cmd.combineWays(ds.way(1), ds.way(2), ds.way(3));
* // ... or any combination thereof. 
* 
* @method
* @name combineWays
* @summary Combines two or more ways into one resulting way.
* @static
* @memberOf josm/command
*/
exports.combineWays = function() {	
	// ways becomes a java.util.HashSet
	var ways = checkAndFlatten(arguments);
	
	// remove any primitives which are not nodes from the arguments
	var it = ways.iterator();
	while (it.hasNext()) {
	    var primitive = it.next();
	    if (primitive == null || ! primitive.isWay) {
	    	it.remove();
	    } 
	}
	// at least two remaining ways required to combine them. If less, just
	// return, don't throw
	if (ways.size() <=1) return; 
	
	
	var activeLayer = layers.activeLayer;
	if (activeLayer == null) return;
	var data = activeLayer.data;

	var CombineWayAction = org.openstreetmap.josm.actions.CombineWayAction;
	var ret = CombineWayAction.combineWaysWorker(ways);
	// happens, if combineWayWorkers present a modal dialog and the user
	// aborts it
	if (ret == null) return;
	// ret.b is the SequenceCommand which combines the ways into one
	// resulting ways. Apply this command to the active layer.
	activeLayer.apply(ret.b);  
};

/**
* Combines the currently selected ways in the active layer into one resulting 
* way.
*
* Returns without effect if
* <ul>
*   <li>there is no active layer</li>
*   <li>the active layer is not a data layer</li>
*   <li>there are less than two selected ways in the active layer</li>
* </ul>
*
* Reuses the logic behind the JOSM standard menu entry Tools-&gt;Combine Ways.
* If invoked from a script, this may trigger modal dialogs which are presented
* to the user, in particular if the direction of the ways has to be reversed 
* because otherwise they could not be combined.
*
* @example
* var cmd = require("josm/command");
* var layers = require("josm/layer");
* var ds = layers.activeLayer.data; 
* var ways  = [ds.way(1), ds.way(2), ds.way(3)];
* cmd.combineWays(ways);
*
* @method
* @name combineSelectedWays
* @summary Combines the currently selected ways.
* @static
* @memberOf josm/command
*/
exports.combineSelectedWays = function() {
	var activeLayer = layers.activeLayer;
	if (activeLayer == null) return;
	var ways = activeLayer.data.selection.ways;
	if (ways == null || ways.length <= 1) return;
	exports.combineWays(ways);
};

}());

