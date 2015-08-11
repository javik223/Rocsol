$(document).ready(function(){
    var menuBtn = $('.menu'),
        menuOpen = false;

    /*
    * Reveal and hide settings for flyout menu.
    * The idea is to animate the height of the menu from
    * zero the actual height. Then fade the individual items into view.
    */
    var Menu = (function(){
        var 
            playHead = new TimelineMax({yoyo: true, paused: true}),
            menu = $(".nav_wrapper"),
            menuHeight = menu.outerHeight(),
            menuItems = menu.find('.nav-list').find('li'),
            header = $(".header")
            ;
            totalFromTop = header.height() + (parseInt(header.css('margin-top')) * 2);
            // Make Menu items wrapper start below the header
            TweenMax.set(menu, {top: (totalFromTop + 'px')});

            //console.log(totalFromTop);

       // Menu Settings
        playHead
            .set(menu, {autoAlpha: 1, height: 0, display: 'block'})
            .set(menuItems, {autoAlpha: 0})
            .to(menu, 0.5, {height: menuHeight, force3D: true, ease: Expo.easeOut})
            .staggerFromTo(menuItems, 0.8, {autoAlpha: 0, yPercent: '100%', scale: 1.025, force3D: true}, {autoAlpha: 1, yPercent: '0%', force3D: true, scale: 1, ease: Back.easeOut}, 0.2)
            ;

        // Reveal flyout navigation
        function show() {
            playHead.timeScale(1);
            playHead.play();
        }

        // hide flyout navigation
        function hide() {
            playHead.timeScale(3);
            playHead.reverse();
        }

        return {
            show: show,
            hide: hide
        };

    })();


    /*
    * Activate and deactivate the menu offcanvas menu
    * when the Menu Navigation Button is clicked.
    */
    menuBtn.on('click', function(){
        //console.log("I was clicked");

        if (menuOpen === false) {
            Menu.show();
        } else {
            Menu.hide();
        }

        menuOpen = !menuOpen;
    });

    /*
    * Internal subnavigation on specific pages.
    * Clicking on each link scrolls the window down to the section
    * on the page.
    */

    var scrollToSection = function() {
        // Get the current location hash and strip it of the '#' symbol
        var elem,
            hash = location.hash ? location.hash. slice(1) : '';

        if (hash.length > 0 && (elem = $('.'+hash)).length > 0) {
            var scrollLocation = elem.offset().top;
            //console.log(scrollLocation);
            TweenMax.to(window, 2, {scrollTo: {y: scrollLocation}, force3D: true, ease:Expo.easeOut});
        }
    };

    var pageNavElems = $(".pageNav_item");

    // Scroll to section when navigation item on page is clicked
    pageNavElems.on('click', function(e){
        var _this = $(this);
        location.hash = _this.attr('href');
        scrollToSection();

        e.preventDefault();
    });

    // Also scrolls to section when hash changes
    window.addEventListener('hashchange', scrollToSection);

    //Back to top button
    var bttBtn = $(".btt");
    bttBtn.on('click', function(){
         TweenMax.to(window, 2, {scrollTo: {y: 0}, force3D: true, ease:Expo.easeOut});
    });

    function Gallery() {
       this.navClicked = false;
       this.homeOpen = true;

       var 
            gallerySections = $(".gallery_sections"),
            galleryImages = $(".gallery_images"),
            galleryNavWrapper = $(".gallery_nav_mask"),
            navElems = $(".gallery_nav"),
            gallery_icon = $(".gallery_nav_icon"),
            gallery_spinner = $(".gallery_spinner"),
            galleryImagesItems = galleryImages.find('img');


       var calWrapperWidth = function() {
            var items = navElems.find('li');
            var width = 0;

            $(".gallery_nav_wrapper").find('li').each(function(){
                var _this = $(this);

                width += _this.outerWidth();
                //console.log(_this.outerWidth());
            });
           return width;
         };

        var loadImages = function(href) {
            var 
                images, 
                self = this,
                links = {}, // Cache visited link contents
                gallery_images = $(".gallery_images"),
                link = ''+href;

                if (links[link] !== null) {
                    // Load image from URL and return the content of the DOM content containers
                    $.get(href)
                        .done(function(data) {
                            var documentFrag = $(data);

                        images = documentFrag.find('.gallery_images div');

                        // Cache elements
                        links[''+href] = images;

                        $images = gallery_images.html('').append(links[link]).hide().find('img');
                        gallery_images.imagesLoaded()
                            .done(function(){
                                TweenMax.set($images, {autoAlpha: 0, yPercent: "50%"});
                                TweenMax.set(gallery_images, {display: 'block'});
                                TweenMax.staggerTo($images, 1, {autoAlpha: 1, yPercent:"0%", force3D: true, ease:Power4.easeOut, onComplete: function(){
                                    hideSpinner();
                                }}, 0.1);
                            });


                        //.fadeIn(2000, hideSpinner);
                        gallery_images.lightGallery({
                            controls: true,
                            thumbnail: true,
                            preload: 4,
                            cssEasing:'ease-in-out',
                            speed: 600
                       });

                        if (self.navClicked === false) {
                            showGalleryImages();
                            //showNav();
                        }
                    });
                } else {
                    console.log("Yes Buddy");
                    gallery_images.html('').append(links[link]);

                    if (self.navClicked === false) {
                        showGalleryImages();
                        //showNav();
                    }
                }
                    showGalleryImages();
            
                // Hide spinner
        };

/*           var hideSections = function(elem) {
            TweenMax.staggerTo(gallerySectionItems, 0.6, {autoAlpha: 0, onComplete: showGalleryImages}, -0.2 );
       }*/

       var showGalleryImages = function() {
            TweenMax.to(gallerySections, 1, {xPercent: "-100%", ease:Expo.easeOut});
            TweenMax.to(galleryImages, 1, {xPercent: "-100%", ease:Expo.easeOut});
           };

       var showNav = function() {
            // Fade in Navigation wrapper
            TweenMax.set(galleryNavWrapper, {autoAlpha: 0, display: 'block'});
            setTimeout(function(){
                TweenMax.to(galleryNavWrapper, 2, {autoAlpha: 1});
            }, 600);

            // Display internal navigation elements
            TweenMax.set(navElems, {display: 'block'});

            // Set width of the navigation elements
            $(".gallery_nav_wrapper").width(calWrapperWidth() + 100);

             activateGalleryNav();
       };

       var goBack = function() {
            TweenMax.to(gallerySections, 1, {xPercent: "0%", ease:Expo.easeOut});
            TweenMax.to(galleryImages, 1, {xPercent: "-0%", ease:Expo.easeOut});
       };

       // Activate momentum scrolling on navigation elements using IScroll
       var activateGalleryNav = function() {
            var scroll = scroll || new IScroll(".gallery_nav_mask", {
                    scrollX: true,
                    scrollY: false,
                    mousewheel: true,
                    click: true

            });
       };

       var hideSpinner = function() {
            var spinnerClass = $(".spinner").remove();
            if (gallery_spinner.hasClass('show')) {
                TweenMax.to(gallery_spinner, 0.6, {className: "-=show"});
            }
       };

       var showSpinner = function(elem, navClicked) {
            this.navClicked = (navClicked === true) ? true : false;

            var spinner = $('<svg version="1.1" class="spinner" xmlns="http://www.w3.org/2000/svg"xmlns:xlink="http://www.w3.org/1999/xlink"x="0px"y="0px"viewBox="0 0 80 80"xml:space="preserve"> <path id="spinner"fill="#fff"d="M40,72C22.4,72,8,57.6,8,40C8,22.4, 22.4,8,40,8c17.6,0,32,14.4,32,32c0,1.1-0.9,2-2,2 s-2-0.9-2-2c0-15.4-12.6-28-28-28S12,24.6,12,40s12.6, 28,28,28c1.1,0,2,0.9,2,2S41.1,72,40,72z"> <animateTransform attributeType="xml"attributeName="transform"type="rotate"from="0 40 40"to="360 40 40"dur="0.6s"repeatCount="indefinite"/> </path> </svg>'); 
            var spinnerClass = $(".spinner").remove();

            if (this.navClicked) {
                gallery_spinner.html('').addClass('show').append(spinner);
            } else {
                elem.append(spinner);
            }
        };

        // Show Navigation controller
        showNav();

       return {
            showSpinner: showSpinner,
            loadImages: loadImages,
            goBack: goBack
       };
    }

    galleryNavIcon =  $(".gallery_nav_icon");

    galleryNavIcon.on('click', function(){
        gallery.goBack();
    });

    var gallerySectionItems = $(".gallery_sections").find('.item');

    var gallery = (gallerySectionItems.length > 0) ? new Gallery() : '';

    gallerySectionItems.on('click', function(){
        var _this = $(this);
        gallery.showSpinner(_this, false);
        gallery.loadImages(_this.data('href'));
    });

    var navElems = $(".gallery_nav").find('li');
    navElems.on('click', function(e){
        var _this = $(this),
            _href = _this.find('a').attr('href'),
            _elem = $('.gallery_images');

        if (!_this.hasClass('gallery_nav_icon')) {
            navElems.removeClass('active');
            _this.addClass('active');

            gallery.showSpinner(_this, true);
            gallery.loadImages(_href);
        }

        //gallery.loadImages(_href, _elem);

        e.preventDefault();
    });

    singleGalleryPage = $(".gallery_shift");

    if (singleGalleryPage.length > 0) {
        TweenMax.to(".gallery_sections", 1, {xPercent: "-100%", ease:Expo.easeOut});
        TweenMax.to(".gallery_images", 1, {xPercent: "-100%", ease:Expo.easeOut});
    }
});