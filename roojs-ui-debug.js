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

 var view = new Roo.View("my-element",
 '&lt;div id="{0}"&gt;{2} - {1}&lt;/div&gt;', // auto create template
 {
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
 * @constructor
 * Create a new View
 * @param {String/HTMLElement/Element} container The container element where the view is to be rendered.
 * @param {String/DomHelper.Template} tpl The rendering template or a string to create a template with
 * @param {Object} config The config object
 */
Roo.View = function(container, tpl, config){
    this.el = Roo.get(container);
    if(typeof tpl == "string"){
        tpl = new Roo.Template(tpl);
    }
    tpl.compile();
    /**
     * The template used by this View
     * @type {Roo.DomHelper.Template}
     */
    this.tpl = tpl;

    Roo.apply(this, config);

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
     * The css class to add to selected nodes
     * @type {Roo.DomHelper.Template}
     */
    selectedClass : "x-view-selected",
    
    emptyText : "",
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
 * @class Roo.JsonView
 * @extends Roo.View
 * Shortcut class to create a JSON + {@link Roo.UpdateManager} template view. Usage:
<pre><code>
var view = new Roo.JsonView("my-element",
    '&lt;div id="{id}"&gt;{foo} - {bar}&lt;/div&gt;', // auto create template
    { multiSelect: true, jsonRoot: "data" }
);

// listen for node click?
view.on("click", function(vw, index, node, e){
    alert('Node "' + node.id + '" at index: ' + index + " was clicked.");
});

// direct load of JSON data
view.load("foobar.php");

// Example from my blog list
var tpl = new Roo.Template(
    '&lt;div class="entry"&gt;' +
    '&lt;a class="entry-title" href="{link}"&gt;{title}&lt;/a&gt;' +
    "&lt;h4&gt;{date} by {author} | {comments} Comments&lt;/h4&gt;{description}" +
    "&lt;/div&gt;&lt;hr /&gt;"
);

var moreView = new Roo.JsonView("entry-list", tpl, {
    jsonRoot: "posts"
});
moreView.on("beforerender", this.sortEntries, this);
moreView.load({
    url: "/blog/get-posts.php",
    params: "allposts=true",
    text: "Loading Blog Entries..."
});
</code></pre>
 * @constructor
 * Create a new JsonView
 * @param {String/HTMLElement/Element} container The container element where the view is to be rendered.
 * @param {Template} tpl The rendering template
 * @param {Object} config The config object
 */
Roo.JsonView = function(container, tpl, config){
    Roo.JsonView.superclass.constructor.call(this, container, tpl, config);

    var um = this.el.getUpdateManager();
    um.setRenderer(this);
    um.on("update", this.onLoad, this);
    um.on("failure", this.onLoadException, this);

    /**
     * @event beforerender
     * Fires before rendering of the downloaded JSON data.
     * @param {Roo.JsonView} this
     * @param {Object} data The JSON data loaded
     */
    /**
     * @event load
     * Fires when data is loaded.
     * @param {Roo.JsonView} this
     * @param {Object} data The JSON data loaded
     * @param {Object} response The raw Connect response object
     */
    /**
     * @event loadexception
     * Fires when loading fails.
     * @param {Roo.JsonView} this
     * @param {Object} response The raw Connect response object
     */
    this.addEvents({
        'beforerender' : true,
        'load' : true,
        'loadexception' : true
    });
};
Roo.extend(Roo.JsonView, Roo.View, {
    /**
     * The root property in the loaded JSON object that contains the data
     * @type {String}
     */
    jsonRoot : "",

    /**
     * Refreshes the view.
     */
    refresh : function(){
        this.clearSelections();
        this.el.update("");
        var html = [];
        var o = this.jsonData;
        if(o && o.length > 0){
            for(var i = 0, len = o.length; i < len; i++){
                var data = this.prepareData(o[i], i, o);
                html[html.length] = this.tpl.apply(data);
            }
        }else{
            html.push(this.emptyText);
        }
        this.el.update(html.join(""));
        this.nodes = this.el.dom.childNodes;
        this.updateIndexes(0);
    },

    /**
     * Performs an async HTTP request, and loads the JSON from the response. If <i>params</i> are specified it uses POST, otherwise it uses GET.
     * @param {Object/String/Function} url The URL for this request, or a function to call to get the URL, or a config object containing any of the following options:
     <pre><code>
     view.load({
         url: "your-url.php",
         params: {param1: "foo", param2: "bar"}, // or a URL encoded string
         callback: yourFunction,
         scope: yourObject, //(optional scope)
         discardUrl: false,
         nocache: false,
         text: "Loading...",
         timeout: 30,
         scripts: false
     });
     </code></pre>
     * The only required property is <i>url</i>. The optional properties <i>nocache</i>, <i>text</i> and <i>scripts</i>
     * are respectively shorthand for <i>disableCaching</i>, <i>indicatorText</i>, and <i>loadScripts</i> and are used to set their associated property on this UpdateManager instance.
     * @param {String/Object} params (optional) The parameters to pass, as either a URL encoded string "param1=1&amp;param2=2" or an object {param1: 1, param2: 2}
     * @param {Function} callback (optional) Callback when transaction is complete - called with signature (oElement, bSuccess)
     * @param {Boolean} discardUrl (optional) By default when you execute an update the defaultUrl is changed to the last used URL. If true, it will not store the URL.
     */
    load : function(){
        var um = this.el.getUpdateManager();
        um.update.apply(um, arguments);
    },

    render : function(el, response){
        this.clearSelections();
        this.el.update("");
        var o;
        try{
            o = Roo.util.JSON.decode(response.responseText);
            if(this.jsonRoot){
                
                o = /** eval:var:o */ eval("o." + this.jsonRoot);
            }
        } catch(e){
        }
        /**
         * The current JSON data or null
         */
        this.jsonData = o;
        this.beforeRender();
        this.refresh();
    },

/**
 * Get the number of records in the current JSON dataset
 * @return {Number}
 */
    getCount : function(){
        return this.jsonData ? this.jsonData.length : 0;
    },

/**
 * Returns the JSON object for the specified node(s)
 * @param {HTMLElement/Array} node The node or an array of nodes
 * @return {Object/Array} If you pass in an array, you get an array back, otherwise
 * you get the JSON object for the node
 */
    getNodeData : function(node){
        if(node instanceof Array){
            var data = [];
            for(var i = 0, len = node.length; i < len; i++){
                data.push(this.getNodeData(node[i]));
            }
            return data;
        }
        return this.jsonData[this.indexOf(node)] || null;
    },

    beforeRender : function(){
        this.snapshot = this.jsonData;
        if(this.sortInfo){
            this.sort.apply(this, this.sortInfo);
        }
        this.fireEvent("beforerender", this, this.jsonData);
    },

    onLoad : function(el, o){
        this.fireEvent("load", this, this.jsonData, o);
    },

    onLoadException : function(el, o){
        this.fireEvent("loadexception", this, o);
    },

/**
 * Filter the data by a specific property.
 * @param {String} property A property on your JSON objects
 * @param {String/RegExp} value Either string that the property values
 * should start with, or a RegExp to test against the property
 */
    filter : function(property, value){
        if(this.jsonData){
            var data = [];
            var ss = this.snapshot;
            if(typeof value == "string"){
                var vlen = value.length;
                if(vlen == 0){
                    this.clearFilter();
                    return;
                }
                value = value.toLowerCase();
                for(var i = 0, len = ss.length; i < len; i++){
                    var o = ss[i];
                    if(o[property].substr(0, vlen).toLowerCase() == value){
                        data.push(o);
                    }
                }
            } else if(value.exec){ // regex?
                for(var i = 0, len = ss.length; i < len; i++){
                    var o = ss[i];
                    if(value.test(o[property])){
                        data.push(o);
                    }
                }
            } else{
                return;
            }
            this.jsonData = data;
            this.refresh();
        }
    },

/**
 * Filter by a function. The passed function will be called with each
 * object in the current dataset. If the function returns true the value is kept,
 * otherwise it is filtered.
 * @param {Function} fn
 * @param {Object} scope (optional) The scope of the function (defaults to this JsonView)
 */
    filterBy : function(fn, scope){
        if(this.jsonData){
            var data = [];
            var ss = this.snapshot;
            for(var i = 0, len = ss.length; i < len; i++){
                var o = ss[i];
                if(fn.call(scope || this, o)){
                    data.push(o);
                }
            }
            this.jsonData = data;
            this.refresh();
        }
    },

/**
 * Clears the current filter.
 */
    clearFilter : function(){
        if(this.snapshot && this.jsonData != this.snapshot){
            this.jsonData = this.snapshot;
            this.refresh();
        }
    },


/**
 * Sorts the data for this view and refreshes it.
 * @param {String} property A property on your JSON objects to sort on
 * @param {String} direction (optional) "desc" or "asc" (defaults to "asc")
 * @param {Function} sortType (optional) A function to call to convert the data to a sortable value.
 */
    sort : function(property, dir, sortType){
        this.sortInfo = Array.prototype.slice.call(arguments, 0);
        if(this.jsonData){
            var p = property;
            var dsc = dir && dir.toLowerCase() == "desc";
            var f = function(o1, o2){
                var v1 = sortType ? sortType(o1[p]) : o1[p];
                var v2 = sortType ? sortType(o2[p]) : o2[p];
                ;
                if(v1 < v2){
                    return dsc ? +1 : -1;
                } else if(v1 > v2){
                    return dsc ? -1 : +1;
                } else{
                    return 0;
                }
            };
            this.jsonData.sort(f);
            this.refresh();
            if(this.jsonData != this.snapshot){
                this.snapshot.sort(f);
            }
        }
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
 * @class Roo.ColorPalette
 * @extends Roo.Component
 * Simple color palette class for choosing colors.  The palette can be rendered to any container.<br />
 * Here's an example of typical usage:
 * <pre><code>
var cp = new Roo.ColorPalette({value:'993300'});  // initial selected color
cp.render('my-div');

cp.on('select', function(palette, selColor){
    // do something with selColor
});
</code></pre>
 * @constructor
 * Create a new ColorPalette
 * @param {Object} config The config object
 */
Roo.ColorPalette = function(config){
    Roo.ColorPalette.superclass.constructor.call(this, config);
    this.addEvents({
        /**
	     * @event select
	     * Fires when a color is selected
	     * @param {ColorPalette} this
	     * @param {String} color The 6-digit color hex code (without the # symbol)
	     */
        select: true
    });

    if(this.handler){
        this.on("select", this.handler, this.scope, true);
    }
};
Roo.extend(Roo.ColorPalette, Roo.Component, {
    /**
     * @cfg {String} itemCls
     * The CSS class to apply to the containing element (defaults to "x-color-palette")
     */
    itemCls : "x-color-palette",
    /**
     * @cfg {String} value
     * The initial color to highlight (should be a valid 6-digit color hex code without the # symbol).  Note that
     * the hex codes are case-sensitive.
     */
    value : null,
    clickEvent:'click',
    // private
    ctype: "Roo.ColorPalette",

    /**
     * @cfg {Boolean} allowReselect If set to true then reselecting a color that is already selected fires the selection event
     */
    allowReselect : false,

    /**
     * <p>An array of 6-digit color hex code strings (without the # symbol).  This array can contain any number
     * of colors, and each hex code should be unique.  The width of the palette is controlled via CSS by adjusting
     * the width property of the 'x-color-palette' class (or assigning a custom class), so you can balance the number
     * of colors with the width setting until the box is symmetrical.</p>
     * <p>You can override individual colors if needed:</p>
     * <pre><code>
var cp = new Roo.ColorPalette();
cp.colors[0] = "FF0000";  // change the first box to red
</code></pre>

Or you can provide a custom array of your own for complete control:
<pre><code>
var cp = new Roo.ColorPalette();
cp.colors = ["000000", "993300", "333300"];
</code></pre>
     * @type Array
     */
    colors : [
        "000000", "993300", "333300", "003300", "003366", "000080", "333399", "333333",
        "800000", "FF6600", "808000", "008000", "008080", "0000FF", "666699", "808080",
        "FF0000", "FF9900", "99CC00", "339966", "33CCCC", "3366FF", "800080", "969696",
        "FF00FF", "FFCC00", "FFFF00", "00FF00", "00FFFF", "00CCFF", "993366", "C0C0C0",
        "FF99CC", "FFCC99", "FFFF99", "CCFFCC", "CCFFFF", "99CCFF", "CC99FF", "FFFFFF"
    ],

    // private
    onRender : function(container, position){
        var t = new Roo.MasterTemplate(
            '<tpl><a href="#" class="color-{0}" hidefocus="on"><em><span style="background:#{0}" unselectable="on">&#160;</span></em></a></tpl>'
        );
        var c = this.colors;
        for(var i = 0, len = c.length; i < len; i++){
            t.add([c[i]]);
        }
        var el = document.createElement("div");
        el.className = this.itemCls;
        t.overwrite(el);
        container.dom.insertBefore(el, position);
        this.el = Roo.get(el);
        this.el.on(this.clickEvent, this.handleClick,  this, {delegate: "a"});
        if(this.clickEvent != 'click'){
            this.el.on('click', Roo.emptyFn,  this, {delegate: "a", preventDefault:true});
        }
    },

    // private
    afterRender : function(){
        Roo.ColorPalette.superclass.afterRender.call(this);
        if(this.value){
            var s = this.value;
            this.value = null;
            this.select(s);
        }
    },

    // private
    handleClick : function(e, t){
        e.preventDefault();
        if(!this.disabled){
            var c = t.className.match(/(?:^|\s)color-(.{6})(?:\s|$)/)[1];
            this.select(c.toUpperCase());
        }
    },

    /**
     * Selects the specified color in the palette (fires the select event)
     * @param {String} color A valid 6-digit color hex code (# will be stripped if included)
     */
    select : function(color){
        color = color.replace("#", "");
        if(color != this.value || this.allowReselect){
            var el = this.el;
            if(this.value){
                el.child("a.color-"+this.value).removeClass("x-color-palette-sel");
            }
            el.child("a.color-"+color).addClass("x-color-palette-sel");
            this.value = color;
            this.fireEvent("select", this, color);
        }
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
 * @class Roo.DatePicker
 * @extends Roo.Component
 * Simple date picker class.
 * @constructor
 * Create a new DatePicker
 * @param {Object} config The config object
 */
Roo.DatePicker = function(config){
    Roo.DatePicker.superclass.constructor.call(this, config);

    this.value = config && config.value ?
                 config.value.clearTime() : new Date().clearTime();

    this.addEvents({
        /**
	     * @event select
	     * Fires when a date is selected
	     * @param {DatePicker} this
	     * @param {Date} date The selected date
	     */
        select: true
    });

    if(this.handler){
        this.on("select", this.handler,  this.scope || this);
    }
    // build the disabledDatesRE
    if(!this.disabledDatesRE && this.disabledDates){
        var dd = this.disabledDates;
        var re = "(?:";
        for(var i = 0; i < dd.length; i++){
            re += dd[i];
            if(i != dd.length-1) re += "|";
        }
        this.disabledDatesRE = new RegExp(re + ")");
    }
};

Roo.extend(Roo.DatePicker, Roo.Component, {
    /**
     * @cfg {String} todayText
     * The text to display on the button that selects the current date (defaults to "Today")
     */
    todayText : "Today",
    /**
     * @cfg {String} okText
     * The text to display on the ok button
     */
    okText : "&#160;OK&#160;", // &#160; to give the user extra clicking room
    /**
     * @cfg {String} cancelText
     * The text to display on the cancel button
     */
    cancelText : "Cancel",
    /**
     * @cfg {String} todayTip
     * The tooltip to display for the button that selects the current date (defaults to "{current date} (Spacebar)")
     */
    todayTip : "{0} (Spacebar)",
    /**
     * @cfg {Date} minDate
     * Minimum allowable date (JavaScript date object, defaults to null)
     */
    minDate : null,
    /**
     * @cfg {Date} maxDate
     * Maximum allowable date (JavaScript date object, defaults to null)
     */
    maxDate : null,
    /**
     * @cfg {String} minText
     * The error text to display if the minDate validation fails (defaults to "This date is before the minimum date")
     */
    minText : "This date is before the minimum date",
    /**
     * @cfg {String} maxText
     * The error text to display if the maxDate validation fails (defaults to "This date is after the maximum date")
     */
    maxText : "This date is after the maximum date",
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'm/d/y').
     */
    format : "m/d/y",
    /**
     * @cfg {Array} disabledDays
     * An array of days to disable, 0-based. For example, [0, 6] disables Sunday and Saturday (defaults to null).
     */
    disabledDays : null,
    /**
     * @cfg {String} disabledDaysText
     * The tooltip to display when the date falls on a disabled day (defaults to "")
     */
    disabledDaysText : "",
    /**
     * @cfg {RegExp} disabledDatesRE
     * JavaScript regular expression used to disable a pattern of dates (defaults to null)
     */
    disabledDatesRE : null,
    /**
     * @cfg {String} disabledDatesText
     * The tooltip text to display when the date falls on a disabled date (defaults to "")
     */
    disabledDatesText : "",
    /**
     * @cfg {Boolean} constrainToViewport
     * True to constrain the date picker to the viewport (defaults to true)
     */
    constrainToViewport : true,
    /**
     * @cfg {Array} monthNames
     * An array of textual month names which can be overriden for localization support (defaults to Date.monthNames)
     */
    monthNames : Date.monthNames,
    /**
     * @cfg {Array} dayNames
     * An array of textual day names which can be overriden for localization support (defaults to Date.dayNames)
     */
    dayNames : Date.dayNames,
    /**
     * @cfg {String} nextText
     * The next month navigation button tooltip (defaults to 'Next Month (Control+Right)')
     */
    nextText: 'Next Month (Control+Right)',
    /**
     * @cfg {String} prevText
     * The previous month navigation button tooltip (defaults to 'Previous Month (Control+Left)')
     */
    prevText: 'Previous Month (Control+Left)',
    /**
     * @cfg {String} monthYearText
     * The header month selector tooltip (defaults to 'Choose a month (Control+Up/Down to move years)')
     */
    monthYearText: 'Choose a month (Control+Up/Down to move years)',
    /**
     * @cfg {Number} startDay
     * Day index at which the week should begin, 0-based (defaults to 0, which is Sunday)
     */
    startDay : 0,
    /**
     * @cfg {Bool} showClear
     * Show a clear button (usefull for date form elements that can be blank.)
     */
    
    showClear: false,
    
    /**
     * Sets the value of the date field
     * @param {Date} value The date to set
     */
    setValue : function(value){
        var old = this.value;
        this.value = value.clearTime(true);
        if(this.el){
            this.update(this.value);
        }
    },

    /**
     * Gets the current selected value of the date field
     * @return {Date} The selected date
     */
    getValue : function(){
        return this.value;
    },

    // private
    focus : function(){
        if(this.el){
            this.update(this.activeDate);
        }
    },

    // private
    onRender : function(container, position){
        var m = [
             '<table cellspacing="0">',
                '<tr><td class="x-date-left"><a href="#" title="', this.prevText ,'">&#160;</a></td><td class="x-date-middle" align="center"></td><td class="x-date-right"><a href="#" title="', this.nextText ,'">&#160;</a></td></tr>',
                '<tr><td colspan="3"><table class="x-date-inner" cellspacing="0"><thead><tr>'];
        var dn = this.dayNames;
        for(var i = 0; i < 7; i++){
            var d = this.startDay+i;
            if(d > 6){
                d = d-7;
            }
            m.push("<th><span>", dn[d].substr(0,1), "</span></th>");
        }
        m[m.length] = "</tr></thead><tbody><tr>";
        for(var i = 0; i < 42; i++) {
            if(i % 7 == 0 && i != 0){
                m[m.length] = "</tr><tr>";
            }
            m[m.length] = '<td><a href="#" hidefocus="on" class="x-date-date" tabIndex="1"><em><span></span></em></a></td>';
        }
        m[m.length] = '</tr></tbody></table></td></tr><tr>'+
            '<td colspan="3" class="x-date-bottom" align="center"></td></tr></table><div class="x-date-mp"></div>';

        var el = document.createElement("div");
        el.className = "x-date-picker";
        el.innerHTML = m.join("");

        container.dom.insertBefore(el, position);

        this.el = Roo.get(el);
        this.eventEl = Roo.get(el.firstChild);

        new Roo.util.ClickRepeater(this.el.child("td.x-date-left a"), {
            handler: this.showPrevMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        new Roo.util.ClickRepeater(this.el.child("td.x-date-right a"), {
            handler: this.showNextMonth,
            scope: this,
            preventDefault:true,
            stopDefault:true
        });

        this.eventEl.on("mousewheel", this.handleMouseWheel,  this);

        this.monthPicker = this.el.down('div.x-date-mp');
        this.monthPicker.enableDisplayMode('block');
        
        var kn = new Roo.KeyNav(this.eventEl, {
            "left" : function(e){
                e.ctrlKey ?
                    this.showPrevMonth() :
                    this.update(this.activeDate.add("d", -1));
            },

            "right" : function(e){
                e.ctrlKey ?
                    this.showNextMonth() :
                    this.update(this.activeDate.add("d", 1));
            },

            "up" : function(e){
                e.ctrlKey ?
                    this.showNextYear() :
                    this.update(this.activeDate.add("d", -7));
            },

            "down" : function(e){
                e.ctrlKey ?
                    this.showPrevYear() :
                    this.update(this.activeDate.add("d", 7));
            },

            "pageUp" : function(e){
                this.showNextMonth();
            },

            "pageDown" : function(e){
                this.showPrevMonth();
            },

            "enter" : function(e){
                e.stopPropagation();
                return true;
            },

            scope : this
        });

        this.eventEl.on("click", this.handleDateClick,  this, {delegate: "a.x-date-date"});

        this.eventEl.addKeyListener(Roo.EventObject.SPACE, this.selectToday,  this);

        this.el.unselectable();
        
        this.cells = this.el.select("table.x-date-inner tbody td");
        this.textNodes = this.el.query("table.x-date-inner tbody span");

        this.mbtn = new Roo.Button(this.el.child("td.x-date-middle", true), {
            text: "&#160;",
            tooltip: this.monthYearText
        });

        this.mbtn.on('click', this.showMonthPicker, this);
        this.mbtn.el.child(this.mbtn.menuClassTarget).addClass("x-btn-with-menu");


        var today = (new Date()).dateFormat(this.format);
        
        var baseTb = new Roo.Toolbar(this.el.child("td.x-date-bottom", true));
        baseTb.add({
            text: String.format(this.todayText, today),
            tooltip: String.format(this.todayTip, today),
            handler: this.selectToday,
            scope: this
        });
        
        //var todayBtn = new Roo.Button(this.el.child("td.x-date-bottom", true), {
            
        //});
        if (this.showClear) {
            
            baseTb.add( new Roo.Toolbar.Fill());
            baseTb.add({
                text: '&#160;',
                cls: 'x-btn-icon x-btn-clear',
                handler: function() {
                    //this.value = '';
                    this.fireEvent("select", this, '');
                },
                scope: this
            });
        }
        
        
        if(Roo.isIE){
            this.el.repaint();
        }
        this.update(this.value);
    },

    createMonthPicker : function(){
        if(!this.monthPicker.dom.firstChild){
            var buf = ['<table border="0" cellspacing="0">'];
            for(var i = 0; i < 6; i++){
                buf.push(
                    '<tr><td class="x-date-mp-month"><a href="#">', this.monthNames[i].substr(0, 3), '</a></td>',
                    '<td class="x-date-mp-month x-date-mp-sep"><a href="#">', this.monthNames[i+6].substr(0, 3), '</a></td>',
                    i == 0 ?
                    '<td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-prev"></a></td><td class="x-date-mp-ybtn" align="center"><a class="x-date-mp-next"></a></td></tr>' :
                    '<td class="x-date-mp-year"><a href="#"></a></td><td class="x-date-mp-year"><a href="#"></a></td></tr>'
                );
            }
            buf.push(
                '<tr class="x-date-mp-btns"><td colspan="4"><button type="button" class="x-date-mp-ok">',
                    this.okText,
                    '</button><button type="button" class="x-date-mp-cancel">',
                    this.cancelText,
                    '</button></td></tr>',
                '</table>'
            );
            this.monthPicker.update(buf.join(''));
            this.monthPicker.on('click', this.onMonthClick, this);
            this.monthPicker.on('dblclick', this.onMonthDblClick, this);

            this.mpMonths = this.monthPicker.select('td.x-date-mp-month');
            this.mpYears = this.monthPicker.select('td.x-date-mp-year');

            this.mpMonths.each(function(m, a, i){
                i += 1;
                if((i%2) == 0){
                    m.dom.xmonth = 5 + Math.round(i * .5);
                }else{
                    m.dom.xmonth = Math.round((i-1) * .5);
                }
            });
        }
    },

    showMonthPicker : function(){
        this.createMonthPicker();
        var size = this.el.getSize();
        this.monthPicker.setSize(size);
        this.monthPicker.child('table').setSize(size);

        this.mpSelMonth = (this.activeDate || this.value).getMonth();
        this.updateMPMonth(this.mpSelMonth);
        this.mpSelYear = (this.activeDate || this.value).getFullYear();
        this.updateMPYear(this.mpSelYear);

        this.monthPicker.slideIn('t', {duration:.2});
    },

    updateMPYear : function(y){
        this.mpyear = y;
        var ys = this.mpYears.elements;
        for(var i = 1; i <= 10; i++){
            var td = ys[i-1], y2;
            if((i%2) == 0){
                y2 = y + Math.round(i * .5);
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }else{
                y2 = y - (5-Math.round(i * .5));
                td.firstChild.innerHTML = y2;
                td.xyear = y2;
            }
            this.mpYears.item(i-1)[y2 == this.mpSelYear ? 'addClass' : 'removeClass']('x-date-mp-sel');
        }
    },

    updateMPMonth : function(sm){
        this.mpMonths.each(function(m, a, i){
            m[m.dom.xmonth == sm ? 'addClass' : 'removeClass']('x-date-mp-sel');
        });
    },

    selectMPMonth: function(m){
        
    },

    onMonthClick : function(e, t){
        e.stopEvent();
        var el = new Roo.Element(t), pn;
        if(el.is('button.x-date-mp-cancel')){
            this.hideMonthPicker();
        }
        else if(el.is('button.x-date-mp-ok')){
            this.update(new Date(this.mpSelYear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-month', 2)){
            this.mpMonths.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelMonth = pn.dom.xmonth;
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.mpYears.removeClass('x-date-mp-sel');
            pn.addClass('x-date-mp-sel');
            this.mpSelYear = pn.dom.xyear;
        }
        else if(el.is('a.x-date-mp-prev')){
            this.updateMPYear(this.mpyear-10);
        }
        else if(el.is('a.x-date-mp-next')){
            this.updateMPYear(this.mpyear+10);
        }
    },

    onMonthDblClick : function(e, t){
        e.stopEvent();
        var el = new Roo.Element(t), pn;
        if(pn = el.up('td.x-date-mp-month', 2)){
            this.update(new Date(this.mpSelYear, pn.dom.xmonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
        else if(pn = el.up('td.x-date-mp-year', 2)){
            this.update(new Date(pn.dom.xyear, this.mpSelMonth, (this.activeDate || this.value).getDate()));
            this.hideMonthPicker();
        }
    },

    hideMonthPicker : function(disableAnim){
        if(this.monthPicker){
            if(disableAnim === true){
                this.monthPicker.hide();
            }else{
                this.monthPicker.slideOut('t', {duration:.2});
            }
        }
    },

    // private
    showPrevMonth : function(e){
        this.update(this.activeDate.add("mo", -1));
    },

    // private
    showNextMonth : function(e){
        this.update(this.activeDate.add("mo", 1));
    },

    // private
    showPrevYear : function(){
        this.update(this.activeDate.add("y", -1));
    },

    // private
    showNextYear : function(){
        this.update(this.activeDate.add("y", 1));
    },

    // private
    handleMouseWheel : function(e){
        var delta = e.getWheelDelta();
        if(delta > 0){
            this.showPrevMonth();
            e.stopEvent();
        } else if(delta < 0){
            this.showNextMonth();
            e.stopEvent();
        }
    },

    // private
    handleDateClick : function(e, t){
        e.stopEvent();
        if(t.dateValue && !Roo.fly(t.parentNode).hasClass("x-date-disabled")){
            this.setValue(new Date(t.dateValue));
            this.fireEvent("select", this, this.value);
        }
    },

    // private
    selectToday : function(){
        this.setValue(new Date().clearTime());
        this.fireEvent("select", this, this.value);
    },

    // private
    update : function(date){
        var vd = this.activeDate;
        this.activeDate = date;
        if(vd && this.el){
            var t = date.getTime();
            if(vd.getMonth() == date.getMonth() && vd.getFullYear() == date.getFullYear()){
                this.cells.removeClass("x-date-selected");
                this.cells.each(function(c){
                   if(c.dom.firstChild.dateValue == t){
                       c.addClass("x-date-selected");
                       setTimeout(function(){
                            try{c.dom.firstChild.focus();}catch(e){}
                       }, 50);
                       return false;
                   }
                });
                return;
            }
        }
        var days = date.getDaysInMonth();
        var firstOfMonth = date.getFirstDateOfMonth();
        var startingPos = firstOfMonth.getDay()-this.startDay;

        if(startingPos <= this.startDay){
            startingPos += 7;
        }

        var pm = date.add("mo", -1);
        var prevStart = pm.getDaysInMonth()-startingPos;

        var cells = this.cells.elements;
        var textEls = this.textNodes;
        days += startingPos;

        // convert everything to numbers so it's fast
        var day = 86400000;
        var d = (new Date(pm.getFullYear(), pm.getMonth(), prevStart)).clearTime();
        var today = new Date().clearTime().getTime();
        var sel = date.clearTime().getTime();
        var min = this.minDate ? this.minDate.clearTime() : Number.NEGATIVE_INFINITY;
        var max = this.maxDate ? this.maxDate.clearTime() : Number.POSITIVE_INFINITY;
        var ddMatch = this.disabledDatesRE;
        var ddText = this.disabledDatesText;
        var ddays = this.disabledDays ? this.disabledDays.join("") : false;
        var ddaysText = this.disabledDaysText;
        var format = this.format;

        var setCellClass = function(cal, cell){
            cell.title = "";
            var t = d.getTime();
            cell.firstChild.dateValue = t;
            if(t == today){
                cell.className += " x-date-today";
                cell.title = cal.todayText;
            }
            if(t == sel){
                cell.className += " x-date-selected";
                setTimeout(function(){
                    try{cell.firstChild.focus();}catch(e){}
                }, 50);
            }
            // disabling
            if(t < min) {
                cell.className = " x-date-disabled";
                cell.title = cal.minText;
                return;
            }
            if(t > max) {
                cell.className = " x-date-disabled";
                cell.title = cal.maxText;
                return;
            }
            if(ddays){
                if(ddays.indexOf(d.getDay()) != -1){
                    cell.title = ddaysText;
                    cell.className = " x-date-disabled";
                }
            }
            if(ddMatch && format){
                var fvalue = d.dateFormat(format);
                if(ddMatch.test(fvalue)){
                    cell.title = ddText.replace("%0", fvalue);
                    cell.className = " x-date-disabled";
                }
            }
        };

        var i = 0;
        for(; i < startingPos; i++) {
            textEls[i].innerHTML = (++prevStart);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-prevday";
            setCellClass(this, cells[i]);
        }
        for(; i < days; i++){
            intDay = i - startingPos + 1;
            textEls[i].innerHTML = (intDay);
            d.setDate(d.getDate()+1);
            cells[i].className = "x-date-active";
            setCellClass(this, cells[i]);
        }
        var extraDays = 0;
        for(; i < 42; i++) {
             textEls[i].innerHTML = (++extraDays);
             d.setDate(d.getDate()+1);
             cells[i].className = "x-date-nextday";
             setCellClass(this, cells[i]);
        }

        this.mbtn.setText(this.monthNames[date.getMonth()] + " " + date.getFullYear());

        if(!this.internalRender){
            var main = this.el.dom.firstChild;
            var w = main.offsetWidth;
            this.el.setWidth(w + this.el.getBorderWidth("lr"));
            Roo.fly(main).setWidth(w);
            this.internalRender = true;
            // opera does not respect the auto grow header center column
            // then, after it gets a width opera refuses to recalculate
            // without a second pass
            if(Roo.isOpera && !this.secondPass){
                main.rows[0].cells[1].style.width = (w - (main.rows[0].cells[0].offsetWidth+main.rows[0].cells[2].offsetWidth)) + "px";
                this.secondPass = true;
                this.update.defer(10, this, [date]);
            }
        }
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
 * @class Roo.TabPanel
 * @extends Roo.util.Observable
 * A lightweight tab container.
 * <br><br>
 * Usage:
 * <pre><code>
// basic tabs 1, built from existing content
var tabs = new Roo.TabPanel("tabs1");
tabs.addTab("script", "View Script");
tabs.addTab("markup", "View Markup");
tabs.activate("script");

// more advanced tabs, built from javascript
var jtabs = new Roo.TabPanel("jtabs");
jtabs.addTab("jtabs-1", "Normal Tab", "My content was added during construction.");

// set up the UpdateManager
var tab2 = jtabs.addTab("jtabs-2", "Ajax Tab 1");
var updater = tab2.getUpdateManager();
updater.setDefaultUrl("ajax1.htm");
tab2.on('activate', updater.refresh, updater, true);

// Use setUrl for Ajax loading
var tab3 = jtabs.addTab("jtabs-3", "Ajax Tab 2");
tab3.setUrl("ajax2.htm", null, true);

// Disabled tab
var tab4 = jtabs.addTab("tabs1-5", "Disabled Tab", "Can't see me cause I'm disabled");
tab4.disable();

jtabs.activate("jtabs-1");
 * </code></pre>
 * @constructor
 * Create a new TabPanel.
 * @param {String/HTMLElement/Roo.Element} container The id, DOM element or Roo.Element container where this TabPanel is to be rendered.
 * @param {Object/Boolean} config Config object to set any properties for this TabPanel, or true to render the tabs on the bottom.
 */
Roo.TabPanel = function(container, config){
    /**
    * The container element for this TabPanel.
    * @type Roo.Element
    */
    this.el = Roo.get(container, true);
    if(config){
        if(typeof config == "boolean"){
            this.tabPosition = config ? "bottom" : "top";
        }else{
            Roo.apply(this, config);
        }
    }
    if(this.tabPosition == "bottom"){
        this.bodyEl = Roo.get(this.createBody(this.el.dom));
        this.el.addClass("x-tabs-bottom");
    }
    this.stripWrap = Roo.get(this.createStrip(this.el.dom), true);
    this.stripEl = Roo.get(this.createStripList(this.stripWrap.dom), true);
    this.stripBody = Roo.get(this.stripWrap.dom.firstChild.firstChild, true);
    if(Roo.isIE){
        Roo.fly(this.stripWrap.dom.firstChild).setStyle("overflow-x", "hidden");
    }
    if(this.tabPosition != "bottom"){
    /** The body element that contains {@link Roo.TabPanelItem} bodies.
     * @type Roo.Element
     */
      this.bodyEl = Roo.get(this.createBody(this.el.dom));
      this.el.addClass("x-tabs-top");
    }
    this.items = [];

    this.bodyEl.setStyle("position", "relative");

    this.active = null;
    this.activateDelegate = this.activate.createDelegate(this);

    this.addEvents({
        /**
         * @event tabchange
         * Fires when the active tab changes
         * @param {Roo.TabPanel} this
         * @param {Roo.TabPanelItem} activePanel The new active tab
         */
        "tabchange": true,
        /**
         * @event beforetabchange
         * Fires before the active tab changes, set cancel to true on the "e" parameter to cancel the change
         * @param {Roo.TabPanel} this
         * @param {Object} e Set cancel to true on this object to cancel the tab change
         * @param {Roo.TabPanelItem} tab The tab being changed to
         */
        "beforetabchange" : true
    });

    Roo.EventManager.onWindowResize(this.onResize, this);
    this.cpad = this.el.getPadding("lr");
    this.hiddenCount = 0;

    Roo.TabPanel.superclass.constructor.call(this);
};

Roo.extend(Roo.TabPanel, Roo.util.Observable, {
	/*
	 *@cfg {String} tabPosition "top" or "bottom" (defaults to "top")
	 */
    tabPosition : "top",
	/*
	 *@cfg {Number} currentTabWidth The width of the current tab (defaults to 0)
	 */
    currentTabWidth : 0,
	/*
	 *@cfg {Number} minTabWidth The minimum width of a tab (defaults to 40) (ignored if {@link #resizeTabs} is not true)
	 */
    minTabWidth : 40,
	/*
	 *@cfg {Number} maxTabWidth The maximum width of a tab (defaults to 250) (ignored if {@link #resizeTabs} is not true)
	 */
    maxTabWidth : 250,
	/*
	 *@cfg {Number} preferredTabWidth The preferred (default) width of a tab (defaults to 175) (ignored if {@link #resizeTabs} is not true)
	 */
    preferredTabWidth : 175,
	/*
	 *@cfg {Boolean} resizeTabs True to enable dynamic tab resizing (defaults to false)
	 */
    resizeTabs : false,
	/*
	 *@cfg {Boolean} monitorResize Set this to true to turn on window resize monitoring (ignored if {@link #resizeTabs} is not true) (defaults to true)
	 */
    monitorResize : true,

    /**
     * Creates a new {@link Roo.TabPanelItem} by looking for an existing element with the provided id -- if it's not found it creates one.
     * @param {String} id The id of the div to use <b>or create</b>
     * @param {String} text The text for the tab
     * @param {String} content (optional) Content to put in the TabPanelItem body
     * @param {Boolean} closable (optional) True to create a close icon on the tab
     * @return {Roo.TabPanelItem} The created TabPanelItem
     */
    addTab : function(id, text, content, closable){
        var item = new Roo.TabPanelItem(this, id, text, closable);
        this.addTabItem(item);
        if(content){
            item.setContent(content);
        }
        return item;
    },

    /**
     * Returns the {@link Roo.TabPanelItem} with the specified id/index
     * @param {String/Number} id The id or index of the TabPanelItem to fetch.
     * @return {Roo.TabPanelItem}
     */
    getTab : function(id){
        return this.items[id];
    },

    /**
     * Hides the {@link Roo.TabPanelItem} with the specified id/index
     * @param {String/Number} id The id or index of the TabPanelItem to hide.
     */
    hideTab : function(id){
        var t = this.items[id];
        if(!t.isHidden()){
           t.setHidden(true);
           this.hiddenCount++;
           this.autoSizeTabs();
        }
    },

    /**
     * "Unhides" the {@link Roo.TabPanelItem} with the specified id/index.
     * @param {String/Number} id The id or index of the TabPanelItem to unhide.
     */
    unhideTab : function(id){
        var t = this.items[id];
        if(t.isHidden()){
           t.setHidden(false);
           this.hiddenCount--;
           this.autoSizeTabs();
        }
    },

    /**
     * Adds an existing {@link Roo.TabPanelItem}.
     * @param {Roo.TabPanelItem} item The TabPanelItem to add
     */
    addTabItem : function(item){
        this.items[item.id] = item;
        this.items.push(item);
        if(this.resizeTabs){
           item.setWidth(this.currentTabWidth || this.preferredTabWidth);
           this.autoSizeTabs();
        }else{
            item.autoSize();
        }
    },

    /**
     * Removes a {@link Roo.TabPanelItem}.
     * @param {String/Number} id The id or index of the TabPanelItem to remove.
     */
    removeTab : function(id){
        var items = this.items;
        var tab = items[id];
        if(!tab) return;
        var index = items.indexOf(tab);
        if(this.active == tab && items.length > 1){
            var newTab = this.getNextAvailable(index);
            if(newTab)newTab.activate();
        }
        this.stripEl.dom.removeChild(tab.pnode.dom);
        if(tab.bodyEl.dom.parentNode == this.bodyEl.dom){ // if it was moved already prevent error
            this.bodyEl.dom.removeChild(tab.bodyEl.dom);
        }
        items.splice(index, 1);
        delete this.items[tab.id];
        tab.fireEvent("close", tab);
        tab.purgeListeners();
        this.autoSizeTabs();
    },

    getNextAvailable : function(start){
        var items = this.items;
        var index = start;
        // look for a next tab that will slide over to
        // replace the one being removed
        while(index < items.length){
            var item = items[++index];
            if(item && !item.isHidden()){
                return item;
            }
        }
        // if one isn't found select the previous tab (on the left)
        index = start;
        while(index >= 0){
            var item = items[--index];
            if(item && !item.isHidden()){
                return item;
            }
        }
        return null;
    },

    /**
     * Disables a {@link Roo.TabPanelItem}. It cannot be the active tab, if it is this call is ignored.
     * @param {String/Number} id The id or index of the TabPanelItem to disable.
     */
    disableTab : function(id){
        var tab = this.items[id];
        if(tab && this.active != tab){
            tab.disable();
        }
    },

    /**
     * Enables a {@link Roo.TabPanelItem} that is disabled.
     * @param {String/Number} id The id or index of the TabPanelItem to enable.
     */
    enableTab : function(id){
        var tab = this.items[id];
        tab.enable();
    },

    /**
     * Activates a {@link Roo.TabPanelItem}. The currently active one will be deactivated.
     * @param {String/Number} id The id or index of the TabPanelItem to activate.
     * @return {Roo.TabPanelItem} The TabPanelItem.
     */
    activate : function(id){
        var tab = this.items[id];
        if(!tab){
            return null;
        }
        if(tab == this.active || tab.disabled){
            return tab;
        }
        var e = {};
        this.fireEvent("beforetabchange", this, e, tab);
        if(e.cancel !== true && !tab.disabled){
            if(this.active){
                this.active.hide();
            }
            this.active = this.items[id];
            this.active.show();
            this.fireEvent("tabchange", this, this.active);
        }
        return tab;
    },

    /**
     * Gets the active {@link Roo.TabPanelItem}.
     * @return {Roo.TabPanelItem} The active TabPanelItem or null if none are active.
     */
    getActiveTab : function(){
        return this.active;
    },

    /**
     * Updates the tab body element to fit the height of the container element
     * for overflow scrolling
     * @param {Number} targetHeight (optional) Override the starting height from the elements height
     */
    syncHeight : function(targetHeight){
        var height = (targetHeight || this.el.getHeight())-this.el.getBorderWidth("tb")-this.el.getPadding("tb");
        var bm = this.bodyEl.getMargins();
        var newHeight = height-(this.stripWrap.getHeight()||0)-(bm.top+bm.bottom);
        this.bodyEl.setHeight(newHeight);
        return newHeight;
    },

    onResize : function(){
        if(this.monitorResize){
            this.autoSizeTabs();
        }
    },

    /**
     * Disables tab resizing while tabs are being added (if {@link #resizeTabs} is false this does nothing)
     */
    beginUpdate : function(){
        this.updating = true;
    },

    /**
     * Stops an update and resizes the tabs (if {@link #resizeTabs} is false this does nothing)
     */
    endUpdate : function(){
        this.updating = false;
        this.autoSizeTabs();
    },

    /**
     * Manual call to resize the tabs (if {@link #resizeTabs} is false this does nothing)
     */
    autoSizeTabs : function(){
        var count = this.items.length;
        var vcount = count - this.hiddenCount;
        if(!this.resizeTabs || count < 1 || vcount < 1 || this.updating) return;
        var w = Math.max(this.el.getWidth() - this.cpad, 10);
        var availWidth = Math.floor(w / vcount);
        var b = this.stripBody;
        if(b.getWidth() > w){
            var tabs = this.items;
            this.setTabWidth(Math.max(availWidth, this.minTabWidth)-2);
            if(availWidth < this.minTabWidth){
                /*if(!this.sleft){    // incomplete scrolling code
                    this.createScrollButtons();
                }
                this.showScroll();
                this.stripClip.setWidth(w - (this.sleft.getWidth()+this.sright.getWidth()));*/
            }
        }else{
            if(this.currentTabWidth < this.preferredTabWidth){
                this.setTabWidth(Math.min(availWidth, this.preferredTabWidth)-2);
            }
        }
    },

    /**
     * Returns the number of tabs in this TabPanel.
     * @return {Number}
     */
     getCount : function(){
         return this.items.length;
     },

    /**
     * Resizes all the tabs to the passed width
     * @param {Number} The new width
     */
    setTabWidth : function(width){
        this.currentTabWidth = width;
        for(var i = 0, len = this.items.length; i < len; i++) {
        	if(!this.items[i].isHidden())this.items[i].setWidth(width);
        }
    },

    /**
     * Destroys this TabPanel
     * @param {Boolean} removeEl (optional) True to remove the element from the DOM as well (defaults to undefined)
     */
    destroy : function(removeEl){
        Roo.EventManager.removeResizeListener(this.onResize, this);
        for(var i = 0, len = this.items.length; i < len; i++){
            this.items[i].purgeListeners();
        }
        if(removeEl === true){
            this.el.update("");
            this.el.remove();
        }
    }
});

/**
 * @class Roo.TabPanelItem
 * @extends Roo.util.Observable
 * Represents an individual item (tab plus body) in a TabPanel.
 * @param {Roo.TabPanel} tabPanel The {@link Roo.TabPanel} this TabPanelItem belongs to
 * @param {String} id The id of this TabPanelItem
 * @param {String} text The text for the tab of this TabPanelItem
 * @param {Boolean} closable True to allow this TabPanelItem to be closable (defaults to false)
 */
Roo.TabPanelItem = function(tabPanel, id, text, closable){
    /**
     * The {@link Roo.TabPanel} this TabPanelItem belongs to
     * @type Roo.TabPanel
     */
    this.tabPanel = tabPanel;
    /**
     * The id for this TabPanelItem
     * @type String
     */
    this.id = id;
    /** @private */
    this.disabled = false;
    /** @private */
    this.text = text;
    /** @private */
    this.loaded = false;
    this.closable = closable;

    /**
     * The body element for this TabPanelItem.
     * @type Roo.Element
     */
    this.bodyEl = Roo.get(tabPanel.createItemBody(tabPanel.bodyEl.dom, id));
    this.bodyEl.setVisibilityMode(Roo.Element.VISIBILITY);
    this.bodyEl.setStyle("display", "block");
    this.bodyEl.setStyle("zoom", "1");
    this.hideAction();

    var els = tabPanel.createStripElements(tabPanel.stripEl.dom, text, closable);
    /** @private */
    this.el = Roo.get(els.el, true);
    this.inner = Roo.get(els.inner, true);
    this.textEl = Roo.get(this.el.dom.firstChild.firstChild.firstChild, true);
    this.pnode = Roo.get(els.el.parentNode, true);
    this.el.on("mousedown", this.onTabMouseDown, this);
    this.el.on("click", this.onTabClick, this);
    /** @private */
    if(closable){
        var c = Roo.get(els.close, true);
        c.dom.title = this.closeText;
        c.addClassOnOver("close-over");
        c.on("click", this.closeClick, this);
     }

    this.addEvents({
         /**
         * @event activate
         * Fires when this tab becomes the active tab.
         * @param {Roo.TabPanel} tabPanel The parent TabPanel
         * @param {Roo.TabPanelItem} this
         */
        "activate": true,
        /**
         * @event beforeclose
         * Fires before this tab is closed. To cancel the close, set cancel to true on e (e.cancel = true).
         * @param {Roo.TabPanelItem} this
         * @param {Object} e Set cancel to true on this object to cancel the close.
         */
        "beforeclose": true,
        /**
         * @event close
         * Fires when this tab is closed.
         * @param {Roo.TabPanelItem} this
         */
         "close": true,
        /**
         * @event deactivate
         * Fires when this tab is no longer the active tab.
         * @param {Roo.TabPanel} tabPanel The parent TabPanel
         * @param {Roo.TabPanelItem} this
         */
         "deactivate" : true
    });
    this.hidden = false;

    Roo.TabPanelItem.superclass.constructor.call(this);
};

Roo.extend(Roo.TabPanelItem, Roo.util.Observable, {
    purgeListeners : function(){
       Roo.util.Observable.prototype.purgeListeners.call(this);
       this.el.removeAllListeners();
    },
    /**
     * Shows this TabPanelItem -- this <b>does not</b> deactivate the currently active TabPanelItem.
     */
    show : function(){
        this.pnode.addClass("on");
        this.showAction();
        if(Roo.isOpera){
            this.tabPanel.stripWrap.repaint();
        }
        this.fireEvent("activate", this.tabPanel, this);
    },

    /**
     * Returns true if this tab is the active tab.
     * @return {Boolean}
     */
    isActive : function(){
        return this.tabPanel.getActiveTab() == this;
    },

    /**
     * Hides this TabPanelItem -- if you don't activate another TabPanelItem this could look odd.
     */
    hide : function(){
        this.pnode.removeClass("on");
        this.hideAction();
        this.fireEvent("deactivate", this.tabPanel, this);
    },

    hideAction : function(){
        this.bodyEl.hide();
        this.bodyEl.setStyle("position", "absolute");
        this.bodyEl.setLeft("-20000px");
        this.bodyEl.setTop("-20000px");
    },

    showAction : function(){
        this.bodyEl.setStyle("position", "relative");
        this.bodyEl.setTop("");
        this.bodyEl.setLeft("");
        this.bodyEl.show();
    },

    /**
     * Set the tooltip for the tab.
     * @param {String} tooltip The tab's tooltip
     */
    setTooltip : function(text){
        if(Roo.QuickTips && Roo.QuickTips.isEnabled()){
            this.textEl.dom.qtip = text;
            this.textEl.dom.removeAttribute('title');
        }else{
            this.textEl.dom.title = text;
        }
    },

    onTabClick : function(e){
        e.preventDefault();
        this.tabPanel.activate(this.id);
    },

    onTabMouseDown : function(e){
        e.preventDefault();
        this.tabPanel.activate(this.id);
    },

    getWidth : function(){
        return this.inner.getWidth();
    },

    setWidth : function(width){
        var iwidth = width - this.pnode.getPadding("lr");
        this.inner.setWidth(iwidth);
        this.textEl.setWidth(iwidth-this.inner.getPadding("lr"));
        this.pnode.setWidth(width);
    },

    /**
     * Show or hide the tab
     * @param {Boolean} hidden True to hide or false to show.
     */
    setHidden : function(hidden){
        this.hidden = hidden;
        this.pnode.setStyle("display", hidden ? "none" : "");
    },

    /**
     * Returns true if this tab is "hidden"
     * @return {Boolean}
     */
    isHidden : function(){
        return this.hidden;
    },

    /**
     * Returns the text for this tab
     * @return {String}
     */
    getText : function(){
        return this.text;
    },

    autoSize : function(){
        //this.el.beginMeasure();
        this.textEl.setWidth(1);
        this.setWidth(this.textEl.dom.scrollWidth+this.pnode.getPadding("lr")+this.inner.getPadding("lr"));
        //this.el.endMeasure();
    },

    /**
     * Sets the text for the tab (Note: this also sets the tooltip text)
     * @param {String} text The tab's text and tooltip
     */
    setText : function(text){
        this.text = text;
        this.textEl.update(text);
        this.setTooltip(text);
        if(!this.tabPanel.resizeTabs){
            this.autoSize();
        }
    },
    /**
     * Activates this TabPanelItem -- this <b>does</b> deactivate the currently active TabPanelItem.
     */
    activate : function(){
        this.tabPanel.activate(this.id);
    },

    /**
     * Disables this TabPanelItem -- this does nothing if this is the active TabPanelItem.
     */
    disable : function(){
        if(this.tabPanel.active != this){
            this.disabled = true;
            this.pnode.addClass("disabled");
        }
    },

    /**
     * Enables this TabPanelItem if it was previously disabled.
     */
    enable : function(){
        this.disabled = false;
        this.pnode.removeClass("disabled");
    },

    /**
     * Sets the content for this TabPanelItem.
     * @param {String} content The content
     * @param {Boolean} loadScripts true to look for and load scripts
     */
    setContent : function(content, loadScripts){
        this.bodyEl.update(content, loadScripts);
    },

    /**
     * Gets the {@link Roo.UpdateManager} for the body of this TabPanelItem. Enables you to perform Ajax updates.
     * @return {Roo.UpdateManager} The UpdateManager
     */
    getUpdateManager : function(){
        return this.bodyEl.getUpdateManager();
    },

    /**
     * Set a URL to be used to load the content for this TabPanelItem.
     * @param {String/Function} url The URL to load the content from, or a function to call to get the URL
     * @param {String/Object} params (optional) The string params for the update call or an object of the params. See {@link Roo.UpdateManager#update} for more details. (Defaults to null)
     * @param {Boolean} loadOnce (optional) Whether to only load the content once. If this is false it makes the Ajax call every time this TabPanelItem is activated. (Defaults to false)
     * @return {Roo.UpdateManager} The UpdateManager
     */
    setUrl : function(url, params, loadOnce){
        if(this.refreshDelegate){
            this.un('activate', this.refreshDelegate);
        }
        this.refreshDelegate = this._handleRefresh.createDelegate(this, [url, params, loadOnce]);
        this.on("activate", this.refreshDelegate);
        return this.bodyEl.getUpdateManager();
    },

    /** @private */
    _handleRefresh : function(url, params, loadOnce){
        if(!loadOnce || !this.loaded){
            var updater = this.bodyEl.getUpdateManager();
            updater.update(url, params, this._setLoaded.createDelegate(this));
        }
    },

    /**
     *   Forces a content refresh from the URL specified in the {@link #setUrl} method.
     *   Will fail silently if the setUrl method has not been called.
     *   This does not activate the panel, just updates its content.
     */
    refresh : function(){
        if(this.refreshDelegate){
           this.loaded = false;
           this.refreshDelegate();
        }
    },

    /** @private */
    _setLoaded : function(){
        this.loaded = true;
    },

    /** @private */
    closeClick : function(e){
        var o = {};
        e.stopEvent();
        this.fireEvent("beforeclose", this, o);
        if(o.cancel !== true){
            this.tabPanel.removeTab(this.id);
        }
    },
    /**
     * The text displayed in the tooltip for the close icon.
     * @type String
     */
    closeText : "Close this tab"
});

/** @private */
Roo.TabPanel.prototype.createStrip = function(container){
    var strip = document.createElement("div");
    strip.className = "x-tabs-wrap";
    container.appendChild(strip);
    return strip;
};
/** @private */
Roo.TabPanel.prototype.createStripList = function(strip){
    // div wrapper for retard IE
    strip.innerHTML = '<div class="x-tabs-strip-wrap"><table class="x-tabs-strip" cellspacing="0" cellpadding="0" border="0"><tbody><tr></tr></tbody></table></div>';
    return strip.firstChild.firstChild.firstChild.firstChild;
};
/** @private */
Roo.TabPanel.prototype.createBody = function(container){
    var body = document.createElement("div");
    Roo.id(body, "tab-body");
    Roo.fly(body).addClass("x-tabs-body");
    container.appendChild(body);
    return body;
};
/** @private */
Roo.TabPanel.prototype.createItemBody = function(bodyEl, id){
    var body = Roo.getDom(id);
    if(!body){
        body = document.createElement("div");
        body.id = id;
    }
    Roo.fly(body).addClass("x-tabs-item-body");
    bodyEl.insertBefore(body, bodyEl.firstChild);
    return body;
};
/** @private */
Roo.TabPanel.prototype.createStripElements = function(stripEl, text, closable){
    var td = document.createElement("td");
    stripEl.appendChild(td);
    if(closable){
        td.className = "x-tabs-closable";
        if(!this.closeTpl){
            this.closeTpl = new Roo.Template(
               '<a href="#" class="x-tabs-right"><span class="x-tabs-left"><em class="x-tabs-inner">' +
               '<span unselectable="on"' + (this.disableTooltips ? '' : ' title="{text}"') +' class="x-tabs-text">{text}</span>' +
               '<div unselectable="on" class="close-icon">&#160;</div></em></span></a>'
            );
        }
        var el = this.closeTpl.overwrite(td, {"text": text});
        var close = el.getElementsByTagName("div")[0];
        var inner = el.getElementsByTagName("em")[0];
        return {"el": el, "close": close, "inner": inner};
    } else {
        if(!this.tabTpl){
            this.tabTpl = new Roo.Template(
               '<a href="#" class="x-tabs-right"><span class="x-tabs-left"><em class="x-tabs-inner">' +
               '<span unselectable="on"' + (this.disableTooltips ? '' : ' title="{text}"') +' class="x-tabs-text">{text}</span></em></span></a>'
            );
        }
        var el = this.tabTpl.overwrite(td, {"text": text});
        var inner = el.getElementsByTagName("em")[0];
        return {"el": el, "inner": inner};
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
 * @class Roo.Button
 * @extends Roo.util.Observable
 * Simple Button class
 * @cfg {String} text The button text
 * @cfg {String} icon The path to an image to display in the button (the image will be set as the background-image
 * CSS property of the button by default, so if you want a mixed icon/text button, set cls:"x-btn-text-icon")
 * @cfg {Function} handler A function called when the button is clicked (can be used instead of click event)
 * @cfg {Object} scope The scope of the handler
 * @cfg {Number} minWidth The minimum width for this button (used to give a set of buttons a common width)
 * @cfg {String/Object} tooltip The tooltip for the button - can be a string or QuickTips config object
 * @cfg {Boolean} hidden True to start hidden (defaults to false)
 * @cfg {Boolean} disabled True to start disabled (defaults to false)
 * @cfg {Boolean} pressed True to start pressed (only if enableToggle = true)
 * @cfg {String} toggleGroup The group this toggle button is a member of (only 1 per group can be pressed, only
   applies if enableToggle = true)
 * @cfg {String/HTMLElement/Element} renderTo The element to append the button to
 * @cfg {Boolean/Object} repeat True to repeat fire the click event while the mouse is down. This can also be
  an {@link Roo.util.ClickRepeater} config object (defaults to false).
 * @constructor
 * Create a new button
 * @param {Object} config The config object
 */
Roo.Button = function(renderTo, config)
{
    if (!config) {
        config = renderTo;
        renderTo = config.renderTo || false;
    }
    
    Roo.apply(this, config);
    this.addEvents({
        /**
	     * @event click
	     * Fires when this button is clicked
	     * @param {Button} this
	     * @param {EventObject} e The click event
	     */
	    "click" : true,
        /**
	     * @event toggle
	     * Fires when the "pressed" state of this button changes (only if enableToggle = true)
	     * @param {Button} this
	     * @param {Boolean} pressed
	     */
	    "toggle" : true,
        /**
	     * @event mouseover
	     * Fires when the mouse hovers over the button
	     * @param {Button} this
	     * @param {Event} e The event object
	     */
        'mouseover' : true,
        /**
	     * @event mouseout
	     * Fires when the mouse exits the button
	     * @param {Button} this
	     * @param {Event} e The event object
	     */
        'mouseout': true,
         /**
	     * @event render
	     * Fires when the button is rendered
	     * @param {Button} this
	     */
        'render': true
    });
    if(this.menu){
        this.menu = Roo.menu.MenuMgr.get(this.menu);
    }
    if(renderTo){
        this.render(renderTo);
    }
    
    Roo.util.Observable.call(this);
};

Roo.extend(Roo.Button, Roo.util.Observable, {
    /**
     * 
     */
    
    /**
     * Read-only. True if this button is hidden
     * @type Boolean
     */
    hidden : false,
    /**
     * Read-only. True if this button is disabled
     * @type Boolean
     */
    disabled : false,
    /**
     * Read-only. True if this button is pressed (only if enableToggle = true)
     * @type Boolean
     */
    pressed : false,

    /**
     * @cfg {Number} tabIndex 
     * The DOM tabIndex for this button (defaults to undefined)
     */
    tabIndex : undefined,

    /**
     * @cfg {Boolean} enableToggle
     * True to enable pressed/not pressed toggling (defaults to false)
     */
    enableToggle: false,
    /**
     * @cfg {Mixed} menu
     * Standard menu attribute consisting of a reference to a menu object, a menu id or a menu config blob (defaults to undefined).
     */
    menu : undefined,
    /**
     * @cfg {String} menuAlign
     * The position to align the menu to (see {@link Roo.Element#alignTo} for more details, defaults to 'tl-bl?').
     */
    menuAlign : "tl-bl?",

    /**
     * @cfg {String} iconCls
     * A css class which sets a background image to be used as the icon for this button (defaults to undefined).
     */
    iconCls : undefined,
    /**
     * @cfg {String} type
     * The button's type, corresponding to the DOM input element type attribute.  Either "submit," "reset" or "button" (default).
     */
    type : 'button',

    // private
    menuClassTarget: 'tr',

    /**
     * @cfg {String} clickEvent
     * The type of event to map to the button's event handler (defaults to 'click')
     */
    clickEvent : 'click',

    /**
     * @cfg {Boolean} handleMouseEvents
     * False to disable visual cues on mouseover, mouseout and mousedown (defaults to true)
     */
    handleMouseEvents : true,

    /**
     * @cfg {String} tooltipType
     * The type of tooltip to use. Either "qtip" (default) for QuickTips or "title" for title attribute.
     */
    tooltipType : 'qtip',

    /**
     * @cfg {String} cls
     * A CSS class to apply to the button's main element.
     */
    
    /**
     * @cfg {Roo.Template} template (Optional)
     * An {@link Roo.Template} with which to create the Button's main element. This Template must
     * contain numeric substitution parameter 0 if it is to display the tRoo property. Changing the template could
     * require code modifications if required elements (e.g. a button) aren't present.
     */

    // private
    render : function(renderTo){
        var btn;
        if(this.hideParent){
            this.parentEl = Roo.get(renderTo);
        }
        if(!this.dhconfig){
            if(!this.template){
                if(!Roo.Button.buttonTemplate){
                    // hideous table template
                    Roo.Button.buttonTemplate = new Roo.Template(
                        '<table border="0" cellpadding="0" cellspacing="0" class="x-btn-wrap"><tbody><tr>',
                        '<td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><em unselectable="on"><button class="x-btn-text" type="{1}">{0}</button></em></td><td class="x-btn-right"><i>&#160;</i></td>',
                        "</tr></tbody></table>");
                }
                this.template = Roo.Button.buttonTemplate;
            }
            btn = this.template.append(renderTo, [this.text || '&#160;', this.type], true);
            var btnEl = btn.child("button:first");
            btnEl.on('focus', this.onFocus, this);
            btnEl.on('blur', this.onBlur, this);
            if(this.cls){
                btn.addClass(this.cls);
            }
            if(this.icon){
                btnEl.setStyle('background-image', 'url(' +this.icon +')');
            }
            if(this.iconCls){
                btnEl.addClass(this.iconCls);
                if(!this.cls){
                    btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
                }
            }
            if(this.tabIndex !== undefined){
                btnEl.dom.tabIndex = this.tabIndex;
            }
            if(this.tooltip){
                if(typeof this.tooltip == 'object'){
                    Roo.QuickTips.tips(Roo.apply({
                          target: btnEl.id
                    }, this.tooltip));
                } else {
                    btnEl.dom[this.tooltipType] = this.tooltip;
                }
            }
        }else{
            btn = Roo.DomHelper.append(Roo.get(renderTo).dom, this.dhconfig, true);
        }
        this.el = btn;
        if(this.id){
            this.el.dom.id = this.el.id = this.id;
        }
        if(this.menu){
            this.el.child(this.menuClassTarget).addClass("x-btn-with-menu");
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
        btn.addClass("x-btn");
        if(Roo.isIE && !Roo.isIE7){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            btn.on("mouseout", this.onMouseOut, this);
            btn.on("mousedown", this.onMouseDown, this);
        }
        btn.on(this.clickEvent, this.onClick, this);
        //btn.on("mouseup", this.onMouseUp, this);
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        Roo.ButtonToggleMgr.register(this);
        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }
        if(this.repeat){
            var repeater = new Roo.util.ClickRepeater(btn,
                typeof this.repeat == "object" ? this.repeat : {}
            );
            repeater.on("click", this.onClick,  this);
        }
        this.fireEvent('render', this);
        
    },
    /**
     * Returns the button's underlying element
     * @return {Roo.Element} The element
     */
    getEl : function(){
        return this.el;  
    },
    
    /**
     * Destroys this Button and removes any listeners.
     */
    destroy : function(){
        Roo.ButtonToggleMgr.unregister(this);
        this.el.removeAllListeners();
        this.purgeListeners();
        this.el.remove();
    },

    // private
    autoWidth : function(){
        if(this.el){
            this.el.setWidth("auto");
            if(Roo.isIE7 && Roo.isStrict){
                var ib = this.el.child('button');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Roo.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if(this.el.getWidth() < this.minWidth){
                    this.el.setWidth(this.minWidth);
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
        }
    },

    /**
     * Assigns this button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} scope (optional) Scope for the function passed in
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    /**
     * Sets this button's text
     * @param {String} text The button text
     */
    setText : function(text){
        this.text = text;
        if(this.el){
            this.el.child("td.x-btn-center button.x-btn-text").update(text);
        }
        this.autoWidth();
    },
    
    /**
     * Gets the text for this button
     * @return {String} The button text
     */
    getText : function(){
        return this.text;  
    },
    
    /**
     * Show this button
     */
    show: function(){
        this.hidden = false;
        if(this.el){
            this[this.hideParent? 'parentEl' : 'el'].setStyle("display", "");
        }
    },
    
    /**
     * Hide this button
     */
    hide: function(){
        this.hidden = true;
        if(this.el){
            this[this.hideParent? 'parentEl' : 'el'].setStyle("display", "none");
        }
    },
    
    /**
     * Convenience function for boolean show/hide
     * @param {Boolean} visible True to show, false to hide
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    /**
     * If a state it passed, it becomes the pressed state otherwise the current state is toggled.
     * @param {Boolean} state (optional) Force a particular state
     */
    toggle : function(state){
        state = state === undefined ? !this.pressed : state;
        if(state != this.pressed){
            if(state){
                this.el.addClass("x-btn-pressed");
                this.pressed = true;
                this.fireEvent("toggle", this, true);
            }else{
                this.el.removeClass("x-btn-pressed");
                this.pressed = false;
                this.fireEvent("toggle", this, false);
            }
            if(this.toggleHandler){
                this.toggleHandler.call(this.scope || this, this, state);
            }
        }
    },
    
    /**
     * Focus the button
     */
    focus : function(){
        this.el.child('button:first').focus();
    },
    
    /**
     * Disable this button
     */
    disable : function(){
        if(this.el){
            this.el.addClass("x-btn-disabled");
        }
        this.disabled = true;
    },
    
    /**
     * Enable this button
     */
    enable : function(){
        if(this.el){
            this.el.removeClass("x-btn-disabled");
        }
        this.disabled = false;
    },

    /**
     * Convenience function for boolean enable/disable
     * @param {Boolean} enabled True to enable, false to disable
     */
    setDisabled : function(v){
        this[v !== true ? "enable" : "disable"]();
    },

    // private
    onClick : function(e){
        if(e){
            e.preventDefault();
        }
        if(e.button != 0){
            return;
        }
        if(!this.disabled){
            if(this.enableToggle){
                this.toggle();
            }
            if(this.menu && !this.menu.isVisible()){
                this.menu.show(this.el, this.menuAlign);
            }
            this.fireEvent("click", this, e);
            if(this.handler){
                this.el.removeClass("x-btn-over");
                this.handler.call(this.scope || this, this, e);
            }
        }
    },
    // private
    onMouseOver : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-over");
            this.fireEvent('mouseover', this, e);
        }
    },
    // private
    onMouseOut : function(e){
        if(!e.within(this.el,  true)){
            this.el.removeClass("x-btn-over");
            this.fireEvent('mouseout', this, e);
        }
    },
    // private
    onFocus : function(e){
        if(!this.disabled){
            this.el.addClass("x-btn-focus");
        }
    },
    // private
    onBlur : function(e){
        this.el.removeClass("x-btn-focus");
    },
    // private
    onMouseDown : function(e){
        if(!this.disabled && e.button == 0){
            this.el.addClass("x-btn-click");
            Roo.get(document).on('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMouseUp : function(e){
        if(e.button == 0){
            this.el.removeClass("x-btn-click");
            Roo.get(document).un('mouseup', this.onMouseUp, this);
        }
    },
    // private
    onMenuShow : function(e){
        this.el.addClass("x-btn-menu-active");
    },
    // private
    onMenuHide : function(e){
        this.el.removeClass("x-btn-menu-active");
    }   
});

// Private utility class used by Button
Roo.ButtonToggleMgr = function(){
   var groups = {};
   
   function toggleGroup(btn, state){
       if(state){
           var g = groups[btn.toggleGroup];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != btn){
                   g[i].toggle(false);
               }
           }
       }
   }
   
   return {
       register : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(!g){
               g = groups[btn.toggleGroup] = [];
           }
           g.push(btn);
           btn.on("toggle", toggleGroup);
       },
       
       unregister : function(btn){
           if(!btn.toggleGroup){
               return;
           }
           var g = groups[btn.toggleGroup];
           if(g){
               g.remove(btn);
               btn.un("toggle", toggleGroup);
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
 * @class Roo.SplitButton
 * @extends Roo.Button
 * A split button that provides a built-in dropdown arrow that can fire an event separately from the default
 * click event of the button.  Typically this would be used to display a dropdown menu that provides additional
 * options to the primary button action, but any custom handler can provide the arrowclick implementation.
 * @cfg {Function} arrowHandler A function called when the arrow button is clicked (can be used instead of click event)
 * @cfg {String} arrowTooltip The title attribute of the arrow
 * @constructor
 * Create a new menu button
 * @param {String/HTMLElement/Element} renderTo The element to append the button to
 * @param {Object} config The config object
 */
Roo.SplitButton = function(renderTo, config){
    Roo.SplitButton.superclass.constructor.call(this, renderTo, config);
    /**
     * @event arrowclick
     * Fires when this button's arrow is clicked
     * @param {SplitButton} this
     * @param {EventObject} e The click event
     */
    this.addEvents({"arrowclick":true});
};

Roo.extend(Roo.SplitButton, Roo.Button, {
    render : function(renderTo){
        // this is one sweet looking template!
        var tpl = new Roo.Template(
            '<table cellspacing="0" class="x-btn-menu-wrap x-btn"><tr><td>',
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-text-wrap"><tbody>',
            '<tr><td class="x-btn-left"><i>&#160;</i></td><td class="x-btn-center"><button class="x-btn-text" type="{1}">{0}</button></td></tr>',
            "</tbody></table></td><td>",
            '<table cellspacing="0" class="x-btn-wrap x-btn-menu-arrow-wrap"><tbody>',
            '<tr><td class="x-btn-center"><button class="x-btn-menu-arrow-el" type="button">&#160;</button></td><td class="x-btn-right"><i>&#160;</i></td></tr>',
            "</tbody></table></td></tr></table>"
        );
        var btn = tpl.append(renderTo, [this.text, this.type], true);
        var btnEl = btn.child("button");
        if(this.cls){
            btn.addClass(this.cls);
        }
        if(this.icon){
            btnEl.setStyle('background-image', 'url(' +this.icon +')');
        }
        if(this.iconCls){
            btnEl.addClass(this.iconCls);
            if(!this.cls){
                btn.addClass(this.text ? 'x-btn-text-icon' : 'x-btn-icon');
            }
        }
        this.el = btn;
        if(this.handleMouseEvents){
            btn.on("mouseover", this.onMouseOver, this);
            btn.on("mouseout", this.onMouseOut, this);
            btn.on("mousedown", this.onMouseDown, this);
            btn.on("mouseup", this.onMouseUp, this);
        }
        btn.on(this.clickEvent, this.onClick, this);
        if(this.tooltip){
            if(typeof this.tooltip == 'object'){
                Roo.QuickTips.tips(Roo.apply({
                      target: btnEl.id
                }, this.tooltip));
            } else {
                btnEl.dom[this.tooltipType] = this.tooltip;
            }
        }
        if(this.arrowTooltip){
            btn.child("button:nth(2)").dom[this.tooltipType] = this.arrowTooltip;
        }
        if(this.hidden){
            this.hide();
        }
        if(this.disabled){
            this.disable();
        }
        if(this.pressed){
            this.el.addClass("x-btn-pressed");
        }
        if(Roo.isIE && !Roo.isIE7){
            this.autoWidth.defer(1, this);
        }else{
            this.autoWidth();
        }
        if(this.menu){
            this.menu.on("show", this.onMenuShow, this);
            this.menu.on("hide", this.onMenuHide, this);
        }
        this.fireEvent('render', this);
    },

    // private
    autoWidth : function(){
        if(this.el){
            var tbl = this.el.child("table:first");
            var tbl2 = this.el.child("table:last");
            this.el.setWidth("auto");
            tbl.setWidth("auto");
            if(Roo.isIE7 && Roo.isStrict){
                var ib = this.el.child('button:first');
                if(ib && ib.getWidth() > 20){
                    ib.clip();
                    ib.setWidth(Roo.util.TextMetrics.measure(ib, this.text).width+ib.getFrameWidth('lr'));
                }
            }
            if(this.minWidth){
                if(this.hidden){
                    this.el.beginMeasure();
                }
                if((tbl.getWidth()+tbl2.getWidth()) < this.minWidth){
                    tbl.setWidth(this.minWidth-tbl2.getWidth());
                }
                if(this.hidden){
                    this.el.endMeasure();
                }
            }
            this.el.setWidth(tbl.getWidth()+tbl2.getWidth());
        } 
    },
    /**
     * Sets this button's click handler
     * @param {Function} handler The function to call when the button is clicked
     * @param {Object} scope (optional) Scope for the function passed above
     */
    setHandler : function(handler, scope){
        this.handler = handler;
        this.scope = scope;  
    },
    
    /**
     * Sets this button's arrow click handler
     * @param {Function} handler The function to call when the arrow is clicked
     * @param {Object} scope (optional) Scope for the function passed above
     */
    setArrowHandler : function(handler, scope){
        this.arrowHandler = handler;
        this.scope = scope;  
    },
    
    /**
     * Focus the button
     */
    focus : function(){
        if(this.el){
            this.el.child("button:first").focus();
        }
    },

    // private
    onClick : function(e){
        e.preventDefault();
        if(!this.disabled){
            if(e.getTarget(".x-btn-menu-arrow-wrap")){
                if(this.menu && !this.menu.isVisible()){
                    this.menu.show(this.el, this.menuAlign);
                }
                this.fireEvent("arrowclick", this, e);
                if(this.arrowHandler){
                    this.arrowHandler.call(this.scope || this, this, e);
                }
            }else{
                this.fireEvent("click", this, e);
                if(this.handler){
                    this.handler.call(this.scope || this, this, e);
                }
            }
        }
    },
    // private
    onMouseDown : function(e){
        if(!this.disabled){
            Roo.fly(e.getTarget("table")).addClass("x-btn-click");
        }
    },
    // private
    onMouseUp : function(e){
        Roo.fly(e.getTarget("table")).removeClass("x-btn-click");
    }   
});


// backwards compat
Roo.MenuButton = Roo.SplitButton;/*
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
 * @class Roo.Toolbar
 * Basic Toolbar class.
 * @constructor
 * Creates a new Toolbar
 * @param {Object} config The config object
 */ 
Roo.Toolbar = function(container, buttons, config)
{
    /// old consturctor format still supported..
    if(container instanceof Array){ // omit the container for later rendering
        buttons = container;
        config = buttons;
        container = null;
    }
    if (typeof(container) == 'object' && container.xtype) {
        config = container;
        container = config.container;
        buttons = config.buttons; // not really - use items!!
    }
    var xitems = [];
    if (config && config.items) {
        xitems = config.items;
        delete config.items;
    }
    Roo.apply(this, config);
    this.buttons = buttons;
    
    if(container){
        this.render(container);
    }
    Roo.each(xitems, function(b) {
        this.add(b);
    }, this);
    
};

Roo.Toolbar.prototype = {
    /**
     * @cfg {Roo.data.Store} items
     * array of button configs or elements to add
     */
    
    /**
     * @cfg {String/HTMLElement/Element} container
     * The id or element that will contain the toolbar
     */
    // private
    render : function(ct){
        this.el = Roo.get(ct);
        if(this.cls){
            this.el.addClass(this.cls);
        }
        // using a table allows for vertical alignment
        // 100% width is needed by Safari...
        this.el.update('<div class="x-toolbar x-small-editor"><table cellspacing="0"><tr></tr></table></div>');
        this.tr = this.el.child("tr", true);
        var autoId = 0;
        this.items = new Roo.util.MixedCollection(false, function(o){
            return o.id || ("item" + (++autoId));
        });
        if(this.buttons){
            this.add.apply(this, this.buttons);
            delete this.buttons;
        }
    },

    /**
     * Adds element(s) to the toolbar -- this function takes a variable number of 
     * arguments of mixed type and adds them to the toolbar.
     * @param {Mixed} arg1 The following types of arguments are all valid:<br />
     * <ul>
     * <li>{@link Roo.Toolbar.Button} config: A valid button config object (equivalent to {@link #addButton})</li>
     * <li>HtmlElement: Any standard HTML element (equivalent to {@link #addElement})</li>
     * <li>Field: Any form field (equivalent to {@link #addField})</li>
     * <li>Item: Any subclass of {@link Roo.Toolbar.Item} (equivalent to {@link #addItem})</li>
     * <li>String: Any generic string (gets wrapped in a {@link Roo.Toolbar.TextItem}, equivalent to {@link #addText}).
     * Note that there are a few special strings that are treated differently as explained nRoo.</li>
     * <li>'separator' or '-': Creates a separator element (equivalent to {@link #addSeparator})</li>
     * <li>' ': Creates a spacer element (equivalent to {@link #addSpacer})</li>
     * <li>'->': Creates a fill element (equivalent to {@link #addFill})</li>
     * </ul>
     * @param {Mixed} arg2
     * @param {Mixed} etc.
     */
    add : function(){
        var a = arguments, l = a.length;
        for(var i = 0; i < l; i++){
            this._add(a[i]);
        }
    },
    // private..
    _add : function(el) {
        
        if (el.xtype) {
            el = Roo.factory(el, typeof(Roo.Toolbar[el.xtype]) == 'undefined' ? Roo.form : Roo.Toolbar);
        }
        
        if (el.applyTo){ // some kind of form field
            return this.addField(el);
        } 
        if (el.render){ // some kind of Toolbar.Item
            return this.addItem(el);
        }
        if (typeof el == "string"){ // string
            if(el == "separator" || el == "-"){
                return this.addSeparator();
            }
            if (el == " "){
                return this.addSpacer();
            }
            if(el == "->"){
                return this.addFill();
            }
            return this.addText(el);
            
        }
        if(el.tagName){ // element
            return this.addElement(el);
        }
        if(typeof el == "object"){ // must be button config?
            return this.addButton(el);
        }
        // and now what?!?!
        return false;
        
    },
    
    /**
     * Add an Xtype element
     * @param {Object} xtype Xtype Object
     * @return {Object} created Object
     */
    addxtype : function(e){
        return this.add(e);  
    },
    
    /**
     * Returns the Element for this toolbar.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.el;  
    },
    
    /**
     * Adds a separator
     * @return {Roo.Toolbar.Item} The separator item
     */
    addSeparator : function(){
        return this.addItem(new Roo.Toolbar.Separator());
    },

    /**
     * Adds a spacer element
     * @return {Roo.Toolbar.Spacer} The spacer item
     */
    addSpacer : function(){
        return this.addItem(new Roo.Toolbar.Spacer());
    },

    /**
     * Adds a fill element that forces subsequent additions to the right side of the toolbar
     * @return {Roo.Toolbar.Fill} The fill item
     */
    addFill : function(){
        return this.addItem(new Roo.Toolbar.Fill());
    },

    /**
     * Adds any standard HTML element to the toolbar
     * @param {String/HTMLElement/Element} el The element or id of the element to add
     * @return {Roo.Toolbar.Item} The element's item
     */
    addElement : function(el){
        return this.addItem(new Roo.Toolbar.Item(el));
    },
    /**
     * Collection of items on the toolbar.. (only Toolbar Items, so use fields to retrieve fields)
     * @type Roo.util.MixedCollection  
     */
    items : false,
     
    /**
     * Adds any Toolbar.Item or subclass
     * @param {Roo.Toolbar.Item} item
     * @return {Roo.Toolbar.Item} The item
     */
    addItem : function(item){
        var td = this.nextBlock();
        item.render(td);
        this.items.add(item);
        return item;
    },
    
    /**
     * Adds a button (or buttons). See {@link Roo.Toolbar.Button} for more info on the config.
     * @param {Object/Array} config A button config or array of configs
     * @return {Roo.Toolbar.Button/Array}
     */
    addButton : function(config){
        if(config instanceof Array){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        var b = config;
        if(!(config instanceof Roo.Toolbar.Button)){
            b = config.split ?
                new Roo.Toolbar.SplitButton(config) :
                new Roo.Toolbar.Button(config);
        }
        var td = this.nextBlock();
        b.render(td);
        this.items.add(b);
        return b;
    },
    
    /**
     * Adds text to the toolbar
     * @param {String} text The text to add
     * @return {Roo.Toolbar.Item} The element's item
     */
    addText : function(text){
        return this.addItem(new Roo.Toolbar.TextItem(text));
    },
    
    /**
     * Inserts any {@link Roo.Toolbar.Item}/{@link Roo.Toolbar.Button} at the specified index.
     * @param {Number} index The index where the item is to be inserted
     * @param {Object/Roo.Toolbar.Item/Roo.Toolbar.Button (may be Array)} item The button, or button config object to be inserted.
     * @return {Roo.Toolbar.Button/Item}
     */
    insertButton : function(index, item){
        if(item instanceof Array){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        if (!(item instanceof Roo.Toolbar.Button)){
           item = new Roo.Toolbar.Button(item);
        }
        var td = document.createElement("td");
        this.tr.insertBefore(td, this.tr.childNodes[index]);
        item.render(td);
        this.items.insert(index, item);
        return item;
    },
    
    /**
     * Adds a new element to the toolbar from the passed {@link Roo.DomHelper} config.
     * @param {Object} config
     * @return {Roo.Toolbar.Item} The element's item
     */
    addDom : function(config, returnEl){
        var td = this.nextBlock();
        Roo.DomHelper.overwrite(td, config);
        var ti = new Roo.Toolbar.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        return ti;
    },

    /**
     * Collection of fields on the toolbar.. usefull for quering (value is false if there are no fields)
     * @type Roo.util.MixedCollection  
     */
    fields : false,
    
    /**
     * Adds a dynamically rendered Roo.form field (TextField, ComboBox, etc). Note: the field should not have
     * been rendered yet. For a field that has already been rendered, use {@link #addElement}.
     * @param {Roo.form.Field} field
     * @return {Roo.ToolbarItem}
     */
     
      
    addField : function(field) {
        if (!this.fields) {
            var autoId = 0;
            this.fields = new Roo.util.MixedCollection(false, function(o){
                return o.id || ("item" + (++autoId));
            });

        }
        
        var td = this.nextBlock();
        field.render(td);
        var ti = new Roo.Toolbar.Item(td.firstChild);
        ti.render(td);
        this.items.add(ti);
        this.fields.add(field);
        return ti;
    },
    /**
     * Hide the toolbar
     * @method hide
     */
     
      
    hide : function()
    {
        this.el.child('div').setVisibilityMode(Roo.Element.DISPLAY);
        this.el.child('div').hide();
    },
    /**
     * Show the toolbar
     * @method show
     */
    show : function()
    {
        this.el.child('div').show();
    },
      
    // private
    nextBlock : function(){
        var td = document.createElement("td");
        this.tr.appendChild(td);
        return td;
    },

    // private
    destroy : function(){
        if(this.items){ // rendered?
            Roo.destroy.apply(Roo, this.items.items);
        }
        if(this.fields){ // rendered?
            Roo.destroy.apply(Roo, this.fields.items);
        }
        Roo.Element.uncache(this.el, this.tr);
    }
};

/**
 * @class Roo.Toolbar.Item
 * The base class that other classes should extend in order to get some basic common toolbar item functionality.
 * @constructor
 * Creates a new Item
 * @param {HTMLElement} el 
 */
Roo.Toolbar.Item = function(el){
    this.el = Roo.getDom(el);
    this.id = Roo.id(this.el);
    this.hidden = false;
};

Roo.Toolbar.Item.prototype = {
    
    /**
     * Get this item's HTML Element
     * @return {HTMLElement}
     */
    getEl : function(){
       return this.el;  
    },

    // private
    render : function(td){
        this.td = td;
        td.appendChild(this.el);
    },
    
    /**
     * Removes and destroys this item.
     */
    destroy : function(){
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * Shows this item.
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * Hides this item.
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },
    
    /**
     * Convenience function for boolean show/hide.
     * @param {Boolean} visible true to show/false to hide
     */
    setVisible: function(visible){
        if(visible) {
            this.show();
        }else{
            this.hide();
        }
    },
    
    /**
     * Try to focus this item.
     */
    focus : function(){
        Roo.fly(this.el).focus();
    },
    
    /**
     * Disables this item.
     */
    disable : function(){
        Roo.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
        this.el.disabled = true;
    },
    
    /**
     * Enables this item.
     */
    enable : function(){
        Roo.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
        this.el.disabled = false;
    }
};


/**
 * @class Roo.Toolbar.Separator
 * @extends Roo.Toolbar.Item
 * A simple toolbar separator class
 * @constructor
 * Creates a new Separator
 */
Roo.Toolbar.Separator = function(){
    var s = document.createElement("span");
    s.className = "ytb-sep";
    Roo.Toolbar.Separator.superclass.constructor.call(this, s);
};
Roo.extend(Roo.Toolbar.Separator, Roo.Toolbar.Item, {
    enable:Roo.emptyFn,
    disable:Roo.emptyFn,
    focus:Roo.emptyFn
});

/**
 * @class Roo.Toolbar.Spacer
 * @extends Roo.Toolbar.Item
 * A simple element that adds extra horizontal space to a toolbar.
 * @constructor
 * Creates a new Spacer
 */
Roo.Toolbar.Spacer = function(){
    var s = document.createElement("div");
    s.className = "ytb-spacer";
    Roo.Toolbar.Spacer.superclass.constructor.call(this, s);
};
Roo.extend(Roo.Toolbar.Spacer, Roo.Toolbar.Item, {
    enable:Roo.emptyFn,
    disable:Roo.emptyFn,
    focus:Roo.emptyFn
});

/**
 * @class Roo.Toolbar.Fill
 * @extends Roo.Toolbar.Spacer
 * A simple element that adds a greedy (100% width) horizontal space to a toolbar.
 * @constructor
 * Creates a new Spacer
 */
Roo.Toolbar.Fill = Roo.extend(Roo.Toolbar.Spacer, {
    // private
    render : function(td){
        td.style.width = '100%';
        Roo.Toolbar.Fill.superclass.render.call(this, td);
    }
});

/**
 * @class Roo.Toolbar.TextItem
 * @extends Roo.Toolbar.Item
 * A simple class that renders text directly into a toolbar.
 * @constructor
 * Creates a new TextItem
 * @param {String} text
 */
Roo.Toolbar.TextItem = function(text){
    if (typeof(text) == 'object') {
        text = text.text;
    }
    var s = document.createElement("span");
    s.className = "ytb-text";
    s.innerHTML = text;
    Roo.Toolbar.TextItem.superclass.constructor.call(this, s);
};
Roo.extend(Roo.Toolbar.TextItem, Roo.Toolbar.Item, {
    enable:Roo.emptyFn,
    disable:Roo.emptyFn,
    focus:Roo.emptyFn
});

/**
 * @class Roo.Toolbar.Button
 * @extends Roo.Button
 * A button that renders into a toolbar.
 * @constructor
 * Creates a new Button
 * @param {Object} config A standard {@link Roo.Button} config object
 */
Roo.Toolbar.Button = function(config){
    Roo.Toolbar.Button.superclass.constructor.call(this, null, config);
};
Roo.extend(Roo.Toolbar.Button, Roo.Button, {
    render : function(td){
        this.td = td;
        Roo.Toolbar.Button.superclass.render.call(this, td);
    },
    
    /**
     * Removes and destroys this button
     */
    destroy : function(){
        Roo.Toolbar.Button.superclass.destroy.call(this);
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * Shows this button
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * Hides this button
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    },

    /**
     * Disables this item
     */
    disable : function(){
        Roo.fly(this.td).addClass("x-item-disabled");
        this.disabled = true;
    },

    /**
     * Enables this item
     */
    enable : function(){
        Roo.fly(this.td).removeClass("x-item-disabled");
        this.disabled = false;
    }
});
// backwards compat
Roo.ToolbarButton = Roo.Toolbar.Button;

/**
 * @class Roo.Toolbar.SplitButton
 * @extends Roo.SplitButton
 * A menu button that renders into a toolbar.
 * @constructor
 * Creates a new SplitButton
 * @param {Object} config A standard {@link Roo.SplitButton} config object
 */
Roo.Toolbar.SplitButton = function(config){
    Roo.Toolbar.SplitButton.superclass.constructor.call(this, null, config);
};
Roo.extend(Roo.Toolbar.SplitButton, Roo.SplitButton, {
    render : function(td){
        this.td = td;
        Roo.Toolbar.SplitButton.superclass.render.call(this, td);
    },
    
    /**
     * Removes and destroys this button
     */
    destroy : function(){
        Roo.Toolbar.SplitButton.superclass.destroy.call(this);
        this.td.parentNode.removeChild(this.td);
    },
    
    /**
     * Shows this button
     */
    show: function(){
        this.hidden = false;
        this.td.style.display = "";
    },
    
    /**
     * Hides this button
     */
    hide: function(){
        this.hidden = true;
        this.td.style.display = "none";
    }
});

// backwards compat
Roo.Toolbar.MenuButton = Roo.Toolbar.SplitButton;/*
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
 * @class Roo.PagingToolbar
 * @extends Roo.Toolbar
 * A specialized toolbar that is bound to a {@link Roo.data.Store} and provides automatic paging controls.
 * @constructor
 * Create a new PagingToolbar
 * @param {Object} config The config object
 */
Roo.PagingToolbar = function(el, ds, config)
{
    // old args format still supported... - xtype is prefered..
    if (typeof(el) == 'object' && el.xtype) {
        // created from xtype...
        config = el;
        ds = el.dataSource;
        el = config.container;
    }
    
    
    Roo.PagingToolbar.superclass.constructor.call(this, el, null, config);
    this.ds = ds;
    this.cursor = 0;
    this.renderButtons(this.el);
    this.bind(ds);
};

Roo.extend(Roo.PagingToolbar, Roo.Toolbar, {
    /**
     * @cfg {Roo.data.Store} dataSource
     * The underlying data store providing the paged data
     */
    /**
     * @cfg {String/HTMLElement/Element} container
     * container The id or element that will contain the toolbar
     */
    /**
     * @cfg {Boolean} displayInfo
     * True to display the displayMsg (defaults to false)
     */
    /**
     * @cfg {Number} pageSize
     * The number of records to display per page (defaults to 20)
     */
    pageSize: 20,
    /**
     * @cfg {String} displayMsg
     * The paging status message to display (defaults to "Displaying {start} - {end} of {total}")
     */
    displayMsg : 'Displaying {0} - {1} of {2}',
    /**
     * @cfg {String} emptyMsg
     * The message to display when no records are found (defaults to "No data to display")
     */
    emptyMsg : 'No data to display',
    /**
     * Customizable piece of the default paging text (defaults to "Page")
     * @type String
     */
    beforePageText : "Page",
    /**
     * Customizable piece of the default paging text (defaults to "of %0")
     * @type String
     */
    afterPageText : "of {0}",
    /**
     * Customizable piece of the default paging text (defaults to "First Page")
     * @type String
     */
    firstText : "First Page",
    /**
     * Customizable piece of the default paging text (defaults to "Previous Page")
     * @type String
     */
    prevText : "Previous Page",
    /**
     * Customizable piece of the default paging text (defaults to "Next Page")
     * @type String
     */
    nextText : "Next Page",
    /**
     * Customizable piece of the default paging text (defaults to "Last Page")
     * @type String
     */
    lastText : "Last Page",
    /**
     * Customizable piece of the default paging text (defaults to "Refresh")
     * @type String
     */
    refreshText : "Refresh",

    // private
    renderButtons : function(el){
        Roo.PagingToolbar.superclass.render.call(this, el);
        this.first = this.addButton({
            tooltip: this.firstText,
            cls: "x-btn-icon x-grid-page-first",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["first"])
        });
        this.prev = this.addButton({
            tooltip: this.prevText,
            cls: "x-btn-icon x-grid-page-prev",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["prev"])
        });
        this.addSeparator();
        this.add(this.beforePageText);
        this.field = Roo.get(this.addDom({
           tag: "input",
           type: "text",
           size: "3",
           value: "1",
           cls: "x-grid-page-number"
        }).el);
        this.field.on("keydown", this.onPagingKeydown, this);
        this.field.on("focus", function(){this.dom.select();});
        this.afterTextEl = this.addText(String.format(this.afterPageText, 1));
        this.field.setHeight(18);
        this.addSeparator();
        this.next = this.addButton({
            tooltip: this.nextText,
            cls: "x-btn-icon x-grid-page-next",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["next"])
        });
        this.last = this.addButton({
            tooltip: this.lastText,
            cls: "x-btn-icon x-grid-page-last",
            disabled: true,
            handler: this.onClick.createDelegate(this, ["last"])
        });
        this.addSeparator();
        this.loading = this.addButton({
            tooltip: this.refreshText,
            cls: "x-btn-icon x-grid-loading",
            handler: this.onClick.createDelegate(this, ["refresh"])
        });

        if(this.displayInfo){
            this.displayEl = Roo.fly(this.el.dom.firstChild).createChild({cls:'x-paging-info'});
        }
    },

    // private
    updateInfo : function(){
        if(this.displayEl){
            var count = this.ds.getCount();
            var msg = count == 0 ?
                this.emptyMsg :
                String.format(
                    this.displayMsg,
                    this.cursor+1, this.cursor+count, this.ds.getTotalCount()    
                );
            this.displayEl.update(msg);
        }
    },

    // private
    onLoad : function(ds, r, o){
       this.cursor = o.params ? o.params.start : 0;
       var d = this.getPageData(), ap = d.activePage, ps = d.pages;

       this.afterTextEl.el.innerHTML = String.format(this.afterPageText, d.pages);
       this.field.dom.value = ap;
       this.first.setDisabled(ap == 1);
       this.prev.setDisabled(ap == 1);
       this.next.setDisabled(ap == ps);
       this.last.setDisabled(ap == ps);
       this.loading.enable();
       this.updateInfo();
    },

    // private
    getPageData : function(){
        var total = this.ds.getTotalCount();
        return {
            total : total,
            activePage : Math.ceil((this.cursor+this.pageSize)/this.pageSize),
            pages :  total < this.pageSize ? 1 : Math.ceil(total/this.pageSize)
        };
    },

    // private
    onLoadError : function(){
        this.loading.enable();
    },

    // private
    onPagingKeydown : function(e){
        var k = e.getKey();
        var d = this.getPageData();
        if(k == e.RETURN){
            var v = this.field.dom.value, pageNum;
            if(!v || isNaN(pageNum = parseInt(v, 10))){
                this.field.dom.value = d.activePage;
                return;
            }
            pageNum = Math.min(Math.max(1, pageNum), d.pages) - 1;
            this.ds.load({params:{start: pageNum * this.pageSize, limit: this.pageSize}});
            e.stopEvent();
        }
        else if(k == e.HOME || (k == e.UP && e.ctrlKey) || (k == e.PAGEUP && e.ctrlKey) || (k == e.RIGHT && e.ctrlKey) || k == e.END || (k == e.DOWN && e.ctrlKey) || (k == e.LEFT && e.ctrlKey) || (k == e.PAGEDOWN && e.ctrlKey))
        {
          var pageNum = (k == e.HOME || (k == e.DOWN && e.ctrlKey) || (k == e.LEFT && e.ctrlKey) || (k == e.PAGEDOWN && e.ctrlKey)) ? 1 : d.pages;
          this.field.dom.value = pageNum;
          this.ds.load({params:{start: (pageNum - 1) * this.pageSize, limit: this.pageSize}});
          e.stopEvent();
        }
        else if(k == e.UP || k == e.RIGHT || k == e.PAGEUP || k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN)
        {
          var v = this.field.dom.value, pageNum; 
          var increment = (e.shiftKey) ? 10 : 1;
          if(k == e.DOWN || k == e.LEFT || k == e.PAGEDOWN)
            increment *= -1;
          if(!v || isNaN(pageNum = parseInt(v, 10))) {
            this.field.dom.value = d.activePage;
            return;
          }
          else if(parseInt(v, 10) + increment >= 1 & parseInt(v, 10) + increment <= d.pages)
          {
            this.field.dom.value = parseInt(v, 10) + increment;
            pageNum = Math.min(Math.max(1, pageNum + increment), d.pages) - 1;
            this.ds.load({params:{start: pageNum * this.pageSize, limit: this.pageSize}});
          }
          e.stopEvent();
        }
    },

    // private
    beforeLoad : function(){
        if(this.loading){
            this.loading.disable();
        }
    },

    // private
    onClick : function(which){
        var ds = this.ds;
        switch(which){
            case "first":
                ds.load({params:{start: 0, limit: this.pageSize}});
            break;
            case "prev":
                ds.load({params:{start: Math.max(0, this.cursor-this.pageSize), limit: this.pageSize}});
            break;
            case "next":
                ds.load({params:{start: this.cursor+this.pageSize, limit: this.pageSize}});
            break;
            case "last":
                var total = ds.getTotalCount();
                var extra = total % this.pageSize;
                var lastStart = extra ? (total - extra) : total-this.pageSize;
                ds.load({params:{start: lastStart, limit: this.pageSize}});
            break;
            case "refresh":
                ds.load({params:{start: this.cursor, limit: this.pageSize}});
            break;
        }
    },

    /**
     * Unbinds the paging toolbar from the specified {@link Roo.data.Store}
     * @param {Roo.data.Store} store The data store to unbind
     */
    unbind : function(ds){
        ds.un("beforeload", this.beforeLoad, this);
        ds.un("load", this.onLoad, this);
        ds.un("loadexception", this.onLoadError, this);
        ds.un("remove", this.updateInfo, this);
        ds.un("add", this.updateInfo, this);
        this.ds = undefined;
    },

    /**
     * Binds the paging toolbar to the specified {@link Roo.data.Store}
     * @param {Roo.data.Store} store The data store to bind
     */
    bind : function(ds){
        ds.on("beforeload", this.beforeLoad, this);
        ds.on("load", this.onLoad, this);
        ds.on("loadexception", this.onLoadError, this);
        ds.on("remove", this.updateInfo, this);
        ds.on("add", this.updateInfo, this);
        this.ds = ds;
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
 * @class Roo.Resizable
 * @extends Roo.util.Observable
 * <p>Applies drag handles to an element to make it resizable. The drag handles are inserted into the element
 * and positioned absolute. Some elements, such as a textarea or image, don't support this. To overcome that, you can wrap
 * the textarea in a div and set "resizeChild" to true (or to the id of the element), <b>or</b> set wrap:true in your config and
 * the element will be wrapped for you automatically.</p>
 * <p>Here is the list of valid resize handles:</p>
 * <pre>
Value   Description
------  -------------------
 'n'     north
 's'     south
 'e'     east
 'w'     west
 'nw'    northwest
 'sw'    southwest
 'se'    southeast
 'ne'    northeast
 'all'   all
</pre>
 * <p>Here's an example showing the creation of a typical Resizable:</p>
 * <pre><code>
var resizer = new Roo.Resizable("element-id", {
    handles: 'all',
    minWidth: 200,
    minHeight: 100,
    maxWidth: 500,
    maxHeight: 400,
    pinned: true
});
resizer.on("resize", myHandler);
</code></pre>
 * <p>To hide a particular handle, set its display to none in CSS, or through script:<br>
 * resizer.east.setDisplayed(false);</p>
 * @cfg {Boolean/String/Element} resizeChild True to resize the first child, or id/element to resize (defaults to false)
 * @cfg {Array/String} adjustments String "auto" or an array [width, height] with values to be <b>added</b> to the
 * resize operation's new size (defaults to [0, 0])
 * @cfg {Number} minWidth The minimum width for the element (defaults to 5)
 * @cfg {Number} minHeight The minimum height for the element (defaults to 5)
 * @cfg {Number} maxWidth The maximum width for the element (defaults to 10000)
 * @cfg {Number} maxHeight The maximum height for the element (defaults to 10000)
 * @cfg {Boolean} enabled False to disable resizing (defaults to true)
 * @cfg {Boolean} wrap True to wrap an element with a div if needed (required for textareas and images, defaults to false)
 * @cfg {Number} width The width of the element in pixels (defaults to null)
 * @cfg {Number} height The height of the element in pixels (defaults to null)
 * @cfg {Boolean} animate True to animate the resize (not compatible with dynamic sizing, defaults to false)
 * @cfg {Number} duration Animation duration if animate = true (defaults to .35)
 * @cfg {Boolean} dynamic True to resize the element while dragging instead of using a proxy (defaults to false)
 * @cfg {String} handles String consisting of the resize handles to display (defaults to undefined)
 * @cfg {Boolean} multiDirectional <b>Deprecated</b>.  The old style of adding multi-direction resize handles, deprecated
 * in favor of the handles config option (defaults to false)
 * @cfg {Boolean} disableTrackOver True to disable mouse tracking. This is only applied at config time. (defaults to false)
 * @cfg {String} easing Animation easing if animate = true (defaults to 'easingOutStrong')
 * @cfg {Number} widthIncrement The increment to snap the width resize in pixels (dynamic must be true, defaults to 0)
 * @cfg {Number} heightIncrement The increment to snap the height resize in pixels (dynamic must be true, defaults to 0)
 * @cfg {Boolean} pinned True to ensure that the resize handles are always visible, false to display them only when the
 * user mouses over the resizable borders. This is only applied at config time. (defaults to false)
 * @cfg {Boolean} preserveRatio True to preserve the original ratio between height and width during resize (defaults to false)
 * @cfg {Boolean} transparent True for transparent handles. This is only applied at config time. (defaults to false)
 * @cfg {Number} minX The minimum allowed page X for the element (only used for west resizing, defaults to 0)
 * @cfg {Number} minY The minimum allowed page Y for the element (only used for north resizing, defaults to 0)
 * @cfg {Boolean} draggable Convenience to initialize drag drop (defaults to false)
 * @constructor
 * Create a new resizable component
 * @param {String/HTMLElement/Roo.Element} el The id or element to resize
 * @param {Object} config configuration options
  */
Roo.Resizable = function(el, config){
    this.el = Roo.get(el);

    if(config && config.wrap){
        config.resizeChild = this.el;
        this.el = this.el.wrap(typeof config.wrap == "object" ? config.wrap : {cls:"xresizable-wrap"});
        this.el.id = this.el.dom.id = config.resizeChild.id + "-rzwrap";
        this.el.setStyle("overflow", "hidden");
        this.el.setPositioning(config.resizeChild.getPositioning());
        config.resizeChild.clearPositioning();
        if(!config.width || !config.height){
            var csize = config.resizeChild.getSize();
            this.el.setSize(csize.width, csize.height);
        }
        if(config.pinned && !config.adjustments){
            config.adjustments = "auto";
        }
    }

    this.proxy = this.el.createProxy({tag: "div", cls: "x-resizable-proxy", id: this.el.id + "-rzproxy"});
    this.proxy.unselectable();
    this.proxy.enableDisplayMode('block');

    Roo.apply(this, config);

    if(this.pinned){
        this.disableTrackOver = true;
        this.el.addClass("x-resizable-pinned");
    }
    // if the element isn't positioned, make it relative
    var position = this.el.getStyle("position");
    if(position != "absolute" && position != "fixed"){
        this.el.setStyle("position", "relative");
    }
    if(!this.handles){ // no handles passed, must be legacy style
        this.handles = 's,e,se';
        if(this.multiDirectional){
            this.handles += ',n,w';
        }
    }
    if(this.handles == "all"){
        this.handles = "n s e w ne nw se sw";
    }
    var hs = this.handles.split(/\s*?[,;]\s*?| /);
    var ps = Roo.Resizable.positions;
    for(var i = 0, len = hs.length; i < len; i++){
        if(hs[i] && ps[hs[i]]){
            var pos = ps[hs[i]];
            this[pos] = new Roo.Resizable.Handle(this, pos, this.disableTrackOver, this.transparent);
        }
    }
    // legacy
    this.corner = this.southeast;

    if(this.handles.indexOf("n") != -1 || this.handles.indexOf("w") != -1){
        this.updateBox = true;
    }

    this.activeHandle = null;

    if(this.resizeChild){
        if(typeof this.resizeChild == "boolean"){
            this.resizeChild = Roo.get(this.el.dom.firstChild, true);
        }else{
            this.resizeChild = Roo.get(this.resizeChild, true);
        }
    }

    if(this.adjustments == "auto"){
        var rc = this.resizeChild;
        var hw = this.west, he = this.east, hn = this.north, hs = this.south;
        if(rc && (hw || hn)){
            rc.position("relative");
            rc.setLeft(hw ? hw.el.getWidth() : 0);
            rc.setTop(hn ? hn.el.getHeight() : 0);
        }
        this.adjustments = [
            (he ? -he.el.getWidth() : 0) + (hw ? -hw.el.getWidth() : 0),
            (hn ? -hn.el.getHeight() : 0) + (hs ? -hs.el.getHeight() : 0) -1
        ];
    }

    if(this.draggable){
        this.dd = this.dynamic ?
            this.el.initDD(null) : this.el.initDDProxy(null, {dragElId: this.proxy.id});
        this.dd.setHandleElId(this.resizeChild ? this.resizeChild.id : this.el.id);
    }

    // public events
    this.addEvents({
        /**
         * @event beforeresize
         * Fired before resize is allowed. Set enabled to false to cancel resize.
         * @param {Roo.Resizable} this
         * @param {Roo.EventObject} e The mousedown event
         */
        "beforeresize" : true,
        /**
         * @event resize
         * Fired after a resize.
         * @param {Roo.Resizable} this
         * @param {Number} width The new width
         * @param {Number} height The new height
         * @param {Roo.EventObject} e The mouseup event
         */
        "resize" : true
    });

    if(this.width !== null && this.height !== null){
        this.resizeTo(this.width, this.height);
    }else{
        this.updateChildSize();
    }
    if(Roo.isIE){
        this.el.dom.style.zoom = 1;
    }
    Roo.Resizable.superclass.constructor.call(this);
};

Roo.extend(Roo.Resizable, Roo.util.Observable, {
        resizeChild : false,
        adjustments : [0, 0],
        minWidth : 5,
        minHeight : 5,
        maxWidth : 10000,
        maxHeight : 10000,
        enabled : true,
        animate : false,
        duration : .35,
        dynamic : false,
        handles : false,
        multiDirectional : false,
        disableTrackOver : false,
        easing : 'easeOutStrong',
        widthIncrement : 0,
        heightIncrement : 0,
        pinned : false,
        width : null,
        height : null,
        preserveRatio : false,
        transparent: false,
        minX: 0,
        minY: 0,
        draggable: false,

        /**
         * @cfg {String/HTMLElement/Element} constrainTo Constrain the resize to a particular element
         */
        constrainTo: undefined,
        /**
         * @cfg {Roo.lib.Region} resizeRegion Constrain the resize to a particular region
         */
        resizeRegion: undefined,


    /**
     * Perform a manual resize
     * @param {Number} width
     * @param {Number} height
     */
    resizeTo : function(width, height){
        this.el.setSize(width, height);
        this.updateChildSize();
        this.fireEvent("resize", this, width, height, null);
    },

    // private
    startSizing : function(e, handle){
        this.fireEvent("beforeresize", this, e);
        if(this.enabled){ // 2nd enabled check in case disabled before beforeresize handler

            if(!this.overlay){
                this.overlay = this.el.createProxy({tag: "div", cls: "x-resizable-overlay", html: "&#160;"});
                this.overlay.unselectable();
                this.overlay.enableDisplayMode("block");
                this.overlay.on("mousemove", this.onMouseMove, this);
                this.overlay.on("mouseup", this.onMouseUp, this);
            }
            this.overlay.setStyle("cursor", handle.el.getStyle("cursor"));

            this.resizing = true;
            this.startBox = this.el.getBox();
            this.startPoint = e.getXY();
            this.offsets = [(this.startBox.x + this.startBox.width) - this.startPoint[0],
                            (this.startBox.y + this.startBox.height) - this.startPoint[1]];

            this.overlay.setSize(Roo.lib.Dom.getViewWidth(true), Roo.lib.Dom.getViewHeight(true));
            this.overlay.show();

            if(this.constrainTo) {
                var ct = Roo.get(this.constrainTo);
                this.resizeRegion = ct.getRegion().adjust(
                    ct.getFrameWidth('t'),
                    ct.getFrameWidth('l'),
                    -ct.getFrameWidth('b'),
                    -ct.getFrameWidth('r')
                );
            }

            this.proxy.setStyle('visibility', 'hidden'); // workaround display none
            this.proxy.show();
            this.proxy.setBox(this.startBox);
            if(!this.dynamic){
                this.proxy.setStyle('visibility', 'visible');
            }
        }
    },

    // private
    onMouseDown : function(handle, e){
        if(this.enabled){
            e.stopEvent();
            this.activeHandle = handle;
            this.startSizing(e, handle);
        }
    },

    // private
    onMouseUp : function(e){
        var size = this.resizeElement();
        this.resizing = false;
        this.handleOut();
        this.overlay.hide();
        this.proxy.hide();
        this.fireEvent("resize", this, size.width, size.height, e);
    },

    // private
    updateChildSize : function(){
        if(this.resizeChild){
            var el = this.el;
            var child = this.resizeChild;
            var adj = this.adjustments;
            if(el.dom.offsetWidth){
                var b = el.getSize(true);
                child.setSize(b.width+adj[0], b.height+adj[1]);
            }
            // Second call here for IE
            // The first call enables instant resizing and
            // the second call corrects scroll bars if they
            // exist
            if(Roo.isIE){
                setTimeout(function(){
                    if(el.dom.offsetWidth){
                        var b = el.getSize(true);
                        child.setSize(b.width+adj[0], b.height+adj[1]);
                    }
                }, 10);
            }
        }
    },

    // private
    snap : function(value, inc, min){
        if(!inc || !value) return value;
        var newValue = value;
        var m = value % inc;
        if(m > 0){
            if(m > (inc/2)){
                newValue = value + (inc-m);
            }else{
                newValue = value - m;
            }
        }
        return Math.max(min, newValue);
    },

    // private
    resizeElement : function(){
        var box = this.proxy.getBox();
        if(this.updateBox){
            this.el.setBox(box, false, this.animate, this.duration, null, this.easing);
        }else{
            this.el.setSize(box.width, box.height, this.animate, this.duration, null, this.easing);
        }
        this.updateChildSize();
        if(!this.dynamic){
            this.proxy.hide();
        }
        return box;
    },

    // private
    constrain : function(v, diff, m, mx){
        if(v - diff < m){
            diff = v - m;
        }else if(v - diff > mx){
            diff = mx - v;
        }
        return diff;
    },

    // private
    onMouseMove : function(e){
        if(this.enabled){
            try{// try catch so if something goes wrong the user doesn't get hung

            if(this.resizeRegion && !this.resizeRegion.contains(e.getPoint())) {
            	return;
            }

            //var curXY = this.startPoint;
            var curSize = this.curSize || this.startBox;
            var x = this.startBox.x, y = this.startBox.y;
            var ox = x, oy = y;
            var w = curSize.width, h = curSize.height;
            var ow = w, oh = h;
            var mw = this.minWidth, mh = this.minHeight;
            var mxw = this.maxWidth, mxh = this.maxHeight;
            var wi = this.widthIncrement;
            var hi = this.heightIncrement;

            var eventXY = e.getXY();
            var diffX = -(this.startPoint[0] - Math.max(this.minX, eventXY[0]));
            var diffY = -(this.startPoint[1] - Math.max(this.minY, eventXY[1]));

            var pos = this.activeHandle.position;

            switch(pos){
                case "east":
                    w += diffX;
                    w = Math.min(Math.max(mw, w), mxw);
                    break;
                case "south":
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "southeast":
                    w += diffX;
                    h += diffY;
                    w = Math.min(Math.max(mw, w), mxw);
                    h = Math.min(Math.max(mh, h), mxh);
                    break;
                case "north":
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "west":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    x += diffX;
                    w -= diffX;
                    break;
                case "northeast":
                    w += diffX;
                    w = Math.min(Math.max(mw, w), mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    break;
                case "northwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    diffY = this.constrain(h, diffY, mh, mxh);
                    y += diffY;
                    h -= diffY;
                    x += diffX;
                    w -= diffX;
                    break;
               case "southwest":
                    diffX = this.constrain(w, diffX, mw, mxw);
                    h += diffY;
                    h = Math.min(Math.max(mh, h), mxh);
                    x += diffX;
                    w -= diffX;
                    break;
            }

            var sw = this.snap(w, wi, mw);
            var sh = this.snap(h, hi, mh);
            if(sw != w || sh != h){
                switch(pos){
                    case "northeast":
                        y -= sh - h;
                    break;
                    case "north":
                        y -= sh - h;
                        break;
                    case "southwest":
                        x -= sw - w;
                    break;
                    case "west":
                        x -= sw - w;
                        break;
                    case "northwest":
                        x -= sw - w;
                        y -= sh - h;
                    break;
                }
                w = sw;
                h = sh;
            }

            if(this.preserveRatio){
                switch(pos){
                    case "southeast":
                    case "east":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                       break;
                    case "south":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        break;
                    case "northeast":
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                    break;
                    case "north":
                        var tw = w;
                        w = ow * (h/oh);
                        w = Math.min(Math.max(mw, w), mxw);
                        h = oh * (w/ow);
                        x += (tw - w) / 2;
                        break;
                    case "southwest":
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                        break;
                    case "west":
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        y += (th - h) / 2;
                        var tw = w;
                        w = ow * (h/oh);
                        x += tw - w;
                       break;
                    case "northwest":
                        var tw = w;
                        var th = h;
                        h = oh * (w/ow);
                        h = Math.min(Math.max(mh, h), mxh);
                        w = ow * (h/oh);
                        y += th - h;
                         x += tw - w;
                       break;

                }
            }
            this.proxy.setBounds(x, y, w, h);
            if(this.dynamic){
                this.resizeElement();
            }
            }catch(e){}
        }
    },

    // private
    handleOver : function(){
        if(this.enabled){
            this.el.addClass("x-resizable-over");
        }
    },

    // private
    handleOut : function(){
        if(!this.resizing){
            this.el.removeClass("x-resizable-over");
        }
    },

    /**
     * Returns the element this component is bound to.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.el;
    },

    /**
     * Returns the resizeChild element (or null).
     * @return {Roo.Element}
     */
    getResizeChild : function(){
        return this.resizeChild;
    },

    /**
     * Destroys this resizable. If the element was wrapped and
     * removeEl is not true then the element remains.
     * @param {Boolean} removeEl (optional) true to remove the element from the DOM
     */
    destroy : function(removeEl){
        this.proxy.remove();
        if(this.overlay){
            this.overlay.removeAllListeners();
            this.overlay.remove();
        }
        var ps = Roo.Resizable.positions;
        for(var k in ps){
            if(typeof ps[k] != "function" && this[ps[k]]){
                var h = this[ps[k]];
                h.el.removeAllListeners();
                h.el.remove();
            }
        }
        if(removeEl){
            this.el.update("");
            this.el.remove();
        }
    }
});

// private
// hash to map config positions to true positions
Roo.Resizable.positions = {
    n: "north", s: "south", e: "east", w: "west", se: "southeast", sw: "southwest", nw: "northwest", ne: "northeast"
};

// private
Roo.Resizable.Handle = function(rz, pos, disableTrackOver, transparent){
    if(!this.tpl){
        // only initialize the template if resizable is used
        var tpl = Roo.DomHelper.createTemplate(
            {tag: "div", cls: "x-resizable-handle x-resizable-handle-{0}"}
        );
        tpl.compile();
        Roo.Resizable.Handle.prototype.tpl = tpl;
    }
    this.position = pos;
    this.rz = rz;
    this.el = this.tpl.append(rz.el.dom, [this.position], true);
    this.el.unselectable();
    if(transparent){
        this.el.setOpacity(0);
    }
    this.el.on("mousedown", this.onMouseDown, this);
    if(!disableTrackOver){
        this.el.on("mouseover", this.onMouseOver, this);
        this.el.on("mouseout", this.onMouseOut, this);
    }
};

// private
Roo.Resizable.Handle.prototype = {
    afterResize : function(rz){
        // do nothing
    },
    // private
    onMouseDown : function(e){
        this.rz.onMouseDown(this, e);
    },
    // private
    onMouseOver : function(e){
        this.rz.handleOver(this, e);
    },
    // private
    onMouseOut : function(e){
        this.rz.handleOut(this, e);
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
 * @class Roo.Editor
 * @extends Roo.Component
 * A base editor field that handles displaying/hiding on demand and has some built-in sizing and event handling logic.
 * @constructor
 * Create a new Editor
 * @param {Roo.form.Field} field The Field object (or descendant)
 * @param {Object} config The config object
 */
Roo.Editor = function(field, config){
    Roo.Editor.superclass.constructor.call(this, config);
    this.field = field;
    this.addEvents({
        /**
	     * @event beforestartedit
	     * Fires when editing is initiated, but before the value changes.  Editing can be canceled by returning
	     * false from the handler of this event.
	     * @param {Editor} this
	     * @param {Roo.Element} boundEl The underlying element bound to this editor
	     * @param {Mixed} value The field value being set
	     */
        "beforestartedit" : true,
        /**
	     * @event startedit
	     * Fires when this editor is displayed
	     * @param {Roo.Element} boundEl The underlying element bound to this editor
	     * @param {Mixed} value The starting field value
	     */
        "startedit" : true,
        /**
	     * @event beforecomplete
	     * Fires after a change has been made to the field, but before the change is reflected in the underlying
	     * field.  Saving the change to the field can be canceled by returning false from the handler of this event.
	     * Note that if the value has not changed and ignoreNoChange = true, the editing will still end but this
	     * event will not fire since no edit actually occurred.
	     * @param {Editor} this
	     * @param {Mixed} value The current field value
	     * @param {Mixed} startValue The original field value
	     */
        "beforecomplete" : true,
        /**
	     * @event complete
	     * Fires after editing is complete and any changed value has been written to the underlying field.
	     * @param {Editor} this
	     * @param {Mixed} value The current field value
	     * @param {Mixed} startValue The original field value
	     */
        "complete" : true,
        /**
         * @event specialkey
         * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
         * {@link Roo.EventObject#getKey} to determine which key was pressed.
         * @param {Roo.form.Field} this
         * @param {Roo.EventObject} e The event object
         */
        "specialkey" : true
    });
};

Roo.extend(Roo.Editor, Roo.Component, {
    /**
     * @cfg {Boolean/String} autosize
     * True for the editor to automatically adopt the size of the underlying field, "width" to adopt the width only,
     * or "height" to adopt the height only (defaults to false)
     */
    /**
     * @cfg {Boolean} revertInvalid
     * True to automatically revert the field value and cancel the edit when the user completes an edit and the field
     * validation fails (defaults to true)
     */
    /**
     * @cfg {Boolean} ignoreNoChange
     * True to skip the the edit completion process (no save, no events fired) if the user completes an edit and
     * the value has not changed (defaults to false).  Applies only to string values - edits for other data types
     * will never be ignored.
     */
    /**
     * @cfg {Boolean} hideEl
     * False to keep the bound element visible while the editor is displayed (defaults to true)
     */
    /**
     * @cfg {Mixed} value
     * The data value of the underlying field (defaults to "")
     */
    value : "",
    /**
     * @cfg {String} alignment
     * The position to align to (see {@link Roo.Element#alignTo} for more details, defaults to "c-c?").
     */
    alignment: "c-c?",
    /**
     * @cfg {Boolean/String} shadow "sides" for sides/bottom only, "frame" for 4-way shadow, and "drop"
     * for bottom-right shadow (defaults to "frame")
     */
    shadow : "frame",
    /**
     * @cfg {Boolean} constrain True to constrain the editor to the viewport
     */
    constrain : false,
    /**
     * @cfg {Boolean} completeOnEnter True to complete the edit when the enter key is pressed (defaults to false)
     */
    completeOnEnter : false,
    /**
     * @cfg {Boolean} cancelOnEsc True to cancel the edit when the escape key is pressed (defaults to false)
     */
    cancelOnEsc : false,
    /**
     * @cfg {Boolean} updateEl True to update the innerHTML of the bound element when the update completes (defaults to false)
     */
    updateEl : false,

    // private
    onRender : function(ct, position){
        this.el = new Roo.Layer({
            shadow: this.shadow,
            cls: "x-editor",
            parentEl : ct,
            shim : this.shim,
            shadowOffset:4,
            id: this.id,
            constrain: this.constrain
        });
        this.el.setStyle("overflow", Roo.isGecko ? "auto" : "hidden");
        if(this.field.msgTarget != 'title'){
            this.field.msgTarget = 'qtip';
        }
        this.field.render(this.el);
        if(Roo.isGecko){
            this.field.el.dom.setAttribute('autocomplete', 'off');
        }
        this.field.on("specialkey", this.onSpecialKey, this);
        if(this.swallowKeys){
            this.field.el.swallowEvent(['keydown','keypress']);
        }
        this.field.show();
        this.field.on("blur", this.onBlur, this);
        if(this.field.grow){
            this.field.on("autosize", this.el.sync,  this.el, {delay:1});
        }
    },

    onSpecialKey : function(field, e){
        if(this.completeOnEnter && e.getKey() == e.ENTER){
            e.stopEvent();
            this.completeEdit();
        }else if(this.cancelOnEsc && e.getKey() == e.ESC){
            this.cancelEdit();
        }else{
            this.fireEvent('specialkey', field, e);
        }
    },

    /**
     * Starts the editing process and shows the editor.
     * @param {String/HTMLElement/Element} el The element to edit
     * @param {String} value (optional) A value to initialize the editor with. If a value is not provided, it defaults
      * to the innerHTML of el.
     */
    startEdit : function(el, value){
        if(this.editing){
            this.completeEdit();
        }
        this.boundEl = Roo.get(el);
        var v = value !== undefined ? value : this.boundEl.dom.innerHTML;
        if(!this.rendered){
            this.render(this.parentEl || document.body);
        }
        if(this.fireEvent("beforestartedit", this, this.boundEl, v) === false){
            return;
        }
        this.startValue = v;
        this.field.setValue(v);
        if(this.autoSize){
            var sz = this.boundEl.getSize();
            switch(this.autoSize){
                case "width":
                this.setSize(sz.width,  "");
                break;
                case "height":
                this.setSize("",  sz.height);
                break;
                default:
                this.setSize(sz.width,  sz.height);
            }
        }
        this.el.alignTo(this.boundEl, this.alignment);
        this.editing = true;
        if(Roo.QuickTips){
            Roo.QuickTips.disable();
        }
        this.show();
    },

    /**
     * Sets the height and width of this editor.
     * @param {Number} width The new width
     * @param {Number} height The new height
     */
    setSize : function(w, h){
        this.field.setSize(w, h);
        if(this.el){
            this.el.sync();
        }
    },

    /**
     * Realigns the editor to the bound field based on the current alignment config value.
     */
    realign : function(){
        this.el.alignTo(this.boundEl, this.alignment);
    },

    /**
     * Ends the editing process, persists the changed value to the underlying field, and hides the editor.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after edit (defaults to false)
     */
    completeEdit : function(remainVisible){
        if(!this.editing){
            return;
        }
        var v = this.getValue();
        if(this.revertInvalid !== false && !this.field.isValid()){
            v = this.startValue;
            this.cancelEdit(true);
        }
        if(String(v) === String(this.startValue) && this.ignoreNoChange){
            this.editing = false;
            this.hide();
            return;
        }
        if(this.fireEvent("beforecomplete", this, v, this.startValue) !== false){
            this.editing = false;
            if(this.updateEl && this.boundEl){
                this.boundEl.update(v);
            }
            if(remainVisible !== true){
                this.hide();
            }
            this.fireEvent("complete", this, v, this.startValue);
        }
    },

    // private
    onShow : function(){
        this.el.show();
        if(this.hideEl !== false){
            this.boundEl.hide();
        }
        this.field.show();
        if(Roo.isIE && !this.fixIEFocus){ // IE has problems with focusing the first time
            this.fixIEFocus = true;
            this.deferredFocus.defer(50, this);
        }else{
            this.field.focus();
        }
        this.fireEvent("startedit", this.boundEl, this.startValue);
    },

    deferredFocus : function(){
        if(this.editing){
            this.field.focus();
        }
    },

    /**
     * Cancels the editing process and hides the editor without persisting any changes.  The field value will be
     * reverted to the original starting value.
     * @param {Boolean} remainVisible Override the default behavior and keep the editor visible after
     * cancel (defaults to false)
     */
    cancelEdit : function(remainVisible){
        if(this.editing){
            this.setValue(this.startValue);
            if(remainVisible !== true){
                this.hide();
            }
        }
    },

    // private
    onBlur : function(){
        if(this.allowBlur !== true && this.editing){
            this.completeEdit();
        }
    },

    // private
    onHide : function(){
        if(this.editing){
            this.completeEdit();
            return;
        }
        this.field.blur();
        if(this.field.collapse){
            this.field.collapse();
        }
        this.el.hide();
        if(this.hideEl !== false){
            this.boundEl.show();
        }
        if(Roo.QuickTips){
            Roo.QuickTips.enable();
        }
    },

    /**
     * Sets the data value of the editor
     * @param {Mixed} value Any valid value supported by the underlying field
     */
    setValue : function(v){
        this.field.setValue(v);
    },

    /**
     * Gets the data value of the editor
     * @return {Mixed} The data value
     */
    getValue : function(){
        return this.field.getValue();
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
 * @class Roo.BasicDialog
 * @extends Roo.util.Observable
 * Lightweight Dialog Class.  The code below shows the creation of a typical dialog using existing HTML markup:
 * <pre><code>
var dlg = new Roo.BasicDialog("my-dlg", {
    height: 200,
    width: 300,
    minHeight: 100,
    minWidth: 150,
    modal: true,
    proxyDrag: true,
    shadow: true
});
dlg.addKeyListener(27, dlg.hide, dlg); // ESC can also close the dialog
dlg.addButton('OK', dlg.hide, dlg);    // Could call a save function instead of hiding
dlg.addButton('Cancel', dlg.hide, dlg);
dlg.show();
</code></pre>
  <b>A Dialog should always be a direct child of the body element.</b>
 * @cfg {Boolean/DomHelper} autoCreate True to auto create from scratch, or using a DomHelper Object (defaults to false)
 * @cfg {String} title Default text to display in the title bar (defaults to null)
 * @cfg {Number} width Width of the dialog in pixels (can also be set via CSS).  Determined by browser if unspecified.
 * @cfg {Number} height Height of the dialog in pixels (can also be set via CSS).  Determined by browser if unspecified.
 * @cfg {Number} x The default left page coordinate of the dialog (defaults to center screen)
 * @cfg {Number} y The default top page coordinate of the dialog (defaults to center screen)
 * @cfg {String/Element} animateTarget Id or element from which the dialog should animate while opening
 * (defaults to null with no animation)
 * @cfg {Boolean} resizable False to disable manual dialog resizing (defaults to true)
 * @cfg {String} resizeHandles Which resize handles to display - see the {@link Roo.Resizable} handles config
 * property for valid values (defaults to 'all')
 * @cfg {Number} minHeight The minimum allowable height for a resizable dialog (defaults to 80)
 * @cfg {Number} minWidth The minimum allowable width for a resizable dialog (defaults to 200)
 * @cfg {Boolean} modal True to show the dialog modally, preventing user interaction with the rest of the page (defaults to false)
 * @cfg {Boolean} autoScroll True to allow the dialog body contents to overflow and display scrollbars (defaults to false)
 * @cfg {Boolean} closable False to remove the built-in top-right corner close button (defaults to true)
 * @cfg {Boolean} collapsible False to remove the built-in top-right corner collapse button (defaults to true)
 * @cfg {Boolean} constraintoviewport True to keep the dialog constrained within the visible viewport boundaries (defaults to true)
 * @cfg {Boolean} syncHeightBeforeShow True to cause the dimensions to be recalculated before the dialog is shown (defaults to false)
 * @cfg {Boolean} draggable False to disable dragging of the dialog within the viewport (defaults to true)
 * @cfg {Boolean} autoTabs If true, all elements with class 'x-dlg-tab' will get automatically converted to tabs (defaults to false)
 * @cfg {String} tabTag The tag name of tab elements, used when autoTabs = true (defaults to 'div')
 * @cfg {Boolean} proxyDrag True to drag a lightweight proxy element rather than the dialog itself, used when
 * draggable = true (defaults to false)
 * @cfg {Boolean} fixedcenter True to ensure that anytime the dialog is shown or resized it gets centered (defaults to false)
 * @cfg {Boolean/String} shadow True or "sides" for the default effect, "frame" for 4-way shadow, and "drop" for bottom-right
 * shadow (defaults to false)
 * @cfg {Number} shadowOffset The number of pixels to offset the shadow if displayed (defaults to 5)
 * @cfg {String} buttonAlign Valid values are "left," "center" and "right" (defaults to "right")
 * @cfg {Number} minButtonWidth Minimum width of all dialog buttons (defaults to 75)
 * @cfg {Array} buttons Array of buttons
 * @cfg {Boolean} shim True to create an iframe shim that prevents selects from showing through (defaults to false)
 * @constructor
 * Create a new BasicDialog.
 * @param {String/HTMLElement/Roo.Element} el The container element or DOM node, or its id
 * @param {Object} config Configuration options
 */
Roo.BasicDialog = function(el, config){
    this.el = Roo.get(el);
    var dh = Roo.DomHelper;
    if(!this.el && config && config.autoCreate){
        if(typeof config.autoCreate == "object"){
            if(!config.autoCreate.id){
                config.autoCreate.id = el;
            }
            this.el = dh.append(document.body,
                        config.autoCreate, true);
        }else{
            this.el = dh.append(document.body,
                        {tag: "div", id: el, style:'visibility:hidden;'}, true);
        }
    }
    el = this.el;
    el.setDisplayed(true);
    el.hide = this.hideAction;
    this.id = el.id;
    el.addClass("x-dlg");

    Roo.apply(this, config);

    this.proxy = el.createProxy("x-dlg-proxy");
    this.proxy.hide = this.hideAction;
    this.proxy.setOpacity(.5);
    this.proxy.hide();

    if(config.width){
        el.setWidth(config.width);
    }
    if(config.height){
        el.setHeight(config.height);
    }
    this.size = el.getSize();
    if(typeof config.x != "undefined" && typeof config.y != "undefined"){
        this.xy = [config.x,config.y];
    }else{
        this.xy = el.getCenterXY(true);
    }
    /** The header element @type Roo.Element */
    this.header = el.child("> .x-dlg-hd");
    /** The body element @type Roo.Element */
    this.body = el.child("> .x-dlg-bd");
    /** The footer element @type Roo.Element */
    this.footer = el.child("> .x-dlg-ft");

    if(!this.header){
        this.header = el.createChild({tag: "div", cls:"x-dlg-hd", html: "&#160;"}, this.body ? this.body.dom : null);
    }
    if(!this.body){
        this.body = el.createChild({tag: "div", cls:"x-dlg-bd"});
    }

    this.header.unselectable();
    if(this.title){
        this.header.update(this.title);
    }
    // this element allows the dialog to be focused for keyboard event
    this.focusEl = el.createChild({tag: "a", href:"#", cls:"x-dlg-focus", tabIndex:"-1"});
    this.focusEl.swallowEvent("click", true);

    this.header.wrap({cls:"x-dlg-hd-right"}).wrap({cls:"x-dlg-hd-left"}, true);

    // wrap the body and footer for special rendering
    this.bwrap = this.body.wrap({tag: "div", cls:"x-dlg-dlg-body"});
    if(this.footer){
        this.bwrap.dom.appendChild(this.footer.dom);
    }

    this.bg = this.el.createChild({
        tag: "div", cls:"x-dlg-bg",
        html: '<div class="x-dlg-bg-left"><div class="x-dlg-bg-right"><div class="x-dlg-bg-center">&#160;</div></div></div>'
    });
    this.centerBg = this.bg.child("div.x-dlg-bg-center");


    if(this.autoScroll !== false && !this.autoTabs){
        this.body.setStyle("overflow", "auto");
    }

    this.toolbox = this.el.createChild({cls: "x-dlg-toolbox"});

    if(this.closable !== false){
        this.el.addClass("x-dlg-closable");
        this.close = this.toolbox.createChild({cls:"x-dlg-close"});
        this.close.on("click", this.closeClick, this);
        this.close.addClassOnOver("x-dlg-close-over");
    }
    if(this.collapsible !== false){
        this.collapseBtn = this.toolbox.createChild({cls:"x-dlg-collapse"});
        this.collapseBtn.on("click", this.collapseClick, this);
        this.collapseBtn.addClassOnOver("x-dlg-collapse-over");
        this.header.on("dblclick", this.collapseClick, this);
    }
    if(this.resizable !== false){
        this.el.addClass("x-dlg-resizable");
        this.resizer = new Roo.Resizable(el, {
            minWidth: this.minWidth || 80,
            minHeight:this.minHeight || 80,
            handles: this.resizeHandles || "all",
            pinned: true
        });
        this.resizer.on("beforeresize", this.beforeResize, this);
        this.resizer.on("resize", this.onResize, this);
    }
    if(this.draggable !== false){
        el.addClass("x-dlg-draggable");
        if (!this.proxyDrag) {
            var dd = new Roo.dd.DD(el.dom.id, "WindowDrag");
        }
        else {
            var dd = new Roo.dd.DDProxy(el.dom.id, "WindowDrag", {dragElId: this.proxy.id});
        }
        dd.setHandleElId(this.header.id);
        dd.endDrag = this.endMove.createDelegate(this);
        dd.startDrag = this.startMove.createDelegate(this);
        dd.onDrag = this.onDrag.createDelegate(this);
        dd.scroll = false;
        this.dd = dd;
    }
    if(this.modal){
        this.mask = dh.append(document.body, {tag: "div", cls:"x-dlg-mask"}, true);
        this.mask.enableDisplayMode("block");
        this.mask.hide();
        this.el.addClass("x-dlg-modal");
    }
    if(this.shadow){
        this.shadow = new Roo.Shadow({
            mode : typeof this.shadow == "string" ? this.shadow : "sides",
            offset : this.shadowOffset
        });
    }else{
        this.shadowOffset = 0;
    }
    if(Roo.useShims && this.shim !== false){
        this.shim = this.el.createShim();
        this.shim.hide = this.hideAction;
        this.shim.hide();
    }else{
        this.shim = false;
    }
    if(this.autoTabs){
        this.initTabs();
    }
    if (this.buttons) { 
        var bts= this.buttons;
        this.buttons = [];
        Roo.each(bts, function(b) {
            this.addButton(b);
        }, this);
    }
    
    
    this.addEvents({
        /**
         * @event keydown
         * Fires when a key is pressed
         * @param {Roo.BasicDialog} this
         * @param {Roo.EventObject} e
         */
        "keydown" : true,
        /**
         * @event move
         * Fires when this dialog is moved by the user.
         * @param {Roo.BasicDialog} this
         * @param {Number} x The new page X
         * @param {Number} y The new page Y
         */
        "move" : true,
        /**
         * @event resize
         * Fires when this dialog is resized by the user.
         * @param {Roo.BasicDialog} this
         * @param {Number} width The new width
         * @param {Number} height The new height
         */
        "resize" : true,
        /**
         * @event beforehide
         * Fires before this dialog is hidden.
         * @param {Roo.BasicDialog} this
         */
        "beforehide" : true,
        /**
         * @event hide
         * Fires when this dialog is hidden.
         * @param {Roo.BasicDialog} this
         */
        "hide" : true,
        /**
         * @event beforeshow
         * Fires before this dialog is shown.
         * @param {Roo.BasicDialog} this
         */
        "beforeshow" : true,
        /**
         * @event show
         * Fires when this dialog is shown.
         * @param {Roo.BasicDialog} this
         */
        "show" : true
    });
    el.on("keydown", this.onKeyDown, this);
    el.on("mousedown", this.toFront, this);
    Roo.EventManager.onWindowResize(this.adjustViewport, this, true);
    this.el.hide();
    Roo.DialogManager.register(this);
    Roo.BasicDialog.superclass.constructor.call(this);
};

Roo.extend(Roo.BasicDialog, Roo.util.Observable, {
    shadowOffset: Roo.isIE ? 6 : 5,
    minHeight: 80,
    minWidth: 200,
    minButtonWidth: 75,
    defaultButton: null,
    buttonAlign: "right",
    tabTag: 'div',
    firstShow: true,

    /**
     * Sets the dialog title text
     * @param {String} text The title text to display
     * @return {Roo.BasicDialog} this
     */
    setTitle : function(text){
        this.header.update(text);
        return this;
    },

    // private
    closeClick : function(){
        this.hide();
    },

    // private
    collapseClick : function(){
        this[this.collapsed ? "expand" : "collapse"]();
    },

    /**
     * Collapses the dialog to its minimized state (only the title bar is visible).
     * Equivalent to the user clicking the collapse dialog button.
     */
    collapse : function(){
        if(!this.collapsed){
            this.collapsed = true;
            this.el.addClass("x-dlg-collapsed");
            this.restoreHeight = this.el.getHeight();
            this.resizeTo(this.el.getWidth(), this.header.getHeight());
        }
    },

    /**
     * Expands a collapsed dialog back to its normal state.  Equivalent to the user
     * clicking the expand dialog button.
     */
    expand : function(){
        if(this.collapsed){
            this.collapsed = false;
            this.el.removeClass("x-dlg-collapsed");
            this.resizeTo(this.el.getWidth(), this.restoreHeight);
        }
    },

    /**
     * Reinitializes the tabs component, clearing out old tabs and finding new ones.
     * @return {Roo.TabPanel} The tabs component
     */
    initTabs : function(){
        var tabs = this.getTabs();
        while(tabs.getTab(0)){
            tabs.removeTab(0);
        }
        this.el.select(this.tabTag+'.x-dlg-tab').each(function(el){
            var dom = el.dom;
            tabs.addTab(Roo.id(dom), dom.title);
            dom.title = "";
        });
        tabs.activate(0);
        return tabs;
    },

    // private
    beforeResize : function(){
        this.resizer.minHeight = Math.max(this.minHeight, this.getHeaderFooterHeight(true)+40);
    },

    // private
    onResize : function(){
        this.refreshSize();
        this.syncBodyHeight();
        this.adjustAssets();
        this.focus();
        this.fireEvent("resize", this, this.size.width, this.size.height);
    },

    // private
    onKeyDown : function(e){
        if(this.isVisible()){
            this.fireEvent("keydown", this, e);
        }
    },

    /**
     * Resizes the dialog.
     * @param {Number} width
     * @param {Number} height
     * @return {Roo.BasicDialog} this
     */
    resizeTo : function(width, height){
        this.el.setSize(width, height);
        this.size = {width: width, height: height};
        this.syncBodyHeight();
        if(this.fixedcenter){
            this.center();
        }
        if(this.isVisible()){
            this.constrainXY();
            this.adjustAssets();
        }
        this.fireEvent("resize", this, width, height);
        return this;
    },


    /**
     * Resizes the dialog to fit the specified content size.
     * @param {Number} width
     * @param {Number} height
     * @return {Roo.BasicDialog} this
     */
    setContentSize : function(w, h){
        h += this.getHeaderFooterHeight() + this.body.getMargins("tb");
        w += this.body.getMargins("lr") + this.bwrap.getMargins("lr") + this.centerBg.getPadding("lr");
        //if(!this.el.isBorderBox()){
            h +=  this.body.getPadding("tb") + this.bwrap.getBorderWidth("tb") + this.body.getBorderWidth("tb") + this.el.getBorderWidth("tb");
            w += this.body.getPadding("lr") + this.bwrap.getBorderWidth("lr") + this.body.getBorderWidth("lr") + this.bwrap.getPadding("lr") + this.el.getBorderWidth("lr");
        //}
        if(this.tabs){
            h += this.tabs.stripWrap.getHeight() + this.tabs.bodyEl.getMargins("tb") + this.tabs.bodyEl.getPadding("tb");
            w += this.tabs.bodyEl.getMargins("lr") + this.tabs.bodyEl.getPadding("lr");
        }
        this.resizeTo(w, h);
        return this;
    },

    /**
     * Adds a key listener for when this dialog is displayed.  This allows you to hook in a function that will be
     * executed in response to a particular key being pressed while the dialog is active.
     * @param {Number/Array/Object} key Either the numeric key code, array of key codes or an object with the following options:
     *                                  {key: (number or array), shift: (true/false), ctrl: (true/false), alt: (true/false)}
     * @param {Function} fn The function to call
     * @param {Object} scope (optional) The scope of the function
     * @return {Roo.BasicDialog} this
     */
    addKeyListener : function(key, fn, scope){
        var keyCode, shift, ctrl, alt;
        if(typeof key == "object" && !(key instanceof Array)){
            keyCode = key["key"];
            shift = key["shift"];
            ctrl = key["ctrl"];
            alt = key["alt"];
        }else{
            keyCode = key;
        }
        var handler = function(dlg, e){
            if((!shift || e.shiftKey) && (!ctrl || e.ctrlKey) &&  (!alt || e.altKey)){
                var k = e.getKey();
                if(keyCode instanceof Array){
                    for(var i = 0, len = keyCode.length; i < len; i++){
                        if(keyCode[i] == k){
                          fn.call(scope || window, dlg, k, e);
                          return;
                        }
                    }
                }else{
                    if(k == keyCode){
                        fn.call(scope || window, dlg, k, e);
                    }
                }
            }
        };
        this.on("keydown", handler);
        return this;
    },

    /**
     * Returns the TabPanel component (creates it if it doesn't exist).
     * Note: If you wish to simply check for the existence of tabs without creating them,
     * check for a null 'tabs' property.
     * @return {Roo.TabPanel} The tabs component
     */
    getTabs : function(){
        if(!this.tabs){
            this.el.addClass("x-dlg-auto-tabs");
            this.body.addClass(this.tabPosition == "bottom" ? "x-tabs-bottom" : "x-tabs-top");
            this.tabs = new Roo.TabPanel(this.body.dom, this.tabPosition == "bottom");
        }
        return this.tabs;
    },

    /**
     * Adds a button to the footer section of the dialog.
     * @param {String/Object} config A string becomes the button text, an object can either be a Button config
     * object or a valid Roo.DomHelper element config
     * @param {Function} handler The function called when the button is clicked
     * @param {Object} scope (optional) The scope of the handler function (accepts position as a property)
     * @return {Roo.Button} The new button
     */
    addButton : function(config, handler, scope){
        var dh = Roo.DomHelper;
        if(!this.footer){
            this.footer = dh.append(this.bwrap, {tag: "div", cls:"x-dlg-ft"}, true);
        }
        if(!this.btnContainer){
            var tb = this.footer.createChild({

                cls:"x-dlg-btns x-dlg-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }, null, true);
            this.btnContainer = tb.firstChild.firstChild.firstChild;
        }
        var bconfig = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bconfig.text = config;
        }else{
            if(config.tag){
                bconfig.dhconfig = config;
            }else{
                Roo.apply(bconfig, config);
            }
        }
        var fc = false;
        if ((typeof(bconfig.position) != 'undefined') && bconfig.position < this.btnContainer.childNodes.length-1) {
            bconfig.position = Math.max(0, bconfig.position);
            fc = this.btnContainer.childNodes[bconfig.position];
        }
         
        var btn = new Roo.Button(
            fc ? 
                this.btnContainer.insertBefore(document.createElement("td"),fc)
                : this.btnContainer.appendChild(document.createElement("td")),
            //Roo.get(this.btnContainer).createChild( { tag: 'td'},  fc ),
            bconfig
        );
        this.syncBodyHeight();
        if(!this.buttons){
            /**
             * Array of all the buttons that have been added to this dialog via addButton
             * @type Array
             */
            this.buttons = [];
        }
        this.buttons.push(btn);
        return btn;
    },

    /**
     * Sets the default button to be focused when the dialog is displayed.
     * @param {Roo.BasicDialog.Button} btn The button object returned by {@link #addButton}
     * @return {Roo.BasicDialog} this
     */
    setDefaultButton : function(btn){
        this.defaultButton = btn;
        return this;
    },

    // private
    getHeaderFooterHeight : function(safe){
        var height = 0;
        if(this.header){
           height += this.header.getHeight();
        }
        if(this.footer){
           var fm = this.footer.getMargins();
            height += (this.footer.getHeight()+fm.top+fm.bottom);
        }
        height += this.bwrap.getPadding("tb")+this.bwrap.getBorderWidth("tb");
        height += this.centerBg.getPadding("tb");
        return height;
    },

    // private
    syncBodyHeight : function(){
        var bd = this.body, cb = this.centerBg, bw = this.bwrap;
        var height = this.size.height - this.getHeaderFooterHeight(false);
        bd.setHeight(height-bd.getMargins("tb"));
        var hh = this.header.getHeight();
        var h = this.size.height-hh;
        cb.setHeight(h);
        bw.setLeftTop(cb.getPadding("l"), hh+cb.getPadding("t"));
        bw.setHeight(h-cb.getPadding("tb"));
        bw.setWidth(this.el.getWidth(true)-cb.getPadding("lr"));
        bd.setWidth(bw.getWidth(true));
        if(this.tabs){
            this.tabs.syncHeight();
            if(Roo.isIE){
                this.tabs.el.repaint();
            }
        }
    },

    /**
     * Restores the previous state of the dialog if Roo.state is configured.
     * @return {Roo.BasicDialog} this
     */
    restoreState : function(){
        var box = Roo.state.Manager.get(this.stateId || (this.el.id + "-state"));
        if(box && box.width){
            this.xy = [box.x, box.y];
            this.resizeTo(box.width, box.height);
        }
        return this;
    },

    // private
    beforeShow : function(){
        this.expand();
        if(this.fixedcenter){
            this.xy = this.el.getCenterXY(true);
        }
        if(this.modal){
            Roo.get(document.body).addClass("x-body-masked");
            this.mask.setSize(Roo.lib.Dom.getViewWidth(true), Roo.lib.Dom.getViewHeight(true));
            this.mask.show();
        }
        this.constrainXY();
    },

    // private
    animShow : function(){
        var b = Roo.get(this.animateTarget, true).getBox();
        this.proxy.setSize(b.width, b.height);
        this.proxy.setLocation(b.x, b.y);
        this.proxy.show();
        this.proxy.setBounds(this.xy[0], this.xy[1], this.size.width, this.size.height,
                    true, .35, this.showEl.createDelegate(this));
    },

    /**
     * Shows the dialog.
     * @param {String/HTMLElement/Roo.Element} animateTarget (optional) Reset the animation target
     * @return {Roo.BasicDialog} this
     */
    show : function(animateTarget){
        if (this.fireEvent("beforeshow", this) === false){
            return;
        }
        if(this.syncHeightBeforeShow){
            this.syncBodyHeight();
        }else if(this.firstShow){
            this.firstShow = false;
            this.syncBodyHeight(); // sync the height on the first show instead of in the constructor
        }
        this.animateTarget = animateTarget || this.animateTarget;
        if(!this.el.isVisible()){
            this.beforeShow();
            if(this.animateTarget){
                this.animShow();
            }else{
                this.showEl();
            }
        }
        return this;
    },

    // private
    showEl : function(){
        this.proxy.hide();
        this.el.setXY(this.xy);
        this.el.show();
        this.adjustAssets(true);
        this.toFront();
        this.focus();
        // IE peekaboo bug - fix found by Dave Fenwick
        if(Roo.isIE){
            this.el.repaint();
        }
        this.fireEvent("show", this);
    },

    /**
     * Focuses the dialog.  If a defaultButton is set, it will receive focus, otherwise the
     * dialog itself will receive focus.
     */
    focus : function(){
        if(this.defaultButton){
            this.defaultButton.focus();
        }else{
            this.focusEl.focus();
        }
    },

    // private
    constrainXY : function(){
        if(this.constraintoviewport !== false){
            if(!this.viewSize){
                if(this.container){
                    var s = this.container.getSize();
                    this.viewSize = [s.width, s.height];
                }else{
                    this.viewSize = [Roo.lib.Dom.getViewWidth(),Roo.lib.Dom.getViewHeight()];
                }
            }
            var s = Roo.get(this.container||document).getScroll();

            var x = this.xy[0], y = this.xy[1];
            var w = this.size.width, h = this.size.height;
            var vw = this.viewSize[0], vh = this.viewSize[1];
            // only move it if it needs it
            var moved = false;
            // first validate right/bottom
            if(x + w > vw+s.left){
                x = vw - w;
                moved = true;
            }
            if(y + h > vh+s.top){
                y = vh - h;
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
                // cache xy
                this.xy = [x, y];
                if(this.isVisible()){
                    this.el.setLocation(x, y);
                    this.adjustAssets();
                }
            }
        }
    },

    // private
    onDrag : function(){
        if(!this.proxyDrag){
            this.xy = this.el.getXY();
            this.adjustAssets();
        }
    },

    // private
    adjustAssets : function(doShow){
        var x = this.xy[0], y = this.xy[1];
        var w = this.size.width, h = this.size.height;
        if(doShow === true){
            if(this.shadow){
                this.shadow.show(this.el);
            }
            if(this.shim){
                this.shim.show();
            }
        }
        if(this.shadow && this.shadow.isVisible()){
            this.shadow.show(this.el);
        }
        if(this.shim && this.shim.isVisible()){
            this.shim.setBounds(x, y, w, h);
        }
    },

    // private
    adjustViewport : function(w, h){
        if(!w || !h){
            w = Roo.lib.Dom.getViewWidth();
            h = Roo.lib.Dom.getViewHeight();
        }
        // cache the size
        this.viewSize = [w, h];
        if(this.modal && this.mask.isVisible()){
            this.mask.setSize(w, h); // first make sure the mask isn't causing overflow
            this.mask.setSize(Roo.lib.Dom.getViewWidth(true), Roo.lib.Dom.getViewHeight(true));
        }
        if(this.isVisible()){
            this.constrainXY();
        }
    },

    /**
     * Destroys this dialog and all its supporting elements (including any tabs, shim,
     * shadow, proxy, mask, etc.)  Also removes all event listeners.
     * @param {Boolean} removeEl (optional) true to remove the element from the DOM
     */
    destroy : function(removeEl){
        if(this.isVisible()){
            this.animateTarget = null;
            this.hide();
        }
        Roo.EventManager.removeResizeListener(this.adjustViewport, this);
        if(this.tabs){
            this.tabs.destroy(removeEl);
        }
        Roo.destroy(
             this.shim,
             this.proxy,
             this.resizer,
             this.close,
             this.mask
        );
        if(this.dd){
            this.dd.unreg();
        }
        if(this.buttons){
           for(var i = 0, len = this.buttons.length; i < len; i++){
               this.buttons[i].destroy();
           }
        }
        this.el.removeAllListeners();
        if(removeEl === true){
            this.el.update("");
            this.el.remove();
        }
        Roo.DialogManager.unregister(this);
    },

    // private
    startMove : function(){
        if(this.proxyDrag){
            this.proxy.show();
        }
        if(this.constraintoviewport !== false){
            this.dd.constrainTo(document.body, {right: this.shadowOffset, bottom: this.shadowOffset});
        }
    },

    // private
    endMove : function(){
        if(!this.proxyDrag){
            Roo.dd.DD.prototype.endDrag.apply(this.dd, arguments);
        }else{
            Roo.dd.DDProxy.prototype.endDrag.apply(this.dd, arguments);
            this.proxy.hide();
        }
        this.refreshSize();
        this.adjustAssets();
        this.focus();
        this.fireEvent("move", this, this.xy[0], this.xy[1]);
    },

    /**
     * Brings this dialog to the front of any other visible dialogs
     * @return {Roo.BasicDialog} this
     */
    toFront : function(){
        Roo.DialogManager.bringToFront(this);
        return this;
    },

    /**
     * Sends this dialog to the back (under) of any other visible dialogs
     * @return {Roo.BasicDialog} this
     */
    toBack : function(){
        Roo.DialogManager.sendToBack(this);
        return this;
    },

    /**
     * Centers this dialog in the viewport
     * @return {Roo.BasicDialog} this
     */
    center : function(){
        var xy = this.el.getCenterXY(true);
        this.moveTo(xy[0], xy[1]);
        return this;
    },

    /**
     * Moves the dialog's top-left corner to the specified point
     * @param {Number} x
     * @param {Number} y
     * @return {Roo.BasicDialog} this
     */
    moveTo : function(x, y){
        this.xy = [x,y];
        if(this.isVisible()){
            this.el.setXY(this.xy);
            this.adjustAssets();
        }
        return this;
    },

    /**
     * Aligns the dialog to the specified element
     * @param {String/HTMLElement/Roo.Element} element The element to align to.
     * @param {String} position The position to align to (see {@link Roo.Element#alignTo} for more details).
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @return {Roo.BasicDialog} this
     */
    alignTo : function(element, position, offsets){
        this.xy = this.el.getAlignToXY(element, position, offsets);
        if(this.isVisible()){
            this.el.setXY(this.xy);
            this.adjustAssets();
        }
        return this;
    },

    /**
     * Anchors an element to another element and realigns it when the window is resized.
     * @param {String/HTMLElement/Roo.Element} element The element to align to.
     * @param {String} position The position to align to (see {@link Roo.Element#alignTo} for more details)
     * @param {Array} offsets (optional) Offset the positioning by [x, y]
     * @param {Boolean/Number} monitorScroll (optional) true to monitor body scroll and reposition. If this parameter
     * is a number, it is used as the buffer delay (defaults to 50ms).
     * @return {Roo.BasicDialog} this
     */
    anchorTo : function(el, alignment, offsets, monitorScroll){
        var action = function(){
            this.alignTo(el, alignment, offsets);
        };
        Roo.EventManager.onWindowResize(action, this);
        var tm = typeof monitorScroll;
        if(tm != 'undefined'){
            Roo.EventManager.on(window, 'scroll', action, this,
                {buffer: tm == 'number' ? monitorScroll : 50});
        }
        action.call(this);
        return this;
    },

    /**
     * Returns true if the dialog is visible
     * @return {Boolean}
     */
    isVisible : function(){
        return this.el.isVisible();
    },

    // private
    animHide : function(callback){
        var b = Roo.get(this.animateTarget).getBox();
        this.proxy.show();
        this.proxy.setBounds(this.xy[0], this.xy[1], this.size.width, this.size.height);
        this.el.hide();
        this.proxy.setBounds(b.x, b.y, b.width, b.height, true, .35,
                    this.hideEl.createDelegate(this, [callback]));
    },

    /**
     * Hides the dialog.
     * @param {Function} callback (optional) Function to call when the dialog is hidden
     * @return {Roo.BasicDialog} this
     */
    hide : function(callback){
        if (this.fireEvent("beforehide", this) === false){
            return;
        }
        if(this.shadow){
            this.shadow.hide();
        }
        if(this.shim) {
          this.shim.hide();
        }
        if(this.animateTarget){
           this.animHide(callback);
        }else{
            this.el.hide();
            this.hideEl(callback);
        }
        return this;
    },

    // private
    hideEl : function(callback){
        this.proxy.hide();
        if(this.modal){
            this.mask.hide();
            Roo.get(document.body).removeClass("x-body-masked");
        }
        this.fireEvent("hide", this);
        if(typeof callback == "function"){
            callback();
        }
    },

    // private
    hideAction : function(){
        this.setLeft("-10000px");
        this.setTop("-10000px");
        this.setStyle("visibility", "hidden");
    },

    // private
    refreshSize : function(){
        this.size = this.el.getSize();
        this.xy = this.el.getXY();
        Roo.state.Manager.set(this.stateId || this.el.id + "-state", this.el.getBox());
    },

    // private
    // z-index is managed by the DialogManager and may be overwritten at any time
    setZIndex : function(index){
        if(this.modal){
            this.mask.setStyle("z-index", index);
        }
        if(this.shim){
            this.shim.setStyle("z-index", ++index);
        }
        if(this.shadow){
            this.shadow.setZIndex(++index);
        }
        this.el.setStyle("z-index", ++index);
        if(this.proxy){
            this.proxy.setStyle("z-index", ++index);
        }
        if(this.resizer){
            this.resizer.proxy.setStyle("z-index", ++index);
        }

        this.lastZIndex = index;
    },

    /**
     * Returns the element for this dialog
     * @return {Roo.Element} The underlying dialog Element
     */
    getEl : function(){
        return this.el;
    }
});

/**
 * @class Roo.DialogManager
 * Provides global access to BasicDialogs that have been created and
 * support for z-indexing (layering) multiple open dialogs.
 */
Roo.DialogManager = function(){
    var list = {};
    var accessList = [];
    var front = null;

    // private
    var sortDialogs = function(d1, d2){
        return (!d1._lastAccess || d1._lastAccess < d2._lastAccess) ? -1 : 1;
    };

    // private
    var orderDialogs = function(){
        accessList.sort(sortDialogs);
        var seed = Roo.DialogManager.zseed;
        for(var i = 0, len = accessList.length; i < len; i++){
            var dlg = accessList[i];
            if(dlg){
                dlg.setZIndex(seed + (i*10));
            }
        }
    };

    return {
        /**
         * The starting z-index for BasicDialogs (defaults to 9000)
         * @type Number The z-index value
         */
        zseed : 9000,

        // private
        register : function(dlg){
            list[dlg.id] = dlg;
            accessList.push(dlg);
        },

        // private
        unregister : function(dlg){
            delete list[dlg.id];
            var i=0;
            var len=0;
            if(!accessList.indexOf){
                for(  i = 0, len = accessList.length; i < len; i++){
                    if(accessList[i] == dlg){
                        accessList.splice(i, 1);
                        return;
                    }
                }
            }else{
                 i = accessList.indexOf(dlg);
                if(i != -1){
                    accessList.splice(i, 1);
                }
            }
        },

        /**
         * Gets a registered dialog by id
         * @param {String/Object} id The id of the dialog or a dialog
         * @return {Roo.BasicDialog} this
         */
        get : function(id){
            return typeof id == "object" ? id : list[id];
        },

        /**
         * Brings the specified dialog to the front
         * @param {String/Object} dlg The id of the dialog or a dialog
         * @return {Roo.BasicDialog} this
         */
        bringToFront : function(dlg){
            dlg = this.get(dlg);
            if(dlg != front){
                front = dlg;
                dlg._lastAccess = new Date().getTime();
                orderDialogs();
            }
            return dlg;
        },

        /**
         * Sends the specified dialog to the back
         * @param {String/Object} dlg The id of the dialog or a dialog
         * @return {Roo.BasicDialog} this
         */
        sendToBack : function(dlg){
            dlg = this.get(dlg);
            dlg._lastAccess = -(new Date().getTime());
            orderDialogs();
            return dlg;
        },

        /**
         * Hides all dialogs
         */
        hideAll : function(){
            for(var id in list){
                if(list[id] && typeof list[id] != "function" && list[id].isVisible()){
                    list[id].hide();
                }
            }
        }
    };
}();

/**
 * @class Roo.LayoutDialog
 * @extends Roo.BasicDialog
 * Dialog which provides adjustments for working with a layout in a Dialog.
 * Add your necessary layout config options to the dialog's config.<br>
 * Example usage (including a nested layout):
 * <pre><code>
if(!dialog){
    dialog = new Roo.LayoutDialog("download-dlg", {
        modal: true,
        width:600,
        height:450,
        shadow:true,
        minWidth:500,
        minHeight:350,
        autoTabs:true,
        proxyDrag:true,
        // layout config merges with the dialog config
        center:{
            tabPosition: "top",
            alwaysShowTabs: true
        }
    });
    dialog.addKeyListener(27, dialog.hide, dialog);
    dialog.setDefaultButton(dialog.addButton("Close", dialog.hide, dialog));
    dialog.addButton("Build It!", this.getDownload, this);

    // we can even add nested layouts
    var innerLayout = new Roo.BorderLayout("dl-inner", {
        east: {
            initialSize: 200,
            autoScroll:true,
            split:true
        },
        center: {
            autoScroll:true
        }
    });
    innerLayout.beginUpdate();
    innerLayout.add("east", new Roo.ContentPanel("dl-details"));
    innerLayout.add("center", new Roo.ContentPanel("selection-panel"));
    innerLayout.endUpdate(true);

    var layout = dialog.getLayout();
    layout.beginUpdate();
    layout.add("center", new Roo.ContentPanel("standard-panel",
                        {title: "Download the Source", fitToFrame:true}));
    layout.add("center", new Roo.NestedLayoutPanel(innerLayout,
               {title: "Build your own roo.js"}));
    layout.getRegion("center").showPanel(sp);
    layout.endUpdate();
}
</code></pre>
    * @constructor
    * @param {String/HTMLElement/Roo.Element} el The id of or container element, or config
    * @param {Object} config configuration options
  */
Roo.LayoutDialog = function(el, cfg){
    
    var config=  cfg;
    if (typeof(cfg) == 'undefined') {
        config = Roo.apply({}, el);
        el = Roo.get( document.documentElement || document.body).createChild();
        //config.autoCreate = true;
    }
    
    
    config.autoTabs = false;
    Roo.LayoutDialog.superclass.constructor.call(this, el, config);
    this.body.setStyle({overflow:"hidden", position:"relative"});
    this.layout = new Roo.BorderLayout(this.body.dom, config);
    this.layout.monitorWindowResize = false;
    this.el.addClass("x-dlg-auto-layout");
    // fix case when center region overwrites center function
    this.center = Roo.BasicDialog.prototype.center;
    this.on("show", this.layout.layout, this.layout, true);
    if (config.items) {
        var xitems = config.items;
        delete config.items;
        Roo.each(xitems, this.addxtype, this);
    }
    
    
};
Roo.extend(Roo.LayoutDialog, Roo.BasicDialog, {
    /**
     * Ends update of the layout <strike>and resets display to none</strike>. Use standard beginUpdate/endUpdate on the layout.
     * @deprecated
     */
    endUpdate : function(){
        this.layout.endUpdate();
    },

    /**
     * Begins an update of the layout <strike>and sets display to block and visibility to hidden</strike>. Use standard beginUpdate/endUpdate on the layout.
     *  @deprecated
     */
    beginUpdate : function(){
        this.layout.beginUpdate();
    },

    /**
     * Get the BorderLayout for this dialog
     * @return {Roo.BorderLayout}
     */
    getLayout : function(){
        return this.layout;
    },

    showEl : function(){
        Roo.LayoutDialog.superclass.showEl.apply(this, arguments);
        if(Roo.isIE7){
            this.layout.layout();
        }
    },

    // private
    // Use the syncHeightBeforeShow config option to control this automatically
    syncBodyHeight : function(){
        Roo.LayoutDialog.superclass.syncBodyHeight.call(this);
        if(this.layout){this.layout.layout();}
    },
    
      /**
     * Add an xtype element (actually adds to the layout.)
     * @return {Object} xdata xtype object data.
     */
    
    addxtype : function(c) {
        return this.layout.addxtype(c);
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
 * @class Roo.MessageBox
 * Utility class for generating different styles of message boxes.  The alias Roo.Msg can also be used.
 * Example usage:
 *<pre><code>
// Basic alert:
Roo.Msg.alert('Status', 'Changes saved successfully.');

// Prompt for user data:
Roo.Msg.prompt('Name', 'Please enter your name:', function(btn, text){
    if (btn == 'ok'){
        // process text value...
    }
});

// Show a dialog using config options:
Roo.Msg.show({
   title:'Save Changes?',
   msg: 'Your are closing a tab that has unsaved changes. Would you like to save your changes?',
   buttons: Roo.Msg.YESNOCANCEL,
   fn: processResult,
   animEl: 'elId'
});
</code></pre>
 * @singleton
 */
Roo.MessageBox = function(){
    var dlg, opt, mask, waitTimer;
    var bodyEl, msgEl, textboxEl, textareaEl, progressEl, pp;
    var buttons, activeTextEl, bwidth;

    // private
    var handleButton = function(button){
        dlg.hide();
        Roo.callback(opt.fn, opt.scope||window, [button, activeTextEl.dom.value], 1);
    };

    // private
    var handleHide = function(){
        if(opt && opt.cls){
            dlg.el.removeClass(opt.cls);
        }
        if(waitTimer){
            Roo.TaskMgr.stop(waitTimer);
            waitTimer = null;
        }
    };

    // private
    var updateButtons = function(b){
        var width = 0;
        if(!b){
            buttons["ok"].hide();
            buttons["cancel"].hide();
            buttons["yes"].hide();
            buttons["no"].hide();
            dlg.footer.dom.style.display = 'none';
            return width;
        }
        dlg.footer.dom.style.display = '';
        for(var k in buttons){
            if(typeof buttons[k] != "function"){
                if(b[k]){
                    buttons[k].show();
                    buttons[k].setText(typeof b[k] == "string" ? b[k] : Roo.MessageBox.buttonText[k]);
                    width += buttons[k].el.getWidth()+15;
                }else{
                    buttons[k].hide();
                }
            }
        }
        return width;
    };

    // private
    var handleEsc = function(d, k, e){
        if(opt && opt.closable !== false){
            dlg.hide();
        }
        if(e){
            e.stopEvent();
        }
    };

    return {
        /**
         * Returns a reference to the underlying {@link Roo.BasicDialog} element
         * @return {Roo.BasicDialog} The BasicDialog element
         */
        getDialog : function(){
           if(!dlg){
                dlg = new Roo.BasicDialog("x-msg-box", {
                    autoCreate : true,
                    shadow: true,
                    draggable: true,
                    resizable:false,
                    constraintoviewport:false,
                    fixedcenter:true,
                    collapsible : false,
                    shim:true,
                    modal: true,
                    width:400, height:100,
                    buttonAlign:"center",
                    closeClick : function(){
                        if(opt && opt.buttons && opt.buttons.no && !opt.buttons.cancel){
                            handleButton("no");
                        }else{
                            handleButton("cancel");
                        }
                    }
                });
                dlg.on("hide", handleHide);
                mask = dlg.mask;
                dlg.addKeyListener(27, handleEsc);
                buttons = {};
                var bt = this.buttonText;
                buttons["ok"] = dlg.addButton(bt["ok"], handleButton.createCallback("ok"));
                buttons["yes"] = dlg.addButton(bt["yes"], handleButton.createCallback("yes"));
                buttons["no"] = dlg.addButton(bt["no"], handleButton.createCallback("no"));
                buttons["cancel"] = dlg.addButton(bt["cancel"], handleButton.createCallback("cancel"));
                bodyEl = dlg.body.createChild({

                    html:'<span class="roo-mb-text"></span><br /><input type="text" class="roo-mb-input" /><textarea class="roo-mb-textarea"></textarea><div class="roo-mb-progress-wrap"><div class="roo-mb-progress"><div class="roo-mb-progress-bar">&#160;</div></div></div>'
                });
                msgEl = bodyEl.dom.firstChild;
                textboxEl = Roo.get(bodyEl.dom.childNodes[2]);
                textboxEl.enableDisplayMode();
                textboxEl.addKeyListener([10,13], function(){
                    if(dlg.isVisible() && opt && opt.buttons){
                        if(opt.buttons.ok){
                            handleButton("ok");
                        }else if(opt.buttons.yes){
                            handleButton("yes");
                        }
                    }
                });
                textareaEl = Roo.get(bodyEl.dom.childNodes[3]);
                textareaEl.enableDisplayMode();
                progressEl = Roo.get(bodyEl.dom.childNodes[4]);
                progressEl.enableDisplayMode();
                var pf = progressEl.dom.firstChild;
                if (pf) {
                    pp = Roo.get(pf.firstChild);
                    pp.setHeight(pf.offsetHeight);
                }
                
            }
            return dlg;
        },

        /**
         * Updates the message box body text
         * @param {String} text (optional) Replaces the message box element's innerHTML with the specified string (defaults to
         * the XHTML-compliant non-breaking space character '&amp;#160;')
         * @return {Roo.MessageBox} This message box
         */
        updateText : function(text){
            if(!dlg.isVisible() && !opt.width){
                dlg.resizeTo(this.maxWidth, 100); // resize first so content is never clipped from previous shows
            }
            msgEl.innerHTML = text || '&#160;';
            var w = Math.max(Math.min(opt.width || msgEl.offsetWidth, this.maxWidth), 
                        Math.max(opt.minWidth || this.minWidth, bwidth));
            if(opt.prompt){
                activeTextEl.setWidth(w);
            }
            if(dlg.isVisible()){
                dlg.fixedcenter = false;
            }
            dlg.setContentSize(w, bodyEl.getHeight());
            if(dlg.isVisible()){
                dlg.fixedcenter = true;
            }
            return this;
        },

        /**
         * Updates a progress-style message box's text and progress bar.  Only relevant on message boxes
         * initiated via {@link Roo.MessageBox#progress} or by calling {@link Roo.MessageBox#show} with progress: true.
         * @param {Number} value Any number between 0 and 1 (e.g., .5)
         * @param {String} text (optional) If defined, the message box's body text is replaced with the specified string (defaults to undefined)
         * @return {Roo.MessageBox} This message box
         */
        updateProgress : function(value, text){
            if(text){
                this.updateText(text);
            }
            if (pp) { // weird bug on my firefox - for some reason this is not defined
                pp.setWidth(Math.floor(value*progressEl.dom.firstChild.offsetWidth));
            }
            return this;
        },        

        /**
         * Returns true if the message box is currently displayed
         * @return {Boolean} True if the message box is visible, else false
         */
        isVisible : function(){
            return dlg && dlg.isVisible();  
        },

        /**
         * Hides the message box if it is displayed
         */
        hide : function(){
            if(this.isVisible()){
                dlg.hide();
            }  
        },

        /**
         * Displays a new message box, or reinitializes an existing message box, based on the config options
         * passed in. All functions (e.g. prompt, alert, etc) on MessageBox call this function internally.
         * The following config object properties are supported:
         * <pre>
Property    Type             Description
----------  ---------------  ------------------------------------------------------------------------------------
animEl            String/Element   An id or Element from which the message box should animate as it opens and
                                   closes (defaults to undefined)
buttons           Object/Boolean   A button config object (e.g., Roo.MessageBox.OKCANCEL or {ok:'Foo',
                                   cancel:'Bar'}), or false to not show any buttons (defaults to false)
closable          Boolean          False to hide the top-right close button (defaults to true).  Note that
                                   progress and wait dialogs will ignore this property and always hide the
                                   close button as they can only be closed programmatically.
cls               String           A custom CSS class to apply to the message box element
defaultTextHeight Number           The default height in pixels of the message box's multiline textarea if
                                   displayed (defaults to 75)
fn                Function         A callback function to execute after closing the dialog.  The arguments to the
                                   function will be btn (the name of the button that was clicked, if applicable,
                                   e.g. "ok"), and text (the value of the active text field, if applicable).
                                   Progress and wait dialogs will ignore this option since they do not respond to
                                   user actions and can only be closed programmatically, so any required function
                                   should be called by the same code after it closes the dialog.
icon              String           A CSS class that provides a background image to be used as an icon for
                                   the dialog (e.g., Roo.MessageBox.WARNING or 'custom-class', defaults to '')
maxWidth          Number           The maximum width in pixels of the message box (defaults to 600)
minWidth          Number           The minimum width in pixels of the message box (defaults to 100)
modal             Boolean          False to allow user interaction with the page while the message box is
                                   displayed (defaults to true)
msg               String           A string that will replace the existing message box body text (defaults
                                   to the XHTML-compliant non-breaking space character '&#160;')
multiline         Boolean          True to prompt the user to enter multi-line text (defaults to false)
progress          Boolean          True to display a progress bar (defaults to false)
progressText      String           The text to display inside the progress bar if progress = true (defaults to '')
prompt            Boolean          True to prompt the user to enter single-line text (defaults to false)
proxyDrag         Boolean          True to display a lightweight proxy while dragging (defaults to false)
title             String           The title text
value             String           The string value to set into the active textbox element if displayed
wait              Boolean          True to display a progress bar (defaults to false)
width             Number           The width of the dialog in pixels
</pre>
         *
         * Example usage:
         * <pre><code>
Roo.Msg.show({
   title: 'Address',
   msg: 'Please enter your address:',
   width: 300,
   buttons: Roo.MessageBox.OKCANCEL,
   multiline: true,
   fn: saveAddress,
   animEl: 'addAddressBtn'
});
</code></pre>
         * @param {Object} config Configuration options
         * @return {Roo.MessageBox} This message box
         */
        show : function(options){
            if(this.isVisible()){
                this.hide();
            }
            var d = this.getDialog();
            opt = options;
            d.setTitle(opt.title || "&#160;");
            d.close.setDisplayed(opt.closable !== false);
            activeTextEl = textboxEl;
            opt.prompt = opt.prompt || (opt.multiline ? true : false);
            if(opt.prompt){
                if(opt.multiline){
                    textboxEl.hide();
                    textareaEl.show();
                    textareaEl.setHeight(typeof opt.multiline == "number" ?
                        opt.multiline : this.defaultTextHeight);
                    activeTextEl = textareaEl;
                }else{
                    textboxEl.show();
                    textareaEl.hide();
                }
            }else{
                textboxEl.hide();
                textareaEl.hide();
            }
            progressEl.setDisplayed(opt.progress === true);
            this.updateProgress(0);
            activeTextEl.dom.value = opt.value || "";
            if(opt.prompt){
                dlg.setDefaultButton(activeTextEl);
            }else{
                var bs = opt.buttons;
                var db = null;
                if(bs && bs.ok){
                    db = buttons["ok"];
                }else if(bs && bs.yes){
                    db = buttons["yes"];
                }
                dlg.setDefaultButton(db);
            }
            bwidth = updateButtons(opt.buttons);
            this.updateText(opt.msg);
            if(opt.cls){
                d.el.addClass(opt.cls);
            }
            d.proxyDrag = opt.proxyDrag === true;
            d.modal = opt.modal !== false;
            d.mask = opt.modal !== false ? mask : false;
            if(!d.isVisible()){
                // force it to the end of the z-index stack so it gets a cursor in FF
                document.body.appendChild(dlg.el.dom);
                d.animateTarget = null;
                d.show(options.animEl);
            }
            return this;
        },

        /**
         * Displays a message box with a progress bar.  This message box has no buttons and is not closeable by
         * the user.  You are responsible for updating the progress bar as needed via {@link Roo.MessageBox#updateProgress}
         * and closing the message box when the process is complete.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @return {Roo.MessageBox} This message box
         */
        progress : function(title, msg){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                progress:true,
                closable:false,
                minWidth: this.minProgressWidth,
                modal : true
            });
            return this;
        },

        /**
         * Displays a standard read-only message box with an OK button (comparable to the basic JavaScript Window.alert).
         * If a callback function is passed it will be called after the user clicks the button, and the
         * id of the button that was clicked will be passed as the only parameter to the callback
         * (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Roo.MessageBox} This message box
         */
        alert : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OK,
                fn: fn,
                scope : scope,
                modal : true
            });
            return this;
        },

        /**
         * Displays a message box with an infinitely auto-updating progress bar.  This can be used to block user
         * interaction while waiting for a long-running process to complete that does not have defined intervals.
         * You are responsible for closing the message box when the process is complete.
         * @param {String} msg The message box body text
         * @param {String} title (optional) The title bar text
         * @return {Roo.MessageBox} This message box
         */
        wait : function(msg, title){
            this.show({
                title : title,
                msg : msg,
                buttons: false,
                closable:false,
                progress:true,
                modal:true,
                width:300,
                wait:true
            });
            waitTimer = Roo.TaskMgr.start({
                run: function(i){
                    Roo.MessageBox.updateProgress(((((i+20)%20)+1)*5)*.01);
                },
                interval: 1000
            });
            return this;
        },

        /**
         * Displays a confirmation message box with Yes and No buttons (comparable to JavaScript's Window.confirm).
         * If a callback function is passed it will be called after the user clicks either button, and the id of the
         * button that was clicked will be passed as the only parameter to the callback (could also be the top-right close button).
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @return {Roo.MessageBox} This message box
         */
        confirm : function(title, msg, fn, scope){
            this.show({
                title : title,
                msg : msg,
                buttons: this.YESNO,
                fn: fn,
                scope : scope,
                modal : true
            });
            return this;
        },

        /**
         * Displays a message box with OK and Cancel buttons prompting the user to enter some text (comparable to
         * JavaScript's Window.prompt).  The prompt can be a single-line or multi-line textbox.  If a callback function
         * is passed it will be called after the user clicks either button, and the id of the button that was clicked
         * (could also be the top-right close button) and the text that was entered will be passed as the two
         * parameters to the callback.
         * @param {String} title The title bar text
         * @param {String} msg The message box body text
         * @param {Function} fn (optional) The callback function invoked after the message box is closed
         * @param {Object} scope (optional) The scope of the callback function
         * @param {Boolean/Number} multiline (optional) True to create a multiline textbox using the defaultTextHeight
         * property, or the height in pixels to create the textbox (defaults to false / single-line)
         * @return {Roo.MessageBox} This message box
         */
        prompt : function(title, msg, fn, scope, multiline){
            this.show({
                title : title,
                msg : msg,
                buttons: this.OKCANCEL,
                fn: fn,
                minWidth:250,
                scope : scope,
                prompt:true,
                multiline: multiline,
                modal : true
            });
            return this;
        },

        /**
         * Button config that displays a single OK button
         * @type Object
         */
        OK : {ok:true},
        /**
         * Button config that displays Yes and No buttons
         * @type Object
         */
        YESNO : {yes:true, no:true},
        /**
         * Button config that displays OK and Cancel buttons
         * @type Object
         */
        OKCANCEL : {ok:true, cancel:true},
        /**
         * Button config that displays Yes, No and Cancel buttons
         * @type Object
         */
        YESNOCANCEL : {yes:true, no:true, cancel:true},

        /**
         * The default height in pixels of the message box's multiline textarea if displayed (defaults to 75)
         * @type Number
         */
        defaultTextHeight : 75,
        /**
         * The maximum width in pixels of the message box (defaults to 600)
         * @type Number
         */
        maxWidth : 600,
        /**
         * The minimum width in pixels of the message box (defaults to 100)
         * @type Number
         */
        minWidth : 100,
        /**
         * The minimum width in pixels of the message box if it is a progress-style dialog.  This is useful
         * for setting a different minimum width than text-only dialogs may need (defaults to 250)
         * @type Number
         */
        minProgressWidth : 250,
        /**
         * An object containing the default button text strings that can be overriden for localized language support.
         * Supported properties are: ok, cancel, yes and no.
         * Customize the default text like so: Roo.MessageBox.buttonText.yes = "S?";
         * @type Object
         */
        buttonText : {
            ok : "OK",
            cancel : "Cancel",
            yes : "Yes",
            no : "No"
        }
    };
}();

/**
 * Shorthand for {@link Roo.MessageBox}
 */
Roo.Msg = Roo.MessageBox;/*
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
 * @class Roo.QuickTips
 * Provides attractive and customizable tooltips for any element.
 * @singleton
 */
Roo.QuickTips = function(){
    var el, tipBody, tipBodyText, tipTitle, tm, cfg, close, tagEls = {}, esc, removeCls = null, bdLeft, bdRight;
    var ce, bd, xy, dd;
    var visible = false, disabled = true, inited = false;
    var showProc = 1, hideProc = 1, dismissProc = 1, locks = [];
    
    var onOver = function(e){
        if(disabled){
            return;
        }
        var t = e.getTarget();
        if(!t || t.nodeType !== 1 || t == document || t == document.body){
            return;
        }
        if(ce && t == ce.el){
            clearTimeout(hideProc);
            return;
        }
        if(t && tagEls[t.id]){
            tagEls[t.id].el = t;
            showProc = show.defer(tm.showDelay, tm, [tagEls[t.id]]);
            return;
        }
        var ttp, et = Roo.fly(t);
        var ns = cfg.namespace;
        if(tm.interceptTitles && t.title){
            ttp = t.title;
            t.qtip = ttp;
            t.removeAttribute("title");
            e.preventDefault();
        }else{
            ttp = t.qtip || et.getAttributeNS(ns, cfg.attribute);
        }
        if(ttp){
            showProc = show.defer(tm.showDelay, tm, [{
                el: t, 
                text: ttp, 
                width: et.getAttributeNS(ns, cfg.width),
                autoHide: et.getAttributeNS(ns, cfg.hide) != "user",
                title: et.getAttributeNS(ns, cfg.title),
           	    cls: et.getAttributeNS(ns, cfg.cls)
            }]);
        }
    };
    
    var onOut = function(e){
        clearTimeout(showProc);
        var t = e.getTarget();
        if(t && ce && ce.el == t && (tm.autoHide && ce.autoHide !== false)){
            hideProc = setTimeout(hide, tm.hideDelay);
        }
    };
    
    var onMove = function(e){
        if(disabled){
            return;
        }
        xy = e.getXY();
        xy[1] += 18;
        if(tm.trackMouse && ce){
            el.setXY(xy);
        }
    };
    
    var onDown = function(e){
        clearTimeout(showProc);
        clearTimeout(hideProc);
        if(!e.within(el)){
            if(tm.hideOnClick){
                hide();
                tm.disable();
                tm.enable.defer(100, tm);
            }
        }
    };
    
    var getPad = function(){
        return 2;//bdLeft.getPadding('l')+bdRight.getPadding('r');
    };

    var show = function(o){
        if(disabled){
            return;
        }
        clearTimeout(dismissProc);
        ce = o;
        if(removeCls){ // in case manually hidden
            el.removeClass(removeCls);
            removeCls = null;
        }
        if(ce.cls){
            el.addClass(ce.cls);
            removeCls = ce.cls;
        }
        if(ce.title){
            tipTitle.update(ce.title);
            tipTitle.show();
        }else{
            tipTitle.update('');
            tipTitle.hide();
        }
        el.dom.style.width  = tm.maxWidth+'px';
        //tipBody.dom.style.width = '';
        tipBodyText.update(o.text);
        var p = getPad(), w = ce.width;
        if(!w){
            var td = tipBodyText.dom;
            var aw = Math.max(td.offsetWidth, td.clientWidth, td.scrollWidth);
            if(aw > tm.maxWidth){
                w = tm.maxWidth;
            }else if(aw < tm.minWidth){
                w = tm.minWidth;
            }else{
                w = aw;
            }
        }
        //tipBody.setWidth(w);
        el.setWidth(parseInt(w, 10) + p);
        if(ce.autoHide === false){
            close.setDisplayed(true);
            if(dd){
                dd.unlock();
            }
        }else{
            close.setDisplayed(false);
            if(dd){
                dd.lock();
            }
        }
        if(xy){
            el.avoidY = xy[1]-18;
            el.setXY(xy);
        }
        if(tm.animate){
            el.setOpacity(.1);
            el.setStyle("visibility", "visible");
            el.fadeIn({callback: afterShow});
        }else{
            afterShow();
        }
    };
    
    var afterShow = function(){
        if(ce){
            el.show();
            esc.enable();
            if(tm.autoDismiss && ce.autoHide !== false){
                dismissProc = setTimeout(hide, tm.autoDismissDelay);
            }
        }
    };
    
    var hide = function(noanim){
        clearTimeout(dismissProc);
        clearTimeout(hideProc);
        ce = null;
        if(el.isVisible()){
            esc.disable();
            if(noanim !== true && tm.animate){
                el.fadeOut({callback: afterHide});
            }else{
                afterHide();
            } 
        }
    };
    
    var afterHide = function(){
        el.hide();
        if(removeCls){
            el.removeClass(removeCls);
            removeCls = null;
        }
    };
    
    return {
        /**
        * @cfg {Number} minWidth
        * The minimum width of the quick tip (defaults to 40)
        */
       minWidth : 40,
        /**
        * @cfg {Number} maxWidth
        * The maximum width of the quick tip (defaults to 300)
        */
       maxWidth : 300,
        /**
        * @cfg {Boolean} interceptTitles
        * True to automatically use the element's DOM title value if available (defaults to false)
        */
       interceptTitles : false,
        /**
        * @cfg {Boolean} trackMouse
        * True to have the quick tip follow the mouse as it moves over the target element (defaults to false)
        */
       trackMouse : false,
        /**
        * @cfg {Boolean} hideOnClick
        * True to hide the quick tip if the user clicks anywhere in the document (defaults to true)
        */
       hideOnClick : true,
        /**
        * @cfg {Number} showDelay
        * Delay in milliseconds before the quick tip displays after the mouse enters the target element (defaults to 500)
        */
       showDelay : 500,
        /**
        * @cfg {Number} hideDelay
        * Delay in milliseconds before the quick tip hides when autoHide = true (defaults to 200)
        */
       hideDelay : 200,
        /**
        * @cfg {Boolean} autoHide
        * True to automatically hide the quick tip after the mouse exits the target element (defaults to true).
        * Used in conjunction with hideDelay.
        */
       autoHide : true,
        /**
        * @cfg {Boolean}
        * True to automatically hide the quick tip after a set period of time, regardless of the user's actions
        * (defaults to true).  Used in conjunction with autoDismissDelay.
        */
       autoDismiss : true,
        /**
        * @cfg {Number}
        * Delay in milliseconds before the quick tip hides when autoDismiss = true (defaults to 5000)
        */
       autoDismissDelay : 5000,
       /**
        * @cfg {Boolean} animate
        * True to turn on fade animation. Defaults to false (ClearType/scrollbar flicker issues in IE7).
        */
       animate : false,

       /**
        * @cfg {String} title
        * Title text to display (defaults to '').  This can be any valid HTML markup.
        */
        title: '',
       /**
        * @cfg {String} text
        * Body text to display (defaults to '').  This can be any valid HTML markup.
        */
        text : '',
       /**
        * @cfg {String} cls
        * A CSS class to apply to the base quick tip element (defaults to '').
        */
        cls : '',
       /**
        * @cfg {Number} width
        * Width in pixels of the quick tip (defaults to auto).  Width will be ignored if it exceeds the bounds of
        * minWidth or maxWidth.
        */
        width : null,

    /**
     * Initialize and enable QuickTips for first use.  This should be called once before the first attempt to access
     * or display QuickTips in a page.
     */
       init : function(){
          tm = Roo.QuickTips;
          cfg = tm.tagConfig;
          if(!inited){
              if(!Roo.isReady){ // allow calling of init() before onReady
                  Roo.onReady(Roo.QuickTips.init, Roo.QuickTips);
                  return;
              }
              el = new Roo.Layer({cls:"x-tip", shadow:"drop", shim: true, constrain:true, shadowOffset:4});
              el.fxDefaults = {stopFx: true};
              // maximum custom styling
              //el.update('<div class="x-tip-top-left"><div class="x-tip-top-right"><div class="x-tip-top"></div></div></div><div class="x-tip-bd-left"><div class="x-tip-bd-right"><div class="x-tip-bd"><div class="x-tip-close"></div><h3></h3><div class="x-tip-bd-inner"></div><div class="x-clear"></div></div></div></div><div class="x-tip-ft-left"><div class="x-tip-ft-right"><div class="x-tip-ft"></div></div></div>');
              el.update('<div class="x-tip-bd"><div class="x-tip-close"></div><h3></h3><div class="x-tip-bd-inner"></div><div class="x-clear"></div></div>');              
              tipTitle = el.child('h3');
              tipTitle.enableDisplayMode("block");
              tipBody = el.child('div.x-tip-bd');
              tipBodyText = el.child('div.x-tip-bd-inner');
              //bdLeft = el.child('div.x-tip-bd-left');
              //bdRight = el.child('div.x-tip-bd-right');
              close = el.child('div.x-tip-close');
              close.enableDisplayMode("block");
              close.on("click", hide);
              var d = Roo.get(document);
              d.on("mousedown", onDown);
              d.on("mouseover", onOver);
              d.on("mouseout", onOut);
              d.on("mousemove", onMove);
              esc = d.addKeyListener(27, hide);
              esc.disable();
              if(Roo.dd.DD){
                  dd = el.initDD("default", null, {
                      onDrag : function(){
                          el.sync();  
                      }
                  });
                  dd.setHandleElId(tipTitle.id);
                  dd.lock();
              }
              inited = true;
          }
          this.enable(); 
       },

    /**
     * Configures a new quick tip instance and assigns it to a target element.  The following config options
     * are supported:
     * <pre>
Property    Type                   Description
----------  ---------------------  ------------------------------------------------------------------------
target      Element/String/Array   An Element, id or array of ids that this quick tip should be tied to
     * </ul>
     * @param {Object} config The config object
     */
       register : function(config){
           var cs = config instanceof Array ? config : arguments;
           for(var i = 0, len = cs.length; i < len; i++) {
               var c = cs[i];
               var target = c.target;
               if(target){
                   if(target instanceof Array){
                       for(var j = 0, jlen = target.length; j < jlen; j++){
                           tagEls[target[j]] = c;
                       }
                   }else{
                       tagEls[typeof target == 'string' ? target : Roo.id(target)] = c;
                   }
               }
           }
       },

    /**
     * Removes this quick tip from its element and destroys it.
     * @param {String/HTMLElement/Element} el The element from which the quick tip is to be removed.
     */
       unregister : function(el){
           delete tagEls[Roo.id(el)];
       },

    /**
     * Enable this quick tip.
     */
       enable : function(){
           if(inited && disabled){
               locks.pop();
               if(locks.length < 1){
                   disabled = false;
               }
           }
       },

    /**
     * Disable this quick tip.
     */
       disable : function(){
          disabled = true;
          clearTimeout(showProc);
          clearTimeout(hideProc);
          clearTimeout(dismissProc);
          if(ce){
              hide(true);
          }
          locks.push(1);
       },

    /**
     * Returns true if the quick tip is enabled, else false.
     */
       isEnabled : function(){
            return !disabled;
       },

        // private
       tagConfig : {
           namespace : "ext",
           attribute : "qtip",
           width : "width",
           target : "target",
           title : "qtitle",
           hide : "hide",
           cls : "qclass"
       }
   };
}();

// backwards compat
Roo.QuickTips.tips = Roo.QuickTips.register;/*
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
 * @class Roo.tree.TreePanel
 * @extends Roo.data.Tree

 * @cfg {Boolean} rootVisible false to hide the root node (defaults to true)
 * @cfg {Boolean} lines false to disable tree lines (defaults to true)
 * @cfg {Boolean} enableDD true to enable drag and drop
 * @cfg {Boolean} enableDrag true to enable just drag
 * @cfg {Boolean} enableDrop true to enable just drop
 * @cfg {Object} dragConfig Custom config to pass to the {@link Roo.tree.TreeDragZone} instance
 * @cfg {Object} dropConfig Custom config to pass to the {@link Roo.tree.TreeDropZone} instance
 * @cfg {String} ddGroup The DD group this TreePanel belongs to
 * @cfg {String} ddAppendOnly True if the tree should only allow append drops (use for trees which are sorted)
 * @cfg {Boolean} ddScroll true to enable YUI body scrolling
 * @cfg {Boolean} containerScroll true to register this container with ScrollManager
 * @cfg {Boolean} hlDrop false to disable node highlight on drop (defaults to the value of Roo.enableFx)
 * @cfg {String} hlColor The color of the node highlight (defaults to C3DAF9)
 * @cfg {Boolean} animate true to enable animated expand/collapse (defaults to the value of Roo.enableFx)
 * @cfg {Boolean} singleExpand true if only 1 node per branch may be expanded
 * @cfg {Boolean} selModel A tree selection model to use with this TreePanel (defaults to a {@link Roo.tree.DefaultSelectionModel})
 * @cfg {Boolean} loader A TreeLoader for use with this TreePanel
 * @cfg {String} pathSeparator The token used to separate sub-paths in path strings (defaults to '/')
 * @cfg {Function} renderer Sets the rendering (formatting) function for the nodes. to return HTML markup for the tree view. The render function is called with  the following parameters:<ul><li>The {Object} The data for the node.</li></ul>
 * @cfg {Function} rendererTip Sets the rendering (formatting) function for the nodes hovertip to return HTML markup for the tree view. The render function is called with  the following parameters:<ul><li>The {Object} The data for the node.</li></ul>
 * 
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.tree.TreePanel = function(el, config){
    var root = false;
    var loader = false;
    if (config.root) {
        root = config.root;
        delete config.root;
    }
    if (config.loader) {
        loader = config.loader;
        delete config.loader;
    }
    
    Roo.apply(this, config);
    Roo.tree.TreePanel.superclass.constructor.call(this);
    this.el = Roo.get(el);
    this.el.addClass('x-tree');
    //console.log(root);
    if (root) {
        this.setRootNode( Roo.factory(root, Roo.tree));
    }
    if (loader) {
        this.loader = Roo.factory(loader, Roo.tree);
    }
   /**
    * Read-only. The id of the container element becomes this TreePanel's id.
    */
   this.id = this.el.id;
   this.addEvents({
        /**
        * @event beforeload
        * Fires before a node is loaded, return false to cancel
        * @param {Node} node The node being loaded
        */
        "beforeload" : true,
        /**
        * @event load
        * Fires when a node is loaded
        * @param {Node} node The node that was loaded
        */
        "load" : true,
        /**
        * @event textchange
        * Fires when the text for a node is changed
        * @param {Node} node The node
        * @param {String} text The new text
        * @param {String} oldText The old text
        */
        "textchange" : true,
        /**
        * @event beforeexpand
        * Fires before a node is expanded, return false to cancel.
        * @param {Node} node The node
        * @param {Boolean} deep
        * @param {Boolean} anim
        */
        "beforeexpand" : true,
        /**
        * @event beforecollapse
        * Fires before a node is collapsed, return false to cancel.
        * @param {Node} node The node
        * @param {Boolean} deep
        * @param {Boolean} anim
        */
        "beforecollapse" : true,
        /**
        * @event expand
        * Fires when a node is expanded
        * @param {Node} node The node
        */
        "expand" : true,
        /**
        * @event disabledchange
        * Fires when the disabled status of a node changes
        * @param {Node} node The node
        * @param {Boolean} disabled
        */
        "disabledchange" : true,
        /**
        * @event collapse
        * Fires when a node is collapsed
        * @param {Node} node The node
        */
        "collapse" : true,
        /**
        * @event beforeclick
        * Fires before click processing on a node. Return false to cancel the default action.
        * @param {Node} node The node
        * @param {Roo.EventObject} e The event object
        */
        "beforeclick":true,
        /**
        * @event checkchange
        * Fires when a node with a checkbox's checked property changes
        * @param {Node} this This node
        * @param {Boolean} checked
        */
        "checkchange":true,
        /**
        * @event click
        * Fires when a node is clicked
        * @param {Node} node The node
        * @param {Roo.EventObject} e The event object
        */
        "click":true,
        /**
        * @event dblclick
        * Fires when a node is double clicked
        * @param {Node} node The node
        * @param {Roo.EventObject} e The event object
        */
        "dblclick":true,
        /**
        * @event contextmenu
        * Fires when a node is right clicked
        * @param {Node} node The node
        * @param {Roo.EventObject} e The event object
        */
        "contextmenu":true,
        /**
        * @event beforechildrenrendered
        * Fires right before the child nodes for a node are rendered
        * @param {Node} node The node
        */
        "beforechildrenrendered":true,
       /**
	     * @event startdrag
	     * Fires when a node starts being dragged
	     * @param {Roo.tree.TreePanel} this
	     * @param {Roo.tree.TreeNode} node
	     * @param {event} e The raw browser event
	     */ 
	    "startdrag" : true,
	    /**
	     * @event enddrag
	     * Fires when a drag operation is complete
	     * @param {Roo.tree.TreePanel} this
	     * @param {Roo.tree.TreeNode} node
	     * @param {event} e The raw browser event
	     */
	    "enddrag" : true,
	    /**
	     * @event dragdrop
	     * Fires when a dragged node is dropped on a valid DD target
	     * @param {Roo.tree.TreePanel} this
	     * @param {Roo.tree.TreeNode} node
	     * @param {DD} dd The dd it was dropped on
	     * @param {event} e The raw browser event
	     */
	    "dragdrop" : true,
	    /**
	     * @event beforenodedrop
	     * Fires when a DD object is dropped on a node in this tree for preprocessing. Return false to cancel the drop. The dropEvent
	     * passed to handlers has the following properties:<br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>tree - The TreePanel</li>
	     * <li>target - The node being targeted for the drop</li>
	     * <li>data - The drag data from the drag source</li>
	     * <li>point - The point of the drop - append, above or below</li>
	     * <li>source - The drag source</li>
	     * <li>rawEvent - Raw mouse event</li>
	     * <li>dropNode - Drop node(s) provided by the source <b>OR</b> you can supply node(s)
	     * to be inserted by setting them on this object.</li>
	     * <li>cancel - Set this to true to cancel the drop.</li>
	     * </ul>
	     * @param {Object} dropEvent
	     */
	    "beforenodedrop" : true,
	    /**
	     * @event nodedrop
	     * Fires after a DD object is dropped on a node in this tree. The dropEvent
	     * passed to handlers has the following properties:<br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>tree - The TreePanel</li>
	     * <li>target - The node being targeted for the drop</li>
	     * <li>data - The drag data from the drag source</li>
	     * <li>point - The point of the drop - append, above or below</li>
	     * <li>source - The drag source</li>
	     * <li>rawEvent - Raw mouse event</li>
	     * <li>dropNode - Dropped node(s).</li>
	     * </ul>
	     * @param {Object} dropEvent
	     */
	    "nodedrop" : true,
	     /**
	     * @event nodedragover
	     * Fires when a tree node is being targeted for a drag drop, return false to signal drop not allowed. The dragOverEvent
	     * passed to handlers has the following properties:<br />
	     * <ul style="padding:5px;padding-left:16px;">
	     * <li>tree - The TreePanel</li>
	     * <li>target - The node being targeted for the drop</li>
	     * <li>data - The drag data from the drag source</li>
	     * <li>point - The point of the drop - append, above or below</li>
	     * <li>source - The drag source</li>
	     * <li>rawEvent - Raw mouse event</li>
	     * <li>dropNode - Drop node(s) provided by the source.</li>
	     * <li>cancel - Set this to true to signal drop not allowed.</li>
	     * </ul>
	     * @param {Object} dragOverEvent
	     */
	    "nodedragover" : true
        
   });
   if(this.singleExpand){
       this.on("beforeexpand", this.restrictExpand, this);
   }
};
Roo.extend(Roo.tree.TreePanel, Roo.data.Tree, {
    rootVisible : true,
    animate: Roo.enableFx,
    lines : true,
    enableDD : false,
    hlDrop : Roo.enableFx,
  
    renderer: false,
    
    rendererTip: false,
    // private
    restrictExpand : function(node){
        var p = node.parentNode;
        if(p){
            if(p.expandedChild && p.expandedChild.parentNode == p){
                p.expandedChild.collapse();
            }
            p.expandedChild = node;
        }
    },

    // private override
    setRootNode : function(node){
        Roo.tree.TreePanel.superclass.setRootNode.call(this, node);
        if(!this.rootVisible){
            node.ui = new Roo.tree.RootTreeNodeUI(node);
        }
        return node;
    },

    /**
     * Returns the container element for this TreePanel
     */
    getEl : function(){
        return this.el;
    },

    /**
     * Returns the default TreeLoader for this TreePanel
     */
    getLoader : function(){
        return this.loader;
    },

    /**
     * Expand all nodes
     */
    expandAll : function(){
        this.root.expand(true);
    },

    /**
     * Collapse all nodes
     */
    collapseAll : function(){
        this.root.collapse(true);
    },

    /**
     * Returns the selection model used by this TreePanel
     */
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Roo.tree.DefaultSelectionModel();
        }
        return this.selModel;
    },

    /**
     * Retrieve an array of checked nodes, or an array of a specific attribute of checked nodes (e.g. "id")
     * @param {String} attribute (optional) Defaults to null (return the actual nodes)
     * @param {TreeNode} startNode (optional) The node to start from, defaults to the root
     * @return {Array}
     */
    getChecked : function(a, startNode){
        startNode = startNode || this.root;
        var r = [];
        var f = function(){
            if(this.attributes.checked){
                r.push(!a ? this : (a == 'id' ? this.id : this.attributes[a]));
            }
        }
        startNode.cascade(f);
        return r;
    },

    /**
     * Expands a specified path in this TreePanel. A path can be retrieved from a node with {@link Roo.data.Node#getPath}
     * @param {String} path
     * @param {String} attr (optional) The attribute used in the path (see {@link Roo.data.Node#getPath} for more info)
     * @param {Function} callback (optional) The callback to call when the expand is complete. The callback will be called with
     * (bSuccess, oLastNode) where bSuccess is if the expand was successful and oLastNode is the last node that was expanded.
     */
    expandPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var curNode = this.root;
        if(curNode.attributes[attr] != keys[1]){ // invalid root
            if(callback){
                callback(false, null);
            }
            return;
        }
        var index = 1;
        var f = function(){
            if(++index == keys.length){
                if(callback){
                    callback(true, curNode);
                }
                return;
            }
            var c = curNode.findChild(attr, keys[index]);
            if(!c){
                if(callback){
                    callback(false, curNode);
                }
                return;
            }
            curNode = c;
            c.expand(false, false, f);
        };
        curNode.expand(false, false, f);
    },

    /**
     * Selects the node in this tree at the specified path. A path can be retrieved from a node with {@link Roo.data.Node#getPath}
     * @param {String} path
     * @param {String} attr (optional) The attribute used in the path (see {@link Roo.data.Node#getPath} for more info)
     * @param {Function} callback (optional) The callback to call when the selection is complete. The callback will be called with
     * (bSuccess, oSelNode) where bSuccess is if the selection was successful and oSelNode is the selected node.
     */
    selectPath : function(path, attr, callback){
        attr = attr || "id";
        var keys = path.split(this.pathSeparator);
        var v = keys.pop();
        if(keys.length > 0){
            var f = function(success, node){
                if(success && node){
                    var n = node.findChild(attr, v);
                    if(n){
                        n.select();
                        if(callback){
                            callback(true, n);
                        }
                    }else if(callback){
                        callback(false, n);
                    }
                }else{
                    if(callback){
                        callback(false, n);
                    }
                }
            };
            this.expandPath(keys.join(this.pathSeparator), attr, f);
        }else{
            this.root.select();
            if(callback){
                callback(true, this.root);
            }
        }
    },

    getTreeEl : function(){
        return this.el;
    },

    /**
     * Trigger rendering of this TreePanel
     */
    render : function(){
        if (this.innerCt) {
            return this; // stop it rendering more than once!!
        }
        
        this.innerCt = this.el.createChild({tag:"ul",
               cls:"x-tree-root-ct " +
               (this.lines ? "x-tree-lines" : "x-tree-no-lines")});

        if(this.containerScroll){
            Roo.dd.ScrollManager.register(this.el);
        }
        if((this.enableDD || this.enableDrop) && !this.dropZone){
           /**
            * The dropZone used by this tree if drop is enabled
            * @type Roo.tree.TreeDropZone
            */
             this.dropZone = new Roo.tree.TreeDropZone(this, this.dropConfig || {
               ddGroup: this.ddGroup || "TreeDD", appendOnly: this.ddAppendOnly === true
           });
        }
        if((this.enableDD || this.enableDrag) && !this.dragZone){
           /**
            * The dragZone used by this tree if drag is enabled
            * @type Roo.tree.TreeDragZone
            */
            this.dragZone = new Roo.tree.TreeDragZone(this, this.dragConfig || {
               ddGroup: this.ddGroup || "TreeDD",
               scroll: this.ddScroll
           });
        }
        this.getSelectionModel().init(this);
        if (!this.root) {
            console.log("ROOT not set in tree");
            return;
        }
        this.root.render();
        if(!this.rootVisible){
            this.root.renderChildren();
        }
        return this;
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
 * @class Roo.tree.DefaultSelectionModel
 * @extends Roo.util.Observable
 * The default single selection for a TreePanel.
 */
Roo.tree.DefaultSelectionModel = function(){
   this.selNode = null;
   
   this.addEvents({
       /**
        * @event selectionchange
        * Fires when the selected node changes
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node the new selection
        */
       "selectionchange" : true,

       /**
        * @event beforeselect
        * Fires before the selected node changes, return false to cancel the change
        * @param {DefaultSelectionModel} this
        * @param {TreeNode} node the new selection
        * @param {TreeNode} node the old selection
        */
       "beforeselect" : true
   });
};

Roo.extend(Roo.tree.DefaultSelectionModel, Roo.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        if (e.ctrlKey && this.selNode == node)  {
            this.unselect(node);
            return;
        }
        this.select(node);
    },
    
    /**
     * Select a node.
     * @param {TreeNode} node The node to select
     * @return {TreeNode} The selected node
     */
    select : function(node){
        var last = this.selNode;
        if(last != node && this.fireEvent('beforeselect', this, node, last) !== false){
            if(last){
                last.ui.onSelectedChange(false);
            }
            this.selNode = node;
            node.ui.onSelectedChange(true);
            this.fireEvent("selectionchange", this, node, last);
        }
        return node;
    },
    
    /**
     * Deselect a node.
     * @param {TreeNode} node The node to unselect
     */
    unselect : function(node){
        if(this.selNode == node){
            this.clearSelections();
        }    
    },
    
    /**
     * Clear all selections
     */
    clearSelections : function(){
        var n = this.selNode;
        if(n){
            n.ui.onSelectedChange(false);
            this.selNode = null;
            this.fireEvent("selectionchange", this, null);
        }
        return n;
    },
    
    /**
     * Get the selected node
     * @return {TreeNode} The selected node
     */
    getSelectedNode : function(){
        return this.selNode;    
    },
    
    /**
     * Returns true if the node is selected
     * @param {TreeNode} node The node to check
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selNode == node;  
    },

    /**
     * Selects the node above the selected node in the tree, intelligently walking the nodes
     * @return TreeNode The new selection
     */
    selectPrevious : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        var ps = s.previousSibling;
        if(ps){
            if(!ps.isExpanded() || ps.childNodes.length < 1){
                return this.select(ps);
            } else{
                var lc = ps.lastChild;
                while(lc && lc.isExpanded() && lc.childNodes.length > 0){
                    lc = lc.lastChild;
                }
                return this.select(lc);
            }
        } else if(s.parentNode && (this.tree.rootVisible || !s.parentNode.isRoot)){
            return this.select(s.parentNode);
        }
        return null;
    },

    /**
     * Selects the node above the selected node in the tree, intelligently walking the nodes
     * @return TreeNode The new selection
     */
    selectNext : function(){
        var s = this.selNode || this.lastSelNode;
        if(!s){
            return null;
        }
        if(s.firstChild && s.isExpanded()){
             return this.select(s.firstChild);
         }else if(s.nextSibling){
             return this.select(s.nextSibling);
         }else if(s.parentNode){
            var newS = null;
            s.parentNode.bubble(function(){
                if(this.nextSibling){
                    newS = this.getOwnerTree().selModel.select(this.nextSibling);
                    return false;
                }
            });
            return newS;
         }
        return null;
    },

    onKeyDown : function(e){
        var s = this.selNode || this.lastSelNode;
        // undesirable, but required
        var sm = this;
        if(!s){
            return;
        }
        var k = e.getKey();
        switch(k){
             case e.DOWN:
                 e.stopEvent();
                 this.selectNext();
             break;
             case e.UP:
                 e.stopEvent();
                 this.selectPrevious();
             break;
             case e.RIGHT:
                 e.preventDefault();
                 if(s.hasChildNodes()){
                     if(!s.isExpanded()){
                         s.expand();
                     }else if(s.firstChild){
                         this.select(s.firstChild, e);
                     }
                 }
             break;
             case e.LEFT:
                 e.preventDefault();
                 if(s.hasChildNodes() && s.isExpanded()){
                     s.collapse();
                 }else if(s.parentNode && (this.tree.rootVisible || s.parentNode != this.tree.getRootNode())){
                     this.select(s.parentNode, e);
                 }
             break;
        };
    }
});

/**
 * @class Roo.tree.MultiSelectionModel
 * @extends Roo.util.Observable
 * Multi selection for a TreePanel.
 */
Roo.tree.MultiSelectionModel = function(){
   this.selNodes = [];
   this.selMap = {};
   this.addEvents({
       /**
        * @event selectionchange
        * Fires when the selected nodes change
        * @param {MultiSelectionModel} this
        * @param {Array} nodes Array of the selected nodes
        */
       "selectionchange" : true
   });
};

Roo.extend(Roo.tree.MultiSelectionModel, Roo.util.Observable, {
    init : function(tree){
        this.tree = tree;
        tree.getTreeEl().on("keydown", this.onKeyDown, this);
        tree.on("click", this.onNodeClick, this);
    },
    
    onNodeClick : function(node, e){
        this.select(node, e, e.ctrlKey);
    },
    
    /**
     * Select a node.
     * @param {TreeNode} node The node to select
     * @param {EventObject} e (optional) An event associated with the selection
     * @param {Boolean} keepExisting True to retain existing selections
     * @return {TreeNode} The selected node
     */
    select : function(node, e, keepExisting){
        if(keepExisting !== true){
            this.clearSelections(true);
        }
        if(this.isSelected(node)){
            this.lastSelNode = node;
            return node;
        }
        this.selNodes.push(node);
        this.selMap[node.id] = node;
        this.lastSelNode = node;
        node.ui.onSelectedChange(true);
        this.fireEvent("selectionchange", this, this.selNodes);
        return node;
    },
    
    /**
     * Deselect a node.
     * @param {TreeNode} node The node to unselect
     */
    unselect : function(node){
        if(this.selMap[node.id]){
            node.ui.onSelectedChange(false);
            var sn = this.selNodes;
            var index = -1;
            if(sn.indexOf){
                index = sn.indexOf(node);
            }else{
                for(var i = 0, len = sn.length; i < len; i++){
                    if(sn[i] == node){
                        index = i;
                        break;
                    }
                }
            }
            if(index != -1){
                this.selNodes.splice(index, 1);
            }
            delete this.selMap[node.id];
            this.fireEvent("selectionchange", this, this.selNodes);
        }
    },
    
    /**
     * Clear all selections
     */
    clearSelections : function(suppressEvent){
        var sn = this.selNodes;
        if(sn.length > 0){
            for(var i = 0, len = sn.length; i < len; i++){
                sn[i].ui.onSelectedChange(false);
            }
            this.selNodes = [];
            this.selMap = {};
            if(suppressEvent !== true){
                this.fireEvent("selectionchange", this, this.selNodes);
            }
        }
    },
    
    /**
     * Returns true if the node is selected
     * @param {TreeNode} node The node to check
     * @return {Boolean}
     */
    isSelected : function(node){
        return this.selMap[node.id] ? true : false;  
    },
    
    /**
     * Returns an array of the selected nodes
     * @return {Array}
     */
    getSelectedNodes : function(){
        return this.selNodes;    
    },

    onKeyDown : Roo.tree.DefaultSelectionModel.prototype.onKeyDown,

    selectNext : Roo.tree.DefaultSelectionModel.prototype.selectNext,

    selectPrevious : Roo.tree.DefaultSelectionModel.prototype.selectPrevious
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
 * @class Roo.tree.TreeNode
 * @extends Roo.data.Node
 * @cfg {String} text The text for this node
 * @cfg {Boolean} expanded true to start the node expanded
 * @cfg {Boolean} allowDrag false to make this node undraggable if DD is on (defaults to true)
 * @cfg {Boolean} allowDrop false if this node cannot be drop on
 * @cfg {Boolean} disabled true to start the node disabled
 * @cfg {String} icon The path to an icon for the node. The preferred way to do this
 * is to use the cls or iconCls attributes and add the icon via a CSS background image.
 * @cfg {String} cls A css class to be added to the node
 * @cfg {String} iconCls A css class to be added to the nodes icon element for applying css background images
 * @cfg {String} href URL of the link used for the node (defaults to #)
 * @cfg {String} hrefTarget target frame for the link
 * @cfg {String} qtip An Ext QuickTip for the node
 * @cfg {String} qtipCfg An Ext QuickTip config for the node (used instead of qtip)
 * @cfg {Boolean} singleClickExpand True for single click expand on this node
 * @cfg {Function} uiProvider A UI <b>class</b> to use for this node (defaults to Roo.tree.TreeNodeUI)
 * @cfg {Boolean} checked True to render a checked checkbox for this node, false to render an unchecked checkbox
 * (defaults to undefined with no checkbox rendered)
 * @constructor
 * @param {Object/String} attributes The attributes/config for the node or just a string with the text for the node
 */
Roo.tree.TreeNode = function(attributes){
    attributes = attributes || {};
    if(typeof attributes == "string"){
        attributes = {text: attributes};
    }
    this.childrenRendered = false;
    this.rendered = false;
    Roo.tree.TreeNode.superclass.constructor.call(this, attributes);
    this.expanded = attributes.expanded === true;
    this.isTarget = attributes.isTarget !== false;
    this.draggable = attributes.draggable !== false && attributes.allowDrag !== false;
    this.allowChildren = attributes.allowChildren !== false && attributes.allowDrop !== false;

    /**
     * Read-only. The text for this node. To change it use setText().
     * @type String
     */
    this.text = attributes.text;
    /**
     * True if this node is disabled.
     * @type Boolean
     */
    this.disabled = attributes.disabled === true;

    this.addEvents({
        /**
        * @event textchange
        * Fires when the text for this node is changed
        * @param {Node} this This node
        * @param {String} text The new text
        * @param {String} oldText The old text
        */
        "textchange" : true,
        /**
        * @event beforeexpand
        * Fires before this node is expanded, return false to cancel.
        * @param {Node} this This node
        * @param {Boolean} deep
        * @param {Boolean} anim
        */
        "beforeexpand" : true,
        /**
        * @event beforecollapse
        * Fires before this node is collapsed, return false to cancel.
        * @param {Node} this This node
        * @param {Boolean} deep
        * @param {Boolean} anim
        */
        "beforecollapse" : true,
        /**
        * @event expand
        * Fires when this node is expanded
        * @param {Node} this This node
        */
        "expand" : true,
        /**
        * @event disabledchange
        * Fires when the disabled status of this node changes
        * @param {Node} this This node
        * @param {Boolean} disabled
        */
        "disabledchange" : true,
        /**
        * @event collapse
        * Fires when this node is collapsed
        * @param {Node} this This node
        */
        "collapse" : true,
        /**
        * @event beforeclick
        * Fires before click processing. Return false to cancel the default action.
        * @param {Node} this This node
        * @param {Roo.EventObject} e The event object
        */
        "beforeclick":true,
        /**
        * @event checkchange
        * Fires when a node with a checkbox's checked property changes
        * @param {Node} this This node
        * @param {Boolean} checked
        */
        "checkchange":true,
        /**
        * @event click
        * Fires when this node is clicked
        * @param {Node} this This node
        * @param {Roo.EventObject} e The event object
        */
        "click":true,
        /**
        * @event dblclick
        * Fires when this node is double clicked
        * @param {Node} this This node
        * @param {Roo.EventObject} e The event object
        */
        "dblclick":true,
        /**
        * @event contextmenu
        * Fires when this node is right clicked
        * @param {Node} this This node
        * @param {Roo.EventObject} e The event object
        */
        "contextmenu":true,
        /**
        * @event beforechildrenrendered
        * Fires right before the child nodes for this node are rendered
        * @param {Node} this This node
        */
        "beforechildrenrendered":true
    });

    var uiClass = this.attributes.uiProvider || Roo.tree.TreeNodeUI;

    /**
     * Read-only. The UI for this node
     * @type TreeNodeUI
     */
    this.ui = new uiClass(this);
};
Roo.extend(Roo.tree.TreeNode, Roo.data.Node, {
    preventHScroll: true,
    /**
     * Returns true if this node is expanded
     * @return {Boolean}
     */
    isExpanded : function(){
        return this.expanded;
    },

    /**
     * Returns the UI object for this node
     * @return {TreeNodeUI}
     */
    getUI : function(){
        return this.ui;
    },

    // private override
    setFirstChild : function(node){
        var of = this.firstChild;
        Roo.tree.TreeNode.superclass.setFirstChild.call(this, node);
        if(this.childrenRendered && of && node != of){
            of.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    // private override
    setLastChild : function(node){
        var ol = this.lastChild;
        Roo.tree.TreeNode.superclass.setLastChild.call(this, node);
        if(this.childrenRendered && ol && node != ol){
            ol.renderIndent(true, true);
        }
        if(this.rendered){
            this.renderIndent(true, true);
        }
    },

    // these methods are overridden to provide lazy rendering support
    // private override
    appendChild : function(){
        var node = Roo.tree.TreeNode.superclass.appendChild.apply(this, arguments);
        if(node && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return node;
    },

    // private override
    removeChild : function(node){
        this.ownerTree.getSelectionModel().unselect(node);
        Roo.tree.TreeNode.superclass.removeChild.apply(this, arguments);
        // if it's been rendered remove dom node
        if(this.childrenRendered){
            node.ui.remove();
        }
        if(this.childNodes.length < 1){
            this.collapse(false, false);
        }else{
            this.ui.updateExpandIcon();
        }
        if(!this.firstChild) {
            this.childrenRendered = false;
        }
        return node;
    },

    // private override
    insertBefore : function(node, refNode){
        var newNode = Roo.tree.TreeNode.superclass.insertBefore.apply(this, arguments);
        if(newNode && refNode && this.childrenRendered){
            node.render();
        }
        this.ui.updateExpandIcon();
        return newNode;
    },

    /**
     * Sets the text for this node
     * @param {String} text
     */
    setText : function(text){
        var oldText = this.text;
        this.text = text;
        this.attributes.text = text;
        if(this.rendered){ // event without subscribing
            this.ui.onTextChange(this, text, oldText);
        }
        this.fireEvent("textchange", this, text, oldText);
    },

    /**
     * Triggers selection of this node
     */
    select : function(){
        this.getOwnerTree().getSelectionModel().select(this);
    },

    /**
     * Triggers deselection of this node
     */
    unselect : function(){
        this.getOwnerTree().getSelectionModel().unselect(this);
    },

    /**
     * Returns true if this node is selected
     * @return {Boolean}
     */
    isSelected : function(){
        return this.getOwnerTree().getSelectionModel().isSelected(this);
    },

    /**
     * Expand this node.
     * @param {Boolean} deep (optional) True to expand all children as well
     * @param {Boolean} anim (optional) false to cancel the default animation
     * @param {Function} callback (optional) A callback to be called when
     * expanding this node completes (does not wait for deep expand to complete).
     * Called with 1 parameter, this node.
     */
    expand : function(deep, anim, callback){
        if(!this.expanded){
            if(this.fireEvent("beforeexpand", this, deep, anim) === false){
                return;
            }
            if(!this.childrenRendered){
                this.renderChildren();
            }
            this.expanded = true;
            if(!this.isHiddenRoot() && (this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animExpand(function(){
                    this.fireEvent("expand", this);
                    if(typeof callback == "function"){
                        callback(this);
                    }
                    if(deep === true){
                        this.expandChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.expand();
                this.fireEvent("expand", this);
                if(typeof callback == "function"){
                    callback(this);
                }
            }
        }else{
           if(typeof callback == "function"){
               callback(this);
           }
        }
        if(deep === true){
            this.expandChildNodes(true);
        }
    },

    isHiddenRoot : function(){
        return this.isRoot && !this.getOwnerTree().rootVisible;
    },

    /**
     * Collapse this node.
     * @param {Boolean} deep (optional) True to collapse all children as well
     * @param {Boolean} anim (optional) false to cancel the default animation
     */
    collapse : function(deep, anim){
        if(this.expanded && !this.isHiddenRoot()){
            if(this.fireEvent("beforecollapse", this, deep, anim) === false){
                return;
            }
            this.expanded = false;
            if((this.getOwnerTree().animate && anim !== false) || anim){
                this.ui.animCollapse(function(){
                    this.fireEvent("collapse", this);
                    if(deep === true){
                        this.collapseChildNodes(true);
                    }
                }.createDelegate(this));
                return;
            }else{
                this.ui.collapse();
                this.fireEvent("collapse", this);
            }
        }
        if(deep === true){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++) {
            	cs[i].collapse(true, false);
            }
        }
    },

    // private
    delayedExpand : function(delay){
        if(!this.expandProcId){
            this.expandProcId = this.expand.defer(delay, this);
        }
    },

    // private
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
        }
        this.expandProcId = false;
    },

    /**
     * Toggles expanded/collapsed state of the node
     */
    toggle : function(){
        if(this.expanded){
            this.collapse();
        }else{
            this.expand();
        }
    },

    /**
     * Ensures all parent nodes are expanded
     */
    ensureVisible : function(callback){
        var tree = this.getOwnerTree();
        tree.expandPath(this.parentNode.getPath(), false, function(){
            tree.getTreeEl().scrollChildIntoView(this.ui.anchor);
            Roo.callback(callback);
        }.createDelegate(this));
    },

    /**
     * Expand all child nodes
     * @param {Boolean} deep (optional) true if the child nodes should also expand their child nodes
     */
    expandChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].expand(deep);
        }
    },

    /**
     * Collapse all child nodes
     * @param {Boolean} deep (optional) true if the child nodes should also collapse their child nodes
     */
    collapseChildNodes : function(deep){
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++) {
        	cs[i].collapse(deep);
        }
    },

    /**
     * Disables this node
     */
    disable : function(){
        this.disabled = true;
        this.unselect();
        if(this.rendered && this.ui.onDisableChange){ // event without subscribing
            this.ui.onDisableChange(this, true);
        }
        this.fireEvent("disabledchange", this, true);
    },

    /**
     * Enables this node
     */
    enable : function(){
        this.disabled = false;
        if(this.rendered && this.ui.onDisableChange){ // event without subscribing
            this.ui.onDisableChange(this, false);
        }
        this.fireEvent("disabledchange", this, false);
    },

    // private
    renderChildren : function(suppressEvent){
        if(suppressEvent !== false){
            this.fireEvent("beforechildrenrendered", this);
        }
        var cs = this.childNodes;
        for(var i = 0, len = cs.length; i < len; i++){
            cs[i].render(true);
        }
        this.childrenRendered = true;
    },

    // private
    sort : function(fn, scope){
        Roo.tree.TreeNode.superclass.sort.apply(this, arguments);
        if(this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].render(true);
            }
        }
    },

    // private
    render : function(bulkRender){
        this.ui.render(bulkRender);
        if(!this.rendered){
            this.rendered = true;
            if(this.expanded){
                this.expanded = false;
                this.expand(false, false);
            }
        }
    },

    // private
    renderIndent : function(deep, refresh){
        if(refresh){
            this.ui.childIndent = null;
        }
        this.ui.renderIndent();
        if(deep === true && this.childrenRendered){
            var cs = this.childNodes;
            for(var i = 0, len = cs.length; i < len; i++){
                cs[i].renderIndent(true, refresh);
            }
        }
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
 * @class Roo.tree.AsyncTreeNode
 * @extends Roo.tree.TreeNode
 * @cfg {TreeLoader} loader A TreeLoader to be used by this node (defaults to the loader defined on the tree)
 * @constructor
 * @param {Object/String} attributes The attributes/config for the node or just a string with the text for the node 
 */
 Roo.tree.AsyncTreeNode = function(config){
    this.loaded = false;
    this.loading = false;
    Roo.tree.AsyncTreeNode.superclass.constructor.apply(this, arguments);
    /**
    * @event beforeload
    * Fires before this node is loaded, return false to cancel
    * @param {Node} this This node
    */
    this.addEvents({'beforeload':true, 'load': true});
    /**
    * @event load
    * Fires when this node is loaded
    * @param {Node} this This node
    */
    /**
     * The loader used by this node (defaults to using the tree's defined loader)
     * @type TreeLoader
     * @property loader
     */
};
Roo.extend(Roo.tree.AsyncTreeNode, Roo.tree.TreeNode, {
    expand : function(deep, anim, callback){
        if(this.loading){ // if an async load is already running, waiting til it's done
            var timer;
            var f = function(){
                if(!this.loading){ // done loading
                    clearInterval(timer);
                    this.expand(deep, anim, callback);
                }
            }.createDelegate(this);
            timer = setInterval(f, 200);
            return;
        }
        if(!this.loaded){
            if(this.fireEvent("beforeload", this) === false){
                return;
            }
            this.loading = true;
            this.ui.beforeLoad(this);
            var loader = this.loader || this.attributes.loader || this.getOwnerTree().getLoader();
            if(loader){
                loader.load(this, this.loadComplete.createDelegate(this, [deep, anim, callback]));
                return;
            }
        }
        Roo.tree.AsyncTreeNode.superclass.expand.call(this, deep, anim, callback);
    },
    
    /**
     * Returns true if this node is currently loading
     * @return {Boolean}
     */
    isLoading : function(){
        return this.loading;  
    },
    
    loadComplete : function(deep, anim, callback){
        this.loading = false;
        this.loaded = true;
        this.ui.afterLoad(this);
        this.fireEvent("load", this);
        this.expand(deep, anim, callback);
    },
    
    /**
     * Returns true if this node has been loaded
     * @return {Boolean}
     */
    isLoaded : function(){
        return this.loaded;
    },
    
    hasChildNodes : function(){
        if(!this.isLeaf() && !this.loaded){
            return true;
        }else{
            return Roo.tree.AsyncTreeNode.superclass.hasChildNodes.call(this);
        }
    },

    /**
     * Trigger a reload for this node
     * @param {Function} callback
     */
    reload : function(callback){
        this.collapse(false, false);
        while(this.firstChild){
            this.removeChild(this.firstChild);
        }
        this.childrenRendered = false;
        this.loaded = false;
        if(this.isHiddenRoot()){
            this.expanded = false;
        }
        this.expand(false, false, callback);
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
 * @class Roo.tree.TreeNodeUI
 * @constructor
 * @param {Object} node The node to render
 * The TreeNode UI implementation is separate from the
 * tree implementation. Unless you are customizing the tree UI,
 * you should never have to use this directly.
 */
Roo.tree.TreeNodeUI = function(node){
    this.node = node;
    this.rendered = false;
    this.animating = false;
    this.emptyIcon = Roo.BLANK_IMAGE_URL;
};

Roo.tree.TreeNodeUI.prototype = {
    removeChild : function(node){
        if(this.rendered){
            this.ctNode.removeChild(node.ui.getEl());
        }
    },

    beforeLoad : function(){
         this.addClass("x-tree-node-loading");
    },

    afterLoad : function(){
         this.removeClass("x-tree-node-loading");
    },

    onTextChange : function(node, text, oldText){
        if(this.rendered){
            this.textNode.innerHTML = text;
        }
    },

    onDisableChange : function(node, state){
        this.disabled = state;
        if(state){
            this.addClass("x-tree-node-disabled");
        }else{
            this.removeClass("x-tree-node-disabled");
        }
    },

    onSelectedChange : function(state){
        if(state){
            this.focus();
            this.addClass("x-tree-selected");
        }else{
            //this.blur();
            this.removeClass("x-tree-selected");
        }
    },

    onMove : function(tree, node, oldParent, newParent, index, refNode){
        this.childIndent = null;
        if(this.rendered){
            var targetNode = newParent.ui.getContainer();
            if(!targetNode){//target not rendered
                this.holder = document.createElement("div");
                this.holder.appendChild(this.wrap);
                return;
            }
            var insertBefore = refNode ? refNode.ui.getEl() : null;
            if(insertBefore){
                targetNode.insertBefore(this.wrap, insertBefore);
            }else{
                targetNode.appendChild(this.wrap);
            }
            this.node.renderIndent(true);
        }
    },

    addClass : function(cls){
        if(this.elNode){
            Roo.fly(this.elNode).addClass(cls);
        }
    },

    removeClass : function(cls){
        if(this.elNode){
            Roo.fly(this.elNode).removeClass(cls);
        }
    },

    remove : function(){
        if(this.rendered){
            this.holder = document.createElement("div");
            this.holder.appendChild(this.wrap);
        }
    },

    fireEvent : function(){
        return this.node.fireEvent.apply(this.node, arguments);
    },

    initEvents : function(){
        this.node.on("move", this.onMove, this);
        var E = Roo.EventManager;
        var a = this.anchor;

        var el = Roo.fly(a, '_treeui');

        if(Roo.isOpera){ // opera render bug ignores the CSS
            el.setStyle("text-decoration", "none");
        }

        el.on("click", this.onClick, this);
        el.on("dblclick", this.onDblClick, this);

        if(this.checkbox){
            Roo.EventManager.on(this.checkbox,
                    Roo.isIE ? 'click' : 'change', this.onCheckChange, this);
        }

        el.on("contextmenu", this.onContextMenu, this);

        var icon = Roo.fly(this.iconNode);
        icon.on("click", this.onClick, this);
        icon.on("dblclick", this.onDblClick, this);
        icon.on("contextmenu", this.onContextMenu, this);
        E.on(this.ecNode, "click", this.ecClick, this, true);

        if(this.node.disabled){
            this.addClass("x-tree-node-disabled");
        }
        if(this.node.hidden){
            this.addClass("x-tree-node-disabled");
        }
        var ot = this.node.getOwnerTree();
        var dd = ot.enableDD || ot.enableDrag || ot.enableDrop;
        if(dd && (!this.node.isRoot || ot.rootVisible)){
            Roo.dd.Registry.register(this.elNode, {
                node: this.node,
                handles: this.getDDHandles(),
                isHandle: false
            });
        }
    },

    getDDHandles : function(){
        return [this.iconNode, this.textNode];
    },

    hide : function(){
        if(this.rendered){
            this.wrap.style.display = "none";
        }
    },

    show : function(){
        if(this.rendered){
            this.wrap.style.display = "";
        }
    },

    onContextMenu : function(e){
        if (this.node.hasListener("contextmenu") || this.node.getOwnerTree().hasListener("contextmenu")) {
            e.preventDefault();
            this.focus();
            this.fireEvent("contextmenu", this.node, e);
        }
    },

    onClick : function(e){
        if(this.dropping){
            e.stopEvent();
            return;
        }
        if(this.fireEvent("beforeclick", this.node, e) !== false){
            if(!this.disabled && this.node.attributes.href){
                this.fireEvent("click", this.node, e);
                return;
            }
            e.preventDefault();
            if(this.disabled){
                return;
            }

            if(this.node.attributes.singleClickExpand && !this.animating && this.node.hasChildNodes()){
                this.node.toggle();
            }

            this.fireEvent("click", this.node, e);
        }else{
            e.stopEvent();
        }
    },

    onDblClick : function(e){
        e.preventDefault();
        if(this.disabled){
            return;
        }
        if(this.checkbox){
            this.toggleCheck();
        }
        if(!this.animating && this.node.hasChildNodes()){
            this.node.toggle();
        }
        this.fireEvent("dblclick", this.node, e);
    },

    onCheckChange : function(){
        var checked = this.checkbox.checked;
        this.node.attributes.checked = checked;
        this.fireEvent('checkchange', this.node, checked);
    },

    ecClick : function(e){
        if(!this.animating && this.node.hasChildNodes()){
            this.node.toggle();
        }
    },

    startDrop : function(){
        this.dropping = true;
    },

    // delayed drop so the click event doesn't get fired on a drop
    endDrop : function(){
       setTimeout(function(){
           this.dropping = false;
       }.createDelegate(this), 50);
    },

    expand : function(){
        this.updateExpandIcon();
        this.ctNode.style.display = "";
    },

    focus : function(){
        if(!this.node.preventHScroll){
            try{this.anchor.focus();
            }catch(e){}
        }else if(!Roo.isIE){
            try{
                var noscroll = this.node.getOwnerTree().getTreeEl().dom;
                var l = noscroll.scrollLeft;
                this.anchor.focus();
                noscroll.scrollLeft = l;
            }catch(e){}
        }
    },

    toggleCheck : function(value){
        var cb = this.checkbox;
        if(cb){
            cb.checked = (value === undefined ? !cb.checked : value);
        }
    },

    blur : function(){
        try{
            this.anchor.blur();
        }catch(e){}
    },

    animExpand : function(callback){
        var ct = Roo.get(this.ctNode);
        ct.stopFx();
        if(!this.node.hasChildNodes()){
            this.updateExpandIcon();
            this.ctNode.style.display = "";
            Roo.callback(callback);
            return;
        }
        this.animating = true;
        this.updateExpandIcon();

        ct.slideIn('t', {
           callback : function(){
               this.animating = false;
               Roo.callback(callback);
            },
            scope: this,
            duration: this.node.ownerTree.duration || .25
        });
    },

    highlight : function(){
        var tree = this.node.getOwnerTree();
        Roo.fly(this.wrap).highlight(
            tree.hlColor || "C3DAF9",
            {endColor: tree.hlBaseColor}
        );
    },

    collapse : function(){
        this.updateExpandIcon();
        this.ctNode.style.display = "none";
    },

    animCollapse : function(callback){
        var ct = Roo.get(this.ctNode);
        ct.enableDisplayMode('block');
        ct.stopFx();

        this.animating = true;
        this.updateExpandIcon();

        ct.slideOut('t', {
            callback : function(){
               this.animating = false;
               Roo.callback(callback);
            },
            scope: this,
            duration: this.node.ownerTree.duration || .25
        });
    },

    getContainer : function(){
        return this.ctNode;
    },

    getEl : function(){
        return this.wrap;
    },

    appendDDGhost : function(ghostNode){
        ghostNode.appendChild(this.elNode.cloneNode(true));
    },

    getDDRepairXY : function(){
        return Roo.lib.Dom.getXY(this.iconNode);
    },

    onRender : function(){
        this.render();
    },

    render : function(bulkRender){
        var n = this.node, a = n.attributes;
        var targetNode = n.parentNode ?
              n.parentNode.ui.getContainer() : n.ownerTree.innerCt.dom;

        if(!this.rendered){
            this.rendered = true;

            this.renderElements(n, a, targetNode, bulkRender);

            if(a.qtip){
               if(this.textNode.setAttributeNS){
                   this.textNode.setAttributeNS("ext", "qtip", a.qtip);
                   if(a.qtipTitle){
                       this.textNode.setAttributeNS("ext", "qtitle", a.qtipTitle);
                   }
               }else{
                   this.textNode.setAttribute("ext:qtip", a.qtip);
                   if(a.qtipTitle){
                       this.textNode.setAttribute("ext:qtitle", a.qtipTitle);
                   }
               }
            }else if(a.qtipCfg){
                a.qtipCfg.target = Roo.id(this.textNode);
                Roo.QuickTips.register(a.qtipCfg);
            }
            this.initEvents();
            if(!this.node.expanded){
                this.updateExpandIcon();
            }
        }else{
            if(bulkRender === true) {
                targetNode.appendChild(this.wrap);
            }
        }
    },

    renderElements : function(n, a, targetNode, bulkRender){
        // add some indent caching, this helps performance when rendering a large tree
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';
        var t = n.getOwnerTree();
        var txt = t.renderer ? t.renderer(n.attributes) : Roo.util.Format.htmlEncode(n.text);
        var tip = t.rendererTip ? t.rendererTip(n.attributes) : txt;
        var cb = typeof a.checked == 'boolean';
        var href = a.href ? a.href : Roo.isGecko ? "" : "#";
        var buf = ['<li class="x-tree-node"><div class="x-tree-node-el ', a.cls,'">',
            '<span class="x-tree-node-indent">',this.indentMarkup,"</span>",
            '<img src="', this.emptyIcon, '" class="x-tree-ec-icon" />',
            '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',(a.icon ? " x-tree-node-inline-icon" : ""),(a.iconCls ? " "+a.iconCls : ""),'" unselectable="on" />',
            cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + (a.checked ? 'checked="checked" />' : ' />')) : '',
            '<a hidefocus="on" href="',href,'" tabIndex="1" ',
             a.hrefTarget ? ' target="'+a.hrefTarget+'"' : "", 
                '><span unselectable="on" qtip="' , tip ,'">',txt,"</span></a></div>",
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>"];

        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Roo.DomHelper.insertHtml("beforeBegin",
                                n.nextSibling.ui.getEl(), buf.join(""));
        }else{
            this.wrap = Roo.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }

        this.elNode = this.wrap.childNodes[0];
        this.ctNode = this.wrap.childNodes[1];
        var cs = this.elNode.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
            this.checkbox = cs[3];
            index++;
        }
        this.anchor = cs[index];
        this.textNode = cs[index].firstChild;
    },

    getAnchor : function(){
        return this.anchor;
    },

    getTextEl : function(){
        return this.textNode;
    },

    getIconEl : function(){
        return this.iconNode;
    },

    isChecked : function(){
        return this.checkbox ? this.checkbox.checked : false;
    },

    updateExpandIcon : function(){
        if(this.rendered){
            var n = this.node, c1, c2;
            var cls = n.isLast() ? "x-tree-elbow-end" : "x-tree-elbow";
            var hasChild = n.hasChildNodes();
            if(hasChild){
                if(n.expanded){
                    cls += "-minus";
                    c1 = "x-tree-node-collapsed";
                    c2 = "x-tree-node-expanded";
                }else{
                    cls += "-plus";
                    c1 = "x-tree-node-expanded";
                    c2 = "x-tree-node-collapsed";
                }
                if(this.wasLeaf){
                    this.removeClass("x-tree-node-leaf");
                    this.wasLeaf = false;
                }
                if(this.c1 != c1 || this.c2 != c2){
                    Roo.fly(this.elNode).replaceClass(c1, c2);
                    this.c1 = c1; this.c2 = c2;
                }
            }else{
                if(!this.wasLeaf){
                    Roo.fly(this.elNode).replaceClass("x-tree-node-expanded", "x-tree-node-leaf");
                    delete this.c1;
                    delete this.c2;
                    this.wasLeaf = true;
                }
            }
            var ecc = "x-tree-ec-icon "+cls;
            if(this.ecc != ecc){
                this.ecNode.className = ecc;
                this.ecc = ecc;
            }
        }
    },

    getChildIndent : function(){
        if(!this.childIndent){
            var buf = [];
            var p = this.node;
            while(p){
                if(!p.isRoot || (p.isRoot && p.ownerTree.rootVisible)){
                    if(!p.isLast()) {
                        buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-elbow-line" />');
                    } else {
                        buf.unshift('<img src="'+this.emptyIcon+'" class="x-tree-icon" />');
                    }
                }
                p = p.parentNode;
            }
            this.childIndent = buf.join("");
        }
        return this.childIndent;
    },

    renderIndent : function(){
        if(this.rendered){
            var indent = "";
            var p = this.node.parentNode;
            if(p){
                indent = p.ui.getChildIndent();
            }
            if(this.indentMarkup != indent){ // don't rerender if not required
                this.indentNode.innerHTML = indent;
                this.indentMarkup = indent;
            }
            this.updateExpandIcon();
        }
    }
};

Roo.tree.RootTreeNodeUI = function(){
    Roo.tree.RootTreeNodeUI.superclass.constructor.apply(this, arguments);
};
Roo.extend(Roo.tree.RootTreeNodeUI, Roo.tree.TreeNodeUI, {
    render : function(){
        if(!this.rendered){
            var targetNode = this.node.ownerTree.innerCt.dom;
            this.node.expanded = true;
            targetNode.innerHTML = '<div class="x-tree-root-node"></div>';
            this.wrap = this.ctNode = targetNode.firstChild;
        }
    },
    collapse : function(){
    },
    expand : function(){
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
 * @class Roo.tree.TreeLoader
 * @extends Roo.util.Observable
 * A TreeLoader provides for lazy loading of an {@link Roo.tree.TreeNode}'s child
 * nodes from a specified URL. The response must be a javascript Array definition
 * who's elements are node definition objects. eg:
 * <pre><code>
   [{ 'id': 1, 'text': 'A folder Node', 'leaf': false },
    { 'id': 2, 'text': 'A leaf Node', 'leaf': true }]
</code></pre>
 * <br><br>
 * A server request is sent, and child nodes are loaded only when a node is expanded.
 * The loading node's id is passed to the server under the parameter name "node" to
 * enable the server to produce the correct child nodes.
 * <br><br>
 * To pass extra parameters, an event handler may be attached to the "beforeload"
 * event, and the parameters specified in the TreeLoader's baseParams property:
 * <pre><code>
    myTreeLoader.on("beforeload", function(treeLoader, node) {
        this.baseParams.category = node.attributes.category;
    }, this);
</code></pre><
 * This would pass an HTTP parameter called "category" to the server containing
 * the value of the Node's "category" attribute.
 * @constructor
 * Creates a new Treeloader.
 * @param {Object} config A config object containing config properties.
 */
Roo.tree.TreeLoader = function(config){
    this.baseParams = {};
    this.requestMethod = "POST";
    Roo.apply(this, config);

    this.addEvents({
    
        /**
         * @event beforeload
         * Fires before a network request is made to retrieve the Json text which specifies a node's children.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Roo.tree.TreeNode} object being loaded.
         * @param {Object} callback The callback function specified in the {@link #load} call.
         */
        beforeload : true,
        /**
         * @event load
         * Fires when the node has been successfuly loaded.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Roo.tree.TreeNode} object being loaded.
         * @param {Object} response The response object containing the data from the server.
         */
        load : true,
        /**
         * @event loadexception
         * Fires if the network request failed.
         * @param {Object} This TreeLoader object.
         * @param {Object} node The {@link Roo.tree.TreeNode} object being loaded.
         * @param {Object} response The response object containing the data from the server.
         */
        loadexception : true,
        /**
         * @event create
         * Fires before a node is created, enabling you to return custom Node types 
         * @param {Object} This TreeLoader object.
         * @param {Object} attr - the data returned from the AJAX call (modify it to suit)
         */
        create : true
    });

    Roo.tree.TreeLoader.superclass.constructor.call(this);
};

Roo.extend(Roo.tree.TreeLoader, Roo.util.Observable, {
    /**
    * @cfg {String} dataUrl The URL from which to request a Json string which
    * specifies an array of node definition object representing the child nodes
    * to be loaded.
    */
    /**
    * @cfg {Object} baseParams (optional) An object containing properties which
    * specify HTTP parameters to be passed to each request for child nodes.
    */
    /**
    * @cfg {Object} baseAttrs (optional) An object containing attributes to be added to all nodes
    * created by this loader. If the attributes sent by the server have an attribute in this object,
    * they take priority.
    */
    /**
    * @cfg {Object} uiProviders (optional) An object containing properties which
    * 
    * DEPRECIATED - use 'create' event handler to modify attributes - which affect creation.
    * specify custom {@link Roo.tree.TreeNodeUI} implementations. If the optional
    * <i>uiProvider</i> attribute of a returned child node is a string rather
    * than a reference to a TreeNodeUI implementation, this that string value
    * is used as a property name in the uiProviders object. You can define the provider named
    * 'default' , and this will be used for all nodes (if no uiProvider is delivered by the node data)
    */
    uiProviders : {},

    /**
    * @cfg {Boolean} clearOnLoad (optional) Default to true. Remove previously existing
    * child nodes before loading.
    */
    clearOnLoad : true,

    /**
    * @cfg {String} root (optional) Default to false. Use this to read data from an object 
    * property on loading, rather than expecting an array. (eg. more compatible to a standard
    * Grid query { data : [ .....] }
    */
    
    root : false,
     /**
    * @cfg {String} queryParam (optional) 
    * Name of the query as it will be passed on the querystring (defaults to 'node')
    * eg. the request will be ?node=[id]
    */
    
    
    queryParam: false,
    
    /**
     * Load an {@link Roo.tree.TreeNode} from the URL specified in the constructor.
     * This is called automatically when a node is expanded, but may be used to reload
     * a node (or append new children if the {@link #clearOnLoad} option is false.)
     * @param {Roo.tree.TreeNode} node
     * @param {Function} callback
     */
    load : function(node, callback){
        if(this.clearOnLoad){
            while(node.firstChild){
                node.removeChild(node.firstChild);
            }
        }
        if(node.attributes.children){ // preloaded json children
            var cs = node.attributes.children;
            for(var i = 0, len = cs.length; i < len; i++){
                node.appendChild(this.createNode(cs[i]));
            }
            if(typeof callback == "function"){
                callback();
            }
        }else if(this.dataUrl){
            this.requestData(node, callback);
        }
    },

    getParams: function(node){
        var buf = [], bp = this.baseParams;
        for(var key in bp){
            if(typeof bp[key] != "function"){
                buf.push(encodeURIComponent(key), "=", encodeURIComponent(bp[key]), "&");
            }
        }
        var n = this.queryParam === false ? 'node' : this.queryParam;
        buf.push(n + "=", encodeURIComponent(node.id));
        return buf.join("");
    },

    requestData : function(node, callback){
        if(this.fireEvent("beforeload", this, node, callback) !== false){
            this.transId = Roo.Ajax.request({
                method:this.requestMethod,
                url: this.dataUrl||this.url,
                success: this.handleResponse,
                failure: this.handleFailure,
                scope: this,
                argument: {callback: callback, node: node},
                params: this.getParams(node)
            });
        }else{
            // if the load is cancelled, make sure we notify
            // the node that we are done
            if(typeof callback == "function"){
                callback();
            }
        }
    },

    isLoading : function(){
        return this.transId ? true : false;
    },

    abort : function(){
        if(this.isLoading()){
            Roo.Ajax.abort(this.transId);
        }
    },

    // private
    createNode : function(attr){
        // apply baseAttrs, nice idea Corey!
        if(this.baseAttrs){
            Roo.applyIf(attr, this.baseAttrs);
        }
        if(this.applyLoader !== false){
            attr.loader = this;
        }
        // uiProvider = depreciated..
        
        if(typeof(attr.uiProvider) == 'string'){
           attr.uiProvider = this.uiProviders[attr.uiProvider] || 
                /**  eval:var:attr */ eval(attr.uiProvider);
        }
        if(typeof(this.uiProviders['default']) != 'undefined') {
            attr.uiProvider = this.uiProviders['default'];
        }
        
        this.fireEvent('create', this, attr);
        
        attr.leaf  = typeof(attr.leaf) == 'string' ? attr.leaf * 1 : attr.leaf;
        return(attr.leaf ?
                        new Roo.tree.TreeNode(attr) :
                        new Roo.tree.AsyncTreeNode(attr));
    },

    processResponse : function(response, node, callback){
        var json = response.responseText;
        try {
            
            var o = /**  eval:var:zzzzzzzzzz */ eval("("+json+")");
            if (this.root !== false) {
                o = o[this.root];
            }
            
            for(var i = 0, len = o.length; i < len; i++){
                var n = this.createNode(o[i]);
                if(n){
                    node.appendChild(n);
                }
            }
            if(typeof callback == "function"){
                callback(this, node);
            }
        }catch(e){
            this.handleFailure(response);
        }
    },

    handleResponse : function(response){
        this.transId = false;
        var a = response.argument;
        this.processResponse(response, a.node, a.callback);
        this.fireEvent("load", this, a.node, response);
    },

    handleFailure : function(response){
        this.transId = false;
        var a = response.argument;
        this.fireEvent("loadexception", this, a.node, response);
        if(typeof a.callback == "function"){
            a.callback(this, a.node);
        }
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
* @class Roo.tree.TreeFilter
* Note this class is experimental and doesn't update the indent (lines) or expand collapse icons of the nodes
* @param {TreePanel} tree
* @param {Object} config (optional)
 */
Roo.tree.TreeFilter = function(tree, config){
    this.tree = tree;
    this.filtered = {};
    Roo.apply(this, config);
};

Roo.tree.TreeFilter.prototype = {
    clearBlank:false,
    reverse:false,
    autoClear:false,
    remove:false,

     /**
     * Filter the data by a specific attribute.
     * @param {String/RegExp} value Either string that the attribute value
     * should start with or a RegExp to test against the attribute
     * @param {String} attr (optional) The attribute passed in your node's attributes collection. Defaults to "text".
     * @param {TreeNode} startNode (optional) The node to start the filter at.
     */
    filter : function(value, attr, startNode){
        attr = attr || "text";
        var f;
        if(typeof value == "string"){
            var vlen = value.length;
            // auto clear empty filter
            if(vlen == 0 && this.clearBlank){
                this.clear();
                return;
            }
            value = value.toLowerCase();
            f = function(n){
                return n.attributes[attr].substr(0, vlen).toLowerCase() == value;
            };
        }else if(value.exec){ // regex?
            f = function(n){
                return value.test(n.attributes[attr]);
            };
        }else{
            throw 'Illegal filter type, must be string or regex';
        }
        this.filterBy(f, null, startNode);
	},

    /**
     * Filter by a function. The passed function will be called with each
     * node in the tree (or from the startNode). If the function returns true, the node is kept
     * otherwise it is filtered. If a node is filtered, its children are also filtered.
     * @param {Function} fn The filter function
     * @param {Object} scope (optional) The scope of the function (defaults to the current node)
     */
    filterBy : function(fn, scope, startNode){
        startNode = startNode || this.tree.root;
        if(this.autoClear){
            this.clear();
        }
        var af = this.filtered, rv = this.reverse;
        var f = function(n){
            if(n == startNode){
                return true;
            }
            if(af[n.id]){
                return false;
            }
            var m = fn.call(scope || n, n);
            if(!m || rv){
                af[n.id] = n;
                n.ui.hide();
                return false;
            }
            return true;
        };
        startNode.cascade(f);
        if(this.remove){
           for(var id in af){
               if(typeof id != "function"){
                   var n = af[id];
                   if(n && n.parentNode){
                       n.parentNode.removeChild(n);
                   }
               }
           }
        }
    },

    /**
     * Clears the current filter. Note: with the "remove" option
     * set a filter cannot be cleared.
     */
    clear : function(){
        var t = this.tree;
        var af = this.filtered;
        for(var id in af){
            if(typeof id != "function"){
                var n = af[id];
                if(n){
                    n.ui.show();
                }
            }
        }
        this.filtered = {};
    }
};
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
 * @class Roo.tree.TreeSorter
 * Provides sorting of nodes in a TreePanel
 * 
 * @cfg {Boolean} folderSort True to sort leaf nodes under non leaf nodes
 * @cfg {String} property The named attribute on the node to sort by (defaults to text)
 * @cfg {String} dir The direction to sort (asc or desc) (defaults to asc)
 * @cfg {String} leafAttr The attribute used to determine leaf nodes in folder sort (defaults to "leaf")
 * @cfg {Boolean} caseSensitive true for case sensitive sort (defaults to false)
 * @cfg {Function} sortType A custom "casting" function used to convert node values before sorting
 * @constructor
 * @param {TreePanel} tree
 * @param {Object} config
 */
Roo.tree.TreeSorter = function(tree, config){
    Roo.apply(this, config);
    tree.on("beforechildrenrendered", this.doSort, this);
    tree.on("append", this.updateSort, this);
    tree.on("insert", this.updateSort, this);
    
    var dsc = this.dir && this.dir.toLowerCase() == "desc";
    var p = this.property || "text";
    var sortType = this.sortType;
    var fs = this.folderSort;
    var cs = this.caseSensitive === true;
    var leafAttr = this.leafAttr || 'leaf';

    this.sortFn = function(n1, n2){
        if(fs){
            if(n1.attributes[leafAttr] && !n2.attributes[leafAttr]){
                return 1;
            }
            if(!n1.attributes[leafAttr] && n2.attributes[leafAttr]){
                return -1;
            }
        }
    	var v1 = sortType ? sortType(n1) : (cs ? n1.attributes[p] : n1.attributes[p].toUpperCase());
    	var v2 = sortType ? sortType(n2) : (cs ? n2.attributes[p] : n2.attributes[p].toUpperCase());
    	if(v1 < v2){
			return dsc ? +1 : -1;
		}else if(v1 > v2){
			return dsc ? -1 : +1;
        }else{
	    	return 0;
        }
    };
};

Roo.tree.TreeSorter.prototype = {
    doSort : function(node){
        node.sort(this.sortFn);
    },
    
    compareNodes : function(n1, n2){
        return (n1.text.toUpperCase() > n2.text.toUpperCase() ? 1 : -1);
    },
    
    updateSort : function(tree, node){
        if(node.childrenRendered){
            this.doSort.defer(1, this, [node]);
        }
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

if(Roo.dd.DropZone){
    
Roo.tree.TreeDropZone = function(tree, config){
    this.allowParentInsert = false;
    this.allowContainerDrop = false;
    this.appendOnly = false;
    Roo.tree.TreeDropZone.superclass.constructor.call(this, tree.innerCt, config);
    this.tree = tree;
    this.lastInsertClass = "x-tree-no-status";
    this.dragOverData = {};
};

Roo.extend(Roo.tree.TreeDropZone, Roo.dd.DropZone, {
    ddGroup : "TreeDD",
    
    expandDelay : 1000,
    
    expandNode : function(node){
        if(node.hasChildNodes() && !node.isExpanded()){
            node.expand(false, null, this.triggerCacheRefresh.createDelegate(this));
        }
    },
    
    queueExpand : function(node){
        this.expandProcId = this.expandNode.defer(this.expandDelay, this, [node]);
    },
    
    cancelExpand : function(){
        if(this.expandProcId){
            clearTimeout(this.expandProcId);
            this.expandProcId = false;
        }
    },
    
    isValidDropPoint : function(n, pt, dd, e, data){
        if(!n || !data){ return false; }
        var targetNode = n.node;
        var dropNode = data.node;
        // default drop rules
        if(!(targetNode && targetNode.isTarget && pt)){
            return false;
        }
        if(pt == "append" && targetNode.allowChildren === false){
            return false;
        }
        if((pt == "above" || pt == "below") && (targetNode.parentNode && targetNode.parentNode.allowChildren === false)){
            return false;
        }
        if(dropNode && (targetNode == dropNode || dropNode.contains(targetNode))){
            return false;
        }
        // reuse the object
        var overEvent = this.dragOverData;
        overEvent.tree = this.tree;
        overEvent.target = targetNode;
        overEvent.data = data;
        overEvent.point = pt;
        overEvent.source = dd;
        overEvent.rawEvent = e;
        overEvent.dropNode = dropNode;
        overEvent.cancel = false;  
        var result = this.tree.fireEvent("nodedragover", overEvent);
        return overEvent.cancel === false && result !== false;
    },
    
    getDropPoint : function(e, n, dd){
        var tn = n.node;
        if(tn.isRoot){
            return tn.allowChildren !== false ? "append" : false; // always append for root
        }
        var dragEl = n.ddel;
        var t = Roo.lib.Dom.getY(dragEl), b = t + dragEl.offsetHeight;
        var y = Roo.lib.Event.getPageY(e);
        var noAppend = tn.allowChildren === false || tn.isLeaf();
        if(this.appendOnly || tn.parentNode.allowChildren === false){
            return noAppend ? false : "append";
        }
        var noBelow = false;
        if(!this.allowParentInsert){
            noBelow = tn.hasChildNodes() && tn.isExpanded();
        }
        var q = (b - t) / (noAppend ? 2 : 3);
        if(y >= t && y < (t + q)){
            return "above";
        }else if(!noBelow && (noAppend || y >= b-q && y <= b)){
            return "below";
        }else{
            return "append";
        }
    },
    
    onNodeEnter : function(n, dd, e, data){
        this.cancelExpand();
    },
    
    onNodeOver : function(n, dd, e, data){
        var pt = this.getDropPoint(e, n, dd);
        var node = n.node;
        
        // auto node expand check
        if(!this.expandProcId && pt == "append" && node.hasChildNodes() && !n.node.isExpanded()){
            this.queueExpand(node);
        }else if(pt != "append"){
            this.cancelExpand();
        }
        
        // set the insert point style on the target node
        var returnCls = this.dropNotAllowed;
        if(this.isValidDropPoint(n, pt, dd, e, data)){
           if(pt){
               var el = n.ddel;
               var cls;
               if(pt == "above"){
                   returnCls = n.node.isFirst() ? "x-tree-drop-ok-above" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-above";
               }else if(pt == "below"){
                   returnCls = n.node.isLast() ? "x-tree-drop-ok-below" : "x-tree-drop-ok-between";
                   cls = "x-tree-drag-insert-below";
               }else{
                   returnCls = "x-tree-drop-ok-append";
                   cls = "x-tree-drag-append";
               }
               if(this.lastInsertClass != cls){
                   Roo.fly(el).replaceClass(this.lastInsertClass, cls);
                   this.lastInsertClass = cls;
               }
           }
       }
       return returnCls;
    },
    
    onNodeOut : function(n, dd, e, data){
        this.cancelExpand();
        this.removeDropIndicators(n);
    },
    
    onNodeDrop : function(n, dd, e, data){
        var point = this.getDropPoint(e, n, dd);
        var targetNode = n.node;
        targetNode.ui.startDrop();
        if(!this.isValidDropPoint(n, point, dd, e, data)){
            targetNode.ui.endDrop();
            return false;
        }
        // first try to find the drop node
        var dropNode = data.node || (dd.getTreeNode ? dd.getTreeNode(data, targetNode, point, e) : null);
        var dropEvent = {
            tree : this.tree,
            target: targetNode,
            data: data,
            point: point,
            source: dd,
            rawEvent: e,
            dropNode: dropNode,
            cancel: !dropNode   
        };
        var retval = this.tree.fireEvent("beforenodedrop", dropEvent);
        if(retval === false || dropEvent.cancel === true || !dropEvent.dropNode){
            targetNode.ui.endDrop();
            return false;
        }
        // allow target changing
        targetNode = dropEvent.target;
        if(point == "append" && !targetNode.isExpanded()){
            targetNode.expand(false, null, function(){
                this.completeDrop(dropEvent);
            }.createDelegate(this));
        }else{
            this.completeDrop(dropEvent);
        }
        return true;
    },
    
    completeDrop : function(de){
        var ns = de.dropNode, p = de.point, t = de.target;
        if(!(ns instanceof Array)){
            ns = [ns];
        }
        var n;
        for(var i = 0, len = ns.length; i < len; i++){
            n = ns[i];
            if(p == "above"){
                t.parentNode.insertBefore(n, t);
            }else if(p == "below"){
                t.parentNode.insertBefore(n, t.nextSibling);
            }else{
                t.appendChild(n);
            }
        }
        n.ui.focus();
        if(this.tree.hlDrop){
            n.ui.highlight();
        }
        t.ui.endDrop();
        this.tree.fireEvent("nodedrop", de);
    },
    
    afterNodeMoved : function(dd, data, e, targetNode, dropNode){
        if(this.tree.hlDrop){
            dropNode.ui.focus();
            dropNode.ui.highlight();
        }
        this.tree.fireEvent("nodedrop", this.tree, targetNode, data, dd, e);
    },
    
    getTree : function(){
        return this.tree;
    },
    
    removeDropIndicators : function(n){
        if(n && n.ddel){
            var el = n.ddel;
            Roo.fly(el).removeClass([
                    "x-tree-drag-insert-above",
                    "x-tree-drag-insert-below",
                    "x-tree-drag-append"]);
            this.lastInsertClass = "_noclass";
        }
    },
    
    beforeDragDrop : function(target, e, id){
        this.cancelExpand();
        return true;
    },
    
    afterRepair : function(data){
        if(data && Roo.enableFx){
            data.node.ui.highlight();
        }
        this.hideProxy();
    }    
});

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
 

if(Roo.dd.DragZone){
Roo.tree.TreeDragZone = function(tree, config){
    Roo.tree.TreeDragZone.superclass.constructor.call(this, tree.getTreeEl(), config);
    this.tree = tree;
};

Roo.extend(Roo.tree.TreeDragZone, Roo.dd.DragZone, {
    ddGroup : "TreeDD",
    
    onBeforeDrag : function(data, e){
        var n = data.node;
        return n && n.draggable && !n.disabled;
    },
    
    onInitDrag : function(e){
        var data = this.dragData;
        this.tree.getSelectionModel().select(data.node);
        this.proxy.update("");
        data.node.ui.appendDDGhost(this.proxy.ghost.dom);
        this.tree.fireEvent("startdrag", this.tree, data.node, e);
    },
    
    getRepairXY : function(e, data){
        return data.node.ui.getDDRepairXY();
    },
    
    onEndDrag : function(data, e){
        this.tree.fireEvent("enddrag", this.tree, data.node, e);
    },
    
    onValidDrop : function(dd, e, id){
        this.tree.fireEvent("dragdrop", this.tree, this.dragData.node, dd, e);
        this.hideProxy();
    },
    
    beforeInvalidDrop : function(e, id){
        // this scrolls the original position back into view
        var sm = this.tree.getSelectionModel();
        sm.clearSelections();
        sm.select(this.dragData.node);
    }
});
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
 * @class Roo.tree.TreeEditor
 * @extends Roo.Editor
 * Provides editor functionality for inline tree node editing.  Any valid {@link Roo.form.Field} can be used
 * as the editor field.
 * @constructor
 * @param {TreePanel} tree
 * @param {Object} config Either a prebuilt {@link Roo.form.Field} instance or a Field config object
 */
Roo.tree.TreeEditor = function(tree, config){
    config = config || {};
    var field = config.events ? config : new Roo.form.TextField(config);
    Roo.tree.TreeEditor.superclass.constructor.call(this, field);

    this.tree = tree;

    tree.on('beforeclick', this.beforeNodeClick, this);
    tree.getTreeEl().on('mousedown', this.hide, this);
    this.on('complete', this.updateNode, this);
    this.on('beforestartedit', this.fitToTree, this);
    this.on('startedit', this.bindScroll, this, {delay:10});
    this.on('specialkey', this.onSpecialKey, this);
};

Roo.extend(Roo.tree.TreeEditor, Roo.Editor, {
    /**
     * @cfg {String} alignment
     * The position to align to (see {@link Roo.Element#alignTo} for more details, defaults to "l-l").
     */
    alignment: "l-l",
    // inherit
    autoSize: false,
    /**
     * @cfg {Boolean} hideEl
     * True to hide the bound element while the editor is displayed (defaults to false)
     */
    hideEl : false,
    /**
     * @cfg {String} cls
     * CSS class to apply to the editor (defaults to "x-small-editor x-tree-editor")
     */
    cls: "x-small-editor x-tree-editor",
    /**
     * @cfg {Boolean} shim
     * True to shim the editor if selects/iframes could be displayed beneath it (defaults to false)
     */
    shim:false,
    // inherit
    shadow:"frame",
    /**
     * @cfg {Number} maxWidth
     * The maximum width in pixels of the editor field (defaults to 250).  Note that if the maxWidth would exceed
     * the containing tree element's size, it will be automatically limited for you to the container width, taking
     * scroll and client offsets into account prior to each edit.
     */
    maxWidth: 250,

    editDelay : 350,

    // private
    fitToTree : function(ed, el){
        var td = this.tree.getTreeEl().dom, nd = el.dom;
        if(td.scrollLeft >  nd.offsetLeft){ // ensure the node left point is visible
            td.scrollLeft = nd.offsetLeft;
        }
        var w = Math.min(
                this.maxWidth,
                (td.clientWidth > 20 ? td.clientWidth : td.offsetWidth) - Math.max(0, nd.offsetLeft-td.scrollLeft) - /*cushion*/5);
        this.setSize(w, '');
    },

    // private
    triggerEdit : function(node){
        this.completeEdit();
        this.editNode = node;
        this.startEdit(node.ui.textNode, node.text);
    },

    // private
    bindScroll : function(){
        this.tree.getTreeEl().on('scroll', this.cancelEdit, this);
    },

    // private
    beforeNodeClick : function(node, e){
        var sinceLast = (this.lastClick ? this.lastClick.getElapsed() : 0);
        this.lastClick = new Date();
        if(sinceLast > this.editDelay && this.tree.getSelectionModel().isSelected(node)){
            e.stopEvent();
            this.triggerEdit(node);
            return false;
        }
    },

    // private
    updateNode : function(ed, value){
        this.tree.getTreeEl().un('scroll', this.cancelEdit, this);
        this.editNode.setText(value);
    },

    // private
    onHide : function(){
        Roo.tree.TreeEditor.superclass.onHide.call(this);
        if(this.editNode){
            this.editNode.ui.focus();
        }
    },

    // private
    onSpecialKey : function(field, e){
        var k = e.getKey();
        if(k == e.ESC){
            e.stopEvent();
            this.cancelEdit();
        }else if(k == e.ENTER && !e.hasModifier()){
            e.stopEvent();
            this.completeEdit();
        }
    }
});//<Script type="text/javascript">
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
 * Not documented??? - probably should be...
 */

Roo.tree.ColumnNodeUI = Roo.extend(Roo.tree.TreeNodeUI, {
    //focus: Roo.emptyFn, // prevent odd scrolling behavior
    
    renderElements : function(n, a, targetNode, bulkRender){
        //consel.log("renderElements?");
        this.indentMarkup = n.parentNode ? n.parentNode.ui.getChildIndent() : '';

        var t = n.getOwnerTree();
        var tid = Pman.Tab.Document_TypesTree.tree.el.id;
        
        var cols = t.columns;
        var bw = t.borderWidth;
        var c = cols[0];
        var href = a.href ? a.href : Roo.isGecko ? "" : "#";
         var cb = typeof a.checked == "boolean";
        var tx = String.format('{0}',n.text || (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]));
        var colcls = 'x-t-' + tid + '-c0';
        var buf = [
            '<li class="x-tree-node">',
            
                
                '<div class="x-tree-node-el ', a.cls,'">',
                    // extran...
                    '<div class="x-tree-col ', colcls, '" style="width:', c.width-bw, 'px;">',
                
                
                        '<span class="x-tree-node-indent">',this.indentMarkup,'</span>',
                        '<img src="', this.emptyIcon, '" class="x-tree-ec-icon  " />',
                        '<img src="', a.icon || this.emptyIcon, '" class="x-tree-node-icon',
                           (a.icon ? ' x-tree-node-inline-icon' : ''),
                           (a.iconCls ? ' '+a.iconCls : ''),
                           '" unselectable="on" />',
                        (cb ? ('<input class="x-tree-node-cb" type="checkbox" ' + 
                             (a.checked ? 'checked="checked" />' : ' />')) : ''),
                             
                        '<a class="x-tree-node-anchor" hidefocus="on" href="',href,'" tabIndex="1" ',
                            (a.hrefTarget ? ' target="' +a.hrefTarget + '"' : ''), '>',
                            '<span unselectable="on" qtip="' + tx + '">',
                             tx,
                             '</span></a>' ,
                    '</div>',
                     '<a class="x-tree-node-anchor" hidefocus="on" href="',href,'" tabIndex="1" ',
                            (a.hrefTarget ? ' target="' +a.hrefTarget + '"' : ''), '>',
                 ];
        
        for(var i = 1, len = cols.length; i < len; i++){
            c = cols[i];
            colcls = 'x-t-' + tid + '-c' +i;
            tx = String.format('{0}', (c.renderer ? c.renderer(a[c.dataIndex], n, a) : a[c.dataIndex]));
            buf.push('<div class="x-tree-col ', colcls, ' ' ,(c.cls?c.cls:''),'" style="width:',c.width-bw,'px;">',
                        '<div class="x-tree-col-text" qtip="' + tx +'">',tx,"</div>",
                      "</div>");
         }
         
         buf.push(
            '</a>',
            '<div class="x-clear"></div></div>',
            '<ul class="x-tree-node-ct" style="display:none;"></ul>',
            "</li>");
        
        if(bulkRender !== true && n.nextSibling && n.nextSibling.ui.getEl()){
            this.wrap = Roo.DomHelper.insertHtml("beforeBegin",
                                n.nextSibling.ui.getEl(), buf.join(""));
        }else{
            this.wrap = Roo.DomHelper.insertHtml("beforeEnd", targetNode, buf.join(""));
        }
        var el = this.wrap.firstChild;
        this.elRow = el;
        this.elNode = el.firstChild;
        this.ranchor = el.childNodes[1];
        this.ctNode = this.wrap.childNodes[1];
        var cs = el.firstChild.childNodes;
        this.indentNode = cs[0];
        this.ecNode = cs[1];
        this.iconNode = cs[2];
        var index = 3;
        if(cb){
            this.checkbox = cs[3];
            index++;
        }
        this.anchor = cs[index];
        
        this.textNode = cs[index].firstChild;
        
        //el.on("click", this.onClick, this);
        //el.on("dblclick", this.onDblClick, this);
        
        
       // console.log(this);
    },
    initEvents : function(){
        Roo.tree.ColumnNodeUI.superclass.initEvents.call(this);
        
            
        var a = this.ranchor;

        var el = Roo.get(a);

        if(Roo.isOpera){ // opera render bug ignores the CSS
            el.setStyle("text-decoration", "none");
        }

        el.on("click", this.onClick, this);
        el.on("dblclick", this.onDblClick, this);
        el.on("contextmenu", this.onContextMenu, this);
        
    },
    
    /*onSelectedChange : function(state){
        if(state){
            this.focus();
            this.addClass("x-tree-selected");
        }else{
            //this.blur();
            this.removeClass("x-tree-selected");
        }
    },*/
    addClass : function(cls){
        if(this.elRow){
            Roo.fly(this.elRow).addClass(cls);
        }
        
    },
    
    
    removeClass : function(cls){
        if(this.elRow){
            Roo.fly(this.elRow).removeClass(cls);
        }
    }

    
    
});//<Script type="text/javascript">

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
 * @class Roo.tree.ColumnTree
 * @extends Roo.data.TreePanel
 * @cfg {Object} columns  Including width, header, renderer, cls, dataIndex 
 * @cfg {int} borderWidth  compined right/left border allowance
 * @constructor
 * @param {String/HTMLElement/Element} el The container element
 * @param {Object} config
 */
Roo.tree.ColumnTree =  function(el, config)
{
   Roo.tree.ColumnTree.superclass.constructor.call(this, el , config);
   this.addEvents({
        /**
        * @event resize
        * Fire this event on a container when it resizes
        * @param {int} w Width
        * @param {int} h Height
        */
       "resize" : true
    });
    this.on('resize', this.onResize, this);
};

Roo.extend(Roo.tree.ColumnTree, Roo.tree.TreePanel, {
    //lines:false,
    
    
    borderWidth: Roo.isBorderBox ? 0 : 2, 
    headEls : false,
    
    render : function(){
        // add the header.....
       
        Roo.tree.ColumnTree.superclass.render.apply(this);
        
        this.el.addClass('x-column-tree');
        
        this.headers = this.el.createChild(
            {cls:'x-tree-headers'},this.innerCt.dom);
   
        var cols = this.columns, c;
        var totalWidth = 0;
        this.headEls = [];
        var  len = cols.length;
        for(var i = 0; i < len; i++){
             c = cols[i];
             totalWidth += c.width;
            this.headEls.push(this.headers.createChild({
                 cls:'x-tree-hd ' + (c.cls?c.cls+'-hd':''),
                 cn: {
                     cls:'x-tree-hd-text',
                     html: c.header
                 },
                 style:'width:'+(c.width-this.borderWidth)+'px;'
             }));
        }
        this.headers.createChild({cls:'x-clear'});
        // prevent floats from wrapping when clipped
        this.headers.setWidth(totalWidth);
        //this.innerCt.setWidth(totalWidth);
        this.innerCt.setStyle({ overflow: 'auto' });
        this.onResize(this.width, this.height);
             
        
    },
    onResize : function(w,h)
    {
        this.height = h;
        this.width = w;
        // resize cols..
        this.innerCt.setWidth(this.width);
        this.innerCt.setHeight(this.height-20);
        
        // headers...
        var cols = this.columns, c;
        var totalWidth = 0;
        var expEl = false;
        var len = cols.length;
        for(var i = 0; i < len; i++){
            c = cols[i];
            if (this.autoExpandColumn !== false && c.dataIndex == this.autoExpandColumn) {
                // it's the expander..
                expEl  = this.headEls[i];
                continue;
            }
            totalWidth += c.width;
            
        }
        if (expEl) {
            expEl.setWidth(  ((w - totalWidth)-this.borderWidth - 20));
        }
        this.headers.setWidth(w-20);

        
        
        
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
 * @class Roo.menu.Menu
 * @extends Roo.util.Observable
 * A menu object.  This is the container to which you add all other menu items.  Menu can also serve a as a base class
 * when you want a specialzed menu based off of another component (like {@link Roo.menu.DateMenu} for example).
 * @constructor
 * Creates a new Menu
 * @param {Object} config Configuration options
 */
Roo.menu.Menu = function(config){
    Roo.apply(this, config);
    this.id = this.id || Roo.id();
    this.addEvents({
        /**
         * @event beforeshow
         * Fires before this menu is displayed
         * @param {Roo.menu.Menu} this
         */
        beforeshow : true,
        /**
         * @event beforehide
         * Fires before this menu is hidden
         * @param {Roo.menu.Menu} this
         */
        beforehide : true,
        /**
         * @event show
         * Fires after this menu is displayed
         * @param {Roo.menu.Menu} this
         */
        show : true,
        /**
         * @event hide
         * Fires after this menu is hidden
         * @param {Roo.menu.Menu} this
         */
        hide : true,
        /**
         * @event click
         * Fires when this menu is clicked (or when the enter key is pressed while it is active)
         * @param {Roo.menu.Menu} this
         * @param {Roo.menu.Item} menuItem The menu item that was clicked
         * @param {Roo.EventObject} e
         */
        click : true,
        /**
         * @event mouseover
         * Fires when the mouse is hovering over this menu
         * @param {Roo.menu.Menu} this
         * @param {Roo.EventObject} e
         * @param {Roo.menu.Item} menuItem The menu item that was clicked
         */
        mouseover : true,
        /**
         * @event mouseout
         * Fires when the mouse exits this menu
         * @param {Roo.menu.Menu} this
         * @param {Roo.EventObject} e
         * @param {Roo.menu.Item} menuItem The menu item that was clicked
         */
        mouseout : true,
        /**
         * @event itemclick
         * Fires when a menu item contained in this menu is clicked
         * @param {Roo.menu.BaseItem} baseItem The BaseItem that was clicked
         * @param {Roo.EventObject} e
         */
        itemclick: true
    });
    if (this.registerMenu) {
        Roo.menu.MenuMgr.register(this);
    }
    
    var mis = this.items;
    this.items = new Roo.util.MixedCollection();
    if(mis){
        this.add.apply(this, mis);
    }
};

Roo.extend(Roo.menu.Menu, Roo.util.Observable, {
    /**
     * @cfg {Number} minWidth The minimum width of the menu in pixels (defaults to 120)
     */
    minWidth : 120,
    /**
     * @cfg {Boolean/String} shadow True or "sides" for the default effect, "frame" for 4-way shadow, and "drop"
     * for bottom-right shadow (defaults to "sides")
     */
    shadow : "sides",
    /**
     * @cfg {String} subMenuAlign The {@link Roo.Element#alignTo} anchor position value to use for submenus of
     * this menu (defaults to "tl-tr?")
     */
    subMenuAlign : "tl-tr?",
    /**
     * @cfg {String} defaultAlign The default {@link Roo.Element#alignTo) anchor position value for this menu
     * relative to its element of origin (defaults to "tl-bl?")
     */
    defaultAlign : "tl-bl?",
    /**
     * @cfg {Boolean} allowOtherMenus True to allow multiple menus to be displayed at the same time (defaults to false)
     */
    allowOtherMenus : false,
    /**
     * @cfg {Boolean} registerMenu True (default) - means that clicking on screen etc. hides it.
     */
    registerMenu : true,

    hidden:true,

    // private
    render : function(){
        if(this.el){
            return;
        }
        var el = this.el = new Roo.Layer({
            cls: "x-menu",
            shadow:this.shadow,
            constrain: false,
            parentEl: this.parentEl || document.body,
            zindex:15000
        });

        this.keyNav = new Roo.menu.MenuNav(this);

        if(this.plain){
            el.addClass("x-menu-plain");
        }
        if(this.cls){
            el.addClass(this.cls);
        }
        // generic focus element
        this.focusEl = el.createChild({
            tag: "a", cls: "x-menu-focus", href: "#", onclick: "return false;", tabIndex:"-1"
        });
        var ul = el.createChild({tag: "ul", cls: "x-menu-list"});
        ul.on("click", this.onClick, this);
        ul.on("mouseover", this.onMouseOver, this);
        ul.on("mouseout", this.onMouseOut, this);
        this.items.each(function(item){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            ul.dom.appendChild(li);
            item.render(li, this);
        }, this);
        this.ul = ul;
        this.autoWidth();
    },

    // private
    autoWidth : function(){
        var el = this.el, ul = this.ul;
        if(!el){
            return;
        }
        var w = this.width;
        if(w){
            el.setWidth(w);
        }else if(Roo.isIE){
            el.setWidth(this.minWidth);
            var t = el.dom.offsetWidth; // force recalc
            el.setWidth(ul.getWidth()+el.getFrameWidth("lr"));
        }
    },

    // private
    delayAutoWidth : function(){
        if(this.rendered){
            if(!this.awTask){
                this.awTask = new Roo.util.DelayedTask(this.autoWidth, this);
            }
            this.awTask.delay(20);
        }
    },

    // private
    findTargetItem : function(e){
        var t = e.getTarget(".x-menu-list-item", this.ul,  true);
        if(t && t.menuItemId){
            return this.items.get(t.menuItemId);
        }
    },

    // private
    onClick : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            t.onClick(e);
            this.fireEvent("click", this, t, e);
        }
    },

    // private
    setActiveItem : function(item, autoExpand){
        if(item != this.activeItem){
            if(this.activeItem){
                this.activeItem.deactivate();
            }
            this.activeItem = item;
            item.activate(autoExpand);
        }else if(autoExpand){
            item.expandMenu();
        }
    },

    // private
    tryActivate : function(start, step){
        var items = this.items;
        for(var i = start, len = items.length; i >= 0 && i < len; i+= step){
            var item = items.get(i);
            if(!item.disabled && item.canActivate){
                this.setActiveItem(item, false);
                return item;
            }
        }
        return false;
    },

    // private
    onMouseOver : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t.canActivate && !t.disabled){
                this.setActiveItem(t, true);
            }
        }
        this.fireEvent("mouseover", this, e, t);
    },

    // private
    onMouseOut : function(e){
        var t;
        if(t = this.findTargetItem(e)){
            if(t == this.activeItem && t.shouldDeactivate(e)){
                this.activeItem.deactivate();
                delete this.activeItem;
            }
        }
        this.fireEvent("mouseout", this, e, t);
    },

    /**
     * Read-only.  Returns true if the menu is currently displayed, else false.
     * @type Boolean
     */
    isVisible : function(){
        return this.el && !this.hidden;
    },

    /**
     * Displays this menu relative to another element
     * @param {String/HTMLElement/Roo.Element} element The element to align to
     * @param {String} position (optional) The {@link Roo.Element#alignTo} anchor position to use in aligning to
     * the element (defaults to this.defaultAlign)
     * @param {Roo.menu.Menu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
     */
    show : function(el, pos, parentMenu){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        this.fireEvent("beforeshow", this);
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign), parentMenu, false);
    },

    /**
     * Displays this menu at a specific xy position
     * @param {Array} xyPosition Contains X & Y [x, y] values for the position at which to show the menu (coordinates are page-based)
     * @param {Roo.menu.Menu} parentMenu (optional) This menu's parent menu, if applicable (defaults to undefined)
     */
    showAt : function(xy, parentMenu, /* private: */_e){
        this.parentMenu = parentMenu;
        if(!this.el){
            this.render();
        }
        if(_e !== false){
            this.fireEvent("beforeshow", this);
            xy = this.el.adjustForConstraints(xy);
        }
        this.el.setXY(xy);
        this.el.show();
        this.hidden = false;
        this.focus();
        this.fireEvent("show", this);
    },

    focus : function(){
        if(!this.hidden){
            this.doFocus.defer(50, this);
        }
    },

    doFocus : function(){
        if(!this.hidden){
            this.focusEl.focus();
        }
    },

    /**
     * Hides this menu and optionally all parent menus
     * @param {Boolean} deep (optional) True to hide all parent menus recursively, if any (defaults to false)
     */
    hide : function(deep){
        if(this.el && this.isVisible()){
            this.fireEvent("beforehide", this);
            if(this.activeItem){
                this.activeItem.deactivate();
                this.activeItem = null;
            }
            this.el.hide();
            this.hidden = true;
            this.fireEvent("hide", this);
        }
        if(deep === true && this.parentMenu){
            this.parentMenu.hide(true);
        }
    },

    /**
     * Addds one or more items of any type supported by the Menu class, or that can be converted into menu items.
     * Any of the following are valid:
     * <ul>
     * <li>Any menu item object based on {@link Roo.menu.Item}</li>
     * <li>An HTMLElement object which will be converted to a menu item</li>
     * <li>A menu item config object that will be created as a new menu item</li>
     * <li>A string, which can either be '-' or 'separator' to add a menu separator, otherwise
     * it will be converted into a {@link Roo.menu.TextItem} and added</li>
     * </ul>
     * Usage:
     * <pre><code>
// Create the menu
var menu = new Roo.menu.Menu();

// Create a menu item to add by reference
var menuItem = new Roo.menu.Item({ text: 'New Item!' });

// Add a bunch of items at once using different methods.
// Only the last item added will be returned.
var item = menu.add(
    menuItem,                // add existing item by ref
    'Dynamic Item',          // new TextItem
    '-',                     // new separator
    { text: 'Config Item' }  // new item by config
);
</code></pre>
     * @param {Mixed} args One or more menu items, menu item configs or other objects that can be converted to menu items
     * @return {Roo.menu.Item} The menu item that was added, or the last one if multiple items were added
     */
    add : function(){
        var a = arguments, l = a.length, item;
        for(var i = 0; i < l; i++){
            var el = a[i];
            if(el.render){ // some kind of Item
                item = this.addItem(el);
            }else if(typeof el == "string"){ // string
                if(el == "separator" || el == "-"){
                    item = this.addSeparator();
                }else{
                    item = this.addText(el);
                }
            }else if(el.tagName || el.el){ // element
                item = this.addElement(el);
            }else if(typeof el == "object"){ // must be menu item config?
                item = this.addMenuItem(el);
            }
        }
        return item;
    },

    /**
     * Returns this menu's underlying {@link Roo.Element} object
     * @return {Roo.Element} The element
     */
    getEl : function(){
        if(!this.el){
            this.render();
        }
        return this.el;
    },

    /**
     * Adds a separator bar to the menu
     * @return {Roo.menu.Item} The menu item that was added
     */
    addSeparator : function(){
        return this.addItem(new Roo.menu.Separator());
    },

    /**
     * Adds an {@link Roo.Element} object to the menu
     * @param {String/HTMLElement/Roo.Element} el The element or DOM node to add, or its id
     * @return {Roo.menu.Item} The menu item that was added
     */
    addElement : function(el){
        return this.addItem(new Roo.menu.BaseItem(el));
    },

    /**
     * Adds an existing object based on {@link Roo.menu.Item} to the menu
     * @param {Roo.menu.Item} item The menu item to add
     * @return {Roo.menu.Item} The menu item that was added
     */
    addItem : function(item){
        this.items.add(item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.appendChild(li);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    /**
     * Creates a new {@link Roo.menu.Item} based an the supplied config object and adds it to the menu
     * @param {Object} config A MenuItem config object
     * @return {Roo.menu.Item} The menu item that was added
     */
    addMenuItem : function(config){
        if(!(config instanceof Roo.menu.Item)){
            if(typeof config.checked == "boolean"){ // must be check menu item config?
                config = new Roo.menu.CheckItem(config);
            }else{
                config = new Roo.menu.Item(config);
            }
        }
        return this.addItem(config);
    },

    /**
     * Creates a new {@link Roo.menu.TextItem} with the supplied text and adds it to the menu
     * @param {String} text The text to display in the menu item
     * @return {Roo.menu.Item} The menu item that was added
     */
    addText : function(text){
        return this.addItem(new Roo.menu.TextItem(text));
    },

    /**
     * Inserts an existing object based on {@link Roo.menu.Item} to the menu at a specified index
     * @param {Number} index The index in the menu's list of current items where the new item should be inserted
     * @param {Roo.menu.Item} item The menu item to add
     * @return {Roo.menu.Item} The menu item that was added
     */
    insert : function(index, item){
        this.items.insert(index, item);
        if(this.ul){
            var li = document.createElement("li");
            li.className = "x-menu-list-item";
            this.ul.dom.insertBefore(li, this.ul.dom.childNodes[index]);
            item.render(li, this);
            this.delayAutoWidth();
        }
        return item;
    },

    /**
     * Removes an {@link Roo.menu.Item} from the menu and destroys the object
     * @param {Roo.menu.Item} item The menu item to remove
     */
    remove : function(item){
        this.items.removeKey(item.id);
        item.destroy();
    },

    /**
     * Removes and destroys all items in the menu
     */
    removeAll : function(){
        var f;
        while(f = this.items.first()){
            this.remove(f);
        }
    }
});

// MenuNav is a private utility class used internally by the Menu
Roo.menu.MenuNav = function(menu){
    Roo.menu.MenuNav.superclass.constructor.call(this, menu.el);
    this.scope = this.menu = menu;
};

Roo.extend(Roo.menu.MenuNav, Roo.KeyNav, {
    doRelay : function(e, h){
        var k = e.getKey();
        if(!this.menu.activeItem && e.isNavKeyPress() && k != e.SPACE && k != e.RETURN){
            this.menu.tryActivate(0, 1);
            return false;
        }
        return h.call(this.scope || this, e, this.menu);
    },

    up : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)-1, -1)){
            m.tryActivate(m.items.length-1, -1);
        }
    },

    down : function(e, m){
        if(!m.tryActivate(m.items.indexOf(m.activeItem)+1, 1)){
            m.tryActivate(0, 1);
        }
    },

    right : function(e, m){
        if(m.activeItem){
            m.activeItem.expandMenu(true);
        }
    },

    left : function(e, m){
        m.hide();
        if(m.parentMenu && m.parentMenu.activeItem){
            m.parentMenu.activeItem.activate();
        }
    },

    enter : function(e, m){
        if(m.activeItem){
            e.stopPropagation();
            m.activeItem.onClick(e);
            m.fireEvent("click", this, m.activeItem);
            return true;
        }
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
 * @class Roo.menu.MenuMgr
 * Provides a common registry of all menu items on a page so that they can be easily accessed by id.
 * @singleton
 */
Roo.menu.MenuMgr = function(){
   var menus, active, groups = {}, attached = false, lastShow = new Date();

   // private - called when first menu is created
   function init(){
       menus = {};
       active = new Roo.util.MixedCollection();
       Roo.get(document).addKeyListener(27, function(){
           if(active.length > 0){
               hideAll();
           }
       });
   }

   // private
   function hideAll(){
       if(active && active.length > 0){
           var c = active.clone();
           c.each(function(m){
               m.hide();
           });
       }
   }

   // private
   function onHide(m){
       active.remove(m);
       if(active.length < 1){
           Roo.get(document).un("mousedown", onMouseDown);
           attached = false;
       }
   }

   // private
   function onShow(m){
       var last = active.last();
       lastShow = new Date();
       active.add(m);
       if(!attached){
           Roo.get(document).on("mousedown", onMouseDown);
           attached = true;
       }
       if(m.parentMenu){
          m.getEl().setZIndex(parseInt(m.parentMenu.getEl().getStyle("z-index"), 10) + 3);
          m.parentMenu.activeChild = m;
       }else if(last && last.isVisible()){
          m.getEl().setZIndex(parseInt(last.getEl().getStyle("z-index"), 10) + 3);
       }
   }

   // private
   function onBeforeHide(m){
       if(m.activeChild){
           m.activeChild.hide();
       }
       if(m.autoHideTimer){
           clearTimeout(m.autoHideTimer);
           delete m.autoHideTimer;
       }
   }

   // private
   function onBeforeShow(m){
       var pm = m.parentMenu;
       if(!pm && !m.allowOtherMenus){
           hideAll();
       }else if(pm && pm.activeChild && active != m){
           pm.activeChild.hide();
       }
   }

   // private
   function onMouseDown(e){
       if(lastShow.getElapsed() > 50 && active.length > 0 && !e.getTarget(".x-menu")){
           hideAll();
       }
   }

   // private
   function onBeforeCheck(mi, state){
       if(state){
           var g = groups[mi.group];
           for(var i = 0, l = g.length; i < l; i++){
               if(g[i] != mi){
                   g[i].setChecked(false);
               }
           }
       }
   }

   return {

       /**
        * Hides all menus that are currently visible
        */
       hideAll : function(){
            hideAll();  
       },

       // private
       register : function(menu){
           if(!menus){
               init();
           }
           menus[menu.id] = menu;
           menu.on("beforehide", onBeforeHide);
           menu.on("hide", onHide);
           menu.on("beforeshow", onBeforeShow);
           menu.on("show", onShow);
           var g = menu.group;
           if(g && menu.events["checkchange"]){
               if(!groups[g]){
                   groups[g] = [];
               }
               groups[g].push(menu);
               menu.on("checkchange", onCheck);
           }
       },

        /**
         * Returns a {@link Roo.menu.Menu} object
         * @param {String/Object} menu The string menu id, an existing menu object reference, or a Menu config that will
         * be used to generate and return a new Menu instance.
         */
       get : function(menu){
           if(typeof menu == "string"){ // menu id
               return menus[menu];
           }else if(menu.events){  // menu instance
               return menu;
           }else if(typeof menu.length == 'number'){ // array of menu items?
               return new Roo.menu.Menu({items:menu});
           }else{ // otherwise, must be a config
               return new Roo.menu.Menu(menu);
           }
       },

       // private
       unregister : function(menu){
           delete menus[menu.id];
           menu.un("beforehide", onBeforeHide);
           menu.un("hide", onHide);
           menu.un("beforeshow", onBeforeShow);
           menu.un("show", onShow);
           var g = menu.group;
           if(g && menu.events["checkchange"]){
               groups[g].remove(menu);
               menu.un("checkchange", onCheck);
           }
       },

       // private
       registerCheckable : function(menuItem){
           var g = menuItem.group;
           if(g){
               if(!groups[g]){
                   groups[g] = [];
               }
               groups[g].push(menuItem);
               menuItem.on("beforecheckchange", onBeforeCheck);
           }
       },

       // private
       unregisterCheckable : function(menuItem){
           var g = menuItem.group;
           if(g){
               groups[g].remove(menuItem);
               menuItem.un("beforecheckchange", onBeforeCheck);
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
 * @class Roo.menu.BaseItem
 * @extends Roo.Component
 * The base class for all items that render into menus.  BaseItem provides default rendering, activated state
 * management and base configuration options shared by all menu components.
 * @constructor
 * Creates a new BaseItem
 * @param {Object} config Configuration options
 */
Roo.menu.BaseItem = function(config){
    Roo.menu.BaseItem.superclass.constructor.call(this, config);

    this.addEvents({
        /**
         * @event click
         * Fires when this item is clicked
         * @param {Roo.menu.BaseItem} this
         * @param {Roo.EventObject} e
         */
        click: true,
        /**
         * @event activate
         * Fires when this item is activated
         * @param {Roo.menu.BaseItem} this
         */
        activate : true,
        /**
         * @event deactivate
         * Fires when this item is deactivated
         * @param {Roo.menu.BaseItem} this
         */
        deactivate : true
    });

    if(this.handler){
        this.on("click", this.handler, this.scope, true);
    }
};

Roo.extend(Roo.menu.BaseItem, Roo.Component, {
    /**
     * @cfg {Function} handler
     * A function that will handle the click event of this menu item (defaults to undefined)
     */
    /**
     * @cfg {Boolean} canActivate True if this item can be visually activated (defaults to false)
     */
    canActivate : false,
    /**
     * @cfg {String} activeClass The CSS class to use when the item becomes activated (defaults to "x-menu-item-active")
     */
    activeClass : "x-menu-item-active",
    /**
     * @cfg {Boolean} hideOnClick True to hide the containing menu after this item is clicked (defaults to true)
     */
    hideOnClick : true,
    /**
     * @cfg {Number} hideDelay Length of time in milliseconds to wait before hiding after a click (defaults to 100)
     */
    hideDelay : 100,

    // private
    ctype: "Roo.menu.BaseItem",

    // private
    actionMode : "container",

    // private
    render : function(container, parentMenu){
        this.parentMenu = parentMenu;
        Roo.menu.BaseItem.superclass.render.call(this, container);
        this.container.menuItemId = this.id;
    },

    // private
    onRender : function(container, position){
        this.el = Roo.get(this.el);
        container.dom.appendChild(this.el.dom);
    },

    // private
    onClick : function(e){
        if(!this.disabled && this.fireEvent("click", this, e) !== false
                && this.parentMenu.fireEvent("itemclick", this, e) !== false){
            this.handleClick(e);
        }else{
            e.stopEvent();
        }
    },

    // private
    activate : function(){
        if(this.disabled){
            return false;
        }
        var li = this.container;
        li.addClass(this.activeClass);
        this.region = li.getRegion().adjust(2, 2, -2, -2);
        this.fireEvent("activate", this);
        return true;
    },

    // private
    deactivate : function(){
        this.container.removeClass(this.activeClass);
        this.fireEvent("deactivate", this);
    },

    // private
    shouldDeactivate : function(e){
        return !this.region || !this.region.contains(e.getPoint());
    },

    // private
    handleClick : function(e){
        if(this.hideOnClick){
            this.parentMenu.hide.defer(this.hideDelay, this.parentMenu, [true]);
        }
    },

    // private
    expandMenu : function(autoActivate){
        // do nothing
    },

    // private
    hideMenu : function(){
        // do nothing
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
 * @class Roo.menu.Adapter
 * @extends Roo.menu.BaseItem
 * A base utility class that adapts a non-menu component so that it can be wrapped by a menu item and added to a menu.
 * It provides basic rendering, activation management and enable/disable logic required to work in menus.
 * @constructor
 * Creates a new Adapter
 * @param {Object} config Configuration options
 */
Roo.menu.Adapter = function(component, config){
    Roo.menu.Adapter.superclass.constructor.call(this, config);
    this.component = component;
};
Roo.extend(Roo.menu.Adapter, Roo.menu.BaseItem, {
    // private
    canActivate : true,

    // private
    onRender : function(container, position){
        this.component.render(container);
        this.el = this.component.getEl();
    },

    // private
    activate : function(){
        if(this.disabled){
            return false;
        }
        this.component.focus();
        this.fireEvent("activate", this);
        return true;
    },

    // private
    deactivate : function(){
        this.fireEvent("deactivate", this);
    },

    // private
    disable : function(){
        this.component.disable();
        Roo.menu.Adapter.superclass.disable.call(this);
    },

    // private
    enable : function(){
        this.component.enable();
        Roo.menu.Adapter.superclass.enable.call(this);
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
 * @class Roo.menu.TextItem
 * @extends Roo.menu.BaseItem
 * Adds a static text string to a menu, usually used as either a heading or group separator.
 * @constructor
 * Creates a new TextItem
 * @param {String} text The text to display
 */
Roo.menu.TextItem = function(text){
    this.text = text;
    Roo.menu.TextItem.superclass.constructor.call(this);
};

Roo.extend(Roo.menu.TextItem, Roo.menu.BaseItem, {
    /**
     * @cfg {Boolean} hideOnClick True to hide the containing menu after this item is clicked (defaults to false)
     */
    hideOnClick : false,
    /**
     * @cfg {String} itemCls The default CSS class to use for text items (defaults to "x-menu-text")
     */
    itemCls : "x-menu-text",

    // private
    onRender : function(){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = this.text;
        this.el = s;
        Roo.menu.TextItem.superclass.onRender.apply(this, arguments);
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
 * @class Roo.menu.Separator
 * @extends Roo.menu.BaseItem
 * Adds a separator bar to a menu, used to divide logical groups of menu items. Generally you will
 * add one of these by using "-" in you call to add() or in your items config rather than creating one directly.
 * @constructor
 * @param {Object} config Configuration options
 */
Roo.menu.Separator = function(config){
    Roo.menu.Separator.superclass.constructor.call(this, config);
};

Roo.extend(Roo.menu.Separator, Roo.menu.BaseItem, {
    /**
     * @cfg {String} itemCls The default CSS class to use for separators (defaults to "x-menu-sep")
     */
    itemCls : "x-menu-sep",
    /**
     * @cfg {Boolean} hideOnClick True to hide the containing menu after this item is clicked (defaults to false)
     */
    hideOnClick : false,

    // private
    onRender : function(li){
        var s = document.createElement("span");
        s.className = this.itemCls;
        s.innerHTML = "&#160;";
        this.el = s;
        li.addClass("x-menu-sep-li");
        Roo.menu.Separator.superclass.onRender.apply(this, arguments);
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
 * @class Roo.menu.Item
 * @extends Roo.menu.BaseItem
 * A base class for all menu items that require menu-related functionality (like sub-menus) and are not static
 * display items.  Item extends the base functionality of {@link Roo.menu.BaseItem} by adding menu-specific
 * activation and click handling.
 * @constructor
 * Creates a new Item
 * @param {Object} config Configuration options
 */
Roo.menu.Item = function(config){
    Roo.menu.Item.superclass.constructor.call(this, config);
    if(this.menu){
        this.menu = Roo.menu.MenuMgr.get(this.menu);
    }
};
Roo.extend(Roo.menu.Item, Roo.menu.BaseItem, {
    /**
     * @cfg {String} icon
     * The path to an icon to display in this menu item (defaults to Roo.BLANK_IMAGE_URL)
     */
    /**
     * @cfg {String} itemCls The default CSS class to use for menu items (defaults to "x-menu-item")
     */
    itemCls : "x-menu-item",
    /**
     * @cfg {Boolean} canActivate True if this item can be visually activated (defaults to true)
     */
    canActivate : true,
    /**
     * @cfg {Number} showDelay Length of time in milliseconds to wait before showing this item (defaults to 200)
     */
    showDelay: 200,
    // doc'd in BaseItem
    hideDelay: 200,

    // private
    ctype: "Roo.menu.Item",
    
    // private
    onRender : function(container, position){
        var el = document.createElement("a");
        el.hideFocus = true;
        el.unselectable = "on";
        el.href = this.href || "#";
        if(this.hrefTarget){
            el.target = this.hrefTarget;
        }
        el.className = this.itemCls + (this.menu ?  " x-menu-item-arrow" : "") + (this.cls ?  " " + this.cls : "");
        el.innerHTML = String.format(
                '<img src="{0}" class="x-menu-item-icon {2}" />{1}',
                this.icon || Roo.BLANK_IMAGE_URL, this.text, this.iconCls || '');
        this.el = el;
        Roo.menu.Item.superclass.onRender.call(this, container, position);
    },

    /**
     * Sets the text to display in this menu item
     * @param {String} text The text to display
     */
    setText : function(text){
        this.text = text;
        if(this.rendered){
            this.el.update(String.format(
                '<img src="{0}" class="x-menu-item-icon {2}">{1}',
                this.icon || Roo.BLANK_IMAGE_URL, this.text, this.iconCls || ''));
            this.parentMenu.autoWidth();
        }
    },

    // private
    handleClick : function(e){
        if(!this.href){ // if no link defined, stop the event automatically
            e.stopEvent();
        }
        Roo.menu.Item.superclass.handleClick.apply(this, arguments);
    },

    // private
    activate : function(autoExpand){
        if(Roo.menu.Item.superclass.activate.apply(this, arguments)){
            this.focus();
            if(autoExpand){
                this.expandMenu();
            }
        }
        return true;
    },

    // private
    shouldDeactivate : function(e){
        if(Roo.menu.Item.superclass.shouldDeactivate.call(this, e)){
            if(this.menu && this.menu.isVisible()){
                return !this.menu.getEl().getRegion().contains(e.getPoint());
            }
            return true;
        }
        return false;
    },

    // private
    deactivate : function(){
        Roo.menu.Item.superclass.deactivate.apply(this, arguments);
        this.hideMenu();
    },

    // private
    expandMenu : function(autoActivate){
        if(!this.disabled && this.menu){
            clearTimeout(this.hideTimer);
            delete this.hideTimer;
            if(!this.menu.isVisible() && !this.showTimer){
                this.showTimer = this.deferExpand.defer(this.showDelay, this, [autoActivate]);
            }else if (this.menu.isVisible() && autoActivate){
                this.menu.tryActivate(0, 1);
            }
        }
    },

    // private
    deferExpand : function(autoActivate){
        delete this.showTimer;
        this.menu.show(this.container, this.parentMenu.subMenuAlign || "tl-tr?", this.parentMenu);
        if(autoActivate){
            this.menu.tryActivate(0, 1);
        }
    },

    // private
    hideMenu : function(){
        clearTimeout(this.showTimer);
        delete this.showTimer;
        if(!this.hideTimer && this.menu && this.menu.isVisible()){
            this.hideTimer = this.deferHide.defer(this.hideDelay, this);
        }
    },

    // private
    deferHide : function(){
        delete this.hideTimer;
        this.menu.hide();
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
 * @class Roo.menu.CheckItem
 * @extends Roo.menu.Item
 * Adds a menu item that contains a checkbox by default, but can also be part of a radio group.
 * @constructor
 * Creates a new CheckItem
 * @param {Object} config Configuration options
 */
Roo.menu.CheckItem = function(config){
    Roo.menu.CheckItem.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event beforecheckchange
         * Fires before the checked value is set, providing an opportunity to cancel if needed
         * @param {Roo.menu.CheckItem} this
         * @param {Boolean} checked The new checked value that will be set
         */
        "beforecheckchange" : true,
        /**
         * @event checkchange
         * Fires after the checked value has been set
         * @param {Roo.menu.CheckItem} this
         * @param {Boolean} checked The checked value that was set
         */
        "checkchange" : true
    });
    if(this.checkHandler){
        this.on('checkchange', this.checkHandler, this.scope);
    }
};
Roo.extend(Roo.menu.CheckItem, Roo.menu.Item, {
    /**
     * @cfg {String} group
     * All check items with the same group name will automatically be grouped into a single-select
     * radio button group (defaults to '')
     */
    /**
     * @cfg {String} itemCls The default CSS class to use for check items (defaults to "x-menu-item x-menu-check-item")
     */
    itemCls : "x-menu-item x-menu-check-item",
    /**
     * @cfg {String} groupClass The default CSS class to use for radio group check items (defaults to "x-menu-group-item")
     */
    groupClass : "x-menu-group-item",

    /**
     * @cfg {Boolean} checked True to initialize this checkbox as checked (defaults to false).  Note that
     * if this checkbox is part of a radio group (group = true) only the last item in the group that is
     * initialized with checked = true will be rendered as checked.
     */
    checked: false,

    // private
    ctype: "Roo.menu.CheckItem",

    // private
    onRender : function(c){
        Roo.menu.CheckItem.superclass.onRender.apply(this, arguments);
        if(this.group){
            this.el.addClass(this.groupClass);
        }
        Roo.menu.MenuMgr.registerCheckable(this);
        if(this.checked){
            this.checked = false;
            this.setChecked(true, true);
        }
    },

    // private
    destroy : function(){
        if(this.rendered){
            Roo.menu.MenuMgr.unregisterCheckable(this);
        }
        Roo.menu.CheckItem.superclass.destroy.apply(this, arguments);
    },

    /**
     * Set the checked state of this item
     * @param {Boolean} checked The new checked value
     * @param {Boolean} suppressEvent (optional) True to prevent the checkchange event from firing (defaults to false)
     */
    setChecked : function(state, suppressEvent){
        if(this.checked != state && this.fireEvent("beforecheckchange", this, state) !== false){
            if(this.container){
                this.container[state ? "addClass" : "removeClass"]("x-menu-item-checked");
            }
            this.checked = state;
            if(suppressEvent !== true){
                this.fireEvent("checkchange", this, state);
            }
        }
    },

    // private
    handleClick : function(e){
       if(!this.disabled && !(this.checked && this.group)){// disable unselect on radio item
           this.setChecked(!this.checked);
       }
       Roo.menu.CheckItem.superclass.handleClick.apply(this, arguments);
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
 * @class Roo.menu.DateItem
 * @extends Roo.menu.Adapter
 * A menu item that wraps the {@link Roo.DatPicker} component.
 * @constructor
 * Creates a new DateItem
 * @param {Object} config Configuration options
 */
Roo.menu.DateItem = function(config){
    Roo.menu.DateItem.superclass.constructor.call(this, new Roo.DatePicker(config), config);
    /** The Roo.DatePicker object @type Roo.DatePicker */
    this.picker = this.component;
    this.addEvents({select: true});
    
    this.picker.on("render", function(picker){
        picker.getEl().swallowEvent("click");
        picker.container.addClass("x-menu-date-item");
    });

    this.picker.on("select", this.onSelect, this);
};

Roo.extend(Roo.menu.DateItem, Roo.menu.Adapter, {
    // private
    onSelect : function(picker, date){
        this.fireEvent("select", this, date, picker);
        Roo.menu.DateItem.superclass.handleClick.call(this);
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
 * @class Roo.menu.ColorItem
 * @extends Roo.menu.Adapter
 * A menu item that wraps the {@link Roo.ColorPalette} component.
 * @constructor
 * Creates a new ColorItem
 * @param {Object} config Configuration options
 */
Roo.menu.ColorItem = function(config){
    Roo.menu.ColorItem.superclass.constructor.call(this, new Roo.ColorPalette(config), config);
    /** The Roo.ColorPalette object @type Roo.ColorPalette */
    this.palette = this.component;
    this.relayEvents(this.palette, ["select"]);
    if(this.selectHandler){
        this.on('select', this.selectHandler, this.scope);
    }
};
Roo.extend(Roo.menu.ColorItem, Roo.menu.Adapter);/*
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
 * @class Roo.menu.DateMenu
 * @extends Roo.menu.Menu
 * A menu containing a {@link Roo.menu.DateItem} component (which provides a date picker).
 * @constructor
 * Creates a new DateMenu
 * @param {Object} config Configuration options
 */
Roo.menu.DateMenu = function(config){
    Roo.menu.DateMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var di = new Roo.menu.DateItem(config);
    this.add(di);
    /**
     * The {@link Roo.DatePicker} instance for this DateMenu
     * @type DatePicker
     */
    this.picker = di.picker;
    /**
     * @event select
     * @param {DatePicker} picker
     * @param {Date} date
     */
    this.relayEvents(di, ["select"]);

    this.on('beforeshow', function(){
        if(this.picker){
            this.picker.hideMonthPicker(true);
        }
    }, this);
};
Roo.extend(Roo.menu.DateMenu, Roo.menu.Menu, {
    cls:'x-date-menu'
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
 * @class Roo.menu.ColorMenu
 * @extends Roo.menu.Menu
 * A menu containing a {@link Roo.menu.ColorItem} component (which provides a basic color picker).
 * @constructor
 * Creates a new ColorMenu
 * @param {Object} config Configuration options
 */
Roo.menu.ColorMenu = function(config){
    Roo.menu.ColorMenu.superclass.constructor.call(this, config);
    this.plain = true;
    var ci = new Roo.menu.ColorItem(config);
    this.add(ci);
    /**
     * The {@link Roo.ColorPalette} instance for this ColorMenu
     * @type ColorPalette
     */
    this.palette = ci.palette;
    /**
     * @event select
     * @param {ColorPalette} palette
     * @param {String} color
     */
    this.relayEvents(ci, ["select"]);
};
Roo.extend(Roo.menu.ColorMenu, Roo.menu.Menu);/*
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
 * @class Roo.form.Field
 * @extends Roo.BoxComponent
 * Base class for form fields that provides default event handling, sizing, value handling and other functionality.
 * @constructor
 * Creates a new Field
 * @param {Object} config Configuration options
 */
Roo.form.Field = function(config){
    Roo.form.Field.superclass.constructor.call(this, config);
};

Roo.extend(Roo.form.Field, Roo.BoxComponent,  {
    /**
     * @cfg {String} fieldLabel Label to use when rendering a form.
     */
       /**
     * @cfg {String} qtip Mouse over tip
     */
     
    /**
     * @cfg {String} invalidClass The CSS class to use when marking a field invalid (defaults to "x-form-invalid")
     */
    invalidClass : "x-form-invalid",
    /**
     * @cfg {String} invalidText The error text to use when marking a field invalid and no message is provided (defaults to "The value in this field is invalid")
     */
    invalidText : "The value in this field is invalid",
    /**
     * @cfg {String} focusClass The CSS class to use when the field receives focus (defaults to "x-form-focus")
     */
    focusClass : "x-form-focus",
    /**
     * @cfg {String/Boolean} validationEvent The event that should initiate field validation. Set to false to disable
      automatic validation (defaults to "keyup").
     */
    validationEvent : "keyup",
    /**
     * @cfg {Boolean} validateOnBlur Whether the field should validate when it loses focus (defaults to true).
     */
    validateOnBlur : true,
    /**
     * @cfg {Number} validationDelay The length of time in milliseconds after user input begins until validation is initiated (defaults to 250)
     */
    validationDelay : 250,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "20", autocomplete: "off"})
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "20", autocomplete: "off"},
    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to "x-form-field")
     */
    fieldClass : "x-form-field",
    /**
     * @cfg {String} msgTarget The location where error text should display.  Should be one of the following values (defaults to 'qtip'):
     *<pre>
Value         Description
-----------   ----------------------------------------------------------------------
qtip          Display a quick tip when the user hovers over the field
title         Display a default browser title attribute popup
under         Add a block div beneath the field containing the error text
side          Add an error icon to the right of the field with a popup on hover
[element id]  Add the error text directly to the innerHTML of the specified element
</pre>
     */
    msgTarget : 'qtip',
    /**
     * @cfg {String} msgFx <b>Experimental</b> The effect used when displaying a validation message under the field (defaults to 'normal').
     */
    msgFx : 'normal',

    /**
     * @cfg {Boolean} readOnly True to mark the field as readOnly in HTML (defaults to false) -- Note: this only sets the element's readOnly DOM attribute.
     */
    readOnly : false,

    /**
     * @cfg {Boolean} disabled True to disable the field (defaults to false).
     */
    disabled : false,

    /**
     * @cfg {String} inputType The type attribute for input fields -- e.g. radio, text, password (defaults to "text").
     */
    inputType : undefined,
    
    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered, not those which are built via applyTo (defaults to undefined).
	 */
	tabIndex : undefined,
	
    // private
    isFormField : true,

    // private
    hasFocus : false,
    /**
     * @property {Roo.Element} fieldEl
     * Element Containing the rendered Field (with label etc.)
     */
    /**
     * @cfg {Mixed} value A value to initialize this field with.
     */
    value : undefined,

    /**
     * @cfg {String} name The field's HTML name attribute.
     */
    /**
     * @cfg {String} cls A CSS class to apply to the field's underlying element.
     */

	// private ??
	initComponent : function(){
        Roo.form.Field.superclass.initComponent.call(this);
        this.addEvents({
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {Roo.form.Field} this
             */
            focus : true,
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {Roo.form.Field} this
             */
            blur : true,
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.  You can check
             * {@link Roo.EventObject#getKey} to determine which key was pressed.
             * @param {Roo.form.Field} this
             * @param {Roo.EventObject} e The event object
             */
            specialkey : true,
            /**
             * @event change
             * Fires just before the field blurs if the field value has changed.
             * @param {Roo.form.Field} this
             * @param {Mixed} newValue The new value
             * @param {Mixed} oldValue The original value
             */
            change : true,
            /**
             * @event invalid
             * Fires after the field has been marked as invalid.
             * @param {Roo.form.Field} this
             * @param {String} msg The validation message
             */
            invalid : true,
            /**
             * @event valid
             * Fires after the field has been validated with no errors.
             * @param {Roo.form.Field} this
             */
            valid : true
        });
    },

    /**
     * Returns the name attribute of the field if available
     * @return {String} name The field name
     */
    getName: function(){
         return this.rendered && this.el.dom.name ? this.el.dom.name : (this.hiddenName || '');
    },

    // private
    onRender : function(ct, position){
        Roo.form.Field.superclass.onRender.call(this, ct, position);
        if(!this.el){
            var cfg = this.getAutoCreate();
            if(!cfg.name){
                cfg.name = this.name || this.id;
            }
            if(this.inputType){
                cfg.type = this.inputType;
            }
            this.el = ct.createChild(cfg, position);
        }
        var type = this.el.dom.type;
        if(type){
            if(type == 'password'){
                type = 'text';
            }
            this.el.addClass('x-form-'+type);
        }
        if(this.readOnly){
            this.el.dom.readOnly = true;
        }
        if(this.tabIndex !== undefined){
            this.el.dom.setAttribute('tabIndex', this.tabIndex);
        }

        this.el.addClass([this.fieldClass, this.cls]);
        this.initValue();
    },

    /**
     * Apply the behaviors of this component to an existing element. <b>This is used instead of render().</b>
     * @param {String/HTMLElement/Element} el The id of the node, a DOM node or an existing Element
     * @return {Roo.form.Field} this
     */
    applyTo : function(target){
        this.allowDomMove = false;
        this.el = Roo.get(target);
        this.render(this.el.dom.parentNode);
        return this;
    },

    // private
    initValue : function(){
        if(this.value !== undefined){
            this.setValue(this.value);
        }else if(this.el.dom.value.length > 0){
            this.setValue(this.el.dom.value);
        }
    },

    /**
     * Returns true if this field has been changed since it was originally loaded and is not disabled.
     */
    isDirty : function() {
        if(this.disabled) {
            return false;
        }
        return String(this.getValue()) !== String(this.originalValue);
    },

    // private
    afterRender : function(){
        Roo.form.Field.superclass.afterRender.call(this);
        this.initEvents();
    },

    // private
    fireKey : function(e){
        if(e.isNavKeyPress()){
            this.fireEvent("specialkey", this, e);
        }
    },

    /**
     * Resets the current field value to the originally loaded value and clears any validation messages
     */
    reset : function(){
        this.setValue(this.originalValue);
        this.clearInvalid();
    },

    // private
    initEvents : function(){
        this.el.on(Roo.isIE ? "keydown" : "keypress", this.fireKey,  this);
        this.el.on("focus", this.onFocus,  this);
        this.el.on("blur", this.onBlur,  this);

        // reference to original value for reset
        this.originalValue = this.getValue();
    },

    // private
    onFocus : function(){
        if(!Roo.isOpera && this.focusClass){ // don't touch in Opera
            this.el.addClass(this.focusClass);
        }
        if(!this.hasFocus){
            this.hasFocus = true;
            this.startValue = this.getValue();
            this.fireEvent("focus", this);
        }
    },

    beforeBlur : Roo.emptyFn,

    // private
    onBlur : function(){
        this.beforeBlur();
        if(!Roo.isOpera && this.focusClass){ // don't touch in Opera
            this.el.removeClass(this.focusClass);
        }
        this.hasFocus = false;
        if(this.validationEvent !== false && this.validateOnBlur && this.validationEvent != "blur"){
            this.validate();
        }
        var v = this.getValue();
        if(String(v) !== String(this.startValue)){
            this.fireEvent('change', this, v, this.startValue);
        }
        this.fireEvent("blur", this);
    },

    /**
     * Returns whether or not the field value is currently valid
     * @param {Boolean} preventMark True to disable marking the field invalid
     * @return {Boolean} True if the value is valid, else false
     */
    isValid : function(preventMark){
        if(this.disabled){
            return true;
        }
        var restore = this.preventMark;
        this.preventMark = preventMark === true;
        var v = this.validateValue(this.processValue(this.getRawValue()));
        this.preventMark = restore;
        return v;
    },

    /**
     * Validates the field value
     * @return {Boolean} True if the value is valid, else false
     */
    validate : function(){
        if(this.disabled || this.validateValue(this.processValue(this.getRawValue()))){
            this.clearInvalid();
            return true;
        }
        return false;
    },

    processValue : function(value){
        return value;
    },

    // private
    // Subclasses should provide the validation implementation by overriding this
    validateValue : function(value){
        return true;
    },

    /**
     * Mark this field as invalid
     * @param {String} msg The validation message
     */
    markInvalid : function(msg){
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.el.addClass(this.invalidClass);
        msg = msg || this.invalidText;
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = msg;
                this.el.dom.qclass = 'x-form-invalid-tip';
                if(Roo.QuickTips){ // fix for floating editors interacting with DND
                    Roo.QuickTips.enable();
                }
                break;
            case 'title':
                this.el.dom.title = msg;
                break;
            case 'under':
                if(!this.errorEl){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorEl = elp.createChild({cls:'x-form-invalid-msg'});
                    this.errorEl.setWidth(elp.getWidth(true)-20);
                }
                this.errorEl.update(msg);
                Roo.form.Field.msgFx[this.msgFx].show(this.errorEl, this);
                break;
            case 'side':
                if(!this.errorIcon){
                    var elp = this.el.findParent('.x-form-element', 5, true);
                    this.errorIcon = elp.createChild({cls:'x-form-invalid-icon'});
                }
                this.alignErrorIcon();
                this.errorIcon.dom.qtip = msg;
                this.errorIcon.dom.qclass = 'x-form-invalid-tip';
                this.errorIcon.show();
                this.on('resize', this.alignErrorIcon, this);
                break;
            default:
                var t = Roo.getDom(this.msgTarget);
                t.innerHTML = msg;
                t.style.display = this.msgDisplay;
                break;
        }
        this.fireEvent('invalid', this, msg);
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.el, 'tl-tr', [2, 0]);
    },

    /**
     * Clear any invalid styles/messages for this field
     */
    clearInvalid : function(){
        if(!this.rendered || this.preventMark){ // not rendered
            return;
        }
        this.el.removeClass(this.invalidClass);
        switch(this.msgTarget){
            case 'qtip':
                this.el.dom.qtip = '';
                break;
            case 'title':
                this.el.dom.title = '';
                break;
            case 'under':
                if(this.errorEl){
                    Roo.form.Field.msgFx[this.msgFx].hide(this.errorEl, this);
                }
                break;
            case 'side':
                if(this.errorIcon){
                    this.errorIcon.dom.qtip = '';
                    this.errorIcon.hide();
                    this.un('resize', this.alignErrorIcon, this);
                }
                break;
            default:
                var t = Roo.getDom(this.msgTarget);
                t.innerHTML = '';
                t.style.display = 'none';
                break;
        }
        this.fireEvent('valid', this);
    },

    /**
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * @return {Mixed} value The field value
     */
    getRawValue : function(){
        var v = this.el.getValue();
        if(v === this.emptyText){
            v = '';
        }
        return v;
    },

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue : function(){
        var v = this.el.getValue();
        if(v === this.emptyText || v === undefined){
            v = '';
        }
        return v;
    },

    /**
     * Sets the underlying DOM field's value directly, bypassing validation.  To set the value with validation see {@link #setValue}.
     * @param {Mixed} value The value to set
     */
    setRawValue : function(v){
        return this.el.dom.value = (v === null || v === undefined ? '' : v);
    },

    /**
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * @param {Mixed} value The value to set
     */
    setValue : function(v){
        this.value = v;
        if(this.rendered){
            this.el.dom.value = (v === null || v === undefined ? '' : v);
            this.validate();
        }
    },

    adjustSize : function(w, h){
        var s = Roo.form.Field.superclass.adjustSize.call(this, w, h);
        s.width = this.adjustWidth(this.el.dom.tagName, s.width);
        return s;
    },

    adjustWidth : function(tag, w){
        tag = tag.toLowerCase();
        if(typeof w == 'number' && Roo.isStrict && !Roo.isSafari){
            if(Roo.isIE && (tag == 'input' || tag == 'textarea')){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag = 'textarea'){
                    return w-2;
                }
            }else if(Roo.isOpera){
                if(tag == 'input'){
                    return w + 2;
                }
                if(tag = 'textarea'){
                    return w-2;
                }
            }
        }
        return w;
    }
});


// anything other than normal should be considered experimental
Roo.form.Field.msgFx = {
    normal : {
        show: function(msgEl, f){
            msgEl.setDisplayed('block');
        },

        hide : function(msgEl, f){
            msgEl.setDisplayed(false).update('');
        }
    },

    slide : {
        show: function(msgEl, f){
            msgEl.slideIn('t', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('t', {stopFx:true,useDisplay:true});
        }
    },

    slideRight : {
        show: function(msgEl, f){
            msgEl.fixDisplay();
            msgEl.alignTo(f.el, 'tl-tr');
            msgEl.slideIn('l', {stopFx:true});
        },

        hide : function(msgEl, f){
            msgEl.slideOut('l', {stopFx:true,useDisplay:true});
        }
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
 * @class Roo.form.TextField
 * @extends Roo.form.Field
 * Basic text field.  Can be used as a direct replacement for traditional text inputs, or as the base
 * class for more sophisticated input controls (like {@link Roo.form.TextArea} and {@link Roo.form.ComboBox}).
 * @constructor
 * Creates a new TextField
 * @param {Object} config Configuration options
 */
Roo.form.TextField = function(config){
    Roo.form.TextField.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event autosize
         * Fires when the autosize function is triggered.  The field may or may not have actually changed size
         * according to the default logic, but this event provides a hook for the developer to apply additional
         * logic at runtime to resize the field if needed.
	     * @param {Roo.form.Field} this This text field
	     * @param {Number} width The new field width
	     */
        autosize : true
    });
};

Roo.extend(Roo.form.TextField, Roo.form.Field,  {
    /**
     * @cfg {Boolean} grow True if this field should automatically grow and shrink to its content
     */
    grow : false,
    /**
     * @cfg {Number} growMin The minimum width to allow when grow = true (defaults to 30)
     */
    growMin : 30,
    /**
     * @cfg {Number} growMax The maximum width to allow when grow = true (defaults to 800)
     */
    growMax : 800,
    /**
     * @cfg {String} vtype A validation type name as defined in {@link Roo.form.VTypes} (defaults to null)
     */
    vtype : null,
    /**
     * @cfg {String} maskRe An input mask regular expression that will be used to filter keystrokes that don't match (defaults to null)
     */
    maskRe : null,
    /**
     * @cfg {Boolean} disableKeyFilter True to disable input keystroke filtering (defaults to false)
     */
    disableKeyFilter : false,
    /**
     * @cfg {Boolean} allowBlank False to validate that the value length > 0 (defaults to true)
     */
    allowBlank : true,
    /**
     * @cfg {Number} minLength Minimum input field length required (defaults to 0)
     */
    minLength : 0,
    /**
     * @cfg {Number} maxLength Maximum input field length allowed (defaults to Number.MAX_VALUE)
     */
    maxLength : Number.MAX_VALUE,
    /**
     * @cfg {String} minLengthText Error text to display if the minimum length validation fails (defaults to "The minimum length for this field is {minLength}")
     */
    minLengthText : "The minimum length for this field is {0}",
    /**
     * @cfg {String} maxLengthText Error text to display if the maximum length validation fails (defaults to "The maximum length for this field is {maxLength}")
     */
    maxLengthText : "The maximum length for this field is {0}",
    /**
     * @cfg {Boolean} selectOnFocus True to automatically select any existing field text when the field receives input focus (defaults to false)
     */
    selectOnFocus : false,
    /**
     * @cfg {String} blankText Error text to display if the allow blank validation fails (defaults to "This field is required")
     */
    blankText : "This field is required",
    /**
     * @cfg {Function} validator A custom validation function to be called during field validation (defaults to null).
     * If available, this function will be called only after the basic validators all return true, and will be passed the
     * current field value and expected to return boolean true if the value is valid or a string error message if invalid.
     */
    validator : null,
    /**
     * @cfg {RegExp} regex A JavaScript RegExp object to be tested against the field value during validation (defaults to null).
     * If available, this regex will be evaluated only after the basic validators all return true, and will be passed the
     * current field value.  If the test fails, the field will be marked invalid using {@link #regexText}.
     */
    regex : null,
    /**
     * @cfg {String} regexText The error text to display if {@link #regex} is used and the test fails during validation (defaults to "")
     */
    regexText : "",
    /**
     * @cfg {String} emptyText The default text to display in an empty field (defaults to null).
     */
    emptyText : null,
    /**
     * @cfg {String} emptyClass The CSS class to apply to an empty field to style the {@link #emptyText} (defaults to
     * 'x-form-empty-field').  This class is automatically added and removed as needed depending on the current field value.
     */
    emptyClass : 'x-form-empty-field',

    // private
    initEvents : function(){
        Roo.form.TextField.superclass.initEvents.call(this);
        if(this.validationEvent == 'keyup'){
            this.validationTask = new Roo.util.DelayedTask(this.validate, this);
            this.el.on('keyup', this.filterValidation, this);
        }
        else if(this.validationEvent !== false){
            this.el.on(this.validationEvent, this.validate, this, {buffer: this.validationDelay});
        }
        if(this.selectOnFocus || this.emptyText){
            this.on("focus", this.preFocus, this);
            if(this.emptyText){
                this.on('blur', this.postBlur, this);
                this.applyEmptyText();
            }
        }
        if(this.maskRe || (this.vtype && this.disableKeyFilter !== true && (this.maskRe = Roo.form.VTypes[this.vtype+'Mask']))){
            this.el.on("keypress", this.filterKeys, this);
        }
        if(this.grow){
            this.el.on("keyup", this.onKeyUp,  this, {buffer:50});
            this.el.on("click", this.autoSize,  this);
        }
    },

    processValue : function(value){
        if(this.stripCharsRe){
            var newValue = value.replace(this.stripCharsRe, '');
            if(newValue !== value){
                this.setRawValue(newValue);
                return newValue;
            }
        }
        return value;
    },

    filterValidation : function(e){
        if(!e.isNavKeyPress()){
            this.validationTask.delay(this.validationDelay);
        }
    },

    // private
    onKeyUp : function(e){
        if(!e.isNavKeyPress()){
            this.autoSize();
        }
    },

    /**
     * Resets the current field value to the originally-loaded value and clears any validation messages.
     * Also adds emptyText and emptyClass if the original value was blank.
     */
    reset : function(){
        Roo.form.TextField.superclass.reset.call(this);
        this.applyEmptyText();
    },

    applyEmptyText : function(){
        if(this.rendered && this.emptyText && this.getRawValue().length < 1){
            this.setRawValue(this.emptyText);
            this.el.addClass(this.emptyClass);
        }
    },

    // private
    preFocus : function(){
        if(this.emptyText){
            if(this.el.dom.value == this.emptyText){
                this.setRawValue('');
            }
            this.el.removeClass(this.emptyClass);
        }
        if(this.selectOnFocus){
            this.el.dom.select();
        }
    },

    // private
    postBlur : function(){
        this.applyEmptyText();
    },

    // private
    filterKeys : function(e){
        var k = e.getKey();
        if(!Roo.isIE && (e.isNavKeyPress() || k == e.BACKSPACE || (k == e.DELETE && e.button == -1))){
            return;
        }
        var c = e.getCharCode(), cc = String.fromCharCode(c);
        if(Roo.isIE && (e.isSpecialKey() || !cc)){
            return;
        }
        if(!this.maskRe.test(cc)){
            e.stopEvent();
        }
    },

    setValue : function(v){
        if(this.emptyText && this.el && v !== undefined && v !== null && v !== ''){
            this.el.removeClass(this.emptyClass);
        }
        Roo.form.TextField.superclass.setValue.apply(this, arguments);
        this.applyEmptyText();
        this.autoSize();
    },

    /**
     * Validates a value according to the field's validation rules and marks the field as invalid
     * if the validation fails
     * @param {Mixed} value The value to validate
     * @return {Boolean} True if the value is valid, else false
     */
    validateValue : function(value){
        if(value.length < 1 || value === this.emptyText){ // if it's blank
             if(this.allowBlank){
                this.clearInvalid();
                return true;
             }else{
                this.markInvalid(this.blankText);
                return false;
             }
        }
        if(value.length < this.minLength){
            this.markInvalid(String.format(this.minLengthText, this.minLength));
            return false;
        }
        if(value.length > this.maxLength){
            this.markInvalid(String.format(this.maxLengthText, this.maxLength));
            return false;
        }
        if(this.vtype){
            var vt = Roo.form.VTypes;
            if(!vt[this.vtype](value, this)){
                this.markInvalid(this.vtypeText || vt[this.vtype +'Text']);
                return false;
            }
        }
        if(typeof this.validator == "function"){
            var msg = this.validator(value);
            if(msg !== true){
                this.markInvalid(msg);
                return false;
            }
        }
        if(this.regex && !this.regex.test(value)){
            this.markInvalid(this.regexText);
            return false;
        }
        return true;
    },

    /**
     * Selects text in this field
     * @param {Number} start (optional) The index where the selection should start (defaults to 0)
     * @param {Number} end (optional) The index where the selection should end (defaults to the text length)
     */
    selectText : function(start, end){
        var v = this.getRawValue();
        if(v.length > 0){
            start = start === undefined ? 0 : start;
            end = end === undefined ? v.length : end;
            var d = this.el.dom;
            if(d.setSelectionRange){
                d.setSelectionRange(start, end);
            }else if(d.createTextRange){
                var range = d.createTextRange();
                range.moveStart("character", start);
                range.moveEnd("character", v.length-end);
                range.select();
            }
        }
    },

    /**
     * Automatically grows the field to accomodate the width of the text up to the maximum field width allowed.
     * This only takes effect if grow = true, and fires the autosize event.
     */
    autoSize : function(){
        if(!this.grow || !this.rendered){
            return;
        }
        if(!this.metrics){
            this.metrics = Roo.util.TextMetrics.createInstance(this.el);
        }
        var el = this.el;
        var v = el.dom.value;
        var d = document.createElement('div');
        d.appendChild(document.createTextNode(v));
        v = d.innerHTML;
        d = null;
        v += "&#160;";
        var w = Math.min(this.growMax, Math.max(this.metrics.getWidth(v) + /* add extra padding */ 10, this.growMin));
        this.el.setWidth(w);
        this.fireEvent("autosize", this, w);
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
 * @class Roo.form.Hidden
 * @extends Roo.form.TextField
 * Simple Hidden element used on forms 
 * 
 * usage: form.add(new Roo.form.HiddenField({ 'name' : 'test1' }));
 * 
 * @constructor
 * Creates a new Hidden form element.
 * @param {Object} config Configuration options
 */



// easy hidden field...
Roo.form.Hidden = function(config){
    Roo.form.Hidden.superclass.constructor.call(this, config);
};
  
Roo.extend(Roo.form.Hidden, Roo.form.TextField, {
    fieldLabel:      '',
    inputType:      'hidden',
    width:          50,
    allowBlank:     true,
    labelSeparator: '',
    hidden:         true,
    itemCls :       'x-form-item-display-none'


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
 * @class Roo.form.TriggerField
 * @extends Roo.form.TextField
 * Provides a convenient wrapper for TextFields that adds a clickable trigger button (looks like a combobox by default).
 * The trigger has no default action, so you must assign a function to implement the trigger click handler by
 * overriding {@link #onTriggerClick}. You can create a TriggerField directly, as it renders exactly like a combobox
 * for which you can provide a custom implementation.  For example:
 * <pre><code>
var trigger = new Roo.form.TriggerField();
trigger.onTriggerClick = myTriggerFn;
trigger.applyTo('my-field');
</code></pre>
 *
 * However, in general you will most likely want to use TriggerField as the base class for a reusable component.
 * {@link Roo.form.DateField} and {@link Roo.form.ComboBox} are perfect examples of this.
 * @cfg {String} triggerClass An additional CSS class used to style the trigger button.  The trigger will always get the
 * class 'x-form-trigger' by default and triggerClass will be <b>appended</b> if specified.
 * @constructor
 * Create a new TriggerField.
 * @param {Object} config Configuration options (valid {@Roo.form.TextField} config options will also be applied
 * to the base TextField)
 */
Roo.form.TriggerField = function(config){
    this.mimicing = false;
    Roo.form.TriggerField.superclass.constructor.call(this, config);
};

Roo.extend(Roo.form.TriggerField, Roo.form.TextField,  {
    /**
     * @cfg {String} triggerClass A CSS class to apply to the trigger
     */
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "16", autocomplete: "off"})
     */
    defaultAutoCreate : {tag: "input", type: "text", size: "16", autocomplete: "off"},
    /**
     * @cfg {Boolean} hideTrigger True to hide the trigger element and display only the base text field (defaults to false)
     */
    hideTrigger:false,

    /** @cfg {Boolean} grow @hide */
    /** @cfg {Number} growMin @hide */
    /** @cfg {Number} growMax @hide */

    /**
     * @hide 
     * @method
     */
    autoSize: Roo.emptyFn,
    // private
    monitorTab : true,
    // private
    deferHeight : true,

    
    actionMode : 'wrap',
    // private
    onResize : function(w, h){
        Roo.form.TriggerField.superclass.onResize.apply(this, arguments);
        if(typeof w == 'number'){
            this.el.setWidth(this.adjustWidth('input', w - this.trigger.getWidth()));
        }
    },

    // private
    adjustSize : Roo.BoxComponent.prototype.adjustSize,

    // private
    getResizeEl : function(){
        return this.wrap;
    },

    // private
    getPositionEl : function(){
        return this.wrap;
    },

    // private
    alignErrorIcon : function(){
        this.errorIcon.alignTo(this.wrap, 'tl-tr', [2, 0]);
    },

    // private
    onRender : function(ct, position){
        Roo.form.TriggerField.superclass.onRender.call(this, ct, position);
        this.wrap = this.el.wrap({cls: "x-form-field-wrap"});
        this.trigger = this.wrap.createChild(this.triggerConfig ||
                {tag: "img", src: Roo.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.triggerClass});
        if(this.hideTrigger){
            this.trigger.setDisplayed(false);
        }
        this.initTrigger();
        if(!this.width){
            this.wrap.setWidth(this.el.getWidth()+this.trigger.getWidth());
        }
    },

    // private
    initTrigger : function(){
        this.trigger.on("click", this.onTriggerClick, this, {preventDefault:true});
        this.trigger.addClassOnOver('x-form-trigger-over');
        this.trigger.addClassOnClick('x-form-trigger-click');
    },

    // private
    onDestroy : function(){
        if(this.trigger){
            this.trigger.removeAllListeners();
            this.trigger.remove();
        }
        if(this.wrap){
            this.wrap.remove();
        }
        Roo.form.TriggerField.superclass.onDestroy.call(this);
    },

    // private
    onFocus : function(){
        Roo.form.TriggerField.superclass.onFocus.call(this);
        if(!this.mimicing){
            this.wrap.addClass('x-trigger-wrap-focus');
            this.mimicing = true;
            Roo.get(Roo.isIE ? document.body : document).on("mousedown", this.mimicBlur, this);
            if(this.monitorTab){
                this.el.on("keydown", this.checkTab, this);
            }
        }
    },

    // private
    checkTab : function(e){
        if(e.getKey() == e.TAB){
            this.triggerBlur();
        }
    },

    // private
    onBlur : function(){
        // do nothing
    },

    // private
    mimicBlur : function(e, t){
        if(!this.wrap.contains(t) && this.validateBlur()){
            this.triggerBlur();
        }
    },

    // private
    triggerBlur : function(){
        this.mimicing = false;
        Roo.get(Roo.isIE ? document.body : document).un("mousedown", this.mimicBlur);
        if(this.monitorTab){
            this.el.un("keydown", this.checkTab, this);
        }
        this.wrap.removeClass('x-trigger-wrap-focus');
        Roo.form.TriggerField.superclass.onBlur.call(this);
    },

    // private
    // This should be overriden by any subclass that needs to check whether or not the field can be blurred.
    validateBlur : function(e, t){
        return true;
    },

    // private
    onDisable : function(){
        Roo.form.TriggerField.superclass.onDisable.call(this);
        if(this.wrap){
            this.wrap.addClass('x-item-disabled');
        }
    },

    // private
    onEnable : function(){
        Roo.form.TriggerField.superclass.onEnable.call(this);
        if(this.wrap){
            this.wrap.removeClass('x-item-disabled');
        }
    },

    // private
    onShow : function(){
        var ae = this.getActionEl();
        
        if(ae){
            ae.dom.style.display = '';
            ae.dom.style.visibility = 'visible';
        }
    },

    // private
    
    onHide : function(){
        var ae = this.getActionEl();
        ae.dom.style.display = 'none';
    },

    /**
     * The function that should handle the trigger's click event.  This method does nothing by default until overridden
     * by an implementing function.
     * @method
     * @param {EventObject} e
     */
    onTriggerClick : Roo.emptyFn
});

// TwinTriggerField is not a public class to be used directly.  It is meant as an abstract base class
// to be extended by an implementing class.  For an example of implementing this class, see the custom
// SearchField implementation here: http://extjs.com/deploy/ext/examples/form/custom.html
Roo.form.TwinTriggerField = Roo.extend(Roo.form.TriggerField, {
    initComponent : function(){
        Roo.form.TwinTriggerField.superclass.initComponent.call(this);

        this.triggerConfig = {
            tag:'span', cls:'x-form-twin-triggers', cn:[
            {tag: "img", src: Roo.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger1Class},
            {tag: "img", src: Roo.BLANK_IMAGE_URL, cls: "x-form-trigger " + this.trigger2Class}
        ]};
    },

    getTrigger : function(index){
        return this.triggers[index];
    },

    initTrigger : function(){
        var ts = this.trigger.select('.x-form-trigger', true);
        this.wrap.setStyle('overflow', 'hidden');
        var triggerField = this;
        ts.each(function(t, all, index){
            t.hide = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = 'none';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            t.show = function(){
                var w = triggerField.wrap.getWidth();
                this.dom.style.display = '';
                triggerField.el.setWidth(w-triggerField.trigger.getWidth());
            };
            var triggerIndex = 'Trigger'+(index+1);

            if(this['hide'+triggerIndex]){
                t.dom.style.display = 'none';
            }
            t.on("click", this['on'+triggerIndex+'Click'], this, {preventDefault:true});
            t.addClassOnOver('x-form-trigger-over');
            t.addClassOnClick('x-form-trigger-click');
        }, this);
        this.triggers = ts.elements;
    },

    onTrigger1Click : Roo.emptyFn,
    onTrigger2Click : Roo.emptyFn
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
 * @class Roo.form.TextArea
 * @extends Roo.form.TextField
 * Multiline text field.  Can be used as a direct replacement for traditional textarea fields, plus adds
 * support for auto-sizing.
 * @constructor
 * Creates a new TextArea
 * @param {Object} config Configuration options
 */
Roo.form.TextArea = function(config){
    Roo.form.TextArea.superclass.constructor.call(this, config);
    // these are provided exchanges for backwards compat
    // minHeight/maxHeight were replaced by growMin/growMax to be
    // compatible with TextField growing config values
    if(this.minHeight !== undefined){
        this.growMin = this.minHeight;
    }
    if(this.maxHeight !== undefined){
        this.growMax = this.maxHeight;
    }
};

Roo.extend(Roo.form.TextArea, Roo.form.TextField,  {
    /**
     * @cfg {Number} growMin The minimum height to allow when grow = true (defaults to 60)
     */
    growMin : 60,
    /**
     * @cfg {Number} growMax The maximum height to allow when grow = true (defaults to 1000)
     */
    growMax: 1000,
    /**
     * @cfg {Boolean} preventScrollbars True to prevent scrollbars from appearing regardless of how much text is
     * in the field (equivalent to setting overflow: hidden, defaults to false)
     */
    preventScrollbars: false,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "textarea", style: "width:300px;height:60px;", autocomplete: "off"})
     */

    // private
    onRender : function(ct, position){
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:300px;height:60px;",
                autocomplete: "off"
            };
        }
        Roo.form.TextArea.superclass.onRender.call(this, ct, position);
        if(this.grow){
            this.textSizeEl = Roo.DomHelper.append(document.body, {
                tag: "pre", cls: "x-form-grow-sizer"
            });
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
    },

    onDestroy : function(){
        if(this.textSizeEl){
            this.textSizeEl.parentNode.removeChild(this.textSizeEl);
        }
        Roo.form.TextArea.superclass.onDestroy.call(this);
    },

    // private
    onKeyUp : function(e){
        if(!e.isNavKeyPress() || e.getKey() == e.ENTER){
            this.autoSize();
        }
    },

    /**
     * Automatically grows the field to accomodate the height of the text up to the maximum field height allowed.
     * This only takes effect if grow = true, and fires the autosize event if the height changes.
     */
    autoSize : function(){
        if(!this.grow || !this.textSizeEl){
            return;
        }
        var el = this.el;
        var v = el.dom.value;
        var ts = this.textSizeEl;

        ts.innerHTML = '';
        ts.appendChild(document.createTextNode(v));
        v = ts.innerHTML;

        Roo.fly(ts).setWidth(this.el.getWidth());
        if(v.length < 1){
            v = "&#160;&#160;";
        }else{
            if(Roo.isIE){
                v = v.replace(/\n/g, '<p>&#160;</p>');
            }
            v += "&#160;\n&#160;";
        }
        ts.innerHTML = v;
        var h = Math.min(this.growMax, Math.max(ts.offsetHeight, this.growMin));
        if(h != this.lastHeight){
            this.lastHeight = h;
            this.el.setHeight(h);
            this.fireEvent("autosize", this, h);
        }
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
 * @class Roo.form.NumberField
 * @extends Roo.form.TextField
 * Numeric text field that provides automatic keystroke filtering and numeric validation.
 * @constructor
 * Creates a new NumberField
 * @param {Object} config Configuration options
 */
Roo.form.NumberField = function(config){
    Roo.form.NumberField.superclass.constructor.call(this, config);
};

Roo.extend(Roo.form.NumberField, Roo.form.TextField,  {
    /**
     * @cfg {String} fieldClass The default CSS class for the field (defaults to "x-form-field x-form-num-field")
     */
    fieldClass: "x-form-field x-form-num-field",
    /**
     * @cfg {Boolean} allowDecimals False to disallow decimal values (defaults to true)
     */
    allowDecimals : true,
    /**
     * @cfg {String} decimalSeparator Character(s) to allow as the decimal separator (defaults to '.')
     */
    decimalSeparator : ".",
    /**
     * @cfg {Number} decimalPrecision The maximum precision to display after the decimal separator (defaults to 2)
     */
    decimalPrecision : 2,
    /**
     * @cfg {Boolean} allowNegative False to prevent entering a negative sign (defaults to true)
     */
    allowNegative : true,
    /**
     * @cfg {Number} minValue The minimum allowed value (defaults to Number.NEGATIVE_INFINITY)
     */
    minValue : Number.NEGATIVE_INFINITY,
    /**
     * @cfg {Number} maxValue The maximum allowed value (defaults to Number.MAX_VALUE)
     */
    maxValue : Number.MAX_VALUE,
    /**
     * @cfg {String} minText Error text to display if the minimum value validation fails (defaults to "The minimum value for this field is {minValue}")
     */
    minText : "The minimum value for this field is {0}",
    /**
     * @cfg {String} maxText Error text to display if the maximum value validation fails (defaults to "The maximum value for this field is {maxValue}")
     */
    maxText : "The maximum value for this field is {0}",
    /**
     * @cfg {String} nanText Error text to display if the value is not a valid number.  For example, this can happen
     * if a valid character like '.' or '-' is left in the field with no number (defaults to "{value} is not a valid number")
     */
    nanText : "{0} is not a valid number",

    // private
    initEvents : function(){
        Roo.form.NumberField.superclass.initEvents.call(this);
        var allowed = "0123456789";
        if(this.allowDecimals){
            allowed += this.decimalSeparator;
        }
        if(this.allowNegative){
            allowed += "-";
        }
        this.stripCharsRe = new RegExp('[^'+allowed+']', 'gi');
        var keyPress = function(e){
            var k = e.getKey();
            if(!Roo.isIE && (e.isSpecialKey() || k == e.BACKSPACE || k == e.DELETE)){
                return;
            }
            var c = e.getCharCode();
            if(allowed.indexOf(String.fromCharCode(c)) === -1){
                e.stopEvent();
            }
        };
        this.el.on("keypress", keyPress, this);
    },

    // private
    validateValue : function(value){
        if(!Roo.form.NumberField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var num = this.parseValue(value);
        if(isNaN(num)){
            this.markInvalid(String.format(this.nanText, value));
            return false;
        }
        if(num < this.minValue){
            this.markInvalid(String.format(this.minText, this.minValue));
            return false;
        }
        if(num > this.maxValue){
            this.markInvalid(String.format(this.maxText, this.maxValue));
            return false;
        }
        return true;
    },

    getValue : function(){
        return this.fixPrecision(this.parseValue(Roo.form.NumberField.superclass.getValue.call(this)));
    },

    // private
    parseValue : function(value){
        value = parseFloat(String(value).replace(this.decimalSeparator, "."));
        return isNaN(value) ? '' : value;
    },

    // private
    fixPrecision : function(value){
        var nan = isNaN(value);
        if(!this.allowDecimals || this.decimalPrecision == -1 || nan || !value){
            return nan ? '' : value;
        }
        return parseFloat(value).toFixed(this.decimalPrecision);
    },

    setValue : function(v){
        Roo.form.NumberField.superclass.setValue.call(this, String(v).replace(".", this.decimalSeparator));
    },

    // private
    decimalPrecisionFcn : function(v){
        return Math.floor(v);
    },

    beforeBlur : function(){
        var v = this.parseValue(this.getRawValue());
        if(v){
            this.setValue(this.fixPrecision(v));
        }
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
 * @class Roo.form.DateField
 * @extends Roo.form.TriggerField
 * Provides a date input field with a {@link Roo.DatePicker} dropdown and automatic date validation.
* @constructor
* Create a new DateField
* @param {Object} config
 */
Roo.form.DateField = function(config){
    Roo.form.DateField.superclass.constructor.call(this, config);
    
      this.addEvents({
         
        /**
         * @event select
         * Fires when a date is selected
	     * @param {Roo.form.DateField} combo This combo box
	     * @param {Date} date The date selected
	     */
        'select' : true
         
    });
    
    
    if(typeof this.minValue == "string") this.minValue = this.parseDate(this.minValue);
    if(typeof this.maxValue == "string") this.maxValue = this.parseDate(this.maxValue);
    this.ddMatch = null;
    if(this.disabledDates){
        var dd = this.disabledDates;
        var re = "(?:";
        for(var i = 0; i < dd.length; i++){
            re += dd[i];
            if(i != dd.length-1) re += "|";
        }
        this.ddMatch = new RegExp(re + ")");
    }
};

Roo.extend(Roo.form.DateField, Roo.form.TriggerField,  {
    /**
     * @cfg {String} format
     * The default date format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'm/d/y').
     */
    format : "m/d/y",
    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format (defaults to 'm/d/Y|m-d-y|m-d-Y|m/d|m-d|d').
     */
    altFormats : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d",
    /**
     * @cfg {Array} disabledDays
     * An array of days to disable, 0 based. For example, [0, 6] disables Sunday and Saturday (defaults to null).
     */
    disabledDays : null,
    /**
     * @cfg {String} disabledDaysText
     * The tooltip to display when the date falls on a disabled day (defaults to 'Disabled')
     */
    disabledDaysText : "Disabled",
    /**
     * @cfg {Array} disabledDates
     * An array of "dates" to disable, as strings. These strings will be used to build a dynamic regular
     * expression so they are very powerful. Some examples:
     * <ul>
     * <li>["03/08/2003", "09/16/2003"] would disable those exact dates</li>
     * <li>["03/08", "09/16"] would disable those days for every year</li>
     * <li>["^03/08"] would only match the beginning (useful if you are using short years)</li>
     * <li>["03/../2006"] would disable every day in March 2006</li>
     * <li>["^03"] would disable every day in every March</li>
     * </ul>
     * In order to support regular expressions, if you are using a date format that has "." in it, you will have to
     * escape the dot when restricting dates. For example: ["03\\.08\\.03"].
     */
    disabledDates : null,
    /**
     * @cfg {String} disabledDatesText
     * The tooltip text to display when the date falls on a disabled date (defaults to 'Disabled')
     */
    disabledDatesText : "Disabled",
    /**
     * @cfg {Date/String} minValue
     * The minimum allowed date. Can be either a Javascript date object or a string date in a
     * valid format (defaults to null).
     */
    minValue : null,
    /**
     * @cfg {Date/String} maxValue
     * The maximum allowed date. Can be either a Javascript date object or a string date in a
     * valid format (defaults to null).
     */
    maxValue : null,
    /**
     * @cfg {String} minText
     * The error text to display when the date in the cell is before minValue (defaults to
     * 'The date in this field must be after {minValue}').
     */
    minText : "The date in this field must be equal to or after {0}",
    /**
     * @cfg {String} maxText
     * The error text to display when the date in the cell is after maxValue (defaults to
     * 'The date in this field must be before {maxValue}').
     */
    maxText : "The date in this field must be equal to or before {0}",
    /**
     * @cfg {String} invalidText
     * The error text to display when the date in the field is invalid (defaults to
     * '{value} is not a valid date - it must be in the format {format}').
     */
    invalidText : "{0} is not a valid date - it must be in the format {1}",
    /**
     * @cfg {String} triggerClass
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-date-trigger'
     * which displays a calendar icon).
     */
    triggerClass : 'x-form-date-trigger',
    

    /**
     * @cfg {bool} useIso
     * if enabled, then the date field will use a hidden field to store the 
     * real value as iso formated date. default (false)
     */ 
    useIso : false,
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "text", size: "10", autocomplete: "off"})
     */ 
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "10", autocomplete: "off"},
    
    // private
    hiddenField: false,
    
    onRender : function(ct, position)
    {
        Roo.form.DateField.superclass.onRender.call(this, ct, position);
        if (this.useIso) {
            this.el.dom.removeAttribute('name'); 
            this.hiddenField = this.el.insertSibling({ tag:'input', type:'hidden', name: this.name },
                    'before', true);
            this.hiddenField.value = this.formatDate(this.value, 'Y-m-d');
            // prevent input submission
            this.hiddenName = this.name;
        }
            
            
    },
    
    // private
    validateValue : function(value)
    {
        value = this.formatDate(value);
        if(!Roo.form.DateField.superclass.validateValue.call(this, value)){
            return false;
        }
        if(value.length < 1){ // if it's blank and textfield didn't flag it then it's valid
             return true;
        }
        var svalue = value;
        value = this.parseDate(value);
        if(!value){
            this.markInvalid(String.format(this.invalidText, svalue, this.format));
            return false;
        }
        var time = value.getTime();
        if(this.minValue && time < this.minValue.getTime()){
            this.markInvalid(String.format(this.minText, this.formatDate(this.minValue)));
            return false;
        }
        if(this.maxValue && time > this.maxValue.getTime()){
            this.markInvalid(String.format(this.maxText, this.formatDate(this.maxValue)));
            return false;
        }
        if(this.disabledDays){
            var day = value.getDay();
            for(var i = 0; i < this.disabledDays.length; i++) {
            	if(day === this.disabledDays[i]){
            	    this.markInvalid(this.disabledDaysText);
                    return false;
            	}
            }
        }
        var fvalue = this.formatDate(value);
        if(this.ddMatch && this.ddMatch.test(fvalue)){
            this.markInvalid(String.format(this.disabledDatesText, fvalue));
            return false;
        }
        return true;
    },

    // private
    // Provides logic to override the default TriggerField.validateBlur which just returns true
    validateBlur : function(){
        return !this.menu || !this.menu.isVisible();
    },

    /**
     * Returns the current date value of the date field.
     * @return {Date} The date value
     */
    getValue : function(){
        
        return  this.hiddenField ? this.hiddenField.value : this.parseDate(Roo.form.DateField.superclass.getValue.call(this)) || "";
    },

    /**
     * Sets the value of the date field.  You can pass a date object or any string that can be parsed into a valid
     * date, using DateField.format as the date format, according to the same rules as {@link Date#parseDate}
     * (the default format used is "m/d/y").
     * <br />Usage:
     * <pre><code>
//All of these calls set the same date value (May 4, 2006)

//Pass a date object:
var dt = new Date('5/4/06');
dateField.setValue(dt);

//Pass a date string (default format):
dateField.setValue('5/4/06');

//Pass a date string (custom format):
dateField.format = 'Y-m-d';
dateField.setValue('2006-5-4');
</code></pre>
     * @param {String/Date} date The date or valid date string
     */
    setValue : function(date){
        if (this.hiddenField) {
            this.hiddenField.value = this.formatDate(this.parseDate(date), 'Y-m-d');
        }
        Roo.form.DateField.superclass.setValue.call(this, this.formatDate(this.parseDate(date)));
    },

    // private
    parseDate : function(value){
        if(!value || value instanceof Date){
            return value;
        }
        var v = Date.parseDate(value, this.format);
        if(!v && this.altFormats){
            if(!this.altFormatsArray){
                this.altFormatsArray = this.altFormats.split("|");
            }
            for(var i = 0, len = this.altFormatsArray.length; i < len && !v; i++){
                v = Date.parseDate(value, this.altFormatsArray[i]);
            }
        }
        return v;
    },

    // private
    formatDate : function(date, fmt){
        return (!date || !(date instanceof Date)) ?
               date : date.dateFormat(fmt || this.format);
    },

    // private
    menuListeners : {
        select: function(m, d){
            this.setValue(d);
            this.fireEvent('select', this, d);
        },
        show : function(){ // retain focus styling
            this.onFocus();
        },
        hide : function(){
            this.focus.defer(10, this);
            var ml = this.menuListeners;
            this.menu.un("select", ml.select,  this);
            this.menu.un("show", ml.show,  this);
            this.menu.un("hide", ml.hide,  this);
        }
    },

    // private
    // Implements the default empty TriggerField.onTriggerClick function to display the DatePicker
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.menu == null){
            this.menu = new Roo.menu.DateMenu();
        }
        Roo.apply(this.menu.picker,  {
            showClear: this.allowBlank,
            minDate : this.minValue,
            maxDate : this.maxValue,
            disabledDatesRE : this.ddMatch,
            disabledDatesText : this.disabledDatesText,
            disabledDays : this.disabledDays,
            disabledDaysText : this.disabledDaysText,
            format : this.format,
            minText : String.format(this.minText, this.formatDate(this.minValue)),
            maxText : String.format(this.maxText, this.formatDate(this.maxValue))
        });
        this.menu.on(Roo.apply({}, this.menuListeners, {
            scope:this
        }));
        this.menu.picker.setValue(this.getValue() || new Date());
        this.menu.show(this.el, "tl-bl?");
    },

    beforeBlur : function(){
        var v = this.parseDate(this.getRawValue());
        if(v){
            this.setValue(v);
        }
    }

    /** @cfg {Boolean} grow @hide */
    /** @cfg {Number} growMin @hide */
    /** @cfg {Number} growMax @hide */
    /**
     * @hide
     * @method autoSize
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
 * @class Roo.form.ComboBox
 * @extends Roo.form.TriggerField
 * A combobox control with support for autocomplete, remote-loading, paging and many other features.
 * @constructor
 * Create a new ComboBox.
 * @param {Object} config Configuration options
 */
Roo.form.ComboBox = function(config){
    Roo.form.ComboBox.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event expand
         * Fires when the dropdown list is expanded
	     * @param {Roo.form.ComboBox} combo This combo box
	     */
        'expand' : true,
        /**
         * @event collapse
         * Fires when the dropdown list is collapsed
	     * @param {Roo.form.ComboBox} combo This combo box
	     */
        'collapse' : true,
        /**
         * @event beforeselect
         * Fires before a list item is selected. Return false to cancel the selection.
	     * @param {Roo.form.ComboBox} combo This combo box
	     * @param {Roo.data.Record} record The data record returned from the underlying store
	     * @param {Number} index The index of the selected item in the dropdown list
	     */
        'beforeselect' : true,
        /**
         * @event select
         * Fires when a list item is selected
	     * @param {Roo.form.ComboBox} combo This combo box
	     * @param {Roo.data.Record} record The data record returned from the underlying store (or false on clear)
	     * @param {Number} index The index of the selected item in the dropdown list
	     */
        'select' : true,
        /**
         * @event beforequery
         * Fires before all queries are processed. Return false to cancel the query or set cancel to true.
         * The event object passed has these properties:
	     * @param {Roo.form.ComboBox} combo This combo box
	     * @param {String} query The query
	     * @param {Boolean} forceAll true to force "all" query
	     * @param {Boolean} cancel true to cancel the query
	     * @param {Object} e The query event object
	     */
        'beforequery': true
    });
    if(this.transform){
        this.allowDomMove = false;
        var s = Roo.getDom(this.transform);
        if(!this.hiddenName){
            this.hiddenName = s.name;
        }
        if(!this.store){
            this.mode = 'local';
            var d = [], opts = s.options;
            for(var i = 0, len = opts.length;i < len; i++){
                var o = opts[i];
                var value = (Roo.isIE ? o.getAttributeNode('value').specified : o.hasAttribute('value')) ? o.value : o.text;
                if(o.selected) {
                    this.value = value;
                }
                d.push([value, o.text]);
            }
            this.store = new Roo.data.SimpleStore({
                'id': 0,
                fields: ['value', 'text'],
                data : d
            });
            this.valueField = 'value';
            this.displayField = 'text';
        }
        s.name = Roo.id(); // wipe out the name in case somewhere else they have a reference
        if(!this.lazyRender){
            this.target = true;
            this.el = Roo.DomHelper.insertBefore(s, this.autoCreate || this.defaultAutoCreate);
            s.parentNode.removeChild(s); // remove it
            this.render(this.el.parentNode);
        }else{
            s.parentNode.removeChild(s); // remove it
        }

    }
    if (this.store) {
        this.store = Roo.factory(this.store, Roo.data);
    }
    
    this.selectedIndex = -1;
    if(this.mode == 'local'){
        if(config.queryDelay === undefined){
            this.queryDelay = 10;
        }
        if(config.minChars === undefined){
            this.minChars = 0;
        }
    }
};

Roo.extend(Roo.form.ComboBox, Roo.form.TriggerField, {
    /**
     * @cfg {String/HTMLElement/Element} transform The id, DOM node or element of an existing select to convert to a ComboBox
     */
    /**
     * @cfg {Boolean} lazyRender True to prevent the ComboBox from rendering until requested (should always be used when
     * rendering into an Roo.Editor, defaults to false)
     */
    /**
     * @cfg {Boolean/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to:
     * {tag: "input", type: "text", size: "24", autocomplete: "off"})
     */
    /**
     * @cfg {Roo.data.Store} store The data store to which this combo is bound (defaults to undefined)
     */
    /**
     * @cfg {String} title If supplied, a header element is created containing this text and added into the top of
     * the dropdown list (defaults to undefined, with no header element)
     */

     /**
     * @cfg {String/Roo.Template} tpl The template to use to render the output
     */
     
    // private
    defaultAutoCreate : {tag: "input", type: "text", size: "24", autocomplete: "off"},
    /**
     * @cfg {Number} listWidth The width in pixels of the dropdown list (defaults to the width of the ComboBox field)
     */
    listWidth: undefined,
    /**
     * @cfg {String} displayField The underlying data field name to bind to this CombBox (defaults to undefined if
     * mode = 'remote' or 'text' if mode = 'local')
     */
    displayField: undefined,
    /**
     * @cfg {String} valueField The underlying data value name to bind to this CombBox (defaults to undefined if
     * mode = 'remote' or 'value' if mode = 'local'). 
     * Note: use of a valueField requires the user make a selection
     * in order for a value to be mapped.
     */
    valueField: undefined,
    /**
     * @cfg {String} hiddenName If specified, a hidden form field with this name is dynamically generated to store the
     * field's data value (defaults to the underlying DOM element's name)
     */
    hiddenName: undefined,
    /**
     * @cfg {String} listClass CSS class to apply to the dropdown list element (defaults to '')
     */
    listClass: '',
    /**
     * @cfg {String} selectedClass CSS class to apply to the selected item in the dropdown list (defaults to 'x-combo-selected')
     */
    selectedClass: 'x-combo-selected',
    /**
     * @cfg {String} triggerClass An additional CSS class used to style the trigger button.  The trigger will always get the
     * class 'x-form-trigger' and triggerClass will be <b>appended</b> if specified (defaults to 'x-form-arrow-trigger'
     * which displays a downward arrow icon).
     */
    triggerClass : 'x-form-arrow-trigger',
    /**
     * @cfg {Boolean/String} shadow True or "sides" for the default effect, "frame" for 4-way shadow, and "drop" for bottom-right
     */
    shadow:'sides',
    /**
     * @cfg {String} listAlign A valid anchor position value. See {@link Roo.Element#alignTo} for details on supported
     * anchor positions (defaults to 'tl-bl')
     */
    listAlign: 'tl-bl?',
    /**
     * @cfg {Number} maxHeight The maximum height in pixels of the dropdown list before scrollbars are shown (defaults to 300)
     */
    maxHeight: 300,
    /**
     * @cfg {String} triggerAction The action to execute when the trigger field is activated.  Use 'all' to run the
     * query specified by the allQuery config option (defaults to 'query')
     */
    triggerAction: 'query',
    /**
     * @cfg {Number} minChars The minimum number of characters the user must type before autocomplete and typeahead activate
     * (defaults to 4, does not apply if editable = false)
     */
    minChars : 4,
    /**
     * @cfg {Boolean} typeAhead True to populate and autoselect the remainder of the text being typed after a configurable
     * delay (typeAheadDelay) if it matches a known value (defaults to false)
     */
    typeAhead: false,
    /**
     * @cfg {Number} queryDelay The length of time in milliseconds to delay between the start of typing and sending the
     * query to filter the dropdown list (defaults to 500 if mode = 'remote' or 10 if mode = 'local')
     */
    queryDelay: 500,
    /**
     * @cfg {Number} pageSize If greater than 0, a paging toolbar is displayed in the footer of the dropdown list and the
     * filter queries will execute with page start and limit parameters.  Only applies when mode = 'remote' (defaults to 0)
     */
    pageSize: 0,
    /**
     * @cfg {Boolean} selectOnFocus True to select any existing text in the field immediately on focus.  Only applies
     * when editable = true (defaults to false)
     */
    selectOnFocus:false,
    /**
     * @cfg {String} queryParam Name of the query as it will be passed on the querystring (defaults to 'query')
     */
    queryParam: 'query',
    /**
     * @cfg {String} loadingText The text to display in the dropdown list while data is loading.  Only applies
     * when mode = 'remote' (defaults to 'Loading...')
     */
    loadingText: 'Loading...',
    /**
     * @cfg {Boolean} resizable True to add a resize handle to the bottom of the dropdown list (defaults to false)
     */
    resizable: false,
    /**
     * @cfg {Number} handleHeight The height in pixels of the dropdown list resize handle if resizable = true (defaults to 8)
     */
    handleHeight : 8,
    /**
     * @cfg {Boolean} editable False to prevent the user from typing text directly into the field, just like a
     * traditional select (defaults to true)
     */
    editable: true,
    /**
     * @cfg {String} allQuery The text query to send to the server to return all records for the list with no filtering (defaults to '')
     */
    allQuery: '',
    /**
     * @cfg {String} mode Set to 'local' if the ComboBox loads local data (defaults to 'remote' which loads from the server)
     */
    mode: 'remote',
    /**
     * @cfg {Number} minListWidth The minimum width of the dropdown list in pixels (defaults to 70, will be ignored if
     * listWidth has a higher value)
     */
    minListWidth : 70,
    /**
     * @cfg {Boolean} forceSelection True to restrict the selected value to one of the values in the list, false to
     * allow the user to set arbitrary text into the field (defaults to false)
     */
    forceSelection:false,
    /**
     * @cfg {Number} typeAheadDelay The length of time in milliseconds to wait until the typeahead text is displayed
     * if typeAhead = true (defaults to 250)
     */
    typeAheadDelay : 250,
    /**
     * @cfg {String} valueNotFoundText When using a name/value combo, if the value passed to setValue is not found in
     * the store, valueNotFoundText will be displayed as the field text if defined (defaults to undefined)
     */
    valueNotFoundText : undefined,
    /**
     * @cfg {bool} blockFocus Prevents all focus calls, so it can work with things like HTML edtor bar
     */
    blockFocus : false,
    
    /**
     * @cfg {bool} disableClear Disable showing of clear button.
     */
    disableClear : false,
    
    // private
    onRender : function(ct, position){
        Roo.form.ComboBox.superclass.onRender.call(this, ct, position);
        if(this.hiddenName){
            this.hiddenField = this.el.insertSibling({tag:'input', type:'hidden', name: this.hiddenName, id:  (this.hiddenId||this.hiddenName)},
                    'before', true);
            this.hiddenField.value =
                this.hiddenValue !== undefined ? this.hiddenValue :
                this.value !== undefined ? this.value : '';

            // prevent input submission
            this.el.dom.removeAttribute('name');
        }
        if(Roo.isGecko){
            this.el.dom.setAttribute('autocomplete', 'off');
        }

        var cls = 'x-combo-list';

        this.list = new Roo.Layer({
            shadow: this.shadow, cls: [cls, this.listClass].join(' '), constrain:false
        });

        var lw = this.listWidth || Math.max(this.wrap.getWidth(), this.minListWidth);
        this.list.setWidth(lw);
        this.list.swallowEvent('mousewheel');
        this.assetHeight = 0;

        if(this.title){
            this.header = this.list.createChild({cls:cls+'-hd', html: this.title});
            this.assetHeight += this.header.getHeight();
        }

        this.innerList = this.list.createChild({cls:cls+'-inner'});
        this.innerList.on('mouseover', this.onViewOver, this);
        this.innerList.on('mousemove', this.onViewMove, this);
        this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        
        if(this.allowBlank && !this.pageSize && !this.disableClear){
            this.footer = this.list.createChild({cls:cls+'-ft'});
            this.pageTb = new Roo.Toolbar(this.footer);
           
        }
        if(this.pageSize){
            this.footer = this.list.createChild({cls:cls+'-ft'});
            this.pageTb = new Roo.PagingToolbar(this.footer, this.store,
                    {pageSize: this.pageSize});
            
        }
        
        if (this.pageTb && this.allowBlank && !this.disableClear) {
            var _this = this;
            this.pageTb.add(new Roo.Toolbar.Fill(), {
                cls: 'x-btn-icon x-btn-clear',
                text: '&#160;',
                handler: function()
                {
                    _this.collapse();
                    _this.clearValue();
                    _this.onSelect(false, -1);
                }
            });
        }
        if (this.footer) {
            this.assetHeight += this.footer.getHeight();
        }
        

        if(!this.tpl){
            this.tpl = '<div class="'+cls+'-item">{' + this.displayField + '}</div>';
        }

        this.view = new Roo.View(this.innerList, this.tpl, {
            singleSelect:true, store: this.store, selectedClass: this.selectedClass
        });

        this.view.on('click', this.onViewClick, this);

        this.store.on('beforeload', this.onBeforeLoad, this);
        this.store.on('load', this.onLoad, this);
        this.store.on('loadexception', this.collapse, this);

        if(this.resizable){
            this.resizer = new Roo.Resizable(this.list,  {
               pinned:true, handles:'se'
            });
            this.resizer.on('resize', function(r, w, h){
                this.maxHeight = h-this.handleHeight-this.list.getFrameWidth('tb')-this.assetHeight;
                this.listWidth = w;
                this.innerList.setWidth(w - this.list.getFrameWidth('lr'));
                this.restrictHeight();
            }, this);
            this[this.pageSize?'footer':'innerList'].setStyle('margin-bottom', this.handleHeight+'px');
        }
        if(!this.editable){
            this.editable = true;
            this.setEditable(false);
        }
    },

    // private
    initEvents : function(){
        Roo.form.ComboBox.superclass.initEvents.call(this);

        this.keyNav = new Roo.KeyNav(this.el, {
            "up" : function(e){
                this.inKeyMode = true;
                this.selectPrev();
            },

            "down" : function(e){
                if(!this.isExpanded()){
                    this.onTriggerClick();
                }else{
                    this.inKeyMode = true;
                    this.selectNext();
                }
            },

            "enter" : function(e){
                this.onViewClick();
                //return true;
            },

            "esc" : function(e){
                this.collapse();
            },

            "tab" : function(e){
                this.onViewClick(false);
                return true;
            },

            scope : this,

            doRelay : function(foo, bar, hname){
                if(hname == 'down' || this.scope.isExpanded()){
                   return Roo.KeyNav.prototype.doRelay.apply(this, arguments);
                }
                return true;
            },

            forceKeyDown: true
        });
        this.queryDelay = Math.max(this.queryDelay || 10,
                this.mode == 'local' ? 10 : 250);
        this.dqTask = new Roo.util.DelayedTask(this.initQuery, this);
        if(this.typeAhead){
            this.taTask = new Roo.util.DelayedTask(this.onTypeAhead, this);
        }
        if(this.editable !== false){
            this.el.on("keyup", this.onKeyUp, this);
        }
        if(this.forceSelection){
            this.on('blur', this.doForce, this);
        }
    },

    onDestroy : function(){
        if(this.view){
            this.view.setStore(null);
            this.view.el.removeAllListeners();
            this.view.el.remove();
            this.view.purgeListeners();
        }
        if(this.list){
            this.list.destroy();
        }
        if(this.store){
            this.store.un('beforeload', this.onBeforeLoad, this);
            this.store.un('load', this.onLoad, this);
            this.store.un('loadexception', this.collapse, this);
        }
        Roo.form.ComboBox.superclass.onDestroy.call(this);
    },

    // private
    fireKey : function(e){
        if(e.isNavKeyPress() && !this.list.isVisible()){
            this.fireEvent("specialkey", this, e);
        }
    },

    // private
    onResize: function(w, h){
        Roo.form.ComboBox.superclass.onResize.apply(this, arguments);
        if(this.list && this.listWidth === undefined){
            var lw = Math.max(w, this.minListWidth);
            this.list.setWidth(lw);
            this.innerList.setWidth(lw - this.list.getFrameWidth('lr'));
        }
    },

    /**
     * Allow or prevent the user from directly editing the field text.  If false is passed,
     * the user will only be able to select from the items defined in the dropdown list.  This method
     * is the runtime equivalent of setting the 'editable' config option at config time.
     * @param {Boolean} value True to allow the user to directly edit the field text
     */
    setEditable : function(value){
        if(value == this.editable){
            return;
        }
        this.editable = value;
        if(!value){
            this.el.dom.setAttribute('readOnly', true);
            this.el.on('mousedown', this.onTriggerClick,  this);
            this.el.addClass('x-combo-noedit');
        }else{
            this.el.dom.setAttribute('readOnly', false);
            this.el.un('mousedown', this.onTriggerClick,  this);
            this.el.removeClass('x-combo-noedit');
        }
    },

    // private
    onBeforeLoad : function(){
        if(!this.hasFocus){
            return;
        }
        this.innerList.update(this.loadingText ?
               '<div class="loading-indicator">'+this.loadingText+'</div>' : '');
        this.restrictHeight();
        this.selectedIndex = -1;
    },

    // private
    onLoad : function(){
        if(!this.hasFocus){
            return;
        }
        if(this.store.getCount() > 0){
            this.expand();
            this.restrictHeight();
            if(this.lastQuery == this.allQuery){
                if(this.editable){
                    this.el.dom.select();
                }
                if(!this.selectByValue(this.value, true)){
                    this.select(0, true);
                }
            }else{
                this.selectNext();
                if(this.typeAhead && this.lastKey != Roo.EventObject.BACKSPACE && this.lastKey != Roo.EventObject.DELETE){
                    this.taTask.delay(this.typeAheadDelay);
                }
            }
        }else{
            this.onEmptyResults();
        }
        //this.el.focus();
    },

    // private
    onTypeAhead : function(){
        if(this.store.getCount() > 0){
            var r = this.store.getAt(0);
            var newValue = r.data[this.displayField];
            var len = newValue.length;
            var selStart = this.getRawValue().length;
            if(selStart != len){
                this.setRawValue(newValue);
                this.selectText(selStart, newValue.length);
            }
        }
    },

    // private
    onSelect : function(record, index){
        if(this.fireEvent('beforeselect', this, record, index) !== false){
            this.setFromData(index > -1 ? record.data : false);
            this.collapse();
            this.fireEvent('select', this, record, index);
        }
    },

    /**
     * Returns the currently selected field value or empty string if no value is set.
     * @return {String} value The selected value
     */
    getValue : function(){
        if(this.valueField){
            return typeof this.value != 'undefined' ? this.value : '';
        }else{
            return Roo.form.ComboBox.superclass.getValue.call(this);
        }
    },

    /**
     * Clears any text/value currently set in the field
     */
    clearValue : function(){
        if(this.hiddenField){
            this.hiddenField.value = '';
        }
        this.value = '';
        this.setRawValue('');
        this.lastSelectionText = '';
        this.applyEmptyText();
    },

    /**
     * Sets the specified value into the field.  If the value finds a match, the corresponding record text
     * will be displayed in the field.  If the value does not match the data value of an existing item,
     * and the valueNotFoundText config option is defined, it will be displayed as the default field text.
     * Otherwise the field will be blank (although the value will still be set).
     * @param {String} value The value to match
     */
    setValue : function(v){
        var text = v;
        if(this.valueField){
            var r = this.findRecord(this.valueField, v);
            if(r){
                text = r.data[this.displayField];
            }else if(this.valueNotFoundText !== undefined){
                text = this.valueNotFoundText;
            }
        }
        this.lastSelectionText = text;
        if(this.hiddenField){
            this.hiddenField.value = v;
        }
        Roo.form.ComboBox.superclass.setValue.call(this, text);
        this.value = v;
    },
    /**
     * @property {Object} the last set data for the element
     */
    
    lastData : false,
    /**
     * Sets the value of the field based on a object which is related to the record format for the store.
     * @param {Object} value the value to set as. or false on reset?
     */
    setFromData : function(o){
        var dv = ''; // display value
        var vv = ''; // value value..
        this.lastData = o;
        if (this.displayField) {
            dv = !o || typeof(o[this.displayField]) == 'undefined' ? '' : o[this.displayField];
        } else {
            // this is an error condition!!!
            console.log('no value field set for '+ this.name);
        }
        
        if(this.valueField){
            vv = !o || typeof(o[this.valueField]) == 'undefined' ? dv : o[this.valueField];
        }
        if(this.hiddenField){
            this.hiddenField.value = vv;
            
            this.lastSelectionText = dv;
            Roo.form.ComboBox.superclass.setValue.call(this, dv);
            this.value = vv;
            return;
        }
        // no hidden field.. - we store the value in 'value', but still display
        // display field!!!!
        this.lastSelectionText = dv;
        Roo.form.ComboBox.superclass.setValue.call(this, dv);
        this.value = vv;
        
        
    },
    // private
    reset : function(){
        // overridden so that last data is reset..
        this.setValue(this.originalValue);
        this.clearInvalid();
        this.lastData = false;
    },
    // private
    findRecord : function(prop, value){
        var record;
        if(this.store.getCount() > 0){
            this.store.each(function(r){
                if(r.data[prop] == value){
                    record = r;
                    return false;
                }
            });
        }
        return record;
    },

    // private
    onViewMove : function(e, t){
        this.inKeyMode = false;
    },

    // private
    onViewOver : function(e, t){
        if(this.inKeyMode){ // prevent key nav and mouse over conflicts
            return;
        }
        var item = this.view.findItemFromChild(t);
        if(item){
            var index = this.view.indexOf(item);
            this.select(index, false);
        }
    },

    // private
    onViewClick : function(doFocus){
        var index = this.view.getSelectedIndexes()[0];
        var r = this.store.getAt(index);
        if(r){
            this.onSelect(r, index);
        }
        if(doFocus !== false && !this.blockFocus){
            this.el.focus();
        }
    },

    // private
    restrictHeight : function(){
        this.innerList.dom.style.height = '';
        var inner = this.innerList.dom;
        var h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight);
        this.innerList.setHeight(h < this.maxHeight ? 'auto' : this.maxHeight);
        this.list.beginUpdate();
        this.list.setHeight(this.innerList.getHeight()+this.list.getFrameWidth('tb')+(this.resizable?this.handleHeight:0)+this.assetHeight);
        this.list.alignTo(this.el, this.listAlign);
        this.list.endUpdate();
    },

    // private
    onEmptyResults : function(){
        this.collapse();
    },

    /**
     * Returns true if the dropdown list is expanded, else false.
     */
    isExpanded : function(){
        return this.list.isVisible();
    },

    /**
     * Select an item in the dropdown list by its data value. This function does NOT cause the select event to fire.
     * The store must be loaded and the list expanded for this function to work, otherwise use setValue.
     * @param {String} value The data value of the item to select
     * @param {Boolean} scrollIntoView False to prevent the dropdown list from autoscrolling to display the
     * selected item if it is not currently in view (defaults to true)
     * @return {Boolean} True if the value matched an item in the list, else false
     */
    selectByValue : function(v, scrollIntoView){
        if(v !== undefined && v !== null){
            var r = this.findRecord(this.valueField || this.displayField, v);
            if(r){
                this.select(this.store.indexOf(r), scrollIntoView);
                return true;
            }
        }
        return false;
    },

    /**
     * Select an item in the dropdown list by its numeric index in the list. This function does NOT cause the select event to fire.
     * The store must be loaded and the list expanded for this function to work, otherwise use setValue.
     * @param {Number} index The zero-based index of the list item to select
     * @param {Boolean} scrollIntoView False to prevent the dropdown list from autoscrolling to display the
     * selected item if it is not currently in view (defaults to true)
     */
    select : function(index, scrollIntoView){
        this.selectedIndex = index;
        this.view.select(index);
        if(scrollIntoView !== false){
            var el = this.view.getNode(index);
            if(el){
                this.innerList.scrollChildIntoView(el, false);
            }
        }
    },

    // private
    selectNext : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex < ct-1){
                this.select(this.selectedIndex+1);
            }
        }
    },

    // private
    selectPrev : function(){
        var ct = this.store.getCount();
        if(ct > 0){
            if(this.selectedIndex == -1){
                this.select(0);
            }else if(this.selectedIndex != 0){
                this.select(this.selectedIndex-1);
            }
        }
    },

    // private
    onKeyUp : function(e){
        if(this.editable !== false && !e.isSpecialKey()){
            this.lastKey = e.getKey();
            this.dqTask.delay(this.queryDelay);
        }
    },

    // private
    validateBlur : function(){
        return !this.list || !this.list.isVisible();   
    },

    // private
    initQuery : function(){
        this.doQuery(this.getRawValue());
    },

    // private
    doForce : function(){
        if(this.el.dom.value.length > 0){
            this.el.dom.value =
                this.lastSelectionText === undefined ? '' : this.lastSelectionText;
            this.applyEmptyText();
        }
    },

    /**
     * Execute a query to filter the dropdown list.  Fires the beforequery event prior to performing the
     * query allowing the query action to be canceled if needed.
     * @param {String} query The SQL query to execute
     * @param {Boolean} forceAll True to force the query to execute even if there are currently fewer characters
     * in the field than the minimum specified by the minChars config option.  It also clears any filter previously
     * saved in the current store (defaults to false)
     */
    doQuery : function(q, forceAll){
        if(q === undefined || q === null){
            q = '';
        }
        var qe = {
            query: q,
            forceAll: forceAll,
            combo: this,
            cancel:false
        };
        if(this.fireEvent('beforequery', qe)===false || qe.cancel){
            return false;
        }
        q = qe.query;
        forceAll = qe.forceAll;
        if(forceAll === true || (q.length >= this.minChars)){
            if(this.lastQuery != q){
                this.lastQuery = q;
                if(this.mode == 'local'){
                    this.selectedIndex = -1;
                    if(forceAll){
                        this.store.clearFilter();
                    }else{
                        this.store.filter(this.displayField, q);
                    }
                    this.onLoad();
                }else{
                    this.store.baseParams[this.queryParam] = q;
                    this.store.load({
                        params: this.getParams(q)
                    });
                    this.expand();
                }
            }else{
                this.selectedIndex = -1;
                this.onLoad();   
            }
        }
    },

    // private
    getParams : function(q){
        var p = {};
        //p[this.queryParam] = q;
        if(this.pageSize){
            p.start = 0;
            p.limit = this.pageSize;
        }
        return p;
    },

    /**
     * Hides the dropdown list if it is currently expanded. Fires the 'collapse' event on completion.
     */
    collapse : function(){
        if(!this.isExpanded()){
            return;
        }
        this.list.hide();
        Roo.get(document).un('mousedown', this.collapseIf, this);
        Roo.get(document).un('mousewheel', this.collapseIf, this);
        this.fireEvent('collapse', this);
    },

    // private
    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.list)){
            this.collapse();
        }
    },

    /**
     * Expands the dropdown list if it is currently hidden. Fires the 'expand' event on completion.
     */
    expand : function(){
        if(this.isExpanded() || !this.hasFocus){
            return;
        }
        this.list.alignTo(this.el, this.listAlign);
        this.list.show();
        Roo.get(document).on('mousedown', this.collapseIf, this);
        Roo.get(document).on('mousewheel', this.collapseIf, this);
        this.fireEvent('expand', this);
    },

    // private
    // Implements the default empty TriggerField.onTriggerClick function
    onTriggerClick : function(){
        if(this.disabled){
            return;
        }
        if(this.isExpanded()){
            this.collapse();
            if (!this.blockFocus) {
                this.el.focus();
            }
            
        }else {
            this.hasFocus = true;
            if(this.triggerAction == 'all') {
                this.doQuery(this.allQuery, true);
            } else {
                this.doQuery(this.getRawValue());
            }
            if (!this.blockFocus) {
                this.el.focus();
            }
        }
    }

    /** 
    * @cfg {Boolean} grow 
    * @hide 
    */
    /** 
    * @cfg {Number} growMin 
    * @hide 
    */
    /** 
    * @cfg {Number} growMax 
    * @hide 
    */
    /**
     * @hide
     * @method autoSize
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
 * @class Roo.form.Checkbox
 * @extends Roo.form.Field
 * Single checkbox field.  Can be used as a direct replacement for traditional checkbox fields.
 * @constructor
 * Creates a new Checkbox
 * @param {Object} config Configuration options
 */
Roo.form.Checkbox = function(config){
    Roo.form.Checkbox.superclass.constructor.call(this, config);
    this.addEvents({
        /**
         * @event check
         * Fires when the checkbox is checked or unchecked.
	     * @param {Roo.form.Checkbox} this This checkbox
	     * @param {Boolean} checked The new checked value
	     */
        check : true
    });
};

Roo.extend(Roo.form.Checkbox, Roo.form.Field,  {
    /**
     * @cfg {String} focusClass The CSS class to use when the checkbox receives focus (defaults to undefined)
     */
    focusClass : undefined,
    /**
     * @cfg {String} fieldClass The default CSS class for the checkbox (defaults to "x-form-field")
     */
    fieldClass: "x-form-field",
    /**
     * @cfg {Boolean} checked True if the the checkbox should render already checked (defaults to false)
     */
    checked: false,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"})
     */
    defaultAutoCreate : { tag: "input", type: 'hidden', autocomplete: "off"},
    /**
     * @cfg {String} boxLabel The text that appears beside the checkbox
     */
    boxLabel : "",
    /**
     * @cfg {String} inputValue The value that should go into the generated input element's value attribute
     */  
    inputValue : '1',
    /**
     * @cfg {String} valueOff The value that should go into the generated input element's value when unchecked.
     */
     valueOff: '0', // value when not checked..

    actionMode : 'viewEl', 
    //
    // private
    itemCls : 'x-menu-check-item x-form-item',
    groupClass : 'x-menu-group-item',
    inputType : 'hidden',
    
    
    inSetChecked: false, // check that we are not calling self...
    
    inputElement: false, // real input element?
    basedOn: false, // ????
    
    isFormField: true, // not sure where this is needed!!!!

    onResize : function(){
        Roo.form.Checkbox.superclass.onResize.apply(this, arguments);
        if(!this.boxLabel){
            this.el.alignTo(this.wrap, 'c-c');
        }
    },

    initEvents : function(){
        Roo.form.Checkbox.superclass.initEvents.call(this);
        this.el.on("click", this.onClick,  this);
        this.el.on("change", this.onClick,  this);
    },


    getResizeEl : function(){
        return this.wrap;
    },

    getPositionEl : function(){
        return this.wrap;
    },

    // private
    onRender : function(ct, position){
        Roo.form.Checkbox.superclass.onRender.call(this, ct, position);
        /*
        if(this.inputValue !== undefined){
            this.el.dom.value = this.inputValue;
        }
        */
        //this.wrap = this.el.wrap({cls: "x-form-check-wrap"});
        this.wrap = this.el.wrap({cls: 'x-menu-check-item '});
        var viewEl = this.wrap.createChild({ 
            tag: 'img', cls: 'x-menu-item-icon', style: 'margin: 0px;' ,src : Roo.BLANK_IMAGE_URL });
        this.viewEl = viewEl;   
        this.wrap.on('click', this.onClick,  this); 
        
        this.el.on('DOMAttrModified', this.setFromHidden,  this); //ff
        this.el.on('propertychange', this.setFromHidden,  this);  //ie
        
        
        
        if(this.boxLabel){
            this.wrap.createChild({tag: 'label', htmlFor: this.el.id, cls: 'x-form-cb-label', html: this.boxLabel});
        //    viewEl.on('click', this.onClick,  this); 
        }
        //if(this.checked){
            this.setChecked(this.checked);
        //}else{
            //this.checked = this.el.dom;
        //}

    },

    // private
    initValue : Roo.emptyFn,

    /**
     * Returns the checked state of the checkbox.
     * @return {Boolean} True if checked, else false
     */
    getValue : function(){
        if(this.el){
            return String(this.el.dom.value) == String(this.inputValue ) ? this.inputValue : this.valueOff;
        }
        return this.valueOff;
        
    },

	// private
    onClick : function(){ 
        this.setChecked(!this.checked);

        //if(this.el.dom.checked != this.checked){
        //    this.setValue(this.el.dom.checked);
       // }
    },

    /**
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} checked True, 'true', '1', or 'on' to check the checkbox, any other value will uncheck it.
     */
    setValue : function(v,suppressEvent){
        //this.checked = (v === true || v === 'true' || v == '1' || String(v).toLowerCase() == 'on');
        //if(this.el && this.el.dom){
        //    this.el.dom.checked = this.checked;
        //    this.el.dom.defaultChecked = this.checked;
        //}
        this.setChecked(v === this.inputValue);
        //this.fireEvent("check", this, this.checked);
    },
    // private..
    setChecked : function(state,suppressEvent)
    {
        if (this.inSetChecked) {
            this.checked = state;
            return;
        }
        
    
        if(this.wrap){
            this.wrap[state ? 'addClass' : 'removeClass']('x-menu-item-checked');
        }
        this.checked = state;
        if(suppressEvent !== true){
            this.fireEvent('checkchange', this, state);
        }
        this.inSetChecked = true;
        this.el.dom.value = state ? this.inputValue : this.valueOff;
        this.inSetChecked = false;
        
    },
    // handle setting of hidden value by some other method!!?!?
    setFromHidden: function()
    {
        if(!this.el){
            return;
        }
        //console.log("SET FROM HIDDEN");
        //alert('setFrom hidden');
        this.setValue(this.el.dom.value);
    },
    
    onDestroy : function()
    {
        if(this.viewEl){
            Roo.get(this.viewEl).remove();
        }
         
        Roo.form.Checkbox.superclass.onDestroy.call(this);
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
 * @class Roo.form.Radio
 * @extends Roo.form.Checkbox
 * Single radio field.  Same as Checkbox, but provided as a convenience for automatically setting the input type.
 * Radio grouping is handled automatically by the browser if you give each radio in a group the same name.
 * @constructor
 * Creates a new Radio
 * @param {Object} config Configuration options
 */
Roo.form.Radio = function(){
    Roo.form.Radio.superclass.constructor.apply(this, arguments);
};
Roo.extend(Roo.form.Radio, Roo.form.Checkbox, {
    inputType: 'radio',

    /**
     * If this radio is part of a group, it will return the selected value
     * @return {String}
     */
    getGroupValue : function(){
        return this.el.up('form').child('input[name='+this.el.dom.name+']:checked', true).value;
    }
});//<script type="text/javascript">

/*
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://www.extjs.com/license
 */
 
 /*
  * 
  * Known bugs:
  * Default CSS appears to render it as fixed text by default (should really be Sans-Serif)
  * - IE ? - no idea how much works there.
  * 
  * 
  * 
  */
 

/**
 * @class Ext.form.HtmlEditor
 * @extends Ext.form.Field
 * Provides a lightweight HTML Editor component.
 * WARNING - THIS CURRENTlY ONLY WORKS ON FIREFOX - USE FCKeditor for a cross platform version
 * 
 * <br><br><b>Note: The focus/blur and validation marking functionality inherited from Ext.form.Field is NOT
 * supported by this editor.</b><br/><br/>
 * An Editor is a sensitive component that can't be used in all spots standard fields can be used. Putting an Editor within
 * any element that has display set to 'none' can cause problems in Safari and Firefox.<br/><br/>
 */
Roo.form.HtmlEditor = Roo.extend(Roo.form.Field, {
      /**
     * @cfg {Array} toolbars Array of toolbars. - defaults to just the Standard one
     */
    toolbars : false,
    /**
     * @cfg {String} createLinkText The default text for the create link prompt
     */
    createLinkText : 'Please enter the URL for the link:',
    /**
     * @cfg {String} defaultLinkValue The default value for the create link prompt (defaults to http:/ /)
     */
    defaultLinkValue : 'http:/'+'/',
   
    
    // id of frame..
    frameId: false,
    
    // private properties
    validationEvent : false,
    deferHeight: true,
    initialized : false,
    activated : false,
    sourceEditMode : false,
    onFocus : Roo.emptyFn,
    iframePad:3,
    hideMode:'offsets',
    defaultAutoCreate : {
        tag: "textarea",
        style:"width:500px;height:300px;",
        autocomplete: "off"
    },

    // private
    initComponent : function(){
        this.addEvents({
            /**
             * @event initialize
             * Fires when the editor is fully initialized (including the iframe)
             * @param {HtmlEditor} this
             */
            initialize: true,
            /**
             * @event activate
             * Fires when the editor is first receives the focus. Any insertion must wait
             * until after this event.
             * @param {HtmlEditor} this
             */
            activate: true,
             /**
             * @event beforesync
             * Fires before the textarea is updated with content from the editor iframe. Return false
             * to cancel the sync.
             * @param {HtmlEditor} this
             * @param {String} html
             */
            beforesync: true,
             /**
             * @event beforepush
             * Fires before the iframe editor is updated with content from the textarea. Return false
             * to cancel the push.
             * @param {HtmlEditor} this
             * @param {String} html
             */
            beforepush: true,
             /**
             * @event sync
             * Fires when the textarea is updated with content from the editor iframe.
             * @param {HtmlEditor} this
             * @param {String} html
             */
            sync: true,
             /**
             * @event push
             * Fires when the iframe editor is updated with content from the textarea.
             * @param {HtmlEditor} this
             * @param {String} html
             */
            push: true,
             /**
             * @event editmodechange
             * Fires when the editor switches edit modes
             * @param {HtmlEditor} this
             * @param {Boolean} sourceEdit True if source edit, false if standard editing.
             */
            editmodechange: true,
            /**
             * @event editorevent
             * Fires when on any editor (mouse up/down cursor movement etc.) - used for toolbar hooks.
             * @param {HtmlEditor} this
             */
            editorevent: true
        })
    },

    /**
     * Protected method that will not generally be called directly. It
     * is called when the editor creates its toolbar. Override this method if you need to
     * add custom toolbar buttons.
     * @param {HtmlEditor} editor
     */
    createToolbar : function(editor){
        if (!editor.toolbars || !editor.toolbars.length) {
            editor.toolbars = [ new Roo.form.HtmlEditor.ToolbarStandard() ]; // can be empty?
        }
        
        for (var i =0 ; i < editor.toolbars.length;i++) {
            editor.toolbars[i].init(editor);
        }
         
        
    },

    /**
     * Protected method that will not generally be called directly. It
     * is called when the editor initializes the iframe with HTML contents. Override this method if you
     * want to change the initialization markup of the iframe (e.g. to add stylesheets).
     */
    getDocMarkup : function(){
        return '<html><head><style type="text/css">body{border:0;margin:0;padding:3px;height:98%;cursor:text;}</style></head><body></body></html>';
    },

    // private
    onRender : function(ct, position){
        Roo.form.HtmlEditor.superclass.onRender.call(this, ct, position);
        this.el.dom.style.border = '0 none';
        this.el.dom.setAttribute('tabIndex', -1);
        this.el.addClass('x-hidden');
        if(Roo.isIE){ // fix IE 1px bogus margin
            this.el.applyStyles('margin-top:-1px;margin-bottom:-1px;')
        }
        this.wrap = this.el.wrap({
            cls:'x-html-editor-wrap', cn:{cls:'x-html-editor-tb'}
        });

        this.frameId = Roo.id();
        this.createToolbar(this);
        
        
        
        
      
        
        var iframe = this.wrap.createChild({
            tag: 'iframe',
            id: this.frameId,
            name: this.frameId,
            frameBorder : 'no',
            'src' : Roo.SSL_SECURE_URL ? Roo.SSL_SECURE_URL  :  "javascript:false"
        });
        
       // console.log(iframe);
        //this.wrap.dom.appendChild(iframe);

        this.iframe = iframe.dom;

         this.assignDocWin();
        
        this.doc.designMode = 'on';
       
        this.doc.open();
        this.doc.write(this.getDocMarkup());
        this.doc.close();

        
        var task = { // must defer to wait for browser to be ready
            run : function(){
                //console.log("run task?" + this.doc.readyState);
                this.assignDocWin();
                if(this.doc.body || this.doc.readyState == 'complete'){
                    try {
                        
                       
                        this.doc.designMode="on";
                    } catch (e) {
                        return;
                    }
                    Roo.TaskMgr.stop(task);
                    this.initEditor.defer(10, this);
                }
            },
            interval : 10,
            duration:10000,
            scope: this
        };
        Roo.TaskMgr.start(task);

        if(!this.width){
            this.setSize(this.el.getSize());
        }
    },

    // private
    onResize : function(w, h){
        Roo.form.HtmlEditor.superclass.onResize.apply(this, arguments);
        if(this.el && this.iframe){
            if(typeof w == 'number'){
                var aw = w - this.wrap.getFrameWidth('lr');
                this.el.setWidth(this.adjustWidth('textarea', aw));
                this.iframe.style.width = aw + 'px';
            }
            if(typeof h == 'number'){
                var tbh = 0;
                for (var i =0; i < this.toolbars.length;i++) {
                    // fixme - ask toolbars for heights?
                    tbh += this.toolbars[i].tb.el.getHeight();
                }
                
                
                
                
                var ah = h - this.wrap.getFrameWidth('tb') - tbh;// this.tb.el.getHeight();
                this.el.setHeight(this.adjustWidth('textarea', ah));
                this.iframe.style.height = ah + 'px';
                if(this.doc){
                    (this.doc.body || this.doc.documentElement).style.height = (ah - (this.iframePad*2)) + 'px';
                }
            }
        }
    },

    /**
     * Toggles the editor between standard and source edit mode.
     * @param {Boolean} sourceEdit (optional) True for source edit, false for standard
     */
    toggleSourceEdit : function(sourceEditMode){
        
        this.sourceEditMode = sourceEditMode === true;
        
        if(this.sourceEditMode){
          
            this.syncValue();
            this.iframe.className = 'x-hidden';
            this.el.removeClass('x-hidden');
            this.el.dom.removeAttribute('tabIndex');
            this.el.focus();
        }else{
             
            this.pushValue();
            this.iframe.className = '';
            this.el.addClass('x-hidden');
            this.el.dom.setAttribute('tabIndex', -1);
            this.deferFocus();
        }
        this.setSize(this.wrap.getSize());
        this.fireEvent('editmodechange', this, this.sourceEditMode);
    },

    // private used internally
    createLink : function(){
        var url = prompt(this.createLinkText, this.defaultLinkValue);
        if(url && url != 'http:/'+'/'){
            this.relayCmd('createlink', url);
        }
    },

    // private (for BoxComponent)
    adjustSize : Roo.BoxComponent.prototype.adjustSize,

    // private (for BoxComponent)
    getResizeEl : function(){
        return this.wrap;
    },

    // private (for BoxComponent)
    getPositionEl : function(){
        return this.wrap;
    },

    // private
    initEvents : function(){
        this.originalValue = this.getValue();
    },

    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    markInvalid : Roo.emptyFn,
    /**
     * Overridden and disabled. The editor element does not support standard valid/invalid marking. @hide
     * @method
     */
    clearInvalid : Roo.emptyFn,

    setValue : function(v){
        Roo.form.HtmlEditor.superclass.setValue.call(this, v);
        this.pushValue();
    },

    /**
     * Protected method that will not generally be called directly. If you need/want
     * custom HTML cleanup, this is the method you should override.
     * @param {String} html The HTML to be cleaned
     * return {String} The cleaned HTML
     */
    cleanHtml : function(html){
        html = String(html);
        if(html.length > 5){
            if(Roo.isSafari){ // strip safari nonsense
                html = html.replace(/\sclass="(?:Apple-style-span|khtml-block-placeholder)"/gi, '');
            }
        }
        if(html == '&nbsp;'){
            html = '';
        }
        return html;
    },

    /**
     * Protected method that will not generally be called directly. Syncs the contents
     * of the editor iframe with the textarea.
     */
    syncValue : function(){
        if(this.initialized){
            var bd = (this.doc.body || this.doc.documentElement);
            var html = bd.innerHTML;
            if(Roo.isSafari){
                var bs = bd.getAttribute('style'); // Safari puts text-align styles on the body element!
                var m = bs.match(/text-align:(.*?);/i);
                if(m && m[1]){
                    html = '<div style="'+m[0]+'">' + html + '</div>';
                }
            }
            html = this.cleanHtml(html);
            if(this.fireEvent('beforesync', this, html) !== false){
                this.el.dom.value = html;
                this.fireEvent('sync', this, html);
            }
        }
    },

    /**
     * Protected method that will not generally be called directly. Pushes the value of the textarea
     * into the iframe editor.
     */
    pushValue : function(){
        if(this.initialized){
            var v = this.el.dom.value;
            if(v.length < 1){
                v = '&#160;';
            }
            if(this.fireEvent('beforepush', this, v) !== false){
                (this.doc.body || this.doc.documentElement).innerHTML = v;
                this.fireEvent('push', this, v);
            }
        }
    },

    // private
    deferFocus : function(){
        this.focus.defer(10, this);
    },

    // doc'ed in Field
    focus : function(){
        if(this.win && !this.sourceEditMode){
            this.win.focus();
        }else{
            this.el.focus();
        }
    },
    
    assignDocWin: function()
    {
        var iframe = this.iframe;
        
         if(Roo.isIE){
            this.doc = iframe.contentWindow.document;
            this.win = iframe.contentWindow;
        } else {
            this.doc = (iframe.contentDocument || Roo.get(this.frameId).dom.document);
            this.win = Roo.get(this.frameId).dom.contentWindow;
        }
    },
    
    // private
    initEditor : function(){
        //console.log("INIT EDITOR");
        this.assignDocWin();
        
        
        
        this.doc.designMode="on";
        this.doc.open();
        this.doc.write(this.getDocMarkup());
        this.doc.close();
        
        var dbody = (this.doc.body || this.doc.documentElement);
        //var ss = this.el.getStyles('font-size', 'font-family', 'background-image', 'background-repeat');
        // this copies styles from the containing element into thsi one..
        // not sure why we need all of this..
        var ss = this.el.getStyles('font-size', 'background-image', 'background-repeat');
        ss['background-attachment'] = 'fixed'; // w3c
        dbody.bgProperties = 'fixed'; // ie
        Roo.DomHelper.applyStyles(dbody, ss);
        Roo.EventManager.on(this.doc, {
            'mousedown': this.onEditorEvent,
            'dblclick': this.onEditorEvent,
            'click': this.onEditorEvent,
            'keyup': this.onEditorEvent,
            buffer:100,
            scope: this
        });
        if(Roo.isGecko){
            Roo.EventManager.on(this.doc, 'keypress', this.applyCommand, this);
        }
        if(Roo.isIE || Roo.isSafari || Roo.isOpera){
            Roo.EventManager.on(this.doc, 'keydown', this.fixKeys, this);
        }
        this.initialized = true;

        this.fireEvent('initialize', this);
        this.pushValue();
    },

    // private
    onDestroy : function(){
        
        
        
        if(this.rendered){
            
            for (var i =0; i < this.toolbars.length;i++) {
                // fixme - ask toolbars for heights?
                this.toolbars[i].onDestroy();
            }
            
            this.wrap.dom.innerHTML = '';
            this.wrap.remove();
        }
    },

    // private
    onFirstFocus : function(){
        
        this.assignDocWin();
        
        
        this.activated = true;
        for (var i =0; i < this.toolbars.length;i++) {
            this.toolbars[i].onFirstFocus();
        }
       
        if(Roo.isGecko){ // prevent silly gecko errors
            this.win.focus();
            var s = this.win.getSelection();
            if(!s.focusNode || s.focusNode.nodeType != 3){
                var r = s.getRangeAt(0);
                r.selectNodeContents((this.doc.body || this.doc.documentElement));
                r.collapse(true);
                this.deferFocus();
            }
            try{
                this.execCmd('useCSS', true);
                this.execCmd('styleWithCSS', false);
            }catch(e){}
        }
        this.fireEvent('activate', this);
    },

    // private
    adjustFont: function(btn){
        var adjust = btn.cmd == 'increasefontsize' ? 1 : -1;
        //if(Roo.isSafari){ // safari
        //    adjust *= 2;
       // }
        var v = parseInt(this.doc.queryCommandValue('FontSize')|| 3, 10);
        if(Roo.isSafari){ // safari
            var sm = { 10 : 1, 13: 2, 16:3, 18:4, 24: 5, 32:6, 48: 7 };
            v =  (v < 10) ? 10 : v;
            v =  (v > 48) ? 48 : v;
            v = typeof(sm[v]) == 'undefined' ? 1 : sm[v];
            
        }
        
        
        v = Math.max(1, v+adjust);
        
        this.execCmd('FontSize', v  );
    },

    onEditorEvent : function(e){
        this.fireEvent('editorevent', this, e);
      //  this.updateToolbar();
        this.syncValue();
    },

    insertTag : function(tg)
    {
        // could be a bit smarter... -> wrap the current selected tRoo..
        
        this.execCmd("formatblock",   tg);
        
    },
    
    insertText : function(txt)
    {
        
        
        range = this.createRange();
        range.deleteContents();
               //alert(Sender.getAttribute('label'));
               
        range.insertNode(this.doc.createTextNode(txt));
    } ,
    
    // private
    relayBtnCmd : function(btn){
        this.relayCmd(btn.cmd);
    },

    /**
     * Executes a Midas editor command on the editor document and performs necessary focus and
     * toolbar updates. <b>This should only be called after the editor is initialized.</b>
     * @param {String} cmd The Midas command
     * @param {String/Boolean} value (optional) The value to pass to the command (defaults to null)
     */
    relayCmd : function(cmd, value){
        this.win.focus();
        this.execCmd(cmd, value);
        this.fireEvent('editorevent', this);
        //this.updateToolbar();
        this.deferFocus();
    },

    /**
     * Executes a Midas editor command directly on the editor document.
     * For visual commands, you should use {@link #relayCmd} instead.
     * <b>This should only be called after the editor is initialized.</b>
     * @param {String} cmd The Midas command
     * @param {String/Boolean} value (optional) The value to pass to the command (defaults to null)
     */
    execCmd : function(cmd, value){
        this.doc.execCommand(cmd, false, value === undefined ? null : value);
        this.syncValue();
    },

    // private
    applyCommand : function(e){
        if(e.ctrlKey){
            var c = e.getCharCode(), cmd;
            if(c > 0){
                c = String.fromCharCode(c);
                switch(c){
                    case 'b':
                        cmd = 'bold';
                    break;
                    case 'i':
                        cmd = 'italic';
                    break;
                    case 'u':
                        cmd = 'underline';
                    break;
                }
                if(cmd){
                    this.win.focus();
                    this.execCmd(cmd);
                    this.deferFocus();
                    e.preventDefault();
                }
            }
        }
    },

    /**
     * Inserts the passed text at the current cursor position. Note: the editor must be initialized and activated
     * to insert tRoo.
     * @param {String} text
     */
    insertAtCursor : function(text){
        if(!this.activated){
            return;
        }
        if(Roo.isIE){
            this.win.focus();
            var r = this.doc.selection.createRange();
            if(r){
                r.collapse(true);
                r.pasteHTML(text);
                this.syncValue();
                this.deferFocus();
            }
        }else if(Roo.isGecko || Roo.isOpera){
            this.win.focus();
            this.execCmd('InsertHTML', text);
            this.deferFocus();
        }else if(Roo.isSafari){
            this.execCmd('InsertText', text);
            this.deferFocus();
        }
    },

    // private
    fixKeys : function(){ // load time branching for fastest keydown performance
        if(Roo.isIE){
            return function(e){
                var k = e.getKey(), r;
                if(k == e.TAB){
                    e.stopEvent();
                    r = this.doc.selection.createRange();
                    if(r){
                        r.collapse(true);
                        r.pasteHTML('&#160;&#160;&#160;&#160;');
                        this.deferFocus();
                    }
                }else if(k == e.ENTER){
                    r = this.doc.selection.createRange();
                    if(r){
                        var target = r.parentElement();
                        if(!target || target.tagName.toLowerCase() != 'li'){
                            e.stopEvent();
                            r.pasteHTML('<br />');
                            r.collapse(false);
                            r.select();
                        }
                    }
                }
            };
        }else if(Roo.isOpera){
            return function(e){
                var k = e.getKey();
                if(k == e.TAB){
                    e.stopEvent();
                    this.win.focus();
                    this.execCmd('InsertHTML','&#160;&#160;&#160;&#160;');
                    this.deferFocus();
                }
            };
        }else if(Roo.isSafari){
            return function(e){
                var k = e.getKey();
                if(k == e.TAB){
                    e.stopEvent();
                    this.execCmd('InsertText','\t');
                    this.deferFocus();
                }
             };
        }
    }(),
    
    getAllAncestors: function()
    {
        var p = this.getSelectedNode();
        var a = [];
        if (!p) {
            a.push(p); // push blank onto stack..
            p = this.getParentElement();
        }
        
        
        while (p && (p.nodeType == 1) && (p.tagName.toLowerCase() != 'body')) {
            a.push(p);
            p = p.parentNode;
        }
        a.push(this.doc.body);
        return a;
    },
    lastSel : false,
    lastSelNode : false,
    
    
    getSelection : function() 
    {
        this.assignDocWin();
        return Roo.isIE ? this.doc.selection : this.win.getSelection();
    },
    
    getSelectedNode: function() 
    {
        // this may only work on Gecko!!!
        
        // should we cache this!!!!
        
        
        
         
        var range = this.createRange(this.getSelection());
        
        if (Roo.isIE) {
            var parent = range.parentElement();
            while (true) {
                var testRange = range.duplicate();
                testRange.moveToElementText(parent);
                if (testRange.inRange(range)) {
                    break;
                }
                if ((parent.nodeType != 1) || (parent.tagName.toLowerCase() == 'body')) {
                    break;
                }
                parent = parent.parentElement;
            }
            return parent;
        }
        
        
        var ar = range.endContainer.childNodes;
        if (!ar.length) {
            ar = range.commonAncestorContainer.childNodes;
            //alert(ar.length);
        }
        var nodes = [];
        var other_nodes = [];
        var has_other_nodes = false;
        for (var i=0;i<ar.length;i++) {
            if ((ar[i].nodeType == 3) && (!ar[i].data.length)) { // empty text ? 
                continue;
            }
            // fullly contained node.
            
            if (this.rangeIntersectsNode(range,ar[i]) && this.rangeCompareNode(range,ar[i]) == 3) {
                nodes.push(ar[i]);
                continue;
            }
            
            // probably selected..
            if ((ar[i].nodeType == 1) && this.rangeIntersectsNode(range,ar[i]) && (this.rangeCompareNode(range,ar[i]) > 0)) {
                other_nodes.push(ar[i]);
                continue;
            }
            if (!this.rangeIntersectsNode(range,ar[i])|| (this.rangeCompareNode(range,ar[i]) == 0))  {
                continue;
            }
            
            
            has_other_nodes = true;
        }
        if (!nodes.length && other_nodes.length) {
            nodes= other_nodes;
        }
        if (has_other_nodes || !nodes.length || (nodes.length > 1)) {
            return false;
        }
        
        return nodes[0];
    },
    createRange: function(sel)
    {
        // this has strange effects when using with 
        // top toolbar - not sure if it's a great idea.
        //this.editor.contentWindow.focus();
        if (typeof sel != "undefined") {
            try {
                return sel.getRangeAt ? sel.getRangeAt(0) : sel.createRange();
            } catch(e) {
                return this.doc.createRange();
            }
        } else {
            return this.doc.createRange();
        }
    },
    getParentElement: function()
    {
        
        this.assignDocWin();
        var sel = Roo.isIE ? this.doc.selection : this.win.getSelection();
        
        var range = this.createRange(sel);
         
        try {
            var p = range.commonAncestorContainer;
            while (p.nodeType == 3) { // text node
                p = p.parentNode;
            }
            return p;
        } catch (e) {
            return null;
        }
    
    },
    
    
    
    // BC Hacks - cause I cant work out what i was trying to do..
    rangeIntersectsNode : function(range, node)
    {
        var nodeRange = node.ownerDocument.createRange();
        try {
            nodeRange.selectNode(node);
        }
        catch (e) {
            nodeRange.selectNodeContents(node);
        }

        return range.compareBoundaryPoints(Range.END_TO_START, nodeRange) == -1 &&
                 range.compareBoundaryPoints(Range.START_TO_END, nodeRange) == 1;
    },
    rangeCompareNode : function(range, node) {
        var nodeRange = node.ownerDocument.createRange();
        try {
            nodeRange.selectNode(node);
        } catch (e) {
            nodeRange.selectNodeContents(node);
        }
        var nodeIsBefore = range.compareBoundaryPoints(Range.START_TO_START, nodeRange) == 1;
        var nodeIsAfter = range.compareBoundaryPoints(Range.END_TO_END, nodeRange) == -1;

        if (nodeIsBefore && !nodeIsAfter)
            return 0;
        if (!nodeIsBefore && nodeIsAfter)
            return 1;
        if (nodeIsBefore && nodeIsAfter)
            return 2;

        return 3;
    }

    
    
    // hide stuff that is not compatible
    /**
     * @event blur
     * @hide
     */
    /**
     * @event change
     * @hide
     */
    /**
     * @event focus
     * @hide
     */
    /**
     * @event specialkey
     * @hide
     */
    /**
     * @cfg {String} fieldClass @hide
     */
    /**
     * @cfg {String} focusClass @hide
     */
    /**
     * @cfg {String} autoCreate @hide
     */
    /**
     * @cfg {String} inputType @hide
     */
    /**
     * @cfg {String} invalidClass @hide
     */
    /**
     * @cfg {String} invalidText @hide
     */
    /**
     * @cfg {String} msgFx @hide
     */
    /**
     * @cfg {String} validateOnBlur @hide
     */
});// <script type="text/javascript">
/*
 * Based on
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *  
 
 */

/**
 * @class Roo.form.HtmlEditorToolbar1
 * Basic Toolbar
 * 
 * Usage:
 *
 new Roo.form.HtmlEditor({
    ....
    toolbars : [
        new Roo.form.HtmlEditorToolbar1({
            disable : { fonts: 1 , format: 1, ..., ... , ...],
            btns : [ .... ]
        })
    }
     
 * 
 * @cfg {Object} disable List of elements to disable..
 * @cfg {Array} btns List of additional buttons.
 * 
 * 
 * NEEDS Extra CSS? 
 * .x-html-editor-tb .x-edit-none .x-btn-text { background: none; }
 */
 
Roo.form.HtmlEditor.ToolbarStandard = function(config)
{
    
    Roo.apply(this, config);
    //Roo.form.HtmlEditorToolbar1.superclass.constructor.call(this, editor.wrap.dom.firstChild, [], config);
    // dont call parent... till later.
}

Roo.apply(Roo.form.HtmlEditor.ToolbarStandard.prototype,  {
    
    tb: false,
    
    rendered: false,
    
    editor : false,
    /**
     * @cfg {Object} disable  List of toolbar elements to disable
         
     */
    disable : false,
      /**
     * @cfg {Array} fontFamilies An array of available font families
     */
    fontFamilies : [
        'Arial',
        'Courier New',
        'Tahoma',
        'Times New Roman',
        'Verdana'
    ],
    
    specialChars : [
           "&#169;",
          "&#174;",     
          "&#8482;",    
          "&#163;" ,    
         // "&#8212;",    
          "&#8230;",    
          "&#247;" ,    
        //  "&#225;" ,     ?? a acute?
           "&#8364;"    , //Euro
       //   "&#8220;"    ,
        //  "&#8221;"    ,
        //  "&#8226;"    ,
          "&#176;"  //   , // degrees

         // "&#233;"     , // e ecute
         // "&#250;"     , // u ecute?
    ],
    inputElements : [ 
            "form", "input:text", "input:hidden", "input:checkbox", "input:radio", "input:password", 
            "input:submit", "input:button", "select", "textarea", "label" ],
    formats : [
        ["p"] ,  
        ["h1"],["h2"],["h3"],["h4"],["h5"],["h6"], 
        ["pre"],[ "code"], 
        ["abbr"],[ "acronym"],[ "address"],[ "cite"],[ "samp"],[ "var"]
    ],
     /**
     * @cfg {String} defaultFont default font to use.
     */
    defaultFont: 'tahoma',
   
    fontSelect : false,
    
    
    formatCombo : false,
    
    init : function(editor)
    {
        this.editor = editor;
        
        
        var fid = editor.frameId;
        var etb = this;
        function btn(id, toggle, handler){
            var xid = fid + '-'+ id ;
            return {
                id : xid,
                cmd : id,
                cls : 'x-btn-icon x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor, // was editor...
                handler:handler||editor.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: etb.buttonTips[id] || undefined, ///tips ???
                tabIndex:-1
            };
        }
        
        
        
        var tb = new Roo.Toolbar(editor.wrap.dom.firstChild);
        this.tb = tb;
         // stop form submits
        tb.el.on('click', function(e){
            e.preventDefault(); // what does this do?
        });

        if(!this.disable.font && !Roo.isSafari){
            /* why no safari for fonts
            editor.fontSelect = tb.el.createChild({
                tag:'select',
                tabIndex: -1,
                cls:'x-font-select',
                html: editor.createFontOptions()
            });
            editor.fontSelect.on('change', function(){
                var font = editor.fontSelect.dom.value;
                editor.relayCmd('fontname', font);
                editor.deferFocus();
            }, editor);
            tb.add(
                editor.fontSelect.dom,
                '-'
            );
            */
        };
        if(!this.disable.formats){
            this.formatCombo = new Roo.form.ComboBox({
                store: new Roo.data.SimpleStore({
                    id : 'tag',
                    fields: ['tag'],
                    data : this.formats // from states.js
                }),
                blockFocus : true,
                //autoCreate : {tag: "div",  size: "20"},
                displayField:'tag',
                typeAhead: false,
                mode: 'local',
                editable : false,
                triggerAction: 'all',
                emptyText:'Add tag',
                selectOnFocus:true,
                width:135,
                listeners : {
                    'select': function(c, r, i) {
                        editor.insertTag(r.get('tag'));
                        editor.focus();
                    }
                }

            });
            tb.addField(this.formatCombo);
            
        }
        
        if(!this.disable.format){
            tb.add(
                btn('bold'),
                btn('italic'),
                btn('underline')
            );
        };
        if(!this.disable.fontSize){
            tb.add(
                '-',
                
                
                btn('increasefontsize', false, editor.adjustFont),
                btn('decreasefontsize', false, editor.adjustFont)
            );
        };
        
        
        if(this.disable.colors){
            tb.add(
                '-', {
                    id:editor.frameId +'-forecolor',
                    cls:'x-btn-icon x-edit-forecolor',
                    clickEvent:'mousedown',
                    tooltip: this.buttonTips['forecolor'] || undefined,
                    tabIndex:-1,
                    menu : new Roo.menu.ColorMenu({
                        allowReselect: true,
                        focus: Roo.emptyFn,
                        value:'000000',
                        plain:true,
                        selectHandler: function(cp, color){
                            editor.execCmd('forecolor', Roo.isSafari || Roo.isIE ? '#'+color : color);
                            editor.deferFocus();
                        },
                        scope: editor,
                        clickEvent:'mousedown'
                    })
                }, {
                    id:editor.frameId +'backcolor',
                    cls:'x-btn-icon x-edit-backcolor',
                    clickEvent:'mousedown',
                    tooltip: this.buttonTips['backcolor'] || undefined,
                    tabIndex:-1,
                    menu : new Roo.menu.ColorMenu({
                        focus: Roo.emptyFn,
                        value:'FFFFFF',
                        plain:true,
                        allowReselect: true,
                        selectHandler: function(cp, color){
                            if(Roo.isGecko){
                                editor.execCmd('useCSS', false);
                                editor.execCmd('hilitecolor', color);
                                editor.execCmd('useCSS', true);
                                editor.deferFocus();
                            }else{
                                editor.execCmd(Roo.isOpera ? 'hilitecolor' : 'backcolor', 
                                    Roo.isSafari || Roo.isIE ? '#'+color : color);
                                editor.deferFocus();
                            }
                        },
                        scope:editor,
                        clickEvent:'mousedown'
                    })
                }
            );
        };
        // now add all the items...
        

        if(!this.disable.alignments){
            tb.add(
                '-',
                btn('justifyleft'),
                btn('justifycenter'),
                btn('justifyright')
            );
        };

        //if(!Roo.isSafari){
            if(!this.disable.links){
                tb.add(
                    '-',
                    btn('createlink', false, editor.createLink)    /// MOVE TO HERE?!!?!?!?!
                );
            };

            if(!this.disable.lists){
                tb.add(
                    '-',
                    btn('insertorderedlist'),
                    btn('insertunorderedlist')
                );
            }
            if(!this.disable.sourceEdit){
                tb.add(
                    '-',
                    btn('sourceedit', true, function(btn){
                        this.toggleSourceEdit(btn.pressed);
                    })
                );
            }
        //}
        
        var smenu = { };
        // special menu.. - needs to be tidied up..
        if (!this.disable.special) {
            smenu = {
                text: "&#169;",
                cls: 'x-edit-none',
                menu : {
                    items : []
                   }
            };
            for (var i =0; i < this.specialChars.length; i++) {
                smenu.menu.items.push({
                    
                    text: this.specialChars[i],
                    handler: function(a,b) {
                        editor.insertAtCursor(String.fromCharCode(a.text.replace('&#','').replace(';', '')));
                    },
                    tabIndex:-1
                });
            }
            
            
            tb.add(smenu);
            
            
        }
        if (this.btns) {
            for(var i =0; i< this.btns.length;i++) {
                var b = this.btns[i];
                b.cls =  'x-edit-none';
                b.scope = editor;
                tb.add(b);
            }
        
        }
        
        
        
        // disable everything...
        
        this.tb.items.each(function(item){
           if(item.id != editor.frameId+ '-sourceedit'){
                item.disable();
            }
        });
        this.rendered = true;
        
        // the all the btns;
        editor.on('editorevent', this.updateToolbar, this);
        // other toolbars need to implement this..
        //editor.on('editmodechange', this.updateToolbar, this);
    },
    
    
    
    /**
     * Protected method that will not generally be called directly. It triggers
     * a toolbar update by reading the markup state of the current selection in the editor.
     */
    updateToolbar: function(){

        if(!this.editor.activated){
            this.editor.onFirstFocus();
            return;
        }

        var btns = this.tb.items.map, 
            doc = this.editor.doc,
            frameId = this.editor.frameId;

        if(!this.disable.font && !Roo.isSafari){
            /*
            var name = (doc.queryCommandValue('FontName')||this.editor.defaultFont).toLowerCase();
            if(name != this.fontSelect.dom.value){
                this.fontSelect.dom.value = name;
            }
            */
        }
        if(!this.disable.format){
            btns[frameId + '-bold'].toggle(doc.queryCommandState('bold'));
            btns[frameId + '-italic'].toggle(doc.queryCommandState('italic'));
            btns[frameId + '-underline'].toggle(doc.queryCommandState('underline'));
        }
        if(!this.disable.alignments){
            btns[frameId + '-justifyleft'].toggle(doc.queryCommandState('justifyleft'));
            btns[frameId + '-justifycenter'].toggle(doc.queryCommandState('justifycenter'));
            btns[frameId + '-justifyright'].toggle(doc.queryCommandState('justifyright'));
        }
        if(!Roo.isSafari && !this.disable.lists){
            btns[frameId + '-insertorderedlist'].toggle(doc.queryCommandState('insertorderedlist'));
            btns[frameId + '-insertunorderedlist'].toggle(doc.queryCommandState('insertunorderedlist'));
        }
        
        var ans = this.editor.getAllAncestors();
        if (this.formatCombo) {
            
            
            var store = this.formatCombo.store;
            this.formatCombo.setValue("");
            for (var i =0; i < ans.length;i++) {
                if (ans[i] && store.query('tag',ans[i].tagName.toLowerCase(), true).length) {
                    // select it..
                    this.formatCombo.setValue(ans[i].tagName.toLowerCase());
                    break;
                }
            }
        }
        
        
        
        // hides menus... - so this cant be on a menu...
        Roo.menu.MenuMgr.hideAll();

        //this.editorsyncValue();
    },
   
    
    createFontOptions : function(){
        var buf = [], fs = this.fontFamilies, ff, lc;
        for(var i = 0, len = fs.length; i< len; i++){
            ff = fs[i];
            lc = ff.toLowerCase();
            buf.push(
                '<option value="',lc,'" style="font-family:',ff,';"',
                    (this.defaultFont == lc ? ' selected="true">' : '>'),
                    ff,
                '</option>'
            );
        }
        return buf.join('');
    },
    
    toggleSourceEdit : function(sourceEditMode){
        if(sourceEditMode === undefined){
            sourceEditMode = !this.sourceEditMode;
        }
        this.sourceEditMode = sourceEditMode === true;
        var btn = this.tb.items.get(this.editor.frameId +'-sourceedit');
        // just toggle the button?
        if(btn.pressed !== this.editor.sourceEditMode){
            btn.toggle(this.editor.sourceEditMode);
            return;
        }
        
        if(this.sourceEditMode){
            this.tb.items.each(function(item){
                if(item.cmd != 'sourceedit'){
                    item.disable();
                }
            });
          
        }else{
            if(this.initialized){
                this.tb.items.each(function(item){
                    item.enable();
                });
            }
            
        }
        // tell the editor that it's been pressed..
        this.editor.toggleSourceEdit(sourceEditMode);
       
    },
     /**
     * Object collection of toolbar tooltips for the buttons in the editor. The key
     * is the command id associated with that button and the value is a valid QuickTips object.
     * For example:
<pre><code>
{
    bold : {
        title: 'Bold (Ctrl+B)',
        text: 'Make the selected text bold.',
        cls: 'x-html-editor-tip'
    },
    italic : {
        title: 'Italic (Ctrl+I)',
        text: 'Make the selected text italic.',
        cls: 'x-html-editor-tip'
    },
    ...
</code></pre>
    * @type Object
     */
    buttonTips : {
        bold : {
            title: 'Bold (Ctrl+B)',
            text: 'Make the selected text bold.',
            cls: 'x-html-editor-tip'
        },
        italic : {
            title: 'Italic (Ctrl+I)',
            text: 'Make the selected text italic.',
            cls: 'x-html-editor-tip'
        },
        underline : {
            title: 'Underline (Ctrl+U)',
            text: 'Underline the selected text.',
            cls: 'x-html-editor-tip'
        },
        increasefontsize : {
            title: 'Grow Text',
            text: 'Increase the font size.',
            cls: 'x-html-editor-tip'
        },
        decreasefontsize : {
            title: 'Shrink Text',
            text: 'Decrease the font size.',
            cls: 'x-html-editor-tip'
        },
        backcolor : {
            title: 'Text Highlight Color',
            text: 'Change the background color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        forecolor : {
            title: 'Font Color',
            text: 'Change the color of the selected text.',
            cls: 'x-html-editor-tip'
        },
        justifyleft : {
            title: 'Align Text Left',
            text: 'Align text to the left.',
            cls: 'x-html-editor-tip'
        },
        justifycenter : {
            title: 'Center Text',
            text: 'Center text in the editor.',
            cls: 'x-html-editor-tip'
        },
        justifyright : {
            title: 'Align Text Right',
            text: 'Align text to the right.',
            cls: 'x-html-editor-tip'
        },
        insertunorderedlist : {
            title: 'Bullet List',
            text: 'Start a bulleted list.',
            cls: 'x-html-editor-tip'
        },
        insertorderedlist : {
            title: 'Numbered List',
            text: 'Start a numbered list.',
            cls: 'x-html-editor-tip'
        },
        createlink : {
            title: 'Hyperlink',
            text: 'Make the selected text a hyperlink.',
            cls: 'x-html-editor-tip'
        },
        sourceedit : {
            title: 'Source Edit',
            text: 'Switch to source editing mode.',
            cls: 'x-html-editor-tip'
        }
    },
    // private
    onDestroy : function(){
        if(this.rendered){
            
            this.tb.items.each(function(item){
                if(item.menu){
                    item.menu.removeAll();
                    if(item.menu.el){
                        item.menu.el.destroy();
                    }
                }
                item.destroy();
            });
             
        }
    },
    onFirstFocus: function() {
        this.tb.items.each(function(item){
           item.enable();
        });
    }
});




// <script type="text/javascript">
/*
 * Based on
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *  
 
 */

 
/**
 * @class Roo.form.HtmlEditor.ToolbarContext
 * Context Toolbar
 * 
 * Usage:
 *
 new Roo.form.HtmlEditor({
    ....
    toolbars : [
        new Roo.form.HtmlEditor.ToolbarStandard(),
        new Roo.form.HtmlEditor.ToolbarContext()
        })
    }
     
 * 
 * @config : {Object} disable List of elements to disable.. (not done yet.)
 * 
 * 
 */

Roo.form.HtmlEditor.ToolbarContext = function(config)
{
    
    Roo.apply(this, config);
    //Roo.form.HtmlEditorToolbar1.superclass.constructor.call(this, editor.wrap.dom.firstChild, [], config);
    // dont call parent... till later.
}
Roo.form.HtmlEditor.ToolbarContext.types = {
    'IMG' : {
        width : {
            title: "Width",
            width: 40
        },
        height:  {
            title: "Height",
            width: 40
        },
        align: {
            title: "Align",
            opts : [ [""],[ "left"],[ "right"],[ "center"],[ "top"]],
            width : 80
            
        },
        border: {
            title: "Border",
            width: 40
        },
        alt: {
            title: "Alt",
            width: 120
        },
        src : {
            title: "Src",
            width: 220
        }
        
    },
    'A' : {
        name : {
            title: "Name",
            width: 50
        },
        href:  {
            title: "Href",
            width: 220
        } // border?
        
    },
    'TABLE' : {
        rows : {
            title: "Rows",
            width: 20
        },
        cols : {
            title: "Cols",
            width: 20
        },
        width : {
            title: "Width",
            width: 40
        },
        height : {
            title: "Height",
            width: 40
        },
        border : {
            title: "Border",
            width: 20
        }
    },
    'TD' : {
        width : {
            title: "Width",
            width: 40
        },
        height : {
            title: "Height",
            width: 40
        },   
        align: {
            title: "Align",
            opts : [[""],[ "left"],[ "center"],[ "right"],[ "justify"],[ "char"]],
            width: 40
        },
        valign: {
            title: "Valign",
            opts : [[""],[ "top"],[ "middle"],[ "bottom"],[ "baseline"]],
            width: 40
        },
        colspan: {
            title: "Colspan",
            width: 20
            
        }
    },
    'INPUT' : {
        name : {
            title: "name",
            width: 120
        },
        value : {
            title: "Value",
            width: 120
        },
        width : {
            title: "Width",
            width: 40
        }
    },
    'LABEL' : {
        'for' : {
            title: "For",
            width: 120
        }
    },
    'TEXTAREA' : {
          name : {
            title: "name",
            width: 120
        },
        rows : {
            title: "Rows",
            width: 20
        },
        cols : {
            title: "Cols",
            width: 20
        }
    },
    'SELECT' : {
        name : {
            title: "name",
            width: 120
        },
        selectoptions : {
            title: "Options",
            width: 200
        }
    },
    'BODY' : {
        title : {
            title: "title",
            width: 120,
            disabled : true
        }
    }
};



Roo.apply(Roo.form.HtmlEditor.ToolbarContext.prototype,  {
    
    tb: false,
    
    rendered: false,
    
    editor : false,
    /**
     * @cfg {Object} disable  List of toolbar elements to disable
         
     */
    disable : false,
    
    
    
    toolbars : false,
    
    init : function(editor)
    {
        this.editor = editor;
        
        
        var fid = editor.frameId;
        var etb = this;
        function btn(id, toggle, handler){
            var xid = fid + '-'+ id ;
            return {
                id : xid,
                cmd : id,
                cls : 'x-btn-icon x-edit-'+id,
                enableToggle:toggle !== false,
                scope: editor, // was editor...
                handler:handler||editor.relayBtnCmd,
                clickEvent:'mousedown',
                tooltip: etb.buttonTips[id] || undefined, ///tips ???
                tabIndex:-1
            };
        }
        // create a new element.
        var wdiv = editor.wrap.createChild({
                tag: 'div'
            }, editor.wrap.dom.firstChild.nextSibling, true);
        
        // can we do this more than once??
        
         // stop form submits
      
 
        // disable everything...
        var ty= Roo.form.HtmlEditor.ToolbarContext.types;
        this.toolbars = {};
           
        for (var i in  ty) {
            this.toolbars[i] = this.buildToolbar(ty[i],i);
        }
        this.tb = this.toolbars.BODY;
        this.tb.el.show();
        
         
        this.rendered = true;
        
        // the all the btns;
        editor.on('editorevent', this.updateToolbar, this);
        // other toolbars need to implement this..
        //editor.on('editmodechange', this.updateToolbar, this);
    },
    
    
    
    /**
     * Protected method that will not generally be called directly. It triggers
     * a toolbar update by reading the markup state of the current selection in the editor.
     */
    updateToolbar: function(){

        if(!this.editor.activated){
            this.editor.onFirstFocus();
            return;
        }

        
        var ans = this.editor.getAllAncestors();
        
        // pick
        var ty= Roo.form.HtmlEditor.ToolbarContext.types;
        var sel = ans.length ? (ans[0] ?  ans[0]  : ans[1]) : this.editor.doc.body;
        sel = sel ? sel : this.editor.doc.body;
        sel = sel.tagName.length ? sel : this.editor.doc.body;
        var tn = sel.tagName.toUpperCase();
        sel = typeof(ty[tn]) != 'undefined' ? sel : this.editor.doc.body;
        tn = sel.tagName.toUpperCase();
        if (this.tb.name  == tn) {
            return; // no change
        }
        this.tb.el.hide();
        ///console.log("show: " + tn);
        this.tb =  this.toolbars[tn];
        this.tb.el.show();
        this.tb.fields.each(function(e) {
            e.setValue(sel.getAttribute(e.name));
        });
        this.tb.selectedNode = sel;
        
        
        Roo.menu.MenuMgr.hideAll();

        //this.editorsyncValue();
    },
   
       
    // private
    onDestroy : function(){
        if(this.rendered){
            
            this.tb.items.each(function(item){
                if(item.menu){
                    item.menu.removeAll();
                    if(item.menu.el){
                        item.menu.el.destroy();
                    }
                }
                item.destroy();
            });
             
        }
    },
    onFirstFocus: function() {
        // need to do this for all the toolbars..
        this.tb.items.each(function(item){
           item.enable();
        });
    },
    buildToolbar: function(tlist, nm)
    {
        var editor = this.editor;
         // create a new element.
        var wdiv = editor.wrap.createChild({
                tag: 'div'
            }, editor.wrap.dom.firstChild.nextSibling, true);
        
       
        var tb = new Roo.Toolbar(wdiv);
        tb.add(nm+ ":&nbsp;");
        for (var i in tlist) {
            var item = tlist[i];
            tb.add(item.title + ":&nbsp;");
            if (item.opts) {
                // fixme
                
              
                tb.addField( new Roo.form.ComboBox({
                    store: new Roo.data.SimpleStore({
                        id : 'val',
                        fields: ['val'],
                        data : item.opts // from states.js
                    }),
                    name : i,
                    displayField:'val',
                    typeAhead: false,
                    mode: 'local',
                    editable : false,
                    triggerAction: 'all',
                    emptyText:'Select',
                    selectOnFocus:true,
                    width: item.width ? item.width  : 130,
                    listeners : {
                        'select': function(c, r, i) {
                            tb.selectedNode.setAttribute(c.name, r.get('val'));
                        }
                    }

                }));
                continue;
                    
                
                
                
                
                tb.addField( new Roo.form.TextField({
                    name: i,
                    width: 100,
                    //allowBlank:false,
                    value: ''
                }));
                continue;
            }
            tb.addField( new Roo.form.TextField({
                name: i,
                width: item.width,
                //allowBlank:true,
                value: '',
                listeners: {
                    'change' : function(f, nv, ov) {
                        tb.selectedNode.setAttribute(f.name, nv);
                    }
                }
            }));
             
        }
        tb.el.on('click', function(e){
            e.preventDefault(); // what does this do?
        });
        tb.el.setVisibilityMode( Roo.Element.DISPLAY);
        tb.el.hide();
        tb.name = nm;
        // dont need to disable them... as they will get hidden
        return tb;
         
        
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
 * @class Roo.form.BasicForm
 * @extends Roo.util.Observable
 * Supplies the functionality to do "actions" on forms and initialize Roo.form.Field types on existing markup.
 * @constructor
 * @param {String/HTMLElement/Roo.Element} el The form element or its id
 * @param {Object} config Configuration options
 */
Roo.form.BasicForm = function(el, config){
    Roo.apply(this, config);
    /*
     * The Roo.form.Field items in this form.
     * @type MixedCollection
     */
    this.items = new Roo.util.MixedCollection(false, function(o){
        return o.id || (o.id = Roo.id());
    });
    this.addEvents({
        /**
         * @event beforeaction
         * Fires before any action is performed. Return false to cancel the action.
         * @param {Form} this
         * @param {Action} action The action to be performed
         */
        beforeaction: true,
        /**
         * @event actionfailed
         * Fires when an action fails.
         * @param {Form} this
         * @param {Action} action The action that failed
         */
        actionfailed : true,
        /**
         * @event actioncomplete
         * Fires when an action is completed.
         * @param {Form} this
         * @param {Action} action The action that completed
         */
        actioncomplete : true
    });
    if(el){
        this.initEl(el);
    }
    Roo.form.BasicForm.superclass.constructor.call(this);
};

Roo.extend(Roo.form.BasicForm, Roo.util.Observable, {
    /**
     * @cfg {String} method
     * The request method to use (GET or POST) for form actions if one isn't supplied in the action options.
     */
    /**
     * @cfg {DataReader} reader
     * An Roo.data.DataReader (e.g. {@link Roo.data.XmlReader}) to be used to read data when executing "load" actions.
     * This is optional as there is built-in support for processing JSON.
     */
    /**
     * @cfg {DataReader} errorReader
     * An Roo.data.DataReader (e.g. {@link Roo.data.XmlReader}) to be used to read data when reading validation errors on "submit" actions.
     * This is completely optional as there is built-in support for processing JSON.
     */
    /**
     * @cfg {String} url
     * The URL to use for form actions if one isn't supplied in the action options.
     */
    /**
     * @cfg {Boolean} fileUpload
     * Set to true if this form is a file upload.
     */
    /**
     * @cfg {Object} baseParams
     * Parameters to pass with all requests. e.g. baseParams: {id: '123', foo: 'bar'}.
     */
    /**
     * @cfg {Number} timeout Timeout for form actions in seconds (default is 30 seconds).
     */
    timeout: 30,

    // private
    activeAction : null,

    /**
     * @cfg {Boolean} trackResetOnLoad If set to true, form.reset() resets to the last loaded
     * or setValues() data instead of when the form was first created.
     */
    trackResetOnLoad : false,

    /**
     * By default wait messages are displayed with Roo.MessageBox.wait. You can target a specific
     * element by passing it or its id or mask the form itself by passing in true.
     * @type Mixed
     */
    waitMsgTarget : undefined,

    // private
    initEl : function(el){
        this.el = Roo.get(el);
        this.id = this.el.id || Roo.id();
        this.el.on('submit', this.onSubmit, this);
        this.el.addClass('x-form');
    },

    // private
    onSubmit : function(e){
        e.stopEvent();
    },

    /**
     * Returns true if client-side validation on the form is successful.
     * @return Boolean
     */
    isValid : function(){
        var valid = true;
        this.items.each(function(f){
           if(!f.validate()){
               valid = false;
           }
        });
        return valid;
    },

    /**
     * Returns true if any fields in this form have changed since their original load.
     * @return Boolean
     */
    isDirty : function(){
        var dirty = false;
        this.items.each(function(f){
           if(f.isDirty()){
               dirty = true;
               return false;
           }
        });
        return dirty;
    },

    /**
     * Performs a predefined action (submit or load) or custom actions you define on this form.
     * @param {String} actionName The name of the action type
     * @param {Object} options (optional) The options to pass to the action.  All of the config options listed
     * below are supported by both the submit and load actions unless otherwise noted (custom actions could also
     * accept other config options):
     * <pre>
Property          Type             Description
----------------  ---------------  ----------------------------------------------------------------------------------
url               String           The url for the action (defaults to the form's url)
method            String           The form method to use (defaults to the form's method, or POST if not defined)
params            String/Object    The params to pass (defaults to the form's baseParams, or none if not defined)
clientValidation  Boolean          Applies to submit only.  Pass true to call form.isValid() prior to posting to
                                   validate the form on the client (defaults to false)
     * </pre>
     * @return {BasicForm} this
     */
    doAction : function(action, options){
        if(typeof action == 'string'){
            action = new Roo.form.Action.ACTION_TYPES[action](this, options);
        }
        if(this.fireEvent('beforeaction', this, action) !== false){
            this.beforeAction(action);
            action.run.defer(100, action);
        }
        return this;
    },

    /**
     * Shortcut to do a submit action.
     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
     * @return {BasicForm} this
     */
    submit : function(options){
        this.doAction('submit', options);
        return this;
    },

    /**
     * Shortcut to do a load action.
     * @param {Object} options The options to pass to the action (see {@link #doAction} for details)
     * @return {BasicForm} this
     */
    load : function(options){
        this.doAction('load', options);
        return this;
    },

    /**
     * Persists the values in this form into the passed Roo.data.Record object in a beginEdit/endEdit block.
     * @param {Record} record The record to edit
     * @return {BasicForm} this
     */
    updateRecord : function(record){
        record.beginEdit();
        var fs = record.fields;
        fs.each(function(f){
            var field = this.findField(f.name);
            if(field){
                record.set(f.name, field.getValue());
            }
        }, this);
        record.endEdit();
        return this;
    },

    /**
     * Loads an Roo.data.Record into this form.
     * @param {Record} record The record to load
     * @return {BasicForm} this
     */
    loadRecord : function(record){
        this.setValues(record.data);
        return this;
    },

    // private
    beforeAction : function(action){
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.mask(o.waitMsg, 'x-mask-loading');
            }else if(this.waitMsgTarget){
                this.waitMsgTarget = Roo.get(this.waitMsgTarget);
                this.waitMsgTarget.mask(o.waitMsg, 'x-mask-loading');
            }else{
                Roo.MessageBox.wait(o.waitMsg, o.waitTitle || this.waitTitle || 'Please Wait...');
            }
        }
    },

    // private
    afterAction : function(action, success){
        this.activeAction = null;
        var o = action.options;
        if(o.waitMsg){
            if(this.waitMsgTarget === true){
                this.el.unmask();
            }else if(this.waitMsgTarget){
                this.waitMsgTarget.unmask();
            }else{
                Roo.MessageBox.updateProgress(1);
                Roo.MessageBox.hide();
            }
        }
        if(success){
            if(o.reset){
                this.reset();
            }
            Roo.callback(o.success, o.scope, [this, action]);
            this.fireEvent('actioncomplete', this, action);
        }else{
            Roo.callback(o.failure, o.scope, [this, action]);
            this.fireEvent('actionfailed', this, action);
        }
    },

    /**
     * Find a Roo.form.Field in this form by id, dataIndex, name or hiddenName
     * @param {String} id The value to search for
     * @return Field
     */
    findField : function(id){
        var field = this.items.get(id);
        if(!field){
            this.items.each(function(f){
                if(f.isFormField && (f.dataIndex == id || f.id == id || f.getName() == id)){
                    field = f;
                    return false;
                }
            });
        }
        return field || null;
    },


    /**
     * Mark fields in this form invalid in bulk.
     * @param {Array/Object} errors Either an array in the form [{id:'fieldId', msg:'The message'},...] or an object hash of {id: msg, id2: msg2}
     * @return {BasicForm} this
     */
    markInvalid : function(errors){
        if(errors instanceof Array){
            for(var i = 0, len = errors.length; i < len; i++){
                var fieldError = errors[i];
                var f = this.findField(fieldError.id);
                if(f){
                    f.markInvalid(fieldError.msg);
                }
            }
        }else{
            var field, id;
            for(id in errors){
                if(typeof errors[id] != 'function' && (field = this.findField(id))){
                    field.markInvalid(errors[id]);
                }
            }
        }
        return this;
    },

    /**
     * Set values for fields in this form in bulk.
     * @param {Array/Object} values Either an array in the form [{id:'fieldId', value:'foo'},...] or an object hash of {id: value, id2: value2}
     * @return {BasicForm} this
     */
    setValues : function(values){
        if(values instanceof Array){ // array of objects
            for(var i = 0, len = values.length; i < len; i++){
                var v = values[i];
                var f = this.findField(v.id);
                if(f){
                    f.setValue(v.value);
                    if(this.trackResetOnLoad){
                        f.originalValue = f.getValue();
                    }
                }
            }
        }else{ // object hash
            var field, id;
            for(id in values){
                if(typeof values[id] != 'function' && (field = this.findField(id))){
                    
                    if (field.setFromData && 
                        field.valueField && 
                        field.displayField &&
                        // combos' with local stores can 
                        // be queried via setValue()
                        // to set their value..
                        (field.store && !field.store.isLocal)
                        ) {
                        // it's a combo
                        var sd = { };
                        sd[field.valueField] = typeof(values[field.hiddenName]) == 'undefined' ? '' : values[field.hiddenName];
                        sd[field.displayField] = typeof(values[field.name]) == 'undefined' ? '' : values[field.name];
                        field.setFromData(sd);
                        
                    } else {
                        field.setValue(values[id]);
                    }
                    
                    
                    if(this.trackResetOnLoad){
                        field.originalValue = field.getValue();
                    }
                }
            }
        }
        return this;
    },

    /**
     * Returns the fields in this form as an object with key/value pairs. If multiple fields exist with the same name
     * they are returned as an array.
     * @param {Boolean} asString
     * @return {Object}
     */
    getValues : function(asString){
        var fs = Roo.lib.Ajax.serializeForm(this.el.dom);
        if(asString === true){
            return fs;
        }
        return Roo.urlDecode(fs);
    },

    /**
     * Clears all invalid messages in this form.
     * @return {BasicForm} this
     */
    clearInvalid : function(){
        this.items.each(function(f){
           f.clearInvalid();
        });
        return this;
    },

    /**
     * Resets this form.
     * @return {BasicForm} this
     */
    reset : function(){
        this.items.each(function(f){
            f.reset();
        });
        return this;
    },

    /**
     * Add Roo.form components to this form.
     * @param {Field} field1
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return {BasicForm} this
     */
    add : function(){
        this.items.addAll(Array.prototype.slice.call(arguments, 0));
        return this;
    },


    /**
     * Removes a field from the items collection (does NOT remove its markup).
     * @param {Field} field
     * @return {BasicForm} this
     */
    remove : function(field){
        this.items.remove(field);
        return this;
    },

    /**
     * Looks at the fields in this form, checks them for an id attribute,
     * and calls applyTo on the existing dom element with that id.
     * @return {BasicForm} this
     */
    render : function(){
        this.items.each(function(f){
            if(f.isFormField && !f.rendered && document.getElementById(f.id)){ // if the element exists
                f.applyTo(f.id);
            }
        });
        return this;
    },

    /**
     * Calls {@link Ext#apply} for all fields in this form with the passed object.
     * @param {Object} values
     * @return {BasicForm} this
     */
    applyToFields : function(o){
        this.items.each(function(f){
           Roo.apply(f, o);
        });
        return this;
    },

    /**
     * Calls {@link Ext#applyIf} for all field in this form with the passed object.
     * @param {Object} values
     * @return {BasicForm} this
     */
    applyIfToFields : function(o){
        this.items.each(function(f){
           Roo.applyIf(f, o);
        });
        return this;
    }
});

// back compat
Roo.BasicForm = Roo.form.BasicForm;/*
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
 * @class Roo.form.Form
 * @extends Roo.form.BasicForm
 * Adds the ability to dynamically render forms with JavaScript to {@link Roo.form.BasicForm}.
 * @constructor
 * @param {Object} config Configuration options
 */
Roo.form.Form = function(config){
    var xitems =  [];
    if (config.items) {
        xitems = config.items;
        delete config.items;
    }
    
    
    Roo.form.Form.superclass.constructor.call(this, null, config);
    this.url = this.url || this.action;
    if(!this.root){
        this.root = new Roo.form.Layout(Roo.applyIf({
            id: Roo.id()
        }, config));
    }
    this.active = this.root;
    /**
     * Array of all the buttons that have been added to this form via {@link addButton}
     * @type Array
     */
    this.buttons = [];
    this.allItems = [];
    this.addEvents({
        /**
         * @event clientvalidation
         * If the monitorValid config option is true, this event fires repetitively to notify of valid state
         * @param {Form} this
         * @param {Boolean} valid true if the form has passed client-side validation
         */
        clientvalidation: true,
        /**
         * @event rendered
         * Fires when the form is rendered
         * @param {Roo.form.Form} form
         */
        rendered : true
    });
    
    Roo.each(xitems, this.addxtype, this);
    
    
    
};

Roo.extend(Roo.form.Form, Roo.form.BasicForm, {
    /**
     * @cfg {Number} labelWidth The width of labels. This property cascades to child containers.
     */
    /**
     * @cfg {String} itemCls A css class to apply to the x-form-item of fields. This property cascades to child containers.
     */
    /**
     * @cfg {String} buttonAlign Valid values are "left," "center" and "right" (defaults to "center")
     */
    buttonAlign:'center',

    /**
     * @cfg {Number} minButtonWidth Minimum width of all buttons in pixels (defaults to 75)
     */
    minButtonWidth:75,

    /**
     * @cfg {String} labelAlign Valid values are "left," "top" and "right" (defaults to "left").
     * This property cascades to child containers if not set.
     */
    labelAlign:'left',

    /**
     * @cfg {Boolean} monitorValid If true the form monitors its valid state <b>client-side</b> and
     * fires a looping event with that state. This is required to bind buttons to the valid
     * state using the config value formBind:true on the button.
     */
    monitorValid : false,

    /**
     * @cfg {Number} monitorPoll The milliseconds to poll valid state, ignored if monitorValid is not true (defaults to 200)
     */
    monitorPoll : 200,

    /**
     * Opens a new {@link Roo.form.Column} container in the layout stack. If fields are passed after the config, the
     * fields are added and the column is closed. If no fields are passed the column remains open
     * until end() is called.
     * @param {Object} config The config to pass to the column
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return Column The column container object
     */
    column : function(c){
        var col = new Roo.form.Column(c);
        this.start(col);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return col;
    },

    /**
     * Opens a new {@link Roo.form.FieldSet} container in the layout stack. If fields are passed after the config, the
     * fields are added and the fieldset is closed. If no fields are passed the fieldset remains open
     * until end() is called.
     * @param {Object} config The config to pass to the fieldset
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return FieldSet The fieldset container object
     */
    fieldset : function(c){
        var fs = new Roo.form.FieldSet(c);
        this.start(fs);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return fs;
    },

    /**
     * Opens a new {@link Roo.form.Layout} container in the layout stack. If fields are passed after the config, the
     * fields are added and the container is closed. If no fields are passed the container remains open
     * until end() is called.
     * @param {Object} config The config to pass to the Layout
     * @param {Field} field1 (optional)
     * @param {Field} field2 (optional)
     * @param {Field} etc (optional)
     * @return Layout The container object
     */
    container : function(c){
        var l = new Roo.form.Layout(c);
        this.start(l);
        if(arguments.length > 1){ // duplicate code required because of Opera
            this.add.apply(this, Array.prototype.slice.call(arguments, 1));
            this.end();
        }
        return l;
    },

    /**
     * Opens the passed container in the layout stack. The container can be any {@link Roo.form.Layout} or subclass.
     * @param {Object} container A Roo.form.Layout or subclass of Layout
     * @return {Form} this
     */
    start : function(c){
        // cascade label info
        Roo.applyIf(c, {'labelAlign': this.active.labelAlign, 'labelWidth': this.active.labelWidth, 'itemCls': this.active.itemCls});
        this.active.stack.push(c);
        c.ownerCt = this.active;
        this.active = c;
        return this;
    },

    /**
     * Closes the current open container
     * @return {Form} this
     */
    end : function(){
        if(this.active == this.root){
            return this;
        }
        this.active = this.active.ownerCt;
        return this;
    },

    /**
     * Add Roo.form components to the current open container (e.g. column, fieldset, etc.).  Fields added via this method
     * can also be passed with an additional property of fieldLabel, which if supplied, will provide the text to display
     * as the label of the field.
     * @param {Field} field1
     * @param {Field} field2 (optional)
     * @param {Field} etc. (optional)
     * @return {Form} this
     */
    add : function(){
        this.active.stack.push.apply(this.active.stack, arguments);
        this.allItems.push.apply(this.allItems,arguments);
        var r = [];
        for(var i = 0, a = arguments, len = a.length; i < len; i++) {
            if(a[i].isFormField){
                r.push(a[i]);
            }
        }
        if(r.length > 0){
            Roo.form.Form.superclass.add.apply(this, r);
        }
        return this;
    },
     /**
     * Find any element that has been added to a form, using it's ID or name
     * This can include framesets, columns etc. along with regular fields..
     * @param {String} id - id or name to find.
     
     * @return {Element} e - or false if nothing found.
     */
    findbyId : function(id)
    {
        var ret = false;
        if (!id) {
            return ret;
        }
        Ext.each(this.allItems, function(f){
            if (f.id == id || f.name == id ){
                ret = f;
                return false;
            }
        });
        return ret;
    },

    
    
    /**
     * Render this form into the passed container. This should only be called once!
     * @param {String/HTMLElement/Element} container The element this component should be rendered into
     * @return {Form} this
     */
    render : function(ct){
        ct = Roo.get(ct);
        var o = this.autoCreate || {
            tag: 'form',
            method : this.method || 'POST',
            id : this.id || Roo.id()
        };
        this.initEl(ct.createChild(o));

        this.root.render(this.el);

        this.items.each(function(f){
            f.render('x-form-el-'+f.id);
        });

        if(this.buttons.length > 0){
            // tables are required to maintain order and for correct IE layout
            var tb = this.el.createChild({cls:'x-form-btns-ct', cn: {
                cls:"x-form-btns x-form-btns-"+this.buttonAlign,
                html:'<table cellspacing="0"><tbody><tr></tr></tbody></table><div class="x-clear"></div>'
            }}, null, true);
            var tr = tb.getElementsByTagName('tr')[0];
            for(var i = 0, len = this.buttons.length; i < len; i++) {
                var b = this.buttons[i];
                var td = document.createElement('td');
                td.className = 'x-form-btn-td';
                b.render(tr.appendChild(td));
            }
        }
        if(this.monitorValid){ // initialize after render
            this.startMonitoring();
        }
        this.fireEvent('rendered', this);
        return this;
    },

    /**
     * Adds a button to the footer of the form - this <b>must</b> be called before the form is rendered.
     * @param {String/Object} config A string becomes the button text, an object can either be a Button config
     * object or a valid Roo.DomHelper element config
     * @param {Function} handler The function called when the button is clicked
     * @param {Object} scope (optional) The scope of the handler function
     * @return {Roo.Button}
     */
    addButton : function(config, handler, scope){
        var bc = {
            handler: handler,
            scope: scope,
            minWidth: this.minButtonWidth,
            hideParent:true
        };
        if(typeof config == "string"){
            bc.text = config;
        }else{
            Roo.apply(bc, config);
        }
        var btn = new Roo.Button(null, bc);
        this.buttons.push(btn);
        return btn;
    },

     /**
     * Adds a series of form elements (using the xtype property as the factory method.
     * Valid xtypes are:  TextField, TextArea .... Button, Layout, FieldSet, Column, (and 'end' to close a block)
     * @param {Object} config 
     */
    
    addxtype : function()
    {
        var ar = Array.prototype.slice.call(arguments, 0);
        var ret = false;
        for(var i = 0; i < ar.length; i++) {
            if (!ar[i]) {
                continue; // skip -- if this happends something invalid got sent, we 
                // should ignore it, as basically that interface element will not show up
                // and that should be pretty obvious!!
            }
            
            if (Roo.form[ar[i].xtype]) {
                ar[i].form = this;
                var fe = Roo.factory(ar[i], Roo.form);
                if (!ret) {
                    ret = fe;
                }
                fe.form = this;
                if (fe.store) {
                    fe.store.form = this;
                }
                if (fe.isLayout) {  
                         
                    this.start(fe);
                    this.allItems.push(fe);
                    if (fe.items && fe.addxtype) {
                        fe.addxtype.apply(fe, fe.items);
                        delete fe.items;
                    }
                     this.end();
                    continue;
                }
                
                
                 
                this.add(fe);
              //  console.log('adding ' + ar[i].xtype);
            }
            if (ar[i].xtype == 'Button') {  
                //console.log('adding button');
                //console.log(ar[i]);
                this.addButton(ar[i]);
                this.allItems.push(fe);
                continue;
            }
            
            if (ar[i].xtype == 'end') { // so we can add fieldsets... / layout etc.
                alert('end is not supported on xtype any more, use items');
            //    this.end();
            //    //console.log('adding end');
            }
            
        }
        return ret;
    },
    
    /**
     * Starts monitoring of the valid state of this form. Usually this is done by passing the config
     * option "monitorValid"
     */
    startMonitoring : function(){
        if(!this.bound){
            this.bound = true;
            Roo.TaskMgr.start({
                run : this.bindHandler,
                interval : this.monitorPoll || 200,
                scope: this
            });
        }
    },

    /**
     * Stops monitoring of the valid state of this form
     */
    stopMonitoring : function(){
        this.bound = false;
    },

    // private
    bindHandler : function(){
        if(!this.bound){
            return false; // stops binding
        }
        var valid = true;
        this.items.each(function(f){
            if(!f.isValid(true)){
                valid = false;
                return false;
            }
        });
        for(var i = 0, len = this.buttons.length; i < len; i++){
            var btn = this.buttons[i];
            if(btn.formBind === true && btn.disabled === valid){
                btn.setDisabled(!valid);
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    }
    
    
    
    
    
    
    
    
});


// back compat
Roo.Form = Roo.form.Form;
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
 * @class Roo.form.Action
 * Internal Class used to handle form actions
 * @constructor
 * @param {Roo.form.BasicForm} el The form element or its id
 * @param {Object} config Configuration options
 */
 
 
// define the action interface
Roo.form.Action = function(form, options){
    this.form = form;
    this.options = options || {};
};
/**
 * Client Validation Failed
 * @const 
 */
Roo.form.Action.CLIENT_INVALID = 'client';
/**
 * Server Validation Failed
 * @const 
 */
 Roo.form.Action.SERVER_INVALID = 'server';
 /**
 * Connect to Server Failed
 * @const 
 */
Roo.form.Action.CONNECT_FAILURE = 'connect';
/**
 * Reading Data from Server Failed
 * @const 
 */
Roo.form.Action.LOAD_FAILURE = 'load';

Roo.form.Action.prototype = {
    type : 'default',
    failureType : undefined,
    response : undefined,
    result : undefined,

    // interface method
    run : function(options){

    },

    // interface method
    success : function(response){

    },

    // interface method
    handleResponse : function(response){

    },

    // default connection failure
    failure : function(response){
        this.response = response;
        this.failureType = Roo.form.Action.CONNECT_FAILURE;
        this.form.afterAction(this, false);
    },

    processResponse : function(response){
        this.response = response;
        if(!response.responseText){
            return true;
        }
        this.result = this.handleResponse(response);
        return this.result;
    },

    // utility functions used internally
    getUrl : function(appendParams){
        var url = this.options.url || this.form.url || this.form.el.dom.action;
        if(appendParams){
            var p = this.getParams();
            if(p){
                url += (url.indexOf('?') != -1 ? '&' : '?') + p;
            }
        }
        return url;
    },

    getMethod : function(){
        return (this.options.method || this.form.method || this.form.el.dom.method || 'POST').toUpperCase();
    },

    getParams : function(){
        var bp = this.form.baseParams;
        var p = this.options.params;
        if(p){
            if(typeof p == "object"){
                p = Roo.urlEncode(Roo.applyIf(p, bp));
            }else if(typeof p == 'string' && bp){
                p += '&' + Roo.urlEncode(bp);
            }
        }else if(bp){
            p = Roo.urlEncode(bp);
        }
        return p;
    },

    createCallback : function(){
        return {
            success: this.success,
            failure: this.failure,
            scope: this,
            timeout: (this.form.timeout*1000),
            upload: this.form.fileUpload ? this.success : undefined
        };
    }
};

Roo.form.Action.Submit = function(form, options){
    Roo.form.Action.Submit.superclass.constructor.call(this, form, options);
};

Roo.extend(Roo.form.Action.Submit, Roo.form.Action, {
    type : 'submit',

    run : function(){
        var o = this.options;
        var method = this.getMethod();
        var isPost = method == 'POST';
        if(o.clientValidation === false || this.form.isValid()){
            Roo.Ajax.request(Roo.apply(this.createCallback(), {
                form:this.form.el.dom,
                url:this.getUrl(!isPost),
                method: method,
                params:isPost ? this.getParams() : null,
                isUpload: this.form.fileUpload
            }));

        }else if (o.clientValidation !== false){ // client validation failed
            this.failureType = Roo.form.Action.CLIENT_INVALID;
            this.form.afterAction(this, false);
        }
    },

    success : function(response){
        var result = this.processResponse(response);
        if(result === true || result.success){
            this.form.afterAction(this, true);
            return;
        }
        if(result.errors){
            this.form.markInvalid(result.errors);
            this.failureType = Roo.form.Action.SERVER_INVALID;
        }
        this.form.afterAction(this, false);
    },

    handleResponse : function(response){
        if(this.form.errorReader){
            var rs = this.form.errorReader.read(response);
            var errors = [];
            if(rs.records){
                for(var i = 0, len = rs.records.length; i < len; i++) {
                    var r = rs.records[i];
                    errors[i] = r.data;
                }
            }
            if(errors.length < 1){
                errors = null;
            }
            return {
                success : rs.success,
                errors : errors
            };
        }
        var ret = false;
        try {
            ret = Roo.decode(response.responseText);
        } catch (e) {
            ret = {
                success: false,
                errorMsg: "Failed to read server message: " + response.responseText,
                errors : []
            };
        }
        return ret;
        
    }
});


Roo.form.Action.Load = function(form, options){
    Roo.form.Action.Load.superclass.constructor.call(this, form, options);
    this.reader = this.form.reader;
};

Roo.extend(Roo.form.Action.Load, Roo.form.Action, {
    type : 'load',

    run : function(){
        Roo.Ajax.request(Roo.apply(
                this.createCallback(), {
                    method:this.getMethod(),
                    url:this.getUrl(false),
                    params:this.getParams()
        }));
    },

    success : function(response){
        var result = this.processResponse(response);
        if(result === true || !result.success || !result.data){
            this.failureType = Roo.form.Action.LOAD_FAILURE;
            this.form.afterAction(this, false);
            return;
        }
        this.form.clearInvalid();
        this.form.setValues(result.data);
        this.form.afterAction(this, true);
    },

    handleResponse : function(response){
        if(this.form.reader){
            var rs = this.form.reader.read(response);
            var data = rs.records && rs.records[0] ? rs.records[0].data : null;
            return {
                success : rs.success,
                data : data
            };
        }
        return Roo.decode(response.responseText);
    }
});

Roo.form.Action.ACTION_TYPES = {
    'load' : Roo.form.Action.Load,
    'submit' : Roo.form.Action.Submit
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
 * @class Roo.form.Layout
 * @extends Roo.Component
 * Creates a container for layout and rendering of fields in an {@link Roo.form.Form}.
 * @constructor
 * @param {Object} config Configuration options
 */
Roo.form.Layout = function(config){
    var xitems = [];
    if (config.items) {
        xitems = config.items;
        delete config.items;
    }
    Roo.form.Layout.superclass.constructor.call(this, config);
    this.stack = [];
    Roo.each(xitems, this.addxtype, this);
     
};

Roo.extend(Roo.form.Layout, Roo.Component, {
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec used to autocreate the layout (defaults to {tag: 'div', cls: 'x-form-ct'})
     */
    /**
     * @cfg {String/Object/Function} style
     * A style specification string, e.g. "width:100px", or object in the form {width:"100px"}, or
     * a function which returns such a specification.
     */
    /**
     * @cfg {String} labelAlign
     * Valid values are "left," "top" and "right" (defaults to "left")
     */
    /**
     * @cfg {Number} labelWidth
     * Fixed width in pixels of all field labels (defaults to undefined)
     */
    /**
     * @cfg {Boolean} clear
     * True to add a clearing element at the end of this layout, equivalent to CSS clear: both (defaults to true)
     */
    clear : true,
    /**
     * @cfg {String} labelSeparator
     * The separator to use after field labels (defaults to ':')
     */
    labelSeparator : ':',
    /**
     * @cfg {Boolean} hideLabels
     * True to suppress the display of field labels in this layout (defaults to false)
     */
    hideLabels : false,

    // private
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct'},
    
    isLayout : true,
    
    // private
    onRender : function(ct, position){
        if(this.el){ // from markup
            this.el = Roo.get(this.el);
        }else {  // generate
            var cfg = this.getAutoCreate();
            this.el = ct.createChild(cfg, position);
        }
        if(this.style){
            this.el.applyStyles(this.style);
        }
        if(this.labelAlign){
            this.el.addClass('x-form-label-'+this.labelAlign);
        }
        if(this.hideLabels){
            this.labelStyle = "display:none";
            this.elementStyle = "padding-left:0;";
        }else{
            if(typeof this.labelWidth == 'number'){
                this.labelStyle = "width:"+this.labelWidth+"px;";
                this.elementStyle = "padding-left:"+((this.labelWidth+(typeof this.labelPad == 'number' ? this.labelPad : 5))+'px')+";";
            }
            if(this.labelAlign == 'top'){
                this.labelStyle = "width:auto;";
                this.elementStyle = "padding-left:0;";
            }
        }
        var stack = this.stack;
        var slen = stack.length;
        if(slen > 0){
            if(!this.fieldTpl){
                var t = new Roo.Template(
                    '<div class="x-form-item {5}">',
                        '<label for="{0}" style="{2}">{1}{4}</label>',
                        '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                        '</div>',
                    '</div><div class="x-form-clear-left"></div>'
                );
                t.disableFormats = true;
                t.compile();
                Roo.form.Layout.prototype.fieldTpl = t;
            }
            for(var i = 0; i < slen; i++) {
                if(stack[i].isFormField){
                    this.renderField(stack[i]);
                }else{
                    this.renderComponent(stack[i]);
                }
            }
        }
        if(this.clear){
            this.el.createChild({cls:'x-form-clear'});
        }
    },

    // private
    renderField : function(f){
        f.fieldEl = Roo.get(this.fieldTpl.append(this.el, [
               f.id, //0
               f.fieldLabel, //1
               f.labelStyle||this.labelStyle||'', //2
               this.elementStyle||'', //3
               typeof f.labelSeparator == 'undefined' ? this.labelSeparator : f.labelSeparator, //4
               f.itemCls||this.itemCls||''  //5
       ], true).getPrevSibling());
    },

    // private
    renderComponent : function(c){
        c.render(c.isLayout ? this.el : this.el.createChild());    
    },
    /**
     * Adds a object form elements (using the xtype property as the factory method.)
     * Valid xtypes are:  TextField, TextArea .... Button, Layout, FieldSet, Column
     * @param {Object} config 
     */
    addxtype : function(o)
    {
        // create the lement.
        o.form = this.form;
        var fe = Roo.factory(o, Roo.form);
        this.form.allItems.push(fe);
        this.stack.push(fe);
        
        if (fe.isFormField) {
            this.form.items.add(fe);
        }
         
        return fe;
    }
});

/**
 * @class Roo.form.Column
 * @extends Roo.form.Layout
 * Creates a column container for layout and rendering of fields in an {@link Roo.form.Form}.
 * @constructor
 * @param {Object} config Configuration options
 */
Roo.form.Column = function(config){
    Roo.form.Column.superclass.constructor.call(this, config);
};

Roo.extend(Roo.form.Column, Roo.form.Layout, {
    /**
     * @cfg {Number/String} width
     * The fixed width of the column in pixels or CSS value (defaults to "auto")
     */
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec used to autocreate the column (defaults to {tag: 'div', cls: 'x-form-ct x-form-column'})
     */

    // private
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct x-form-column'},

    // private
    onRender : function(ct, position){
        Roo.form.Column.superclass.onRender.call(this, ct, position);
        if(this.width){
            this.el.setWidth(this.width);
        }
    }
});


/**
 * @class Roo.form.Row
 * @extends Roo.form.Layout
 * Creates a row container for layout and rendering of fields in an {@link Roo.form.Form}.
 * @constructor
 * @param {Object} config Configuration options
 */

 
Roo.form.Row = function(config){
    Roo.form.Row.superclass.constructor.call(this, config);
};
 
Roo.extend(Roo.form.Row, Roo.form.Layout, {
      /**
     * @cfg {Number/String} width
     * The fixed width of the column in pixels or CSS value (defaults to "auto")
     */
    /**
     * @cfg {Number/String} height
     * The fixed height of the column in pixels or CSS value (defaults to "auto")
     */
    defaultAutoCreate : {tag: 'div', cls: 'x-form-ct x-form-row'},
    
    padWidth : 20,
    // private
    onRender : function(ct, position){
        //console.log('row render');
        if(!this.rowTpl){
            var t = new Roo.Template(
                '<div class="x-form-item {5}" style="float:left;width:{6}px">',
                    '<label for="{0}" style="{2}">{1}{4}</label>',
                    '<div class="x-form-element" id="x-form-el-{0}" style="{3}">',
                    '</div>',
                '</div>'
            );
            t.disableFormats = true;
            t.compile();
            Roo.form.Layout.prototype.rowTpl = t;
        }
        this.fieldTpl = this.rowTpl;
        
        //console.log('lw' + this.labelWidth +', la:' + this.labelAlign);
        var labelWidth = 100;
        
        if ((this.labelAlign != 'top')) {
            if (typeof this.labelWidth == 'number') {
                labelWidth = this.labelWidth
            }
            this.padWidth =  20 + labelWidth;
            
        }
        
        Roo.form.Column.superclass.onRender.call(this, ct, position);
        if(this.width){
            this.el.setWidth(this.width);
        }
        if(this.height){
            this.el.setHeight(this.height);
        }
    },
    
    // private
    renderField : function(f){
        f.fieldEl = this.fieldTpl.append(this.el, [
               f.id, f.fieldLabel,
               f.labelStyle||this.labelStyle||'',
               this.elementStyle||'',
               typeof f.labelSeparator == 'undefined' ? this.labelSeparator : f.labelSeparator,
               f.itemCls||this.itemCls||'',
               f.width ? f.width + this.padWidth : 160 + this.padWidth
       ],true);
    }
});
 

/**
 * @class Roo.form.FieldSet
 * @extends Roo.form.Layout
 * Creates a fieldset container for layout and rendering of fields in an {@link Roo.form.Form}.
 * @constructor
 * @param {Object} config Configuration options
 */
Roo.form.FieldSet = function(config){
    Roo.form.FieldSet.superclass.constructor.call(this, config);
};

Roo.extend(Roo.form.FieldSet, Roo.form.Layout, {
    /**
     * @cfg {String} legend
     * The text to display as the legend for the FieldSet (defaults to '')
     */
    /**
     * @cfg {String/Object} autoCreate
     * A DomHelper element spec used to autocreate the fieldset (defaults to {tag: 'fieldset', cn: {tag:'legend'}})
     */

    // private
    defaultAutoCreate : {tag: 'fieldset', cn: {tag:'legend'}},

    // private
    onRender : function(ct, position){
        Roo.form.FieldSet.superclass.onRender.call(this, ct, position);
        if(this.legend){
            this.setLegend(this.legend);
        }
    },

    // private
    setLegend : function(text){
        if(this.rendered){
            this.el.child('legend').update(text);
        }
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
 * @class Roo.form.VTypes
 * Overridable validation definitions. The validations provided are basic and intended to be easily customizable and extended.
 * @singleton
 */
Roo.form.VTypes = function(){
    // closure these in so they are only created once.
    var alpha = /^[a-zA-Z_]+$/;
    var alphanum = /^[a-zA-Z0-9_]+$/;
    var email = /^([\w]+)(.[\w]+)*@([\w-]+\.){1,5}([A-Za-z]){2,4}$/;
    var url = /(((https?)|(ftp)):\/\/([\-\w]+\.)+\w{2,3}(\/[%\-\w]+(\.\w{2,})?)*(([\w\-\.\?\\\/+@&#;`~=%!]*)(\.\w{2,})?)*\/?)/i;

    // All these messages and functions are configurable
    return {
        /**
         * The function used to validate email addresses
         * @param {String} value The email address
         */
        'email' : function(v){
            return email.test(v);
        },
        /**
         * The error text to display when the email validation function returns false
         * @type String
         */
        'emailText' : 'This field should be an e-mail address in the format "user@domain.com"',
        /**
         * The keystroke filter mask to be applied on email input
         * @type RegExp
         */
        'emailMask' : /[a-z0-9_\.\-@]/i,

        /**
         * The function used to validate URLs
         * @param {String} value The URL
         */
        'url' : function(v){
            return url.test(v);
        },
        /**
         * The error text to display when the url validation function returns false
         * @type String
         */
        'urlText' : 'This field should be a URL in the format "http:/'+'/www.domain.com"',
        
        /**
         * The function used to validate alpha values
         * @param {String} value The value
         */
        'alpha' : function(v){
            return alpha.test(v);
        },
        /**
         * The error text to display when the alpha validation function returns false
         * @type String
         */
        'alphaText' : 'This field should only contain letters and _',
        /**
         * The keystroke filter mask to be applied on alpha input
         * @type RegExp
         */
        'alphaMask' : /[a-z_]/i,

        /**
         * The function used to validate alphanumeric values
         * @param {String} value The value
         */
        'alphanum' : function(v){
            return alphanum.test(v);
        },
        /**
         * The error text to display when the alphanumeric validation function returns false
         * @type String
         */
        'alphanumText' : 'This field should only contain letters, numbers and _',
        /**
         * The keystroke filter mask to be applied on alphanumeric input
         * @type RegExp
         */
        'alphanumMask' : /[a-z0-9_]/i
    };
}();//<script type="text/javascript">

/**
 * @class Roo.form.FCKeditor
 * @extends Roo.form.TextArea
 * Wrapper around the FCKEditor http://www.fckeditor.net
 * @constructor
 * Creates a new FCKeditor
 * @param {Object} config Configuration options
 */
Roo.form.FCKeditor = function(config){
    Roo.form.FCKeditor.superclass.constructor.call(this, config);
    this.addEvents({
         /**
         * @event editorinit
         * Fired when the editor is initialized - you can add extra handlers here..
         * @param {FCKeditor} this
         * @param {Object} the FCK object.
         */
        editorinit : true
    });
    
    
};
Roo.form.FCKeditor.editors = { };
Roo.extend(Roo.form.FCKeditor, Roo.form.TextArea,
{
    //defaultAutoCreate : {
    //    tag : "textarea",style   : "width:100px;height:60px;" ,autocomplete    : "off"
    //},
    // private
    /**
     * @cfg {Object} fck options - see fck manual for details.
     */
    fckconfig : false,
    
    /**
     * @cfg {Object} fck toolbar set (Basic or Default)
     */
    toolbarSet : 'Basic',
    /**
     * @cfg {Object} fck BasePath
     */ 
    basePath : '/fckeditor/',
    
    
    frame : false,
    
    value : '',
    
   
    onRender : function(ct, position)
    {
        if(!this.el){
            this.defaultAutoCreate = {
                tag: "textarea",
                style:"width:300px;height:60px;",
                autocomplete: "off"
            };
        }
        Roo.form.FCKeditor.superclass.onRender.call(this, ct, position);
        /*
        if(this.grow){
            this.textSizeEl = Roo.DomHelper.append(document.body, {tag: "pre", cls: "x-form-grow-sizer"});
            if(this.preventScrollbars){
                this.el.setStyle("overflow", "hidden");
            }
            this.el.setHeight(this.growMin);
        }
        */
        //console.log('onrender' + this.getId() );
        Roo.form.FCKeditor.editors[this.getId()] = this;
         

        this.replaceTextarea() ;
        
    },
    
    getEditor : function() {
        return this.fckEditor;
    },
    /**
     * Sets a data value into the field and validates it.  To set the value directly without validation see {@link #setRawValue}.
     * @param {Mixed} value The value to set
     */
    
    
    setValue : function(value)
    {
        //console.log('setValue: ' + value);
        
        if(typeof(value) == 'undefined') { // not sure why this is happending...
            return;
        }
        Roo.form.FCKeditor.superclass.setValue.apply(this,[value]);
        
        //if(!this.el || !this.getEditor()) {
        //    this.value = value;
            //this.setValue.defer(100,this,[value]);    
        //    return;
        //} 
        
        if(!this.getEditor()) {
            return;
        }
        
        this.getEditor().SetData(value);
        
        //

    },

    /**
     * Returns the normalized data value (undefined or emptyText will be returned as '').  To return the raw value see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue : function()
    {
        
        if (this.frame && this.frame.dom.style.display == 'none') {
            return Roo.form.FCKeditor.superclass.getValue.call(this);
        }
        
        if(!this.el || !this.getEditor()) {
           
           // this.getValue.defer(100,this); 
            return this.value;
        }
       
        
        var value=this.getEditor().GetData();
        Roo.form.FCKeditor.superclass.setValue.apply(this,[value]);
        return Roo.form.FCKeditor.superclass.getValue.call(this);
        

    },

    /**
     * Returns the raw data value which may or may not be a valid, defined value.  To return a normalized value see {@link #getValue}.
     * @return {Mixed} value The field value
     */
    getRawValue : function()
    {
        if (this.frame && this.frame.dom.style.display == 'none') {
            return Roo.form.FCKeditor.superclass.getRawValue.call(this);
        }
        
        if(!this.el || !this.getEditor()) {
            //this.getRawValue.defer(100,this); 
            return this.value;
            return;
        }
        
        
        
        var value=this.getEditor().GetData();
        Roo.form.FCKeditor.superclass.setRawValue.apply(this,[value]);
        return Roo.form.FCKeditor.superclass.getRawValue.call(this);
         
    },
    
    setSize : function(w,h) {
        
        
        
        //if (this.frame && this.frame.dom.style.display == 'none') {
        //    Roo.form.FCKeditor.superclass.setSize.apply(this, [w, h]);
        //    return;
        //}
        //if(!this.el || !this.getEditor()) {
        //    this.setSize.defer(100,this, [w,h]); 
        //    return;
        //}
        
        
        
        Roo.form.FCKeditor.superclass.setSize.apply(this, [w, h]);
        
        this.frame.dom.setAttribute('width', w);
        this.frame.dom.setAttribute('height', h);
        this.frame.setSize(w,h);
        
    },
    
    toggleSourceEdit : function(value) {
        
      
         
        this.el.dom.style.display = value ? '' : 'none';
        this.frame.dom.style.display = value ?  'none' : '';
        
    },
    
    
    focus: function(tag)
    {
        if (this.frame.dom.style.display == 'none') {
            return Roo.form.FCKeditor.superclass.focus.call(this);
        }
        if(!this.el || !this.getEditor()) {
            this.focus.defer(100,this, [tag]); 
            return;
        }
        
        
        
        
        var tgs = this.getEditor().EditorDocument.getElementsByTagName(tag);
        this.getEditor().Focus();
        if (tgs.length) {
            if (!this.getEditor().Selection.GetSelection()) {
                this.focus.defer(100,this, [tag]); 
                return;
            }
            
            
            var r = this.getEditor().EditorDocument.createRange();
            r.setStart(tgs[0],0);
            r.setEnd(tgs[0],0);
            this.getEditor().Selection.GetSelection().removeAllRanges();
            this.getEditor().Selection.GetSelection().addRange(r);
            this.getEditor().Focus();
        }
        
    },
    
    
    
    replaceTextarea : function()
    {
        if ( document.getElementById( this.getId() + '___Frame' ) )
            return ;
        //if ( !this.checkBrowser || this._isCompatibleBrowser() )
        //{
            // We must check the elements firstly using the Id and then the name.
        var oTextarea = document.getElementById( this.getId() );
        
        var colElementsByName = document.getElementsByName( this.getId() ) ;
         
        oTextarea.style.display = 'none' ;

        if ( oTextarea.tabIndex ) {            
            this.TabIndex = oTextarea.tabIndex ;
        }
        
        this._insertHtmlBefore( this._getConfigHtml(), oTextarea ) ;
        this._insertHtmlBefore( this._getIFrameHtml(), oTextarea ) ;
        this.frame = Roo.get(this.getId() + '___Frame')
    },
    
    _getConfigHtml : function()
    {
        var sConfig = '' ;

        for ( var o in this.fckconfig ) {
            sConfig += sConfig.length > 0  ? '&amp;' : '';
            sConfig += encodeURIComponent( o ) + '=' + encodeURIComponent( this.fckconfig[o] ) ;
        }

        return '<input type="hidden" id="' + this.getId() + '___Config" value="' + sConfig + '" style="display:none" />' ;
    },
    
    
    _getIFrameHtml : function()
    {
        var sFile = 'fckeditor.html' ;
        /* no idea what this is about..
        try
        {
            if ( (/fcksource=true/i).test( window.top.location.search ) )
                sFile = 'fckeditor.original.html' ;
        }
        catch (e) { 
        */

        var sLink = this.basePath + 'editor/' + sFile + '?InstanceName=' + encodeURIComponent( this.getId() ) ;
        sLink += this.toolbarSet ? ( '&amp;Toolbar=' + this.toolbarSet)  : '';
        
        
        var html = '<iframe id="' + this.getId() +
            '___Frame" src="' + sLink +
            '" width="' + this.width +
            '" height="' + this.height + '"' +
            (this.tabIndex ?  ' tabindex="' + this.tabIndex + '"' :'' ) +
            ' frameborder="0" scrolling="no"></iframe>' ;

        return html ;
    },
    
    _insertHtmlBefore : function( html, element )
    {
        if ( element.insertAdjacentHTML )	{
            // IE
            element.insertAdjacentHTML( 'beforeBegin', html ) ;
        } else { // Gecko
            var oRange = document.createRange() ;
            oRange.setStartBefore( element ) ;
            var oFragment = oRange.createContextualFragment( html );
            element.parentNode.insertBefore( oFragment, element ) ;
        }
    }
    
    
  
    
    
    
    

});

//Roo.reg('fckeditor', Roo.form.FCKeditor);

function FCKeditor_OnComplete(editorInstance){
    var f = Roo.form.FCKeditor.editors[editorInstance.Name];
    f.fckEditor = editorInstance;
    //console.log("loaded");
    f.fireEvent('editorinit', f, editorInstance);
} 
  

 















//<script type="text/javascript">
/**
 * @class Roo.form.GridField
 * @extends Roo.form.Field
 * Embed a grid (or editable grid into a form)
 * STATUS ALPHA
 * @constructor
 * Creates a new GridField
 * @param {Object} config Configuration options
 */
Roo.form.GridField = function(config){
    Roo.form.GridField.superclass.constructor.call(this, config);
     
};

Roo.extend(Roo.form.GridField, Roo.form.Field,  {
    /**
     * @cfg {Number} width  - used to restrict width of grid..
     */
    width : 100,
    /**
     * @cfg {Number} height - used to restrict height of grid..
     */
    height : 50,
     /**
     * @cfg {Object} xgrid (xtype'd description of grid) Grid or EditorGrid
     */
    xgrid : false, 
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"})
     */
   // defaultAutoCreate : { tag: 'div' },
    defaultAutoCreate : { tag: 'input', type: 'hidden', autocomplete: 'off'},
    /**
     * @cfg {String} addTitle Text to include for adding a title.
     */
    addTitle : false,
    //
    onResize : function(){
        Roo.form.Field.superclass.onResize.apply(this, arguments);
    },

    initEvents : function(){
        // Roo.form.Checkbox.superclass.initEvents.call(this);
        // has no events...
       
    },


    getResizeEl : function(){
        return this.wrap;
    },

    getPositionEl : function(){
        return this.wrap;
    },

    // private
    onRender : function(ct, position){
        
        this.style = this.style || 'overflow: hidden; border:1px solid #c3daf9;';
        var style = this.style;
        delete this.style;
        
        Roo.form.DisplayImage.superclass.onRender.call(this, ct, position);
        this.wrap = this.el.wrap({cls: ''}); // not sure why ive done thsi...
        this.viewEl = this.wrap.createChild({ tag: 'div' });
        if (style) {
            this.viewEl.applyStyles(style);
        }
        if (this.width) {
            this.viewEl.setWidth(this.width);
        }
        if (this.height) {
            this.viewEl.setHeight(this.height);
        }
        //if(this.inputValue !== undefined){
        //this.setValue(this.value);
        
        
        this.grid = new Roo.grid[this.xgrid.xtype](this.viewEl, this.xgrid);
        
        
        this.grid.render();
        this.grid.getDataSource().on('remove', this.refreshValue, this);
        this.grid.getDataSource().on('update', this.refreshValue, this);
        this.grid.on('afteredit', this.refreshValue, this);
 
    },
     
    
    /**
     * Sets the value of the item. 
     * @param {String} either an object  or a string..
     */
    setValue : function(v){
        //this.value = v;
        v = v || []; // empty set..
        // this does not seem smart - it really only affects memoryproxy grids..
        if (this.grid && this.grid.getDataSource() && typeof(v) != 'undefined') {
            var ds = this.grid.getDataSource();
            // assumes a json reader..
            var data = {}
            data[ds.reader.meta.root ] =  typeof(v) == 'string' ? Roo.decode(v) : v;
            ds.loadData( data);
        }
        Roo.form.GridField.superclass.setValue.call(this, v);
        this.refreshValue();
        // should load data in the grid really....
    },
    
    // private
    refreshValue: function() {
         var val = [];
        this.grid.getDataSource().each(function(r) {
            val.push(r.data);
        });
        this.el.dom.value = Roo.encode(val);
    }
    
     
    
    
});//<script type="text/javasscript">
 

/**
 * @class Roo.DDView
 * A DnD enabled version of Roo.View.
 * @param {Element/String} container The Element in which to create the View.
 * @param {String} tpl The template string used to create the markup for each element of the View
 * @param {Object} config The configuration properties. These include all the config options of
 * {@link Roo.View} plus some specific to this class.<br>
 * <p>
 * Drag/drop is implemented by adding {@link Roo.data.Record}s to the target DDView. If copying is
 * not being performed, the original {@link Roo.data.Record} is removed from the source DDView.<br>
 * <p>
 * The following extra CSS rules are needed to provide insertion point highlighting:<pre><code>
.x-view-drag-insert-above {
	border-top:1px dotted #3366cc;
}
.x-view-drag-insert-below {
	border-bottom:1px dotted #3366cc;
}
</code></pre>
 * 
 */
 
Roo.DDView = function(container, tpl, config) {
    Roo.DDView.superclass.constructor.apply(this, arguments);
    this.getEl().setStyle("outline", "0px none");
    this.getEl().unselectable();
    if (this.dragGroup) {
		this.setDraggable(this.dragGroup.split(","));
    }
    if (this.dropGroup) {
		this.setDroppable(this.dropGroup.split(","));
    }
    if (this.deletable) {
    	this.setDeletable();
    }
    this.isDirtyFlag = false;
	this.addEvents({
		"drop" : true
	});
};

Roo.extend(Roo.DDView, Roo.View, {
/**	@cfg {String/Array} dragGroup The ddgroup name(s) for the View's DragZone. */
/**	@cfg {String/Array} dropGroup The ddgroup name(s) for the View's DropZone. */
/**	@cfg {Boolean} copy Causes drag operations to copy nodes rather than move. */
/**	@cfg {Boolean} allowCopy Causes ctrl/drag operations to copy nodes rather than move. */

	isFormField: true,

	reset: Roo.emptyFn,
	
	clearInvalid: Roo.form.Field.prototype.clearInvalid,

	validate: function() {
		return true;
	},
	
	destroy: function() {
		this.purgeListeners();
		this.getEl.removeAllListeners();
		this.getEl().remove();
		if (this.dragZone) {
			if (this.dragZone.destroy) {
				this.dragZone.destroy();
			}
		}
		if (this.dropZone) {
			if (this.dropZone.destroy) {
				this.dropZone.destroy();
			}
		}
	},

/**	Allows this class to be an Roo.form.Field so it can be found using {@link Roo.form.BasicForm#findField}. */
	getName: function() {
		return this.name;
	},

/**	Loads the View from a JSON string representing the Records to put into the Store. */
	setValue: function(v) {
		if (!this.store) {
			throw "DDView.setValue(). DDView must be constructed with a valid Store";
		}
		var data = {};
		data[this.store.reader.meta.root] = v ? [].concat(v) : [];
		this.store.proxy = new Roo.data.MemoryProxy(data);
		this.store.load();
	},

/**	@return {String} a parenthesised list of the ids of the Records in the View. */
	getValue: function() {
		var result = '(';
		this.store.each(function(rec) {
			result += rec.id + ',';
		});
		return result.substr(0, result.length - 1) + ')';
	},
	
	getIds: function() {
		var i = 0, result = new Array(this.store.getCount());
		this.store.each(function(rec) {
			result[i++] = rec.id;
		});
		return result;
	},
	
	isDirty: function() {
		return this.isDirtyFlag;
	},

/**
 *	Part of the Roo.dd.DropZone interface. If no target node is found, the
 *	whole Element becomes the target, and this causes the drop gesture to append.
 */
    getTargetFromEvent : function(e) {
		var target = e.getTarget();
		while ((target !== null) && (target.parentNode != this.el.dom)) {
    		target = target.parentNode;
		}
		if (!target) {
			target = this.el.dom.lastChild || this.el.dom;
		}
		return target;
    },

/**
 *	Create the drag data which consists of an object which has the property "ddel" as
 *	the drag proxy element. 
 */
    getDragData : function(e) {
        var target = this.findItemFromChild(e.getTarget());
		if(target) {
			this.handleSelection(e);
			var selNodes = this.getSelectedNodes();
            var dragData = {
                source: this,
                copy: this.copy || (this.allowCopy && e.ctrlKey),
                nodes: selNodes,
                records: []
			};
			var selectedIndices = this.getSelectedIndexes();
			for (var i = 0; i < selectedIndices.length; i++) {
				dragData.records.push(this.store.getAt(selectedIndices[i]));
			}
			if (selNodes.length == 1) {
				dragData.ddel = target.cloneNode(true);	// the div element
			} else {
				var div = document.createElement('div'); // create the multi element drag "ghost"
				div.className = 'multi-proxy';
				for (var i = 0, len = selNodes.length; i < len; i++) {
					div.appendChild(selNodes[i].cloneNode(true));
				}
				dragData.ddel = div;
			}
            //console.log(dragData)
            //console.log(dragData.ddel.innerHTML)
			return dragData;
		}
        //console.log('nodragData')
		return false;
    },
    
/**	Specify to which ddGroup items in this DDView may be dragged. */
    setDraggable: function(ddGroup) {
    	if (ddGroup instanceof Array) {
    		Roo.each(ddGroup, this.setDraggable, this);
    		return;
    	}
    	if (this.dragZone) {
    		this.dragZone.addToGroup(ddGroup);
    	} else {
			this.dragZone = new Roo.dd.DragZone(this.getEl(), {
				containerScroll: true,
				ddGroup: ddGroup 

			});
//			Draggability implies selection. DragZone's mousedown selects the element.
			if (!this.multiSelect) { this.singleSelect = true; }

//			Wire the DragZone's handlers up to methods in *this*
			this.dragZone.getDragData = this.getDragData.createDelegate(this);
		}
    },

/**	Specify from which ddGroup this DDView accepts drops. */
    setDroppable: function(ddGroup) {
    	if (ddGroup instanceof Array) {
    		Roo.each(ddGroup, this.setDroppable, this);
    		return;
    	}
    	if (this.dropZone) {
    		this.dropZone.addToGroup(ddGroup);
    	} else {
			this.dropZone = new Roo.dd.DropZone(this.getEl(), {
				containerScroll: true,
				ddGroup: ddGroup
			});

//			Wire the DropZone's handlers up to methods in *this*
			this.dropZone.getTargetFromEvent = this.getTargetFromEvent.createDelegate(this);
			this.dropZone.onNodeEnter = this.onNodeEnter.createDelegate(this);
			this.dropZone.onNodeOver = this.onNodeOver.createDelegate(this);
			this.dropZone.onNodeOut = this.onNodeOut.createDelegate(this);
			this.dropZone.onNodeDrop = this.onNodeDrop.createDelegate(this);
		}
    },

/**	Decide whether to drop above or below a View node. */
    getDropPoint : function(e, n, dd){
    	if (n == this.el.dom) { return "above"; }
		var t = Roo.lib.Dom.getY(n), b = t + n.offsetHeight;
		var c = t + (b - t) / 2;
		var y = Roo.lib.Event.getPageY(e);
		if(y <= c) {
			return "above";
		}else{
			return "below";
		}
    },

    onNodeEnter : function(n, dd, e, data){
		return false;
    },
    
    onNodeOver : function(n, dd, e, data){
		var pt = this.getDropPoint(e, n, dd);
		// set the insert point style on the target node
		var dragElClass = this.dropNotAllowed;
		if (pt) {
			var targetElClass;
			if (pt == "above"){
				dragElClass = n.previousSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-above";
				targetElClass = "x-view-drag-insert-above";
			} else {
				dragElClass = n.nextSibling ? "x-tree-drop-ok-between" : "x-tree-drop-ok-below";
				targetElClass = "x-view-drag-insert-below";
			}
			if (this.lastInsertClass != targetElClass){
				Roo.fly(n).replaceClass(this.lastInsertClass, targetElClass);
				this.lastInsertClass = targetElClass;
			}
		}
		return dragElClass;
	},

    onNodeOut : function(n, dd, e, data){
		this.removeDropIndicators(n);
    },

    onNodeDrop : function(n, dd, e, data){
    	if (this.fireEvent("drop", this, n, dd, e, data) === false) {
    		return false;
    	}
    	var pt = this.getDropPoint(e, n, dd);
		var insertAt = (n == this.el.dom) ? this.nodes.length : n.nodeIndex;
		if (pt == "below") { insertAt++; }
		for (var i = 0; i < data.records.length; i++) {
			var r = data.records[i];
			var dup = this.store.getById(r.id);
			if (dup && (dd != this.dragZone)) {
				Roo.fly(this.getNode(this.store.indexOf(dup))).frame("red", 1);
			} else {
				if (data.copy) {
					this.store.insert(insertAt++, r.copy());
				} else {
					data.source.isDirtyFlag = true;
					r.store.remove(r);
					this.store.insert(insertAt++, r);
				}
				this.isDirtyFlag = true;
			}
		}
		this.dragZone.cachedTarget = null;
		return true;
    },

    removeDropIndicators : function(n){
		if(n){
			Roo.fly(n).removeClass([
				"x-view-drag-insert-above",
				"x-view-drag-insert-below"]);
			this.lastInsertClass = "_noclass";
		}
    },

/**
 *	Utility method. Add a delete option to the DDView's context menu.
 *	@param {String} imageUrl The URL of the "delete" icon image.
 */
	setDeletable: function(imageUrl) {
		if (!this.singleSelect && !this.multiSelect) {
			this.singleSelect = true;
		}
		var c = this.getContextMenu();
		this.contextMenu.on("itemclick", function(item) {
			switch (item.id) {
				case "delete":
					this.remove(this.getSelectedIndexes());
					break;
			}
		}, this);
		this.contextMenu.add({
			icon: imageUrl,
			id: "delete",
			text: 'Delete'
		});
	},
	
/**	Return the context menu for this DDView. */
	getContextMenu: function() {
		if (!this.contextMenu) {
//			Create the View's context menu
			this.contextMenu = new Roo.menu.Menu({
				id: this.id + "-contextmenu"
			});
			this.el.on("contextmenu", this.showContextMenu, this);
		}
		return this.contextMenu;
	},
	
	disableContextMenu: function() {
		if (this.contextMenu) {
			this.el.un("contextmenu", this.showContextMenu, this);
		}
	},

	showContextMenu: function(e, item) {
        item = this.findItemFromChild(e.getTarget());
		if (item) {
			e.stopEvent();
			this.select(this.getNode(item), this.multiSelect && e.ctrlKey, true);
			this.contextMenu.showAt(e.getXY());
	    }
    },

/**
 *	Remove {@link Roo.data.Record}s at the specified indices.
 *	@param {Array/Number} selectedIndices The index (or Array of indices) of Records to remove.
 */
    remove: function(selectedIndices) {
		selectedIndices = [].concat(selectedIndices);
		for (var i = 0; i < selectedIndices.length; i++) {
			var rec = this.store.getAt(selectedIndices[i]);
			this.store.remove(rec);
		}
    },

/**
 *	Double click fires the event, but also, if this is draggable, and there is only one other
 *	related DropZone, it transfers the selected node.
 */
    onDblClick : function(e){
        var item = this.findItemFromChild(e.getTarget());
        if(item){
            if (this.fireEvent("dblclick", this, this.indexOf(item), item, e) === false) {
            	return false;
            }
            if (this.dragGroup) {
	            var targets = Roo.dd.DragDropMgr.getRelated(this.dragZone, true);
	            while (targets.indexOf(this.dropZone) > -1) {
		            targets.remove(this.dropZone);
				}
	            if (targets.length == 1) {
					this.dragZone.cachedTarget = null;
	            	var el = Roo.get(targets[0].getEl());
	            	var box = el.getBox(true);
	            	targets[0].onNodeDrop(el.dom, {
	            		target: el.dom,
	            		xy: [box.x, box.y + box.height - 1]
	            	}, null, this.getDragData(e));
	            }
	        }
        }
    },
    
    handleSelection: function(e) {
		this.dragZone.cachedTarget = null;
        var item = this.findItemFromChild(e.getTarget());
        if (!item) {
        	this.clearSelections(true);
        	return;
        }
		if (item && (this.multiSelect || this.singleSelect)){
			if(this.multiSelect && e.shiftKey && (!e.ctrlKey) && this.lastSelection){
				this.select(this.getNodes(this.indexOf(this.lastSelection), item.nodeIndex), false);
			}else if (this.isSelected(this.getNode(item)) && e.ctrlKey){
				this.unselect(item);
			} else {
				this.select(item, this.multiSelect && e.ctrlKey);
				this.lastSelection = item;
			}
		}
    },

    onItemClick : function(item, index, e){
		if(this.fireEvent("beforeclick", this, index, item, e) === false){
			return false;
		}
		return true;
    },

    unselect : function(nodeInfo, suppressEvent){
		var node = this.getNode(nodeInfo);
		if(node && this.isSelected(node)){
			if(this.fireEvent("beforeselect", this, node, this.selections) !== false){
				Roo.fly(node).removeClass(this.selectedClass);
				this.selections.remove(node);
				if(!suppressEvent){
					this.fireEvent("selectionchange", this, this.selections);
				}
			}
		}
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
 * @class Roo.LayoutManager
 * @extends Roo.util.Observable
 * Base class for layout managers.
 */
Roo.LayoutManager = function(container, config){
    Roo.LayoutManager.superclass.constructor.call(this);
    this.el = Roo.get(container);
    // ie scrollbar fix
    if(this.el.dom == document.body && Roo.isIE && !config.allowScroll){
        document.body.scroll = "no";
    }else if(this.el.dom != document.body && this.el.getStyle('position') == 'static'){
        this.el.position('relative');
    }
    this.id = this.el.id;
    this.el.addClass("x-layout-container");
    /** false to disable window resize monitoring @type Boolean */
    this.monitorWindowResize = true;
    this.regions = {};
    this.addEvents({
        /**
         * @event layout
         * Fires when a layout is performed. 
         * @param {Roo.LayoutManager} this
         */
        "layout" : true,
        /**
         * @event regionresized
         * Fires when the user resizes a region. 
         * @param {Roo.LayoutRegion} region The resized region
         * @param {Number} newSize The new size (width for east/west, height for north/south)
         */
        "regionresized" : true,
        /**
         * @event regioncollapsed
         * Fires when a region is collapsed. 
         * @param {Roo.LayoutRegion} region The collapsed region
         */
        "regioncollapsed" : true,
        /**
         * @event regionexpanded
         * Fires when a region is expanded.  
         * @param {Roo.LayoutRegion} region The expanded region
         */
        "regionexpanded" : true
    });
    this.updating = false;
    Roo.EventManager.onWindowResize(this.onWindowResize, this, true);
};

Roo.extend(Roo.LayoutManager, Roo.util.Observable, {
    /**
     * Returns true if this layout is currently being updated
     * @return {Boolean}
     */
    isUpdating : function(){
        return this.updating; 
    },
    
    /**
     * Suspend the LayoutManager from doing auto-layouts while
     * making multiple add or remove calls
     */
    beginUpdate : function(){
        this.updating = true;    
    },
    
    /**
     * Restore auto-layouts and optionally disable the manager from performing a layout
     * @param {Boolean} noLayout true to disable a layout update 
     */
    endUpdate : function(noLayout){
        this.updating = false;
        if(!noLayout){
            this.layout();
        }    
    },
    
    layout: function(){
        
    },
    
    onRegionResized : function(region, newSize){
        this.fireEvent("regionresized", region, newSize);
        this.layout();
    },
    
    onRegionCollapsed : function(region){
        this.fireEvent("regioncollapsed", region);
    },
    
    onRegionExpanded : function(region){
        this.fireEvent("regionexpanded", region);
    },
        
    /**
     * Returns the size of the current view. This method normalizes document.body and element embedded layouts and
     * performs box-model adjustments.
     * @return {Object} The size as an object {width: (the width), height: (the height)}
     */
    getViewSize : function(){
        var size;
        if(this.el.dom != document.body){
            size = this.el.getSize();
        }else{
            size = {width: Roo.lib.Dom.getViewWidth(), height: Roo.lib.Dom.getViewHeight()};
        }
        size.width -= this.el.getBorderWidth("lr")-this.el.getPadding("lr");
        size.height -= this.el.getBorderWidth("tb")-this.el.getPadding("tb");
        return size;
    },
    
    /**
     * Returns the Element this layout is bound to.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.el;
    },
    
    /**
     * Returns the specified region.
     * @param {String} target The region key ('center', 'north', 'south', 'east' or 'west')
     * @return {Roo.LayoutRegion}
     */
    getRegion : function(target){
        return this.regions[target.toLowerCase()];
    },
    
    onWindowResize : function(){
        if(this.monitorWindowResize){
            this.layout();
        }
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
 * @class Roo.BorderLayout
 * @extends Roo.LayoutManager
 * This class represents a common layout manager used in desktop applications. For screenshots and more details,
 * please see: <br><br>
 * <a href="http://www.jackslocum.com/yui/2006/10/19/cross-browser-web-20-layouts-with-yahoo-ui/">Cross Browser Layouts - Part 1</a><br>
 * <a href="http://www.jackslocum.com/yui/2006/10/28/cross-browser-web-20-layouts-part-2-ajax-feed-viewer-20/">Cross Browser Layouts - Part 2</a><br><br>
 * Example:
 <pre><code>
 var layout = new Roo.BorderLayout(document.body, {
    north: {
        initialSize: 25,
        titlebar: false
    },
    west: {
        split:true,
        initialSize: 200,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true
    },
    east: {
        split:true,
        initialSize: 202,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true
    },
    south: {
        split:true,
        initialSize: 100,
        minSize: 100,
        maxSize: 200,
        titlebar: true,
        collapsible: true
    },
    center: {
        titlebar: true,
        autoScroll:true,
        resizeTabs: true,
        minTabWidth: 50,
        preferredTabWidth: 150
    }
});

// shorthand
var CP = Roo.ContentPanel;

layout.beginUpdate();
layout.add("north", new CP("north", "North"));
layout.add("south", new CP("south", {title: "South", closable: true}));
layout.add("west", new CP("west", {title: "West"}));
layout.add("east", new CP("autoTabs", {title: "Auto Tabs", closable: true}));
layout.add("center", new CP("center1", {title: "Close Me", closable: true}));
layout.add("center", new CP("center2", {title: "Center Panel", closable: false}));
layout.getRegion("center").showPanel("center1");
layout.endUpdate();
</code></pre>

<b>The container the layout is rendered into can be either the body element or any other element.
If it is not the body element, the container needs to either be an absolute positioned element,
or you will need to add "position:relative" to the css of the container.  You will also need to specify
the container size if it is not the body element.</b>

* @constructor
* Create a new BorderLayout
* @param {String/HTMLElement/Element} container The container this layout is bound to
* @param {Object} config Configuration options
 */
Roo.BorderLayout = function(container, config){
    config = config || {};
    Roo.BorderLayout.superclass.constructor.call(this, container, config);
    this.factory = config.factory || Roo.BorderLayout.RegionFactory;
    for(var i = 0, len = this.factory.validRegions.length; i < len; i++) {
    	var target = this.factory.validRegions[i];
    	if(config[target]){
    	    this.addRegion(target, config[target]);
    	}
    }
};

Roo.extend(Roo.BorderLayout, Roo.LayoutManager, {
    /**
     * Creates and adds a new region if it doesn't already exist.
     * @param {String} target The target region key (north, south, east, west or center).
     * @param {Object} config The regions config object
     * @return {BorderLayoutRegion} The new region
     */
    addRegion : function(target, config){
        if(!this.regions[target]){
            var r = this.factory.create(target, this, config);
    	    this.bindRegion(target, r);
        }
        return this.regions[target];
    },

    // private (kinda)
    bindRegion : function(name, r){
        this.regions[name] = r;
        r.on("visibilitychange", this.layout, this);
        r.on("paneladded", this.layout, this);
        r.on("panelremoved", this.layout, this);
        r.on("invalidated", this.layout, this);
        r.on("resized", this.onRegionResized, this);
        r.on("collapsed", this.onRegionCollapsed, this);
        r.on("expanded", this.onRegionExpanded, this);
    },

    /**
     * Performs a layout update.
     */
    layout : function(){
        if(this.updating) return;
        var size = this.getViewSize();
        var w = size.width;
        var h = size.height;
        var centerW = w;
        var centerH = h;
        var centerY = 0;
        var centerX = 0;
        //var x = 0, y = 0;

        var rs = this.regions;
        var north = rs["north"];
        var south = rs["south"]; 
        var west = rs["west"];
        var east = rs["east"];
        var center = rs["center"];
        //if(this.hideOnLayout){ // not supported anymore
            //c.el.setStyle("display", "none");
        //}
        if(north && north.isVisible()){
            var b = north.getBox();
            var m = north.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            b.y = m.top;
            centerY = b.height + b.y + m.bottom;
            centerH -= centerY;
            north.updateBox(this.safeBox(b));
        }
        if(south && south.isVisible()){
            var b = south.getBox();
            var m = south.getMargins();
            b.width = w - (m.left+m.right);
            b.x = m.left;
            var totalHeight = (b.height + m.top + m.bottom);
            b.y = h - totalHeight + m.top;
            centerH -= totalHeight;
            south.updateBox(this.safeBox(b));
        }
        if(west && west.isVisible()){
            var b = west.getBox();
            var m = west.getMargins();
            b.height = centerH - (m.top+m.bottom);
            b.x = m.left;
            b.y = centerY + m.top;
            var totalWidth = (b.width + m.left + m.right);
            centerX += totalWidth;
            centerW -= totalWidth;
            west.updateBox(this.safeBox(b));
        }
        if(east && east.isVisible()){
            var b = east.getBox();
            var m = east.getMargins();
            b.height = centerH - (m.top+m.bottom);
            var totalWidth = (b.width + m.left + m.right);
            b.x = w - totalWidth + m.left;
            b.y = centerY + m.top;
            centerW -= totalWidth;
            east.updateBox(this.safeBox(b));
        }
        if(center){
            var m = center.getMargins();
            var centerBox = {
                x: centerX + m.left,
                y: centerY + m.top,
                width: centerW - (m.left+m.right),
                height: centerH - (m.top+m.bottom)
            };
            //if(this.hideOnLayout){
                //center.el.setStyle("display", "block");
            //}
            center.updateBox(this.safeBox(centerBox));
        }
        this.el.repaint();
        this.fireEvent("layout", this);
    },

    // private
    safeBox : function(box){
        box.width = Math.max(0, box.width);
        box.height = Math.max(0, box.height);
        return box;
    },

    /**
     * Adds a ContentPanel (or subclass) to this layout.
     * @param {String} target The target region key (north, south, east, west or center).
     * @param {Roo.ContentPanel} panel The panel to add
     * @return {Roo.ContentPanel} The added panel
     */
    add : function(target, panel){
         
        target = target.toLowerCase();
        return this.regions[target].add(panel);
    },

    /**
     * Remove a ContentPanel (or subclass) to this layout.
     * @param {String} target The target region key (north, south, east, west or center).
     * @param {Number/String/Roo.ContentPanel} panel The index, id or panel to remove
     * @return {Roo.ContentPanel} The removed panel
     */
    remove : function(target, panel){
        target = target.toLowerCase();
        return this.regions[target].remove(panel);
    },

    /**
     * Searches all regions for a panel with the specified id
     * @param {String} panelId
     * @return {Roo.ContentPanel} The panel or null if it wasn't found
     */
    findPanel : function(panelId){
        var rs = this.regions;
        for(var target in rs){
            if(typeof rs[target] != "function"){
                var p = rs[target].getPanel(panelId);
                if(p){
                    return p;
                }
            }
        }
        return null;
    },

    /**
     * Searches all regions for a panel with the specified id and activates (shows) it.
     * @param {String/ContentPanel} panelId The panels id or the panel itself
     * @return {Roo.ContentPanel} The shown panel or null
     */
    showPanel : function(panelId) {
      var rs = this.regions;
      for(var target in rs){
         var r = rs[target];
         if(typeof r != "function"){
            if(r.hasPanel(panelId)){
               return r.showPanel(panelId);
            }
         }
      }
      return null;
   },

   /**
     * Restores this layout's state using Roo.state.Manager or the state provided by the passed provider.
     * @param {Roo.state.Provider} provider (optional) An alternate state provider
     */
    restoreState : function(provider){
        if(!provider){
            provider = Roo.state.Manager;
        }
        var sm = new Roo.LayoutStateManager();
        sm.init(this, provider);
    },

    /**
     * Adds a batch of multiple ContentPanels dynamically by passing a special regions config object.  This config
     * object should contain properties for each region to add ContentPanels to, and each property's value should be
     * a valid ContentPanel config object.  Example:
     * <pre><code>
// Create the main layout
var layout = new Roo.BorderLayout('main-ct', {
    west: {
        split:true,
        minSize: 175,
        titlebar: true
    },
    center: {
        title:'Components'
    }
}, 'main-ct');

// Create and add multiple ContentPanels at once via configs
layout.batchAdd({
   west: {
       id: 'source-files',
       autoCreate:true,
       title:'Ext Source Files',
       autoScroll:true,
       fitToFrame:true
   },
   center : {
       el: cview,
       autoScroll:true,
       fitToFrame:true,
       toolbar: tb,
       resizeEl:'cbody'
   }
});
</code></pre>
     * @param {Object} regions An object containing ContentPanel configs by region name
     */
    batchAdd : function(regions){
        this.beginUpdate();
        for(var rname in regions){
            var lr = this.regions[rname];
            if(lr){
                this.addTypedPanels(lr, regions[rname]);
            }
        }
        this.endUpdate();
    },

    // private
    addTypedPanels : function(lr, ps){
        if(typeof ps == 'string'){
            lr.add(new Roo.ContentPanel(ps));
        }
        else if(ps instanceof Array){
            for(var i =0, len = ps.length; i < len; i++){
                this.addTypedPanels(lr, ps[i]);
            }
        }
        else if(!ps.events){ // raw config?
            var el = ps.el;
            delete ps.el; // prevent conflict
            lr.add(new Roo.ContentPanel(el || Roo.id(), ps));
        }
        else {  // panel object assumed!
            lr.add(ps);
        }
    },
    /**
     * Adds a xtype elements to the layout.
     * <pre><code>

layout.addxtype({
       xtype : 'ContentPanel',
       region: 'west',
       items: [ .... ]
   }
);

layout.addxtype({
        xtype : 'NestedLayoutPanel',
        region: 'west',
        layout: {
           center: { },
           west: { }   
        },
        items : [ ... list of content panels or nested layout panels.. ]
   }
);
</code></pre>
     * @param {Object} cfg Xtype definition of item to add.
     */
    addxtype : function(cfg)
    {
        // basically accepts a pannel...
        // can accept a layout region..!?!?
       // console.log('BorderLayout add ' + cfg.xtype)
        
        if (!cfg.xtype.match(/Panel$/)) {
            return false;
        }
        var ret = false;
        var region = cfg.region;
        delete cfg.region;
        
          
        var xitems = [];
        if (cfg.items) {
            xitems = cfg.items;
            delete cfg.items;
        }
        
        
        switch(cfg.xtype) 
        {
            case 'ContentPanel':  // ContentPanel (el, cfg)
                if(cfg.autoCreate) {
                    ret = new Roo[cfg.xtype](cfg); // new panel!!!!!
                } else {
                    var el = this.el.createChild();
                    ret = new Roo[cfg.xtype](el, cfg); // new panel!!!!!
                }
                
                this.add(region, ret);
                break;
            
            
            case 'TreePanel': // our new panel!
                cfg.el = this.el.createChild();
                ret = new Roo[cfg.xtype](cfg); // new panel!!!!!
                this.add(region, ret);
                break;
            
            case 'NestedLayoutPanel': 
                // create a new Layout (which is  a Border Layout...
                var el = this.el.createChild();
                var clayout = cfg.layout;
                delete cfg.layout;
                clayout.items   = clayout.items  || [];
                // replace this exitems with the clayout ones..
                xitems = clayout.items;
                 
                
                if (region == 'center' && this.active && this.getRegion('center').panels.length < 1) {
                    cfg.background = false;
                }
                var layout = new Roo.BorderLayout(el, clayout);
                
                ret = new Roo[cfg.xtype](layout, cfg); // new panel!!!!!
                //console.log('adding nested layout panel '  + cfg.toSource());
                this.add(region, ret);
                
                break;
                
            case 'GridPanel': 
            
                // needs grid and region
                
                //var el = this.getRegion(region).el.createChild();
                var el = this.el.createChild();
                // create the grid first...
                
                var grid = new Roo.grid[cfg.grid.xtype](el, cfg.grid);
                delete cfg.grid;
                if (region == 'center' && this.active ) {
                    cfg.background = false;
                }
                ret = new Roo[cfg.xtype](grid, cfg); // new panel!!!!!
                
                this.add(region, ret);
                if (cfg.background) {
                    ret.on('activate', function(gp) {
                        if (!gp.grid.rendered) {
                            gp.grid.render();
                        }
                    });
                } else {
                    grid.render();
                }
                break;
           
               
                
                
            default: 
                alert("Can not add '" + cfg.xtype + "' to BorderLayout");
                return;
             // GridPanel (grid, cfg)
            
        }
        this.beginUpdate();
        // add children..
        Roo.each(xitems, function(i)  {
            ret.addxtype(i);
        });
        this.endUpdate();
        return ret;
        
    }
});

/**
 * Shortcut for creating a new BorderLayout object and adding one or more ContentPanels to it in a single step, handling
 * the beginUpdate and endUpdate calls internally.  The key to this method is the <b>panels</b> property that can be
 * provided with each region config, which allows you to add ContentPanel configs in addition to the region configs
 * during creation.  The following code is equivalent to the constructor-based example at the beginning of this class:
 * <pre><code>
// shorthand
var CP = Roo.ContentPanel;

var layout = Roo.BorderLayout.create({
    north: {
        initialSize: 25,
        titlebar: false,
        panels: [new CP("north", "North")]
    },
    west: {
        split:true,
        initialSize: 200,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true,
        panels: [new CP("west", {title: "West"})]
    },
    east: {
        split:true,
        initialSize: 202,
        minSize: 175,
        maxSize: 400,
        titlebar: true,
        collapsible: true,
        panels: [new CP("autoTabs", {title: "Auto Tabs", closable: true})]
    },
    south: {
        split:true,
        initialSize: 100,
        minSize: 100,
        maxSize: 200,
        titlebar: true,
        collapsible: true,
        panels: [new CP("south", {title: "South", closable: true})]
    },
    center: {
        titlebar: true,
        autoScroll:true,
        resizeTabs: true,
        minTabWidth: 50,
        preferredTabWidth: 150,
        panels: [
            new CP("center1", {title: "Close Me", closable: true}),
            new CP("center2", {title: "Center Panel", closable: false})
        ]
    }
}, document.body);

layout.getRegion("center").showPanel("center1");
</code></pre>
 * @param config
 * @param targetEl
 */
Roo.BorderLayout.create = function(config, targetEl){
    var layout = new Roo.BorderLayout(targetEl || document.body, config);
    layout.beginUpdate();
    var regions = Roo.BorderLayout.RegionFactory.validRegions;
    for(var j = 0, jlen = regions.length; j < jlen; j++){
        var lr = regions[j];
        if(layout.regions[lr] && config[lr].panels){
            var r = layout.regions[lr];
            var ps = config[lr].panels;
            layout.addTypedPanels(r, ps);
        }
    }
    layout.endUpdate();
    return layout;
};

// private
Roo.BorderLayout.RegionFactory = {
    // private
    validRegions : ["north","south","east","west","center"],

    // private
    create : function(target, mgr, config){
        target = target.toLowerCase();
        if(config.lightweight || config.basic){
            return new Roo.BasicLayoutRegion(mgr, config, target);
        }
        switch(target){
            case "north":
                return new Roo.NorthLayoutRegion(mgr, config);
            case "south":
                return new Roo.SouthLayoutRegion(mgr, config);
            case "east":
                return new Roo.EastLayoutRegion(mgr, config);
            case "west":
                return new Roo.WestLayoutRegion(mgr, config);
            case "center":
                return new Roo.CenterLayoutRegion(mgr, config);
        }
        throw 'Layout region "'+target+'" not supported.';
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
 * @class Roo.BasicLayoutRegion
 * @extends Roo.util.Observable
 * This class represents a lightweight region in a layout manager. This region does not move dom nodes
 * and does not have a titlebar, tabs or any other features. All it does is size and position 
 * panels. To create a BasicLayoutRegion, add lightweight:true or basic:true to your regions config.
 */
Roo.BasicLayoutRegion = function(mgr, config, pos, skipConfig){
    this.mgr = mgr;
    this.position  = pos;
    this.events = {
        /**
         * @scope Roo.BasicLayoutRegion
         */
        
        /**
         * @event beforeremove
         * Fires before a panel is removed (or closed). To cancel the removal set "e.cancel = true" on the event argument.
         * @param {Roo.LayoutRegion} this
         * @param {Roo.ContentPanel} panel The panel
         * @param {Object} e The cancel event object
         */
        "beforeremove" : true,
        /**
         * @event invalidated
         * Fires when the layout for this region is changed.
         * @param {Roo.LayoutRegion} this
         */
        "invalidated" : true,
        /**
         * @event visibilitychange
         * Fires when this region is shown or hidden 
         * @param {Roo.LayoutRegion} this
         * @param {Boolean} visibility true or false
         */
        "visibilitychange" : true,
        /**
         * @event paneladded
         * Fires when a panel is added. 
         * @param {Roo.LayoutRegion} this
         * @param {Roo.ContentPanel} panel The panel
         */
        "paneladded" : true,
        /**
         * @event panelremoved
         * Fires when a panel is removed. 
         * @param {Roo.LayoutRegion} this
         * @param {Roo.ContentPanel} panel The panel
         */
        "panelremoved" : true,
        /**
         * @event collapsed
         * Fires when this region is collapsed.
         * @param {Roo.LayoutRegion} this
         */
        "collapsed" : true,
        /**
         * @event expanded
         * Fires when this region is expanded.
         * @param {Roo.LayoutRegion} this
         */
        "expanded" : true,
        /**
         * @event slideshow
         * Fires when this region is slid into view.
         * @param {Roo.LayoutRegion} this
         */
        "slideshow" : true,
        /**
         * @event slidehide
         * Fires when this region slides out of view. 
         * @param {Roo.LayoutRegion} this
         */
        "slidehide" : true,
        /**
         * @event panelactivated
         * Fires when a panel is activated. 
         * @param {Roo.LayoutRegion} this
         * @param {Roo.ContentPanel} panel The activated panel
         */
        "panelactivated" : true,
        /**
         * @event resized
         * Fires when the user resizes this region. 
         * @param {Roo.LayoutRegion} this
         * @param {Number} newSize The new size (width for east/west, height for north/south)
         */
        "resized" : true
    };
    /** A collection of panels in this region. @type Roo.util.MixedCollection */
    this.panels = new Roo.util.MixedCollection();
    this.panels.getKey = this.getPanelId.createDelegate(this);
    this.box = null;
    this.activePanel = null;
    // ensure listeners are added...
    
    if (config.listeners || config.events) {
        Roo.BasicLayoutRegion.superclass.constructor.call(this, {
            listeners : config.listeners || {},
            events : config.events || {}
        });
    }
    
    if(skipConfig !== true){
        this.applyConfig(config);
    }
};

Roo.extend(Roo.BasicLayoutRegion, Roo.util.Observable, {
    getPanelId : function(p){
        return p.getId();
    },
    
    applyConfig : function(config){
        this.margins = config.margins || this.margins || {top: 0, left: 0, right:0, bottom: 0};
        this.config = config;
        
    },
    
    /**
     * Resizes the region to the specified size. For vertical regions (west, east) this adjusts 
     * the width, for horizontal (north, south) the height.
     * @param {Number} newSize The new width or height
     */
    resizeTo : function(newSize){
        var el = this.el ? this.el :
                 (this.activePanel ? this.activePanel.getEl() : null);
        if(el){
            switch(this.position){
                case "east":
                case "west":
                    el.setWidth(newSize);
                    this.fireEvent("resized", this, newSize);
                break;
                case "north":
                case "south":
                    el.setHeight(newSize);
                    this.fireEvent("resized", this, newSize);
                break;                
            }
        }
    },
    
    getBox : function(){
        return this.activePanel ? this.activePanel.getEl().getBox(false, true) : null;
    },
    
    getMargins : function(){
        return this.margins;
    },
    
    updateBox : function(box){
        this.box = box;
        var el = this.activePanel.getEl();
        el.dom.style.left = box.x + "px";
        el.dom.style.top = box.y + "px";
        this.activePanel.setSize(box.width, box.height);
    },
    
    /**
     * Returns the container element for this region.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.activePanel;
    },
    
    /**
     * Returns true if this region is currently visible.
     * @return {Boolean}
     */
    isVisible : function(){
        return this.activePanel ? true : false;
    },
    
    setActivePanel : function(panel){
        panel = this.getPanel(panel);
        if(this.activePanel && this.activePanel != panel){
            this.activePanel.setActiveState(false);
            this.activePanel.getEl().setLeftTop(-10000,-10000);
        }
        this.activePanel = panel;
        panel.setActiveState(true);
        if(this.box){
            panel.setSize(this.box.width, this.box.height);
        }
        this.fireEvent("panelactivated", this, panel);
        this.fireEvent("invalidated");
    },
    
    /**
     * Show the specified panel.
     * @param {Number/String/ContentPanel} panelId The panels index, id or the panel itself
     * @return {Roo.ContentPanel} The shown panel or null
     */
    showPanel : function(panel){
        if(panel = this.getPanel(panel)){
            this.setActivePanel(panel);
        }
        return panel;
    },
    
    /**
     * Get the active panel for this region.
     * @return {Roo.ContentPanel} The active panel or null
     */
    getActivePanel : function(){
        return this.activePanel;
    },
    
    /**
     * Add the passed ContentPanel(s)
     * @param {ContentPanel...} panel The ContentPanel(s) to add (you can pass more than one)
     * @return {Roo.ContentPanel} The panel added (if only one was added)
     */
    add : function(panel){
        if(arguments.length > 1){
            for(var i = 0, len = arguments.length; i < len; i++) {
            	this.add(arguments[i]);
            }
            return null;
        }
        if(this.hasPanel(panel)){
            this.showPanel(panel);
            return panel;
        }
        var el = panel.getEl();
        if(el.dom.parentNode != this.mgr.el.dom){
            this.mgr.el.dom.appendChild(el.dom);
        }
        if(panel.setRegion){
            panel.setRegion(this);
        }
        this.panels.add(panel);
        el.setStyle("position", "absolute");
        if(!panel.background){
            this.setActivePanel(panel);
            if(this.config.initialSize && this.panels.getCount()==1){
                this.resizeTo(this.config.initialSize);
            }
        }
        this.fireEvent("paneladded", this, panel);
        return panel;
    },
    
    /**
     * Returns true if the panel is in this region.
     * @param {Number/String/ContentPanel} panel The panels index, id or the panel itself
     * @return {Boolean}
     */
    hasPanel : function(panel){
        if(typeof panel == "object"){ // must be panel obj
            panel = panel.getId();
        }
        return this.getPanel(panel) ? true : false;
    },
    
    /**
     * Removes the specified panel. If preservePanel is not true (either here or in the config), the panel is destroyed.
     * @param {Number/String/ContentPanel} panel The panels index, id or the panel itself
     * @param {Boolean} preservePanel Overrides the config preservePanel option
     * @return {Roo.ContentPanel} The panel that was removed
     */
    remove : function(panel, preservePanel){
        panel = this.getPanel(panel);
        if(!panel){
            return null;
        }
        var e = {};
        this.fireEvent("beforeremove", this, panel, e);
        if(e.cancel === true){
            return null;
        }
        var panelId = panel.getId();
        this.panels.removeKey(panelId);
        return panel;
    },
    
    /**
     * Returns the panel specified or null if it's not in this region.
     * @param {Number/String/ContentPanel} panel The panels index, id or the panel itself
     * @return {Roo.ContentPanel}
     */
    getPanel : function(id){
        if(typeof id == "object"){ // must be panel obj
            return id;
        }
        return this.panels.get(id);
    },
    
    /**
     * Returns this regions position (north/south/east/west/center).
     * @return {String} 
     */
    getPosition: function(){
        return this.position;    
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
 * @class Roo.LayoutRegion
 * @extends Roo.BasicLayoutRegion
 * This class represents a region in a layout manager.
 * @cfg {Boolean} collapsible False to disable collapsing (defaults to true)
 * @cfg {Boolean} collapsed True to set the initial display to collapsed (defaults to false)
 * @cfg {Boolean} floatable False to disable floating (defaults to true)
 * @cfg {Object} margins Margins for the element (defaults to {top: 0, left: 0, right:0, bottom: 0})
 * @cfg {Object} cmargins Margins for the element when collapsed (defaults to: north/south {top: 2, left: 0, right:0, bottom: 2} or east/west {top: 0, left: 2, right:2, bottom: 0})
 * @cfg {String} tabPosition "top" or "bottom" (defaults to "bottom")
 * @cfg {String} collapsedTitle Optional string message to display in the collapsed block of a north or south region
 * @cfg {Boolean} alwaysShowTabs True to always display tabs even when there is only 1 panel (defaults to false)
 * @cfg {Boolean} autoScroll True to enable overflow scrolling (defaults to false)
 * @cfg {Boolean} titlebar True to display a title bar (defaults to true)
 * @cfg {String} title The title for the region (overrides panel titles)
 * @cfg {Boolean} animate True to animate expand/collapse (defaults to false)
 * @cfg {Boolean} autoHide False to disable auto hiding when the mouse leaves the "floated" region (defaults to true)
 * @cfg {Boolean} preservePanels True to preserve removed panels so they can be readded later (defaults to false)
 * @cfg {Boolean} closeOnTab True to place the close icon on the tabs instead of the region titlebar (defaults to false)
 * @cfg {Boolean} hideTabs True to hide the tab strip (defaults to false)
 * @cfg {Boolean} resizeTabs True to enable automatic tab resizing. This will resize the tabs so they are all the same size and fit within
 * the space available, similar to FireFox 1.5 tabs (defaults to false)
 * @cfg {Number} minTabWidth The minimum tab width (defaults to 40)
 * @cfg {Number} preferredTabWidth The preferred tab width (defaults to 150)
 * @cfg {Boolean} showPin True to show a pin button
* @cfg {Boolean} hidden True to start the region hidden (defaults to false)
* @cfg {Boolean} hideWhenEmpty True to hide the region when it has no panels
* @cfg {Boolean} disableTabTips True to disable tab tooltips
* @cfg {Number} width  For East/West panels
* @cfg {Number} height For North/South panels
* @cfg {Boolean} split To show the splitter
 */
Roo.LayoutRegion = function(mgr, config, pos){
    Roo.LayoutRegion.superclass.constructor.call(this, mgr, config, pos, true);
    var dh = Roo.DomHelper;
    /** This region's container element 
    * @type Roo.Element */
    this.el = dh.append(mgr.el.dom, {tag: "div", cls: "x-layout-panel x-layout-panel-" + this.position}, true);
    /** This region's title element 
    * @type Roo.Element */

    this.titleEl = dh.append(this.el.dom, {tag: "div", unselectable: "on", cls: "x-unselectable x-layout-panel-hd x-layout-title-"+this.position, children:[
        {tag: "span", cls: "x-unselectable x-layout-panel-hd-text", unselectable: "on", html: "&#160;"},
        {tag: "div", cls: "x-unselectable x-layout-panel-hd-tools", unselectable: "on"}
    ]}, true);
    this.titleEl.enableDisplayMode();
    /** This region's title text element 
    * @type HTMLElement */
    this.titleTextEl = this.titleEl.dom.firstChild;
    this.tools = Roo.get(this.titleEl.dom.childNodes[1], true);
    this.closeBtn = this.createTool(this.tools.dom, "x-layout-close");
    this.closeBtn.enableDisplayMode();
    this.closeBtn.on("click", this.closeClicked, this);
    this.closeBtn.hide();

    this.createBody(config);
    this.visible = true;
    this.collapsed = false;

    if(config.hideWhenEmpty){
        this.hide();
        this.on("paneladded", this.validateVisibility, this);
        this.on("panelremoved", this.validateVisibility, this);
    }
    this.applyConfig(config);
};

Roo.extend(Roo.LayoutRegion, Roo.BasicLayoutRegion, {

    createBody : function(){
        /** This region's body element 
        * @type Roo.Element */
        this.bodyEl = this.el.createChild({tag: "div", cls: "x-layout-panel-body"});
    },

    applyConfig : function(c){
        if(c.collapsible && this.position != "center" && !this.collapsedEl){
            var dh = Roo.DomHelper;
            if(c.titlebar !== false){
                this.collapseBtn = this.createTool(this.tools.dom, "x-layout-collapse-"+this.position);
                this.collapseBtn.on("click", this.collapse, this);
                this.collapseBtn.enableDisplayMode();

                if(c.showPin === true || this.showPin){
                    this.stickBtn = this.createTool(this.tools.dom, "x-layout-stick");
                    this.stickBtn.enableDisplayMode();
                    this.stickBtn.on("click", this.expand, this);
                    this.stickBtn.hide();
                }
            }
            /** This region's collapsed element
            * @type Roo.Element */
            this.collapsedEl = dh.append(this.mgr.el.dom, {cls: "x-layout-collapsed x-layout-collapsed-"+this.position, children:[
                {cls: "x-layout-collapsed-tools", children:[{cls: "x-layout-ctools-inner"}]}
            ]}, true);
            if(c.floatable !== false){
               this.collapsedEl.addClassOnOver("x-layout-collapsed-over");
               this.collapsedEl.on("click", this.collapseClick, this);
            }

            if(c.collapsedTitle && (this.position == "north" || this.position== "south")) {
                this.collapsedTitleTextEl = dh.append(this.collapsedEl.dom, {tag: "div", cls: "x-unselectable x-layout-panel-hd-text",
                   id: "message", unselectable: "on", style:{"float":"left"}});
               this.collapsedTitleTextEl.innerHTML = c.collapsedTitle;
             }
            this.expandBtn = this.createTool(this.collapsedEl.dom.firstChild.firstChild, "x-layout-expand-"+this.position);
            this.expandBtn.on("click", this.expand, this);
        }
        if(this.collapseBtn){
            this.collapseBtn.setVisible(c.collapsible == true);
        }
        this.cmargins = c.cmargins || this.cmargins ||
                         (this.position == "west" || this.position == "east" ?
                             {top: 0, left: 2, right:2, bottom: 0} :
                             {top: 2, left: 0, right:0, bottom: 2});
        this.margins = c.margins || this.margins || {top: 0, left: 0, right:0, bottom: 0};
        this.bottomTabs = c.tabPosition != "top";
        this.autoScroll = c.autoScroll || false;
        if(this.autoScroll){
            this.bodyEl.setStyle("overflow", "auto");
        }else{
            this.bodyEl.setStyle("overflow", "hidden");
        }
        //if(c.titlebar !== false){
            if((!c.titlebar && !c.title) || c.titlebar === false){
                this.titleEl.hide();
            }else{
                this.titleEl.show();
                if(c.title){
                    this.titleTextEl.innerHTML = c.title;
                }
            }
        //}
        this.duration = c.duration || .30;
        this.slideDuration = c.slideDuration || .45;
        this.config = c;
        if(c.collapsed){
            this.collapse(true);
        }
        if(c.hidden){
            this.hide();
        }
    },
    /**
     * Returns true if this region is currently visible.
     * @return {Boolean}
     */
    isVisible : function(){
        return this.visible;
    },

    /**
     * Updates the title for collapsed north/south regions (used with {@link #collapsedTitle} config option)
     * @param {String} title (optional) The title text (accepts HTML markup, defaults to the numeric character reference for a non-breaking space, "&amp;#160;")
     */
    setCollapsedTitle : function(title){
        title = title || "&#160;";
        if(this.collapsedTitleTextEl){
            this.collapsedTitleTextEl.innerHTML = title;
        }
    },

    getBox : function(){
        var b;
        if(!this.collapsed){
            b = this.el.getBox(false, true);
        }else{
            b = this.collapsedEl.getBox(false, true);
        }
        return b;
    },

    getMargins : function(){
        return this.collapsed ? this.cmargins : this.margins;
    },

    highlight : function(){
        this.el.addClass("x-layout-panel-dragover");
    },

    unhighlight : function(){
        this.el.removeClass("x-layout-panel-dragover");
    },

    updateBox : function(box){
        this.box = box;
        if(!this.collapsed){
            this.el.dom.style.left = box.x + "px";
            this.el.dom.style.top = box.y + "px";
            this.updateBody(box.width, box.height);
        }else{
            this.collapsedEl.dom.style.left = box.x + "px";
            this.collapsedEl.dom.style.top = box.y + "px";
            this.collapsedEl.setSize(box.width, box.height);
        }
        if(this.tabs){
            this.tabs.autoSizeTabs();
        }
    },

    updateBody : function(w, h){
        if(w !== null){
            this.el.setWidth(w);
            w -= this.el.getBorderWidth("rl");
            if(this.config.adjustments){
                w += this.config.adjustments[0];
            }
        }
        if(h !== null){
            this.el.setHeight(h);
            h = this.titleEl && this.titleEl.isDisplayed() ? h - (this.titleEl.getHeight()||0) : h;
            h -= this.el.getBorderWidth("tb");
            if(this.config.adjustments){
                h += this.config.adjustments[1];
            }
            this.bodyEl.setHeight(h);
            if(this.tabs){
                h = this.tabs.syncHeight(h);
            }
        }
        if(this.panelSize){
            w = w !== null ? w : this.panelSize.width;
            h = h !== null ? h : this.panelSize.height;
        }
        if(this.activePanel){
            var el = this.activePanel.getEl();
            w = w !== null ? w : el.getWidth();
            h = h !== null ? h : el.getHeight();
            this.panelSize = {width: w, height: h};
            this.activePanel.setSize(w, h);
        }
        if(Roo.isIE && this.tabs){
            this.tabs.el.repaint();
        }
    },

    /**
     * Returns the container element for this region.
     * @return {Roo.Element}
     */
    getEl : function(){
        return this.el;
    },

    /**
     * Hides this region.
     */
    hide : function(){
        if(!this.collapsed){
            this.el.dom.style.left = "-2000px";
            this.el.hide();
        }else{
            this.collapsedEl.dom.style.left = "-2000px";
            this.collapsedEl.hide();
        }
        this.visible = false;
        this.fireEvent("visibilitychange", this, false);
    },

    /**
     * Shows this region if it was previously hidden.
     */
    show : function(){
        if(!this.collapsed){
            this.el.show();
        }else{
            this.collapsedEl.show();
        }
        this.visible = true;
        this.fireEvent("visibilitychange", this, true);
    },

    closeClicked : function(){
        if(this.activePanel){
            this.remove(this.activePanel);
        }
    },

    collapseClick : function(e){
        if(this.isSlid){
           e.stopPropagation();
           this.slideIn();
        }else{
           e.stopPropagation();
           this.slideOut();
        }
    },

    /**
     * Collapses this region.
     * @param {Boolean} skipAnim (optional) true to collapse the element without animation (if animate is true)
     */
    collapse : function(skipAnim){
        if(this.collapsed) return;
        this.collapsed = true;
        if(this.split){
            this.split.el.hide();
        }
        if(this.config.animate && skipAnim !== true){
            this.fireEvent("invalidated", this);
            this.animateCollapse();
        }else{
            this.el.setLocation(-20000,-20000);
            this.el.hide();
            this.collapsedEl.show();
            this.fireEvent("collapsed", this);
            this.fireEvent("invalidated", this);
        }
    },

    animateCollapse : function(){
        // overridden
    },

    /**
     * Expands this region if it was previously collapsed.
     * @param {Roo.EventObject} e The event that triggered the expand (or null if calling manually)
     * @param {Boolean} skipAnim (optional) true to expand the element without animation (if animate is true)
     */
    expand : function(e, skipAnim){
        if(e) e.stopPropagation();
        if(!this.collapsed || this.el.hasActiveFx()) return;
        if(this.isSlid){
            this.afterSlideIn();
            skipAnim = true;
        }
        this.collapsed = false;
        if(this.config.animate && skipAnim !== true){
            this.animateExpand();
        }else{
            this.el.show();
            if(this.split){
                this.split.el.show();
            }
            this.collapsedEl.setLocation(-2000,-2000);
            this.collapsedEl.hide();
            this.fireEvent("invalidated", this);
            this.fireEvent("expanded", this);
        }
    },

    animateExpand : function(){
        // overridden
    },

    initTabs : function(){
        this.bodyEl.setStyle("overflow", "hidden");
        var ts = new Roo.TabPanel(this.bodyEl.dom, {
            tabPosition: this.bottomTabs ? 'bottom' : 'top',
            disableTooltips: this.config.disableTabTips
        });
        if(this.config.hideTabs){
            ts.stripWrap.setDisplayed(false);
        }
        this.tabs = ts;
        ts.resizeTabs = this.config.resizeTabs === true;
        ts.minTabWidth = this.config.minTabWidth || 40;
        ts.maxTabWidth = this.config.maxTabWidth || 250;
        ts.preferredTabWidth = this.config.preferredTabWidth || 150;
        ts.monitorResize = false;
        ts.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
        ts.bodyEl.addClass('x-layout-tabs-body');
        this.panels.each(this.initPanelAsTab, this);
    },

    initPanelAsTab : function(panel){
        var ti = this.tabs.addTab(panel.getEl().id, panel.getTitle(), null,
                    this.config.closeOnTab && panel.isClosable());
        if(panel.tabTip !== undefined){
            ti.setTooltip(panel.tabTip);
        }
        ti.on("activate", function(){
              this.setActivePanel(panel);
        }, this);
        if(this.config.closeOnTab){
            ti.on("beforeclose", function(t, e){
                e.cancel = true;
                this.remove(panel);
            }, this);
        }
        return ti;
    },

    updatePanelTitle : function(panel, title){
        if(this.activePanel == panel){
            this.updateTitle(title);
        }
        if(this.tabs){
            var ti = this.tabs.getTab(panel.getEl().id);
            ti.setText(title);
            if(panel.tabTip !== undefined){
                ti.setTooltip(panel.tabTip);
            }
        }
    },

    updateTitle : function(title){
        if(this.titleTextEl && !this.config.title){
            this.titleTextEl.innerHTML = (typeof title != "undefined" && title.length > 0 ? title : "&#160;");
        }
    },

    setActivePanel : function(panel){
        panel = this.getPanel(panel);
        if(this.activePanel && this.activePanel != panel){
            this.activePanel.setActiveState(false);
        }
        this.activePanel = panel;
        panel.setActiveState(true);
        if(this.panelSize){
            panel.setSize(this.panelSize.width, this.panelSize.height);
        }
        if(this.closeBtn){
            this.closeBtn.setVisible(!this.config.closeOnTab && !this.isSlid && panel.isClosable());
        }
        this.updateTitle(panel.getTitle());
        if(this.tabs){
            this.fireEvent("invalidated", this);
        }
        this.fireEvent("panelactivated", this, panel);
    },

    /**
     * Shows the specified panel.
     * @param {Number/String/ContentPanel} panelId The panel's index, id or the panel itself
     * @return {Roo.ContentPanel} The shown panel, or null if a panel could not be found from panelId
     */
    showPanel : function(panel){
        if(panel = this.getPanel(panel)){
            if(this.tabs){
                var tab = this.tabs.getTab(panel.getEl().id);
                if(tab.isHidden()){
                    this.tabs.unhideTab(tab.id);
                }
                tab.activate();
            }else{
                this.setActivePanel(panel);
            }
        }
        return panel;
    },

    /**
     * Get the active panel for this region.
     * @return {Roo.ContentPanel} The active panel or null
     */
    getActivePanel : function(){
        return this.activePanel;
    },

    validateVisibility : function(){
        if(this.panels.getCount() < 1){
            this.updateTitle("&#160;");
            this.closeBtn.hide();
            this.hide();
        }else{
            if(!this.isVisible()){
                this.show();
            }
        }
    },

    /**
     * Adds the passed ContentPanel(s) to this region.
     * @param {ContentPanel...} panel The ContentPanel(s) to add (you can pass more than one)
     * @return {Roo.ContentPanel} The panel added (if only one was added; null otherwise)
     */
    add : function(panel){
        if(arguments.length > 1){
            for(var i = 0, len = arguments.length; i < len; i++) {
                this.add(arguments[i]);
            }
            return null;
        }
        if(this.hasPanel(panel)){
            this.showPanel(panel);
            return panel;
        }
        panel.setRegion(this);
        this.panels.add(panel);
        if(this.panels.getCount() == 1 && !this.config.alwaysShowTabs){
            this.bodyEl.dom.appendChild(panel.getEl().dom);
            if(panel.background !== true){
                this.setActivePanel(panel);
            }
            this.fireEvent("paneladded", this, panel);
            return panel;
        }
        if(!this.tabs){
            this.initTabs();
        }else{
            this.initPanelAsTab(panel);
        }
        if(panel.background !== true){
            this.tabs.activate(panel.getEl().id);
        }
        this.fireEvent("paneladded", this, panel);
        return panel;
    },

    /**
     * Hides the tab for the specified panel.
     * @param {Number/String/ContentPanel} panel The panel's index, id or the panel itself
     */
    hidePanel : function(panel){
        if(this.tabs && (panel = this.getPanel(panel))){
            this.tabs.hideTab(panel.getEl().id);
        }
    },

    /**
     * Unhides the tab for a previously hidden panel.
     * @param {Number/String/ContentPanel} panel The panel's index, id or the panel itself
     */
    unhidePanel : function(panel){
        if(this.tabs && (panel = this.getPanel(panel))){
            this.tabs.unhideTab(panel.getEl().id);
        }
    },

    clearPanels : function(){
        while(this.panels.getCount() > 0){
             this.remove(this.panels.first());
        }
    },

    /**
     * Removes the specified panel. If preservePanel is not true (either here or in the config), the panel is destroyed.
     * @param {Number/String/ContentPanel} panel The panel's index, id or the panel itself
     * @param {Boolean} preservePanel Overrides the config preservePanel option
     * @return {Roo.ContentPanel} The panel that was removed
     */
    remove : function(panel, preservePanel){
        panel = this.getPanel(panel);
        if(!panel){
            return null;
        }
        var e = {};
        this.fireEvent("beforeremove", this, panel, e);
        if(e.cancel === true){
            return null;
        }
        preservePanel = (typeof preservePanel != "undefined" ? preservePanel : (this.config.preservePanels === true || panel.preserve === true));
        var panelId = panel.getId();
        this.panels.removeKey(panelId);
        if(preservePanel){
            document.body.appendChild(panel.getEl().dom);
        }
        if(this.tabs){
            this.tabs.removeTab(panel.getEl().id);
        }else if (!preservePanel){
            this.bodyEl.dom.removeChild(panel.getEl().dom);
        }
        if(this.panels.getCount() == 1 && this.tabs && !this.config.alwaysShowTabs){
            var p = this.panels.first();
            var tempEl = document.createElement("div"); // temp holder to keep IE from deleting the node
            tempEl.appendChild(p.getEl().dom);
            this.bodyEl.update("");
            this.bodyEl.dom.appendChild(p.getEl().dom);
            tempEl = null;
            this.updateTitle(p.getTitle());
            this.tabs = null;
            this.bodyEl.setStyle("overflow", this.config.autoScroll ? "auto" : "hidden");
            this.setActivePanel(p);
        }
        panel.setRegion(null);
        if(this.activePanel == panel){
            this.activePanel = null;
        }
        if(this.config.autoDestroy !== false && preservePanel !== true){
            try{panel.destroy();}catch(e){}
        }
        this.fireEvent("panelremoved", this, panel);
        return panel;
    },

    /**
     * Returns the TabPanel component used by this region
     * @return {Roo.TabPanel}
     */
    getTabs : function(){
        return this.tabs;
    },

    createTool : function(parentEl, className){
        var btn = Roo.DomHelper.append(parentEl, {tag: "div", cls: "x-layout-tools-button",
            children: [{tag: "div", cls: "x-layout-tools-button-inner " + className, html: "&#160;"}]}, true);
        btn.addClassOnOver("x-layout-tools-button-over");
        return btn;
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
 * @class Roo.SplitLayoutRegion
 * @extends Roo.LayoutRegion
 * Adds a splitbar and other (private) useful functionality to a {@link Roo.LayoutRegion}.
 */
Roo.SplitLayoutRegion = function(mgr, config, pos, cursor){
    this.cursor = cursor;
    Roo.SplitLayoutRegion.superclass.constructor.call(this, mgr, config, pos);
};

Roo.extend(Roo.SplitLayoutRegion, Roo.LayoutRegion, {
    splitTip : "Drag to resize.",
    collapsibleSplitTip : "Drag to resize. Double click to hide.",
    useSplitTips : false,

    applyConfig : function(config){
        Roo.SplitLayoutRegion.superclass.applyConfig.call(this, config);
        if(config.split){
            if(!this.split){
                var splitEl = Roo.DomHelper.append(this.mgr.el.dom, 
                        {tag: "div", id: this.el.id + "-split", cls: "x-layout-split x-layout-split-"+this.position, html: "&#160;"});
                /** The SplitBar for this region 
                * @type Roo.SplitBar */
                this.split = new Roo.SplitBar(splitEl, this.el, this.orientation);
                this.split.on("moved", this.onSplitMove, this);
                this.split.useShim = config.useShim === true;
                this.split.getMaximumSize = this[this.position == 'north' || this.position == 'south' ? 'getVMaxSize' : 'getHMaxSize'].createDelegate(this);
                if(this.useSplitTips){
                    this.split.el.dom.title = config.collapsible ? this.collapsibleSplitTip : this.splitTip;
                }
                if(config.collapsible){
                    this.split.el.on("dblclick", this.collapse,  this);
                }
            }
            if(typeof config.minSize != "undefined"){
                this.split.minSize = config.minSize;
            }
            if(typeof config.maxSize != "undefined"){
                this.split.maxSize = config.maxSize;
            }
            if(config.hideWhenEmpty || config.hidden || config.collapsed){
                this.hideSplitter();
            }
        }
    },

    getHMaxSize : function(){
         var cmax = this.config.maxSize || 10000;
         var center = this.mgr.getRegion("center");
         return Math.min(cmax, (this.el.getWidth()+center.getEl().getWidth())-center.getMinWidth());
    },

    getVMaxSize : function(){
         var cmax = this.config.maxSize || 10000;
         var center = this.mgr.getRegion("center");
         return Math.min(cmax, (this.el.getHeight()+center.getEl().getHeight())-center.getMinHeight());
    },

    onSplitMove : function(split, newSize){
        this.fireEvent("resized", this, newSize);
    },
    
    /** 
     * Returns the {@link Roo.SplitBar} for this region.
     * @return {Roo.SplitBar}
     */
    getSplitBar : function(){
        return this.split;
    },
    
    hide : function(){
        this.hideSplitter();
        Roo.SplitLayoutRegion.superclass.hide.call(this);
    },

    hideSplitter : function(){
        if(this.split){
            this.split.el.setLocation(-2000,-2000);
            this.split.el.hide();
        }
    },

    show : function(){
        if(this.split){
            this.split.el.show();
        }
        Roo.SplitLayoutRegion.superclass.show.call(this);
    },
    
    beforeSlide: function(){
        if(Roo.isGecko){// firefox overflow auto bug workaround
            this.bodyEl.clip();
            if(this.tabs) this.tabs.bodyEl.clip();
            if(this.activePanel){
                this.activePanel.getEl().clip();
                
                if(this.activePanel.beforeSlide){
                    this.activePanel.beforeSlide();
                }
            }
        }
    },
    
    afterSlide : function(){
        if(Roo.isGecko){// firefox overflow auto bug workaround
            this.bodyEl.unclip();
            if(this.tabs) this.tabs.bodyEl.unclip();
            if(this.activePanel){
                this.activePanel.getEl().unclip();
                if(this.activePanel.afterSlide){
                    this.activePanel.afterSlide();
                }
            }
        }
    },

    initAutoHide : function(){
        if(this.autoHide !== false){
            if(!this.autoHideHd){
                var st = new Roo.util.DelayedTask(this.slideIn, this);
                this.autoHideHd = {
                    "mouseout": function(e){
                        if(!e.within(this.el, true)){
                            st.delay(500);
                        }
                    },
                    "mouseover" : function(e){
                        st.cancel();
                    },
                    scope : this
                };
            }
            this.el.on(this.autoHideHd);
        }
    },

    clearAutoHide : function(){
        if(this.autoHide !== false){
            this.el.un("mouseout", this.autoHideHd.mouseout);
            this.el.un("mouseover", this.autoHideHd.mouseover);
        }
    },

    clearMonitor : function(){
        Roo.get(document).un("click", this.slideInIf, this);
    },

    // these names are backwards but not changed for compat
    slideOut : function(){
        if(this.isSlid || this.el.hasActiveFx()){
            return;
        }
        this.isSlid = true;
        if(this.collapseBtn){
            this.collapseBtn.hide();
        }
        this.closeBtnState = this.closeBtn.getStyle('display');
        this.closeBtn.hide();
        if(this.stickBtn){
            this.stickBtn.show();
        }
        this.el.show();
        this.el.alignTo(this.collapsedEl, this.getCollapseAnchor());
        this.beforeSlide();
        this.el.setStyle("z-index", 10001);
        this.el.slideIn(this.getSlideAnchor(), {
            callback: function(){
                this.afterSlide();
                this.initAutoHide();
                Roo.get(document).on("click", this.slideInIf, this);
                this.fireEvent("slideshow", this);
            },
            scope: this,
            block: true
        });
    },

    afterSlideIn : function(){
        this.clearAutoHide();
        this.isSlid = false;
        this.clearMonitor();
        this.el.setStyle("z-index", "");
        if(this.collapseBtn){
            this.collapseBtn.show();
        }
        this.closeBtn.setStyle('display', this.closeBtnState);
        if(this.stickBtn){
            this.stickBtn.hide();
        }
        this.fireEvent("slidehide", this);
    },

    slideIn : function(cb){
        if(!this.isSlid || this.el.hasActiveFx()){
            Roo.callback(cb);
            return;
        }
        this.isSlid = false;
        this.beforeSlide();
        this.el.slideOut(this.getSlideAnchor(), {
            callback: function(){
                this.el.setLeftTop(-10000, -10000);
                this.afterSlide();
                this.afterSlideIn();
                Roo.callback(cb);
            },
            scope: this,
            block: true
        });
    },
    
    slideInIf : function(e){
        if(!e.within(this.el)){
            this.slideIn();
        }
    },

    animateCollapse : function(){
        this.beforeSlide();
        this.el.setStyle("z-index", 20000);
        var anchor = this.getSlideAnchor();
        this.el.slideOut(anchor, {
            callback : function(){
                this.el.setStyle("z-index", "");
                this.collapsedEl.slideIn(anchor, {duration:.3});
                this.afterSlide();
                this.el.setLocation(-10000,-10000);
                this.el.hide();
                this.fireEvent("collapsed", this);
            },
            scope: this,
            block: true
        });
    },

    animateExpand : function(){
        this.beforeSlide();
        this.el.alignTo(this.collapsedEl, this.getCollapseAnchor(), this.getExpandAdj());
        this.el.setStyle("z-index", 20000);
        this.collapsedEl.hide({
            duration:.1
        });
        this.el.slideIn(this.getSlideAnchor(), {
            callback : function(){
                this.el.setStyle("z-index", "");
                this.afterSlide();
                if(this.split){
                    this.split.el.show();
                }
                this.fireEvent("invalidated", this);
                this.fireEvent("expanded", this);
            },
            scope: this,
            block: true
        });
    },

    anchors : {
        "west" : "left",
        "east" : "right",
        "north" : "top",
        "south" : "bottom"
    },

    sanchors : {
        "west" : "l",
        "east" : "r",
        "north" : "t",
        "south" : "b"
    },

    canchors : {
        "west" : "tl-tr",
        "east" : "tr-tl",
        "north" : "tl-bl",
        "south" : "bl-tl"
    },

    getAnchor : function(){
        return this.anchors[this.position];
    },

    getCollapseAnchor : function(){
        return this.canchors[this.position];
    },

    getSlideAnchor : function(){
        return this.sanchors[this.position];
    },

    getAlignAdj : function(){
        var cm = this.cmargins;
        switch(this.position){
            case "west":
                return [0, 0];
            break;
            case "east":
                return [0, 0];
            break;
            case "north":
                return [0, 0];
            break;
            case "south":
                return [0, 0];
            break;
        }
    },

    getExpandAdj : function(){
        var c = this.collapsedEl, cm = this.cmargins;
        switch(this.position){
            case "west":
                return [-(cm.right+c.getWidth()+cm.left), 0];
            break;
            case "east":
                return [cm.right+c.getWidth()+cm.left, 0];
            break;
            case "north":
                return [0, -(cm.top+cm.bottom+c.getHeight())];
            break;
            case "south":
                return [0, cm.top+cm.bottom+c.getHeight()];
            break;
        }
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
/*
 * These classes are private internal classes
 */
Roo.CenterLayoutRegion = function(mgr, config){
    Roo.LayoutRegion.call(this, mgr, config, "center");
    this.visible = true;
    this.minWidth = config.minWidth || 20;
    this.minHeight = config.minHeight || 20;
};

Roo.extend(Roo.CenterLayoutRegion, Roo.LayoutRegion, {
    hide : function(){
        // center panel can't be hidden
    },
    
    show : function(){
        // center panel can't be hidden
    },
    
    getMinWidth: function(){
        return this.minWidth;
    },
    
    getMinHeight: function(){
        return this.minHeight;
    }
});


Roo.NorthLayoutRegion = function(mgr, config){
    Roo.LayoutRegion.call(this, mgr, config, "north", "n-resize");
    if(this.split){
        this.split.placement = Roo.SplitBar.TOP;
        this.split.orientation = Roo.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var size = config.initialSize || config.height;
    if(typeof size != "undefined"){
        this.el.setHeight(size);
    }
};
Roo.extend(Roo.NorthLayoutRegion, Roo.SplitLayoutRegion, {
    orientation: Roo.SplitBar.VERTICAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            box.height += this.split.el.getHeight();
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            box.height -= this.split.el.getHeight();
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y+box.height);
            this.split.el.setWidth(box.width);
        }
        if(this.collapsed){
            this.updateBody(box.width, null);
        }
        Roo.LayoutRegion.prototype.updateBox.call(this, box);
    }
});

Roo.SouthLayoutRegion = function(mgr, config){
    Roo.SplitLayoutRegion.call(this, mgr, config, "south", "s-resize");
    if(this.split){
        this.split.placement = Roo.SplitBar.BOTTOM;
        this.split.orientation = Roo.SplitBar.VERTICAL;
        this.split.el.addClass("x-layout-split-v");
    }
    var size = config.initialSize || config.height;
    if(typeof size != "undefined"){
        this.el.setHeight(size);
    }
};
Roo.extend(Roo.SouthLayoutRegion, Roo.SplitLayoutRegion, {
    orientation: Roo.SplitBar.VERTICAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            var sh = this.split.el.getHeight();
            box.height += sh;
            box.y -= sh;
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sh = this.split.el.getHeight();
            box.height -= sh;
            box.y += sh;
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y-sh);
            this.split.el.setWidth(box.width);
        }
        if(this.collapsed){
            this.updateBody(box.width, null);
        }
        Roo.LayoutRegion.prototype.updateBox.call(this, box);
    }
});

Roo.EastLayoutRegion = function(mgr, config){
    Roo.SplitLayoutRegion.call(this, mgr, config, "east", "e-resize");
    if(this.split){
        this.split.placement = Roo.SplitBar.RIGHT;
        this.split.orientation = Roo.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var size = config.initialSize || config.width;
    if(typeof size != "undefined"){
        this.el.setWidth(size);
    }
};
Roo.extend(Roo.EastLayoutRegion, Roo.SplitLayoutRegion, {
    orientation: Roo.SplitBar.HORIZONTAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            var sw = this.split.el.getWidth();
            box.width += sw;
            box.x -= sw;
        }
        return box;
    },

    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sw = this.split.el.getWidth();
            box.width -= sw;
            this.split.el.setLeft(box.x);
            this.split.el.setTop(box.y);
            this.split.el.setHeight(box.height);
            box.x += sw;
        }
        if(this.collapsed){
            this.updateBody(null, box.height);
        }
        Roo.LayoutRegion.prototype.updateBox.call(this, box);
    }
});

Roo.WestLayoutRegion = function(mgr, config){
    Roo.SplitLayoutRegion.call(this, mgr, config, "west", "w-resize");
    if(this.split){
        this.split.placement = Roo.SplitBar.LEFT;
        this.split.orientation = Roo.SplitBar.HORIZONTAL;
        this.split.el.addClass("x-layout-split-h");
    }
    var size = config.initialSize || config.width;
    if(typeof size != "undefined"){
        this.el.setWidth(size);
    }
};
Roo.extend(Roo.WestLayoutRegion, Roo.SplitLayoutRegion, {
    orientation: Roo.SplitBar.HORIZONTAL,
    getBox : function(){
        if(this.collapsed){
            return this.collapsedEl.getBox();
        }
        var box = this.el.getBox();
        if(this.split){
            box.width += this.split.el.getWidth();
        }
        return box;
    },
    
    updateBox : function(box){
        if(this.split && !this.collapsed){
            var sw = this.split.el.getWidth();
            box.width -= sw;
            this.split.el.setLeft(box.x+box.width);
            this.split.el.setTop(box.y);
            this.split.el.setHeight(box.height);
        }
        if(this.collapsed){
            this.updateBody(null, box.height);
        }
        Roo.LayoutRegion.prototype.updateBox.call(this, box);
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
 
 
/*
 * Private internal class for reading and applying state
 */
Roo.LayoutStateManager = function(layout){
     // default empty state
     this.state = {
        north: {},
        south: {},
        east: {},
        west: {}       
    };
};

Roo.LayoutStateManager.prototype = {
    init : function(layout, provider){
        this.provider = provider;
        var state = provider.get(layout.id+"-layout-state");
        if(state){
            var wasUpdating = layout.isUpdating();
            if(!wasUpdating){
                layout.beginUpdate();
            }
            for(var key in state){
                if(typeof state[key] != "function"){
                    var rstate = state[key];
                    var r = layout.getRegion(key);
                    if(r && rstate){
                        if(rstate.size){
                            r.resizeTo(rstate.size);
                        }
                        if(rstate.collapsed == true){
                            r.collapse(true);
                        }else{
                            r.expand(null, true);
                        }
                    }
                }
            }
            if(!wasUpdating){
                layout.endUpdate();
            }
            this.state = state; 
        }
        this.layout = layout;
        layout.on("regionresized", this.onRegionResized, this);
        layout.on("regioncollapsed", this.onRegionCollapsed, this);
        layout.on("regionexpanded", this.onRegionExpanded, this);
    },
    
    storeState : function(){
        this.provider.set(this.layout.id+"-layout-state", this.state);
    },
    
    onRegionResized : function(region, newSize){
        this.state[region.getPosition()].size = newSize;
        this.storeState();
    },
    
    onRegionCollapsed : function(region){
        this.state[region.getPosition()].collapsed = true;
        this.storeState();
    },
    
    onRegionExpanded : function(region){
        this.state[region.getPosition()].collapsed = false;
        this.storeState();
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
 * @class Roo.ContentPanel
 * @extends Roo.util.Observable
 * A basic ContentPanel element.
 * @cfg {Boolean} fitToFrame True for this panel to adjust its size to fit when the region resizes  (defaults to false)
 * @cfg {Boolean} fitContainer When using {@link #fitToFrame} and {@link #resizeEl}, you can also fit the parent container  (defaults to false)
 * @cfg {Boolean/Object} autoCreate True to auto generate the DOM element for this panel, or a {@link Roo.DomHelper} config of the element to create
 * @cfg {Boolean} closable True if the panel can be closed/removed
 * @cfg {Boolean} background True if the panel should not be activated when it is added (defaults to false)
 * @cfg {String/HTMLElement/Element} resizeEl An element to resize if {@link #fitToFrame} is true (instead of this panel's element)
 * @cfg {Toolbar} toolbar A toolbar for this panel
 * @cfg {Boolean} autoScroll True to scroll overflow in this panel (use with {@link #fitToFrame})
 * @cfg {String} title The title for this panel
 * @cfg {Array} adjustments Values to <b>add</b> to the width/height when doing a {@link #fitToFrame} (default is [0, 0])
 * @cfg {String} url Calls {@link #setUrl} with this value
 * @cfg {String/Object} params When used with {@link #url}, calls {@link #setUrl} with this value
 * @cfg {Boolean} loadOnce When used with {@link #url}, calls {@link #setUrl} with this value
 * @constructor
 * Create a new ContentPanel.
 * @param {String/HTMLElement/Roo.Element} el The container element for this panel
 * @param {String/Object} config A string to set only the title or a config object
 * @param {String} content (optional) Set the HTML content for this panel
 * @param {String} region (optional) Used by xtype constructors to add to regions. (values center,east,west,south,north)
 */
Roo.ContentPanel = function(el, config, content){
    
     
    /*
    if(el.autoCreate || el.xtype){ // xtype is available if this is called from factory
        config = el;
        el = Roo.id();
    }
    if (config && config.parentLayout) { 
        el = config.parentLayout.el.createChild(); 
    }
    */
    if(el.autoCreate){ // xtype is available if this is called from factory
        config = el;
        el = Roo.id();
    }
    this.el = Roo.get(el);
    if(!this.el && config && config.autoCreate){
        if(typeof config.autoCreate == "object"){
            if(!config.autoCreate.id){
                config.autoCreate.id = config.id||el;
            }
            this.el = Roo.DomHelper.append(document.body,
                        config.autoCreate, true);
        }else{
            this.el = Roo.DomHelper.append(document.body,
                        {tag: "div", cls: "x-layout-inactive-content", id: config.id||el}, true);
        }
    }
    this.closable = false;
    this.loaded = false;
    this.active = false;
    if(typeof config == "string"){
        this.title = config;
    }else{
        Roo.apply(this, config);
    }
    
    if (this.toolbar && !this.toolbar.el && this.toolbar.xtype) {
        this.wrapEl = this.el.wrap();    
        this.toolbar = new Roo.Toolbar(this.el.insertSibling(false, 'before'), [] , this.toolbar);
        
    }
    
    
    
    if(this.resizeEl){
        this.resizeEl = Roo.get(this.resizeEl, true);
    }else{
        this.resizeEl = this.el;
    }
    this.addEvents({
        /**
         * @event activate
         * Fires when this panel is activated. 
         * @param {Roo.ContentPanel} this
         */
        "activate" : true,
        /**
         * @event deactivate
         * Fires when this panel is activated. 
         * @param {Roo.ContentPanel} this
         */
        "deactivate" : true,

        /**
         * @event resize
         * Fires when this panel is resized if fitToFrame is true.
         * @param {Roo.ContentPanel} this
         * @param {Number} width The width after any component adjustments
         * @param {Number} height The height after any component adjustments
         */
        "resize" : true
    });
    if(this.autoScroll){
        this.resizeEl.setStyle("overflow", "auto");
    }
    content = content || this.content;
    if(content){
        this.setContent(content);
    }
    if(config && config.url){
        this.setUrl(this.url, this.params, this.loadOnce);
    }
    
    
    
    Roo.ContentPanel.superclass.constructor.call(this);
};

Roo.extend(Roo.ContentPanel, Roo.util.Observable, {
    tabTip:'',
    setRegion : function(region){
        this.region = region;
        if(region){
           this.el.replaceClass("x-layout-inactive-content", "x-layout-active-content");
        }else{
           this.el.replaceClass("x-layout-active-content", "x-layout-inactive-content");
        } 
    },
    
    /**
     * Returns the toolbar for this Panel if one was configured. 
     * @return {Roo.Toolbar} 
     */
    getToolbar : function(){
        return this.toolbar;
    },
    
    setActiveState : function(active){
        this.active = active;
        if(!active){
            this.fireEvent("deactivate", this);
        }else{
            this.fireEvent("activate", this);
        }
    },
    /**
     * Updates this panel's element
     * @param {String} content The new content
     * @param {Boolean} loadScripts (optional) true to look for and process scripts
    */
    setContent : function(content, loadScripts){
        this.el.update(content, loadScripts);
    },

    ignoreResize : function(w, h){
        if(this.lastSize && this.lastSize.width == w && this.lastSize.height == h){
            return true;
        }else{
            this.lastSize = {width: w, height: h};
            return false;
        }
    },
    /**
     * Get the {@link Roo.UpdateManager} for this panel. Enables you to perform Ajax updates.
     * @return {Roo.UpdateManager} The UpdateManager
     */
    getUpdateManager : function(){
        return this.el.getUpdateManager();
    },
     /**
     * Loads this content panel immediately with content from XHR. Note: to delay loading until the panel is activated, use {@link #setUrl}.
     * @param {Object/String/Function} url The url for this request or a function to call to get the url or a config object containing any of the following options:
<pre><code>
panel.load({
    url: "your-url.php",
    params: {param1: "foo", param2: "bar"}, // or a URL encoded string
    callback: yourFunction,
    scope: yourObject, //(optional scope)
    discardUrl: false,
    nocache: false,
    text: "Loading...",
    timeout: 30,
    scripts: false
});
</code></pre>
     * The only required property is <i>url</i>. The optional properties <i>nocache</i>, <i>text</i> and <i>scripts</i>
     * are shorthand for <i>disableCaching</i>, <i>indicatorText</i> and <i>loadScripts</i> and are used to set their associated property on this panel UpdateManager instance.
     * @param {String/Object} params (optional) The parameters to pass as either a URL encoded string "param1=1&amp;param2=2" or an object {param1: 1, param2: 2}
     * @param {Function} callback (optional) Callback when transaction is complete -- called with signature (oElement, bSuccess, oResponse)
     * @param {Boolean} discardUrl (optional) By default when you execute an update the defaultUrl is changed to the last used URL. If true, it will not store the URL.
     * @return {Roo.ContentPanel} this
     */
    load : function(){
        var um = this.el.getUpdateManager();
        um.update.apply(um, arguments);
        return this;
    },


    /**
     * Set a URL to be used to load the content for this panel. When this panel is activated, the content will be loaded from that URL.
     * @param {String/Function} url The URL to load the content from or a function to call to get the URL
     * @param {String/Object} params (optional) The string params for the update call or an object of the params. See {@link Roo.UpdateManager#update} for more details. (Defaults to null)
     * @param {Boolean} loadOnce (optional) Whether to only load the content once. If this is false it makes the Ajax call every time this panel is activated. (Defaults to false)
     * @return {Roo.UpdateManager} The UpdateManager
     */
    setUrl : function(url, params, loadOnce){
        if(this.refreshDelegate){
            this.removeListener("activate", this.refreshDelegate);
        }
        this.refreshDelegate = this._handleRefresh.createDelegate(this, [url, params, loadOnce]);
        this.on("activate", this.refreshDelegate);
        return this.el.getUpdateManager();
    },
    
    _handleRefresh : function(url, params, loadOnce){
        if(!loadOnce || !this.loaded){
            var updater = this.el.getUpdateManager();
            updater.update(url, params, this._setLoaded.createDelegate(this));
        }
    },
    
    _setLoaded : function(){
        this.loaded = true;
    }, 
    
    /**
     * Returns this panel's id
     * @return {String} 
     */
    getId : function(){
        return this.el.id;
    },
    
    /** 
     * Returns this panel's element - used by regiosn to add.
     * @return {Roo.Element} 
     */
    getEl : function(){
        return this.wrapEl || this.el;
    },
    
    adjustForComponents : function(width, height){
        if(this.resizeEl != this.el){
            width -= this.el.getFrameWidth('lr');
            height -= this.el.getFrameWidth('tb');
        }
        if(this.toolbar){
            var te = this.toolbar.getEl();
            height -= te.getHeight();
            te.setWidth(width);
        }
        if(this.adjustments){
            width += this.adjustments[0];
            height += this.adjustments[1];
        }
        return {"width": width, "height": height};
    },
    
    setSize : function(width, height){
        if(this.fitToFrame && !this.ignoreResize(width, height)){
            if(this.fitContainer && this.resizeEl != this.el){
                this.el.setSize(width, height);
            }
            var size = this.adjustForComponents(width, height);
            this.resizeEl.setSize(this.autoWidth ? "auto" : size.width, this.autoHeight ? "auto" : size.height);
            this.fireEvent('resize', this, size.width, size.height);
        }
    },
    
    /**
     * Returns this panel's title
     * @return {String} 
     */
    getTitle : function(){
        return this.title;
    },
    
    /**
     * Set this panel's title
     * @param {String} title
     */
    setTitle : function(title){
        this.title = title;
        if(this.region){
            this.region.updatePanelTitle(this, title);
        }
    },
    
    /**
     * Returns true is this panel was configured to be closable
     * @return {Boolean} 
     */
    isClosable : function(){
        return this.closable;
    },
    
    beforeSlide : function(){
        this.el.clip();
        this.resizeEl.clip();
    },
    
    afterSlide : function(){
        this.el.unclip();
        this.resizeEl.unclip();
    },
    
    /**
     *   Force a content refresh from the URL specified in the {@link #setUrl} method.
     *   Will fail silently if the {@link #setUrl} method has not been called.
     *   This does not activate the panel, just updates its content.
     */
    refresh : function(){
        if(this.refreshDelegate){
           this.loaded = false;
           this.refreshDelegate();
        }
    },
    
    /**
     * Destroys this panel
     */
    destroy : function(){
        this.el.removeAllListeners();
        var tempEl = document.createElement("span");
        tempEl.appendChild(this.el.dom);
        tempEl.innerHTML = "";
        this.el.remove();
        this.el = null;
    },
    
      /**
     * Adds a xtype elements to the panel - currently only supports Forms.
     * <pre><code>

layout.addxtype({
       xtype : 'Form',
       items: [ .... ]
   }
);

</code></pre>
     * @param {Object} cfg Xtype definition of item to add.
     */
    
    addxtype : function(cfg) {
        // add form..
        if (!cfg.xtype.match(/^Form$/)) {
            return false;
        }
        var el = this.el.createChild();

        this.form = new  Roo.form.Form(cfg);
        
        
        if ( this.form.allItems.length) this.form.render(el.dom);
        return this.form;
        
    }
});

/**
 * @class Roo.GridPanel
 * @extends Roo.ContentPanel
 * @constructor
 * Create a new GridPanel.
 * @param {Roo.grid.Grid} grid The grid for this panel
 * @param {String/Object} config A string to set only the panel's title, or a config object
 */
Roo.GridPanel = function(grid, config){
    
  
    this.wrapper = Roo.DomHelper.append(document.body, // wrapper for IE7 strict & safari scroll issue
        {tag: "div", cls: "x-layout-grid-wrapper x-layout-inactive-content"}, true);
        
    this.wrapper.dom.appendChild(grid.getGridEl().dom);
    
    Roo.GridPanel.superclass.constructor.call(this, this.wrapper, config);
    
    if(this.toolbar){
        this.toolbar.el.insertBefore(this.wrapper.dom.firstChild);
    }
    // xtype created footer. - not sure if will work as we normally have to render first..
    if (this.footer && !this.footer.el && this.footer.xtype) {
        
        this.footer.container = this.grid.getView().getFooterPanel(true);
        this.footer.dataSource = this.grid.dataSource;
        this.footer = Roo.factory(this.footer, Roo);
        
    }
    
    grid.monitorWindowResize = false; // turn off autosizing
    grid.autoHeight = false;
    grid.autoWidth = false;
    this.grid = grid;
    this.grid.getGridEl().replaceClass("x-layout-inactive-content", "x-layout-component-panel");
};

Roo.extend(Roo.GridPanel, Roo.ContentPanel, {
    getId : function(){
        return this.grid.id;
    },
    
    /**
     * Returns the grid for this panel
     * @return {Roo.grid.Grid} 
     */
    getGrid : function(){
        return this.grid;    
    },
    
    setSize : function(width, height){
        if(!this.ignoreResize(width, height)){
            var grid = this.grid;
            var size = this.adjustForComponents(width, height);
            grid.getGridEl().setSize(size.width, size.height);
            grid.autoSize();
        }
    },
    
    beforeSlide : function(){
        this.grid.getView().scroller.clip();
    },
    
    afterSlide : function(){
        this.grid.getView().scroller.unclip();
    },
    
    destroy : function(){
        this.grid.destroy();
        delete this.grid;
        Roo.GridPanel.superclass.destroy.call(this); 
    }
});


/**
 * @class Roo.NestedLayoutPanel
 * @extends Roo.ContentPanel
 * @constructor
 * Create a new NestedLayoutPanel.
 * 
 * 
 * @param {Roo.BorderLayout} layout The layout for this panel
 * @param {String/Object} config A string to set only the title or a config object
 */
Roo.NestedLayoutPanel = function(layout, config)
{
    // construct with only one argument..
    /* FIXME - implement nicer consturctors
    if (layout.layout) {
        config = layout;
        layout = config.layout;
        delete config.layout;
    }
    if (layout.xtype && !layout.getEl) {
        // then layout needs constructing..
        layout = Roo.factory(layout, Roo);
    }
    */
    
    Roo.NestedLayoutPanel.superclass.constructor.call(this, layout.getEl(), config);
    
    layout.monitorWindowResize = false; // turn off autosizing
    this.layout = layout;
    this.layout.getEl().addClass("x-layout-nested-layout");
    
    
    
};

Roo.extend(Roo.NestedLayoutPanel, Roo.ContentPanel, {

    setSize : function(width, height){
        if(!this.ignoreResize(width, height)){
            var size = this.adjustForComponents(width, height);
            var el = this.layout.getEl();
            el.setSize(size.width, size.height);
            var touch = el.dom.offsetWidth;
            this.layout.layout();
            // ie requires a double layout on the first pass
            if(Roo.isIE && !this.initialized){
                this.initialized = true;
                this.layout.layout();
            }
        }
    },
    
    // activate all subpanels if not currently active..
    
    setActiveState : function(active){
        this.active = active;
        if(!active){
            this.fireEvent("deactivate", this);
            return;
        }
        
        this.fireEvent("activate", this);
        // not sure if this should happen before or after..
        if (!this.layout) {
            return; // should not happen..
        }
        var reg = false;
        for (var r in this.layout.regions) {
            reg = this.layout.getRegion(r);
            if (reg.getActivePanel()) {
                //reg.showPanel(reg.getActivePanel()); // force it to activate.. 
                reg.setActivePanel(reg.getActivePanel());
                continue;
            }
            if (!reg.panels.length) {
                continue;
            }
            reg.showPanel(reg.getPanel(0));
        }
        
        
        
        
    },
    
    /**
     * Returns the nested BorderLayout for this panel
     * @return {Roo.BorderLayout} 
     */
    getLayout : function(){
        return this.layout;
    },
    
     /**
     * Adds a xtype elements to the layout of the nested panel
     * <pre><code>

panel.addxtype({
       xtype : 'ContentPanel',
       region: 'west',
       items: [ .... ]
   }
);

panel.addxtype({
        xtype : 'NestedLayoutPanel',
        region: 'west',
        layout: {
           center: { },
           west: { }   
        },
        items : [ ... list of content panels or nested layout panels.. ]
   }
);
</code></pre>
     * @param {Object} cfg Xtype definition of item to add.
     */
    addxtype : function(cfg) {
        return this.layout.addxtype(cfg);
    
    }
});

Roo.ScrollPanel = function(el, config, content){
    config = config || {};
    config.fitToFrame = true;
    Roo.ScrollPanel.superclass.constructor.call(this, el, config, content);
    
    this.el.dom.style.overflow = "hidden";
    var wrap = this.el.wrap({cls: "x-scroller x-layout-inactive-content"});
    this.el.removeClass("x-layout-inactive-content");
    this.el.on("mousewheel", this.onWheel, this);

    var up = wrap.createChild({cls: "x-scroller-up", html: "&#160;"}, this.el.dom);
    var down = wrap.createChild({cls: "x-scroller-down", html: "&#160;"});
    up.unselectable(); down.unselectable();
    up.on("click", this.scrollUp, this);
    down.on("click", this.scrollDown, this);
    up.addClassOnOver("x-scroller-btn-over");
    down.addClassOnOver("x-scroller-btn-over");
    up.addClassOnClick("x-scroller-btn-click");
    down.addClassOnClick("x-scroller-btn-click");
    this.adjustments = [0, -(up.getHeight() + down.getHeight())];

    this.resizeEl = this.el;
    this.el = wrap; this.up = up; this.down = down;
};

Roo.extend(Roo.ScrollPanel, Roo.ContentPanel, {
    increment : 100,
    wheelIncrement : 5,
    scrollUp : function(){
        this.resizeEl.scroll("up", this.increment, {callback: this.afterScroll, scope: this});
    },

    scrollDown : function(){
        this.resizeEl.scroll("down", this.increment, {callback: this.afterScroll, scope: this});
    },

    afterScroll : function(){
        var el = this.resizeEl;
        var t = el.dom.scrollTop, h = el.dom.scrollHeight, ch = el.dom.clientHeight;
        this.up[t == 0 ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
        this.down[h - t <= ch ? "addClass" : "removeClass"]("x-scroller-btn-disabled");
    },

    setSize : function(){
        Roo.ScrollPanel.superclass.setSize.apply(this, arguments);
        this.afterScroll();
    },

    onWheel : function(e){
        var d = e.getWheelDelta();
        this.resizeEl.dom.scrollTop -= (d*this.wheelIncrement);
        this.afterScroll();
        e.stopEvent();
    },

    setContent : function(content, loadScripts){
        this.resizeEl.update(content, loadScripts);
    }

});









/**
 * @class Roo.TreePanel
 * @extends Roo.ContentPanel
 * @constructor
 * Create a new TreePanel.
 * @param {String/Object} config A string to set only the panel's title, or a config object
 * @cfg {Roo.tree.TreePanel} tree The tree TreePanel, with config etc.
 */
Roo.TreePanel = function(config){
    var el = config.el;
    var tree = config.tree;
    delete config.tree; 
    delete config.el; // hopefull!
    Roo.TreePanel.superclass.constructor.call(this, el, config);
    var treeEl = el.createChild();
    this.tree = new Roo.tree.TreePanel(treeEl , tree);
    //console.log(tree);
    this.on('activate', function()
    {
        if (this.tree.rendered) {
            return;
        }
        //console.log('render tree');
        this.tree.render();
    });
    
    this.on('resize',  function (cp, w, h) {
            this.tree.innerCt.setWidth(w);
            this.tree.innerCt.setHeight(h);
            this.tree.innerCt.setStyle('overflow-y', 'auto');
    });

        
    
};

Roo.extend(Roo.TreePanel, Roo.ContentPanel);











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
 * @class Roo.ReaderLayout
 * @extends Roo.BorderLayout
 * This is a pre-built layout that represents a classic, 5-pane application.  It consists of a header, a primary
 * center region containing two nested regions (a top one for a list view and one for item preview below),
 * and regions on either side that can be used for navigation, application commands, informational displays, etc.
 * The setup and configuration work exactly the same as it does for a {@link Roo.BorderLayout} - this class simply
 * expedites the setup of the overall layout and regions for this common application style.
 * Example:
 <pre><code>
var reader = new Roo.ReaderLayout();
var CP = Roo.ContentPanel;  // shortcut for adding

reader.beginUpdate();
reader.add("north", new CP("north", "North"));
reader.add("west", new CP("west", {title: "West"}));
reader.add("east", new CP("east", {title: "East"}));

reader.regions.listView.add(new CP("listView", "List"));
reader.regions.preview.add(new CP("preview", "Preview"));
reader.endUpdate();
</code></pre>
* @constructor
* Create a new ReaderLayout
* @param {Object} config Configuration options
* @param {String/HTMLElement/Element} container (optional) The container this layout is bound to (defaults to
* document.body if omitted)
*/
Roo.ReaderLayout = function(config, renderTo){
    var c = config || {size:{}};
    Roo.ReaderLayout.superclass.constructor.call(this, renderTo || document.body, {
        north: c.north !== false ? Roo.apply({
            split:false,
            initialSize: 32,
            titlebar: false
        }, c.north) : false,
        west: c.west !== false ? Roo.apply({
            split:true,
            initialSize: 200,
            minSize: 175,
            maxSize: 400,
            titlebar: true,
            collapsible: true,
            animate: true,
            margins:{left:5,right:0,bottom:5,top:5},
            cmargins:{left:5,right:5,bottom:5,top:5}
        }, c.west) : false,
        east: c.east !== false ? Roo.apply({
            split:true,
            initialSize: 200,
            minSize: 175,
            maxSize: 400,
            titlebar: true,
            collapsible: true,
            animate: true,
            margins:{left:0,right:5,bottom:5,top:5},
            cmargins:{left:5,right:5,bottom:5,top:5}
        }, c.east) : false,
        center: Roo.apply({
            tabPosition: 'top',
            autoScroll:false,
            closeOnTab: true,
            titlebar:false,
            margins:{left:c.west!==false ? 0 : 5,right:c.east!==false ? 0 : 5,bottom:5,top:2}
        }, c.center)
    });

    this.el.addClass('x-reader');

    this.beginUpdate();

    var inner = new Roo.BorderLayout(Roo.get(document.body).createChild(), {
        south: c.preview !== false ? Roo.apply({
            split:true,
            initialSize: 200,
            minSize: 100,
            autoScroll:true,
            collapsible:true,
            titlebar: true,
            cmargins:{top:5,left:0, right:0, bottom:0}
        }, c.preview) : false,
        center: Roo.apply({
            autoScroll:false,
            titlebar:false,
            minHeight:200
        }, c.listView)
    });
    this.add('center', new Roo.NestedLayoutPanel(inner,
            Roo.apply({title: c.mainTitle || '',tabTip:''},c.innerPanelCfg)));

    this.endUpdate();

    this.regions.preview = inner.getRegion('south');
    this.regions.listView = inner.getRegion('center');
};

Roo.extend(Roo.ReaderLayout, Roo.BorderLayout);/*
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
 * @class Roo.grid.Grid
 * @extends Roo.util.Observable
 * This class represents the primary interface of a component based grid control.
 * <br><br>Usage:<pre><code>
 var grid = new Roo.grid.Grid("my-container-id", {
     ds: myDataStore,
     cm: myColModel,
     selModel: mySelectionModel,
     autoSizeColumns: true,
     monitorWindowResize: false,
     trackMouseOver: true
 });
 // set any options
 grid.render();
 * </code></pre>
 * <b>Common Problems:</b><br/>
 * - Grid does not resize properly when going smaller: Setting overflow hidden on the container
 * element will correct this<br/>
 * - If you get el.style[camel]= NaNpx or -2px or something related, be certain you have given your container element
 * dimensions. The grid adapts to your container's size, if your container has no size defined then the results
 * are unpredictable.<br/>
 * - Do not render the grid into an element with display:none. Try using visibility:hidden. Otherwise there is no way for the
 * grid to calculate dimensions/offsets.<br/>
  * @constructor
 * @param {String/HTMLElement/Roo.Element} container The element into which this grid will be rendered -
 * The container MUST have some type of size defined for the grid to fill. The container will be
 * automatically set to position relative if it isn't already.
 * @param {Object} config A config object that sets properties on this grid.
 */
Roo.grid.Grid = function(container, config){
	// initialize the container
	this.container = Roo.get(container);
	this.container.update("");
	this.container.setStyle("overflow", "hidden");
    this.container.addClass('x-grid-container');

    this.id = this.container.id;

    Roo.apply(this, config);
    // check and correct shorthanded configs
    if(this.ds){
        this.dataSource = this.ds;
        delete this.ds;
    }
    if(this.cm){
        this.colModel = this.cm;
        delete this.cm;
    }
    if(this.sm){
        this.selModel = this.sm;
        delete this.sm;
    }

    if (this.selModel) {
        this.selModel = Roo.factory(this.selModel, Roo.grid);
        this.sm = this.selModel;
        this.sm.xmodule = this.xmodule || false;
    }
    if (typeof(this.colModel.config) == 'undefined') {
        this.colModel = new Roo.grid.ColumnModel(this.colModel);
        this.cm = this.colModel;
        this.cm.xmodule = this.xmodule || false;
    }
    if (this.dataSource) {
        this.dataSource= Roo.factory(this.dataSource, Roo.data);
        this.ds = this.dataSource;
        this.ds.xmodule = this.xmodule || false;
        
    }
    
    
    
    if(this.width){
        this.container.setWidth(this.width);
    }

    if(this.height){
        this.container.setHeight(this.height);
    }
    /** @private */
	this.addEvents({
	    // raw events
	    /**
	     * @event click
	     * The raw click event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "click" : true,
	    /**
	     * @event dblclick
	     * The raw dblclick event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "dblclick" : true,
	    /**
	     * @event contextmenu
	     * The raw contextmenu event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "contextmenu" : true,
	    /**
	     * @event mousedown
	     * The raw mousedown event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "mousedown" : true,
	    /**
	     * @event mouseup
	     * The raw mouseup event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "mouseup" : true,
	    /**
	     * @event mouseover
	     * The raw mouseover event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "mouseover" : true,
	    /**
	     * @event mouseout
	     * The raw mouseout event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "mouseout" : true,
	    /**
	     * @event keypress
	     * The raw keypress event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "keypress" : true,
	    /**
	     * @event keydown
	     * The raw keydown event for the entire grid.
	     * @param {Roo.EventObject} e
	     */
	    "keydown" : true,

	    // custom events

	    /**
	     * @event cellclick
	     * Fires when a cell is clicked
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Number} columnIndex
	     * @param {Roo.EventObject} e
	     */
	    "cellclick" : true,
	    /**
	     * @event celldblclick
	     * Fires when a cell is double clicked
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Number} columnIndex
	     * @param {Roo.EventObject} e
	     */
	    "celldblclick" : true,
	    /**
	     * @event rowclick
	     * Fires when a row is clicked
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Roo.EventObject} e
	     */
	    "rowclick" : true,
	    /**
	     * @event rowdblclick
	     * Fires when a row is double clicked
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Roo.EventObject} e
	     */
	    "rowdblclick" : true,
	    /**
	     * @event headerclick
	     * Fires when a header is clicked
	     * @param {Grid} this
	     * @param {Number} columnIndex
	     * @param {Roo.EventObject} e
	     */
	    "headerclick" : true,
	    /**
	     * @event headerdblclick
	     * Fires when a header cell is double clicked
	     * @param {Grid} this
	     * @param {Number} columnIndex
	     * @param {Roo.EventObject} e
	     */
	    "headerdblclick" : true,
	    /**
	     * @event rowcontextmenu
	     * Fires when a row is right clicked
	     * @param {Grid} this
	     * @param {Number} rowIndex
	     * @param {Roo.EventObject} e
	     */
	    "rowcontextmenu" : true,
	    /**
         * @event cellcontextmenu
         * Fires when a cell is right clicked
         * @param {Grid} this
         * @param {Number} rowIndex
         * @param {Number} cellIndex
         * @param {Roo.EventObject} e
         */
         "cellcontextmenu" : true,
	    /**
	     * @event headercontextmenu
	     * Fires when a header is right clicked
	     * @param {Grid} this
	     * @param {Number} columnIndex
	     * @param {Roo.EventObject} e
	     */
	    "headercontextmenu" : true,
	    /**
	     * @event bodyscroll
	     * Fires when the body element is scrolled
	     * @param {Number} scrollLeft
	     * @param {Number} scrollTop
	     */
	    "bodyscroll" : true,
	    /**
	     * @event columnresize
	     * Fires when the user resizes a column
	     * @param {Number} columnIndex
	     * @param {Number} newSize
	     */
	    "columnresize" : true,
	    /**
	     * @event columnmove
	     * Fires when the user moves a column
	     * @param {Number} oldIndex
	     * @param {Number} newIndex
	     */
	    "columnmove" : true,
	    /**
	     * @event startdrag
	     * Fires when row(s) start being dragged
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {event} e The raw browser event
	     */
	    "startdrag" : true,
	    /**
	     * @event enddrag
	     * Fires when a drag operation is complete
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {event} e The raw browser event
	     */
	    "enddrag" : true,
	    /**
	     * @event dragdrop
	     * Fires when dragged row(s) are dropped on a valid DD target
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {String} targetId The target drag drop object
	     * @param {event} e The raw browser event
	     */
	    "dragdrop" : true,
	    /**
	     * @event dragover
	     * Fires while row(s) are being dragged. "targetId" is the id of the Yahoo.util.DD object the selected rows are being dragged over.
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {String} targetId The target drag drop object
	     * @param {event} e The raw browser event
	     */
	    "dragover" : true,
	    /**
	     * @event dragenter
	     *  Fires when the dragged row(s) first cross another DD target while being dragged
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {String} targetId The target drag drop object
	     * @param {event} e The raw browser event
	     */
	    "dragenter" : true,
	    /**
	     * @event dragout
	     * Fires when the dragged row(s) leave another DD target while being dragged
	     * @param {Grid} this
	     * @param {Roo.GridDD} dd The drag drop object
	     * @param {String} targetId The target drag drop object
	     * @param {event} e The raw browser event
	     */
	    "dragout" : true,
        /**
         * @event render
         * Fires when the grid is rendered
         * @param {Grid} grid
         */
        render : true
    });

    Roo.grid.Grid.superclass.constructor.call(this);
};
Roo.extend(Roo.grid.Grid, Roo.util.Observable, {
    /**
     * @cfg {Number} minColumnWidth The minimum width a column can be resized to. Default is 25.
	 */
	minColumnWidth : 25,

    /**
	 * @cfg {Boolean} autoSizeColumns True to automatically resize the columns to fit their content
	 * <b>on initial render.</b> It is more efficient to explicitly size the columns
	 * through the ColumnModel's {@link Roo.grid.ColumnModel#width} config option.  Default is false.
	 */
	autoSizeColumns : false,

	/**
	 * @cfg {Boolean} autoSizeHeaders True to measure headers with column data when auto sizing columns. Default is true.
	 */
	autoSizeHeaders : true,

	/**
	 * @cfg {Boolean} monitorWindowResize True to autoSize the grid when the window resizes. Default is true.
	 */
	monitorWindowResize : true,

	/**
	 * @cfg {Boolean} maxRowsToMeasure If autoSizeColumns is on, maxRowsToMeasure can be used to limit the number of
	 * rows measured to get a columns size. Default is 0 (all rows).
	 */
	maxRowsToMeasure : 0,

	/**
	 * @cfg {Boolean} trackMouseOver True to highlight rows when the mouse is over. Default is true.
	 */
	trackMouseOver : true,

	/**
	 * @cfg {Boolean} enableDragDrop True to enable drag and drop of rows. Default is false.
	 */
	enableDragDrop : false,

	/**
	 * @cfg {Boolean} enableColumnMove True to enable drag and drop reorder of columns. Default is true.
	 */
	enableColumnMove : true,

	/**
	 * @cfg {Boolean} enableColumnHide True to enable hiding of columns with the header context menu. Default is true.
	 */
	enableColumnHide : true,

	/**
	 * @cfg {Boolean} enableRowHeightSync True to manually sync row heights across locked and not locked rows. Default is false.
	 */
	enableRowHeightSync : false,

	/**
	 * @cfg {Boolean} stripeRows True to stripe the rows.  Default is true.
	 */
	stripeRows : true,

	/**
	 * @cfg {Boolean} autoHeight True to fit the height of the grid container to the height of the data. Default is false.
	 */
	autoHeight : false,

    /**
     * @cfg {String} autoExpandColumn The id (or dataIndex) of a column in this grid that should expand to fill unused space. This id can not be 0. Default is false.
     */
    autoExpandColumn : false,

    /**
    * @cfg {Number} autoExpandMin The minimum width the autoExpandColumn can have (if enabled).
    * Default is 50.
    */
    autoExpandMin : 50,

    /**
    * @cfg {Number} autoExpandMax The maximum width the autoExpandColumn can have (if enabled). Default is 1000.
    */
    autoExpandMax : 1000,

    /**
	 * @cfg {Object} view The {@link Roo.grid.GridView} used by the grid. This can be set before a call to render().
	 */
	view : null,

	/**
     * @cfg {Object} loadMask An {@link Roo.LoadMask} config or true to mask the grid while loading. Default is false.
	 */
	loadMask : false,

    // private
    rendered : false,

    /**
    * @cfg {Boolean} autoWidth True to set the grid's width to the default total width of the grid's columns instead
    * of a fixed width. Default is false.
    */
    /**
    * @cfg {Number} maxHeight Sets the maximum height of the grid - ignored if autoHeight is not on.
    */
    /**
     * Called once after all setup has been completed and the grid is ready to be rendered.
     * @return {Roo.grid.Grid} this
     */
    render : function(){
        var c = this.container;
        // try to detect autoHeight/width mode
        if((!c.dom.offsetHeight || c.dom.offsetHeight < 20) || c.getStyle("height") == "auto"){
    	    this.autoHeight = true;
    	}
    	var view = this.getView();
        view.init(this);

        c.on("click", this.onClick, this);
        c.on("dblclick", this.onDblClick, this);
        c.on("contextmenu", this.onContextMenu, this);
        c.on("keydown", this.onKeyDown, this);

        this.relayEvents(c, ["mousedown","mouseup","mouseover","mouseout","keypress"]);

        this.getSelectionModel().init(this);

        view.render();

        if(this.loadMask){
            this.loadMask = new Roo.LoadMask(this.container,
                    Roo.apply({store:this.dataSource}, this.loadMask));
        }
        
        
        if (this.toolbar && this.toolbar.xtype) {
            this.toolbar.container = this.getView().getHeaderPanel(true);
            this.toolbar = new Ext.Toolbar(this.toolbar);
        }
        if (this.footer && this.footer.xtype) {
            this.footer.dataSource = this.getDataSource();
            this.footer.container = this.getView().getFooterPanel(true);
            this.footer = Roo.factory(this.footer, Roo);
        }
        this.rendered = true;
        this.fireEvent('render', this);
        return this;
    },

	/**
	 * Reconfigures the grid to use a different Store and Column Model.
	 * The View will be bound to the new objects and refreshed.
	 * @param {Roo.data.Store} dataSource The new {@link Roo.data.Store} object
	 * @param {Roo.grid.ColumnModel} The new {@link Roo.grid.ColumnModel} object
	 */
    reconfigure : function(dataSource, colModel){
        if(this.loadMask){
            this.loadMask.destroy();
            this.loadMask = new Roo.LoadMask(this.container,
                    Roo.apply({store:dataSource}, this.loadMask));
        }
        this.view.bind(dataSource, colModel);
        this.dataSource = dataSource;
        this.colModel = colModel;
        this.view.refresh(true);
    },

    // private
    onKeyDown : function(e){
        this.fireEvent("keydown", e);
    },

    /**
     * Destroy this grid.
     * @param {Boolean} removeEl True to remove the element
     */
    destroy : function(removeEl, keepListeners){
        if(this.loadMask){
            this.loadMask.destroy();
        }
        var c = this.container;
        c.removeAllListeners();
        this.view.destroy();
        this.colModel.purgeListeners();
        if(!keepListeners){
            this.purgeListeners();
        }
        c.update("");
        if(removeEl === true){
            c.remove();
        }
    },

    // private
    processEvent : function(name, e){
        this.fireEvent(name, e);
        var t = e.getTarget();
        var v = this.view;
        var header = v.findHeaderIndex(t);
        if(header !== false){
            this.fireEvent("header" + name, this, header, e);
        }else{
            var row = v.findRowIndex(t);
            var cell = v.findCellIndex(t);
            if(row !== false){
                this.fireEvent("row" + name, this, row, e);
                if(cell !== false){
                    this.fireEvent("cell" + name, this, row, cell, e);
                }
            }
        }
    },

    // private
    onClick : function(e){
        this.processEvent("click", e);
    },

    // private
    onContextMenu : function(e, t){
        this.processEvent("contextmenu", e);
    },

    // private
    onDblClick : function(e){
        this.processEvent("dblclick", e);
    },

    // private
    walkCells : function(row, col, step, fn, scope){
        var cm = this.colModel, clen = cm.getColumnCount();
        var ds = this.dataSource, rlen = ds.getCount(), first = true;
        if(step < 0){
            if(col < 0){
                row--;
                first = false;
            }
            while(row >= 0){
                if(!first){
                    col = clen-1;
                }
                first = false;
                while(col >= 0){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col--;
                }
                row--;
            }
        } else {
            if(col >= clen){
                row++;
                first = false;
            }
            while(row < rlen){
                if(!first){
                    col = 0;
                }
                first = false;
                while(col < clen){
                    if(fn.call(scope || this, row, col, cm) === true){
                        return [row, col];
                    }
                    col++;
                }
                row++;
            }
        }
        return null;
    },

    // private
    getSelections : function(){
        return this.selModel.getSelections();
    },

    /**
     * Causes the grid to manually recalculate its dimensions. Generally this is done automatically,
     * but if manual update is required this method will initiate it.
     */
    autoSize : function(){
        if(this.rendered){
            this.view.layout();
            if(this.view.adjustForScroll){
                this.view.adjustForScroll();
            }
        }
    },

    /**
     * Returns the grid's underlying element.
     * @return {Element} The element
     */
    getGridEl : function(){
        return this.container;
    },

    // private for compatibility, overridden by editor grid
    stopEditing : function(){},

    /**
     * Returns the grid's SelectionModel.
     * @return {SelectionModel}
     */
    getSelectionModel : function(){
        if(!this.selModel){
            this.selModel = new Roo.grid.RowSelectionModel();
        }
        return this.selModel;
    },

    /**
     * Returns the grid's DataSource.
     * @return {DataSource}
     */
    getDataSource : function(){
        return this.dataSource;
    },

    /**
     * Returns the grid's ColumnModel.
     * @return {ColumnModel}
     */
    getColumnModel : function(){
        return this.colModel;
    },

    /**
     * Returns the grid's GridView object.
     * @return {GridView}
     */
    getView : function(){
        if(!this.view){
            this.view = new Roo.grid.GridView(this.viewConfig);
        }
        return this.view;
    },
    /**
     * Called to get grid's drag proxy text, by default returns this.ddText.
     * @return {String}
     */
    getDragDropText : function(){
        var count = this.selModel.getCount();
        return String.format(this.ddText, count, count == 1 ? '' : 's');
    }
});
/**
 * Configures the text is the drag proxy (defaults to "%0 selected row(s)").
 * %0 is replaced with the number of selected rows.
 * @type String
 */
Roo.grid.Grid.prototype.ddText = "{0} selected row{1}";/*
 * Based on:
 * Ext JS Library 1.1.1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 *
 * Originally Released Under LGPL - original licence link has changed is not relivant.
 *
 * Fork - LGPL
 * <script type="text/javascript">
 */
 
Roo.grid.AbstractGridView = function(){
	this.grid = null;
	
	this.events = {
	    "beforerowremoved" : true,
	    "beforerowsinserted" : true,
	    "beforerefresh" : true,
	    "rowremoved" : true,
	    "rowsinserted" : true,
	    "rowupdated" : true,
	    "refresh" : true
	};
    Roo.grid.AbstractGridView.superclass.constructor.call(this);
};

Roo.extend(Roo.grid.AbstractGridView, Roo.util.Observable, {
    rowClass : "x-grid-row",
    cellClass : "x-grid-cell",
    tdClass : "x-grid-td",
    hdClass : "x-grid-hd",
    splitClass : "x-grid-hd-split",
    
	init: function(grid){
        this.grid = grid;
		var cid = this.grid.getGridEl().id;
        this.colSelector = "#" + cid + " ." + this.cellClass + "-";
        this.tdSelector = "#" + cid + " ." + this.tdClass + "-";
        this.hdSelector = "#" + cid + " ." + this.hdClass + "-";
        this.splitSelector = "#" + cid + " ." + this.splitClass + "-";
	},
	
	getColumnRenderers : function(){
    	var renderers = [];
    	var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            renderers[i] = cm.getRenderer(i);
        }
        return renderers;
    },
    
    getColumnIds : function(){
    	var ids = [];
    	var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            ids[i] = cm.getColumnId(i);
        }
        return ids;
    },
    
    getDataIndexes : function(){
    	if(!this.indexMap){
            this.indexMap = this.buildIndexMap();
        }
        return this.indexMap.colToData;
    },
    
    getColumnIndexByDataIndex : function(dataIndex){
        if(!this.indexMap){
            this.indexMap = this.buildIndexMap();
        }
    	return this.indexMap.dataToCol[dataIndex];
    },
    
    /**
     * Set a css style for a column dynamically. 
     * @param {Number} colIndex The index of the column
     * @param {String} name The css property name
     * @param {String} value The css value
     */
    setCSSStyle : function(colIndex, name, value){
        var selector = "#" + this.grid.id + " .x-grid-col-" + colIndex;
        Roo.util.CSS.updateRule(selector, name, value);
    },
    
    generateRules : function(cm){
        var ruleBuf = [], rulesId = this.grid.id + '-cssrules';
        Roo.util.CSS.removeStyleSheet(rulesId);
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            var cid = cm.getColumnId(i);
            ruleBuf.push(this.colSelector, cid, " {\n", cm.config[i].css, "}\n",
                         this.tdSelector, cid, " {\n}\n",
                         this.hdSelector, cid, " {\n}\n",
                         this.splitSelector, cid, " {\n}\n");
        }
        return Roo.util.CSS.createStyleSheet(ruleBuf.join(""), rulesId);
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

// private
// This is a support class used internally by the Grid components
Roo.grid.HeaderDragZone = function(grid, hd, hd2){
    this.grid = grid;
    this.view = grid.getView();
    this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
    Roo.grid.HeaderDragZone.superclass.constructor.call(this, hd);
    if(hd2){
        this.setHandleElId(Roo.id(hd));
        this.setOuterHandleElId(Roo.id(hd2));
    }
    this.scroll = false;
};
Roo.extend(Roo.grid.HeaderDragZone, Roo.dd.DragZone, {
    maxDragWidth: 120,
    getDragData : function(e){
        var t = Roo.lib.Event.getTarget(e);
        var h = this.view.findHeaderCell(t);
        if(h){
            return {ddel: h.firstChild, header:h};
        }
        return false;
    },

    onInitDrag : function(e){
        this.view.headersDisabled = true;
        var clone = this.dragData.ddel.cloneNode(true);
        clone.id = Roo.id();
        clone.style.width = Math.min(this.dragData.header.offsetWidth,this.maxDragWidth) + "px";
        this.proxy.update(clone);
        return true;
    },

    afterValidDrop : function(){
        var v = this.view;
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
    },

    afterInvalidDrop : function(){
        var v = this.view;
        setTimeout(function(){
            v.headersDisabled = false;
        }, 50);
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
// private
// This is a support class used internally by the Grid components
Roo.grid.HeaderDropZone = function(grid, hd, hd2){
    this.grid = grid;
    this.view = grid.getView();
    // split the proxies so they don't interfere with mouse events
    this.proxyTop = Roo.DomHelper.append(document.body, {
        cls:"col-move-top", html:"&#160;"
    }, true);
    this.proxyBottom = Roo.DomHelper.append(document.body, {
        cls:"col-move-bottom", html:"&#160;"
    }, true);
    this.proxyTop.hide = this.proxyBottom.hide = function(){
        this.setLeftTop(-100,-100);
        this.setStyle("visibility", "hidden");
    };
    this.ddGroup = "gridHeader" + this.grid.getGridEl().id;
    // temporarily disabled
    //Roo.dd.ScrollManager.register(this.view.scroller.dom);
    Roo.grid.HeaderDropZone.superclass.constructor.call(this, grid.getGridEl().dom);
};
Roo.extend(Roo.grid.HeaderDropZone, Roo.dd.DropZone, {
    proxyOffsets : [-4, -9],
    fly: Roo.Element.fly,

    getTargetFromEvent : function(e){
        var t = Roo.lib.Event.getTarget(e);
        var cindex = this.view.findCellIndex(t);
        if(cindex !== false){
            return this.view.getHeaderCell(cindex);
        }
    },

    nextVisible : function(h){
        var v = this.view, cm = this.grid.colModel;
        h = h.nextSibling;
        while(h){
            if(!cm.isHidden(v.getCellIndex(h))){
                return h;
            }
            h = h.nextSibling;
        }
        return null;
    },

    prevVisible : function(h){
        var v = this.view, cm = this.grid.colModel;
        h = h.prevSibling;
        while(h){
            if(!cm.isHidden(v.getCellIndex(h))){
                return h;
            }
            h = h.prevSibling;
        }
        return null;
    },

    positionIndicator : function(h, n, e){
        var x = Roo.lib.Event.getPageX(e);
        var r = Roo.lib.Dom.getRegion(n.firstChild);
        var px, pt, py = r.top + this.proxyOffsets[1];
        if((r.right - x) <= (r.right-r.left)/2){
            px = r.right+this.view.borderWidth;
            pt = "after";
        }else{
            px = r.left;
            pt = "before";
        }
        var oldIndex = this.view.getCellIndex(h);
        var newIndex = this.view.getCellIndex(n);

        if(this.grid.colModel.isFixed(newIndex)){
            return false;
        }

        var locked = this.grid.colModel.isLocked(newIndex);

        if(pt == "after"){
            newIndex++;
        }
        if(oldIndex < newIndex){
            newIndex--;
        }
        if(oldIndex == newIndex && (locked == this.grid.colModel.isLocked(oldIndex))){
            return false;
        }
        px +=  this.proxyOffsets[0];
        this.proxyTop.setLeftTop(px, py);
        this.proxyTop.show();
        if(!this.bottomOffset){
            this.bottomOffset = this.view.mainHd.getHeight();
        }
        this.proxyBottom.setLeftTop(px, py+this.proxyTop.dom.offsetHeight+this.bottomOffset);
        this.proxyBottom.show();
        return pt;
    },

    onNodeEnter : function(n, dd, e, data){
        if(data.header != n){
            this.positionIndicator(data.header, n, e);
        }
    },

    onNodeOver : function(n, dd, e, data){
        var result = false;
        if(data.header != n){
            result = this.positionIndicator(data.header, n, e);
        }
        if(!result){
            this.proxyTop.hide();
            this.proxyBottom.hide();
        }
        return result ? this.dropAllowed : this.dropNotAllowed;
    },

    onNodeOut : function(n, dd, e, data){
        this.proxyTop.hide();
        this.proxyBottom.hide();
    },

    onNodeDrop : function(n, dd, e, data){
        var h = data.header;
        if(h != n){
            var cm = this.grid.colModel;
            var x = Roo.lib.Event.getPageX(e);
            var r = Roo.lib.Dom.getRegion(n.firstChild);
            var pt = (r.right - x) <= ((r.right-r.left)/2) ? "after" : "before";
            var oldIndex = this.view.getCellIndex(h);
            var newIndex = this.view.getCellIndex(n);
            var locked = cm.isLocked(newIndex);
            if(pt == "after"){
                newIndex++;
            }
            if(oldIndex < newIndex){
                newIndex--;
            }
            if(oldIndex == newIndex && (locked == cm.isLocked(oldIndex))){
                return false;
            }
            cm.setLocked(oldIndex, locked, true);
            cm.moveColumn(oldIndex, newIndex);
            this.grid.fireEvent("columnmove", oldIndex, newIndex);
            return true;
        }
        return false;
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
 * @class Roo.grid.GridView
 * @extends Roo.util.Observable
 *
 * @constructor
 * @param {Object} config
 */
Roo.grid.GridView = function(config){
    Roo.grid.GridView.superclass.constructor.call(this);
    this.el = null;

    Roo.apply(this, config);
};

Roo.extend(Roo.grid.GridView, Roo.grid.AbstractGridView, {

    /**
     * Override this function to apply custom css classes to rows during rendering
     * @param {Record} record The record
     * @param {Number} index
     * @method getRowClass
     */
    rowClass : "x-grid-row",

    cellClass : "x-grid-col",

    tdClass : "x-grid-td",

    hdClass : "x-grid-hd",

    splitClass : "x-grid-split",

    sortClasses : ["sort-asc", "sort-desc"],

    enableMoveAnim : false,

    hlColor: "C3DAF9",

    dh : Roo.DomHelper,

    fly : Roo.Element.fly,

    css : Roo.util.CSS,

    borderWidth: 1,

    splitOffset: 3,

    scrollIncrement : 22,

    cellRE: /(?:.*?)x-grid-(?:hd|cell|csplit)-(?:[\d]+)-([\d]+)(?:.*?)/,

    findRE: /\s?(?:x-grid-hd|x-grid-col|x-grid-csplit)\s/,

    bind : function(ds, cm){
        if(this.ds){
            this.ds.un("load", this.onLoad, this);
            this.ds.un("datachanged", this.onDataChange, this);
            this.ds.un("add", this.onAdd, this);
            this.ds.un("remove", this.onRemove, this);
            this.ds.un("update", this.onUpdate, this);
            this.ds.un("clear", this.onClear, this);
        }
        if(ds){
            ds.on("load", this.onLoad, this);
            ds.on("datachanged", this.onDataChange, this);
            ds.on("add", this.onAdd, this);
            ds.on("remove", this.onRemove, this);
            ds.on("update", this.onUpdate, this);
            ds.on("clear", this.onClear, this);
        }
        this.ds = ds;

        if(this.cm){
            this.cm.un("widthchange", this.onColWidthChange, this);
            this.cm.un("headerchange", this.onHeaderChange, this);
            this.cm.un("hiddenchange", this.onHiddenChange, this);
            this.cm.un("columnmoved", this.onColumnMove, this);
            this.cm.un("columnlockchange", this.onColumnLock, this);
        }
        if(cm){
            this.generateRules(cm);
            cm.on("widthchange", this.onColWidthChange, this);
            cm.on("headerchange", this.onHeaderChange, this);
            cm.on("hiddenchange", this.onHiddenChange, this);
            cm.on("columnmoved", this.onColumnMove, this);
            cm.on("columnlockchange", this.onColumnLock, this);
        }
        this.cm = cm;
    },

    init: function(grid){
		Roo.grid.GridView.superclass.init.call(this, grid);

		this.bind(grid.dataSource, grid.colModel);

	    grid.on("headerclick", this.handleHeaderClick, this);

        if(grid.trackMouseOver){
            grid.on("mouseover", this.onRowOver, this);
	        grid.on("mouseout", this.onRowOut, this);
	    }
	    grid.cancelTextSelection = function(){};
		this.gridId = grid.id;

		var tpls = this.templates || {};

		if(!tpls.master){
		    tpls.master = new Roo.Template(
		       '<div class="x-grid" hidefocus="true">',
		          '<div class="x-grid-topbar"></div>',
		          '<div class="x-grid-scroller"><div></div></div>',
		          '<div class="x-grid-locked">',
		              '<div class="x-grid-header">{lockedHeader}</div>',
		              '<div class="x-grid-body">{lockedBody}</div>',
		          "</div>",
		          '<div class="x-grid-viewport">',
		              '<div class="x-grid-header">{header}</div>',
		              '<div class="x-grid-body">{body}</div>',
		          "</div>",
		          '<div class="x-grid-bottombar"></div>',
		          '<a href="#" class="x-grid-focus" tabIndex="-1"></a>',
		          '<div class="x-grid-resize-proxy">&#160;</div>',
		       "</div>"
		    );
		    tpls.master.disableformats = true;
		}

		if(!tpls.header){
		    tpls.header = new Roo.Template(
		       '<table border="0" cellspacing="0" cellpadding="0">',
		       '<tbody><tr class="x-grid-hd-row">{cells}</tr></tbody>',
		       "</table>{splits}"
		    );
		    tpls.header.disableformats = true;
		}
		tpls.header.compile();

		if(!tpls.hcell){
		    tpls.hcell = new Roo.Template(
		        '<td class="x-grid-hd x-grid-td-{id} {cellId}"><div title="{title}" class="x-grid-hd-inner x-grid-hd-{id}">',
		        '<div class="x-grid-hd-text" unselectable="on">{value}<img class="x-grid-sort-icon" src="', Roo.BLANK_IMAGE_URL, '" /></div>',
		        "</div></td>"
		     );
		     tpls.hcell.disableFormats = true;
		}
		tpls.hcell.compile();

		if(!tpls.hsplit){
		    tpls.hsplit = new Roo.Template('<div class="x-grid-split {splitId} x-grid-split-{id}" style="{style}" unselectable="on">&#160;</div>');
		    tpls.hsplit.disableFormats = true;
		}
		tpls.hsplit.compile();

		if(!tpls.body){
		    tpls.body = new Roo.Template(
		       '<table border="0" cellspacing="0" cellpadding="0">',
		       "<tbody>{rows}</tbody>",
		       "</table>"
		    );
		    tpls.body.disableFormats = true;
		}
		tpls.body.compile();

		if(!tpls.row){
		    tpls.row = new Roo.Template('<tr class="x-grid-row {alt}">{cells}</tr>');
		    tpls.row.disableFormats = true;
		}
		tpls.row.compile();

		if(!tpls.cell){
		    tpls.cell = new Roo.Template(
		        '<td class="x-grid-col x-grid-td-{id} {cellId} {css}" tabIndex="0">',
		        '<div class="x-grid-col-{id} x-grid-cell-inner"><div class="x-grid-cell-text" unselectable="on" {attr}>{value}</div></div>',
		        "</td>"
		    );
            tpls.cell.disableFormats = true;
        }
		tpls.cell.compile();

		this.templates = tpls;
	},

	// remap these for backwards compat
    onColWidthChange : function(){
        this.updateColumns.apply(this, arguments);
    },
    onHeaderChange : function(){
        this.updateHeaders.apply(this, arguments);
    }, 
    onHiddenChange : function(){
        this.handleHiddenChange.apply(this, arguments);
    },
    onColumnMove : function(){
        this.handleColumnMove.apply(this, arguments);
    },
    onColumnLock : function(){
        this.handleLockChange.apply(this, arguments);
    },

    onDataChange : function(){
        this.refresh();
        this.updateHeaderSortState();
    },

	onClear : function(){
        this.refresh();
    },

	onUpdate : function(ds, record){
        this.refreshRow(record);
    },

    refreshRow : function(record){
        var ds = this.ds, index;
        if(typeof record == 'number'){
            index = record;
            record = ds.getAt(index);
        }else{
            index = ds.indexOf(record);
        }
        this.insertRows(ds, index, index, true);
        this.onRemove(ds, record, index+1, true);
        this.syncRowHeights(index, index);
        this.layout();
        this.fireEvent("rowupdated", this, index, record);
    },

    onAdd : function(ds, records, index){
        this.insertRows(ds, index, index + (records.length-1));
    },

    onRemove : function(ds, record, index, isUpdate){
        if(isUpdate !== true){
            this.fireEvent("beforerowremoved", this, index, record);
        }
        var bt = this.getBodyTable(), lt = this.getLockedTable();
        if(bt.rows[index]){
            bt.firstChild.removeChild(bt.rows[index]);
        }
        if(lt.rows[index]){
            lt.firstChild.removeChild(lt.rows[index]);
        }
        if(isUpdate !== true){
            this.stripeRows(index);
            this.syncRowHeights(index, index);
            this.layout();
            this.fireEvent("rowremoved", this, index, record);
        }
    },

    onLoad : function(){
        this.scrollToTop();
    },

    /**
     * Scrolls the grid to the top
     */
    scrollToTop : function(){
        if(this.scroller){
            this.scroller.dom.scrollTop = 0;
            this.syncScroll();
        }
    },

    /**
     * Gets a panel in the header of the grid that can be used for toolbars etc.
     * After modifying the contents of this panel a call to grid.autoSize() may be
     * required to register any changes in size.
     * @param {Boolean} doShow By default the header is hidden. Pass true to show the panel
     * @return Roo.Element
     */
    getHeaderPanel : function(doShow){
        if(doShow){
            this.headerPanel.show();
        }
        return this.headerPanel;
	},

	/**
     * Gets a panel in the footer of the grid that can be used for toolbars etc.
     * After modifying the contents of this panel a call to grid.autoSize() may be
     * required to register any changes in size.
     * @param {Boolean} doShow By default the footer is hidden. Pass true to show the panel
     * @return Roo.Element
     */
    getFooterPanel : function(doShow){
        if(doShow){
            this.footerPanel.show();
        }
        return this.footerPanel;
	},

	initElements : function(){
	    var E = Roo.Element;
	    var el = this.grid.getGridEl().dom.firstChild;
	    var cs = el.childNodes;

	    this.el = new E(el);
	    this.headerPanel = new E(el.firstChild);
	    this.headerPanel.enableDisplayMode("block");

        this.scroller = new E(cs[1]);
	    this.scrollSizer = new E(this.scroller.dom.firstChild);

	    this.lockedWrap = new E(cs[2]);
	    this.lockedHd = new E(this.lockedWrap.dom.firstChild);
	    this.lockedBody = new E(this.lockedWrap.dom.childNodes[1]);

	    this.mainWrap = new E(cs[3]);
	    this.mainHd = new E(this.mainWrap.dom.firstChild);
	    this.mainBody = new E(this.mainWrap.dom.childNodes[1]);

	    this.footerPanel = new E(cs[4]);
	    this.footerPanel.enableDisplayMode("block");

        this.focusEl = new E(cs[5]);
        this.focusEl.swallowEvent("click", true);
        this.resizeProxy = new E(cs[6]);

	    this.headerSelector = String.format(
	       '#{0} td.x-grid-hd, #{1} td.x-grid-hd',
	       this.lockedHd.id, this.mainHd.id
	    );

	    this.splitterSelector = String.format(
	       '#{0} div.x-grid-split, #{1} div.x-grid-split',
	       this.idToCssName(this.lockedHd.id), this.idToCssName(this.mainHd.id)
	    );
    },
    idToCssName : function(s)
    {
        return s.replace(/[^a-z0-9]+/ig, '-');
    },

	getHeaderCell : function(index){
	    return Roo.DomQuery.select(this.headerSelector)[index];
	},

	getHeaderCellMeasure : function(index){
	    return this.getHeaderCell(index).firstChild;
	},

	getHeaderCellText : function(index){
	    return this.getHeaderCell(index).firstChild.firstChild;
	},

	getLockedTable : function(){
	    return this.lockedBody.dom.firstChild;
	},

	getBodyTable : function(){
	    return this.mainBody.dom.firstChild;
	},

	getLockedRow : function(index){
	    return this.getLockedTable().rows[index];
	},

	getRow : function(index){
	    return this.getBodyTable().rows[index];
	},

	getRowComposite : function(index){
	    if(!this.rowEl){
	        this.rowEl = new Roo.CompositeElementLite();
	    }
        var els = [], lrow, mrow;
        if(lrow = this.getLockedRow(index)){
            els.push(lrow);
        }
        if(mrow = this.getRow(index)){
            els.push(mrow);
        }
        this.rowEl.elements = els;
	    return this.rowEl;
	},

	getCell : function(rowIndex, colIndex){
	    var locked = this.cm.getLockedCount();
	    var source;
	    if(colIndex < locked){
	        source = this.lockedBody.dom.firstChild;
	    }else{
	        source = this.mainBody.dom.firstChild;
	        colIndex -= locked;
	    }
        return source.rows[rowIndex].childNodes[colIndex];
	},

	getCellText : function(rowIndex, colIndex){
	    return this.getCell(rowIndex, colIndex).firstChild.firstChild;
	},

	getCellBox : function(cell){
	    var b = this.fly(cell).getBox();
        if(Roo.isOpera){ // opera fails to report the Y
            b.y = cell.offsetTop + this.mainBody.getY();
        }
        return b;
    },

    getCellIndex : function(cell){
        var id = String(cell.className).match(this.cellRE);
        if(id){
            return parseInt(id[1], 10);
        }
        return 0;
    },

    findHeaderIndex : function(n){
        var r = Roo.fly(n).findParent("td." + this.hdClass, 6);
        return r ? this.getCellIndex(r) : false;
    },

    findHeaderCell : function(n){
        var r = Roo.fly(n).findParent("td." + this.hdClass, 6);
        return r ? r : false;
    },

    findRowIndex : function(n){
        if(!n){
            return false;
        }
        var r = Roo.fly(n).findParent("tr." + this.rowClass, 6);
        return r ? r.rowIndex : false;
    },

    findCellIndex : function(node){
        var stop = this.el.dom;
        while(node && node != stop){
            if(this.findRE.test(node.className)){
                return this.getCellIndex(node);
            }
            node = node.parentNode;
        }
        return false;
    },

    getColumnId : function(index){
	    return this.cm.getColumnId(index);
	},

	getSplitters : function(){
	    if(this.splitterSelector){
	       return Roo.DomQuery.select(this.splitterSelector);
	    }else{
	        return null;
	    }
	},

	getSplitter : function(index){
	    return this.getSplitters()[index];
	},

    onRowOver : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false){
            this.getRowComposite(row).addClass("x-grid-row-over");
        }
    },

    onRowOut : function(e, t){
        var row;
        if((row = this.findRowIndex(t)) !== false && row !== this.findRowIndex(e.getRelatedTarget())){
            this.getRowComposite(row).removeClass("x-grid-row-over");
        }
    },

    renderHeaders : function(){
	    var cm = this.cm;
        var ct = this.templates.hcell, ht = this.templates.header, st = this.templates.hsplit;
        var cb = [], lb = [], sb = [], lsb = [], p = {};
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            p.cellId = "x-grid-hd-0-" + i;
            p.splitId = "x-grid-csplit-0-" + i;
            p.id = cm.getColumnId(i);
            p.title = cm.getColumnTooltip(i) || "";
            p.value = cm.getColumnHeader(i) || "";
            p.style = (this.grid.enableColumnResize === false || !cm.isResizable(i) || cm.isFixed(i)) ? 'cursor:default' : '';
            if(!cm.isLocked(i)){
                cb[cb.length] = ct.apply(p);
                sb[sb.length] = st.apply(p);
            }else{
                lb[lb.length] = ct.apply(p);
                lsb[lsb.length] = st.apply(p);
            }
        }
        return [ht.apply({cells: lb.join(""), splits:lsb.join("")}),
                ht.apply({cells: cb.join(""), splits:sb.join("")})];
	},

	updateHeaders : function(){
        var html = this.renderHeaders();
        this.lockedHd.update(html[0]);
        this.mainHd.update(html[1]);
    },

    /**
     * Focuses the specified row.
     * @param {Number} row The row index
     */
    focusRow : function(row){
        var x = this.scroller.dom.scrollLeft;
        this.focusCell(row, 0, false);
        this.scroller.dom.scrollLeft = x;
    },

    /**
     * Focuses the specified cell.
     * @param {Number} row The row index
     * @param {Number} col The column index
     * @param {Boolean} hscroll false to disable horizontal scrolling
     */
    focusCell : function(row, col, hscroll){
        var el = this.ensureVisible(row, col, hscroll);
        this.focusEl.alignTo(el, "tl-tl");
        if(Roo.isGecko){
            this.focusEl.focus();
        }else{
            this.focusEl.focus.defer(1, this.focusEl);
        }
    },

    /**
     * Scrolls the specified cell into view
     * @param {Number} row The row index
     * @param {Number} col The column index
     * @param {Boolean} hscroll false to disable horizontal scrolling
     */
    ensureVisible : function(row, col, hscroll){
        if(typeof row != "number"){
            row = row.rowIndex;
        }
        if(row < 0 && row >= this.ds.getCount()){
            return;
        }
        col = (col !== undefined ? col : 0);
        var cm = this.grid.colModel;
        while(cm.isHidden(col)){
            col++;
        }

        var el = this.getCell(row, col);
        if(!el){
            return;
        }
        var c = this.scroller.dom;

        var ctop = parseInt(el.offsetTop, 10);
        var cleft = parseInt(el.offsetLeft, 10);
        var cbot = ctop + el.offsetHeight;
        var cright = cleft + el.offsetWidth;

        var ch = c.clientHeight - this.mainHd.dom.offsetHeight;
        var stop = parseInt(c.scrollTop, 10);
        var sleft = parseInt(c.scrollLeft, 10);
        var sbot = stop + ch;
        var sright = sleft + c.clientWidth;

        if(ctop < stop){
        	c.scrollTop = ctop;
        }else if(cbot > sbot){
            c.scrollTop = cbot-ch;
        }

        if(hscroll !== false){
            if(cleft < sleft){
                c.scrollLeft = cleft;
            }else if(cright > sright){
                c.scrollLeft = cright-c.clientWidth;
            }
        }
        return el;
    },

    updateColumns : function(){
        this.grid.stopEditing();
        var cm = this.grid.colModel, colIds = this.getColumnIds();
        //var totalWidth = cm.getTotalWidth();
        var pos = 0;
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            //if(cm.isHidden(i)) continue;
            var w = cm.getColumnWidth(i);
            this.css.updateRule(this.colSelector+this.idToCssName(colIds[i]), "width", (w - this.borderWidth) + "px");
            this.css.updateRule(this.hdSelector+this.idToCssName(colIds[i]), "width", (w - this.borderWidth) + "px");
        }
        this.updateSplitters();
    },

    generateRules : function(cm){
        var ruleBuf = [], rulesId = this.idToCssName(this.grid.id)+ '-cssrules';
        Roo.util.CSS.removeStyleSheet(rulesId);
        for(var i = 0, len = cm.getColumnCount(); i < len; i++){
            var cid = cm.getColumnId(i);
            var align = '';
            if(cm.config[i].align){
                align = 'text-align:'+cm.config[i].align+';';
            }
            var hidden = '';
            if(cm.isHidden(i)){
                hidden = 'display:none;';
            }
            var width = "width:" + (cm.getColumnWidth(i) - this.borderWidth) + "px;";
            ruleBuf.push(
                    this.colSelector, cid, " {\n", cm.config[i].css, align, width, "\n}\n",
                    this.hdSelector, cid, " {\n", align, width, "}\n",
                    this.tdSelector, cid, " {\n",hidden,"\n}\n",
                    this.splitSelector, cid, " {\n", hidden , "\n}\n");
        }
        return Roo.util.CSS.createStyleSheet(ruleBuf.join(""), rulesId);
    },

    updateSplitters : function(){
        var cm = this.cm, s = this.getSplitters();
        if(s){ // splitters not created yet
            var pos = 0, locked = true;
            for(var i = 0, len = cm.getColumnCount(); i < len; i++){
                if(cm.isHidden(i)) continue;
                var w = cm.getColumnWidth(i);
                if(!cm.isLocked(i) && locked){
                    pos = 0;
                    locked = false;
                }
                pos += w;
                s[i].style.left = (pos-this.splitOffset) + "px";
            }
        }
    },

    handleHiddenChange : function(colModel, colIndex, hidden){
        if(hidden){
            this.hideColumn(colIndex);
        }else{
            this.unhideColumn(colIndex);
        }
    },

    hideColumn : function(colIndex){
        var cid = this.getColumnId(colIndex);
        this.css.updateRule(this.tdSelector+this.idToCssName(cid), "display", "none");
        this.css.updateRule(this.splitSelector+this.idToCssName(cid), "display", "none");
        if(Roo.isSafari){
            this.updateHeaders();
        }
        this.updateSplitters();
        this.layout();
    },

    unhideColumn : function(colIndex){
        var cid = this.getColumnId(colIndex);
        this.css.updateRule(this.tdSelector+this.idToCssName(cid), "display", "");
        this.css.updateRule(this.splitSelector+this.idToCssName(cid), "display", "");

        if(Roo.isSafari){
            this.updateHeaders();
        }
        this.updateSplitters();
        this.layout();
    },

    insertRows : function(dm, firstRow, lastRow, isUpdate){
        if(firstRow == 0 && lastRow == dm.getCount()-1){
            this.refresh();
        }else{
            if(!isUpdate){
                this.fireEvent("beforerowsinserted", this, firstRow, lastRow);
            }
            var s = this.getScrollState();
            var markup = this.renderRows(firstRow, lastRow);
            this.bufferRows(markup[0], this.getLockedTable(), firstRow);
            this.bufferRows(markup[1], this.getBodyTable(), firstRow);
            this.restoreScroll(s);
            if(!isUpdate){
                this.fireEvent("rowsinserted", this, firstRow, lastRow);
                this.syncRowHeights(firstRow, lastRow);
                this.stripeRows(firstRow);
                this.layout();
            }
        }
    },

    bufferRows : function(markup, target, index){
        var before = null, trows = target.rows, tbody = target.tBodies[0];
        if(index < trows.length){
            before = trows[index];
        }
        var b = document.createElement("div");
        b.innerHTML = "<table><tbody>"+markup+"</tbody></table>";
        var rows = b.firstChild.rows;
        for(var i = 0, len = rows.length; i < len; i++){
            if(before){
                tbody.insertBefore(rows[0], before);
            }else{
                tbody.appendChild(rows[0]);
            }
        }
        b.innerHTML = "";
        b = null;
    },

    deleteRows : function(dm, firstRow, lastRow){
        if(dm.getRowCount()<1){
            this.fireEvent("beforerefresh", this);
            this.mainBody.update("");
            this.lockedBody.update("");
            this.fireEvent("refresh", this);
        }else{
            this.fireEvent("beforerowsdeleted", this, firstRow, lastRow);
            var bt = this.getBodyTable();
            var tbody = bt.firstChild;
            var rows = bt.rows;
            for(var rowIndex = firstRow; rowIndex <= lastRow; rowIndex++){
                tbody.removeChild(rows[firstRow]);
            }
            this.stripeRows(firstRow);
            this.fireEvent("rowsdeleted", this, firstRow, lastRow);
        }
    },

    updateRows : function(dataSource, firstRow, lastRow){
        var s = this.getScrollState();
        this.refresh();
        this.restoreScroll(s);
    },

    handleSort : function(dataSource, sortColumnIndex, sortDir, noRefresh){
        if(!noRefresh){
           this.refresh();
        }
        this.updateHeaderSortState();
    },

    getScrollState : function(){
        var sb = this.scroller.dom;
        return {left: sb.scrollLeft, top: sb.scrollTop};
    },

    stripeRows : function(startRow){
        if(!this.grid.stripeRows || this.ds.getCount() < 1){
            return;
        }
        startRow = startRow || 0;
        var rows = this.getBodyTable().rows;
        var lrows = this.getLockedTable().rows;
        var cls = ' x-grid-row-alt ';
        for(var i = startRow, len = rows.length; i < len; i++){
            var row = rows[i], lrow = lrows[i];
            var isAlt = ((i+1) % 2 == 0);
            var hasAlt = (' '+row.className + ' ').indexOf(cls) != -1;
            if(isAlt == hasAlt){
                continue;
            }
            if(isAlt){
                row.className += " x-grid-row-alt";
            }else{
                row.className = row.className.replace("x-grid-row-alt", "");
            }
            if(lrow){
                lrow.className = row.className;
            }
        }
    },

    restoreScroll : function(state){
        var sb = this.scroller.dom;
        sb.scrollLeft = state.left;
        sb.scrollTop = state.top;
        this.syncScroll();
    },

    syncScroll : function(){
        var sb = this.scroller.dom;
        var sh = this.mainHd.dom;
        var bs = this.mainBody.dom;
        var lv = this.lockedBody.dom;
        sh.scrollLeft = bs.scrollLeft = sb.scrollLeft;
        lv.scrollTop = bs.scrollTop = sb.scrollTop;
    },

    handleScroll : function(e){
        this.syncScroll();
        var sb = this.scroller.dom;
        this.grid.fireEvent("bodyscroll", sb.scrollLeft, sb.scrollTop);
        e.stopEvent();
    },

    handleWheel : function(e){
        var d = e.getWheelDelta();
        this.scroller.dom.scrollTop -= d*22;
        // set this here to prevent jumpy scrolling on large tables
        this.lockedBody.dom.scrollTop = this.mainBody.dom.scrollTop = this.scroller.dom.scrollTop;
        e.stopEvent();
    },

    renderRows : function(startRow, endRow){
        // pull in all the crap needed to render rows
        var g = this.grid, cm = g.colModel, ds = g.dataSource, stripe = g.stripeRows;
        var colCount = cm.getColumnCount();

        if(ds.getCount() < 1){
            return ["", ""];
        }

        // build a map for all the columns
        var cs = [];
        for(var i = 0; i < colCount; i++){
            var name = cm.getDataIndex(i);
            cs[i] = {
                name : typeof name == 'undefined' ? ds.fields.get(i).name : name,
                renderer : cm.getRenderer(i),
                id : cm.getColumnId(i),
                locked : cm.isLocked(i)
            };
        }

        startRow = startRow || 0;
        endRow = typeof endRow == "undefined"? ds.getCount()-1 : endRow;

        // records to render
        var rs = ds.getRange(startRow, endRow);

        return this.doRender(cs, rs, ds, startRow, colCount, stripe);
    },

    // As much as I hate to duplicate code, this was branched because FireFox really hates
    // [].join("") on strings. The performance difference was substantial enough to
    // branch this function
    doRender : Roo.isGecko ?
            function(cs, rs, ds, startRow, colCount, stripe){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = "", lbuf = "", cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                for(var j = 0, len = rs.length; j < len; j++){
                    r = rs[j]; cb = ""; lcb = ""; rowIndex = (j+startRow);
                    for(var i = 0; i < colCount; i++){
                        c = cs[i];
                        p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                        p.id = c.id;
                        p.css = p.attr = "";
                        p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                        if(p.value == undefined || p.value === "") p.value = "&#160;";
                        if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                            p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                        }
                        var markup = ct.apply(p);
                        if(!c.locked){
                            cb+= markup;
                        }else{
                            lcb+= markup;
                        }
                    }
                    var alt = [];
                    if(stripe && ((rowIndex+1) % 2 == 0)){
                        alt[0] = "x-grid-row-alt";
                    }
                    if(r.dirty){
                        alt[1] = " x-grid-dirty-row";
                    }
                    rp.cells = lcb;
                    if(this.getRowClass){
                        alt[2] = this.getRowClass(r, rowIndex);
                    }
                    rp.alt = alt.join(" ");
                    lbuf+= rt.apply(rp);
                    rp.cells = cb;
                    buf+=  rt.apply(rp);
                }
                return [lbuf, buf];
            } :
            function(cs, rs, ds, startRow, colCount, stripe){
                var ts = this.templates, ct = ts.cell, rt = ts.row;
                // buffers
                var buf = [], lbuf = [], cb, lcb, c, p = {}, rp = {}, r, rowIndex;
                for(var j = 0, len = rs.length; j < len; j++){
                    r = rs[j]; cb = []; lcb = []; rowIndex = (j+startRow);
                    for(var i = 0; i < colCount; i++){
                        c = cs[i];
                        p.cellId = "x-grid-cell-" + rowIndex + "-" + i;
                        p.id = c.id;
                        p.css = p.attr = "";
                        p.value = c.renderer(r.data[c.name], p, r, rowIndex, i, ds);
                        if(p.value == undefined || p.value === "") p.value = "&#160;";
                        if(r.dirty && typeof r.modified[c.name] !== 'undefined'){
                            p.css += p.css ? ' x-grid-dirty-cell' : 'x-grid-dirty-cell';
                        }
                        var markup = ct.apply(p);
                        if(!c.locked){
                            cb[cb.length] = markup;
                        }else{
                            lcb[lcb.length] = markup;
                        }
                    }
                    var alt = [];
                    if(stripe && ((rowIndex+1) % 2 == 0)){
                        alt[0] = "x-grid-row-alt";
                    }
                    if(r.dirty){
                        alt[1] = " x-grid-dirty-row";
                    }
                    rp.cells = lcb;
                    if(this.getRowClass){
                        alt[2] = this.getRowClass(r, rowIndex);
                    }
                    rp.alt = alt.join(" ");
                    rp.cells = lcb.join("");
                    lbuf[lbuf.length] = rt.apply(rp);
                    rp.cells = cb.join("");
                    buf[buf.length] =  rt.apply(rp);
                }
                return [lbuf.join(""), buf.join("")];
            },

    renderBody : function(){
        var markup = this.renderRows();
        var bt = this.templates.body;
        return [bt.apply({rows: markup[0]}), bt.apply({rows: markup[1]})];
    },

    /**
     * Refreshes the grid
     * @param {Boolean} headersToo
     */
    refresh : function(headersToo){
        this.fireEvent("beforerefresh", this);
        this.grid.stopEditing();
        var result = this.renderBody();
        this.lockedBody.update(result[0]);
        this.mainBody.update(result[1]);
        if(headersToo === true){
            this.updateHeaders();
            this.updateColumns();
            this.updateSplitters();
            this.updateHeaderSortState();
        }
        this.syncRowHeights();
        this.layout();
        this.fireEvent("refresh", this);
    },

    handleColumnMove : function(cm, oldIndex, newIndex){
        this.indexMap = null;
        var s = this.getScrollState();
        this.refresh(true);
        this.restoreScroll(s);
        this.afterMove(newIndex);
    },

    afterMove : function(colIndex){
        if(this.enableMoveAnim && Roo.enableFx){
            this.fly(this.getHeaderCell(colIndex).firstChild).highlight(this.hlColor);
        }
    },

    updateCell : function(dm, rowIndex, dataIndex){
        var colIndex = this.getColumnIndexByDataIndex(dataIndex);
        if(typeof colIndex == "undefined"){ // not present in grid
            return;
        }
        var cm = this.grid.colModel;
        var cell = this.getCell(rowIndex, colIndex);
        var cellText = this.getCellText(rowIndex, colIndex);

        var p = {
            cellId : "x-grid-cell-" + rowIndex + "-" + colIndex,
            id : cm.getColumnId(colIndex),
            css: colIndex == cm.getColumnCount()-1 ? "x-grid-col-last" : ""
        };
        var renderer = cm.getRenderer(colIndex);
        var val = renderer(dm.getValueAt(rowIndex, dataIndex), p, rowIndex, colIndex, dm);
        if(typeof val == "undefined" || val === "") val = "&#160;";
        cellText.innerHTML = val;
        cell.className = this.cellClass + " " + this.idToCssName(p.cellId) + " " + p.css;
        this.syncRowHeights(rowIndex, rowIndex);
    },

    calcColumnWidth : function(colIndex, maxRowsToMeasure){
        var maxWidth = 0;
        if(this.grid.autoSizeHeaders){
            var h = this.getHeaderCellMeasure(colIndex);
            maxWidth = Math.max(maxWidth, h.scrollWidth);
        }
        var tb, index;
        if(this.cm.isLocked(colIndex)){
            tb = this.getLockedTable();
            index = colIndex;
        }else{
            tb = this.getBodyTable();
            index = colIndex - this.cm.getLockedCount();
        }
        if(tb && tb.rows){
            var rows = tb.rows;
            var stopIndex = Math.min(maxRowsToMeasure || rows.length, rows.length);
            for(var i = 0; i < stopIndex; i++){
                var cell = rows[i].childNodes[index].firstChild;
                maxWidth = Math.max(maxWidth, cell.scrollWidth);
            }
        }
        return maxWidth + /*margin for error in IE*/ 5;
    },
    /**
     * Autofit a column to its content.
     * @param {Number} colIndex
     * @param {Boolean} forceMinSize true to force the column to go smaller if possible
     */
     autoSizeColumn : function(colIndex, forceMinSize, suppressEvent){
         if(this.cm.isHidden(colIndex)){
             return; // can't calc a hidden column
         }
        if(forceMinSize){
            var cid = this.cm.getColumnId(colIndex);
            this.css.updateRule(this.colSelector +this.idToCssName( cid), "width", this.grid.minColumnWidth + "px");
           if(this.grid.autoSizeHeaders){
               this.css.updateRule(this.hdSelector + this.idToCssName(cid), "width", this.grid.minColumnWidth + "px");
           }
        }
        var newWidth = this.calcColumnWidth(colIndex);
        this.cm.setColumnWidth(colIndex,
            Math.max(this.grid.minColumnWidth, newWidth), suppressEvent);
        if(!suppressEvent){
            this.grid.fireEvent("columnresize", colIndex, newWidth);
        }
    },

    /**
     * Autofits all columns to their content and then expands to fit any extra space in the grid
     */
     autoSizeColumns : function(){
        var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        for(var i = 0; i < colCount; i++){
            this.autoSizeColumn(i, true, true);
        }
        if(cm.getTotalWidth() < this.scroller.dom.clientWidth){
            this.fitColumns();
        }else{
            this.updateColumns();
            this.layout();
        }
    },

    /**
     * Autofits all columns to the grid's width proportionate with their current size
     * @param {Boolean} reserveScrollSpace Reserve space for a scrollbar
     */
    fitColumns : function(reserveScrollSpace){
        var cm = this.grid.colModel;
        var colCount = cm.getColumnCount();
        var cols = [];
        var width = 0;
        var i, w;
        for (i = 0; i < colCount; i++){
            if(!cm.isHidden(i) && !cm.isFixed(i)){
                w = cm.getColumnWidth(i);
                cols.push(i);
                cols.push(w);
                width += w;
            }
        }
        var avail = Math.min(this.scroller.dom.clientWidth, this.el.getWidth());
        if(reserveScrollSpace){
            avail -= 17;
        }
        var frac = (avail - cm.getTotalWidth())/width;
        while (cols.length){
            w = cols.pop();
            i = cols.pop();
            cm.setColumnWidth(i, Math.floor(w + w*frac), true);
        }
        this.updateColumns();
        this.layout();
    },

    onRowSelect : function(rowIndex){
        var row = this.getRowComposite(rowIndex);
        row.addClass("x-grid-row-selected");
    },

    onRowDeselect : function(rowIndex){
        var row = this.getRowComposite(rowIndex);
        row.removeClass("x-grid-row-selected");
    },

    onCellSelect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            Roo.fly(cell).addClass("x-grid-cell-selected");
        }
    },

    onCellDeselect : function(row, col){
        var cell = this.getCell(row, col);
        if(cell){
            Roo.fly(cell).removeClass("x-grid-cell-selected");
        }
    },

    updateHeaderSortState : function(){
        var state = this.ds.getSortState();
        if(!state){
            return;
        }
        this.sortState = state;
        var sortColumn = this.cm.findColumnIndex(state.field);
        if(sortColumn != -1){
            var sortDir = state.direction;
            var sc = this.sortClasses;
            var hds = this.el.select(this.headerSelector).removeClass(sc);
            hds.item(sortColumn).addClass(sc[sortDir == "DESC" ? 1 : 0]);
        }
    },

    handleHeaderClick : function(g, index){
        if(this.headersDisabled){
            return;
        }
        var dm = g.dataSource, cm = g.colModel;
	    if(!cm.isSortable(index)){
            return;
        }
	    g.stopEditing();
        dm.sort(cm.getDataIndex(index));
    },


    destroy : function(){
        if(this.colMenu){
            this.colMenu.removeAll();
            Roo.menu.MenuMgr.unregister(this.colMenu);
            this.colMenu.getEl().remove();
            delete this.colMenu;
        }
        if(this.hmenu){
            this.hmenu.removeAll();
            Roo.menu.MenuMgr.unregister(this.hmenu);
            this.hmenu.getEl().remove();
            delete this.hmenu;
        }
        if(this.grid.enableColumnMove){
            var dds = Roo.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            if(dds){
                for(var dd in dds){
                    if(!dds[dd].config.isTarget && dds[dd].dragElId){
                        var elid = dds[dd].dragElId;
                        dds[dd].unreg();
                        Roo.get(elid).remove();
                    } else if(dds[dd].config.isTarget){
                        dds[dd].proxyTop.remove();
                        dds[dd].proxyBottom.remove();
                        dds[dd].unreg();
                    }
                    if(Roo.dd.DDM.locationCache[dd]){
                        delete Roo.dd.DDM.locationCache[dd];
                    }
                }
                delete Roo.dd.DDM.ids['gridHeader' + this.grid.getGridEl().id];
            }
        }
        Roo.util.CSS.removeStyleSheet(this.idToCssName(this.grid.id) + '-cssrules');
        this.bind(null, null);
        Roo.EventManager.removeResizeListener(this.onWindowResize, this);
    },

    handleLockChange : function(){
        this.refresh(true);
    },

    onDenyColumnLock : function(){

    },

    onDenyColumnHide : function(){

    },

    handleHdMenuClick : function(item){
        var index = this.hdCtxIndex;
        var cm = this.cm, ds = this.ds;
        switch(item.id){
            case "asc":
                ds.sort(cm.getDataIndex(index), "ASC");
                break;
            case "desc":
                ds.sort(cm.getDataIndex(index), "DESC");
                break;
            case "lock":
                var lc = cm.getLockedCount();
                if(cm.getColumnCount(true) <= lc+1){
                    this.onDenyColumnLock();
                    return;
                }
                if(lc != index){
                    cm.setLocked(index, true, true);
                    cm.moveColumn(index, lc);
                    this.grid.fireEvent("columnmove", index, lc);
                }else{
                    cm.setLocked(index, true);
                }
            break;
            case "unlock":
                var lc = cm.getLockedCount();
                if((lc-1) != index){
                    cm.setLocked(index, false, true);
                    cm.moveColumn(index, lc-1);
                    this.grid.fireEvent("columnmove", index, lc-1);
                }else{
                    cm.setLocked(index, false);
                }
            break;
            default:
                index = cm.getIndexById(item.id.substr(4));
                if(index != -1){
                    if(item.checked && cm.getColumnCount(true) <= 1){
                        this.onDenyColumnHide();
                        return false;
                    }
                    cm.setHidden(index, item.checked);
                }
        }
        return true;
    },

    beforeColMenuShow : function(){
        var cm = this.cm,  colCount = cm.getColumnCount();
        this.colMenu.removeAll();
        for(var i = 0; i < colCount; i++){
            this.colMenu.add(new Roo.menu.CheckItem({
                id: "col-"+cm.getColumnId(i),
                text: cm.getColumnHeader(i),
                checked: !cm.isHidden(i),
                hideOnClick:false
            }));
        }
    },

    handleHdCtx : function(g, index, e){
        e.stopEvent();
        var hd = this.getHeaderCell(index);
        this.hdCtxIndex = index;
        var ms = this.hmenu.items, cm = this.cm;
        ms.get("asc").setDisabled(!cm.isSortable(index));
        ms.get("desc").setDisabled(!cm.isSortable(index));
        if(this.grid.enableColLock !== false){
            ms.get("lock").setDisabled(cm.isLocked(index));
            ms.get("unlock").setDisabled(!cm.isLocked(index));
        }
        this.hmenu.show(hd, "tl-bl");
    },

    handleHdOver : function(e){
        var hd = this.findHeaderCell(e.getTarget());
        if(hd && !this.headersDisabled){
            if(this.grid.colModel.isSortable(this.getCellIndex(hd))){
               this.fly(hd).addClass("x-grid-hd-over");
            }
        }
    },

    handleHdOut : function(e){
        var hd = this.findHeaderCell(e.getTarget());
        if(hd){
            this.fly(hd).removeClass("x-grid-hd-over");
        }
    },

    handleSplitDblClick : function(e, t){
        var i = this.getCellIndex(t);
        if(this.grid.enableColumnResize !== false && this.cm.isResizable(i) && !this.cm.isFixed(i)){
            this.autoSizeColumn(i, true);
            this.layout();
        }
    },

    render : function(){

        var cm = this.cm;
        var colCount = cm.getColumnCount();

        if(this.grid.monitorWindowResize === true){
            Roo.EventManager.onWindowResize(this.onWindowResize, this, true);
        }
        var header = this.renderHeaders();
        var body = this.templates.body.apply({rows:""});
        var html = this.templates.master.apply({
            lockedBody: body,
            body: body,
            lockedHeader: header[0],
            header: header[1]
        });

        //this.updateColumns();

        this.grid.getGridEl().dom.innerHTML = html;

        this.initElements();

        this.scroller.on("scroll", this.handleScroll, this);
        this.lockedBody.on("mousewheel", this.handleWheel, this);
        this.mainBody.on("mousewheel", this.handleWheel, this);

        this.mainHd.on("mouseover", this.handleHdOver, this);
        this.mainHd.on("mouseout", this.handleHdOut, this);
        this.mainHd.on("dblclick", this.handleSplitDblClick, this,
                {delegate: "."+this.splitClass});

        this.lockedHd.on("mouseover", this.handleHdOver, this);
        this.lockedHd.on("mouseout", this.handleHdOut, this);
        this.lockedHd.on("dblclick", this.handleSplitDblClick, this,
                {delegate: "."+this.splitClass});

        if(this.grid.enableColumnResize !== false && Roo.grid.SplitDragZone){
            new Roo.grid.SplitDragZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
        }

        this.updateSplitters();

        if(this.grid.enableColumnMove && Roo.grid.HeaderDragZone){
            new Roo.grid.HeaderDragZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
            new Roo.grid.HeaderDropZone(this.grid, this.lockedHd.dom, this.mainHd.dom);
        }

        if(this.grid.enableCtxMenu !== false && Roo.menu.Menu){
            this.hmenu = new Roo.menu.Menu({id: this.grid.id + "-hctx"});
            this.hmenu.add(
                {id:"asc", text: this.sortAscText, cls: "xg-hmenu-sort-asc"},
                {id:"desc", text: this.sortDescText, cls: "xg-hmenu-sort-desc"}
            );
            if(this.grid.enableColLock !== false){
                this.hmenu.add('-',
                    {id:"lock", text: this.lockText, cls: "xg-hmenu-lock"},
                    {id:"unlock", text: this.unlockText, cls: "xg-hmenu-unlock"}
                );
            }
            if(this.grid.enableColumnHide !== false){

                this.colMenu = new Roo.menu.Menu({id:this.grid.id + "-hcols-menu"});
                this.colMenu.on("beforeshow", this.beforeColMenuShow, this);
                this.colMenu.on("itemclick", this.handleHdMenuClick, this);

                this.hmenu.add('-',
                    {id:"columns", text: this.columnsText, menu: this.colMenu}
                );
            }
            this.hmenu.on("itemclick", this.handleHdMenuClick, this);

            this.grid.on("headercontextmenu", this.handleHdCtx, this);
        }

        if((this.grid.enableDragDrop || this.grid.enableDrag) && Roo.grid.GridDragZone){
            this.dd = new Roo.grid.GridDragZone(this.grid, {
                ddGroup : this.grid.ddGroup || 'GridDD'
            });
        }

        /*
        for(var i = 0; i < colCount; i++){
            if(cm.isHidden(i)){
                this.hideColumn(i);
            }
            if(cm.config[i].align){
                this.css.updateRule(this.colSelector + i, "textAlign", cm.config[i].align);
                this.css.updateRule(this.hdSelector + i, "textAlign", cm.config[i].align);
            }
        }*/
        
        this.updateHeaderSortState();

        this.beforeInitialResize();
        this.layout(true);

        // two part rendering gives faster view to the user
        this.renderPhase2.defer(1, this);
    },

    renderPhase2 : function(){
        // render the rows now
        this.refresh();
        if(this.grid.autoSizeColumns){
            this.autoSizeColumns();
        }
    },

    beforeInitialResize : function(){

    },

    onColumnSplitterMoved : function(i, w){
        this.userResized = true;
        var cm = this.grid.colModel;
        cm.setColumnWidth(i, w, true);
        var cid = cm.getColumnId(i);
        this.css.updateRule(this.colSelector + this.idToCssName(cid), "width", (w-this.borderWidth) + "px");
        this.css.updateRule(this.hdSelector + this.idToCssName(cid), "width", (w-this.borderWidth) + "px");
        this.updateSplitters();
        this.layout();
        this.grid.fireEvent("columnresize", i, w);
    },

    syncRowHeights : function(startIndex, endIndex){
        if(this.grid.enableRowHeightSync === true && this.cm.getLockedCount() > 0){
            startIndex = startIndex || 0;
            var mrows = this.getBodyTable().rows;
            var lrows = this.getLockedTable().rows;
            var len = mrows.length-1;
            endIndex = Math.min(endIndex || len, len);
            for(var i = startIndex; i <= endIndex; i++){
                var m = mrows[i], l = lrows[i];
                var h = Math.max(m.offsetHeight, l.offsetHeight);
                m.style.height = l.style.height = h + "px";
            }
        }
    },

    layout : function(initialRender, is2ndPass){
        var g = this.grid;
        var auto = g.autoHeight;
        var scrollOffset = 16;
        var c = g.getGridEl(), cm = this.cm,
                expandCol = g.autoExpandColumn,
                gv = this;
        //c.beginMeasure();

        if(!c.dom.offsetWidth){ // display:none?
            if(initialRender){
                this.lockedWrap.show();
                this.mainWrap.show();
            }
            return;
        }

        var hasLock = this.cm.isLocked(0);

        var tbh = this.headerPanel.getHeight();
        var bbh = this.footerPanel.getHeight();

        if(auto){
            var ch = this.getBodyTable().offsetHeight + tbh + bbh + this.mainHd.getHeight();
            var newHeight = ch + c.getBorderWidth("tb");
            if(g.maxHeight){
                newHeight = Math.min(g.maxHeight, newHeight);
            }
            c.setHeight(newHeight);
        }

        if(g.autoWidth){
            c.setWidth(cm.getTotalWidth()+c.getBorderWidth('lr'));
        }

        var s = this.scroller;

        var csize = c.getSize(true);

        this.el.setSize(csize.width, csize.height);

        this.headerPanel.setWidth(csize.width);
        this.footerPanel.setWidth(csize.width);

        var hdHeight = this.mainHd.getHeight();
        var vw = csize.width;
        var vh = csize.height - (tbh + bbh);

        s.setSize(vw, vh);

        var bt = this.getBodyTable();
        var ltWidth = hasLock ?
                      Math.max(this.getLockedTable().offsetWidth, this.lockedHd.dom.firstChild.offsetWidth) : 0;

        var scrollHeight = bt.offsetHeight;
        var scrollWidth = ltWidth + bt.offsetWidth;
        var vscroll = false, hscroll = false;

        this.scrollSizer.setSize(scrollWidth, scrollHeight+hdHeight);

        var lw = this.lockedWrap, mw = this.mainWrap;
        var lb = this.lockedBody, mb = this.mainBody;

        setTimeout(function(){
            var t = s.dom.offsetTop;
            var w = s.dom.clientWidth,
                h = s.dom.clientHeight;

            lw.setTop(t);
            lw.setSize(ltWidth, h);

            mw.setLeftTop(ltWidth, t);
            mw.setSize(w-ltWidth, h);

            lb.setHeight(h-hdHeight);
            mb.setHeight(h-hdHeight);

            if(is2ndPass !== true && !gv.userResized && expandCol){
                // high speed resize without full column calculation
                
                var ci = cm.getIndexById(expandCol);
                if (ci < 0) {
                    ci = cm.findColumnIndex(expandCol);
                }
                ci = Math.max(0, ci); // make sure it's got at least the first col.
                var expandId = cm.getColumnId(ci);
                var  tw = cm.getTotalWidth(false);
                var currentWidth = cm.getColumnWidth(ci);
                var cw = Math.min(Math.max(((w-tw)+currentWidth-2)-/*scrollbar*/(w <= s.dom.offsetWidth ? 0 : 18), g.autoExpandMin), g.autoExpandMax);
                if(currentWidth != cw){
                    cm.setColumnWidth(ci, cw, true);
                    gv.css.updateRule(gv.colSelector+gv.idToCssName(expandId), "width", (cw - gv.borderWidth) + "px");
                    gv.css.updateRule(gv.hdSelector+gv.idToCssName(expandId), "width", (cw - gv.borderWidth) + "px");
                    gv.updateSplitters();
                    gv.layout(false, true);
                }
            }

            if(initialRender){
                lw.show();
                mw.show();
            }
            //c.endMeasure();
        }, 10);
    },

    onWindowResize : function(){
        if(!this.grid.monitorWindowResize || this.grid.autoHeight){
            return;
        }
        this.layout();
    },

    appendFooter : function(parentEl){
        return null;
    },

    sortAscText : "Sort Ascending",
    sortDescText : "Sort Descending",
    lockText : "Lock Column",
    unlockText : "Unlock Column",
    columnsText : "Columns"
});


Roo.grid.GridView.ColumnDragZone = function(grid, hd){
    Roo.grid.GridView.ColumnDragZone.superclass.constructor.call(this, grid, hd, null);
    this.proxy.el.addClass('x-grid3-col-dd');
};

Roo.extend(Roo.grid.GridView.ColumnDragZone, Roo.grid.HeaderDragZone, {
    handleMouseDown : function(e){

    },

    callHandleMouseDown : function(e){
        Roo.grid.GridView.ColumnDragZone.superclass.handleMouseDown.call(this, e);
    }
});
