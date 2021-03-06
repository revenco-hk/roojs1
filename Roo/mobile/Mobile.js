//<Script type="text/javascript">

/**
 * experiments with mobile UI's
 * 
 * usage: - mobile is a top level widget..
 * 
 * x = new Roo.mobile.Mobile {
    items : {
        Roo.mobile.Page
        *}
     }
 * 
 */

Roo.mobile.Mobile = function(cfg) {
     
    this.addEvents({ 
        'ready' : true
    });
    Roo.util.Observable.call(this,cfg);
    Roo.onReady(function() {
        this.init();
        this.fireEvent('ready');
    },this,false);
    
}


Roo.extend(Roo.mobile.Mobile, Roo.util.Observable, {
     init: function()
    {
        //var page = iui.getSelectedPage();
        ///var locPage = getPageFromLoc();
            
        //if (page)
        //        iui.showPage(page);
        
        //if (locPage && (locPage != page))
        //    iui.showPage(locPage);
        Roo.get(document.head).createChild(
            '<meta name="viewport" content="width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>'
        );
        //?? add the css?
        //setTimeout(preloadImages, 0);
        if (typeof window.onorientationchange == "object")
        {
            window.onorientationchange=this.orientChangeHandler;
            hasOrientationEvent = true;
            this.orientChangeHandler.defer(0, this);
        }
        this.checkOrientAndLocation.defer(0, this);
        this.checkTimer = setInterval(checkOrientAndLocation, 300);
    }
    orientChangeHandler: function()
    {
        if (window.orientation == 90 || window.orientation = -90) {
            this.setOrientation("landscape");
            return;
        }
        this.setOrientation("portrait");
        
    },
    
    setOrientation: function (orient)
    {
        document.body.setAttribute("orient", orient);
        setTimeout(scrollTo, 100, 0, 1);
    },

});


