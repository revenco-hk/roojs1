/* <script type="text/javascript">
// -----------------------------------------------------------------------------------
// Roo lightbox - based on..
//
//	Lightbox v2.04
//	by Lokesh Dhakar - http://www.lokeshdhakar.com
//	Last Modification: 2/9/08
//
//	For more information, visit:
//	http://lokeshdhakar.com/projects/lightbox2/
//
//	Licensed under the Creative Commons Attribution 2.5 License - http://creativecommons.org/licenses/by/2.5/
//  	- Free for use in both personal and commercial projects
//		- Attribution requires leaving author name, author link, and the license info intact.
//	
//  Thanks: Scott Upton(uptonic.com), Peter-Paul Koch(quirksmode.com), and Thomas Fuchs(mir.aculo.us) for ideas, libs, and snippets.
//  		Artemy Tregubenko (arty.name) for cleanup and help in updating to latest ver of proto-aculous.
//
// -----------------------------------------------------------------------------------
/*

    Table of Contents
    -----------------
    Configuration

    Lightbox Class Declaration
    - initialize()
    - updateImageList()
    - start()
    - changeImage()
    - resizeImageContainer()
    - showImage()
    - updateDetails()
    - updateNav()
    - enableKeyboardNav()
    - disableKeyboardNav()
    - keyboardAction()
    - preloadNeighborImages()
    - end()
    
    Function Calls
    - document.observe()
   
*/
Roo.namespace('Roo.ux'); 
 
Roo.ux.Lightbox = function(cfg) {
    Roo.apply(this,cfg);
    this.initialize();
}

Roo.apply(Roo.ux.Lightbox.prototype,  
{
    // optiosn..
    /**
     * @cfg fileLoadingImage {string} loading image
     */
    fileLoadingImage:        '/lightbox/images/loading.gif',     
    /**
     * @cfg fileBottomNavCloseImage {string} close image
     */
    fileBottomNavCloseImage: '/lightbox/images/closelabel.gif',
    /**
     * @cfg overlayOpacity {number} controls transparency of shadow overlay
     */
    overlayOpacity: 0.8,   
    /**
     * @cfg fileLoadingImage {boolean} toggles resizing animations
     */
    animate: true,          
    /**
     * @cfg resizeSpeed {number} controls the speed of the image 
     * resizing animations (1=slowest and 10=fastest)
     */
    resizeSpeed: 9,
    /**
     * @cfg borderSize {number} if you adjust the padding in the CSS, 
     * you will need to update this variable
     */
    borderSize: 10,
    /**
     * @cfg labelImage {string} When grouping images this is used to write: Image # of #.
     * Change it for non-english localization
     */
	labelImage: "Image",
	/**
     * @cfg labelOf {string}  When grouping images this is used to write: Image # of #.
     */
    labelOf: "of",
    
    
    
    
    /**
     * List of images
     */
    imageArray: [],
    
    /**
     * Current image.
     * 
     */
     
    activeImage: undefined,
    
    /**
     * initialize() 
     *  Constructor runs on completion of the DOM loading. Calls updateImageList and then
     * the function inserts html at the bottom of the page which is used to display the shadow 
     *  overlay and the image container.
     * 
     * 
     */
    initialize: function() {    
        
        this.updateImageList();
        
        // TBD this.keyboardAction = this.keyboardAction.bindAsEventListener(this);
        this.resizeSpeed  = Math.min(this.resizeSpeed, 10);
        this.resizeSpeed  = Math.max(this.resizeSpeed, 1);
        
	    this.resizeDuration = this.animate ? ((11 - this.resizeSpeed) * 0.15) : 0;
	    this.overlayDuration = this.animate ? 0.2 : 0;  // shadow fade in/out duration

        // When Lightbox starts it will resize itself from 250 by 250 to the current image dimension.
        // If animations are turned off, it will be hidden as to prevent a flicker of a
        // white 250 by 250 box.
        var size = (this.animate ? 250 : 1) + 'px';
        var dh = Roo.DomHelper;
        this.el = dh.append(document.body, {
                html: 
               //   '<div id="overlay"></div>' +
                  '<div id="lightbox">' +
                  '   <div id="outerImageContainer">' +
                  '       <div id="imageContainer">' +
                  '           <img id="lightboxImage">' +
                  '           <div style="" id="hoverNav">' +
                  '               <a href="#" id="prevLink"></a>' +
                  '               <a href="#" id="nextLink"></a>' +
                  '           </div>' +
                  '           <div id="loading">' +
                  '               <a href="#" id="loadingLink">&nbsp;</a>' +
                  '           </div>' +
                  '       </div>' +
                  '   </div>' +
                  '   <div id="imageDataContainer">' +
                  '       <div id="imageData">' +
                  '           <div id="imageDetails">' +
                  '               <span id="caption"></span>' +
                  '               <span id="numberDisplay"></span>' +
                  '           </div>' +
                  '           <div id="bottomNav">' +
                  '               <a href="#" id="bottomNavClose">' +
                  '                   <img src="images/close.gif">' +
                  '               </a>' +
                  '           </div>' +
                  '       </div>' +
                  '   </div>' +
                 '</div>'
            }, true);
         
         
        


		//Roo.get('overlay').hide();
        //Roo.get('overlay').on('click', this.end, this);
		Roo.get('lightbox').hide();
        Roo.get('lightbox').on('click',  function(event) { 
                if (event.getTarget().id == 'lightbox') {
                    this.end(); 
                }
            }, this);
            
		Roo.get('outerImageContainer').setStyle({ width: size, height: size });
        
		Roo.get('prevLink').on('click', 
            function(event) { 
                event.stop(); 
                this.changeImage(this.activeImage - 1); 
            }, this);
            
		Roo.get('nextLink').on('click', 
            function(event) { 
                event.stopEvent(); 
                this.changeImage(this.activeImage + 1); 
            },this);
            
		Roo.get('loadingLink').on('click', 
            function(event) { 
                event.stopEvent(); 
                this.end(); 
            }, this);
            
		Roo.get('bottomNavClose').on('click',  
            function(event) { 
                event.stopEvent(); 
                this.end(); 
            }, this);

        var th = this;
        (function(){
            var ids = 
                'lightbox outerImageContainer imageContainer ' + 
                'lightboxImage hoverNav prevLink nextLink loading loadingLink ' + 
                'imageDataContainer imageData imageDetails caption numberDisplay '
                'bottomNav bottomNavClose';   
                
            Roo.each(ids.split(' '), 
                function(id){ 
                    th[id] = Roo.get(id); 
                });
        }).defer(100);
    },

    /**
     * updateImageList()
     * Loops through anchor tags looking for 'lightbox' references and applies onclick
     * events to appropriate links. You can rerun after dynamically adding images w/ajax.
     * 
     */
    updateImageList: function() {   
        this.updateImageList = Roo.emptyFn;
        
        Roo.each(Roo.DomQuery.select('a[rel^=lightbox]'), function(e) {
            this.imageArray.push(Roo.get(e));
            Roo.get(e).on('click', function(event) {
                event.stopEvent();
                this.start(e);
            }, this);
        }, this)
        
    },
    
    /**
    * start()
    *  Display overlay and lightbox. If image is part of a set, add siblings to imageArray.
    */
    start: function(imageLink) {
        /*
        // hide all the objects that cause problems..
        $$('select', 'object', 'embed').each(
            function(node){ 
            node.style.visibility = 'hidden' }
        );
        */
        // stretch overlay to fill page and fade in
        //var arrayPageSize = this.getPageSize();
        
        if(!this._mask){
            this._mask = Roo.DomHelper.append(document.body, {cls:"roo-el-mask"}, true);
            this._mask.on('click', this.end, this);
        }
        this._mask.setDisplayed(true); // no animation..
        
        // ie will not expand full height automatically
        if(Roo.isIE && !(Roo.isIE7 && Roo.isStrict) && this.getStyle('height') == 'auto'){ 
            this._mask.setHeight( Roo.lib.Dom.getViewHeight());
        }
        
        //new Effect.Appear(this.overlay,
        //    { duration: this.overlayDuration, from: 0.0, to: this.overlayOpacity });

        //this.imageArray = [];
        var imageNum = 0;       

        // let's assume the constructor sorts out the list of images..
        /*
        if ((imageLink.rel == 'lightbox')){
            // if image is NOT part of a set, add single image to imageArray
            this.imageArray.push([imageLink.href, imageLink.title]);         
        } else {
            // if image is part of a set..
            this.imageArray = 
                $$(imageLink.tagName + '[href][rel="' + imageLink.rel + '"]').
                collect(function(anchor){ return [anchor.href, anchor.title]; }).
                uniq();
            
            while (this.imageArray[imageNum][0] != imageLink.href) { imageNum++; }
        }
        */
        var s = Roo.get(document).getScroll();
        
        // calculate top and left offset for the lightbox 
        // weird.. why / 10?
        var lightboxTop = s.top + (Roo.lib.Dom.getViewHeight() / 10);
        var lightboxLeft = s.left
        this.lightbox.setStyle({ 
            top: lightboxTop + 'px', 
            left: lightboxLeft + 'px' ,
            zIndex : this._mask.getStyle('zIndex') * 1.1
        })
        this.lightbox.show();
        
        
        
        this.changeImage(imageNum);
    },

    //
    //  changeImage()
    //  Hide most elements and preload image in preparation for resizing image container.
    //
    changeImage: function(imageNum) {   
        
        this.activeImage = imageNum; // update global var

        // hide elements during transition
        if (this.animate) {
            this.loading.setStyle({
                zIndex : this._mask.getStyle('zIndex') * 1.2
            });
            this.loading.show();
        }
        this.lightboxImage.hide();
        
        this.hoverNav.hide();
        this.prevLink.hide();
        this.nextLink.hide();
		// HACK: Opera9 does not currently support scriptaculous opacity and appear fx
        this.imageDataContainer.setStyle({opacity: .0001});
        this.numberDisplay.hide();
        
        var imgPreloader =  Roo.DomHelper.append(document.body, { tag: 'img' } , true);
        // once image is preloaded, resize image container


        imgPreloader.on('load', function() {
            this.lightboxImage.src = this.imageArray[this.activeImage].dom.href;
            this.resizeImageContainer(imgPreloader.getWidth(), imgPreloader.getHeight());
        }, this);
        imgPreloader.src = this.imageArray[this.activeImage].dom.href;
    },

    //
    //  resizeImageContainer()
    //
    resizeImageContainer: function(imgWidth, imgHeight) {

        // make sure we have some sensible sizes..
        imgWidth = Math.max(50, imgWidth);
        imgHeight = Math.max(50, imgHeight);
        
        // get current width and height
        var widthCurrent  = this.outerImageContainer.getWidth();
        var heightCurrent = this.outerImageContainer.getHeight();
        
        //fixme need better calcs.
        var w = window;
        var ww = w.innerWidth || (w.document.documentElement.clientWidth || w.document.body.clientWidth);
        var wh = w.innerHeight || (w.document.documentElement.clientHeight || w.document.body.clientHeight);
        
        ww -= 150;
        wh -= 150;
        // get new width and height
        var bs =  this.borderSize * 2;
        
        var widthNew  =  imgWidth  + bs;
        var heightNew =  imgHeight + bs;
        
        if (widthNew > ww || heightNew > wh) {
            // bigger than window.
            // scale here... - bit nasty..
            var rescale = 1.1 * Math.max( widthNew / ww , heightNew  / wh);
             //console.log(rescale);
            imgWidth = Math.floor(imgWidth / rescale);
            imgHeight = Math.floor(imgHeight / rescale);
            widthNew  =  imgWidth  + bs;
            heightNew =  imgHeight + bs;
                    
            
        }
        
        this.lightboxImage.set( { width : imgWidth, height : imgHeight });
        
        
        // scalars based on change from old to new
        var xScale = (widthNew  / widthCurrent)  * 100;
        var yScale = (heightNew / heightCurrent) * 100;

        // calculate size difference between new and old image, and resize if necessary
        var wDiff = widthCurrent - widthNew;
        var hDiff = heightCurrent - heightNew;
        
         
        this.outerImageContainer.animate(
            { width: {to: widthNew}, height: {to: heightNew} },
            duration,
            null, // on complete
            'easeOut', // easing
            'run' // effect
        
        )        
       
        
        // if new and old image are same size and no scaling transition is necessary, 
        // do a quick pause to prevent image flicker.
        var timeout = 0;
        if ((hDiff == 0) && (wDiff == 0)){
            timeout = 100;
            if (Roo.isIE) timeout = 250;   
        }

        (function(){
            this.prevLink.setStyle({ height: imgHeight + 'px' });
            this.nextLink.setStyle({ height: imgHeight + 'px' });
            this.imageDataContainer.setStyle({ width: widthNew + 'px',  width: heightNew + 'px', });
            this.showImage();
        }).defer(timeout / 1000, this);
    },
    
    //
    //  showImage()
    //  Display image and begin preloading neighbors.
    //
    showImage: function(){
        this.loading.hide();
        var _this=  this;
        this.lightboxImage.animate( 
            {
                opacity : { from : 0.0 , to: 1.0 }
            },
            function(){ 
                _this.updateDetails(); 
            },
            duration
        );
        this.preloadNeighborImages();
    },

    //
    //  updateDetails()
    //  Display caption, image number, and bottom nav.
    //
    updateDetails: function() {
    
        // if caption is not null
        if (this.imageArray[this.activeImage].dom.title  != ""){
            this.caption.update(this.imageArray[this.activeImage].dom.title);
            this.caption.show();
        }
        
        // if image is part of set display 'Image x of x' 
        if (this.imageArray.length > 1){
            this.numberDisplay.update(
                this.labelImage + ' ' + (this.activeImage + 1) + ' ' + this.labelOf + '  ' + this.imageArray.length)
            this.numberDisplay.show();
        }
        var _this = this;
        this.imageDataContainer.animate(
            {
                //slide down ?: , from: 0.0, to: 1.0 
                opacity :  { from : 0.0 , to: 1.0 }
            },
            this.resizeDuration,
            function() {
	                // update overlay size and update nav
	                //var arrayPageSize = this.getPageSize();
	                //this.overlay.setStyle({ height: arrayPageSize[1] + 'px' });
	                _this.updateNav();
            }
             
        );
    },

    //
    //  updateNav()
    //  Display appropriate previous and next hover navigation.
    //
    updateNav: function() {

        this.hoverNav.show();               

        // if not first image in set, display prev image button
        if (this.activeImage > 0) this.prevLink.show();

        // if not last image in set, display next image button
        if (this.activeImage < (this.imageArray.length - 1)) this.nextLink.show();
        
        this.enableKeyboardNav();
    },

    //
    //  enableKeyboardNav()
    //
    enableKeyboardNav: function() {
        Roo.get(document.body).on('keydown', this.keyboardAction, this); 
    },

    //
    //  disableKeyboardNav()
    //
    disableKeyboardNav: function() {
        Roo.get(document.body).un('keydown', this.keyboardAction, this); 
    },

    //
    //  keyboardAction()
    //
    keyboardAction: function(event) {
        var keycode = event.keyCode;

        var escapeKey;
        if (event.DOM_VK_ESCAPE) {  // mozilla
            escapeKey = event.DOM_VK_ESCAPE;
        } else { // ie
            escapeKey = 27;
        }

        var key = String.fromCharCode(keycode).toLowerCase();
        
        if (key.match(/x|o|c/) || (keycode == escapeKey)){ // close lightbox
            this.end();
        } else if ((key == 'p') || (keycode == 37)){ // display previous image
            if (this.activeImage != 0){
                this.disableKeyboardNav();
                this.changeImage(this.activeImage - 1);
            }
        } else if ((key == 'n') || (keycode == 39)){ // display next image
            if (this.activeImage != (this.imageArray.length - 1)){
                this.disableKeyboardNav();
                this.changeImage(this.activeImage + 1);
            }
        }
    },

    //
    //  preloadNeighborImages()
    //  Preload previous and next images.
    //
    preloadNeighborImages: function(){
        var preloadNextImage, preloadPrevImage;
        if (this.imageArray.length > this.activeImage + 1){
            preloadNextImage = Roo.DomHelper.append(document.body, { tag: 'img' } , true);
            preloadNextImage.src = this.imageArray[this.activeImage + 1].dom.href;
        }
        if (this.activeImage > 0){
            preloadPrevImage = Roo.DomHelper.append(document.body, { tag: 'img' } , true);
            preloadPrevImage.src = this.imageArray[this.activeImage - 1].dom.href;
        }
    
    },

    //
    //  end()
    //
    end: function() {
        this.disableKeyboardNav();
        this.lightbox.hide();
        this._mask.setDisplayed(false);
        // show all the objects that cause problems..
        //$$('select', 'object', 'embed').each(function(node){ node.style.visibility = 'visible' });
    }

     
});
 