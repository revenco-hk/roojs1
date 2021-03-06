//<script type="text/javascript">

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
            editor.toolbars[i] = Roo.factory(editor.toolbars[i], Roo.form.HtmlEditor);
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
            if (!Roo.get(this.frameId)) {
                return;
            }
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
            Roo.EventManager.on(this.doc, 'keypress', this.mozKeyPress, this);
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
        }else if(Roo.isGecko || Roo.isOpera || Roo.isSafari){
            this.win.focus();
            this.execCmd('InsertHTML', text);
            this.deferFocus();
        }
    },
 // private
    mozKeyPress : function(e){
        if(e.ctrlKey){
            var c = e.getCharCode(), cmd;
          
            if(c > 0){
                c = String.fromCharCode(c).toLowerCase();
                switch(c){
                    case 'b':
                        cmd = 'bold';
                    break;
                    case 'i':
                        cmd = 'italic';
                    break;
                    case 'u':
                        cmd = 'underline';
                    case 'v':
                        this.cleanUpPaste.defer(100, this);
                        return;
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
                    return;
                }
                
                if(k == e.ENTER){
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
                if (String.fromCharCode(k).toLowerCase() == 'v') { // paste
                    this.cleanUpPaste.defer(100, this);
                    return;
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
                if (String.fromCharCode(k).toLowerCase() == 'v') { // paste
                    this.cleanUpPaste.defer(100, this);
                    return;
                }
                
            };
        }else if(Roo.isSafari){
            return function(e){
                var k = e.getKey();
                
                if(k == e.TAB){
                    e.stopEvent();
                    this.execCmd('InsertText','\t');
                    this.deferFocus();
                    return;
                }
               if (String.fromCharCode(k).toLowerCase() == 'v') { // paste
                    this.cleanUpPaste.defer(100, this);
                    return;
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
    },

    // private? - in a new class?
    cleanUpPaste :  function()
    {
        // cleans up the whole document..
      //  console.log('cleanuppaste');
        this.cleanUpChildren(this.doc.body)
        
        
    },
    cleanUpChildren : function (n)
    {
        if (!n.childNodes.length) {
            return;
        }
        for (var i = n.childNodes.length-1; i > -1 ; i--) {
           this.cleanUpChild(n.childNodes[i]);
        }
    },
    
    
        
    
    cleanUpChild : function (node)
    {
        //console.log(node);
        if (node.nodeName == "#text") {
            // clean up silly Windows -- stuff?
            return; 
        }
        if (node.nodeName == "#comment") {
            node.parentNode.removeChild(node);
            // clean up silly Windows -- stuff?
            return; 
        }
        
        if (Roo.form.HtmlEditor.black.indexOf(node.tagName.toLowerCase()) > -1) {
            // remove node.
            node.parentNode.removeChild(node);
            return;
            
        }
        if (!node.attributes || !node.attributes.length) {
            this.cleanUpChildren(node);
            return;
        }
        
        function cleanAttr(n,v)
        {
            
            if (v.match(/^\./) || v.match(/^\//)) {
                return;
            }
            if (v.match(/^(http|https):\/\//) || v.match(/^mailto:/)) {
                return;
            }
            Roo.log("(REMOVE)"+ node.tagName +'.' + n + '=' + v);
            node.removeAttribute(n);
            
        }
        
        function cleanStyle(n,v)
        {
            if (v.match(/expression/)) { //XSS?? should we even bother..
                node.removeAttribute(n);
                return;
            }
            
            
            var parts = v.split(/;/);
            Roo.each(parts, function(p) {
                p = p.replace(/\s+/g,'');
                if (!p.length) {
                    return;
                }
                var l = p.split(':').shift().replace(/\s+/g,'');
                
                if (Roo.form.HtmlEditor.cwhite.indexOf(l) < 0) {
                    Roo.log('(REMOVE)' + node.tagName +'.' + n + ':'+l + '=' + v);
                    node.removeAttribute(n);
                    return false;
                }
            });
            
            
        }
        
        
        for (var i = node.attributes.length-1; i > -1 ; i--) {
            var a = node.attributes[i];
            //console.log(a);
            if (Roo.form.HtmlEditor.ablack.indexOf(a.name.toLowerCase()) > -1) {
                node.removeAttribute(a.name);
                return;
            }
            if (Roo.form.HtmlEditor.aclean.indexOf(a.name.toLowerCase()) > -1) {
                cleanAttr(a.name,a.value); // fixme..
                return;
            }
            if (a.name == 'style') {
                cleanStyle(a.name,a.value);
            }
            /// clean up MS crap..
            if (a.name == 'class') {
                if (a.value.match(/^Mso/)) {
                    node.className = '';
                }
            }
            
            // style cleanup!?
            // class cleanup?
            
        }
        
        
        this.cleanUpChildren(node);
        
        
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
});

Roo.form.HtmlEditor.white = [
        'area', 'br', 'img', 'input', 'hr', 'wbr',
        
       'address', 'blockquote', 'center', 'dd',      'dir',       'div', 
       'dl',      'dt',         'h1',     'h2',      'h3',        'h4', 
       'h5',      'h6',         'hr',     'isindex', 'listing',   'marquee', 
       'menu',    'multicol',   'ol',     'p',       'plaintext', 'pre', 
       'table',   'ul',         'xmp', 
       
       'caption', 'col', 'colgroup', 'tbody', 'td', 'tfoot', 'th', 
      'thead',   'tr', 
     
      'dir', 'menu', 'ol', 'ul', 'dl',
       
      'embed',  'object'
];


Roo.form.HtmlEditor.black = [
    //    'embed',  'object', // enable - backend responsiblity to clean thiese
        'applet', // 
        'base',   'basefont', 'bgsound', 'blink',  'body', 
        'frame',  'frameset', 'head',    'html',   'ilayer', 
        'iframe', 'layer',  'link',     'meta',    'object',   
        'script', 'style' ,'title',  'xml' // clean later..
];
Roo.form.HtmlEditor.clean = [
    'script', 'style', 'title', 'xml'
];

// attributes..

Roo.form.HtmlEditor.ablack = [
    'on'
];
    
Roo.form.HtmlEditor.aclean = [ 
    'action', 'background', 'codebase', 'dynsrc', 'href', 'lowsrc'
];

// protocols..
Roo.form.HtmlEditor.pwhite= [
        'http',  'https',  'mailto'
];

Roo.form.HtmlEditor.cwhite= [
        'text-align',
        'font-size'
];

