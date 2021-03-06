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





