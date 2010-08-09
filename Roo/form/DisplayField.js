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
 * @class Roo.form.DisplayField
 * @extends Roo.form.Field
 * A generic Field to display non-editable data.
 * @constructor
 * Creates a new Display Field item.
 * @param {Object} config Configuration options
 */
 
 
 Roo.form.DisplayText = function(config){
    Roo.form.DisplayText.superclass.constructor.call(this, config);
};
  
Roo.extend(Roo.form.DisplayText, Roo.form.TextField, {
    fieldLabel:      '',
    inputType:      'hidden',
    width:          50,
    allowBlank:     true,
    labelSeparator: '',
    hidden:         true,
    itemCls :       'x-form-item-display-none'


}); 
    
    
     /**
     * @cfg {Function} valueRenderer The renderer for the field (so you can reformat output). should return raw HTML
     */
   // valueRenderer: false,
    
  //  width: 100,
    /**
     * @cfg {String/Object} autoCreate A DomHelper element spec, or true for a default element spec (defaults to
     * {tag: "input", type: "checkbox", autocomplete: "off"})
     */
   /*  
    defaultAutoCreate : { tag: 'input', type: 'hidden', autocomplete: 'off'},

    onResize : function(){
        Roo.form.DisplayField.superclass.onResize.apply(this, arguments);
        
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
        Roo.form.DisplayField.superclass.onRender.call(this, ct, position);
        //if(this.inputValue !== undefined){
        
        
        this.wrap = this.el.wrap();
        this.viewEl = this.wrap.createChild({ tag: 'div'});
        
        if (this.bodyStyle) {
            this.viewEl.applyStyles(this.bodyStyle);
        }
        //this.viewEl.setStyle('padding', '2px');
        
        this.setValue(this.value);
        
    },
    */
/*
    // private
    initValue : Roo.emptyFn,

  */

	// private
    
   // onClick : function(){
    //    
    //},

    /**
     * Sets the checked state of the checkbox.
     * @param {Boolean/String} checked True, 'true', '1', or 'on' to check the checkbox, any other value will uncheck it.
     */
     /*
    setValue : function(v){
        this.value = v;
        var html = this.valueRenderer ?  this.valueRenderer(v) : String.format('{0}', v);
        this.viewEl.dom.innerHTML = html;
        Roo.form.DisplayField.superclass.setValue.call(this, v);

    }
    */
//});