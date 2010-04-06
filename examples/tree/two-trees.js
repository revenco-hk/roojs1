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
 
var TreeTest = function(){
    // shorthand
    var Tree = Roo.tree;
    
    return {
        init : function(){
            // yui-ext tree
            var tree = new Tree.TreePanel('tree', {
                animate:true, 
                loader: new Tree.TreeLoader({dataUrl:'get-nodes.php'}),
                enableDD:true,
                containerScroll: true,
                dropConfig: {appendOnly:true}
            });
            
            // add a tree sorter in folder mode
            new Tree.TreeSorter(tree, {folderSort:true});
            
            // set the root node
            var root = new Tree.AsyncTreeNode({
                text: 'Ext JS', 
                draggable:false, // disable root node dragging
                id:'source'
            });
            tree.setRootNode(root);
            
            // render the tree
            tree.render();
            
            root.expand(false, /*no anim*/ false);
            
            //-------------------------------------------------------------
            
            // YUI tree            
            var tree2 = new Tree.TreePanel('tree2', {
                animate:true, 
                //rootVisible: false,
                loader: new Roo.tree.TreeLoader({
                    dataUrl:'get-nodes.php',
                    baseParams: {lib:'yui'} // custom http params
                }),
                containerScroll: true,
                enableDD:true,
                dropConfig: {appendOnly:true}
            });
            
            // add a tree sorter in folder mode
            new Tree.TreeSorter(tree2, {folderSort:true});
            
            // add the root node
            var root2 = new Tree.AsyncTreeNode({
                text: 'My Files', 
                draggable:false, 
                id:'yui'
            });
            tree2.setRootNode(root2);
            tree2.render();
            
            root2.expand(false, /*no anim*/ false);
        }
    };
}();

Roo.EventManager.onDocumentReady(TreeTest.init, TreeTest, true);