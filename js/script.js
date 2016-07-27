(function() {
  
    /* GLOBAL SETTINGS */  
    
    var AOP = {
        timeToWaitForLast: 100,
        viewport: _updateViewportDimensions(),
        navIconAnimationDur: 300,
        mousedown: 'mousedown',
        mouseup: 'mouseup',
        mousemove: 'mousemove',
        controller: {},
        sceneHeights: [],
        scenePinLengths: []
    };
    
    // Account for mobile input
    if('ontouchstart' in document.documentElement) {
        AOP.mousedown = 'touchstart';
        AOP.mouseup = 'touchend';
        AOP.mousemove = 'touchmove';
        AOP.explosionParticleAmount = 50;
    }
    
    /* MAIN FUNCTIONS */
    
    // Document ready
    $(document).ready(function() {
        imageLoader();
        loadPopovers();
    });
    
    // Window resized
    $(window).resize(function() {
       
        _waitForFinalEvent(function() {
            AOP.viewport = _updateViewportDimensions();
        }, AOP.timeToWaitForLast, "window-resize");
            
    });
    
    /* HELPER FUNCTIONS */
    
    // Update viewport size
    function _updateViewportDimensions() {
        
        var w = window, d = document, e = d.documentElement, g = d.getElementsByTagName('body')[0], x = w.innerWidth || e.clientWidth || g.clientWidth, y = w.innerHeight || e.clientHeight || g.clientHeight;
        
        return {width: x, height: y};
        
    }
    
    // Wait on events
    var _waitForFinalEvent = (function() {
        
        var timers = {};
        
        return function(callback, ms, uniqueId) {
            if(!uniqueId) {
                uniqueId = "Don't call this twice without a uniqueId";
            }
            if(timers[uniqueId]) {
                clearTimeout(timers[uniqueId]);
            }
            timers[uniqueId] = setTimeout(callback, ms);
        };
    })();
    
    // Calculate scene height offsets
    function _sceneOffset(sceneNumber) {
        
        var total = 0;
        
        var scenesHeightsForOffset = AOP.sceneHeights.slice(0, sceneNumber-1);
        var scenesPinsForOffset = AOP.scenePinLengths.slice(0, sceneNumber-1);
        
        for(var i = 0; i < scenesHeightsForOffset.length; i++) {
            total += scenesHeightsForOffset[i] + scenesPinsForOffset[i];
        }
        
        return total;
        
    }
    
    // Attach events to popovers
    function loadPopovers() {
        
        var body = $('body');
        
        var openPopoverLinks = $('.open-popover');
        var closePopoverLinks = $('.close-popover');
        var currentPopover;
        
        openPopoverLinks.on(AOP.mouseup, function(){
            var popoverSelector = jQuery(this).attr('data-popover-id');
            var popover = jQuery(popoverSelector);
            currentPopover = popover;
            body.addClass('disable-scrolling');
            popover.addClass('open');
        });

        closePopoverLinks.on(AOP.mouseup, function(){
            //console.log('currentPopover: ', currentPopover);
            if(currentPopover){
                body.removeClass('disable-scrolling');
                currentPopover.removeClass('open');
            }
        });
        
    }
    
/* ======================================================*/
    
    // Show loading progress bar until loading of all image assets is completed
  // SOURCE: https://imagesloaded.desandro.com/
  // DEMO: http://codepen.io/desandro/pen/bIFyl
  function imageLoader() {
    var loadedImageCount = 0;
    var body = jQuery('body');
    var container = jQuery('#content');
    var status = jQuery('#loading-status');
    //var progress = status.find('progress');
    //var fallback = progress.find('.fallback > span');
    var fallback = status.find('.fallback > span');
    var progressText = status.find('p');
    var imageCount = container.find('img').length;
    //progress.attr('max', imageCount);

    container.imagesLoaded().progress(onProgress).always(onAlways);

    function onProgress(imgLoad, image) { // triggered after each item is loaded
      // update progress element
      loadedImageCount++;
      //console.log('Image '+ loadedImageCount + ' of ' + imageCount +' images are loaded!')
      var percentageLoaded = Math.round((loadedImageCount/imageCount)*100);
      //progress.attr('value', loadedImageCount);
      progressText.text('Loading '+ percentageLoaded +'%');
      fallback.css('width', percentageLoaded+'%');
    }

    function onAlways() { // hide status when done
      scrollInit();
      body.removeClass('disable-scrolling');
      status.removeClass('loading');
      fallback.css('width', '0px');
    }
  }
    
/* ======================================================*/
    
    /* SCROLL SCENES */
    
    scrollInit();
    
    function scrollInit() {
        
        AOP.controller = new ScrollMagic.Controller();
        
        // Init scene heights
        var scenes = $('.scene');
        for(var i = 0; i < scenes.length; i++) {
            AOP.sceneHeights.push($(scenes[i]).height());
        }
        
        // Init scene pin durations
        for(var i =0; i < scenes.length; i++) {
            if(AOP.scenePinLengths.length == i) {
                AOP.scenePinLengths.push(0);
            }
        }
        
    }
    
    loadScene2(2);
    loadScene3(3);
    loadScene4(4);
    loadScene5(5);
    loadScene6(6);
    loadScene7(7);
    
    function loadScene2(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
        // Set pinned duration.
        var pinned = true;
        var pinDur = 1000;
        
        /* Scene Pinning */
        
        // Plugin directive.
        if(pinned) {    
            var content_pin = new ScrollMagic.Scene(
                {duration: pinDur, offset: _sceneOffset(sceneNumber) + 200})
                .setPin('#content', {pushFollowers: false})
                .addTo(AOP.controller);
            // Store duration (margin) value.
            AOP.scenePinLengths[sceneIndex] = pinDur;
        }
        
        /* Animated Elements */
        
        // Table slide-up animation.
        var tableAnim = new ScrollMagic.Scene({duration: 300, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.table', 300, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Toolbox slide-down fade-in animation.
        var toolboxAnim = new ScrollMagic.Scene({duration: 300, offset: _sceneOffset(sceneNumber) + 100})
            .setTween(TweenMax.to('.single-image.toolbox', 300, {opacity: 1, y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Tools slide-in fade-in animation.
        var toolsAnim = new ScrollMagic.Scene({duration: 300, offset: _sceneOffset(sceneNumber) + 350})
            .setTween(TweenMax.to('.single-image.tool', 300, {opacity: 1, x: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Hearts slide-down staggered animation.
        var heartsAnim = new ScrollMagic.Scene({duration: 500, offset: _sceneOffset(sceneNumber) + 500})
            .setTween(TweenMax.staggerTo('.single-image.hearts', 500, {y: 0, ease: Cubic.easeOut}, 200))
            .addTo(AOP.controller);
        
        // Text fade-in animation.
        var textAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 600})
            .setTween(TweenMax.to('.text-wrap.text-toolbox', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
    }
    
    function loadScene3(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
        // Set pinned duration.
        var pinned = false;
        var pinDur = 600;
        
        /* Scene Pinning */
        
        // Plugin directive.
        if(pinned) {  
            var content_pin = new ScrollMagic.Scene(
                {duration: pinDur, offset: _sceneOffset(sceneNumber) + 200})
                .setPin('#content', {pushFollowers: false})
                .addTo(AOP.controller);
            // Store duration (margin) value.
            AOP.scenePinLengths[sceneIndex] = pinDur;
        }
        
        // Wave background parallax animation.
        var waveAnim = new ScrollMagic.Scene({duration: 1200, offset: _sceneOffset(sceneNumber) - 600})
            .setTween(TweenMax.to('.bg-image.waves', 1200, {y: 0, ease: Linear.easeNone}))
            .addTo(AOP.controller);
        
        // Poles slide-in animation.
        var polesAnim = new ScrollMagic.Scene({duration: 300, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.pole', 300, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Land slide-in animation.
        var landAnim = new ScrollMagic.Scene({duration: 400, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.land', 400, {x: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
    }
    
    function loadScene4(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
        // Set pinned duration.
        var pinned = true;
        var pinDur = 1000;
        
        /* Scene Pinning */
        
        // Plugin directive.
        if(pinned) {  
            var content_pin = new ScrollMagic.Scene(
                {duration: pinDur, offset: _sceneOffset(sceneNumber)})
                .setPin('#content', {pushFollowers: false})
                .addTo(AOP.controller);
            // Store duration (margin) value.
            AOP.scenePinLengths[sceneIndex] = pinDur;
        }
        
        // Post-its-left fade-in animation.
        var postitslAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 50})
            .setTween(TweenMax.to('.single-image.postitsl', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Post-its-right fade-in animation.
        var postitsrAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 150})
            .setTween(TweenMax.to('.single-image.postitsr', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Mirror slide-in animation.
        var mirrorAnim = new ScrollMagic.Scene({duration: 400, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.mirror', 400, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Person & Reflection fade-swipe-in animation.
        var figureAnim = new ScrollMagic.Scene({duration: 600, offset: _sceneOffset(sceneNumber) + 200})
            .setTween(TweenMax.to('.single-image.figure', 600, {x: 0, opacity: 1, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Text fade-in animation.
        var textAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 600})
            .setTween(TweenMax.to('.text-wrap.text-audience', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
    }
    
    function loadScene5(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
        // Set pinned duration.
        var pinned = true;
        var pinDur = 1000;
        
        /* Scene Pinning */
        
        // Plugin directive.
        if(pinned) {  
            var content_pin = new ScrollMagic.Scene(
                {duration: pinDur, offset: _sceneOffset(sceneNumber)})
                .setPin('#content', {pushFollowers: false})
                .addTo(AOP.controller);
            // Store duration (margin) value.
            AOP.scenePinLengths[sceneIndex] = pinDur;
        }
        
        // Bookcase Light slide-in animation.
        var bookcaseAnim = new ScrollMagic.Scene({duration: 500, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.bookcaselight', 500, {x: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Bookcase dark slide-in animation.
        var bookcaseAnim = new ScrollMagic.Scene({duration: 500, offset: _sceneOffset(sceneNumber) - 100})
            .setTween(TweenMax.to('.single-image.bookcasedark', 500, {x: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // PC slide-in animation.
        var pcAnim = new ScrollMagic.Scene({duration: 350, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.pc', 350, {x: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Book slide-up animation.
        var bookAnim = new ScrollMagic.Scene({duration: 250, offset: _sceneOffset(sceneNumber)})
            .setTween(TweenMax.to('.single-image.book', 250, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
       // Survey slide-up animation.
        var surveyAnim = new ScrollMagic.Scene({duration: 250, offset: _sceneOffset(sceneNumber) + 50})
            .setTween(TweenMax.to('.single-image.survey', 250, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Bubble expand fade-in animation.
        var bubblelAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 500})
            .setTween(TweenMax.to('.single-image.bubble', 200, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Graph expand fade-in animation.
        var bubbleAnim = new ScrollMagic.Scene({duration: 250, offset: _sceneOffset(sceneNumber) + 600})
            .setTween(TweenMax.to('.single-image.graph', 250, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Energy drink slide-up animation.
        var energydrinkAnim = new ScrollMagic.Scene({duration: 150, offset: _sceneOffset(sceneNumber) + 800})
            .setTween(TweenMax.to('.single-image.energydrink', 150, {y: 0, ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
    }
    
    function loadScene6(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
  
        // Eye expand fade-in animation.
        var eyeAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) - 300})
            .setTween(TweenMax.to('.single-image.eye', 200, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Eye text fade-in animation.
        var eyetextAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber)})
            .setTween(TweenMax.to('#text-eye', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Heart expand fade-in animation.
        var heartAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 300})
            .setTween(TweenMax.to('.single-image.heart', 200, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Heart text fade-in animation.
        var hearttextAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 600})
            .setTween(TweenMax.to('#text-heart', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Needle expand fade-in animation.
        var needleAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 900})
            .setTween(TweenMax.to('.single-image.needle', 200, {opacity: 1, transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Needle text fade-in animation.
        var needletextAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) + 1200})
            .setTween(TweenMax.to('#text-needle', 200, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
    }
    
    function loadScene7(sceneNumber) {
        
        /* Scene Settings */
        
        // Set semantically correct scene number.
        var sceneIndex = sceneNumber - 1;
  
        // Circuits slide-in animation.
        var circuitstAnim = new ScrollMagic.Scene({duration: 400, offset: _sceneOffset(sceneNumber) - 200})
            .setTween(TweenMax.to('.single-image.circuitst', 400, {transform: 'matrix(1, 0, 0, 1, 0, 0)', ease: Cubic.easeOut}))
            .addTo(AOP.controller);
        
        // Android fade-in animation.
        var androidAnim = new ScrollMagic.Scene({duration: 200, offset: _sceneOffset(sceneNumber) - 100})
            .setTween(TweenMax.to('.single-image.android', 40, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
        // Download text fade-in animation.
        var androidAnim = new ScrollMagic.Scene({duration: 100, offset: _sceneOffset(sceneNumber) + 100})
            .setTween(TweenMax.to('.text-wrap.text-download', 100, {opacity: 1, ease: Linear.ease}))
            .addTo(AOP.controller);
        
    }
    
})();