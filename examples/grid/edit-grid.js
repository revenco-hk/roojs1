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

Roo.BLANK_IMAGE_URL  = "../../images/default/s.gif";
 
Roo.onReady(function(){
    Roo.QuickTips.init();
    function formatBoolean(value){
        return value ? 'Yes' : 'No';  
    };
    
    function formatDate(value){
        return value ? value.dateFormat('M d, Y') : '';
    };
    // shorthand alias
    var fm = Roo.form, Ed = Roo.grid.GridEditor;

    // the column model has information about grid columns
    // dataIndex maps the column to the specific data field in
    // the data store (created below)
    var cm = new Roo.grid.ColumnModel([{
           header: "Common Name",
           dataIndex: 'common',
           width: 220,
           editor: new Ed(new fm.TextField({
               allowBlank: false
           }))
        },{
           header: "Light",
           dataIndex: 'light',
           width: 130,
           editor: new Ed(new Roo.form.ComboBox({
               typeAhead: true,
               triggerAction: 'all',
               transform:'light',
               lazyRender:true
            }))
        },{
           header: "Price",
           dataIndex: 'price',
           width: 70,
           align: 'right',
           renderer: 'usMoney',
           editor: new Ed(new fm.NumberField({
               allowBlank: false,
               allowNegative: false,
               maxValue: 10
           }))
        },{
           header: "Available",
           dataIndex: 'availDate',
           width: 95,
           renderer: formatDate,
           editor: new Ed(new fm.DateField({
                format: 'm/d/y',
                minValue: '01/01/06',
                disabledDays: [0, 6],
                disabledDaysText: 'Plants are not available on the weekends'
            }))
        },{
           header: "Indoor?",
           dataIndex: 'indoor',
           width: 55,
           renderer: formatBoolean,
           editor: new Ed(new fm.Checkbox())
        }]);

    // by default columns are sortable
    cm.defaultSortable = true;

    // this could be inline, but we want to define the Plant record
    // type so we can add records dynamically
    var Plant = Roo.data.Record.create([
           // the "name" below matches the tag name to read, except "availDate"
           // which is mapped to the tag "availability"
           {name: 'common', type: 'string'},
           {name: 'botanical', type: 'string'},
           {name: 'light'},
           {name: 'price', type: 'float'},             // automatic date conversions
           {name: 'availDate', mapping: 'availability', type: 'date', dateFormat: 'm/d/Y'},
           {name: 'indoor', type: 'bool'}
      ]);

    // create the Data Store
    var ds = new Roo.data.Store({
        // load using HTTP
        proxy: new Roo.data.HttpProxy({url: 'plants.xml'}),

        // the return will be XML, so lets set up a reader
        reader: new Roo.data.XmlReader({
               // records will have a "plant" tag
               record: 'plant'
           }, Plant)
    });

    // create the editor grid
    var grid = new Roo.grid.EditorGrid('editor-grid', {
        ds: ds,
        cm: cm,
        enableColLock:false
    });

    var layout = Roo.BorderLayout.create({
        center: {
            margins:{left:3,top:3,right:3,bottom:3},
            panels: [new Roo.GridPanel(grid)]
        }
    }, 'grid-panel');


    // render it
    grid.render();

    
    var gridHead = grid.getView().getHeaderPanel(true);
    var tb = new Roo.Toolbar(gridHead, [{
        text: 'Add Plant',
        handler : function(){
            var p = new Plant({
                common: 'New Plant 1',
                light: 'Mostly Shade',
                price: 0,
                availDate: new Date(),
                indoor: false
            });
            grid.stopEditing();
            ds.insert(0, p);
            grid.startEditing(0, 0);
        }
    }]);

    // trigger the data store load
    ds.load();
});