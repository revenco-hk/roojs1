/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */



/*
 * These classes are derivatives of the similarly named classes in the YUI Library.
 * The original license:
 * Copyright (c) 2006, Yahoo! Inc. All rights reserved.
 * Code licensed under the BSD License:
 * http://developer.yahoo.net/yui/license.txt
 */

(function() {

var Event=Roo.EventManager;
var Dom=Roo.lib.Dom;

/**
 * @class Roo.dd.DragDrop
 * Defines the interface and base operation of items that that can be
 * dragged or can be drop targets.  It was designed to be extended, overriding
 * the event handlers for startDrag, onDrag, onDragOver and onDragOut.
 * Up to three html elements can be associated with a DragDrop instance:
 * <ul>
 * <li>linked element: the element that is passed into the constructor.
 * This is the element which defines the boundaries for interaction with
 * other DragDrop objects.</li>
 * <li>handle element(s): The drag operation only occurs if the element that
 * was clicked matches a handle element.  By default this is the linked
 * element, but there are times that you will want only a portion of the
 * linked element to initiate the drag operation, and the setHandleElId()
 * method provides a way to define this.</li>
 * <li>drag element: this represents the element that would be moved along
 * with the cursor during a drag operation.  By default, this is the linked
 * element itself as in {@link Roo.dd.DD}.  setDragElId() lets you define
 * a separate element that would be moved, as in {@link Roo.dd.DDProxy}.
 * </li>
 * </ul>
 * This class should not be instantiated until the onload event to ensure that
 * the associated elements are available.
 * The following would define a DragDrop obj that would interact with any
 * other DragDrop obj in the "group1" group:
 * <pre>
 *  dd = new Roo.dd.DragDrop("div1", "group1");
 * </pre>
 * Since none of the event handlers have been implemented, nothing would
 * actually happen if you were to run the code above.  Normally you would
 * override this class or one of the default implementations, but you can
 * also override the methods you want on an instance of the class...
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *  &nbsp;&nbsp;alert("dd was dropped on " + id);
 *  }
 * </pre>
 * @constructor
 * @param {String} id of the element that is linked to this instance
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DragDrop:
 *                    padding, isTarget, maintainOffset, primaryButtonOnly
 */
Roo.dd.DragDrop = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

Roo.dd.DragDrop.prototype = {

    /**
     * The id of the element associated with this object.  This is what we
     * refer to as the "linked element" because the size and position of
     * this element is used to determine when the drag and drop objects have
     * interacted.
     * @property id
     * @type String
     */
    id: null,

    /**
     * Configuration attributes passed into the constructor
     * @property config
     * @type object
     */
    config: null,

    /**
     * The id of the element that will be dragged.  By default this is same
     * as the linked element , but could be changed to another element. Ex:
     * Roo.dd.DDProxy
     * @property dragElId
     * @type String
     * @private
     */
    dragElId: null,

    /**
     * the id of the element that initiates the drag operation.  By default
     * this is the linked element, but could be changed to be a child of this
     * element.  This lets us do things like only starting the drag when the
     * header element within the linked html element is clicked.
     * @property handleElId
     * @type String
     * @private
     */
    handleElId: null,

    /**
     * An associative array of HTML tags that will be ignored if clicked.
     * @property invalidHandleTypes
     * @type {string: string}
     */
    invalidHandleTypes: null,

    /**
     * An associative array of ids for elements that will be ignored if clicked
     * @property invalidHandleIds
     * @type {string: string}
     */
    invalidHandleIds: null,

    /**
     * An indexted array of css class names for elements that will be ignored
     * if clicked.
     * @property invalidHandleClasses
     * @type string[]
     */
    invalidHandleClasses: null,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     * @property startPageX
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * The linked element's absolute X position at the time the drag was
     * started
     * @property startPageY
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * The group defines a logical collection of DragDrop objects that are
     * related.  Instances only get events when interacting with other
     * DragDrop object in the same group.  This lets us define multiple
     * groups using a single DragDrop subclass if we want.
     * @property groups
     * @type {string: string}
     */
    groups: null,

    /**
     * Individual drag/drop instances can be locked.  This will prevent
     * onmousedown start drag.
     * @property locked
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * Lock this instance
     * @method lock
     */
    lock: function() { this.locked = true; },

    /**
     * Unlock this instace
     * @method unlock
     */
    unlock: function() { this.locked = false; },

    /**
     * By default, all insances can be a drop target.  This can be disabled by
     * setting isTarget to false.
     * @method isTarget
     * @type boolean
     */
    isTarget: true,

    /**
     * The padding configured for this drag and drop object for calculating
     * the drop zone intersection with this object.
     * @method padding
     * @type int[]
     */
    padding: null,

    /**
     * Cached reference to the linked element
     * @property _domRef
     * @private
     */
    _domRef: null,

    /**
     * Internal typeof flag
     * @property __ygDragDrop
     * @private
     */
    __ygDragDrop: true,

    /**
     * Set to true when horizontal contraints are applied
     * @property constrainX
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * Set to true when vertical contraints are applied
     * @property constrainY
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * The left constraint
     * @property minX
     * @type int
     * @private
     */
    minX: 0,

    /**
     * The right constraint
     * @property maxX
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * The up constraint
     * @property minY
     * @type int
     * @type int
     * @private
     */
    minY: 0,

    /**
     * The down constraint
     * @property maxY
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * Maintain offsets when we resetconstraints.  Set to true when you want
     * the position of the element relative to its parent to stay the same
     * when the page changes
     *
     * @property maintainOffset
     * @type boolean
     */
    maintainOffset: false,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * horizontal graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @property xTicks
     * @type int[]
     */
    xTicks: null,

    /**
     * Array of pixel locations the element will snap to if we specified a
     * vertical graduation/interval.  This array is generated automatically
     * when you define a tick interval.
     * @property yTicks
     * @type int[]
     */
    yTicks: null,

    /**
     * By default the drag and drop instance will only respond to the primary
     * button click (left button for a right-handed mouse).  Set to true to
     * allow drag and drop to start with any mouse click that is propogated
     * by the browser
     * @property primaryButtonOnly
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * The availabe property is false until the linked dom element is accessible.
     * @property available
     * @type boolean
     */
    available: false,

    /**
     * By default, drags can only be initiated if the mousedown occurs in the
     * region the linked element is.  This is done in part to work around a
     * bug in some browsers that mis-report the mousedown if the previous
     * mouseup happened outside of the window.  This property is set to true
     * if outer handles are defined.
     *
     * @property hasOuterHandles
     * @type boolean
     * @default false
     */
    hasOuterHandles: false,

    /**
     * Code that executes immediately before the startDrag event
     * @method b4StartDrag
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * Abstract method called after a drag/drop object is clicked
     * and the drag or mousedown time thresholds have beeen met.
     * @method startDrag
     * @param {int} X click location
     * @param {int} Y click location
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * Code that executes immediately before the onDrag event
     * @method b4Drag
     * @private
     */
    b4Drag: function(e) { },

    /**
     * Abstract method called during the onMouseMove event while dragging an
     * object.
     * @method onDrag
     * @param {Event} e the mousemove event
     */
    onDrag: function(e) { /* override this */ },

    /**
     * Abstract method called when this element fist begins hovering over
     * another DragDrop obj
     * @method onDragEnter
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of one or more
     * dragdrop items being hovered over.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOver event
     * @method b4DragOver
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * Abstract method called when this element is hovering over another
     * DragDrop obj
     * @method onDragOver
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this is hovering over.  In INTERSECT mode, an array of dd items
     * being hovered over.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragOut event
     * @method b4DragOut
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * Abstract method called when we are no longer hovering over an element
     * @method onDragOut
     * @param {Event} e the mousemove event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was hovering over.  In INTERSECT mode, an array of dd items
     * that the mouse is no longer over.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * Code that executes immediately before the onDragDrop event
     * @method b4DragDrop
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * Abstract method called when this item is dropped on another DragDrop
     * obj
     * @method onDragDrop
     * @param {Event} e the mouseup event
     * @param {String|DragDrop[]} id In POINT mode, the element
     * id this was dropped on.  In INTERSECT mode, an array of dd items this
     * was dropped on.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * Abstract method called when this item is dropped on an area with no
     * drop target
     * @method onInvalidDrop
     * @param {Event} e the mouseup event
     */
    onInvalidDrop: function(e) { /* override this */ },

    /**
     * Code that executes immediately before the endDrag event
     * @method b4EndDrag
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * Fired when we are done dragging the object
     * @method endDrag
     * @param {Event} e the mouseup event
     */
    endDrag: function(e) { /* override this */ },

    /**
     * Code executed immediately before the onMouseDown event
     * @method b4MouseDown
     * @param {Event} e the mousedown event
     * @private
     */
    b4MouseDown: function(e) {  },

    /**
     * Event handler that fires when a drag/drop obj gets a mousedown
     * @method onMouseDown
     * @param {Event} e the mousedown event
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * Event handler that fires when a drag/drop obj gets a mouseup
     * @method onMouseUp
     * @param {Event} e the mouseup event
     */
    onMouseUp: function(e) { /* override this */ },

    /**
     * Override the onAvailable method to do what is needed after the initial
     * position was determined.
     * @method onAvailable
     */
    onAvailable: function () {
    },

    /*
     * Provides default constraint padding to "constrainTo" elements (defaults to {left: 0, right:0, top:0, bottom:0}).
     * @type Object
     */
    defaultPadding : {left:0, right:0, top:0, bottom:0},

    /*
     * Initializes the drag drop object's constraints to restrict movement to a certain element.
 *
 * Usage:
 <pre><code>
 var dd = new Roo.dd.DDProxy("dragDiv1", "proxytest",
                { dragElId: "existingProxyDiv" });
 dd.startDrag = function(){
     this.constrainTo("parent-id");
 };
 </code></pre>
 * Or you can initalize it using the {@link Roo.Element} object:
 <pre><code>
 Roo.get("dragDiv1").initDDProxy("proxytest", {dragElId: "existingProxyDiv"}, {
     startDrag : function(){
         this.constrainTo("parent-id");
     }
 });
 </code></pre>
     * @param {String/HTMLElement/Element} constrainTo The element to constrain to.
     * @param {Object/Number} pad (optional) Pad provides a way to specify "padding" of the constraints,
     * and can be either a number for symmetrical padding (4 would be equal to {left:4, right:4, top:4, bottom:4}) or
     * an object containing the sides to pad. For example: {right:10, bottom:10}
     * @param {Boolean} inContent (optional) Constrain the draggable in the content box of the element (inside padding and borders)
     */
    constrainTo : function(constrainTo, pad, inContent){
        if(typeof pad == "number"){
            pad = {left: pad, right:pad, top:pad, bottom:pad};
        }
        pad = pad || this.defaultPadding;
        var b = Roo.get(this.getEl()).getBox();
        var ce = Roo.get(constrainTo);
        var s = ce.getScroll();
        var c, cd = ce.dom;
        if(cd == document.body){
            c = { x: s.left, y: s.top, width: Roo.lib.Dom.getViewWidth(), height: Roo.lib.Dom.getViewHeight()};
        }else{
            xy = ce.getXY();
            c = {x : xy[0]+s.left, y: xy[1]+s.top, width: cd.clientWidth, height: cd.clientHeight};
        }


        var topSpace = b.y - c.y;
        var leftSpace = b.x - c.x;

        this.resetConstraints();
        this.setXConstraint(leftSpace - (pad.left||0), // left
                c.width - leftSpace - b.width - (pad.right||0) //right
        );
        this.setYConstraint(topSpace - (pad.top||0), //top
                c.height - topSpace - b.height - (pad.bottom||0) //bottom
        );
    },

    /**
     * Returns a reference to the linked element
     * @method getEl
     * @return {HTMLElement} the html element
     */
    getEl: function() {
        if (!this._domRef) {
            this._domRef = Roo.getDom(this.id);
        }

        return this._domRef;
    },

    /**
     * Returns a reference to the actual element to drag.  By default this is
     * the same as the html element, but it can be assigned to another
     * element. An example of this can be found in Roo.dd.DDProxy
     * @method getDragEl
     * @return {HTMLElement} the html element
     */
    getDragEl: function() {
        return Roo.getDom(this.dragElId);
    },

    /**
     * Sets up the DragDrop object.  Must be called in the constructor of any
     * Roo.dd.DragDrop subclass
     * @method init
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    init: function(id, sGroup, config) {
        this.initTarget(id, sGroup, config);
        Event.on(this.id, "mousedown", this.handleMouseDown, this);
        // Event.on(this.id, "selectstart", Event.preventDefault);
    },

    /**
     * Initializes Targeting functionality only... the object does not
     * get a mousedown handler.
     * @method initTarget
     * @param id the id of the linked element
     * @param {String} sGroup the group of related items
     * @param {object} config configuration attributes
     */
    initTarget: function(id, sGroup, config) {

        // configuration attributes
        this.config = config || {};

        // create a local reference to the drag and drop manager
        this.DDM = Roo.dd.DDM;
        // initialize the groups array
        this.groups = {};

        // assume that we have an element reference instead of an id if the
        // parameter is not a string
        if (typeof id !== "string") {
            id = Roo.id(id);
        }

        // set the id
        this.id = id;

        // add to an interaction group
        this.addToGroup((sGroup) ? sGroup : "default");

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        // the linked element is the element that gets dragged by default
        this.setDragElId(id);

        // by default, clicked anchors will not start drag operations.
        this.invalidHandleTypes = { A: "A" };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();

        this.handleOnAvailable();
    },

    /**
     * Applies the configuration parameters that were passed into the constructor.
     * This is supposed to happen at each level through the inheritance chain.  So
     * a DDProxy implentation will execute apply config on DDProxy, DD, and
     * DragDrop in order to get all of the parameters that are available in
     * each object.
     * @method applyConfig
     */
    applyConfig: function() {

        // configurable properties:
        //    padding, isTarget, maintainOffset, primaryButtonOnly
        this.padding           = this.config.padding || [0, 0, 0, 0];
        this.isTarget          = (this.config.isTarget !== false);
        this.maintainOffset    = (this.config.maintainOffset);
        this.primaryButtonOnly = (this.config.primaryButtonOnly !== false);

    },

    /**
     * Executed when the linked element is available
     * @method handleOnAvailable
     * @private
     */
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     /**
     * Configures the padding for the target zone in px.  Effectively expands
     * (or reduces) the virtual object size for targeting calculations.
     * Supports css-style shorthand; if only one parameter is passed, all sides
     * will have that padding, and if only two are passed, the top and bottom
     * will have the first param, the left and right the second.
     * @method setPadding
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * Stores the initial placement of the linked element.
     * @method setInitialPosition
     * @param {int} diffX   the X offset, default 0
     * @param {int} diffY   the Y offset, default 0
     */
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();

        if (!this.DDM.verifyEl(el)) {
            return;
        }

        var dx = diffX || 0;
        var dy = diffY || 0;

        var p = Dom.getXY( el );

        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;

        this.lastPageX = p[0];
        this.lastPageY = p[1];


        this.setStartPosition(p);
    },

    /**
     * Sets the start position of the element.  This is set when the obj
     * is initialized, the reset when a drag is started.
     * @method setStartPosition
     * @param pos current position (from previous lookup)
     * @private
     */
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY( this.getEl() );
        this.deltaSetXY = null;

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * Add this instance to a group of related drag/drop objects.  All
     * instances belong to at least one group, and can belong to as many
     * groups as needed.
     * @method addToGroup
     * @param sGroup {string} the name of the group
     */
    addToGroup: function(sGroup) {
        this.groups[sGroup] = true;
        this.DDM.regDragDrop(this, sGroup);
    },

    /**
     * Remove's this instance from the supplied interaction group
     * @method removeFromGroup
     * @param {string}  sGroup  The group to drop
     */
    removeFromGroup: function(sGroup) {
        if (this.groups[sGroup]) {
            delete this.groups[sGroup];
        }

        this.DDM.removeDDFromGroup(this, sGroup);
    },

    /**
     * Allows you to specify that an element other than the linked element
     * will be moved with the cursor during a drag
     * @method setDragElId
     * @param id {string} the id of the element that will be used to initiate the drag
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * Allows you to specify a child of the linked element that should be
     * used to initiate the drag operation.  An example of this would be if
     * you have a content div with text and links.  Clicking anywhere in the
     * content area would normally start the drag operation.  Use this method
     * to specify that an element inside of the content div is the element
     * that starts the drag operation.
     * @method setHandleElId
     * @param id {string} the id of the element that will be used to
     * initiate the drag.
     */
    setHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Roo.id(id);
        }
        this.handleElId = id;
        this.DDM.regHandle(this.id, id);
    },

    /**
     * Allows you to set an element outside of the linked element as a drag
     * handle
     * @method setOuterHandleElId
     * @param id the id of the element that will be used to initiate the drag
     */
    setOuterHandleElId: function(id) {
        if (typeof id !== "string") {
            id = Roo.id(id);
        }
        Event.on(id, "mousedown",
                this.handleMouseDown, this);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    /**
     * Remove all drag and drop hooks for this element
     * @method unreg
     */
    unreg: function() {
        Event.un(this.id, "mousedown",
                this.handleMouseDown);
        this._domRef = null;
        this.DDM._remove(this);
    },

    destroy : function(){
        this.unreg();
    },

    /**
     * Returns true if this instance is locked, or the drag drop mgr is locked
     * (meaning that all drag/drop is disabled on the page.)
     * @method isLocked
     * @return {boolean} true if this obj or all drag/drop is locked, else
     * false
     */
    isLocked: function() {
        return (this.DDM.isLocked() || this.locked);
    },

    /**
     * Fired when this object is clicked
     * @method handleMouseDown
     * @param {Event} e
     * @param {Roo.dd.DragDrop} oDD the clicked dd object (this dd obj)
     * @private
     */
    handleMouseDown: function(e, oDD){
        if (this.primaryButtonOnly && e.button != 0) {
            return;
        }

        if (this.isLocked()) {
            return;
        }

        this.DDM.refreshCache(this.groups);

        var pt = new Roo.lib.Point(Roo.lib.Event.getPageX(e), Roo.lib.Event.getPageY(e));
        if (!this.hasOuterHandles && !this.DDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {

                // set the initial element position
                this.setStartPosition();


                this.b4MouseDown(e);
                this.onMouseDown(e);

                this.DDM.handleMouseDown(e, this);

                this.DDM.stopEvent(e);
            } else {


            }
        }
    },

    clickValidator: function(e) {
        var target = e.getTarget();
        return ( this.isValidHandleChild(target) &&
                    (this.id == this.handleElId ||
                        this.DDM.handleWasClicked(target, this.id)) );
    },

    /**
     * Allows you to specify a tag name that should not start a drag operation
     * when clicked.  This is designed to facilitate embedding links within a
     * drag handle that do something other than start the drag.
     * @method addInvalidHandleType
     * @param {string} tagName the type of element to exclude
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * Lets you to specify an element id for a child of a drag handle
     * that should not initiate a drag
     * @method addInvalidHandleId
     * @param {string} id the element id of the element you wish to ignore
     */
    addInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Roo.id(id);
        }
        this.invalidHandleIds[id] = id;
    },

    /**
     * Lets you specify a css class of elements that will not initiate a drag
     * @method addInvalidHandleClass
     * @param {string} cssClass the class of the elements you wish to ignore
     */
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     * @method removeInvalidHandleType
     * @param {string} tagName the type of element to unexclude
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        // this.invalidHandleTypes[type] = null;
        delete this.invalidHandleTypes[type];
    },

    /**
     * Unsets an invalid handle id
     * @method removeInvalidHandleId
     * @param {string} id the id of the element to re-enable
     */
    removeInvalidHandleId: function(id) {
        if (typeof id !== "string") {
            id = Roo.id(id);
        }
        delete this.invalidHandleIds[id];
    },

    /**
     * Unsets an invalid css class
     * @method removeInvalidHandleClass
     * @param {string} cssClass the class of the element(s) you wish to
     * re-enable
     */
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    /**
     * Checks the tag exclusion list to see if this click should be ignored
     * @method isValidHandleChild
     * @param {HTMLElement} node the HTMLElement to evaluate
     * @return {boolean} true if this is a valid tag type, false if not
     */
    isValidHandleChild: function(node) {

        var valid = true;
        // var n = (node.nodeName == "#text") ? node.parentNode : node;
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];

        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }


        return valid;

    },

    /**
     * Create the array of horizontal tick marks if an interval was specified
     * in setXConstraint().
     * @method setXTicks
     * @private
     */
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.xTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * Create the array of vertical tick marks if an interval was specified in
     * setYConstraint().
     * @method setYTicks
     * @private
     */
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;

        var tickMap = {};

        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }

        this.yTicks.sort(this.DDM.numericSort) ;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Use
     * this method to limit the horizontal travel of the element.  Pass in
     * 0,0 for the parameters if you want to lock the drag to the y axis.
     * @method setXConstraint
     * @param {int} iLeft the number of pixels the element can move to the left
     * @param {int} iRight the number of pixels the element can move to the
     * right
     * @param {int} iTickSize optional parameter for specifying that the
     * element
     * should move iTickSize pixels at a time.
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = iLeft;
        this.rightConstraint = iRight;

        this.minX = this.initPageX - iLeft;
        this.maxX = this.initPageX + iRight;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * Clears any constraints applied to this instance.  Also clears ticks
     * since they can't exist independent of a constraint at this time.
     * @method clearConstraints
     */
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    /**
     * Clears any tick interval defined for this instance
     * @method clearTicks
     */
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    /**
     * By default, the element can be dragged any place on the screen.  Set
     * this to limit the vertical travel of the element.  Pass in 0,0 for the
     * parameters if you want to lock the drag to the x axis.
     * @method setYConstraint
     * @param {int} iUp the number of pixels the element can move up
     * @param {int} iDown the number of pixels the element can move down
     * @param {int} iTickSize optional parameter for specifying that the
     * element should move iTickSize pixels at a time.
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = iUp;
        this.bottomConstraint = iDown;

        this.minY = this.initPageY - iUp;
        this.maxY = this.initPageY + iDown;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;

    },

    /**
     * resetConstraints must be called if you manually reposition a dd element.
     * @method resetConstraints
     * @param {boolean} maintainOffset
     */
    resetConstraints: function() {


        // Maintain offsets if necessary
        if (this.initPageX || this.initPageX === 0) {
            // figure out how much this thing has moved
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        // This is the first time we have detected the element's position
        } else {
            this.setInitPosition();
        }

        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint,
                                 this.rightConstraint,
                                 this.xTickSize        );
        }

        if (this.constrainY) {
            this.setYConstraint( this.topConstraint,
                                 this.bottomConstraint,
                                 this.yTickSize         );
        }
    },

    /**
     * Normally the drag element is moved pixel by pixel, but we can specify
     * that it move a number of pixels at a time.  This method resolves the
     * location when we have it set up like this.
     * @method getTick
     * @param {int} val where we want to place the object
     * @param {int[]} tickArray sorted array of valid points
     * @return {int} the closest tick
     * @private
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel,
            // so we return the value passed to us.
            return val;
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * toString method
     * @method toString
     * @return {string} string representation of the dd obj
     */
    toString: function() {
        return ("DragDrop " + this.id);
    }

};

})();
/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * The drag and drop utility provides a framework for building drag and drop
 * applications.  In addition to enabling drag and drop for specific elements,
 * the drag and drop elements are tracked by the manager class, and the
 * interactions between the various elements are tracked during the drag and
 * the implementing code is notified about these important moments.
 */

// Only load the library once.  Rewriting the manager class would orphan
// existing drag and drop instances.
if (!Roo.dd.DragDropMgr) {

/**
 * @class Roo.dd.DragDropMgr
 * DragDropMgr is a singleton that tracks the element interaction for
 * all DragDrop items in the window.  Generally, you will not call
 * this class directly, but it does have helper methods that could
 * be useful in your DragDrop implementations.
 * @singleton
 */
Roo.dd.DragDropMgr = function() {

    var Event = Roo.EventManager;

    return {

        /**
         * Two dimensional Array of registered DragDrop objects.  The first
         * dimension is the DragDrop item group, the second the DragDrop
         * object.
         * @property ids
         * @type {string: string}
         * @private
         * @static
         */
        ids: {},

        /**
         * Array of element ids defined as drag handles.  Used to determine
         * if the element that generated the mousedown event is actually the
         * handle and not the html element itself.
         * @property handleIds
         * @type {string: string}
         * @private
         * @static
         */
        handleIds: {},

        /**
         * the DragDrop object that is currently being dragged
         * @property dragCurrent
         * @type DragDrop
         * @private
         * @static
         **/
        dragCurrent: null,

        /**
         * the DragDrop object(s) that are being hovered over
         * @property dragOvers
         * @type Array
         * @private
         * @static
         */
        dragOvers: {},

        /**
         * the X distance between the cursor and the object being dragged
         * @property deltaX
         * @type int
         * @private
         * @static
         */
        deltaX: 0,

        /**
         * the Y distance between the cursor and the object being dragged
         * @property deltaY
         * @type int
         * @private
         * @static
         */
        deltaY: 0,

        /**
         * Flag to determine if we should prevent the default behavior of the
         * events we define. By default this is true, but this can be set to
         * false if you need the default behavior (not recommended)
         * @property preventDefault
         * @type boolean
         * @static
         */
        preventDefault: true,

        /**
         * Flag to determine if we should stop the propagation of the events
         * we generate. This is true by default but you may want to set it to
         * false if the html element contains other features that require the
         * mouse click.
         * @property stopPropagation
         * @type boolean
         * @static
         */
        stopPropagation: true,

        /**
         * Internal flag that is set to true when drag and drop has been
         * intialized
         * @property initialized
         * @private
         * @static
         */
        initalized: false,

        /**
         * All drag and drop can be disabled.
         * @property locked
         * @private
         * @static
         */
        locked: false,

        /**
         * Called the first time an element is registered.
         * @method init
         * @private
         * @static
         */
        init: function() {
            this.initialized = true;
        },

        /**
         * In point mode, drag and drop interaction is defined by the
         * location of the cursor during the drag/drop
         * @property POINT
         * @type int
         * @static
         */
        POINT: 0,

        /**
         * In intersect mode, drag and drop interactio nis defined by the
         * overlap of two or more drag and drop objects.
         * @property INTERSECT
         * @type int
         * @static
         */
        INTERSECT: 1,

        /**
         * The current drag and drop mode.  Default: POINT
         * @property mode
         * @type int
         * @static
         */
        mode: 0,

        /**
         * Runs method on all drag and drop objects
         * @method _execOnAll
         * @private
         * @static
         */
        _execOnAll: function(sMethod, args) {
            for (var i in this.ids) {
                for (var j in this.ids[i]) {
                    var oDD = this.ids[i][j];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },

        /**
         * Drag and drop initialization.  Sets up the global event handlers
         * @method _onLoad
         * @private
         * @static
         */
        _onLoad: function() {

            this.init();


            Event.on(document, "mouseup",   this.handleMouseUp, this, true);
            Event.on(document, "mousemove", this.handleMouseMove, this, true);
            Event.on(window,   "unload",    this._onUnload, this, true);
            Event.on(window,   "resize",    this._onResize, this, true);
            // Event.on(window,   "mouseout",    this._test);

        },

        /**
         * Reset constraints on all drag and drop objs
         * @method _onResize
         * @private
         * @static
         */
        _onResize: function(e) {
            this._execOnAll("resetConstraints", []);
        },

        /**
         * Lock all drag and drop functionality
         * @method lock
         * @static
         */
        lock: function() { this.locked = true; },

        /**
         * Unlock all drag and drop functionality
         * @method unlock
         * @static
         */
        unlock: function() { this.locked = false; },

        /**
         * Is drag and drop locked?
         * @method isLocked
         * @return {boolean} True if drag and drop is locked, false otherwise.
         * @static
         */
        isLocked: function() { return this.locked; },

        /**
         * Location cache that is set for all drag drop objects when a drag is
         * initiated, cleared when the drag is finished.
         * @property locationCache
         * @private
         * @static
         */
        locationCache: {},

        /**
         * Set useCache to false if you want to force object the lookup of each
         * drag and drop linked element constantly during a drag.
         * @property useCache
         * @type boolean
         * @static
         */
        useCache: true,

        /**
         * The number of pixels that the mouse needs to move after the
         * mousedown before the drag is initiated.  Default=3;
         * @property clickPixelThresh
         * @type int
         * @static
         */
        clickPixelThresh: 3,

        /**
         * The number of milliseconds after the mousedown event to initiate the
         * drag if we don't get a mouseup event. Default=1000
         * @property clickTimeThresh
         * @type int
         * @static
         */
        clickTimeThresh: 350,

        /**
         * Flag that indicates that either the drag pixel threshold or the
         * mousdown time threshold has been met
         * @property dragThreshMet
         * @type boolean
         * @private
         * @static
         */
        dragThreshMet: false,

        /**
         * Timeout used for the click time threshold
         * @property clickTimeout
         * @type Object
         * @private
         * @static
         */
        clickTimeout: null,

        /**
         * The X position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @property startX
         * @type int
         * @private
         * @static
         */
        startX: 0,

        /**
         * The Y position of the mousedown event stored for later use when a
         * drag threshold is met.
         * @property startY
         * @type int
         * @private
         * @static
         */
        startY: 0,

        /**
         * Each DragDrop instance must be registered with the DragDropMgr.
         * This is executed in DragDrop.init()
         * @method regDragDrop
         * @param {DragDrop} oDD the DragDrop object to register
         * @param {String} sGroup the name of the group this element belongs to
         * @static
         */
        regDragDrop: function(oDD, sGroup) {
            if (!this.initialized) { this.init(); }

            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }
            this.ids[sGroup][oDD.id] = oDD;
        },

        /**
         * Removes the supplied dd instance from the supplied group. Executed
         * by DragDrop.removeFromGroup, so don't call this function directly.
         * @method removeDDFromGroup
         * @private
         * @static
         */
        removeDDFromGroup: function(oDD, sGroup) {
            if (!this.ids[sGroup]) {
                this.ids[sGroup] = {};
            }

            var obj = this.ids[sGroup];
            if (obj && obj[oDD.id]) {
                delete obj[oDD.id];
            }
        },

        /**
         * Unregisters a drag and drop item.  This is executed in
         * DragDrop.unreg, use that method instead of calling this directly.
         * @method _remove
         * @private
         * @static
         */
        _remove: function(oDD) {
            for (var g in oDD.groups) {
                if (g && this.ids[g][oDD.id]) {
                    delete this.ids[g][oDD.id];
                }
            }
            delete this.handleIds[oDD.id];
        },

        /**
         * Each DragDrop handle element must be registered.  This is done
         * automatically when executing DragDrop.setHandleElId()
         * @method regHandle
         * @param {String} sDDId the DragDrop id this element is a handle for
         * @param {String} sHandleId the id of the element that is the drag
         * handle
         * @static
         */
        regHandle: function(sDDId, sHandleId) {
            if (!this.handleIds[sDDId]) {
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop item.
         * @method isDragDrop
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop item,
         * false otherwise
         * @static
         */
        isDragDrop: function(id) {
            return ( this.getDDById(id) ) ? true : false;
        },

        /**
         * Returns the drag and drop instances that are in all groups the
         * passed in instance belongs to.
         * @method getRelated
         * @param {DragDrop} p_oDD the obj to get related data for
         * @param {boolean} bTargetsOnly if true, only return targetable objs
         * @return {DragDrop[]} the related instances
         * @static
         */
        getRelated: function(p_oDD, bTargetsOnly) {
            var oDDs = [];
            for (var i in p_oDD.groups) {
                for (j in this.ids[i]) {
                    var dd = this.ids[i][j];
                    if (! this.isTypeOfDD(dd)) {
                        continue;
                    }
                    if (!bTargetsOnly || dd.isTarget) {
                        oDDs[oDDs.length] = dd;
                    }
                }
            }

            return oDDs;
        },

        /**
         * Returns true if the specified dd target is a legal target for
         * the specifice drag obj
         * @method isLegalTarget
         * @param {DragDrop} the drag obj
         * @param {DragDrop} the target
         * @return {boolean} true if the target is a legal target for the
         * dd obj
         * @static
         */
        isLegalTarget: function (oDD, oTargetDD) {
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i) {
                if (targets[i].id == oTargetDD.id) {
                    return true;
                }
            }

            return false;
        },

        /**
         * My goal is to be able to transparently determine if an object is
         * typeof DragDrop, and the exact subclass of DragDrop.  typeof
         * returns "object", oDD.constructor.toString() always returns
         * "DragDrop" and not the name of the subclass.  So for now it just
         * evaluates a well-known variable in DragDrop.
         * @method isTypeOfDD
         * @param {Object} the object to evaluate
         * @return {boolean} true if typeof oDD = DragDrop
         * @static
         */
        isTypeOfDD: function (oDD) {
            return (oDD && oDD.__ygDragDrop);
        },

        /**
         * Utility function to determine if a given element has been
         * registered as a drag drop handle for the given Drag Drop object.
         * @method isHandle
         * @param {String} id the element id to check
         * @return {boolean} true if this element is a DragDrop handle, false
         * otherwise
         * @static
         */
        isHandle: function(sDDId, sHandleId) {
            return ( this.handleIds[sDDId] &&
                            this.handleIds[sDDId][sHandleId] );
        },

        /**
         * Returns the DragDrop instance for a given id
         * @method getDDById
         * @param {String} id the id of the DragDrop object
         * @return {DragDrop} the drag drop object, null if it is not found
         * @static
         */
        getDDById: function(id) {
            for (var i in this.ids) {
                if (this.ids[i][id]) {
                    return this.ids[i][id];
                }
            }
            return null;
        },

        /**
         * Fired after a registered DragDrop object gets the mousedown event.
         * Sets up the events required to track the object being dragged
         * @method handleMouseDown
         * @param {Event} e the event
         * @param oDD the DragDrop object being dragged
         * @private
         * @static
         */
        handleMouseDown: function(e, oDD) {
            if(Roo.QuickTips){
                Roo.QuickTips.disable();
            }
            this.currentTarget = e.getTarget();

            this.dragCurrent = oDD;

            var el = oDD.getEl();

            // track start position
            this.startX = e.getPageX();
            this.startY = e.getPageY();

            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;

            this.dragThreshMet = false;

            this.clickTimeout = setTimeout(
                    function() {
                        var DDM = Roo.dd.DDM;
                        DDM.startDrag(DDM.startX, DDM.startY);
                    },
                    this.clickTimeThresh );
        },

        /**
         * Fired when either the drag pixel threshol or the mousedown hold
         * time threshold has been met.
         * @method startDrag
         * @param x {int} the X position of the original mousedown
         * @param y {int} the Y position of the original mousedown
         * @static
         */
        startDrag: function(x, y) {
            clearTimeout(this.clickTimeout);
            if (this.dragCurrent) {
                this.dragCurrent.b4StartDrag(x, y);
                this.dragCurrent.startDrag(x, y);
            }
            this.dragThreshMet = true;
        },

        /**
         * Internal function to handle the mouseup event.  Will be invoked
         * from the context of the document.
         * @method handleMouseUp
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseUp: function(e) {

            if(Roo.QuickTips){
                Roo.QuickTips.enable();
            }
            if (! this.dragCurrent) {
                return;
            }

            clearTimeout(this.clickTimeout);

            if (this.dragThreshMet) {
                this.fireEvents(e, true);
            } else {
            }

            this.stopDrag(e);

            this.stopEvent(e);
        },

        /**
         * Utility to stop event propagation and event default, if these
         * features are turned on.
         * @method stopEvent
         * @param {Event} e the event as returned by this.getEvent()
         * @static
         */
        stopEvent: function(e){
            if(this.stopPropagation) {
                e.stopPropagation();
            }

            if (this.preventDefault) {
                e.preventDefault();
            }
        },

        /**
         * Internal function to clean up event handlers after the drag
         * operation is complete
         * @method stopDrag
         * @param {Event} e the event
         * @private
         * @static
         */
        stopDrag: function(e) {
            // Fire the drag end event for the item that was dragged
            if (this.dragCurrent) {
                if (this.dragThreshMet) {
                    this.dragCurrent.b4EndDrag(e);
                    this.dragCurrent.endDrag(e);
                }

                this.dragCurrent.onMouseUp(e);
            }

            this.dragCurrent = null;
            this.dragOvers = {};
        },

        /**
         * Internal function to handle the mousemove event.  Will be invoked
         * from the context of the html element.
         *
         * @TODO figure out what we can do about mouse events lost when the
         * user drags objects beyond the window boundary.  Currently we can
         * detect this in internet explorer by verifying that the mouse is
         * down during the mousemove event.  Firefox doesn't give us the
         * button state on the mousemove event.
         * @method handleMouseMove
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseMove: function(e) {
            if (! this.dragCurrent) {
                return true;
            }

            // var button = e.which || e.button;

            // check for IE mouseup outside of page boundary
            if (Roo.isIE && (e.button !== 0 && e.button !== 1 && e.button !== 2)) {
                this.stopEvent(e);
                return this.handleMouseUp(e);
            }

            if (!this.dragThreshMet) {
                var diffX = Math.abs(this.startX - e.getPageX());
                var diffY = Math.abs(this.startY - e.getPageY());
                if (diffX > this.clickPixelThresh ||
                            diffY > this.clickPixelThresh) {
                    this.startDrag(this.startX, this.startY);
                }
            }

            if (this.dragThreshMet) {
                this.dragCurrent.b4Drag(e);
                this.dragCurrent.onDrag(e);
                if(!this.dragCurrent.moveOnly){
                    this.fireEvents(e, false);
                }
            }

            this.stopEvent(e);

            return true;
        },

        /**
         * Iterates over all of the DragDrop elements to find ones we are
         * hovering over or dropping on
         * @method fireEvents
         * @param {Event} e the event
         * @param {boolean} isDrop is this a drop op or a mouseover op?
         * @private
         * @static
         */
        fireEvents: function(e, isDrop) {
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could
            // get here even though we have ended the drag.
            if (!dc || dc.isLocked()) {
                return;
            }

            var pt = e.getPoint();

            // cache the previous dragOver array
            var oldOvers = [];

            var outEvts   = [];
            var overEvts  = [];
            var dropEvts  = [];
            var enterEvts = [];

            // Check to see if the object(s) we were hovering over is no longer
            // being hovered over so we can fire the onDragOut event
            for (var i in this.dragOvers) {

                var ddo = this.dragOvers[i];

                if (! this.isTypeOfDD(ddo)) {
                    continue;
                }

                if (! this.isOverTarget(pt, ddo, this.mode)) {
                    outEvts.push( ddo );
                }

                oldOvers[i] = true;
                delete this.dragOvers[i];
            }

            for (var sGroup in dc.groups) {

                if ("string" != typeof sGroup) {
                    continue;
                }

                for (i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];
                    if (! this.isTypeOfDD(oDD)) {
                        continue;
                    }

                    if (oDD.isTarget && !oDD.isLocked() && oDD != dc) {
                        if (this.isOverTarget(pt, oDD, this.mode)) {
                            // look for drop interactions
                            if (isDrop) {
                                dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            } else {

                                // initial drag over: dragEnter fires
                                if (!oldOvers[oDD.id]) {
                                    enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
                                } else {
                                    overEvts.push( oDD );
                                }

                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }

            if (this.mode) {
                if (outEvts.length) {
                    dc.b4DragOut(e, outEvts);
                    dc.onDragOut(e, outEvts);
                }

                if (enterEvts.length) {
                    dc.onDragEnter(e, enterEvts);
                }

                if (overEvts.length) {
                    dc.b4DragOver(e, overEvts);
                    dc.onDragOver(e, overEvts);
                }

                if (dropEvts.length) {
                    dc.b4DragDrop(e, dropEvts);
                    dc.onDragDrop(e, dropEvts);
                }

            } else {
                // fire dragout events
                var len = 0;
                for (i=0, len=outEvts.length; i<len; ++i) {
                    dc.b4DragOut(e, outEvts[i].id);
                    dc.onDragOut(e, outEvts[i].id);
                }

                // fire enter events
                for (i=0,len=enterEvts.length; i<len; ++i) {
                    // dc.b4DragEnter(e, oDD.id);
                    dc.onDragEnter(e, enterEvts[i].id);
                }

                // fire over events
                for (i=0,len=overEvts.length; i<len; ++i) {
                    dc.b4DragOver(e, overEvts[i].id);
                    dc.onDragOver(e, overEvts[i].id);
                }

                // fire drop events
                for (i=0, len=dropEvts.length; i<len; ++i) {
                    dc.b4DragDrop(e, dropEvts[i].id);
                    dc.onDragDrop(e, dropEvts[i].id);
                }

            }

            // notify about a drop that did not find a target
            if (isDrop && !dropEvts.length) {
                dc.onInvalidDrop(e);
            }

        },

        /**
         * Helper function for getting the best match from the list of drag
         * and drop objects returned by the drag and drop events when we are
         * in INTERSECT mode.  It returns either the first object that the
         * cursor is over, or the object that has the greatest overlap with
         * the dragged element.
         * @method getBestMatch
         * @param  {DragDrop[]} dds The array of drag and drop objects
         * targeted
         * @return {DragDrop}       The best single match
         * @static
         */
        getBestMatch: function(dds) {
            var winner = null;
            // Return null if the input is not what we expect
            //if (!dds || !dds.length || dds.length == 0) {
               // winner = null;
            // If there is only one item, it wins
            //} else if (dds.length == 1) {

            var len = dds.length;

            if (len == 1) {
                winner = dds[0];
            } else {
                // Loop through the targeted items
                for (var i=0; i<len; ++i) {
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if (dd.cursorIsOver) {
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
                    } else {
                        if (!winner ||
                            winner.overlap.getArea() < dd.overlap.getArea()) {
                            winner = dd;
                        }
                    }
                }
            }

            return winner;
        },

        /**
         * Refreshes the cache of the top-left and bottom-right points of the
         * drag and drop objects in the specified group(s).  This is in the
         * format that is stored in the drag and drop instance, so typical
         * usage is:
         * <code>
         * Roo.dd.DragDropMgr.refreshCache(ddinstance.groups);
         * </code>
         * Alternatively:
         * <code>
         * Roo.dd.DragDropMgr.refreshCache({group1:true, group2:true});
         * </code>
         * @TODO this really should be an indexed array.  Alternatively this
         * method could accept both.
         * @method refreshCache
         * @param {Object} groups an associative array of groups to refresh
         * @static
         */
        refreshCache: function(groups) {
            for (var sGroup in groups) {
                if ("string" != typeof sGroup) {
                    continue;
                }
                for (var i in this.ids[sGroup]) {
                    var oDD = this.ids[sGroup][i];

                    if (this.isTypeOfDD(oDD)) {
                    // if (this.isTypeOfDD(oDD) && oDD.isTarget) {
                        var loc = this.getLocation(oDD);
                        if (loc) {
                            this.locationCache[oDD.id] = loc;
                        } else {
                            delete this.locationCache[oDD.id];
                            // this will unregister the drag and drop object if
                            // the element is not in a usable state
                            // oDD.unreg();
                        }
                    }
                }
            }
        },

        /**
         * This checks to make sure an element exists and is in the DOM.  The
         * main purpose is to handle cases where innerHTML is used to remove
         * drag and drop objects from the DOM.  IE provides an 'unspecified
         * error' when trying to access the offsetParent of such an element
         * @method verifyEl
         * @param {HTMLElement} el the element to check
         * @return {boolean} true if the element looks usable
         * @static
         */
        verifyEl: function(el) {
            if (el) {
                var parent;
                if(Roo.isIE){
                    try{
                        parent = el.offsetParent;
                    }catch(e){}
                }else{
                    parent = el.offsetParent;
                }
                if (parent) {
                    return true;
                }
            }

            return false;
        },

        /**
         * Returns a Region object containing the drag and drop element's position
         * and size, including the padding configured for it
         * @method getLocation
         * @param {DragDrop} oDD the drag and drop object to get the
         *                       location for
         * @return {Roo.lib.Region} a Region object representing the total area
         *                             the element occupies, including any padding
         *                             the instance is configured for.
         * @static
         */
        getLocation: function(oDD) {
            if (! this.isTypeOfDD(oDD)) {
                return null;
            }

            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;

            try {
                pos= Roo.lib.Dom.getXY(el);
            } catch (e) { }

            if (!pos) {
                return null;
            }

            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;

            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];

            return new Roo.lib.Region( t, r, b, l );
        },

        /**
         * Checks the cursor location to see if it over the target
         * @method isOverTarget
         * @param {Roo.lib.Point} pt The point to evaluate
         * @param {DragDrop} oTarget the DragDrop object we are inspecting
         * @return {boolean} true if the mouse is over the target
         * @private
         * @static
         */
        isOverTarget: function(pt, oTarget, intersect) {
            // use cache if available
            var loc = this.locationCache[oTarget.id];
            if (!loc || !this.useCache) {
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;

            }

            if (!loc) {
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            // DragDrop is using this as a sanity check for the initial mousedown
            // in this case we are done.  In POINT mode, if the drag obj has no
            // contraints, we are also done. Otherwise we need to evaluate the
            // location of the target as related to the actual location of the
            // dragged element.
            var dc = this.dragCurrent;
            if (!dc || !dc.getTargetCoord ||
                    (!intersect && !dc.constrainX && !dc.constrainY)) {
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;

            // Get the current location of the drag element, this is the
            // location of the mouse event less the delta that represents
            // where the original mousedown happened on the element.  We
            // need to consider constraints and ticks as well.
            var pos = dc.getTargetCoord(pt.x, pt.y);

            var el = dc.getDragEl();
            var curRegion = new Roo.lib.Region( pos.y,
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight,
                                                   pos.x );

            var overlap = curRegion.intersect(loc);

            if (overlap) {
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            } else {
                return false;
            }
        },

        /**
         * unload event handler
         * @method _onUnload
         * @private
         * @static
         */
        _onUnload: function(e, me) {
            Roo.dd.DragDropMgr.unregAll();
        },

        /**
         * Cleans up the drag and drop events and objects.
         * @method unregAll
         * @private
         * @static
         */
        unregAll: function() {

            if (this.dragCurrent) {
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll("unreg", []);

            for (i in this.elementCache) {
                delete this.elementCache[i];
            }

            this.elementCache = {};
            this.ids = {};
        },

        /**
         * A cache of DOM elements
         * @property elementCache
         * @private
         * @static
         */
        elementCache: {},

        /**
         * Get the wrapper for the DOM element specified
         * @method getElWrapper
         * @param {String} id the id of the element to get
         * @return {Roo.dd.DDM.ElementWrapper} the wrapped element
         * @private
         * @deprecated This wrapper isn't that useful
         * @static
         */
        getElWrapper: function(id) {
            var oWrapper = this.elementCache[id];
            if (!oWrapper || !oWrapper.el) {
                oWrapper = this.elementCache[id] =
                    new this.ElementWrapper(Roo.getDom(id));
            }
            return oWrapper;
        },

        /**
         * Returns the actual DOM element
         * @method getElement
         * @param {String} id the id of the elment to get
         * @return {Object} The element
         * @deprecated use Roo.getDom instead
         * @static
         */
        getElement: function(id) {
            return Roo.getDom(id);
        },

        /**
         * Returns the style property for the DOM element (i.e.,
         * document.getElById(id).style)
         * @method getCss
         * @param {String} id the id of the elment to get
         * @return {Object} The style property of the element
         * @deprecated use Roo.getDom instead
         * @static
         */
        getCss: function(id) {
            var el = Roo.getDom(id);
            return (el) ? el.style : null;
        },

        /**
         * Inner class for cached elements
         * @class DragDropMgr.ElementWrapper
         * @for DragDropMgr
         * @private
         * @deprecated
         */
        ElementWrapper: function(el) {
                /**
                 * The element
                 * @property el
                 */
                this.el = el || null;
                /**
                 * The element id
                 * @property id
                 */
                this.id = this.el && el.id;
                /**
                 * A reference to the style property
                 * @property css
                 */
                this.css = this.el && el.style;
            },

        /**
         * Returns the X position of an html element
         * @method getPosX
         * @param el the element for which to get the position
         * @return {int} the X coordinate
         * @for DragDropMgr
         * @deprecated use Roo.lib.Dom.getX instead
         * @static
         */
        getPosX: function(el) {
            return Roo.lib.Dom.getX(el);
        },

        /**
         * Returns the Y position of an html element
         * @method getPosY
         * @param el the element for which to get the position
         * @return {int} the Y coordinate
         * @deprecated use Roo.lib.Dom.getY instead
         * @static
         */
        getPosY: function(el) {
            return Roo.lib.Dom.getY(el);
        },

        /**
         * Swap two nodes.  In IE, we use the native method, for others we
         * emulate the IE behavior
         * @method swapNode
         * @param n1 the first node to swap
         * @param n2 the other node to swap
         * @static
         */
        swapNode: function(n1, n2) {
            if (n1.swapNode) {
                n1.swapNode(n2);
            } else {
                var p = n2.parentNode;
                var s = n2.nextSibling;

                if (s == n1) {
                    p.insertBefore(n1, n2);
                } else if (n2 == n1.nextSibling) {
                    p.insertBefore(n2, n1);
                } else {
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },

        /**
         * Returns the current scroll position
         * @method getScroll
         * @private
         * @static
         */
        getScroll: function () {
            var t, l, dde=document.documentElement, db=document.body;
            if (dde && (dde.scrollTop || dde.scrollLeft)) {
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if (db) {
                t = db.scrollTop;
                l = db.scrollLeft;
            } else {

            }
            return { top: t, left: l };
        },

        /**
         * Returns the specified element style property
         * @method getStyle
         * @param {HTMLElement} el          the element
         * @param {string}      styleProp   the style property
         * @return {string} The value of the style property
         * @deprecated use Roo.lib.Dom.getStyle
         * @static
         */
        getStyle: function(el, styleProp) {
            return Roo.fly(el).getStyle(styleProp);
        },

        /**
         * Gets the scrollTop
         * @method getScrollTop
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollTop: function () { return this.getScroll().top; },

        /**
         * Gets the scrollLeft
         * @method getScrollLeft
         * @return {int} the document's scrollTop
         * @static
         */
        getScrollLeft: function () { return this.getScroll().left; },

        /**
         * Sets the x/y position of an element to the location of the
         * target element.
         * @method moveToEl
         * @param {HTMLElement} moveEl      The element to move
         * @param {HTMLElement} targetEl    The position reference element
         * @static
         */
        moveToEl: function (moveEl, targetEl) {
            var aCoord = Roo.lib.Dom.getXY(targetEl);
            Roo.lib.Dom.setXY(moveEl, aCoord);
        },

        /**
         * Numeric array sort function
         * @method numericSort
         * @static
         */
        numericSort: function(a, b) { return (a - b); },

        /**
         * Internal counter
         * @property _timeoutCount
         * @private
         * @static
         */
        _timeoutCount: 0,

        /**
         * Trying to make the load order less important.  Without this we get
         * an error if this file is loaded before the Event Utility.
         * @method _addListeners
         * @private
         * @static
         */
        _addListeners: function() {
            var DDM = Roo.dd.DDM;
            if ( Roo.lib.Event && document ) {
                DDM._onLoad();
            } else {
                if (DDM._timeoutCount > 2000) {
                } else {
                    setTimeout(DDM._addListeners, 10);
                    if (document && document.body) {
                        DDM._timeoutCount += 1;
                    }
                }
            }
        },

        /**
         * Recursively searches the immediate parent and all child nodes for
         * the handle element in order to determine wheter or not it was
         * clicked.
         * @method handleWasClicked
         * @param node the html element to inspect
         * @static
         */
        handleWasClicked: function(node, id) {
            if (this.isHandle(id, node.id)) {
                return true;
            } else {
                // check to see if this is a text node child of the one we want
                var p = node.parentNode;

                while (p) {
                    if (this.isHandle(id, p.id)) {
                        return true;
                    } else {
                        p = p.parentNode;
                    }
                }
            }

            return false;
        }

    };

}();

// shorter alias, save a few bytes
Roo.dd.DDM = Roo.dd.DragDropMgr;
Roo.dd.DDM._addListeners();

}/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.dd.DD
 * A DragDrop implementation where the linked element follows the
 * mouse cursor during a drag.
 * @extends Roo.dd.DragDrop
 * @constructor
 * @param {String} id the id of the linked element
 * @param {String} sGroup the group of related DragDrop items
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DD:
 *                    scroll
 */
Roo.dd.DD = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
    }
};

Roo.extend(Roo.dd.DD, Roo.dd.DragDrop, {

    /**
     * When set to true, the utility automatically tries to scroll the browser
     * window wehn a drag and drop element is dragged near the viewport boundary.
     * Defaults to true.
     * @property scroll
     * @type boolean
     */
    scroll: true,

    /**
     * Sets the pointer offset to the distance between the linked element's top
     * left corner and the location the element was clicked
     * @method autoOffset
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     */
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    /**
     * Sets the pointer offset.  You can call this directly to force the
     * offset to be in a particular location (e.g., pass in 0,0 to set it
     * to the center of the object)
     * @method setDelta
     * @param {int} iDeltaX the distance from the left
     * @param {int} iDeltaY the distance from the top
     */
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    /**
     * Sets the drag element to the location of the mousedown or click event,
     * maintaining the cursor location relative to the location on the element
     * that was clicked.  Override this if you want to place the element in a
     * location other than where the cursor is.
     * @method setDragElPos
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    setDragElPos: function(iPageX, iPageY) {
        // the first time we do this, we are going to check to make sure
        // the element has css positioning

        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    /**
     * Sets the element to the location of the mousedown or click event,
     * maintaining the cursor location relative to the location on the element
     * that was clicked.  Override this if you want to place the element in a
     * location other than where the cursor is.
     * @method alignElWithMouse
     * @param {HTMLElement} el the element to move
     * @param {int} iPageX the X coordinate of the mousedown or drag event
     * @param {int} iPageY the Y coordinate of the mousedown or drag event
     */
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);
        var fly = el.dom ? el : Roo.fly(el);
        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            fly.setXY(aCoord);
            var newLeft = fly.getLeft(true);
            var newTop  = fly.getTop(true);
            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            fly.setLeftTop(oCoord.x + this.deltaSetXY[0], oCoord.y + this.deltaSetXY[1]);
        }

        this.cachePosition(oCoord.x, oCoord.y);
        this.autoScroll(oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        return oCoord;
    },

    /**
     * Saves the most recent position so that we can reset the constraints and
     * tick marks on-demand.  We need to know this so that we can calculate the
     * number of pixels the element is offset from its original position.
     * @method cachePosition
     * @param iPageX the current x position (optional, this just makes it so we
     * don't have to look it up again)
     * @param iPageY the current y position (optional, this just makes it so we
     * don't have to look it up again)
     */
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = Roo.lib.Dom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },

    /**
     * Auto-scroll the window if the dragged object has been moved beyond the
     * visible window boundary.
     * @method autoScroll
     * @param {int} x the drag element's x position
     * @param {int} y the drag element's y position
     * @param {int} h the height of the drag element
     * @param {int} w the width of the drag element
     * @private
     */
    autoScroll: function(x, y, h, w) {

        if (this.scroll) {
            // The client height
            var clientH = Roo.lib.Dom.getViewWidth();

            // The client width
            var clientW = Roo.lib.Dom.getViewHeight();

            // The amt scrolled down
            var st = this.DDM.getScrollTop();

            // The amt scrolled right
            var sl = this.DDM.getScrollLeft();

            // Location of the bottom of the element
            var bot = h + y;

            // Location of the right of the element
            var right = w + x;

            // The distance from the cursor to the bottom of the visible area,
            // adjusted so that we don't scroll if the cursor is beyond the
            // element drag constraints
            var toBot = (clientH + st - y - this.deltaY);

            // The distance from the cursor to the right of the visible area
            var toRight = (clientW + sl - x - this.deltaX);


            // How close to the edge the cursor must be before we scroll
            // var thresh = (document.all) ? 100 : 40;
            var thresh = 40;

            // How many pixels to scroll per autoscroll op.  This helps to reduce
            // clunky scrolling. IE is more sensitive about this ... it needs this
            // value to be higher.
            var scrAmt = (document.all) ? 80 : 30;

            // Scroll down if we are near the bottom of the visible page and the
            // obj extends below the crease
            if ( bot > clientH && toBot < thresh ) {
                window.scrollTo(sl, st + scrAmt);
            }

            // Scroll up if the window is scrolled down and the top of the object
            // goes above the top border
            if ( y < st && st > 0 && y - st < thresh ) {
                window.scrollTo(sl, st - scrAmt);
            }

            // Scroll right if the obj is beyond the right border and the cursor is
            // near the border.
            if ( right > clientW && toRight < thresh ) {
                window.scrollTo(sl + scrAmt, st);
            }

            // Scroll left if the window has been scrolled to the right and the obj
            // extends past the left border
            if ( x < sl && sl > 0 && x - sl < thresh ) {
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    /**
     * Finds the location the element should be placed if we want to move
     * it to where the mouse location less the click offset would place us.
     * @method getTargetCoord
     * @param {int} iPageX the X coordinate of the click
     * @param {int} iPageY the Y coordinate of the click
     * @return an object that contains the coordinates (Object.x and Object.y)
     * @private
     */
    getTargetCoord: function(iPageX, iPageY) {


        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;

        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }

        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }

        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);


        return {x:x, y:y};
    },

    /*
     * Sets up config options specific to this class. Overrides
     * Roo.dd.DragDrop, but all versions of this method through the
     * inheritance chain are called
     */
    applyConfig: function() {
        Roo.dd.DD.superclass.applyConfig.call(this);
        this.scroll = (this.config.scroll !== false);
    },

    /*
     * Event that fires prior to the onMouseDown event.  Overrides
     * Roo.dd.DragDrop.
     */
    b4MouseDown: function(e) {
        // this.resetConstraints();
        this.autoOffset(e.getPageX(),
                            e.getPageY());
    },

    /*
     * Event that fires prior to the onDrag event.  Overrides
     * Roo.dd.DragDrop.
     */
    b4Drag: function(e) {
        this.setDragElPos(e.getPageX(),
                            e.getPageY());
    },

    toString: function() {
        return ("DD " + this.id);
    }

    //////////////////////////////////////////////////////////////////////////
    // Debugging ygDragDrop events that can be overridden
    //////////////////////////////////////////////////////////////////////////
    /*
    startDrag: function(x, y) {
    },

    onDrag: function(e) {
    },

    onDragEnter: function(e, id) {
    },

    onDragOver: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    onDragDrop: function(e, id) {
    },

    endDrag: function(e) {
    }

    */

});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.dd.DDProxy
 * A DragDrop implementation that inserts an empty, bordered div into
 * the document that follows the cursor during drag operations.  At the time of
 * the click, the frame div is resized to the dimensions of the linked html
 * element, and moved to the exact location of the linked element.
 *
 * References to the "frame" element refer to the single proxy element that
 * was created to be dragged in place of all DDProxy elements on the
 * page.
 *
 * @extends Roo.dd.DD
 * @constructor
 * @param {String} id the id of the linked html element
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                Valid properties for DDProxy in addition to those in DragDrop:
 *                   resizeFrame, centerFrame, dragElId
 */
Roo.dd.DDProxy = function(id, sGroup, config) {
    if (id) {
        this.init(id, sGroup, config);
        this.initFrame();
    }
};

/**
 * The default drag frame div id
 * @property Roo.dd.DDProxy.dragElId
 * @type String
 * @static
 */
Roo.dd.DDProxy.dragElId = "ygddfdiv";

Roo.extend(Roo.dd.DDProxy, Roo.dd.DD, {

    /**
     * By default we resize the drag frame to be the same size as the element
     * we want to drag (this is to get the frame effect).  We can turn it off
     * if we want a different behavior.
     * @property resizeFrame
     * @type boolean
     */
    resizeFrame: true,

    /**
     * By default the frame is positioned exactly where the drag element is, so
     * we use the cursor offset provided by Roo.dd.DD.  Another option that works only if
     * you do not have constraints on the obj is to have the drag frame centered
     * around the cursor.  Set centerFrame to true for this effect.
     * @property centerFrame
     * @type boolean
     */
    centerFrame: false,

    /**
     * Creates the proxy element if it does not yet exist
     * @method createFrame
     */
    createFrame: function() {
        var self = this;
        var body = document.body;

        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }

        var div = this.getDragEl();

        if (!div) {
            div    = document.createElement("div");
            div.id = this.dragElId;
            var s  = div.style;

            s.position   = "absolute";
            s.visibility = "hidden";
            s.cursor     = "move";
            s.border     = "2px solid #aaa";
            s.zIndex     = 999;

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * Initialization for the drag frame element.  Must be called in the
     * constructor of all subclasses
     * @method initFrame
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        Roo.dd.DDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.config.resizeFrame !== false);
        this.centerFrame = (this.config.centerFrame);
        this.setDragElId(this.config.dragElId || Roo.dd.DDProxy.dragElId);
    },

    /**
     * Resizes the drag frame to the dimensions of the clicked object, positions
     * it over the object, and finally displays it
     * @method showFrame
     * @param {int} iPageX X click position
     * @param {int} iPageY Y click position
     * @private
     */
    showFrame: function(iPageX, iPageY) {
        var el = this.getEl();
        var dragEl = this.getDragEl();
        var s = dragEl.style;

        this._resizeProxy();

        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2),
                           Math.round(parseInt(s.height, 10)/2) );
        }

        this.setDragElPos(iPageX, iPageY);

        Roo.fly(dragEl).show();
    },

    /**
     * The proxy is automatically resized to the dimensions of the linked
     * element when a drag is initiated, unless resizeFrame is set to false
     * @method _resizeProxy
     * @private
     */
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var el = this.getEl();
            Roo.fly(this.getDragEl()).setSize(el.offsetWidth, el.offsetHeight);
        }
    },

    // overrides Roo.dd.DragDrop
    b4MouseDown: function(e) {
        var x = e.getPageX();
        var y = e.getPageY();
        this.autoOffset(x, y);
        this.setDragElPos(x, y);
    },

    // overrides Roo.dd.DragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.showFrame(x, y);
    },

    // overrides Roo.dd.DragDrop
    b4EndDrag: function(e) {
        Roo.fly(this.getDragEl()).hide();
    },

    // overrides Roo.dd.DragDrop
    // By default we try to move the element to the last location of the frame.
    // This is so that the default behavior mirrors that of Roo.dd.DD.
    endDrag: function(e) {

        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        del.style.visibility = "";

        this.beforeMove();
        // Hide the linked element before the move to get around a Safari
        // rendering bug.
        lel.style.visibility = "hidden";
        Roo.dd.DDM.moveToEl(lel, del);
        del.style.visibility = "hidden";
        lel.style.visibility = "";

        this.afterDrag();
    },

    beforeMove : function(){

    },

    afterDrag : function(){

    },

    toString: function() {
        return ("DDProxy " + this.id);
    }

});
/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

 /**
 * @class Roo.dd.DDTarget
 * A DragDrop implementation that does not move, but can be a drop
 * target.  You would get the same result by simply omitting implementation
 * for the event callbacks, but this way we reduce the processing cost of the
 * event listener and the callbacks.
 * @extends Roo.dd.DragDrop
 * @constructor
 * @param {String} id the id of the element that is a drop target
 * @param {String} sGroup the group of related DragDrop objects
 * @param {object} config an object containing configurable attributes
 *                 Valid properties for DDTarget in addition to those in
 *                 DragDrop:
 *                    none
 */
Roo.dd.DDTarget = function(id, sGroup, config) {
    if (id) {
        this.initTarget(id, sGroup, config);
    }
};

// Roo.dd.DDTarget.prototype = new Roo.dd.DragDrop();
Roo.extend(Roo.dd.DDTarget, Roo.dd.DragDrop, {
    toString: function() {
        return ("DDTarget " + this.id);
    }
});
/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 

/**
 * @class Roo.dd.ScrollManager
 * Provides automatic scrolling of overflow regions in the page during drag operations.<br><br>
 * <b>Note: This class uses "Point Mode" and is untested in "Intersect Mode".</b>
 * @singleton
 */
Roo.dd.ScrollManager = function(){
    var ddm = Roo.dd.DragDropMgr;
    var els = {};
    var dragEl = null;
    var proc = {};
    
    var onStop = function(e){
        dragEl = null;
        clearProc();
    };
    
    var triggerRefresh = function(){
        if(ddm.dragCurrent){
             ddm.refreshCache(ddm.dragCurrent.groups);
        }
    };
    
    var doScroll = function(){
        if(ddm.dragCurrent){
            var dds = Roo.dd.ScrollManager;
            if(!dds.animate){
                if(proc.el.scroll(proc.dir, dds.increment)){
                    triggerRefresh();
                }
            }else{
                proc.el.scroll(proc.dir, dds.increment, true, dds.animDuration, triggerRefresh);
            }
        }
    };
    
    var clearProc = function(){
        if(proc.id){
            clearInterval(proc.id);
        }
        proc.id = 0;
        proc.el = null;
        proc.dir = "";
    };
    
    var startProc = function(el, dir){
        clearProc();
        proc.el = el;
        proc.dir = dir;
        proc.id = setInterval(doScroll, Roo.dd.ScrollManager.frequency);
    };
    
    var onFire = function(e, isDrop){
        if(isDrop || !ddm.dragCurrent){ return; }
        var dds = Roo.dd.ScrollManager;
        if(!dragEl || dragEl != ddm.dragCurrent){
            dragEl = ddm.dragCurrent;
            // refresh regions on drag start
            dds.refreshCache();
        }
        
        var xy = Roo.lib.Event.getXY(e);
        var pt = new Roo.lib.Point(xy[0], xy[1]);
        for(var id in els){
            var el = els[id], r = el._region;
            if(r && r.contains(pt) && el.isScrollable()){
                if(r.bottom - pt.y <= dds.thresh){
                    if(proc.el != el){
                        startProc(el, "down");
                    }
                    return;
                }else if(r.right - pt.x <= dds.thresh){
                    if(proc.el != el){
                        startProc(el, "left");
                    }
                    return;
                }else if(pt.y - r.top <= dds.thresh){
                    if(proc.el != el){
                        startProc(el, "up");
                    }
                    return;
                }else if(pt.x - r.left <= dds.thresh){
                    if(proc.el != el){
                        startProc(el, "right");
                    }
                    return;
                }
            }
        }
        clearProc();
    };
    
    ddm.fireEvents = ddm.fireEvents.createSequence(onFire, ddm);
    ddm.stopDrag = ddm.stopDrag.createSequence(onStop, ddm);
    
    return {
        /**
         * Registers new overflow element(s) to auto scroll
         * @param {String/HTMLElement/Element/Array} el The id of or the element to be scrolled or an array of either
         */
        register : function(el){
            if(el instanceof Array){
                for(var i = 0, len = el.length; i < len; i++) {
                	this.register(el[i]);
                }
            }else{
                el = Roo.get(el);
                els[el.id] = el;
            }
        },
        
        /**
         * Unregisters overflow element(s) so they are no longer scrolled
         * @param {String/HTMLElement/Element/Array} el The id of or the element to be removed or an array of either
         */
        unregister : function(el){
            if(el instanceof Array){
                for(var i = 0, len = el.length; i < len; i++) {
                	this.unregister(el[i]);
                }
            }else{
                el = Roo.get(el);
                delete els[el.id];
            }
        },
        
        /**
         * The number of pixels from the edge of a container the pointer needs to be to 
         * trigger scrolling (defaults to 25)
         * @type Number
         */
        thresh : 25,
        
        /**
         * The number of pixels to scroll in each scroll increment (defaults to 50)
         * @type Number
         */
        increment : 100,
        
        /**
         * The frequency of scrolls in milliseconds (defaults to 500)
         * @type Number
         */
        frequency : 500,
        
        /**
         * True to animate the scroll (defaults to true)
         * @type Boolean
         */
        animate: true,
        
        /**
         * The animation duration in seconds - 
         * MUST BE less than Roo.dd.ScrollManager.frequency! (defaults to .4)
         * @type Number
         */
        animDuration: .4,
        
        /**
         * Manually trigger a cache refresh.
         */
        refreshCache : function(){
            for(var id in els){
                if(typeof els[id] == 'object'){ // for people extending the object prototype
                    els[id]._region = els[id].getRegion();
                }
            }
        }
    };
}();/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 

/**
 * @class Roo.dd.Registry
 * Provides easy access to all drag drop components that are registered on a page.  Items can be retrieved either
 * directly by DOM node id, or by passing in the drag drop event that occurred and looking up the event target.
 * @singleton
 */
Roo.dd.Registry = function(){
    var elements = {}; 
    var handles = {}; 
    var autoIdSeed = 0;

    var getId = function(el, autogen){
        if(typeof el == "string"){
            return el;
        }
        var id = el.id;
        if(!id && autogen !== false){
            id = "roodd-" + (++autoIdSeed);
            el.id = id;
        }
        return id;
    };
    
    return {
    /**
     * Register a drag drop element
     * @param {String|HTMLElement} element The id or DOM node to register
     * @param {Object} data (optional) A custom data object that will be passed between the elements that are involved
     * in drag drop operations.  You can populate this object with any arbitrary properties that your own code
     * knows how to interpret, plus there are some specific properties known to the Registry that should be
     * populated in the data object (if applicable):
     * <pre>
Value      Description<br />
---------  ------------------------------------------<br />
handles    Array of DOM nodes that trigger dragging<br />
           for the element being registered<br />
isHandle   True if the element passed in triggers<br />
           dragging itself, else false
</pre>
     */
        register : function(el, data){
            data = data || {};
            if(typeof el == "string"){
                el = document.getElementById(el);
            }
            data.ddel = el;
            elements[getId(el)] = data;
            if(data.isHandle !== false){
                handles[data.ddel.id] = data;
            }
            if(data.handles){
                var hs = data.handles;
                for(var i = 0, len = hs.length; i < len; i++){
                	handles[getId(hs[i])] = data;
                }
            }
        },

    /**
     * Unregister a drag drop element
     * @param {String|HTMLElement}  element The id or DOM node to unregister
     */
        unregister : function(el){
            var id = getId(el, false);
            var data = elements[id];
            if(data){
                delete elements[id];
                if(data.handles){
                    var hs = data.handles;
                    for(var i = 0, len = hs.length; i < len; i++){
                    	delete handles[getId(hs[i], false)];
                    }
                }
            }
        },

    /**
     * Returns the handle registered for a DOM Node by id
     * @param {String|HTMLElement} id The DOM node or id to look up
     * @return {Object} handle The custom handle data
     */
        getHandle : function(id){
            if(typeof id != "string"){ // must be element?
                id = id.id;
            }
            return handles[id];
        },

    /**
     * Returns the handle that is registered for the DOM node that is the target of the event
     * @param {Event} e The event
     * @return {Object} handle The custom handle data
     */
        getHandleFromEvent : function(e){
            var t = Roo.lib.Event.getTarget(e);
            return t ? handles[t.id] : null;
        },

    /**
     * Returns a custom data object that is registered for a DOM node by id
     * @param {String|HTMLElement} id The DOM node or id to look up
     * @return {Object} data The custom data
     */
        getTarget : function(id){
            if(typeof id != "string"){ // must be element?
                id = id.id;
            }
            return elements[id];
        },

    /**
     * Returns a custom data object that is registered for the DOM node that is the target of the event
     * @param {Event} e The event
     * @return {Object} data The custom data
     */
        getTargetFromEvent : function(e){
            var t = Roo.lib.Event.getTarget(e);
            return t ? elements[t.id] || handles[t.id] : null;
        }
    };
}();/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 

/**
 * @class Roo.dd.StatusProxy
 * A specialized drag proxy that supports a drop status icon, {@link Roo.Layer} styles and auto-repair.  This is the
 * default drag proxy used by all Roo.dd components.
 * @constructor
 * @param {Object} config
 */
Roo.dd.StatusProxy = function(config){
    Roo.apply(this, config);
    this.id = this.id || Roo.id();
    this.el = new Roo.Layer({
        dh: {
            id: this.id, tag: "div", cls: "x-dd-drag-proxy "+this.dropNotAllowed, children: [
                {tag: "div", cls: "x-dd-drop-icon"},
                {tag: "div", cls: "x-dd-drag-ghost"}
            ]
        }, 
        shadow: !config || config.shadow !== false
    });
    this.ghost = Roo.get(this.el.dom.childNodes[1]);
    this.dropStatus = this.dropNotAllowed;
};

Roo.dd.StatusProxy.prototype = {
    /**
     * @cfg {String} dropAllowed
     * The CSS class to apply to the status element when drop is allowed (defaults to "x-dd-drop-ok").
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * The CSS class to apply to the status element when drop is not allowed (defaults to "x-dd-drop-nodrop").
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    /**
     * Updates the proxy's visual element to indicate the status of whether or not drop is allowed
     * over the current target element.
     * @param {String} cssClass The css class for the new drop status indicator image
     */
    setStatus : function(cssClass){
        cssClass = cssClass || this.dropNotAllowed;
        if(this.dropStatus != cssClass){
            this.el.replaceClass(this.dropStatus, cssClass);
            this.dropStatus = cssClass;
        }
    },

    /**
     * Resets the status indicator to the default dropNotAllowed value
     * @param {Boolean} clearGhost True to also remove all content from the ghost, false to preserve it
     */
    reset : function(clearGhost){
        this.el.dom.className = "x-dd-drag-proxy " + this.dropNotAllowed;
        this.dropStatus = this.dropNotAllowed;
        if(clearGhost){
            this.ghost.update("");
        }
    },

    /**
     * Updates the contents of the ghost element
     * @param {String} html The html that will replace the current innerHTML of the ghost element
     */
    update : function(html){
        if(typeof html == "string"){
            this.ghost.update(html);
        }else{
            this.ghost.update("");
            html.style.margin = "0";
            this.ghost.dom.appendChild(html);
        }
        // ensure float = none set?? cant remember why though.
        var el = this.ghost.dom.firstChild;
		if(el){
			Roo.fly(el).setStyle('float', 'none');
		}
    },
    
    /**
     * Returns the underlying proxy {@link Roo.Layer}
     * @return {Roo.Layer} el
    */
    getEl : function(){
        return this.el;
    },

    /**
     * Returns the ghost element
     * @return {Roo.Element} el
     */
    getGhost : function(){
        return this.ghost;
    },

    /**
     * Hides the proxy
     * @param {Boolean} clear True to reset the status and clear the ghost contents, false to preserve them
     */
    hide : function(clear){
        this.el.hide();
        if(clear){
            this.reset(true);
        }
    },

    /**
     * Stops the repair animation if it's currently running
     */
    stop : function(){
        if(this.anim && this.anim.isAnimated && this.anim.isAnimated()){
            this.anim.stop();
        }
    },

    /**
     * Displays this proxy
     */
    show : function(){
        this.el.show();
    },

    /**
     * Force the Layer to sync its shadow and shim positions to the element
     */
    sync : function(){
        this.el.sync();
    },

    /**
     * Causes the proxy to return to its position of origin via an animation.  Should be called after an
     * invalid drop operation by the item being dragged.
     * @param {Array} xy The XY position of the element ([x, y])
     * @param {Function} callback The function to call after the repair is complete
     * @param {Object} scope The scope in which to execute the callback
     */
    repair : function(xy, callback, scope){
        this.callback = callback;
        this.scope = scope;
        if(xy && this.animRepair !== false){
            this.el.addClass("x-dd-drag-repair");
            this.el.hideUnders(true);
            this.anim = this.el.shift({
                duration: this.repairDuration || .5,
                easing: 'easeOut',
                xy: xy,
                stopFx: true,
                callback: this.afterRepair,
                scope: this
            });
        }else{
            this.afterRepair();
        }
    },

    // private
    afterRepair : function(){
        this.hide(true);
        if(typeof this.callback == "function"){
            this.callback.call(this.scope || this);
        }
        this.callback = null;
        this.scope = null;
    }
};/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.dd.DragSource
 * @extends Roo.dd.DDProxy
 * A simple class that provides the basic implementation needed to make any element draggable.
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.dd.DragSource = function(el, config){
    this.el = Roo.get(el);
    this.dragData = {};
    
    Roo.apply(this, config);
    
    if(!this.proxy){
        this.proxy = new Roo.dd.StatusProxy();
    }

    Roo.dd.DragSource.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group,
          {dragElId : this.proxy.id, resizeFrame: false, isTarget: false, scroll: this.scroll === true});
    
    this.dragging = false;
};

Roo.extend(Roo.dd.DragSource, Roo.dd.DDProxy, {
    /**
     * @cfg {String} dropAllowed
     * The CSS class returned to the drag source when drop is allowed (defaults to "x-dd-drop-ok").
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * The CSS class returned to the drag source when drop is not allowed (defaults to "x-dd-drop-nodrop").
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    /**
     * Returns the data object associated with this drag source
     * @return {Object} data An object containing arbitrary data
     */
    getDragData : function(e){
        return this.dragData;
    },

    // private
    onDragEnter : function(e, id){
        var target = Roo.dd.DragDropMgr.getDDById(id);
        this.cachedTarget = target;
        if(this.beforeDragEnter(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyEnter(this, e, this.dragData);
                this.proxy.setStatus(status);
            }else{
                this.proxy.setStatus(this.dropAllowed);
            }
            
            if(this.afterDragEnter){
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * when the dragged item enters the drop target by providing an implementation.
                 * @param {Roo.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragEnter
                 */
                this.afterDragEnter(target, e, id);
            }
        }
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action
     * before the dragged item enters the drop target and optionally cancel the onDragEnter.
     * @param {Roo.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     */
    beforeDragEnter : function(target, e, id){
        return true;
    },

    // private
    alignElWithMouse: function() {
        Roo.dd.DragSource.superclass.alignElWithMouse.apply(this, arguments);
        this.proxy.sync();
    },

    // private
    onDragOver : function(e, id){
        var target = this.cachedTarget || Roo.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOver(target, e, id) !== false){
            if(target.isNotifyTarget){
                var status = target.notifyOver(this, e, this.dragData);
                this.proxy.setStatus(status);
            }

            if(this.afterDragOver){
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * while the dragged item is over the drop target by providing an implementation.
                 * @param {Roo.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragOver
                 */
                this.afterDragOver(target, e, id);
            }
        }
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action
     * while the dragged item is over the drop target and optionally cancel the onDragOver.
     * @param {Roo.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     */
    beforeDragOver : function(target, e, id){
        return true;
    },

    // private
    onDragOut : function(e, id){
        var target = this.cachedTarget || Roo.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragOut(target, e, id) !== false){
            if(target.isNotifyTarget){
                target.notifyOut(this, e, this.dragData);
            }
            this.proxy.reset();
            if(this.afterDragOut){
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * after the dragged item is dragged out of the target without dropping.
                 * @param {Roo.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dragged element
                 * @method afterDragOut
                 */
                this.afterDragOut(target, e, id);
            }
        }
        this.cachedTarget = null;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the dragged
     * item is dragged out of the target without dropping, and optionally cancel the onDragOut.
     * @param {Roo.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     */
    beforeDragOut : function(target, e, id){
        return true;
    },
    
    // private
    onDragDrop : function(e, id){
        var target = this.cachedTarget || Roo.dd.DragDropMgr.getDDById(id);
        if(this.beforeDragDrop(target, e, id) !== false){
            if(target.isNotifyTarget){
                if(target.notifyDrop(this, e, this.dragData)){ // valid drop?
                    this.onValidDrop(target, e, id);
                }else{
                    this.onInvalidDrop(target, e, id);
                }
            }else{
                this.onValidDrop(target, e, id);
            }
            
            if(this.afterDragDrop){
                /**
                 * An empty function by default, but provided so that you can perform a custom action
                 * after a valid drag drop has occurred by providing an implementation.
                 * @param {Roo.dd.DragDrop} target The drop target
                 * @param {Event} e The event object
                 * @param {String} id The id of the dropped element
                 * @method afterDragDrop
                 */
                this.afterDragDrop(target, e, id);
            }
        }
        delete this.cachedTarget;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the dragged
     * item is dropped onto the target and optionally cancel the onDragDrop.
     * @param {Roo.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the drag drop event is valid, else false to cancel
     */
    beforeDragDrop : function(target, e, id){
        return true;
    },

    // private
    onValidDrop : function(target, e, id){
        this.hideProxy();
        if(this.afterValidDrop){
            /**
             * An empty function by default, but provided so that you can perform a custom action
             * after a valid drop has occurred by providing an implementation.
             * @param {Object} target The target DD 
             * @param {Event} e The event object
             * @param {String} id The id of the dropped element
             * @method afterInvalidDrop
             */
            this.afterValidDrop(target, e, id);
        }
    },

    // private
    getRepairXY : function(e, data){
        return this.el.getXY();  
    },

    // private
    onInvalidDrop : function(target, e, id){
        this.beforeInvalidDrop(target, e, id);
        if(this.cachedTarget){
            if(this.cachedTarget.isNotifyTarget){
                this.cachedTarget.notifyOut(this, e, this.dragData);
            }
            this.cacheTarget = null;
        }
        this.proxy.repair(this.getRepairXY(e, this.dragData), this.afterRepair, this);

        if(this.afterInvalidDrop){
            /**
             * An empty function by default, but provided so that you can perform a custom action
             * after an invalid drop has occurred by providing an implementation.
             * @param {Event} e The event object
             * @param {String} id The id of the dropped element
             * @method afterInvalidDrop
             */
            this.afterInvalidDrop(e, id);
        }
    },

    // private
    afterRepair : function(){
        if(Roo.enableFx){
            this.el.highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action after an invalid
     * drop has occurred.
     * @param {Roo.dd.DragDrop} target The drop target
     * @param {Event} e The event object
     * @param {String} id The id of the dragged element
     * @return {Boolean} isValid True if the invalid drop should proceed, else false to cancel
     */
    beforeInvalidDrop : function(target, e, id){
        return true;
    },

    // private
    handleMouseDown : function(e){
        if(this.dragging) {
            return;
        }
        var data = this.getDragData(e);
        if(data && this.onBeforeDrag(data, e) !== false){
            this.dragData = data;
            this.proxy.stop();
            Roo.dd.DragSource.superclass.handleMouseDown.apply(this, arguments);
        } 
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action before the initial
     * drag event begins and optionally cancel it.
     * @param {Object} data An object containing arbitrary data to be shared with drop targets
     * @param {Event} e The event object
     * @return {Boolean} isValid True if the drag event is valid, else false to cancel
     */
    onBeforeDrag : function(data, e){
        return true;
    },

    /**
     * An empty function by default, but provided so that you can perform a custom action once the initial
     * drag event has begun.  The drag cannot be canceled from this function.
     * @param {Number} x The x position of the click on the dragged object
     * @param {Number} y The y position of the click on the dragged object
     */
    onStartDrag : Roo.emptyFn,

    // private - YUI override
    startDrag : function(x, y){
        this.proxy.reset();
        this.dragging = true;
        this.proxy.update("");
        this.onInitDrag(x, y);
        this.proxy.show();
    },

    // private
    onInitDrag : function(x, y){
        var clone = this.el.dom.cloneNode(true);
        clone.id = Roo.id(); // prevent duplicate ids
        this.proxy.update(clone);
        this.onStartDrag(x, y);
        return true;
    },

    /**
     * Returns the drag source's underlying {@link Roo.dd.StatusProxy}
     * @return {Roo.dd.StatusProxy} proxy The StatusProxy
     */
    getProxy : function(){
        return this.proxy;  
    },

    /**
     * Hides the drag source's {@link Roo.dd.StatusProxy}
     */
    hideProxy : function(){
        this.proxy.hide();  
        this.proxy.reset(true);
        this.dragging = false;
    },

    // private
    triggerCacheRefresh : function(){
        Roo.dd.DDM.refreshCache(this.groups);
    },

    // private - override to prevent hiding
    b4EndDrag: function(e) {
    },

    // private - override to prevent moving
    endDrag : function(e){
        this.onEndDrag(this.dragData, e);
    },

    // private
    onEndDrag : function(data, e){
    },
    
    // private - pin to cursor
    autoOffset : function(x, y) {
        this.setDelta(-12, -20);
    }    
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.dd.DropTarget
 * @extends Roo.dd.DDTarget
 * A simple class that provides the basic implementation needed to make any element a drop target that can have
 * draggable items dropped onto it.  The drop has no effect until an implementation of notifyDrop is provided.
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.dd.DropTarget = function(el, config){
    this.el = Roo.get(el);
    
    Roo.apply(this, config);
    
    if(this.containerScroll){
        Roo.dd.ScrollManager.register(this.el);
    }
    
    Roo.dd.DropTarget.superclass.constructor.call(this, this.el.dom, this.ddGroup || this.group, 
          {isTarget: true});

};

Roo.extend(Roo.dd.DropTarget, Roo.dd.DDTarget, {
    /**
     * @cfg {String} overClass
     * The CSS class applied to the drop target element while the drag source is over it (defaults to "").
     */
    /**
     * @cfg {String} dropAllowed
     * The CSS class returned to the drag source when drop is allowed (defaults to "x-dd-drop-ok").
     */
    dropAllowed : "x-dd-drop-ok",
    /**
     * @cfg {String} dropNotAllowed
     * The CSS class returned to the drag source when drop is not allowed (defaults to "x-dd-drop-nodrop").
     */
    dropNotAllowed : "x-dd-drop-nodrop",

    // private
    isTarget : true,

    // private
    isNotifyTarget : true,

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop target that the source is now over the
     * target.  This default implementation adds the CSS class specified by overClass (if any) to the drop element
     * and returns the dropAllowed config value.  This method should be overridden if drop validation is required.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop target
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    notifyEnter : function(dd, e, data){
        if(this.overClass){
            this.el.addClass(this.overClass);
        }
        return this.dropAllowed;
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls continuously while it is being dragged over the target.
     * This method will be called on every mouse movement while the drag source is over the drop target.
     * This default implementation simply returns the dropAllowed config value.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop target
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    notifyOver : function(dd, e, data){
        return this.dropAllowed;
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop target that the source has been dragged
     * out of the target without dropping.  This default implementation simply removes the CSS class specified by
     * overClass (if any) from the drop element.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop target
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     */
    notifyOut : function(dd, e, data){
        if(this.overClass){
            this.el.removeClass(this.overClass);
        }
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop target that the dragged item has
     * been dropped on it.  This method has no default implementation and returns false, so you must provide an
     * implementation that does something to process the drop event and returns true so that the drag source's
     * repair action does not run.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop target
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {Boolean} True if the drop was valid, else false
     */
    notifyDrop : function(dd, e, data){
        return false;
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.dd.DragZone
 * @extends Roo.dd.DragSource
 * This class provides a container DD instance that proxies for multiple child node sources.<br />
 * By default, this class requires that draggable child nodes are registered with {@link Roo.dd.Registry}.
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.dd.DragZone = function(el, config){
    Roo.dd.DragZone.superclass.constructor.call(this, el, config);
    if(this.containerScroll){
        Roo.dd.ScrollManager.register(this.el);
    }
};

Roo.extend(Roo.dd.DragZone, Roo.dd.DragSource, {
    /**
     * @cfg {Boolean} containerScroll True to register this container with the Scrollmanager
     * for auto scrolling during drag operations.
     */
    /**
     * @cfg {String} hlColor The color to use when visually highlighting the drag source in the afterRepair
     * method after a failed drop (defaults to "c3daf9" - light blue)
     */

    /**
     * Called when a mousedown occurs in this container. Looks in {@link Roo.dd.Registry}
     * for a valid target to drag based on the mouse down. Override this method
     * to provide your own lookup logic (e.g. finding a child by class name). Make sure your returned
     * object has a "ddel" attribute (with an HTML Element) for other functions to work.
     * @param {EventObject} e The mouse down event
     * @return {Object} The dragData
     */
    getDragData : function(e){
        return Roo.dd.Registry.getHandleFromEvent(e);
    },
    
    /**
     * Called once drag threshold has been reached to initialize the proxy element. By default, it clones the
     * this.dragData.ddel
     * @param {Number} x The x position of the click on the dragged object
     * @param {Number} y The y position of the click on the dragged object
     * @return {Boolean} true to continue the drag, false to cancel
     */
    onInitDrag : function(x, y){
        this.proxy.update(this.dragData.ddel.cloneNode(true));
        this.onStartDrag(x, y);
        return true;
    },
    
    /**
     * Called after a repair of an invalid drop. By default, highlights this.dragData.ddel 
     */
    afterRepair : function(){
        if(Roo.enableFx){
            Roo.Element.fly(this.dragData.ddel).highlight(this.hlColor || "c3daf9");
        }
        this.dragging = false;
    },

    /**
     * Called before a repair of an invalid drop to get the XY to animate to. By default returns
     * the XY of this.dragData.ddel
     * @param {EventObject} e The mouse up event
     * @return {Array} The xy location (e.g. [100, 200])
     */
    getRepairXY : function(e){
        return Roo.Element.fly(this.dragData.ddel).getXY();  
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
/**
 * @class Roo.dd.DropZone
 * @extends Roo.dd.DropTarget
 * This class provides a container DD instance that proxies for multiple child node targets.<br />
 * By default, this class requires that child nodes accepting drop are registered with {@link Roo.dd.Registry}.
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.dd.DropZone = function(el, config){
    Roo.dd.DropZone.superclass.constructor.call(this, el, config);
};

Roo.extend(Roo.dd.DropZone, Roo.dd.DropTarget, {
    /**
     * Returns a custom data object associated with the DOM node that is the target of the event.  By default
     * this looks up the event target in the {@link Roo.dd.Registry}, although you can override this method to
     * provide your own custom lookup.
     * @param {Event} e The event
     * @return {Object} data The custom data
     */
    getTargetFromEvent : function(e){
        return Roo.dd.Registry.getTargetFromEvent(e);
    },

    /**
     * Called internally when the DropZone determines that a {@link Roo.dd.DragSource} has entered a drop node
     * that it has registered.  This method has no default implementation and should be overridden to provide
     * node-specific processing if necessary.
     * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from 
     * {@link #getTargetFromEvent} for this node)
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     */
    onNodeEnter : function(n, dd, e, data){
        
    },

    /**
     * Called internally while the DropZone determines that a {@link Roo.dd.DragSource} is over a drop node
     * that it has registered.  The default implementation returns this.dropNotAllowed, so it should be
     * overridden to provide the proper feedback.
     * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    onNodeOver : function(n, dd, e, data){
        return this.dropAllowed;
    },

    /**
     * Called internally when the DropZone determines that a {@link Roo.dd.DragSource} has been dragged out of
     * the drop node without dropping.  This method has no default implementation and should be overridden to provide
     * node-specific processing if necessary.
     * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     */
    onNodeOut : function(n, dd, e, data){
        
    },

    /**
     * Called internally when the DropZone determines that a {@link Roo.dd.DragSource} has been dropped onto
     * the drop node.  The default implementation returns false, so it should be overridden to provide the
     * appropriate processing of the drop event and return true so that the drag source's repair action does not run.
     * @param {Object} nodeData The custom data associated with the drop node (this is the same value returned from
     * {@link #getTargetFromEvent} for this node)
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {Boolean} True if the drop was valid, else false
     */
    onNodeDrop : function(n, dd, e, data){
        return false;
    },

    /**
     * Called internally while the DropZone determines that a {@link Roo.dd.DragSource} is being dragged over it,
     * but not over any of its registered drop nodes.  The default implementation returns this.dropNotAllowed, so
     * it should be overridden to provide the proper feedback if necessary.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    onContainerOver : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * Called internally when the DropZone determines that a {@link Roo.dd.DragSource} has been dropped on it,
     * but not on any of its registered drop nodes.  The default implementation returns false, so it should be
     * overridden to provide the appropriate processing of the drop event if you need the drop zone itself to
     * be able to accept drops.  It should return true when valid so that the drag source's repair action does not run.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {Boolean} True if the drop was valid, else false
     */
    onContainerDrop : function(dd, e, data){
        return false;
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop zone that the source is now over
     * the zone.  The default implementation returns this.dropNotAllowed and expects that only registered drop
     * nodes can process drag drop operations, so if you need the drop zone itself to be able to process drops
     * you should override this method and provide a custom implementation.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    notifyEnter : function(dd, e, data){
        return this.dropNotAllowed;
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls continuously while it is being dragged over the drop zone.
     * This method will be called on every mouse movement while the drag source is over the drop zone.
     * It will call {@link #onNodeOver} while the drag source is over a registered node, and will also automatically
     * delegate to the appropriate node-specific methods as necessary when the drag source enters and exits
     * registered nodes ({@link #onNodeEnter}, {@link #onNodeOut}). If the drag source is not currently over a
     * registered node, it will call {@link #onContainerOver}.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {String} status The CSS class that communicates the drop status back to the source so that the
     * underlying {@link Roo.dd.StatusProxy} can be updated
     */
    notifyOver : function(dd, e, data){
        var n = this.getTargetFromEvent(e);
        if(!n){ // not over valid drop target
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
                this.lastOverNode = null;
            }
            return this.onContainerOver(dd, e, data);
        }
        if(this.lastOverNode != n){
            if(this.lastOverNode){
                this.onNodeOut(this.lastOverNode, dd, e, data);
            }
            this.onNodeEnter(n, dd, e, data);
            this.lastOverNode = n;
        }
        return this.onNodeOver(n, dd, e, data);
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop zone that the source has been dragged
     * out of the zone without dropping.  If the drag source is currently over a registered node, the notification
     * will be delegated to {@link #onNodeOut} for node-specific handling, otherwise it will be ignored.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop target
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag zone
     */
    notifyOut : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
    },

    /**
     * The function a {@link Roo.dd.DragSource} calls once to notify this drop zone that the dragged item has
     * been dropped on it.  The drag zone will look up the target node based on the event passed in, and if there
     * is a node registered for that event, it will delegate to {@link #onNodeDrop} for node-specific handling,
     * otherwise it will call {@link #onContainerDrop}.
     * @param {Roo.dd.DragSource} source The drag source that was dragged over this drop zone
     * @param {Event} e The event
     * @param {Object} data An object containing arbitrary data supplied by the drag source
     * @return {Boolean} True if the drop was valid, else false
     */
    notifyDrop : function(dd, e, data){
        if(this.lastOverNode){
            this.onNodeOut(this.lastOverNode, dd, e, data);
            this.lastOverNode = null;
        }
        var n = this.getTargetFromEvent(e);
        return n ?
            this.onNodeDrop(n, dd, e, data) :
            this.onContainerDrop(dd, e, data);
    },

    // private
    triggerCacheRefresh : function(){
        Roo.dd.DDM.refreshCache(this.groups);
    }  
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.data.SortTypes
 * @singleton
 * Defines the default sorting (casting?) comparison functions used when sorting data.
 */
Roo.data.SortTypes = {
    /**
     * Default sort that does nothing
     * @param {Mixed} s The value being converted
     * @return {Mixed} The comparison value
     */
    none : function(s){
        return s;
    },
    
    /**
     * The regular expression used to strip tags
     * @type {RegExp}
     * @property
     */
    stripTagsRE : /<\/?[^>]+>/gi,
    
    /**
     * Strips all HTML tags to sort on text only
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asText : function(s){
        return String(s).replace(this.stripTagsRE, "");
    },
    
    /**
     * Strips all HTML tags to sort on text only - Case insensitive
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCText : function(s){
        return String(s).toUpperCase().replace(this.stripTagsRE, "");
    },
    
    /**
     * Case insensitive string
     * @param {Mixed} s The value being converted
     * @return {String} The comparison value
     */
    asUCString : function(s) {
    	return String(s).toUpperCase();
    },
    
    /**
     * Date sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asDate : function(s) {
        if(!s){
            return 0;
        }
        if(s instanceof Date){
            return s.getTime();
        }
    	return Date.parse(String(s));
    },
    
    /**
     * Float sorting
     * @param {Mixed} s The value being converted
     * @return {Float} The comparison value
     */
    asFloat : function(s) {
    	var val = parseFloat(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    },
    
    /**
     * Integer sorting
     * @param {Mixed} s The value being converted
     * @return {Number} The comparison value
     */
    asInt : function(s) {
        var val = parseInt(String(s).replace(/,/g, ""));
        if(isNaN(val)) val = 0;
    	return val;
    }
};/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
* @class Roo.data.Record
 * Instances of this class encapsulate both record <em>definition</em> information, and record
 * <em>value</em> information for use in {@link Roo.data.Store} objects, or any code which needs
 * to access Records cached in an {@link Roo.data.Store} object.<br>
 * <p>
 * Constructors for this class are generated by passing an Array of field definition objects to {@link #create}.
 * Instances are usually only created by {@link Roo.data.Reader} implementations when processing unformatted data
 * objects.<br>
 * <p>
 * Record objects generated by this constructor inherit all the methods of Roo.data.Record listed below.
 * @constructor
 * This constructor should not be used to create Record objects. Instead, use the constructor generated by
 * {@link #create}. The parameters are the same.
 * @param {Array} data An associative Array of data values keyed by the field name.
 * @param {Object} id (Optional) The id of the record. This id should be unique, and is used by the
 * {@link Roo.data.Store} object which owns the Record to index its collection of Records. If
 * not specified an integer id is generated.
 */
Roo.data.Record = function(data, id){
    this.id = (id || id === 0) ? id : ++Roo.data.Record.AUTO_ID;
    this.data = data;
};

/**
 * Generate a constructor for a specific record layout.
 * @param {Array} o An Array of field definition objects which specify field names, and optionally,
 * data types, and a mapping for an {@link Roo.data.Reader} to extract the field's value from a data object.
 * Each field definition object may contain the following properties: <ul>
 * <li><b>name</b> : String<p style="margin-left:1em">The name by which the field is referenced within the Record. This is referenced by,
 * for example the <em>dataIndex</em> property in column definition objects passed to {@link Roo.grid.ColumnModel}</p></li>
 * <li><b>mapping</b> : String<p style="margin-left:1em">(Optional) A path specification for use by the {@link Roo.data.Reader} implementation
 * that is creating the Record to access the data value from the data object. If an {@link Roo.data.JsonReader}
 * is being used, then this is a string containing the javascript expression to reference the data relative to 
 * the record item's root. If an {@link Roo.data.XmlReader} is being used, this is an {@link Roo.DomQuery} path
 * to the data item relative to the record element. If the mapping expression is the same as the field name,
 * this may be omitted.</p></li>
 * <li><b>type</b> : String<p style="margin-left:1em">(Optional) The data type for conversion to displayable value. Possible values are
 * <ul><li>auto (Default, implies no conversion)</li>
 * <li>string</li>
 * <li>int</li>
 * <li>float</li>
 * <li>boolean</li>
 * <li>date</li></ul></p></li>
 * <li><b>sortType</b> : Mixed<p style="margin-left:1em">(Optional) A member of {@link Roo.data.SortTypes}.</p></li>
 * <li><b>sortDir</b> : String<p style="margin-left:1em">(Optional) Initial direction to sort. "ASC" or "DESC"</p></li>
 * <li><b>convert</b> : Function<p style="margin-left:1em">(Optional) A function which converts the value provided
 * by the Reader into an object that will be stored in the Record. It is passed the
 * following parameters:<ul>
 * <li><b>v</b> : Mixed<p style="margin-left:1em">The data value as read by the Reader.</p></li>
 * </ul></p></li>
 * <li><b>dateFormat</b> : String<p style="margin-left:1em">(Optional) A format String for the Date.parseDate function.</p></li>
 * </ul>
 * <br>usage:<br><pre><code>
var TopicRecord = Roo.data.Record.create(
    {name: 'title', mapping: 'topic_title'},
    {name: 'author', mapping: 'username'},
    {name: 'totalPosts', mapping: 'topic_replies', type: 'int'},
    {name: 'lastPost', mapping: 'post_time', type: 'date'},
    {name: 'lastPoster', mapping: 'user2'},
    {name: 'excerpt', mapping: 'post_text'}
);

var myNewRecord = new TopicRecord({
    title: 'Do my job please',
    author: 'noobie',
    totalPosts: 1,
    lastPost: new Date(),
    lastPoster: 'Animal',
    excerpt: 'No way dude!'
});
myStore.add(myNewRecord);
</code></pre>
 * @method create
 * @static
 */
Roo.data.Record.create = function(o){
    var f = function(){
        f.superclass.constructor.apply(this, arguments);
    };
    Roo.extend(f, Roo.data.Record);
    var p = f.prototype;
    p.fields = new Roo.util.MixedCollection(false, function(field){
        return field.name;
    });
    for(var i = 0, len = o.length; i < len; i++){
        p.fields.add(new Roo.data.Field(o[i]));
    }
    f.getField = function(name){
        return p.fields.get(name);  
    };
    return f;
};

Roo.data.Record.AUTO_ID = 1000;
Roo.data.Record.EDIT = 'edit';
Roo.data.Record.REJECT = 'reject';
Roo.data.Record.COMMIT = 'commit';

Roo.data.Record.prototype = {
    /**
     * Readonly flag - true if this record has been modified.
     * @type Boolean
     */
    dirty : false,
    editing : false,
    error: null,
    modified: null,

    // private
    join : function(store){
        this.store = store;
    },

    /**
     * Set the named field to the specified value.
     * @param {String} name The name of the field to set.
     * @param {Object} value The value to set the field to.
     */
    set : function(name, value){
        if(this.data[name] == value){
            return;
        }
        this.dirty = true;
        if(!this.modified){
            this.modified = {};
        }
        if(typeof this.modified[name] == 'undefined'){
            this.modified[name] = this.data[name];
        }
        this.data[name] = value;
        if(!this.editing){
            this.store.afterEdit(this);
        }       
    },

    /**
     * Get the value of the named field.
     * @param {String} name The name of the field to get the value of.
     * @return {Object} The value of the field.
     */
    get : function(name){
        return this.data[name]; 
    },

    // private
    beginEdit : function(){
        this.editing = true;
        this.modified = {}; 
    },

    // private
    cancelEdit : function(){
        this.editing = false;
        delete this.modified;
    },

    // private
    endEdit : function(){
        this.editing = false;
        if(this.dirty && this.store){
            this.store.afterEdit(this);
        }
    },

    /**
     * Usually called by the {@link Roo.data.Store} which owns the Record.
     * Rejects all changes made to the Record since either creation, or the last commit operation.
     * Modified fields are reverted to their original values.
     * <p>
     * Developers should subscribe to the {@link Roo.data.Store#update} event to have their code notified
     * of reject operations.
     */
    reject : function(){
        var m = this.modified;
        for(var n in m){
            if(typeof m[n] != "function"){
                this.data[n] = m[n];
            }
        }
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store){
            this.store.afterReject(this);
        }
    },

    /**
     * Usually called by the {@link Roo.data.Store} which owns the Record.
     * Commits all changes made to the Record since either creation, or the last commit operation.
     * <p>
     * Developers should subscribe to the {@link Roo.data.Store#update} event to have their code notified
     * of commit operations.
     */
    commit : function(){
        this.dirty = false;
        delete this.modified;
        this.editing = false;
        if(this.store){
            this.store.afterCommit(this);
        }
    },

    // private
    hasError : function(){
        return this.error != null;
    },

    // private
    clearError : function(){
        this.error = null;
    },

    /**
     * Creates a copy of this record.
     * @param {String} id (optional) A new record id if you don't want to use this record's id
     * @return {Record}
     */
    copy : function(newId) {
        return new this.constructor(Roo.apply({}, this.data), newId || this.id);
    }
};/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */



/**
 * @class Roo.data.Store
 * @extends Roo.util.Observable
 * The Store class encapsulates a client side cache of {@link Roo.data.Record} objects which provide input data
 * for widgets such as the Roo.grid.Grid, or the Roo.form.ComboBox.<br>
 * <p>
 * A Store object uses an implementation of {@link Roo.data.DataProxy} to access a data object unless you call loadData() directly and pass in your data. The Store object
 * has no knowledge of the format of the data returned by the Proxy.<br>
 * <p>
 * A Store object uses its configured implementation of {@link Roo.data.DataReader} to create {@link Roo.data.Record}
 * instances from the data object. These records are cached and made available through accessor functions.
 * @constructor
 * Creates a new Store.
 * @param {Object} config A config object containing the objects needed for the Store to access data,
 * and read the data into Records.
 */
Roo.data.Store = function(config){
    this.data = new Roo.util.MixedCollection(false);
    this.data.getKey = function(o){
        return o.id;
    };
    this.baseParams = {};
    // private
    this.paramNames = {
        "start" : "start",
        "limit" : "limit",
        "sort" : "sort",
        "dir" : "dir"
    };

    if(config && config.data){
        this.inlineData = config.data;
        delete config.data;
    }

    Roo.apply(this, config);
    
    if(this.reader){ // reader passed
        this.reader = Roo.factory(this.reader, Roo.data);
        this.reader.xmodule = this.xmodule || false;
        if(!this.recordType){
            this.recordType = this.reader.recordType;
        }
        if(this.reader.onMetaChange){
            this.reader.onMetaChange = this.onMetaChange.createDelegate(this);
        }
    }

    if(this.recordType){
        this.fields = this.recordType.prototype.fields;
    }
    this.modified = [];

    this.addEvents({
        /**
         * @event datachanged
         * Fires when the data cache has changed, and a widget which is using this Store
         * as a Record cache should refresh its view.
         * @param {Store} this
         */
        datachanged : true,
        /**
         * @event metachange
         * Fires when this store's reader provides new metadata (fields). This is currently only support for JsonReaders.
         * @param {Store} this
         * @param {Object} meta The JSON metadata
         */
        metachange : true,
        /**
         * @event add
         * Fires when Records have been added to the Store
         * @param {Store} this
         * @param {Roo.data.Record[]} records The array of Records added
         * @param {Number} index The index at which the record(s) were added
         */
        add : true,
        /**
         * @event remove
         * Fires when a Record has been removed from the Store
         * @param {Store} this
         * @param {Roo.data.Record} record The Record that was removed
         * @param {Number} index The index at which the record was removed
         */
        remove : true,
        /**
         * @event update
         * Fires when a Record has been updated
         * @param {Store} this
         * @param {Roo.data.Record} record The Record that was updated
         * @param {String} operation The update operation being performed.  Value may be one of:
         * <pre><code>
 Roo.data.Record.EDIT
 Roo.data.Record.REJECT
 Roo.data.Record.COMMIT
         * </code></pre>
         */
        update : true,
        /**
         * @event clear
         * Fires when the data cache has been cleared.
         * @param {Store} this
         */
        clear : true,
        /**
         * @event beforeload
         * Fires before a request is made for a new data object.  If the beforeload handler returns false
         * the load action will be canceled.
         * @param {Store} this
         * @param {Object} options The loading options that were specified (see {@link #load} for details)
         */
        beforeload : true,
        /**
         * @event load
         * Fires after a new set of Records has been loaded.
         * @param {Store} this
         * @param {Roo.data.Record[]} records The Records that were loaded
         * @param {Object} options The loading options that were specified (see {@link #load} for details)
         */
        load : true,
        /**
         * @event loadexception
         * Fires if an exception occurs in the Proxy during loading.
         * Called with the signature of the Proxy's "loadexception" event.
         * If you return Json { data: [] , success: false, .... } then this will be thrown with the following args
         * 
         * @param {Proxy} 
         * @param {Object} return from JsonData.reader() - success, totalRecords, records
         * @param {Object} load options 
         * @param {Object} jsonData from your request (normally this contains the Exception)
         */
        loadexception : true
    });
    
    if(this.proxy){
        this.proxy = Roo.factory(this.proxy, Roo.data);
        this.proxy.xmodule = this.xmodule || false;
        this.relayEvents(this.proxy,  ["loadexception"]);
    }
    this.sortToggle = {};

    Roo.data.Store.superclass.constructor.call(this);

    if(this.inlineData){
        this.loadData(this.inlineData);
        delete this.inlineData;
    }
};
Roo.extend(Roo.data.Store, Roo.util.Observable, {
     /**
    * @cfg {boolean} isLocal   flag if data is locally available (and can be always looked up
    * without a remote query - used by combo/forms at present.
    */
    
    /**
    * @cfg {Roo.data.DataProxy} proxy The Proxy object which provides access to a data object.
    */
    /**
    * @cfg {Array} data Inline data to be loaded when the store is initialized.
    */
    /**
    * @cfg {Roo.data.Reader} reader The Reader object which processes the data object and returns
    * an Array of Roo.data.record objects which are cached keyed by their <em>id</em> property.
    */
    /**
    * @cfg {Object} baseParams An object containing properties which are to be sent as parameters
    * on any HTTP request
    */
    /**
    * @cfg {Object} sortInfo A config object in the format: {field: "fieldName", direction: "ASC|DESC"}
    */
    /**
    * @cfg {boolean} remoteSort True if sorting is to be handled by requesting the Proxy to provide a refreshed
    * version of the data object in sorted order, as opposed to sorting the Record cache in place (defaults to false).
    */
    remoteSort : false,

    /**
    * @cfg {boolean} pruneModifiedRecords True to clear all modified record information each time the store is
     * loaded or when a record is removed. (defaults to false).
    */
    pruneModifiedRecords : false,

    // private
    lastOptions : null,

    /**
     * Add Records to the Store and fires the add event.
     * @param {Roo.data.Record[]} records An Array of Roo.data.Record objects to add to the cache.
     */
    add : function(records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            records[i].join(this);
        }
        var index = this.data.length;
        this.data.addAll(records);
        this.fireEvent("add", this, records, index);
    },

    /**
     * Remove a Record from the Store and fires the remove event.
     * @param {Ext.data.Record} record The Roo.data.Record object to remove from the cache.
     */
    remove : function(record){
        var index = this.data.indexOf(record);
        this.data.removeAt(index);
        if(this.pruneModifiedRecords){
            this.modified.remove(record);
        }
        this.fireEvent("remove", this, record, index);
    },

    /**
     * Remove all Records from the Store and fires the clear event.
     */
    removeAll : function(){
        this.data.clear();
        if(this.pruneModifiedRecords){
            this.modified = [];
        }
        this.fireEvent("clear", this);
    },

    /**
     * Inserts Records to the Store at the given index and fires the add event.
     * @param {Number} index The start index at which to insert the passed Records.
     * @param {Roo.data.Record[]} records An Array of Roo.data.Record objects to add to the cache.
     */
    insert : function(index, records){
        records = [].concat(records);
        for(var i = 0, len = records.length; i < len; i++){
            this.data.insert(index, records[i]);
            records[i].join(this);
        }
        this.fireEvent("add", this, records, index);
    },

    /**
     * Get the index within the cache of the passed Record.
     * @param {Roo.data.Record} record The Roo.data.Record object to to find.
     * @return {Number} The index of the passed Record. Returns -1 if not found.
     */
    indexOf : function(record){
        return this.data.indexOf(record);
    },

    /**
     * Get the index within the cache of the Record with the passed id.
     * @param {String} id The id of the Record to find.
     * @return {Number} The index of the Record. Returns -1 if not found.
     */
    indexOfId : function(id){
        return this.data.indexOfKey(id);
    },

    /**
     * Get the Record with the specified id.
     * @param {String} id The id of the Record to find.
     * @return {Roo.data.Record} The Record with the passed id. Returns undefined if not found.
     */
    getById : function(id){
        return this.data.key(id);
    },

    /**
     * Get the Record at the specified index.
     * @param {Number} index The index of the Record to find.
     * @return {Roo.data.Record} The Record at the passed index. Returns undefined if not found.
     */
    getAt : function(index){
        return this.data.itemAt(index);
    },

    /**
     * Returns a range of Records between specified indices.
     * @param {Number} startIndex (optional) The starting index (defaults to 0)
     * @param {Number} endIndex (optional) The ending index (defaults to the last Record in the Store)
     * @return {Roo.data.Record[]} An array of Records
     */
    getRange : function(start, end){
        return this.data.getRange(start, end);
    },

    // private
    storeOptions : function(o){
        o = Roo.apply({}, o);
        delete o.callback;
        delete o.scope;
        this.lastOptions = o;
    },

    /**
     * Loads the Record cache from the configured Proxy using the configured Reader.
     * <p>
     * If using remote paging, then the first load call must specify the <em>start</em>
     * and <em>limit</em> properties in the options.params property to establish the initial
     * position within the dataset, and the number of Records to cache on each read from the Proxy.
     * <p>
     * <strong>It is important to note that for remote data sources, loading is asynchronous,
     * and this call will return before the new data has been loaded. Perform any post-processing
     * in a callback function, or in a "load" event handler.</strong>
     * <p>
     * @param {Object} options An object containing properties which control loading options:<ul>
     * <li>params {Object} An object containing properties to pass as HTTP parameters to a remote data source.</li>
     * <li>callback {Function} A function to be called after the Records have been loaded. The callback is
     * passed the following arguments:<ul>
     * <li>r : Roo.data.Record[]</li>
     * <li>options: Options object from the load call</li>
     * <li>success: Boolean success indicator</li></ul></li>
     * <li>scope {Object} Scope with which to call the callback (defaults to the Store object)</li>
     * <li>add {Boolean} indicator to append loaded records rather than replace the current cache.</li>
     * </ul>
     */
    load : function(options){
        options = options || {};
        if(this.fireEvent("beforeload", this, options) !== false){
            this.storeOptions(options);
            var p = Roo.apply(options.params || {}, this.baseParams);
            // if meta was not loaded from remote source.. try requesting it.
            if (!this.reader.metaFromRemote) {
                p._requestMeta = 1;
            }
            if(this.sortInfo && this.remoteSort){
                var pn = this.paramNames;
                p[pn["sort"]] = this.sortInfo.field;
                p[pn["dir"]] = this.sortInfo.direction;
            }
            this.proxy.load(p, this.reader, this.loadRecords, this, options);
        }
    },

    /**
     * Reloads the Record cache from the configured Proxy using the configured Reader and
     * the options from the last load operation performed.
     * @param {Object} options (optional) An object containing properties which may override the options
     * used in the last load operation. See {@link #load} for details (defaults to null, in which case
     * the most recently used options are reused).
     */
    reload : function(options){
        this.load(Roo.applyIf(options||{}, this.lastOptions));
    },

    // private
    // Called as a callback by the Reader during a load operation.
    loadRecords : function(o, options, success){
        if(!o || success === false){
            if(success !== false){
                this.fireEvent("load", this, [], options);
            }
            if(options.callback){
                options.callback.call(options.scope || this, [], options, false);
            }
            return;
        }
        // if data returned failure - throw an exception.
        if (o.success === false) {
            this.fireEvent("loadexception", this, o, options, this.reader.jsonData);
            return;
        }
        var r = o.records, t = o.totalRecords || r.length;
        if(!options || options.add !== true){
            if(this.pruneModifiedRecords){
                this.modified = [];
            }
            for(var i = 0, len = r.length; i < len; i++){
                r[i].join(this);
            }
            if(this.snapshot){
                this.data = this.snapshot;
                delete this.snapshot;
            }
            this.data.clear();
            this.data.addAll(r);
            this.totalLength = t;
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.totalLength = Math.max(t, this.data.length+r.length);
            this.add(r);
        }
        this.fireEvent("load", this, r, options);
        if(options.callback){
            options.callback.call(options.scope || this, r, options, true);
        }
    },

    /**
     * Loads data from a passed data block. A Reader which understands the format of the data
     * must have been configured in the constructor.
     * @param {Object} data The data block from which to read the Records.  The format of the data expected
     * is dependent on the type of Reader that is configured and should correspond to that Reader's readRecords parameter.
     * @param {Boolean} append (Optional) True to append the new Records rather than replace the existing cache.
     */
    loadData : function(o, append){
        var r = this.reader.readRecords(o);
        this.loadRecords(r, {add: append}, true);
    },

    /**
     * Gets the number of cached records.
     * <p>
     * <em>If using paging, this may not be the total size of the dataset. If the data object
     * used by the Reader contains the dataset size, then the getTotalCount() function returns
     * the data set size</em>
     */
    getCount : function(){
        return this.data.length || 0;
    },

    /**
     * Gets the total number of records in the dataset as returned by the server.
     * <p>
     * <em>If using paging, for this to be accurate, the data object used by the Reader must contain
     * the dataset size</em>
     */
    getTotalCount : function(){
        return this.totalLength || 0;
    },

    /**
     * Returns the sort state of the Store as an object with two properties:
     * <pre><code>
 field {String} The name of the field by which the Records are sorted
 direction {String} The sort order, "ASC" or "DESC"
     * </code></pre>
     */
    getSortState : function(){
        return this.sortInfo;
    },

    // private
    applySort : function(){
        if(this.sortInfo && !this.remoteSort){
            var s = this.sortInfo, f = s.field;
            var st = this.fields.get(f).sortType;
            var fn = function(r1, r2){
                var v1 = st(r1.data[f]), v2 = st(r2.data[f]);
                return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
            };
            this.data.sort(s.direction, fn);
            if(this.snapshot && this.snapshot != this.data){
                this.snapshot.sort(s.direction, fn);
            }
        }
    },

    /**
     * Sets the default sort column and order to be used by the next load operation.
     * @param {String} fieldName The name of the field to sort by.
     * @param {String} dir (optional) The sort order, "ASC" or "DESC" (defaults to "ASC")
     */
    setDefaultSort : function(field, dir){
        this.sortInfo = {field: field, direction: dir ? dir.toUpperCase() : "ASC"};
    },

    /**
     * Sort the Records.
     * If remote sorting is used, the sort is performed on the server, and the cache is
     * reloaded. If local sorting is used, the cache is sorted internally.
     * @param {String} fieldName The name of the field to sort by.
     * @param {String} dir (optional) The sort order, "ASC" or "DESC" (defaults to "ASC")
     */
    sort : function(fieldName, dir){
        var f = this.fields.get(fieldName);
        if(!dir){
            if(this.sortInfo && this.sortInfo.field == f.name){ // toggle sort dir
                dir = (this.sortToggle[f.name] || "ASC").toggle("ASC", "DESC");
            }else{
                dir = f.sortDir;
            }
        }
        this.sortToggle[f.name] = dir;
        this.sortInfo = {field: f.name, direction: dir};
        if(!this.remoteSort){
            this.applySort();
            this.fireEvent("datachanged", this);
        }else{
            this.load(this.lastOptions);
        }
    },

    /**
     * Calls the specified function for each of the Records in the cache.
     * @param {Function} fn The function to call. The Record is passed as the first parameter.
     * Returning <em>false</em> aborts and exits the iteration.
     * @param {Object} scope (optional) The scope in which to call the function (defaults to the Record).
     */
    each : function(fn, scope){
        this.data.each(fn, scope);
    },

    /**
     * Gets all records modified since the last commit.  Modified records are persisted across load operations
     * (e.g., during paging).
     * @return {Roo.data.Record[]} An array of Records containing outstanding modifications.
     */
    getModifiedRecords : function(){
        return this.modified;
    },

    // private
    createFilterFn : function(property, value, anyMatch){
        if(!value.exec){ // not a regex
            value = String(value);
            if(value.length == 0){
                return false;
            }
            value = new RegExp((anyMatch === true ? '' : '^') + Roo.escapeRe(value), "i");
        }
        return function(r){
            return value.test(r.data[property]);
        };
    },

    /**
     * Sums the value of <i>property</i> for each record between start and end and returns the result.
     * @param {String} property A field on your records
     * @param {Number} start The record index to start at (defaults to 0)
     * @param {Number} end The last record index to include (defaults to length - 1)
     * @return {Number} The sum
     */
    sum : function(property, start, end){
        var rs = this.data.items, v = 0;
        start = start || 0;
        end = (end || end === 0) ? end : rs.length-1;

        for(var i = start; i <= end; i++){
            v += (rs[i].data[property] || 0);
        }
        return v;
    },

    /**
     * Filter the records by a specified property.
     * @param {String} field A field on your records
     * @param {String/RegExp} value Either a string that the field
     * should start with or a RegExp to test against the field
     * @param {Boolean} anyMatch True to match any part not just the beginning
     */
    filter : function(property, value, anyMatch){
        var fn = this.createFilterFn(property, value, anyMatch);
        return fn ? this.filterBy(fn) : this.clearFilter();
    },

    /**
     * Filter by a function. The specified function will be called with each
     * record in this data source. If the function returns true the record is included,
     * otherwise it is filtered.
     * @param {Function} fn The function to be called, it will receive 2 args (record, id)
     * @param {Object} scope (optional) The scope of the function (defaults to this)
     */
    filterBy : function(fn, scope){
        this.snapshot = this.snapshot || this.data;
        this.data = this.queryBy(fn, scope||this);
        this.fireEvent("datachanged", this);
    },

    /**
     * Query the records by a specified property.
     * @param {String} field A field on your records
     * @param {String/RegExp} value Either a string that the field
     * should start with or a RegExp to test against the field
     * @param {Boolean} anyMatch True to match any part not just the beginning
     * @return {MixedCollection} Returns an Roo.util.MixedCollection of the matched records
     */
    query : function(property, value, anyMatch){
        var fn = this.createFilterFn(property, value, anyMatch);
        return fn ? this.queryBy(fn) : this.data.clone();
    },

    /**
     * Query by a function. The specified function will be called with each
     * record in this data source. If the function returns true the record is included
     * in the results.
     * @param {Function} fn The function to be called, it will receive 2 args (record, id)
     * @param {Object} scope (optional) The scope of the function (defaults to this)
      @return {MixedCollection} Returns an Roo.util.MixedCollection of the matched records
     **/
    queryBy : function(fn, scope){
        var data = this.snapshot || this.data;
        return data.filterBy(fn, scope||this);
    },

    /**
     * Collects unique values for a particular dataIndex from this store.
     * @param {String} dataIndex The property to collect
     * @param {Boolean} allowNull (optional) Pass true to allow null, undefined or empty string values
     * @param {Boolean} bypassFilter (optional) Pass true to collect from all records, even ones which are filtered
     * @return {Array} An array of the unique values
     **/
    collect : function(dataIndex, allowNull, bypassFilter){
        var d = (bypassFilter === true && this.snapshot) ?
                this.snapshot.items : this.data.items;
        var v, sv, r = [], l = {};
        for(var i = 0, len = d.length; i < len; i++){
            v = d[i].data[dataIndex];
            sv = String(v);
            if((allowNull || !Roo.isEmpty(v)) && !l[sv]){
                l[sv] = true;
                r[r.length] = v;
            }
        }
        return r;
    },

    /**
     * Revert to a view of the Record cache with no filtering applied.
     * @param {Boolean} suppressEvent If true the filter is cleared silently without notifying listeners
     */
    clearFilter : function(suppressEvent){
        if(this.snapshot && this.snapshot != this.data){
            this.data = this.snapshot;
            delete this.snapshot;
            if(suppressEvent !== true){
                this.fireEvent("datachanged", this);
            }
        }
    },

    // private
    afterEdit : function(record){
        if(this.modified.indexOf(record) == -1){
            this.modified.push(record);
        }
        this.fireEvent("update", this, record, Roo.data.Record.EDIT);
    },

    // private
    afterReject : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Roo.data.Record.REJECT);
    },

    // private
    afterCommit : function(record){
        this.modified.remove(record);
        this.fireEvent("update", this, record, Roo.data.Record.COMMIT);
    },

    /**
     * Commit all Records with outstanding changes. To handle updates for changes, subscribe to the
     * Store's "update" event, and perform updating when the third parameter is Roo.data.Record.COMMIT.
     */
    commitChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].commit();
        }
    },

    /**
     * Cancel outstanding changes on all changed records.
     */
    rejectChanges : function(){
        var m = this.modified.slice(0);
        this.modified = [];
        for(var i = 0, len = m.length; i < len; i++){
            m[i].reject();
        }
    },

    onMetaChange : function(meta, rtype, o){
        this.recordType = rtype;
        this.fields = rtype.prototype.fields;
        delete this.snapshot;
        this.sortInfo = meta.sortInfo;
        this.modified = [];
        this.fireEvent('metachange', this, this.reader.meta);
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.SimpleStore
 * @extends Roo.data.Store
 * Small helper class to make creating Stores from Array data easier.
 * @cfg {Number} id The array index of the record id. Leave blank to auto generate ids.
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @cfg {Array} data The multi-dimensional array of data
 * @constructor
 * @param {Object} config
 */
Roo.data.SimpleStore = function(config){
    Roo.data.SimpleStore.superclass.constructor.call(this, {
        isLocal : true,
        reader: new Roo.data.ArrayReader({
                id: config.id
            },
            Roo.data.Record.create(config.fields)
        ),
        proxy : new Roo.data.MemoryProxy(config.data)
    });
    this.load();
};
Roo.extend(Roo.data.SimpleStore, Roo.data.Store);/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
/**
 * @extends Roo.data.Store
 * @class Roo.data.JsonStore
 * Small helper class to make creating Stores for JSON data easier. <br/>
<pre><code>
var store = new Roo.data.JsonStore({
    url: 'get-images.php',
    root: 'images',
    fields: ['name', 'url', {name:'size', type: 'float'}, {name:'lastmod', type:'date'}]
});
</code></pre>
 * <b>Note: Although they are not listed, this class inherits all of the config options of Store,
 * JsonReader and HttpProxy (unless inline data is provided).</b>
 * @cfg {Array} fields An array of field definition objects, or field name strings.
 * @constructor
 * @param {Object} config
 */
Roo.data.JsonStore = function(c){
    Roo.data.JsonStore.superclass.constructor.call(this, Roo.apply(c, {
        proxy: !c.data ? new Roo.data.HttpProxy({url: c.url}) : undefined,
        reader: new Roo.data.JsonReader(c, c.fields)
    }));
};
Roo.extend(Roo.data.JsonStore, Roo.data.Store);/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

 
Roo.data.Field = function(config){
    if(typeof config == "string"){
        config = {name: config};
    }
    Roo.apply(this, config);
    
    if(!this.type){
        this.type = "auto";
    }
    
    var st = Roo.data.SortTypes;
    // named sortTypes are supported, here we look them up
    if(typeof this.sortType == "string"){
        this.sortType = st[this.sortType];
    }
    
    // set default sortType for strings and dates
    if(!this.sortType){
        switch(this.type){
            case "string":
                this.sortType = st.asUCString;
                break;
            case "date":
                this.sortType = st.asDate;
                break;
            default:
                this.sortType = st.none;
        }
    }

    // define once
    var stripRe = /[\$,%]/g;

    // prebuilt conversion function for this field, instead of
    // switching every time we're reading a value
    if(!this.convert){
        var cv, dateFormat = this.dateFormat;
        switch(this.type){
            case "":
            case "auto":
            case undefined:
                cv = function(v){ return v; };
                break;
            case "string":
                cv = function(v){ return (v === undefined || v === null) ? '' : String(v); };
                break;
            case "int":
                cv = function(v){
                    return v !== undefined && v !== null && v !== '' ?
                           parseInt(String(v).replace(stripRe, ""), 10) : '';
                    };
                break;
            case "float":
                cv = function(v){
                    return v !== undefined && v !== null && v !== '' ?
                           parseFloat(String(v).replace(stripRe, ""), 10) : ''; 
                    };
                break;
            case "bool":
            case "boolean":
                cv = function(v){ return v === true || v === "true" || v == 1; };
                break;
            case "date":
                cv = function(v){
                    if(!v){
                        return '';
                    }
                    if(v instanceof Date){
                        return v;
                    }
                    if(dateFormat){
                        if(dateFormat == "timestamp"){
                            return new Date(v*1000);
                        }
                        return Date.parseDate(v, dateFormat);
                    }
                    var parsed = Date.parse(v);
                    return parsed ? new Date(parsed) : null;
                };
             break;
            
        }
        this.convert = cv;
    }
};

Roo.data.Field.prototype = {
    dateFormat: null,
    defaultValue: "",
    mapping: null,
    sortType : null,
    sortDir : "ASC"
};/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 
// Base class for reading structured data from a data source.  This class is intended to be
// extended (see ArrayReader, JsonReader and XmlReader) and should not be created directly.

/**
 * @class Roo.data.DataReader
 * Base class for reading structured data from a data source.  This class is intended to be
 * extended (see {Roo.data.ArrayReader}, {Roo.data.JsonReader} and {Roo.data.XmlReader}) and should not be created directly.
 */

Roo.data.DataReader = function(meta, recordType){
    
    this.meta = meta;
    
    this.recordType = recordType instanceof Array ? 
        Roo.data.Record.create(recordType) : recordType;
};

Roo.data.DataReader.prototype = {
     /**
     * Create an empty record
     * @param {Object} data (optional) - overlay some values
     * @return {Roo.data.Record} record created.
     */
    newRow :  function(d) {
        var da =  {};
        this.recordType.prototype.fields.each(function(c) {
            switch( c.type) {
                case 'int' : da[c.name] = 0; break;
                case 'date' : da[c.name] = new Date(); break;
                case 'float' : da[c.name] = 0.0; break;
                case 'boolean' : da[c.name] = false; break;
                default : da[c.name] = ""; break;
            }
            
        });
        return new this.recordType(Roo.apply(da, d));
    }
    
};/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.DataProxy
 * @extends Roo.data.Observable
 * This class is an abstract base class for implementations which provide retrieval of
 * unformatted data objects.<br>
 * <p>
 * DataProxy implementations are usually used in conjunction with an implementation of Roo.data.DataReader
 * (of the appropriate type which knows how to parse the data object) to provide a block of
 * {@link Roo.data.Records} to an {@link Roo.data.Store}.<br>
 * <p>
 * Custom implementations must implement the load method as described in
 * {@link Roo.data.HttpProxy#load}.
 */
Roo.data.DataProxy = function(){
    this.addEvents({
        /**
         * @event beforeload
         * Fires before a network request is made to retrieve a data object.
         * @param {Object} This DataProxy object.
         * @param {Object} params The params parameter to the load function.
         */
        beforeload : true,
        /**
         * @event load
         * Fires before the load method's callback is called.
         * @param {Object} This DataProxy object.
         * @param {Object} o The data object.
         * @param {Object} arg The callback argument object passed to the load function.
         */
        load : true,
        /**
         * @event loadexception
         * Fires if an Exception occurs during data retrieval.
         * @param {Object} This DataProxy object.
         * @param {Object} o The data object.
         * @param {Object} arg The callback argument object passed to the load function.
         * @param {Object} e The Exception.
         */
        loadexception : true
    });
    Roo.data.DataProxy.superclass.constructor.call(this);
};

Roo.extend(Roo.data.DataProxy, Roo.util.Observable);

    /**
     * @cfg {void} listeners (Not available) Constructor blocks listeners from being set
     */
/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
/**
 * @class Roo.data.MemoryProxy
 * An implementation of Roo.data.DataProxy that simply passes the data specified in its constructor
 * to the Reader when its load method is called.
 * @constructor
 * @param {Object} data The data object which the Reader uses to construct a block of Roo.data.Records.
 */
Roo.data.MemoryProxy = function(data){
    if (data.data) {
        data = data.data;
    }
    Roo.data.MemoryProxy.superclass.constructor.call(this);
    this.data = data;
};

Roo.extend(Roo.data.MemoryProxy, Roo.data.DataProxy, {
    /**
     * Load data from the requested source (in this case an in-memory
     * data object passed to the constructor), read the data object into
     * a block of Roo.data.Records using the passed Roo.data.DataReader implementation, and
     * process that block using the passed callback.
     * @param {Object} params This parameter is not used by the MemoryProxy class.
     * @param {Roo.data.DataReader} reader The Reader object which converts the data
     * object into a block of Roo.data.Records.
     * @param {Function} callback The function into which to pass the block of Roo.data.records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
    load : function(params, reader, callback, scope, arg){
        params = params || {};
        var result;
        try {
            result = reader.readRecords(this.data);
        }catch(e){
            this.fireEvent("loadexception", this, arg, null, e);
            callback.call(scope, null, arg, false);
            return;
        }
        callback.call(scope, result, arg, true);
    },
    
    // private
    update : function(params, records){
        
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
/**
 * @class Roo.data.HttpProxy
 * @extends Roo.data.DataProxy
 * An implementation of {@link Roo.data.DataProxy} that reads a data object from an {@link Roo.data.Connection} object
 * configured to reference a certain URL.<br><br>
 * <p>
 * <em>Note that this class cannot be used to retrieve data from a domain other than the domain
 * from which the running page was served.<br><br>
 * <p>
 * For cross-domain access to remote data, use an {@link Roo.data.ScriptTagProxy}.</em><br><br>
 * <p>
 * Be aware that to enable the browser to parse an XML document, the server must set
 * the Content-Type header in the HTTP response to "text/xml".
 * @constructor
 * @param {Object} conn Connection config options to add to each request (e.g. {url: 'foo.php'} or
 * an {@link Roo.data.Connection} object.  If a Connection config is passed, the singleton {@link Roo.Ajax} object
 * will be used to make the request.
 */
Roo.data.HttpProxy = function(conn){
    Roo.data.HttpProxy.superclass.constructor.call(this);
    // is conn a conn config or a real conn?
    this.conn = conn;
    this.useAjax = !conn || !conn.events;
  
};

Roo.extend(Roo.data.HttpProxy, Roo.data.DataProxy, {
    // thse are take from connection...
    
    /**
     * @cfg {String} url (Optional) The default URL to be used for requests to the server. (defaults to undefined)
     */
    /**
     * @cfg {Object} extraParams (Optional) An object containing properties which are used as
     * extra parameters to each request made by this object. (defaults to undefined)
     */
    /**
     * @cfg {Object} defaultHeaders (Optional) An object containing request headers which are added
     *  to each request made by this object. (defaults to undefined)
     */
    /**
     * @cfg {String} method (Optional) The default HTTP method to be used for requests. (defaults to undefined; if not set but parms are present will use POST, otherwise GET)
     */
    /**
     * @cfg {Number} timeout (Optional) The timeout in milliseconds to be used for requests. (defaults to 30000)
     */
     /**
     * @cfg {Boolean} autoAbort (Optional) Whether this request should abort any pending requests. (defaults to false)
     * @type Boolean
     */
  

    /**
     * @cfg {Boolean} disableCaching (Optional) True to add a unique cache-buster param to GET requests. (defaults to true)
     * @type Boolean
     */
    /**
     * Return the {@link Roo.data.Connection} object being used by this Proxy.
     * @return {Connection} The Connection object. This object may be used to subscribe to events on
     * a finer-grained basis than the DataProxy events.
     */
    getConnection : function(){
        return this.useAjax ? Roo.Ajax : this.conn;
    },

    /**
     * Load data from the configured {@link Roo.data.Connection}, read the data object into
     * a block of Roo.data.Records using the passed {@link Roo.data.DataReader} implementation, and
     * process that block using the passed callback.
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Roo.data.DataReader} reader The Reader object which converts the data
     * object into a block of Roo.data.Records.
     * @param {Function} callback The function into which to pass the block of Roo.data.Records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){
            var  o = {
                params : params || {},
                request: {
                    callback : callback,
                    scope : scope,
                    arg : arg
                },
                reader: reader,
                callback : this.loadResponse,
                scope: this
            };
            if(this.useAjax){
                Roo.applyIf(o, this.conn);
                if(this.activeRequest){
                    Roo.Ajax.abort(this.activeRequest);
                }
                this.activeRequest = Roo.Ajax.request(o);
            }else{
                this.conn.request(o);
            }
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    loadResponse : function(o, success, response){
        delete this.activeRequest;
        if(!success){
            this.fireEvent("loadexception", this, o, response);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        var result;
        try {
            result = o.reader.read(response);
        }catch(e){
            this.fireEvent("loadexception", this, o, response, e);
            o.request.callback.call(o.request.scope, null, o.request.arg, false);
            return;
        }
        
        this.fireEvent("load", this, o, o.request.arg);
        o.request.callback.call(o.request.scope, result, o.request.arg, true);
    },

    // private
    update : function(dataSet){

    },

    // private
    updateResponse : function(dataSet){

    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.ScriptTagProxy
 * An implementation of Roo.data.DataProxy that reads a data object from a URL which may be in a domain
 * other than the originating domain of the running page.<br><br>
 * <p>
 * <em>Note that if you are retrieving data from a page that is in a domain that is NOT the same as the originating domain
 * of the running page, you must use this class, rather than DataProxy.</em><br><br>
 * <p>
 * The content passed back from a server resource requested by a ScriptTagProxy is executable JavaScript
 * source code that is used as the source inside a &lt;script> tag.<br><br>
 * <p>
 * In order for the browser to process the returned data, the server must wrap the data object
 * with a call to a callback function, the name of which is passed as a parameter by the ScriptTagProxy.
 * Below is a Java example for a servlet which returns data for either a ScriptTagProxy, or an HttpProxy
 * depending on whether the callback name was passed:
 * <p>
 * <pre><code>
boolean scriptTag = false;
String cb = request.getParameter("callback");
if (cb != null) {
    scriptTag = true;
    response.setContentType("text/javascript");
} else {
    response.setContentType("application/x-json");
}
Writer out = response.getWriter();
if (scriptTag) {
    out.write(cb + "(");
}
out.print(dataBlock.toJsonString());
if (scriptTag) {
    out.write(");");
}
</pre></code>
 *
 * @constructor
 * @param {Object} config A configuration object.
 */
Roo.data.ScriptTagProxy = function(config){
    Roo.data.ScriptTagProxy.superclass.constructor.call(this);
    Roo.apply(this, config);
    this.head = document.getElementsByTagName("head")[0];
};

Roo.data.ScriptTagProxy.TRANS_ID = 1000;

Roo.extend(Roo.data.ScriptTagProxy, Roo.data.DataProxy, {
    /**
     * @cfg {String} url The URL from which to request the data object.
     */
    /**
     * @cfg {Number} timeout (Optional) The number of milliseconds to wait for a response. Defaults to 30 seconds.
     */
    timeout : 30000,
    /**
     * @cfg {String} callbackParam (Optional) The name of the parameter to pass to the server which tells
     * the server the name of the callback function set up by the load call to process the returned data object.
     * Defaults to "callback".<p>The server-side processing must read this parameter value, and generate
     * javascript output which calls this named function passing the data object as its only parameter.
     */
    callbackParam : "callback",
    /**
     *  @cfg {Boolean} nocache (Optional) Defaults to true. Disable cacheing by adding a unique parameter
     * name to the request.
     */
    nocache : true,

    /**
     * Load data from the configured URL, read the data object into
     * a block of Roo.data.Records using the passed Roo.data.DataReader implementation, and
     * process that block using the passed callback.
     * @param {Object} params An object containing properties which are to be used as HTTP parameters
     * for the request to the remote server.
     * @param {Roo.data.DataReader} reader The Reader object which converts the data
     * object into a block of Roo.data.Records.
     * @param {Function} callback The function into which to pass the block of Roo.data.Records.
     * The function must be passed <ul>
     * <li>The Record block object</li>
     * <li>The "arg" argument from the load function</li>
     * <li>A boolean success indicator</li>
     * </ul>
     * @param {Object} scope The scope in which to call the callback
     * @param {Object} arg An optional argument which is passed to the callback as its second parameter.
     */
    load : function(params, reader, callback, scope, arg){
        if(this.fireEvent("beforeload", this, params) !== false){

            var p = Roo.urlEncode(Roo.apply(params, this.extraParams));

            var url = this.url;
            url += (url.indexOf("?") != -1 ? "&" : "?") + p;
            if(this.nocache){
                url += "&_dc=" + (new Date().getTime());
            }
            var transId = ++Roo.data.ScriptTagProxy.TRANS_ID;
            var trans = {
                id : transId,
                cb : "stcCallback"+transId,
                scriptId : "stcScript"+transId,
                params : params,
                arg : arg,
                url : url,
                callback : callback,
                scope : scope,
                reader : reader
            };
            var conn = this;

            window[trans.cb] = function(o){
                conn.handleResponse(o, trans);
            };

            url += String.format("&{0}={1}", this.callbackParam, trans.cb);

            if(this.autoAbort !== false){
                this.abort();
            }

            trans.timeoutId = this.handleFailure.defer(this.timeout, this, [trans]);

            var script = document.createElement("script");
            script.setAttribute("src", url);
            script.setAttribute("type", "text/javascript");
            script.setAttribute("id", trans.scriptId);
            this.head.appendChild(script);

            this.trans = trans;
        }else{
            callback.call(scope||this, null, arg, false);
        }
    },

    // private
    isLoading : function(){
        return this.trans ? true : false;
    },

    /**
     * Abort the current server request.
     */
    abort : function(){
        if(this.isLoading()){
            this.destroyTrans(this.trans);
        }
    },

    // private
    destroyTrans : function(trans, isLoaded){
        this.head.removeChild(document.getElementById(trans.scriptId));
        clearTimeout(trans.timeoutId);
        if(isLoaded){
            window[trans.cb] = undefined;
            try{
                delete window[trans.cb];
            }catch(e){}
        }else{
            // if hasn't been loaded, wait for load to remove it to prevent script error
            window[trans.cb] = function(){
                window[trans.cb] = undefined;
                try{
                    delete window[trans.cb];
                }catch(e){}
            };
        }
    },

    // private
    handleResponse : function(o, trans){
        this.trans = false;
        this.destroyTrans(trans, true);
        var result;
        try {
            result = trans.reader.readRecords(o);
        }catch(e){
            this.fireEvent("loadexception", this, o, trans.arg, e);
            trans.callback.call(trans.scope||window, null, trans.arg, false);
            return;
        }
        this.fireEvent("load", this, o, trans.arg);
        trans.callback.call(trans.scope||window, result, trans.arg, true);
    },

    // private
    handleFailure : function(trans){
        this.trans = false;
        this.destroyTrans(trans, false);
        this.fireEvent("loadexception", this, null, trans.arg);
        trans.callback.call(trans.scope||window, null, trans.arg, false);
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.JsonReader
 * @extends Roo.data.DataReader
 * Data reader class to create an Array of Roo.data.Record objects from a JSON response
 * based on mappings in a provided Roo.data.Record constructor.
 * <p>
 * Example code:
 * <pre><code>
var RecordDef = Roo.data.Record.create([
    {name: 'name', mapping: 'name'},     // "mapping" property not needed if it's the same as "name"
    {name: 'occupation'}                 // This field will use "occupation" as the mapping.
]);
var myReader = new Roo.data.JsonReader({
    totalProperty: "results",    // The property which contains the total dataset size (optional)
    root: "rows",                // The property which contains an Array of row objects
    id: "id"                     // The property within each row object that provides an ID for the record (optional)
}, RecordDef);
</code></pre>
 * <p>
 * This would consume a JSON file like this:
 * <pre><code>
{ 'results': 2, 'rows': [
    { 'id': 1, 'name': 'Bill', occupation: 'Gardener' },
    { 'id': 2, 'name': 'Ben', occupation: 'Horticulturalist' } ]
}
</code></pre>
 * @cfg {String} totalProperty Name of the property from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} successProperty Name of the property from which to retrieve the success attribute used by forms.
 * @cfg {String} root name of the property which contains the Array of row objects.
 * @cfg {String} id Name of the property within a row object that contains a record identifier value.
 * @constructor
 * Create a new JsonReader
 * @param {Object} meta Metadata configuration options
 * @param {Object} recordType Either an Array of field definition objects,
 * or an {@link Roo.data.Record} object created using {@link Roo.data.Record#create}.
 */
Roo.data.JsonReader = function(meta, recordType){
    
    meta = meta || {};
    // set some defaults:
    Roo.applyIf(meta, {
        totalProperty: 'total',
        successProperty : 'success',
        root : 'data',
        id : 'id'
    });
    
    Roo.data.JsonReader.superclass.constructor.call(this, meta, recordType||meta.fields);
};
Roo.extend(Roo.data.JsonReader, Roo.data.DataReader, {
    
    /**
     * @prop {Boolean} metaFromRemote  - if the meta data was loaded from the remote source.
     * Used by Store query builder to append _requestMeta to params.
     * 
     */
    metaFromRemote : false,
    /**
     * This method is only used by a DataProxy which has retrieved data from a remote server.
     * @param {Object} response The XHR object which contains the JSON data in its responseText.
     * @return {Object} data A data block which is used by an Roo.data.Store object as
     * a cache of Roo.data.Records.
     */
    read : function(response){
        var json = response.responseText;
       
        var o = /* eval:var:o */ eval("("+json+")");
        if(!o) {
            throw {message: "JsonReader.read: Json object not found"};
        }
        
        if(o.metaData){
            
            delete this.ef;
            this.metaFromRemote = true;
            this.meta = o.metaData;
            this.recordType = Roo.data.Record.create(o.metaData.fields);
            this.onMetaChange(this.meta, this.recordType, o);
        }
        return this.readRecords(o);
    },

    // private function a store will implement
    onMetaChange : function(meta, recordType, o){

    },

    /**
	 * @ignore
	 */
    simpleAccess: function(obj, subsc) {
    	return obj[subsc];
    },

	/**
	 * @ignore
	 */
    getJsonAccessor: function(){
        var re = /[\[\.]/;
        return function(expr) {
            try {
                return(re.test(expr))
                    ? new Function("obj", "return obj." + expr)
                    : function(obj){
                        return obj[expr];
                    };
            } catch(e){}
            return Roo.emptyFn;
        };
    }(),

    /**
     * Create a data block containing Roo.data.Records from an XML document.
     * @param {Object} o An object which contains an Array of row objects in the property specified
     * in the config as 'root, and optionally a property, specified in the config as 'totalProperty'
     * which contains the total size of the dataset.
     * @return {Object} data A data block which is used by an Roo.data.Store object as
     * a cache of Roo.data.Records.
     */
    readRecords : function(o){
        /**
         * After any data loads, the raw JSON data is available for further custom processing.
         * @type Object
         */
        this.jsonData = o;
        var s = this.meta, Record = this.recordType,
            f = Record.prototype.fields, fi = f.items, fl = f.length;

//      Generate extraction functions for the totalProperty, the root, the id, and for each field
        if (!this.ef) {
            if(s.totalProperty) {
	            this.getTotal = this.getJsonAccessor(s.totalProperty);
	        }
	        if(s.successProperty) {
	            this.getSuccess = this.getJsonAccessor(s.successProperty);
	        }
	        this.getRoot = s.root ? this.getJsonAccessor(s.root) : function(p){return p;};
	        if (s.id) {
	        	var g = this.getJsonAccessor(s.id);
	        	this.getId = function(rec) {
	        		var r = g(rec);
		        	return (r === undefined || r === "") ? null : r;
	        	};
	        } else {
	        	this.getId = function(){return null;};
	        }
            this.ef = [];
            for(var jj = 0; jj < fl; jj++){
                f = fi[jj];
                var map = (f.mapping !== undefined && f.mapping !== null) ? f.mapping : f.name;
                this.ef[jj] = this.getJsonAccessor(map);
            }
        }

    	var root = this.getRoot(o), c = root.length, totalRecords = c, success = true;
    	if(s.totalProperty){
            var vt = parseInt(this.getTotal(o), 10);
            if(!isNaN(vt)){
                totalRecords = vt;
            }
        }
        if(s.successProperty){
            var vs = this.getSuccess(o);
            if(vs === false || vs === 'false'){
                success = false;
            }
        }
        var records = [];
	    for(var i = 0; i < c; i++){
		    var n = root[i];
	        var values = {};
	        var id = this.getId(n);
	        for(var j = 0; j < fl; j++){
	            f = fi[j];
                var v = this.ef[j](n);
                values[f.name] = f.convert((v !== undefined) ? v : f.defaultValue);
	        }
	        var record = new Record(values, id);
	        record.json = n;
	        records[i] = record;
	    }
	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords
	    };
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.XmlReader
 * @extends Roo.data.DataReader
 * Data reader class to create an Array of {@link Roo.data.Record} objects from an XML document
 * based on mappings in a provided Roo.data.Record constructor.<br><br>
 * <p>
 * <em>Note that in order for the browser to parse a returned XML document, the Content-Type
 * header in the HTTP response must be set to "text/xml".</em>
 * <p>
 * Example code:
 * <pre><code>
var RecordDef = Roo.data.Record.create([
   {name: 'name', mapping: 'name'},     // "mapping" property not needed if it's the same as "name"
   {name: 'occupation'}                 // This field will use "occupation" as the mapping.
]);
var myReader = new Roo.data.XmlReader({
   totalRecords: "results", // The element which contains the total dataset size (optional)
   record: "row",           // The repeated element which contains row information
   id: "id"                 // The element within the row that provides an ID for the record (optional)
}, RecordDef);
</code></pre>
 * <p>
 * This would consume an XML file like this:
 * <pre><code>
&lt;?xml?>
&lt;dataset>
 &lt;results>2&lt;/results>
 &lt;row>
   &lt;id>1&lt;/id>
   &lt;name>Bill&lt;/name>
   &lt;occupation>Gardener&lt;/occupation>
 &lt;/row>
 &lt;row>
   &lt;id>2&lt;/id>
   &lt;name>Ben&lt;/name>
   &lt;occupation>Horticulturalist&lt;/occupation>
 &lt;/row>
&lt;/dataset>
</code></pre>
 * @cfg {String} totalRecords The DomQuery path from which to retrieve the total number of records
 * in the dataset. This is only needed if the whole dataset is not passed in one go, but is being
 * paged from the remote server.
 * @cfg {String} record The DomQuery path to the repeated element which contains record information.
 * @cfg {String} success The DomQuery path to the success attribute used by forms.
 * @cfg {String} id The DomQuery path relative from the record element to the element that contains
 * a record identifier value.
 * @constructor
 * Create a new XmlReader
 * @param {Object} meta Metadata configuration options
 * @param {Mixed} recordType The definition of the data record type to produce.  This can be either a valid
 * Record subclass created with {@link Roo.data.Record#create}, or an array of objects with which to call
 * Roo.data.Record.create.  See the {@link Roo.data.Record} class for more details.
 */
Roo.data.XmlReader = function(meta, recordType){
    meta = meta || {};
    Roo.data.XmlReader.superclass.constructor.call(this, meta, recordType||meta.fields);
};
Roo.extend(Roo.data.XmlReader, Roo.data.DataReader, {
    /**
     * This method is only used by a DataProxy which has retrieved data from a remote server.
	 * @param {Object} response The XHR object which contains the parsed XML document.  The response is expected
	 * to contain a method called 'responseXML' that returns an XML document object.
     * @return {Object} records A data block which is used by an {@link Roo.data.Store} as
     * a cache of Roo.data.Records.
     */
    read : function(response){
        var doc = response.responseXML;
        if(!doc) {
            throw {message: "XmlReader.read: XML Document not available"};
        }
        return this.readRecords(doc);
    },

    /**
     * Create a data block containing Roo.data.Records from an XML document.
	 * @param {Object} doc A parsed XML document.
     * @return {Object} records A data block which is used by an {@link Roo.data.Store} as
     * a cache of Roo.data.Records.
     */
    readRecords : function(doc){
        /**
         * After any data loads/reads, the raw XML Document is available for further custom processing.
         * @type XMLDocument
         */
        this.xmlData = doc;
        var root = doc.documentElement || doc;
    	var q = Roo.DomQuery;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var sid = this.meta.id;
    	var totalRecords = 0, success = true;
    	if(this.meta.totalRecords){
    	    totalRecords = q.selectNumber(this.meta.totalRecords, root, 0);
    	}
        
        if(this.meta.success){
            var sv = q.selectValue(this.meta.success, root, true);
            success = sv !== false && sv !== 'false';
    	}
    	var records = [];
    	var ns = q.select(this.meta.record, root);
        for(var i = 0, len = ns.length; i < len; i++) {
	        var n = ns[i];
	        var values = {};
	        var id = sid ? q.selectValue(sid, n) : undefined;
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
	            var f = fields.items[j];
                var v = q.selectValue(f.mapping || f.name, n, f.defaultValue);
	            v = f.convert(v);
	            values[f.name] = v;
	        }
	        var record = new recordType(values, id);
	        record.node = n;
	        records[records.length] = record;
	    }

	    return {
	        success : success,
	        records : records,
	        totalRecords : totalRecords || records.length
	    };
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.data.ArrayReader
 * @extends Roo.data.DataReader
 * Data reader class to create an Array of Roo.data.Record objects from an Array.
 * Each element of that Array represents a row of data fields. The
 * fields are pulled into a Record object using as a subscript, the <em>mapping</em> property
 * of the field definition if it exists, or the field's ordinal position in the definition.<br>
 * <p>
 * Example code:.
 * <pre><code>
var RecordDef = Roo.data.Record.create([
    {name: 'name', mapping: 1},         // "mapping" only needed if an "id" field is present which
    {name: 'occupation', mapping: 2}    // precludes using the ordinal position as the index.
]);
var myReader = new Roo.data.ArrayReader({
    id: 0                     // The subscript within row Array that provides an ID for the Record (optional)
}, RecordDef);
</code></pre>
 * <p>
 * This would consume an Array like this:
 * <pre><code>
[ [1, 'Bill', 'Gardener'], [2, 'Ben', 'Horticulturalist'] ]
  </code></pre>
 * @cfg {String} id (optional) The subscript within row Array that provides an ID for the Record
 * @constructor
 * Create a new JsonReader
 * @param {Object} meta Metadata configuration options.
 * @param {Object} recordType Either an Array of field definition objects
 * as specified to {@link Roo.data.Record#create},
 * or an {@link Roo.data.Record} object
 * created using {@link Roo.data.Record#create}.
 */
Roo.data.ArrayReader = function(meta, recordType){
    Roo.data.ArrayReader.superclass.constructor.call(this, meta, recordType);
};

Roo.extend(Roo.data.ArrayReader, Roo.data.JsonReader, {
    /**
     * Create a data block containing Roo.data.Records from an XML document.
     * @param {Object} o An Array of row objects which represents the dataset.
     * @return {Object} data A data block which is used by an Roo.data.Store object as
     * a cache of Roo.data.Records.
     */
    readRecords : function(o){
        var sid = this.meta ? this.meta.id : null;
    	var recordType = this.recordType, fields = recordType.prototype.fields;
    	var records = [];
    	var root = o;
	    for(var i = 0; i < root.length; i++){
		    var n = root[i];
	        var values = {};
	        var id = ((sid || sid === 0) && n[sid] !== undefined && n[sid] !== "" ? n[sid] : null);
	        for(var j = 0, jlen = fields.length; j < jlen; j++){
                var f = fields.items[j];
                var k = f.mapping !== undefined && f.mapping !== null ? f.mapping : j;
                var v = n[k] !== undefined ? n[k] : f.defaultValue;
                v = f.convert(v);
                values[f.name] = v;
            }
	        var record = new recordType(values, id);
	        record.json = n;
	        records[records.length] = record;
	    }
	    return {
	        records : records,
	        totalRecords : records.length
	    };
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.data.Tree
 * @extends Roo.util.Observable
 * Represents a tree data structure and bubbles all the events for its nodes. The nodes
 * in the tree have most standard DOM functionality.
 * @constructor
 * @param {Node} root (optional) The root node
 */
Roo.data.Tree = function(root){
   this.nodeHash = {};
   /**
    * The root node for this tree
    * @type Node
    */
   this.root = null;
   if(root){
       this.setRootNode(root);
   }
   this.addEvents({
       /**
        * @event append
        * Fires when a new child node is appended to a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The newly appended node
        * @param {Number} index The index of the newly appended node
        */
       "append" : true,
       /**
        * @event remove
        * Fires when a child node is removed from a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node removed
        */
       "remove" : true,
       /**
        * @event move
        * Fires when a node is moved to a new location in the tree
        * @param {Tree} tree The owner tree
        * @param {Node} node The node moved
        * @param {Node} oldParent The old parent of this node
        * @param {Node} newParent The new parent of this node
        * @param {Number} index The index it was moved to
        */
       "move" : true,
       /**
        * @event insert
        * Fires when a new child node is inserted in a node in this tree.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node inserted
        * @param {Node} refNode The child node the node was inserted before
        */
       "insert" : true,
       /**
        * @event beforeappend
        * Fires before a new child is appended to a node in this tree, return false to cancel the append.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be appended
        */
       "beforeappend" : true,
       /**
        * @event beforeremove
        * Fires before a child is removed from a node in this tree, return false to cancel the remove.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be removed
        */
       "beforeremove" : true,
       /**
        * @event beforemove
        * Fires before a node is moved to a new location in the tree. Return false to cancel the move.
        * @param {Tree} tree The owner tree
        * @param {Node} node The node being moved
        * @param {Node} oldParent The parent of the node
        * @param {Node} newParent The new parent the node is moving to
        * @param {Number} index The index it is being moved to
        */
       "beforemove" : true,
       /**
        * @event beforeinsert
        * Fires before a new child is inserted in a node in this tree, return false to cancel the insert.
        * @param {Tree} tree The owner tree
        * @param {Node} parent The parent node
        * @param {Node} node The child node to be inserted
        * @param {Node} refNode The child node the node is being inserted before
        */
       "beforeinsert" : true
   });

    Roo.data.Tree.superclass.constructor.call(this);
};

Roo.extend(Roo.data.Tree, Roo.util.Observable, {
    pathSeparator: "/",

    proxyNodeEvent : function(){
        return this.fireEvent.apply(this, arguments);
    },

    /**
     * Returns the root node for this tree.
     * @return {Node}
     */
    getRootNode : function(){
        return this.root;
    },

    /**
     * Sets the root node for this tree.
     * @param {Node} node
     * @return {Node}
     */
    setRootNode : function(node){
        this.root = node;
        node.ownerTree = this;
        node.isRoot = true;
        this.registerNode(node);
        return node;
    },

    /**
     * Gets a node in this tree by its id.
     * @param {String} id
     * @return {Node}
     */
    getNodeById : function(id){
        return this.nodeHash[id];
    },

    registerNode : function(node){
        this.nodeHash[node.id] = node;
    },

    unregisterNode : function(node){
        delete this.nodeHash[node.id];
    },

    toString : function(){
        return "[Tree"+(this.id?" "+this.id:"")+"]";
    }
});

/**
 * @class Roo.data.Node
 * @extends Roo.util.Observable
 * @cfg {Boolean} leaf true if this node is a leaf and does not have children
 * @cfg {String} id The id for this node. If one is not specified, one is generated.
 * @constructor
 * @param {Object} attributes The attributes/config for the node
 */
Roo.data.Node = function(attributes){
    /**
     * The attributes supplied for the node. You can use this property to access any custom attributes you supplied.
     * @type {Object}
     */
    this.attributes = attributes || {};
    this.leaf = this.attributes.leaf;
    /**
     * The node id. @type String
     */
    this.id = this.attributes.id;
    if(!this.id){
        this.id = Roo.id(null, "ynode-");
        this.attributes.id = this.id;
    }
    /**
     * All child nodes of this node. @type Array
     */
    this.childNodes = [];
    if(!this.childNodes.indexOf){ // indexOf is a must
        this.childNodes.indexOf = function(o){
            for(var i = 0, len = this.length; i < len; i++){
                if(this[i] == o) {
                    return i;
                }
            }
            return -1;
        };
    }
    /**
     * The parent node for this node. @type Node
     */
    this.parentNode = null;
    /**
     * The first direct child node of this node, or null if this node has no child nodes. @type Node
     */
    this.firstChild = null;
    /**
     * The last direct child node of this node, or null if this node has no child nodes. @type Node
     */
    this.lastChild = null;
    /**
     * The node immediately preceding this node in the tree, or null if there is no sibling node. @type Node
     */
    this.previousSibling = null;
    /**
     * The node immediately following this node in the tree, or null if there is no sibling node. @type Node
     */
    this.nextSibling = null;

    this.addEvents({
       /**
        * @event append
        * Fires when a new child node is appended
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The newly appended node
        * @param {Number} index The index of the newly appended node
        */
       "append" : true,
       /**
        * @event remove
        * Fires when a child node is removed
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The removed node
        */
       "remove" : true,
       /**
        * @event move
        * Fires when this node is moved to a new location in the tree
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} oldParent The old parent of this node
        * @param {Node} newParent The new parent of this node
        * @param {Number} index The index it was moved to
        */
       "move" : true,
       /**
        * @event insert
        * Fires when a new child node is inserted.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node inserted
        * @param {Node} refNode The child node the node was inserted before
        */
       "insert" : true,
       /**
        * @event beforeappend
        * Fires before a new child is appended, return false to cancel the append.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be appended
        */
       "beforeappend" : true,
       /**
        * @event beforeremove
        * Fires before a child is removed, return false to cancel the remove.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be removed
        */
       "beforeremove" : true,
       /**
        * @event beforemove
        * Fires before this node is moved to a new location in the tree. Return false to cancel the move.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} oldParent The parent of this node
        * @param {Node} newParent The new parent this node is moving to
        * @param {Number} index The index it is being moved to
        */
       "beforemove" : true,
       /**
        * @event beforeinsert
        * Fires before a new child is inserted, return false to cancel the insert.
        * @param {Tree} tree The owner tree
        * @param {Node} this This node
        * @param {Node} node The child node to be inserted
        * @param {Node} refNode The child node the node is being inserted before
        */
       "beforeinsert" : true
   });
    this.listeners = this.attributes.listeners;
    Roo.data.Node.superclass.constructor.call(this);
};

Roo.extend(Roo.data.Node, Roo.util.Observable, {
    fireEvent : function(evtName){
        // first do standard event for this node
        if(Roo.data.Node.superclass.fireEvent.apply(this, arguments) === false){
            return false;
        }
        // then bubble it up to the tree if the event wasn't cancelled
        var ot = this.getOwnerTree();
        if(ot){
            if(ot.proxyNodeEvent.apply(ot, arguments) === false){
                return false;
            }
        }
        return true;
    },

    /**
     * Returns true if this node is a leaf
     * @return {Boolean}
     */
    isLeaf : function(){
        return this.leaf === true;
    },

    // private
    setFirstChild : function(node){
        this.firstChild = node;
    },

    //private
    setLastChild : function(node){
        this.lastChild = node;
    },


    /**
     * Returns true if this node is the last child of its parent
     * @return {Boolean}
     */
    isLast : function(){
       return (!this.parentNode ? true : this.parentNode.lastChild == this);
    },

    /**
     * Returns true if this node is the first child of its parent
     * @return {Boolean}
     */
    isFirst : function(){
       return (!this.parentNode ? true : this.parentNode.firstChild == this);
    },

    hasChildNodes : function(){
        return !this.isLeaf() && this.childNodes.length > 0;
    },

    /**
     * Insert node(s) as the last child node of this node.
     * @param {Node/Array} node The node or Array of nodes to append
     * @return {Node} The appended node if single append, or null if an array was passed
     */
    appendChild : function(node){
        var multi = false;
        if(node instanceof Array){
            multi = node;
        }else if(arguments.length > 1){
            multi = arguments;
        }
        // if passed an array or multiple args do them one by one
        if(multi){
            for(var i = 0, len = multi.length; i < len; i++) {
            	this.appendChild(multi[i]);
            }
        }else{
            if(this.fireEvent("beforeappend", this.ownerTree, this, node) === false){
                return false;
            }
            var index = this.childNodes.length;
            var oldParent = node.parentNode;
            // it's a move, make sure we move it cleanly
            if(oldParent){
                if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index) === false){
                    return false;
                }
                oldParent.removeChild(node);
            }
            index = this.childNodes.length;
            if(index == 0){
                this.setFirstChild(node);
            }
            this.childNodes.push(node);
            node.parentNode = this;
            var ps = this.childNodes[index-1];
            if(ps){
                node.previousSibling = ps;
                ps.nextSibling = node;
            }else{
                node.previousSibling = null;
            }
            node.nextSibling = null;
            this.setLastChild(node);
            node.setOwnerTree(this.getOwnerTree());
            this.fireEvent("append", this.ownerTree, this, node, index);
            if(oldParent){
                node.fireEvent("move", this.ownerTree, node, oldParent, this, index);
            }
            return node;
        }
    },

    /**
     * Removes a child node from this node.
     * @param {Node} node The node to remove
     * @return {Node} The removed node
     */
    removeChild : function(node){
        var index = this.childNodes.indexOf(node);
        if(index == -1){
            return false;
        }
        if(this.fireEvent("beforeremove", this.ownerTree, this, node) === false){
            return false;
        }

        // remove it from childNodes collection
        this.childNodes.splice(index, 1);

        // update siblings
        if(node.previousSibling){
            node.previousSibling.nextSibling = node.nextSibling;
        }
        if(node.nextSibling){
            node.nextSibling.previousSibling = node.previousSibling;
        }

        // update child refs
        if(this.firstChild == node){
            this.setFirstChild(node.nextSibling);
        }
        if(this.lastChild == node){
            this.setLastChild(node.previousSibling);
        }

        node.setOwnerTree(null);
        // clear any references from the node
        node.parentNode = null;
        node.previousSibling = null;
        node.nextSibling = null;
        this.fireEvent("remove", this.ownerTree, this, node);
        return node;
    },

    /**
     * Inserts the first node before the second node in this nodes childNodes collection.
     * @param {Node} node The node to insert
     * @param {Node} refNode The node to insert before (if null the node is appended)
     * @return {Node} The inserted node
     */
    insertBefore : function(node, refNode){
        if(!refNode){ // like standard Dom, refNode can be null for append
            return this.appendChild(node);
        }
        // nothing to do
        if(node == refNode){
            return false;
        }

        if(this.fireEvent("beforeinsert", this.ownerTree, this, node, refNode) === false){
            return false;
        }
        var index = this.childNodes.indexOf(refNode);
        var oldParent = node.parentNode;
        var refIndex = index;

        // when moving internally, indexes will change after remove
        if(oldParent == this && this.childNodes.indexOf(node) < index){
            refIndex--;
        }

        // it's a move, make sure we move it cleanly
        if(oldParent){
            if(node.fireEvent("beforemove", node.getOwnerTree(), node, oldParent, this, index, refNode) === false){
                return false;
            }
            oldParent.removeChild(node);
        }
        if(refIndex == 0){
            this.setFirstChild(node);
        }
        this.childNodes.splice(refIndex, 0, node);
        node.parentNode = this;
        var ps = this.childNodes[refIndex-1];
        if(ps){
            node.previousSibling = ps;
            ps.nextSibling = node;
        }else{
            node.previousSibling = null;
        }
        node.nextSibling = refNode;
        refNode.previousSibling = node;
        node.setOwnerTree(this.getOwnerTree());
        this.fireEvent("insert", this.ownerTree, this, node, refNode);
        if(oldParent){
            node.fireEvent("move", this.ownerTree, node, oldParent, this, refIndex, refNode);
        }
        return node;
    },

    /**
     * Returns the child node at the specified index.
     * @param {Number} index
     * @return {Node}
     */
    item : function(index){
        return this.childNodes[index];
    },

    /**
     * Replaces one child node in this node with another.
     * @param {Node} newChild The replacement node
     * @param {Node} oldChild The node to replace
     * @return {Node} The replaced node
     */
    replaceChild : function(newChild, oldChild){
        this.insertBefore(newChild, oldChild);
        this.removeChild(oldChild);
        return oldChild;
    },

    /**
     * Returns the index of a child node
     * @param {Node} node
     * @return {Number} The index of the node or -1 if it was not found
     */
    indexOf : function(child){
        return this.childNodes.indexOf(child);
    },

    /**
     * Returns the tree this node is in.
     * @return {Tree}
     */
    getOwnerTree : function(){
        // if it doesn't have one, look for one
        if(!this.ownerTree){
            var p = this;
            while(p){
                if(p.ownerTree){
                    this.ownerTree = p.ownerTree;
                    break;
                }
                p = p.parentNode;
            }
        }
        return this.ownerTree;
    },

    /**
     * Returns depth of this node (the root node has a depth of 0)
     * @return {Number}
     */
    getDepth : function(){
        var depth = 0;
        var p = this;
        while(p.parentNode){
            ++depth;
            p = p.parentNode;
        }
        return depth;
    },

    // private
    setOwnerTree : function(tree){
        // if it's move, we need to update everyone
        if(tree != this.ownerTree){
            if(this.ownerTree){
                this.ownerTree.unregisterNode(this);
            }
            this.ownerTree = tree;
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].setOwnerTree(tree);
            }
            if(tree){
                tree.registerNode(this);
            }
        }
    },

    /**
     * Returns the path for this node. The path can be used to expand or select this node programmatically.
     * @param {String} attr (optional) The attr to use for the path (defaults to the node's id)
     * @return {String} The path
     */
    getPath : function(attr){
        attr = attr || "id";
        var p = this.parentNode;
        var b = [this.attributes[attr]];
        while(p){
            b.unshift(p.attributes[attr]);
            p = p.parentNode;
        }
        var sep = this.getOwnerTree().pathSeparator;
        return sep + b.join(sep);
    },

    /**
     * Bubbles up the tree from this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the bubble is stopped.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
    bubble : function(fn, scope, args){
        var p = this;
        while(p){
            if(fn.call(scope || p, args || p) === false){
                break;
            }
            p = p.parentNode;
        }
    },

    /**
     * Cascades down the tree from this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the cascade is stopped on that branch.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
    cascade : function(fn, scope, args){
        if(fn.call(scope || this, args || this) !== false){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].cascade(fn, scope, args);
            }
        }
    },

    /**
     * Interates the child nodes of this node, calling the specified function with each node. The scope (<i>this</i>) of
     * function call will be the scope provided or the current node. The arguments to the function
     * will be the args provided or the current node. If the function returns false at any point,
     * the iteration stops.
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function (defaults to current node)
     * @param {Array} args (optional) The args to call the function with (default to passing the current node)
     */
    eachChild : function(fn, scope, args){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.call(scope || this, args || cs[i]) === false){
        	    break;
        	}
        }
    },

    /**
     * Finds the first child that has the attribute with the specified value.
     * @param {String} attribute The attribute name
     * @param {Mixed} value The value to search for
     * @return {Node} The found child or null if none was found
     */
    findChild : function(attribute, value){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(cs[i].attributes[attribute] == value){
        	    return cs[i];
        	}
        }
        return null;
    },

    /**
     * Finds the first child by a custom function. The child matches if the function passed
     * returns true.
     * @param {Function} fn
     * @param {Object} scope (optional)
     * @return {Node} The found child or null if none was found
     */
    findChildBy : function(fn, scope){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	if(fn.call(scope||cs[i], cs[i]) === true){
        	    return cs[i];
        	}
        }
        return null;
    },

    /**
     * Sorts this nodes children using the supplied sort function
     * @param {Function} fn
     * @param {Object} scope (optional)
     */
    sort : function(fn, scope){
        var cs = this.childNodes;
        var len = cs.length;
        if(len > 0){
            var sortFn = scope ? function(){fn.apply(scope, arguments);} : fn;
            cs.sort(sortFn);
            for(var i = 0; i < len; i++){
                var n = cs[i];
                n.previousSibling = cs[i-1];
                n.nextSibling = cs[i+1];
                if(i == 0){
                    this.setFirstChild(n);
                }
                if(i == len-1){
                    this.setLastChild(n);
                }
            }
        }
    },

    /**
     * Returns true if this node is an ancestor (at any point) of the passed node.
     * @param {Node} node
     * @return {Boolean}
     */
    contains : function(node){
        return node.isAncestor(this);
    },

    /**
     * Returns true if the passed node is an ancestor (at any point) of this node.
     * @param {Node} node
     * @return {Boolean}
     */
    isAncestor : function(node){
        var p = this.parentNode;
        while(p){
            if(p == node){
                return true;
            }
            p = p.parentNode;
        }
        return false;
    },

    toString : function(){
        return "[Node"+(this.id?" "+this.id:"")+"]";
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 

/**
 * @class Roo.ComponentMgr
 * Provides a common registry of all components on a page so that they can be easily accessed by component id (see {@link Roo.getCmp}).
 * @singleton
 */
Roo.ComponentMgr = function(){
    var all = new Roo.util.MixedCollection();

    return {
        /**
         * Registers a component.
         * @param {Roo.Component} c The component
         */
        register : function(c){
            all.add(c);
        },

        /**
         * Unregisters a component.
         * @param {Roo.Component} c The component
         */
        unregister : function(c){
            all.remove(c);
        },

        /**
         * Returns a component by id
         * @param {String} id The component id
         */
        get : function(id){
            return all.get(id);
        },

        /**
         * Registers a function that will be called when a specified component is added to ComponentMgr
         * @param {String} id The component id
         * @param {Funtction} fn The callback function
         * @param {Object} scope The scope of the callback
         */
        onAvailable : function(id, fn, scope){
            all.on("add", function(index, o){
                if(o.id == id){
                    fn.call(scope || o, o);
                    all.un("add", fn, scope);
                }
            });
        }
    };
}();/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 
/**
 * @class Roo.Component
 * @extends Roo.util.Observable
 * Base class for all major Roo components.  All subclasses of Component can automatically participate in the standard
 * Roo component lifecycle of creation, rendering and destruction.  They also have automatic support for basic hide/show
 * and enable/disable behavior.  Component allows any subclass to be lazy-rendered into any {@link Roo.Container} and
 * to be automatically registered with the {@link Roo.ComponentMgr} so that it can be referenced at any time via {@link Roo.getCmp}.
 * All visual components (widgets) that require rendering into a layout should subclass Component.
 * @constructor
 * @param {Roo.Element/String/Object} config The configuration options.  If an element is passed, it is set as the internal
 * element and its id used as the component id.  If a string is passed, it is assumed to be the id of an existing element
 * and is used as the component id.  Otherwise, it is assumed to be a standard config object and is applied to the component.
 */
Roo.Component = function(config){
    config = config || {};
    if(config.tagName || config.dom || typeof config == "string"){ // element object
        config = {el: config, id: config.id || config};
    }
    this.initialConfig = config;

    Roo.apply(this, config);
    this.addEvents({
        /**
         * @event disable
         * Fires after the component is disabled.
	     * @param {Roo.Component} this
	     */
        disable : true,
        /**
         * @event enable
         * Fires after the component is enabled.
	     * @param {Roo.Component} this
	     */
        enable : true,
        /**
         * @event beforeshow
         * Fires before the component is shown.  Return false to stop the show.
	     * @param {Roo.Component} this
	     */
        beforeshow : true,
        /**
         * @event show
         * Fires after the component is shown.
	     * @param {Roo.Component} this
	     */
        show : true,
        /**
         * @event beforehide
         * Fires before the component is hidden. Return false to stop the hide.
	     * @param {Roo.Component} this
	     */
        beforehide : true,
        /**
         * @event hide
         * Fires after the component is hidden.
	     * @param {Roo.Component} this
	     */
        hide : true,
        /**
         * @event beforerender
         * Fires before the component is rendered. Return false to stop the render.
	     * @param {Roo.Component} this
	     */
        beforerender : true,
        /**
         * @event render
         * Fires after the component is rendered.
	     * @param {Roo.Component} this
	     */
        render : true,
        /**
         * @event beforedestroy
         * Fires before the component is destroyed. Return false to stop the destroy.
	     * @param {Roo.Component} this
	     */
        beforedestroy : true,
        /**
         * @event destroy
         * Fires after the component is destroyed.
	     * @param {Roo.Component} this
	     */
        destroy : true
    });
    if(!this.id){
        this.id = "ext-comp-" + (++Roo.Component.AUTO_ID);
    }
    Roo.ComponentMgr.register(this);
    Roo.Component.superclass.constructor.call(this);
    this.initComponent();
    if(this.renderTo){ // not supported by all components yet. use at your own risk!
        this.render(this.renderTo);
        delete this.renderTo;
    }
};

// private
Roo.Component.AUTO_ID = 1000;

Roo.extend(Roo.Component, Roo.util.Observable, {
    /**
     * @property {Boolean} hidden
     * true if this component is hidden. Read-only.
     */
    hidden : false,
    /**
     * true if this component is disabled. Read-only.
     */
    disabled : false,
    /**
     * true if this component has been rendered. Read-only.
     */
    rendered : false,
    
    /** @cfg {String} disableClass
     * CSS class added to the component when it is disabled (defaults to "x-item-disabled").
     */
    disabledClass : "x-item-disabled",
	/** @cfg {Boolean} allowDomMove
	 * Whether the component can move the Dom node when rendering (defaults to true).
	 */
    allowDomMove : true,
    /** @cfg {String} hideMode
     * How this component should hidden. Supported values are
     * "visibility" (css visibility), "offsets" (negative offset position) and
     * "display" (css display) - defaults to "display".
     */
    hideMode: 'display',

    // private
    ctype : "Roo.Component",

    /** @cfg {String} actionMode 
     * which property holds the element that used for  hide() / show() / disable() / enable()
     * default is 'el' 
     */
    actionMode : "el",

    // private
    getActionEl : function(){
        return this[this.actionMode];
    },

    initComponent : Roo.emptyFn,
    /**
     * If this is a lazy rendering component, render it to its container element.
     * @param {String/HTMLElement/Element} container (optional) The element this component should be rendered into. If it is being applied to existing markup, this should be left off.
     */
    render : function(container, position){
        if(!this.rendered && this.fireEvent("beforerender", this) !== false){
            if(!container && this.el){
                this.el = Roo.get(this.el);
                container = this.el.dom.parentNode;
                this.allowDomMove = false;
            }
            this.container = Roo.get(container);
            this.rendered = true;
            if(position !== undefined){
                if(typeof position == 'number'){
                    position = this.container.dom.childNodes[position];
                }else{
                    position = Roo.getDom(position);
                }
            }
            this.onRender(this.container, position || null);
            if(this.cls){
                this.el.addClass(this.cls);
                delete this.cls;
            }
            if(this.style){
                this.el.applyStyles(this.style);
                delete this.style;
            }
            this.fireEvent("render", this);
            this.afterRender(this.container);
            if(this.hidden){
                this.hide();
            }
            if(this.disabled){
                this.disable();
            }
        }
        return this;
    },

    // private
    // default function is not really useful
    onRender : function(ct, position){
        if(this.el){
            this.el = Roo.get(this.el);
            if(this.allowDomMove !== false){
                ct.dom.insertBefore(this.el.dom, position);
            }
        }
    },

    // private
    getAutoCreate : function(){
        var cfg = typeof this.autoCreate == "object" ?
                      this.autoCreate : Roo.apply({}, this.defaultAutoCreate);
        if(this.id && !cfg.id){
            cfg.id = this.id;
        }
        return cfg;
    },

    // private
    afterRender : Roo.emptyFn,

    /**
     * Destroys this component by purging any event listeners, removing the component's element from the DOM,
     * removing the component from its {@link Roo.Container} (if applicable) and unregistering it from {@link Roo.ComponentMgr}.
     */
    destroy : function(){
        if(this.fireEvent("beforedestroy", this) !== false){
            this.purgeListeners();
            this.beforeDestroy();
            if(this.rendered){
                this.el.removeAllListeners();
                this.el.remove();
                if(this.actionMode == "container"){
                    this.container.remove();
                }
            }
            this.onDestroy();
            Roo.ComponentMgr.unregister(this);
            this.fireEvent("destroy", this);
        }
    },

	// private
    beforeDestroy : function(){

    },

	// private
	onDestroy : function(){

    },

    /**
     * Returns the underlying {@link Roo.Element}.
     * @return {Roo.Element} The element
     */
    getEl : function(){
        return this.el;
    },

    /**
     * Returns the id of this component.
     * @return {String}
     */
    getId : function(){
        return this.id;
    },

    /**
     * Try to focus this component.
     * @param {Boolean} selectText True to also select the text in this component (if applicable)
     * @return {Roo.Component} this
     */
    focus : function(selectText){
        if(this.rendered){
            this.el.focus();
            if(selectText === true){
                this.el.dom.select();
            }
        }
        return this;
    },

    // private
    blur : function(){
        if(this.rendered){
            this.el.blur();
        }
        return this;
    },

    /**
     * Disable this component.
     * @return {Roo.Component} this
     */
    disable : function(){
        if(this.rendered){
            this.onDisable();
        }
        this.disabled = true;
        this.fireEvent("disable", this);
        return this;
    },

	// private
    onDisable : function(){
        this.getActionEl().addClass(this.disabledClass);
        this.el.dom.disabled = true;
    },

    /**
     * Enable this component.
     * @return {Roo.Component} this
     */
    enable : function(){
        if(this.rendered){
            this.onEnable();
        }
        this.disabled = false;
        this.fireEvent("enable", this);
        return this;
    },

	// private
    onEnable : function(){
        this.getActionEl().removeClass(this.disabledClass);
        this.el.dom.disabled = false;
    },

    /**
     * Convenience function for setting disabled/enabled by boolean.
     * @param {Boolean} disabled
     */
    setDisabled : function(disabled){
        this[disabled ? "disable" : "enable"]();
    },

    /**
     * Show this component.
     * @return {Roo.Component} this
     */
    show: function(){
        if(this.fireEvent("beforeshow", this) !== false){
            this.hidden = false;
            if(this.rendered){
                this.onShow();
            }
            this.fireEvent("show", this);
        }
        return this;
    },

    // private
    onShow : function(){
        var ae = this.getActionEl();
        if(this.hideMode == 'visibility'){
            ae.dom.style.visibility = "visible";
        }else if(this.hideMode == 'offsets'){
            ae.removeClass('x-hidden');
        }else{
            ae.dom.style.display = "";
        }
    },

    /**
     * Hide this component.
     * @return {Roo.Component} this
     */
    hide: function(){
        if(this.fireEvent("beforehide", this) !== false){
            this.hidden = true;
            if(this.rendered){
                this.onHide();
            }
            this.fireEvent("hide", this);
        }
        return this;
    },

    // private
    onHide : function(){
        var ae = this.getActionEl();
        if(this.hideMode == 'visibility'){
            ae.dom.style.visibility = "hidden";
        }else if(this.hideMode == 'offsets'){
            ae.addClass('x-hidden');
        }else{
            ae.dom.style.display = "none";
        }
    },

    /**
     * Convenience function to hide or show this component by boolean.
     * @param {Boolean} visible True to show, false to hide
     * @return {Roo.Component} this
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
        return this;
    },

    /**
     * Returns true if this component is visible.
     */
    isVisible : function(){
        return this.getActionEl().isVisible();
    },

    cloneConfig : function(overrides){
        overrides = overrides || {};
        var id = overrides.id || Roo.id();
        var cfg = Roo.applyIf(overrides, this.initialConfig);
        cfg.id = id; // prevent dup id
        return new this.constructor(cfg);
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 (function(){ 
/**
 * @class Roo.Layer
 * @extends Roo.Element
 * An extended {@link Roo.Element} object that supports a shadow and shim, constrain to viewport and
 * automatic maintaining of shadow/shim positions.
 * @cfg {Boolean} shim False to disable the iframe shim in browsers which need one (defaults to true)
 * @cfg {String/Boolean} shadow True to create a shadow element with default class "x-layer-shadow", or
 * you can pass a string with a CSS class name. False turns off the shadow.
 * @cfg {Object} dh DomHelper object config to create element with (defaults to {tag: "div", cls: "x-layer"}).
 * @cfg {Boolean} constrain False to disable constrain to viewport (defaults to true)
 * @cfg {String} cls CSS class to add to the element
 * @cfg {Number} zindex Starting z-index (defaults to 11000)
 * @cfg {Number} shadowOffset Number of pixels to offset the shadow (defaults to 3)
 * @constructor
 * @param {Object} config An object with config options.
 * @param {String/HTMLElement} existingEl (optional) Uses an existing DOM element. If the element is not found it creates it.
 */

Roo.Layer = function(config, existingEl){
    config = config || {};
    var dh = Roo.DomHelper;
    var cp = config.parentEl, pel = cp ? Roo.getDom(cp) : document.body;
    if(existingEl){
        this.dom = Roo.getDom(existingEl);
    }
    if(!this.dom){
        var o = config.dh || {tag: "div", cls: "x-layer"};
        this.dom = dh.append(pel, o);
    }
    if(config.cls){
        this.addClass(config.cls);
    }
    this.constrain = config.constrain !== false;
    this.visibilityMode = Roo.Element.VISIBILITY;
    if(config.id){
        this.id = this.dom.id = config.id;
    }else{
        this.id = Roo.id(this.dom);
    }
    this.zindex = config.zindex || this.getZIndex();
    this.position("absolute", this.zindex);
    if(config.shadow){
        this.shadowOffset = config.shadowOffset || 4;
        this.shadow = new Roo.Shadow({
            offset : this.shadowOffset,
            mode : config.shadow
        });
    }else{
        this.shadowOffset = 0;
    }
    this.useShim = config.shim !== false && Roo.useShims;
    this.useDisplay = config.useDisplay;
    this.hide();
};

var supr = Roo.Element.prototype;

// shims are shared among layer to keep from having 100 iframes
var shims = [];

Roo.extend(Roo.Layer, Roo.Element, {

    getZIndex : function(){
        return this.zindex || parseInt(this.getStyle("z-index"), 10) || 11000;
    },

    getShim : function(){
        if(!this.useShim){
            return null;
        }
        if(this.shim){
            return this.shim;
        }
        var shim = shims.shift();
        if(!shim){
            shim = this.createShim();
            shim.enableDisplayMode('block');
            shim.dom.style.display = 'none';
            shim.dom.style.visibility = 'visible';
        }
        var pn = this.dom.parentNode;
        if(shim.dom.parentNode != pn){
            pn.insertBefore(shim.dom, this.dom);
        }
        shim.setStyle('z-index', this.getZIndex()-2);
        this.shim = shim;
        return shim;
    },

    hideShim : function(){
        if(this.shim){
            this.shim.setDisplayed(false);
            shims.push(this.shim);
            delete this.shim;
        }
    },

    disableShadow : function(){
        if(this.shadow){
            this.shadowDisabled = true;
            this.shadow.hide();
            this.lastShadowOffset = this.shadowOffset;
            this.shadowOffset = 0;
        }
    },

    enableShadow : function(show){
        if(this.shadow){
            this.shadowDisabled = false;
            this.shadowOffset = this.lastShadowOffset;
            delete this.lastShadowOffset;
            if(show){
                this.sync(true);
            }
        }
    },

    // private
    // this code can execute repeatedly in milliseconds (i.e. during a drag) so
    // code size was sacrificed for effeciency (e.g. no getBox/setBox, no XY calls)
    sync : function(doShow){
        var sw = this.shadow;
        if(!this.updating && this.isVisible() && (sw || this.useShim)){
            var sh = this.getShim();

            var w = this.getWidth(),
                h = this.getHeight();

            var l = this.getLeft(true),
                t = this.getTop(true);

            if(sw && !this.shadowDisabled){
                if(doShow && !sw.isVisible()){
                    sw.show(this);
                }else{
                    sw.realign(l, t, w, h);
                }
                if(sh){
                    if(doShow){
                       sh.show();
                    }
                    // fit the shim behind the shadow, so it is shimmed too
                    var a = sw.adjusts, s = sh.dom.style;
                    s.left = (Math.min(l, l+a.l))+"px";
                    s.top = (Math.min(t, t+a.t))+"px";
                    s.width = (w+a.w)+"px";
                    s.height = (h+a.h)+"px";
                }
            }else if(sh){
                if(doShow){
                   sh.show();
                }
                sh.setSize(w, h);
                sh.setLeftTop(l, t);
            }
            
        }
    },

    // private
    destroy : function(){
        this.hideShim();
        if(this.shadow){
            this.shadow.hide();
        }
        this.removeAllListeners();
        var pn = this.dom.parentNode;
        if(pn){
            pn.removeChild(this.dom);
        }
        Roo.Element.uncache(this.id);
    },

    remove : function(){
        this.destroy();
    },

    // private
    beginUpdate : function(){
        this.updating = true;
    },

    // private
    endUpdate : function(){
        this.updating = false;
        this.sync(true);
    },

    // private
    hideUnders : function(negOffset){
        if(this.shadow){
            this.shadow.hide();
        }
        this.hideShim();
    },

    // private
    constrainXY : function(){
        if(this.constrain){
            var vw = Roo.lib.Dom.getViewWidth(),
                vh = Roo.lib.Dom.getViewHeight();
            var s = Roo.get(document).getScroll();

            var xy = this.getXY();
            var x = xy[0], y = xy[1];   
            var w = this.dom.offsetWidth+this.shadowOffset, h = this.dom.offsetHeight+this.shadowOffset;
            // only move it if it needs it
            var moved = false;
            // first validate right/bottom
            if((x + w) > vw+s.left){
                x = vw - w - this.shadowOffset;
                moved = true;
            }
            if((y + h) > vh+s.top){
                y = vh - h - this.shadowOffset;
                moved = true;
            }
            // then make sure top/left isn't negative
            if(x < s.left){
                x = s.left;
                moved = true;
            }
            if(y < s.top){
                y = s.top;
                moved = true;
            }
            if(moved){
                if(this.avoidY){
                    var ay = this.avoidY;
                    if(y <= ay && (y+h) >= ay){
                        y = ay-h-5;   
                    }
                }
                xy = [x, y];
                this.storeXY(xy);
                supr.setXY.call(this, xy);
                this.sync();
            }
        }
    },

    isVisible : function(){
        return this.visible;    
    },

    // private
    showAction : function(){
        this.visible = true; // track visibility to prevent getStyle calls
        if(this.useDisplay === true){
            this.setDisplayed("");
        }else if(this.lastXY){
            supr.setXY.call(this, this.lastXY);
        }else if(this.lastLT){
            supr.setLeftTop.call(this, this.lastLT[0], this.lastLT[1]);
        }
    },

    // private
    hideAction : function(){
        this.visible = false;
        if(this.useDisplay === true){
            this.setDisplayed(false);
        }else{
            this.setLeftTop(-10000,-10000);
        }
    },

    // overridden Element method
    setVisible : function(v, a, d, c, e){
        if(v){
            this.showAction();
        }
        if(a && v){
            var cb = function(){
                this.sync(true);
                if(c){
                    c();
                }
            }.createDelegate(this);
            supr.setVisible.call(this, true, true, d, cb, e);
        }else{
            if(!v){
                this.hideUnders(true);
            }
            var cb = c;
            if(a){
                cb = function(){
                    this.hideAction();
                    if(c){
                        c();
                    }
                }.createDelegate(this);
            }
            supr.setVisible.call(this, v, a, d, cb, e);
            if(v){
                this.sync(true);
            }else if(!a){
                this.hideAction();
            }
        }
    },

    storeXY : function(xy){
        delete this.lastLT;
        this.lastXY = xy;
    },

    storeLeftTop : function(left, top){
        delete this.lastXY;
        this.lastLT = [left, top];
    },

    // private
    beforeFx : function(){
        this.beforeAction();
        return Roo.Layer.superclass.beforeFx.apply(this, arguments);
    },

    // private
    afterFx : function(){
        Roo.Layer.superclass.afterFx.apply(this, arguments);
        this.sync(this.isVisible());
    },

    // private
    beforeAction : function(){
        if(!this.updating && this.shadow){
            this.shadow.hide();
        }
    },

    // overridden Element method
    setLeft : function(left){
        this.storeLeftTop(left, this.getTop(true));
        supr.setLeft.apply(this, arguments);
        this.sync();
    },

    setTop : function(top){
        this.storeLeftTop(this.getLeft(true), top);
        supr.setTop.apply(this, arguments);
        this.sync();
    },

    setLeftTop : function(left, top){
        this.storeLeftTop(left, top);
        supr.setLeftTop.apply(this, arguments);
        this.sync();
    },

    setXY : function(xy, a, d, c, e){
        this.fixDisplay();
        this.beforeAction();
        this.storeXY(xy);
        var cb = this.createCB(c);
        supr.setXY.call(this, xy, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    // private
    createCB : function(c){
        var el = this;
        return function(){
            el.constrainXY();
            el.sync(true);
            if(c){
                c();
            }
        };
    },

    // overridden Element method
    setX : function(x, a, d, c, e){
        this.setXY([x, this.getY()], a, d, c, e);
    },

    // overridden Element method
    setY : function(y, a, d, c, e){
        this.setXY([this.getX(), y], a, d, c, e);
    },

    // overridden Element method
    setSize : function(w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setSize.call(this, w, h, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    // overridden Element method
    setWidth : function(w, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setWidth.call(this, w, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    // overridden Element method
    setHeight : function(h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        supr.setHeight.call(this, h, a, d, cb, e);
        if(!a){
            cb();
        }
    },

    // overridden Element method
    setBounds : function(x, y, w, h, a, d, c, e){
        this.beforeAction();
        var cb = this.createCB(c);
        if(!a){
            this.storeXY([x, y]);
            supr.setXY.call(this, [x, y]);
            supr.setSize.call(this, w, h, a, d, cb, e);
            cb();
        }else{
            supr.setBounds.call(this, x, y, w, h, a, d, cb, e);
        }
        return this;
    },
    
    /**
     * Sets the z-index of this layer and adjusts any shadow and shim z-indexes. The layer z-index is automatically
     * incremented by two more than the value passed in so that it always shows above any shadow or shim (the shadow
     * element, if any, will be assigned z-index + 1, and the shim element, if any, will be assigned the unmodified z-index).
     * @param {Number} zindex The new z-index to set
     * @return {this} The Layer
     */
    setZIndex : function(zindex){
        this.zindex = zindex;
        this.setStyle("z-index", zindex + 2);
        if(this.shadow){
            this.shadow.setZIndex(zindex + 1);
        }
        if(this.shim){
            this.shim.setStyle("z-index", zindex);
        }
    }
});
})();/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.Shadow
 * Simple class that can provide a shadow effect for any element.  Note that the element MUST be absolutely positioned,
 * and the shadow does not provide any shimming.  This should be used only in simple cases -- for more advanced
 * functionality that can also provide the same shadow effect, see the {@link Roo.Layer} class.
 * @constructor
 * Create a new Shadow
 * @param {Object} config The config object
 */
Roo.Shadow = function(config){
    Roo.apply(this, config);
    if(typeof this.mode != "string"){
        this.mode = this.defaultMode;
    }
    var o = this.offset, a = {h: 0};
    var rad = Math.floor(this.offset/2);
    switch(this.mode.toLowerCase()){ // all this hideous nonsense calculates the various offsets for shadows
        case "drop":
            a.w = 0;
            a.l = a.t = o;
            a.t -= 1;
            if(Roo.isIE){
                a.l -= this.offset + rad;
                a.t -= this.offset + rad;
                a.w -= rad;
                a.h -= rad;
                a.t += 1;
            }
        break;
        case "sides":
            a.w = (o*2);
            a.l = -o;
            a.t = o-1;
            if(Roo.isIE){
                a.l -= (this.offset - rad);
                a.t -= this.offset + rad;
                a.l += 1;
                a.w -= (this.offset - rad)*2;
                a.w -= rad + 1;
                a.h -= 1;
            }
        break;
        case "frame":
            a.w = a.h = (o*2);
            a.l = a.t = -o;
            a.t += 1;
            a.h -= 2;
            if(Roo.isIE){
                a.l -= (this.offset - rad);
                a.t -= (this.offset - rad);
                a.l += 1;
                a.w -= (this.offset + rad + 1);
                a.h -= (this.offset + rad);
                a.h += 1;
            }
        break;
    };

    this.adjusts = a;
};

Roo.Shadow.prototype = {
    /**
     * @cfg {String} mode
     * The shadow display mode.  Supports the following options:<br />
     * sides: Shadow displays on both sides and bottom only<br />
     * frame: Shadow displays equally on all four sides<br />
     * drop: Traditional bottom-right drop shadow (default)
     */
    /**
     * @cfg {String} offset
     * The number of pixels to offset the shadow from the element (defaults to 4)
     */
    offset: 4,

    // private
    defaultMode: "drop",

    /**
     * Displays the shadow under the target element
     * @param {String/HTMLElement/Element} targetEl The id or element under which the shadow should display
     */
    show : function(target){
        target = Roo.get(target);
        if(!this.el){
            this.el = Roo.Shadow.Pool.pull();
            if(this.el.dom.nextSibling != target.dom){
                this.el.insertBefore(target);
            }
        }
        this.el.setStyle("z-index", this.zIndex || parseInt(target.getStyle("z-index"), 10)-1);
        if(Roo.isIE){
            this.el.dom.style.filter="progid:DXImageTransform.Microsoft.alpha(opacity=50) progid:DXImageTransform.Microsoft.Blur(pixelradius="+(this.offset)+")";
        }
        this.realign(
            target.getLeft(true),
            target.getTop(true),
            target.getWidth(),
            target.getHeight()
        );
        this.el.dom.style.display = "block";
    },

    /**
     * Returns true if the shadow is visible, else false
     */
    isVisible : function(){
        return this.el ? true : false;  
    },

    /**
     * Direct alignment when values are already available. Show must be called at least once before
     * calling this method to ensure it is initialized.
     * @param {Number} left The target element left position
     * @param {Number} top The target element top position
     * @param {Number} width The target element width
     * @param {Number} height The target element height
     */
    realign : function(l, t, w, h){
        if(!this.el){
            return;
        }
        var a = this.adjusts, d = this.el.dom, s = d.style;
        var iea = 0;
        s.left = (l+a.l)+"px";
        s.top = (t+a.t)+"px";
        var sw = (w+a.w), sh = (h+a.h), sws = sw +"px", shs = sh + "px";
        if(s.width != sws || s.height != shs){
            s.width = sws;
            s.height = shs;
            if(!Roo.isIE){
                var cn = d.childNodes;
                var sww = Math.max(0, (sw-12))+"px";
                cn[0].childNodes[1].style.width = sww;
                cn[1].childNodes[1].style.width = sww;
                cn[2].childNodes[1].style.width = sww;
                cn[1].style.height = Math.max(0, (sh-12))+"px";
            }
        }
    },

    /**
     * Hides this shadow
     */
    hide : function(){
        if(this.el){
            this.el.dom.style.display = "none";
            Roo.Shadow.Pool.push(this.el);
            delete this.el;
        }
    },

    /**
     * Adjust the z-index of this shadow
     * @param {Number} zindex The new z-index
     */
    setZIndex : function(z){
        this.zIndex = z;
        if(this.el){
            this.el.setStyle("z-index", z);
        }
    }
};

// Private utility class that manages the internal Shadow cache
Roo.Shadow.Pool = function(){
    var p = [];
    var markup = Roo.isIE ?
                 '<div class="x-ie-shadow"></div>' :
                 '<div class="x-shadow"><div class="xst"><div class="xstl"></div><div class="xstc"></div><div class="xstr"></div></div><div class="xsc"><div class="xsml"></div><div class="xsmc"></div><div class="xsmr"></div></div><div class="xsb"><div class="xsbl"></div><div class="xsbc"></div><div class="xsbr"></div></div></div>';
    return {
        pull : function(){
            var sh = p.shift();
            if(!sh){
                sh = Roo.get(Roo.DomHelper.insertHtml("beforeBegin", document.body.firstChild, markup));
                sh.autoBoxAdjust = false;
            }
            return sh;
        },

        push : function(sh){
            p.push(sh);
        }
    };
}();/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.BoxComponent
 * @extends Roo.Component
 * Base class for any visual {@link Roo.Component} that uses a box container.  BoxComponent provides automatic box
 * model adjustments for sizing and positioning and will work correctly withnin the Component rendering model.  All
 * container classes should subclass BoxComponent so that they will work consistently when nested within other Ext
 * layout containers.
 * @constructor
 * @param {Roo.Element/String/Object} config The configuration options.
 */
Roo.BoxComponent = function(config){
    Roo.Component.call(this, config);
    this.addEvents({
        /**
         * @event resize
         * Fires after the component is resized.
	     * @param {Roo.Component} this
	     * @param {Number} adjWidth The box-adjusted width that was set
	     * @param {Number} adjHeight The box-adjusted height that was set
	     * @param {Number} rawWidth The width that was originally specified
	     * @param {Number} rawHeight The height that was originally specified
	     */
        resize : true,
        /**
         * @event move
         * Fires after the component is moved.
	     * @param {Roo.Component} this
	     * @param {Number} x The new x position
	     * @param {Number} y The new y position
	     */
        move : true
    });
};

Roo.extend(Roo.BoxComponent, Roo.Component, {
    // private, set in afterRender to signify that the component has been rendered
    boxReady : false,
    // private, used to defer height settings to subclasses
    deferHeight: false,
    /** @cfg {Number} width
     * width (optional) size of component
     */
     /** @cfg {Number} height
     * height (optional) size of component
     */
     
    /**
     * Sets the width and height of the component.  This method fires the resize event.  This method can accept
     * either width and height as separate numeric arguments, or you can pass a size object like {width:10, height:20}.
     * @param {Number/Object} width The new width to set, or a size object in the format {width, height}
     * @param {Number} height The new height to set (not required if a size object is passed as the first arg)
     * @return {Roo.BoxComponent} this
     */
    setSize : function(w, h){
        // support for standard size objects
        if(typeof w == 'object'){
            h = w.height;
            w = w.width;
        }
        // not rendered
        if(!this.boxReady){
            this.width = w;
            this.height = h;
            return this;
        }

        // prevent recalcs when not needed
        if(this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return this;
        }
        this.lastSize = {width: w, height: h};

        var adj = this.adjustSize(w, h);
        var aw = adj.width, ah = adj.height;
        if(aw !== undefined || ah !== undefined){ // this code is nasty but performs better with floaters
            var rz = this.getResizeEl();
            if(!this.deferHeight && aw !== undefined && ah !== undefined){
                rz.setSize(aw, ah);
            }else if(!this.deferHeight && ah !== undefined){
                rz.setHeight(ah);
            }else if(aw !== undefined){
                rz.setWidth(aw);
            }
            this.onResize(aw, ah, w, h);
            this.fireEvent('resize', this, aw, ah, w, h);
        }
        return this;
    },

    /**
     * Gets the current size of the component's underlying element.
     * @return {Object} An object containing the element's size {width: (element width), height: (element height)}
     */
    getSize : function(){
        return this.el.getSize();
    },

    /**
     * Gets the current XY position of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @return {Array} The XY position of the element (e.g., [100, 200])
     */
    getPosition : function(local){
        if(local === true){
            return [this.el.getLeft(true), this.el.getTop(true)];
        }
        return this.xy || this.el.getXY();
    },

    /**
     * Gets the current box measurements of the component's underlying element.
     * @param {Boolean} local (optional) If true the element's left and top are returned instead of page XY (defaults to false)
     * @returns {Object} box An object in the format {x, y, width, height}
     */
    getBox : function(local){
        var s = this.el.getSize();
        if(local){
            s.x = this.el.getLeft(true);
            s.y = this.el.getTop(true);
        }else{
            var xy = this.xy || this.el.getXY();
            s.x = xy[0];
            s.y = xy[1];
        }
        return s;
    },

    /**
     * Sets the current box measurements of the component's underlying element.
     * @param {Object} box An object in the format {x, y, width, height}
     * @returns {Roo.BoxComponent} this
     */
    updateBox : function(box){
        this.setSize(box.width, box.height);
        this.setPagePosition(box.x, box.y);
        return this;
    },

    // protected
    getResizeEl : function(){
        return this.resizeEl || this.el;
    },

    // protected
    getPositionEl : function(){
        return this.positionEl || this.el;
    },

    /**
     * Sets the left and top of the component.  To set the page XY position instead, use {@link #setPagePosition}.
     * This method fires the move event.
     * @param {Number} left The new left
     * @param {Number} top The new top
     * @returns {Roo.BoxComponent} this
     */
    setPosition : function(x, y){
        this.x = x;
        this.y = y;
        if(!this.boxReady){
            return this;
        }
        var adj = this.adjustPosition(x, y);
        var ax = adj.x, ay = adj.y;

        var el = this.getPositionEl();
        if(ax !== undefined || ay !== undefined){
            if(ax !== undefined && ay !== undefined){
                el.setLeftTop(ax, ay);
            }else if(ax !== undefined){
                el.setLeft(ax);
            }else if(ay !== undefined){
                el.setTop(ay);
            }
            this.onPosition(ax, ay);
            this.fireEvent('move', this, ax, ay);
        }
        return this;
    },

    /**
     * Sets the page XY position of the component.  To set the left and top instead, use {@link #setPosition}.
     * This method fires the move event.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     * @returns {Roo.BoxComponent} this
     */
    setPagePosition : function(x, y){
        this.pageX = x;
        this.pageY = y;
        if(!this.boxReady){
            return;
        }
        if(x === undefined || y === undefined){ // cannot translate undefined points
            return;
        }
        var p = this.el.translatePoints(x, y);
        this.setPosition(p.left, p.top);
        return this;
    },

    // private
    onRender : function(ct, position){
        Roo.BoxComponent.superclass.onRender.call(this, ct, position);
        if(this.resizeEl){
            this.resizeEl = Roo.get(this.resizeEl);
        }
        if(this.positionEl){
            this.positionEl = Roo.get(this.positionEl);
        }
    },

    // private
    afterRender : function(){
        Roo.BoxComponent.superclass.afterRender.call(this);
        this.boxReady = true;
        this.setSize(this.width, this.height);
        if(this.x || this.y){
            this.setPosition(this.x, this.y);
        }
        if(this.pageX || this.pageY){
            this.setPagePosition(this.pageX, this.pageY);
        }
    },

    /**
     * Force the component's size to recalculate based on the underlying element's current height and width.
     * @returns {Roo.BoxComponent} this
     */
    syncSize : function(){
        delete this.lastSize;
        this.setSize(this.el.getWidth(), this.el.getHeight());
        return this;
    },

    /**
     * Called after the component is resized, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a resize occurs.
     * @param {Number} adjWidth The box-adjusted width that was set
     * @param {Number} adjHeight The box-adjusted height that was set
     * @param {Number} rawWidth The width that was originally specified
     * @param {Number} rawHeight The height that was originally specified
     */
    onResize : function(adjWidth, adjHeight, rawWidth, rawHeight){

    },

    /**
     * Called after the component is moved, this method is empty by default but can be implemented by any
     * subclass that needs to perform custom logic after a move occurs.
     * @param {Number} x The new x position
     * @param {Number} y The new y position
     */
    onPosition : function(x, y){

    },

    // private
    adjustSize : function(w, h){
        if(this.autoWidth){
            w = 'auto';
        }
        if(this.autoHeight){
            h = 'auto';
        }
        return {width : w, height: h};
    },

    // private
    adjustPosition : function(x, y){
        return {x : x, y: y};
    }
});/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */


/**
 * @class Roo.SplitBar
 * @extends Roo.util.Observable
 * Creates draggable splitter bar functionality from two elements (element to be dragged and element to be resized).
 * <br><br>
 * Usage:
 * <pre><code>
var split = new Roo.SplitBar("elementToDrag", "elementToSize",
                   Roo.SplitBar.HORIZONTAL, Roo.SplitBar.LEFT);
split.setAdapter(new Roo.SplitBar.AbsoluteLayoutAdapter("container"));
split.minSize = 100;
split.maxSize = 600;
split.animate = true;
split.on('moved', splitterMoved);
</code></pre>
 * @constructor
 * Create a new SplitBar
 * @param {String/HTMLElement/Roo.Element} dragElement The element to be dragged and act as the SplitBar. 
 * @param {String/HTMLElement/Roo.Element} resizingElement The element to be resized based on where the SplitBar element is dragged 
 * @param {Number} orientation (optional) Either Roo.SplitBar.HORIZONTAL or Roo.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
 * @param {Number} placement (optional) Either Roo.SplitBar.LEFT or Roo.SplitBar.RIGHT for horizontal or  
                        Roo.SplitBar.TOP or Roo.SplitBar.BOTTOM for vertical. (By default, this is determined automatically by the initial
                        position of the SplitBar).
 */
Roo.SplitBar = function(dragElement, resizingElement, orientation, placement, existingProxy){
    
    /** @private */
    this.el = Roo.get(dragElement, true);
    this.el.dom.unselectable = "on";
    /** @private */
    this.resizingEl = Roo.get(resizingElement, true);

    /**
     * @private
     * The orientation of the split. Either Roo.SplitBar.HORIZONTAL or Roo.SplitBar.VERTICAL. (Defaults to HORIZONTAL)
     * Note: If this is changed after creating the SplitBar, the placement property must be manually updated
     * @type Number
     */
    this.orientation = orientation || Roo.SplitBar.HORIZONTAL;
    
    /**
     * The minimum size of the resizing element. (Defaults to 0)
     * @type Number
     */
    this.minSize = 0;
    
    /**
     * The maximum size of the resizing element. (Defaults to 2000)
     * @type Number
     */
    this.maxSize = 2000;
    
    /**
     * Whether to animate the transition to the new size
     * @type Boolean
     */
    this.animate = false;
    
    /**
     * Whether to create a transparent shim that overlays the page when dragging, enables dragging across iframes.
     * @type Boolean
     */
    this.useShim = false;
    
    /** @private */
    this.shim = null;
    
    if(!existingProxy){
        /** @private */
        this.proxy = Roo.SplitBar.createProxy(this.orientation);
    }else{
        this.proxy = Roo.get(existingProxy).dom;
    }
    /** @private */
    this.dd = new Roo.dd.DDProxy(this.el.dom.id, "XSplitBars", {dragElId : this.proxy.id});
    
    /** @private */
    this.dd.b4StartDrag = this.onStartProxyDrag.createDelegate(this);
    
    /** @private */
    this.dd.endDrag = this.onEndProxyDrag.createDelegate(this);
    
    /** @private */
    this.dragSpecs = {};
    
    /**
     * @private The adapter to use to positon and resize elements
     */
    this.adapter = new Roo.SplitBar.BasicLayoutAdapter();
    this.adapter.init(this);
    
    if(this.orientation == Roo.SplitBar.HORIZONTAL){
        /** @private */
        this.placement = placement || (this.el.getX() > this.resizingEl.getX() ? Roo.SplitBar.LEFT : Roo.SplitBar.RIGHT);
        this.el.addClass("x-splitbar-h");
    }else{
        /** @private */
        this.placement = placement || (this.el.getY() > this.resizingEl.getY() ? Roo.SplitBar.TOP : Roo.SplitBar.BOTTOM);
        this.el.addClass("x-splitbar-v");
    }
    
    this.addEvents({
        /**
         * @event resize
         * Fires when the splitter is moved (alias for {@link #event-moved})
         * @param {Roo.SplitBar} this
         * @param {Number} newSize the new width or height
         */
        "resize" : true,
        /**
         * @event moved
         * Fires when the splitter is moved
         * @param {Roo.SplitBar} this
         * @param {Number} newSize the new width or height
         */
        "moved" : true,
        /**
         * @event beforeresize
         * Fires before the splitter is dragged
         * @param {Roo.SplitBar} this
         */
        "beforeresize" : true,

        "beforeapply" : true
    });

    Roo.util.Observable.call(this);
};

Roo.extend(Roo.SplitBar, Roo.util.Observable, {
    onStartProxyDrag : function(x, y){
        this.fireEvent("beforeresize", this);
        if(!this.overlay){
            var o = Roo.DomHelper.insertFirst(document.body,  {cls: "x-drag-overlay", html: "&#160;"}, true);
            o.unselectable();
            o.enableDisplayMode("block");
            // all splitbars share the same overlay
            Roo.SplitBar.prototype.overlay = o;
        }
        this.overlay.setSize(Roo.lib.Dom.getViewWidth(true), Roo.lib.Dom.getViewHeight(true));
        this.overlay.show();
        Roo.get(this.proxy).setDisplayed("block");
        var size = this.adapter.getElementSize(this);
        this.activeMinSize = this.getMinimumSize();;
        this.activeMaxSize = this.getMaximumSize();;
        var c1 = size - this.activeMinSize;
        var c2 = Math.max(this.activeMaxSize - size, 0);
        if(this.orientation == Roo.SplitBar.HORIZONTAL){
            this.dd.resetConstraints();
            this.dd.setXConstraint(
                this.placement == Roo.SplitBar.LEFT ? c1 : c2, 
                this.placement == Roo.SplitBar.LEFT ? c2 : c1
            );
            this.dd.setYConstraint(0, 0);
        }else{
            this.dd.resetConstraints();
            this.dd.setXConstraint(0, 0);
            this.dd.setYConstraint(
                this.placement == Roo.SplitBar.TOP ? c1 : c2, 
                this.placement == Roo.SplitBar.TOP ? c2 : c1
            );
         }
        this.dragSpecs.startSize = size;
        this.dragSpecs.startPoint = [x, y];
        Roo.dd.DDProxy.prototype.b4StartDrag.call(this.dd, x, y);
    },
    
    /** 
     * @private Called after the drag operation by the DDProxy
     */
    onEndProxyDrag : function(e){
        Roo.get(this.proxy).setDisplayed(false);
        var endPoint = Roo.lib.Event.getXY(e);
        if(this.overlay){
            this.overlay.hide();
        }
        var newSize;
        if(this.orientation == Roo.SplitBar.HORIZONTAL){
            newSize = this.dragSpecs.startSize + 
                (this.placement == Roo.SplitBar.LEFT ?
                    endPoint[0] - this.dragSpecs.startPoint[0] :
                    this.dragSpecs.startPoint[0] - endPoint[0]
                );
        }else{
            newSize = this.dragSpecs.startSize + 
                (this.placement == Roo.SplitBar.TOP ?
                    endPoint[1] - this.dragSpecs.startPoint[1] :
                    this.dragSpecs.startPoint[1] - endPoint[1]
                );
        }
        newSize = Math.min(Math.max(newSize, this.activeMinSize), this.activeMaxSize);
        if(newSize != this.dragSpecs.startSize){
            if(this.fireEvent('beforeapply', this, newSize) !== false){
                this.adapter.setElementSize(this, newSize);
                this.fireEvent("moved", this, newSize);
                this.fireEvent("resize", this, newSize);
            }
        }
    },
    
    /**
     * Get the adapter this SplitBar uses
     * @return The adapter object
     */
    getAdapter : function(){
        return this.adapter;
    },
    
    /**
     * Set the adapter this SplitBar uses
     * @param {Object} adapter A SplitBar adapter object
     */
    setAdapter : function(adapter){
        this.adapter = adapter;
        this.adapter.init(this);
    },
    
    /**
     * Gets the minimum size for the resizing element
     * @return {Number} The minimum size
     */
    getMinimumSize : function(){
        return this.minSize;
    },
    
    /**
     * Sets the minimum size for the resizing element
     * @param {Number} minSize The minimum size
     */
    setMinimumSize : function(minSize){
        this.minSize = minSize;
    },
    
    /**
     * Gets the maximum size for the resizing element
     * @return {Number} The maximum size
     */
    getMaximumSize : function(){
        return this.maxSize;
    },
    
    /**
     * Sets the maximum size for the resizing element
     * @param {Number} maxSize The maximum size
     */
    setMaximumSize : function(maxSize){
        this.maxSize = maxSize;
    },
    
    /**
     * Sets the initialize size for the resizing element
     * @param {Number} size The initial size
     */
    setCurrentSize : function(size){
        var oldAnimate = this.animate;
        this.animate = false;
        this.adapter.setElementSize(this, size);
        this.animate = oldAnimate;
    },
    
    /**
     * Destroy this splitbar. 
     * @param {Boolean} removeEl True to remove the element
     */
    destroy : function(removeEl){
        if(this.shim){
            this.shim.remove();
        }
        this.dd.unreg();
        this.proxy.parentNode.removeChild(this.proxy);
        if(removeEl){
            this.el.remove();
        }
    }
});

/**
 * @private static Create our own proxy element element. So it will be the same same size on all browsers, we won't use borders. Instead we use a background color.
 */
Roo.SplitBar.createProxy = function(dir){
    var proxy = new Roo.Element(document.createElement("div"));
    proxy.unselectable();
    var cls = 'x-splitbar-proxy';
    proxy.addClass(cls + ' ' + (dir == Roo.SplitBar.HORIZONTAL ? cls +'-h' : cls + '-v'));
    document.body.appendChild(proxy.dom);
    return proxy.dom;
};

/** 
 * @class Roo.SplitBar.BasicLayoutAdapter
 * Default Adapter. It assumes the splitter and resizing element are not positioned
 * elements and only gets/sets the width of the element. Generally used for table based layouts.
 */
Roo.SplitBar.BasicLayoutAdapter = function(){
};

Roo.SplitBar.BasicLayoutAdapter.prototype = {
    // do nothing for now
    init : function(s){
    
    },
    /**
     * Called before drag operations to get the current size of the resizing element. 
     * @param {Roo.SplitBar} s The SplitBar using this adapter
     */
     getElementSize : function(s){
        if(s.orientation == Roo.SplitBar.HORIZONTAL){
            return s.resizingEl.getWidth();
        }else{
            return s.resizingEl.getHeight();
        }
    },
    
    /**
     * Called after drag operations to set the size of the resizing element.
     * @param {Roo.SplitBar} s The SplitBar using this adapter
     * @param {Number} newSize The new size to set
     * @param {Function} onComplete A function to be invoked when resizing is complete
     */
    setElementSize : function(s, newSize, onComplete){
        if(s.orientation == Roo.SplitBar.HORIZONTAL){
            if(!s.animate){
                s.resizingEl.setWidth(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setWidth(newSize, true, .1, onComplete, 'easeOut');
            }
        }else{
            
            if(!s.animate){
                s.resizingEl.setHeight(newSize);
                if(onComplete){
                    onComplete(s, newSize);
                }
            }else{
                s.resizingEl.setHeight(newSize, true, .1, onComplete, 'easeOut');
            }
        }
    }
};

/** 
 *@class Roo.SplitBar.AbsoluteLayoutAdapter
 * @extends Roo.SplitBar.BasicLayoutAdapter
 * Adapter that  moves the splitter element to align with the resized sizing element. 
 * Used with an absolute positioned SplitBar.
 * @param {String/HTMLElement/Roo.Element} container The container that wraps around the absolute positioned content. If it's
 * document.body, make sure you assign an id to the body element.
 */
Roo.SplitBar.AbsoluteLayoutAdapter = function(container){
    this.basic = new Roo.SplitBar.BasicLayoutAdapter();
    this.container = Roo.get(container);
};

Roo.SplitBar.AbsoluteLayoutAdapter.prototype = {
    init : function(s){
        this.basic.init(s);
    },
    
    getElementSize : function(s){
        return this.basic.getElementSize(s);
    },
    
    setElementSize : function(s, newSize, onComplete){
        this.basic.setElementSize(s, newSize, this.moveSplitter.createDelegate(this, [s]));
    },
    
    moveSplitter : function(s){
        var yes = Roo.SplitBar;
        switch(s.placement){
            case yes.LEFT:
                s.el.setX(s.resizingEl.getRight());
                break;
            case yes.RIGHT:
                s.el.setStyle("right", (this.container.getWidth() - s.resizingEl.getLeft()) + "px");
                break;
            case yes.TOP:
                s.el.setY(s.resizingEl.getBottom());
                break;
            case yes.BOTTOM:
                s.el.setY(s.resizingEl.getTop() - s.el.getHeight());
                break;
        }
    }
};

/**
 * Orientation constant - Create a vertical SplitBar
 * @static
 * @type Number
 */
Roo.SplitBar.VERTICAL = 1;

/**
 * Orientation constant - Create a horizontal SplitBar
 * @static
 * @type Number
 */
Roo.SplitBar.HORIZONTAL = 2;

/**
 * Placement constant - The resizing element is to the left of the splitter element
 * @static
 * @type Number
 */
Roo.SplitBar.LEFT = 1;

/**
 * Placement constant - The resizing element is to the right of the splitter element
 * @static
 * @type Number
 */
Roo.SplitBar.RIGHT = 2;

/**
 * Placement constant - The resizing element is positioned above the splitter element
 * @static
 * @type Number
 */
Roo.SplitBar.TOP = 3;

/**
 * Placement constant - The resizing element is positioned under splitter element
 * @static
 * @type Number
 */
Roo.SplitBar.BOTTOM = 4;
/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */

/**
 * @class Roo.View
 * @extends Roo.util.Observable
 * Create a "View" for an element based on a data model or UpdateManager and the supplied DomHelper template. 
 * This class also supports single and multi selection modes. <br>
 * Create a data model bound view:
 <pre><code>
 var store = new Roo.data.Store(...);

 var view = new Roo.View({
    el : "my-element",
    tpl : '&lt;div id="{0}"&gt;{2} - {1}&lt;/div&gt;', // auto create template
 
    singleSelect: true,
    selectedClass: "ydataview-selected",
    store: store
 });

 // listen for node click?
 view.on("click", function(vw, index, node, e){
 alert('Node "' + node.id + '" at index: ' + index + " was clicked.");
 });

 // load XML data
 dataModel.load("foobar.xml");
 </code></pre>
 For an example of creating a JSON/UpdateManager view, see {@link Roo.JsonView}.
 * <br><br>
 * <b>Note: The root of your template must be a single node. Table/row implementations may work but are not supported due to
 * IE"s limited insertion support with tables and Opera"s faulty event bubbling.</b>
 * 
 * Note: old style constructor is still suported (container, template, config)
 * 
 * @constructor
 * Create a new View
 * @param {Object} config The config object
 * 
 */
Roo.View = function(config, depreciated_tpl, depreciated_config){
    
    if (typeof(depreciated_tpl) == 'undefined') {
        // new way.. - universal constructor.
        Roo.apply(this, config);
        this.el  = Roo.get(this.el);
    } else {
        // old format..
        this.el  = Roo.get(config);
        this.tpl = depreciated_tpl;
        Roo.apply(this, depreciated_config);
    }
     
    
    if(typeof(this.tpl) == "string"){
        this.tpl = new Roo.Template(this.tpl);
    } else {
        // support xtype ctors..
        this.tpl = new Roo.factory(this.tpl, Roo);
    }
    
    
    this.tpl.compile();
   

     
    /** @private */
    this.addEvents({
    /**
     * @event beforeclick
     * Fires before a click is processed. Returns false to cancel the default action.
     * @param {Roo.View} this
     * @param {Number} index The index of the target node
     * @param {HTMLElement} node The target node
     * @param {Roo.EventObject} e The raw event object
     */
        "beforeclick" : true,
    /**
     * @event click
     * Fires when a template node is clicked.
     * @param {Roo.View} this
     * @param {Number} index The index of the target node
     * @param {HTMLElement} node The target node
     * @param {Roo.EventObject} e The raw event object
     */
        "click" : true,
    /**
     * @event dblclick
     * Fires when a template node is double clicked.
     * @param {Roo.View} this
     * @param {Number} index The index of the target node
     * @param {HTMLElement} node The target node
     * @param {Roo.EventObject} e The raw event object
     */
        "dblclick" : true,
    /**
     * @event contextmenu
     * Fires when a template node is right clicked.
     * @param {Roo.View} this
     * @param {Number} index The index of the target node
     * @param {HTMLElement} node The target node
     * @param {Roo.EventObject} e The raw event object
     */
        "contextmenu" : true,
    /**
     * @event selectionchange
     * Fires when the selected nodes change.
     * @param {Roo.View} this
     * @param {Array} selections Array of the selected nodes
     */
        "selectionchange" : true,

    /**
     * @event beforeselect
     * Fires before a selection is made. If any handlers return false, the selection is cancelled.
     * @param {Roo.View} this
     * @param {HTMLElement} node The node to be selected
     * @param {Array} selections Array of currently selected nodes
     */
        "beforeselect" : true
    });

    this.el.on({
        "click": this.onClick,
        "dblclick": this.onDblClick,
        "contextmenu": this.onContextMenu,
        scope:this
    });

    this.selections = [];
    this.nodes = [];
    this.cmp = new Roo.CompositeElementLite([]);
    if(this.store){
        this.store = Roo.factory(this.store, Roo.data);
        this.setStore(this.store, true);
    }
    Roo.View.superclass.constructor.call(this);
};

Roo.extend(Roo.View, Roo.util.Observable, {
    
     /**
     * @cfg {Roo.data.Store} store Data store to load data from.
     */
    store : false,
    
    /**
     * @cfg {String|Roo.Element} el The container element.
     */
    el : '',
    
    /**
     * @cfg {String|Roo.Template} tpl The template used by this View 
     */
    tpl : false,
    
    /**
     * @cfg {String} selectedClass The css class to add to selected nodes
     */
    selectedClass : "x-view-selected",
     /**
     * @cfg {String} emptyText The empty text to show when nothing is loaded.
     */
    emptyText : "",
    /**
     * @cfg {Boolean} multiSelect Allow multiple selection
     */
    
    multiSelect : false,
    /**
     * @cfg {Boolean} singleSelect Allow single selection
     */
    singleSelect:  false,
    
    /**
     * Returns the element this view is bound to.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.el;
    },

    /**
     * Refreshes the view.
     */
    refresh : function(){
        var t = this.tpl;
        this.clearSelections();
        this.el.update("");
        var html = [];
        var records = this.store.getRange();
        if(records.length < 1){
            this.el.update(this.emptyText);
            return;
        }
        for(var i = 0, len = records.length; i < len; i++){
            var data = this.prepareData(records[i].data, i, records[i]);
            html[html.length] = t.apply(data);
        }
        this.el.update(html.join(""));
        this.nodes = this.el.dom.childNodes;
        this.updateIndexes(0);
    },

    /**
     * Function to override to reformat the data that is sent to
     * the template for each node.
     * @param {Array/Object} data The raw data (array of colData for a data model bound view or
     * a JSON object for an UpdateManager bound view).
     */
    prepareData : function(data){
        return data;
    },

    onUpdate : function(ds, record){
        this.clearSelections();
        var index = this.store.indexOf(record);
        var n = this.nodes[index];
        this.tpl.insertBefore(n, this.prepareData(record.data));
        n.parentNode.removeChild(n);
        this.updateIndexes(index, index);
    },

    onAdd : function(ds, records, index){
        this.clearSelections();
        if(this.nodes.length == 0){
            this.refresh();
            return;
        }
        var n = this.nodes[index];
        for(var i = 0, len = records.length; i < len; i++){
            var d = this.prepareData(records[i].data);
            if(n){
                this.tpl.insertBefore(n, d);
            }else{
                this.tpl.append(this.el, d);
            }
        }
        this.updateIndexes(index);
    },

    onRemove : function(ds, record, index){
        this.clearSelections();
        this.el.dom.removeChild(this.nodes[index]);
        this.updateIndexes(index);
    },

    /**
     * Refresh an individual node.
     * @param {Number} index
     */
    refreshNode : function(index){
        this.onUpdate(this.store, this.store.getAt(index));
    },

    updateIndexes : function(startIndex, endIndex){
        var ns = this.nodes;
        startIndex = startIndex || 0;
        endIndex = endIndex || ns.length - 1;
        for(var i = startIndex; i <= endIndex; i++){
            ns[i].nodeIndex = i;
        }
    },

    /**
     * Changes the data store this view uses and refresh the view.
     * @param {Store} store
     */
    setStore : function(store, initial){
        if(!initial && this.store){
            this.store.un("datachanged", this.refresh);
            this.store.un("add", this.onAdd);
            this.store.un("remove", this.onRemove);
            this.store.un("update", this.onUpdate);
            this.store.un("clear", this.refresh);
        }
        if(store){
          
            store.on("datachanged", this.refresh, this);
            store.on("add", this.onAdd, this);
            store.on("remove", this.onRemove, this);
            store.on("update", this.onUpdate, this);
            store.on("clear", this.refresh, this);
        }
        
        if(store){
            this.refresh();
        }
    },

    /**
     * Returns the template node the passed child belongs to or null if it doesn't belong to one.
     * @param {HTMLElement} node
     * @return {HTMLElement} The template node
     */
    findItemFromChild : function(node){
        var el = this.el.dom;
        if(!node || node.parentNode == el){
		    return node;
	    }
	    var p = node.parentNode;
	    while(p && p != el){
            if(p.parentNode == el){
            	return p;
            }
            p = p.parentNode;
        }
	    return null;
    },

    /** @ignore */
    onClick : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            var index = this.indexOf(item);
            if(this.onItemClick(item, index, e) !== false){
                this.fireEvent("click", this, index, item, e);
            }
        }else{
            this.clearSelections();
        }
    },

    /** @ignore */
    onContextMenu : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            this.fireEvent("contextmenu", this, this.indexOf(item), item, e);
        }
    },

    /** @ignore */
    onDblClick : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            this.fireEvent("dblclick", this, this.indexOf(item), item, e);
        }
    },

    onItemClick : function(item, index, e){
        if(this.fireEvent("beforeclick", this, index, item, e) === false){
            return false;
        }
        if(this.multiSelect || this.singleSelect){
            if(this.multiSelect && e.shiftKey && this.lastSelection){
                this.select(this.getNodes(this.indexOf(this.lastSelection), index), false);
            }else{
                this.select(item, this.multiSelect && e.ctrlKey);
                this.lastSelection = item;
            }
            e.preventDefault();
        }
        return true;
    },

    /**
     * Get the number of selected nodes.
     * @return {Number}
     */
    getSelectionCount : function(){
        return this.selections.length;
    },

    /**
     * Get the currently selected nodes.
     * @return {Array} An array of HTMLElements
     */
    getSelectedNodes : function(){
        return this.selections;
    },

    /**
     * Get the indexes of the selected nodes.
     * @return {Array}
     */
    getSelectedIndexes : function(){
        var indexes = [], s = this.selections;
        for(var i = 0, len = s.length; i < len; i++){
            indexes.push(s[i].nodeIndex);
        }
        return indexes;
    },

    /**
     * Clear all selections
     * @param {Boolean} suppressEvent (optional) true to skip firing of the selectionchange event
     */
    clearSelections : function(suppressEvent){
        if(this.nodes && (this.multiSelect || this.singleSelect) && this.selections.length > 0){
            this.cmp.elements = this.selections;
            this.cmp.removeClass(this.selectedClass);
            this.selections = [];
            if(!suppressEvent){
                this.fireEvent("selectionchange", this, this.selections);
            }
        }
    },

    /**
     * Returns true if the passed node is selected
     * @param {HTMLElement/Number} node The node or node index
     * @return {Boolean}
     */
    isSelected : function(node){
        var s = this.selections;
        if(s.length < 1){
            return false;
        }
        node = this.getNode(node);
        return s.indexOf(node) !== -1;
    },

    /**
     * Selects nodes.
     * @param {Array/HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node, id of a template node or an array of any of those to select
     * @param {Boolean} keepExisting (optional) true to keep existing selections
     * @param {Boolean} suppressEvent (optional) true to skip firing of the selectionchange vent
     */
    select : function(nodeInfo, keepExisting, suppressEvent){
        if(nodeInfo instanceof Array){
            if(!keepExisting){
                this.clearSelections(true);
            }
            for(var i = 0, len = nodeInfo.length; i < len; i++){
                this.select(nodeInfo[i], true, true);
            }
        } else{
            var node = this.getNode(nodeInfo);
            if(node && !this.isSelected(node)){
                if(!keepExisting){
                    this.clearSelections(true);
                }
                if(this.fireEvent("beforeselect", this, node, this.selections) !== false){
                    Roo.fly(node).addClass(this.selectedClass);
                    this.selections.push(node);
                    if(!suppressEvent){
                        this.fireEvent("selectionchange", this, this.selections);
                    }
                }
            }
        }
    },

    /**
     * Gets a template node.
     * @param {HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node or the id of a template node
     * @return {HTMLElement} The node or null if it wasn't found
     */
    getNode : function(nodeInfo){
        if(typeof nodeInfo == "string"){
            return document.getElementById(nodeInfo);
        }else if(typeof nodeInfo == "number"){
            return this.nodes[nodeInfo];
        }
        return nodeInfo;
    },

    /**
     * Gets a range template nodes.
     * @param {Number} startIndex
     * @param {Number} endIndex
     * @return {Array} An array of nodes
     */
    getNodes : function(start, end){
        var ns = this.nodes;
        start = start || 0;
        end = typeof end == "undefined" ? ns.length - 1 : end;
        var nodes = [];
        if(start <= end){
            for(var i = start; i <= end; i++){
                nodes.push(ns[i]);
            }
        } else{
            for(var i = start; i >= end; i--){
                nodes.push(ns[i]);
            }
        }
        return nodes;
    },

    /**
     * Finds the index of the passed node
     * @param {HTMLElement/String/Number} nodeInfo An HTMLElement template node, index of a template node or the id of a template node
     * @return {Number} The index of the node or -1
     */
    indexOf : function(node){
        node = this.getNode(node);
        if(typeof node.nodeIndex == "number"){
            return node.nodeIndex;
        }
        var ns = this.nodes;
        for(var i = 0, len = ns.length; i < len; i++){
            if(ns[i] == node){
                return i;
            }
        }
        return -1;
    }
});
