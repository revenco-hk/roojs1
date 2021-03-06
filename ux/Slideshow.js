//<script type="text/javascript">
/**
 * Slideshow  - based on a prototype one..
 *
 *
 * usage:
 * 
Roo.onReady( function() 
{
   // use a dom selector to define slides..
    var slides = Roo.DomQuery.select('.category-slide', true);
   
    oMySlides = new Roo.ux.Slideshow({
        slides 		: slides,
    });
             
});
 * 
 * 
 * @class Roo.ux.Slideshow
 */
Roo.namespace('Roo.ux');  

Roo.ux.Slideshow = function(cfg ) 
{
    Roo.apply(this, cfg);
    if ( !this.slides || !this.slides.length) {
        return;
    }
    if (this.slides.length == 1) {
        this.slides[0].setVisibilityMode(Roo.Element.DISPLAY);
        this.slides[0].show();
        return;
        
    }
    
    this.playButton = Roo.get(this.playButton);
    this.pauseButton = Roo.get(this.pauseButton);
    this.counter = Roo.get(this.counter);
    this.caption = Roo.get(this.caption);
    if ( this.autostart ) {
        this.startSlideShow();
    }
}

Roo.apply(Roo.ux.Slideshow.prototype, {
    
    wait 			: 4000,
	start 			: 0,
	duration		: 1,
	autostart		: true ,
     /**
     * @cfg {Array} of slides
     */
	slides 		    : false,
    /**
     * @cfg id/dom element counter to show the 
     */
	counter		    : false,
     /**
     * @cfg id/dom element of the caption.
     */
	caption		    : false,
     /**
     * @cfg id/dom element for play button
     */
	playButton		: false, 
    /**
     * @cfg id/dom element of the pause button
     */
	pauseButton	    : false, 
	iImageId		: 0, 
    running         : false,
    
	// The Fade Function
	swapImage: function (x,y) {
        if (this.slides[x] ) {
            this.slides[x].animate( 
                { opacity : { from : 0.0, to : 1.0 }},
                this.duration
            ); 
            this.slides[x].show();
        }
        if (this.slides[y] ) {
            this.slides[y].animate( 
                { opacity : { from : 1.0, to : 0.0 }},
                this.duration
            ); 
            this.slides[y].show();
        } 
		
	},
	
	// the onload event handler that starts the fading.
	startSlideShow: function () {
        var _t  = this;
        this.running = true;
		this.playButton && this.playButton.hide();
		this.pauseButton && this.pauseButton.show();
     
		this.updatecounter();
        this.slides[0].setStyle({ opacity : 1.0 });
        this.slides[0].show();
	    this.play.defer(this.wait, this);				
	},
	
	play: function () {
		
		var imageShow, imageHide;
	
		imageShow = this.iImageId+1;
		imageHide = this.iImageId;
		
		if (imageShow+1  > this.slides.length) {
			this.swapImage(0,imageHide);
            
			this.iImageId = 0;					
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId++;
		}
		
		this.textIn = this.iImageId+1 + ' of ' + this.slides.length;
		this.updatecounter();
        
        if (this.running) {
            this.play.defer(this.wait, this);
        }
        
	},
	
	stop: function  () {
		this.running = false; 	
		this.playButton && this.playButton.show();
		this.pauseButton && this.pauseButton.hide();
	},
	/*
	goNext: function () {
		clearInterval(this.play);
		$(this.playButton).appear({ duration: 0});
		$(this.pauseButton).hide();
		
		var imageShow, imageHide;
	
		imageShow = this.iImageId+1;
		imageHide = this.iImageId;
		
		if (imageShow == this.numOfImages) {
			this.swapImage(0,imageHide);	
			this.iImageId = 0;					
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId++;
		}
	
		this.updatecounter();
	},
	
	goPrevious: function () {
		clearInterval(this.play);
		$(this.playButton).appear({ duration: 0});
		$(this.pauseButton).hide();
	
		var imageShow, imageHide;
					
		imageShow = this.iImageId-1;
		imageHide = this.iImageId;
		
		if (this.iImageId == 0) {
			this.swapImage(this.numOfImages-1,imageHide);	
			this.iImageId = this.numOfImages-1;		
			
			//alert(NumOfImages-1 + ' and ' + imageHide + ' i=' + i)
						
		} else {
			this.swapImage(imageShow,imageHide);			
			this.iImageId--;
			
			//alert(imageShow + ' and ' + imageHide)
		}
		
		this.updatecounter();
	},
	*/
	updatecounter: function () {
        if (!this.counter) {
            return;
        }
		var textIn = this.iImageId+1 + ' of ' + this.slides.length;
		this.counter.update( textIn );
        var oNewCaption = this.slides[this.iImageId].select('.image-caption', true);
		if ( this.caption &&  oNewCaption.length ) {
			this.caption.update( oNewCaption[0].innerHTML);
		}
	}
});
  
  