$(document).ready(function(){
	var $work = $(".work");

		$('body').on('mouseenter', ".work", descAnimIn)
				.on('mouseleave', ".work", descAnimOut);

	function descAnimIn() {
		var $elem = $(this),
			$desc = $(this).find('.work_desc'),
			$img = $(this).find('img'),
			$sub = $elem.find('p'),
			$main = $elem.find('h3');

		TweenMax.set($desc, {visibility: "visible", autoAlpha: 0});
		TweenMax.set([$sub, $main], {autoAlpha: 0});
		TweenMax.to($desc, 1, {autoAlpha: 1});
		TweenMax.to($img, 3, {scale: 1.2, rotationY: "-6deg", rotationX: "-6deg", transformOrigin: "top center", ease:Expo.easeOut});
		TweenMax.fromTo($sub, 1, {autoAlpha: 0, yPercent: "100%"}, {autoAlpha: 1, yPercent: "0%", ease:Power4.easeInOut, force3D: true} );
		TweenMax.fromTo($main, 1, {autoAlpha: 0, yPercent: "100%"}, {autoAlpha: 1, yPercent: "0%", ease:Power4.easeInOut, force3D: true} );
		
	}

	function descAnimOut() { 
		var $elem = $(this),
			$desc = $(this).find('.work_desc'),
			$img = $(this).find('img'),
			$sub = $elem.find('p'),
			$main = $elem.find('h3');

		TweenMax.fromTo($main, 1, {autoAlpha: 1, yPercent: "0%"}, {autoAlpha: 0, yPercent: "100%", ease:Power4.easeInOut, force3D: true});
		TweenMax.fromTo($sub, 1, {autoAlpha: 1, yPercent: "0%"}, {autoAlpha: 0, yPercent: "100%", ease:Power4.easeInOut, force3D: true} );
		TweenMax.to($desc, 1, {autoAlpha: 1});
		TweenMax.to($img, 3, {scale: 1, rotationY: "0deg", rotationX: "0deg", transformOrigin: "top center", ease:Expo.easeOut});
		TweenMax.set([$sub, $main], {autoAlpha: 0, onComplete: function(){
			TweenMax.to($desc, 1, {autoAlpha: 0});
		}});
	}

	var Menu = (function() {

		// Timeline for Menu Button
		// If the Hamburger button is clicked, the OffCanvas Navigation
		// slides into view from the top. This implementation uses
		// SVG clip-path instead of the regular translate.
		var menuTimeline = new TimelineMax({yoyo: true, paused: true, force3D: true}),
			menuBtn = $(".nav-icon"),
			offCanvasMenu = $(".offCanvasMenu"),
			navLists = offCanvasMenu.find('li'),
			otherElems = [offCanvasMenu.find('h4'), offCanvasMenu.find('p')],
			wW = $(window).width(),
			wH = $(window).height();

		this.isOpen = isOpen = false;


		var init = function() {
			menuTimeline
					.fromTo(offCanvasMenu, 0.3, {autoAlpha: 0, yPercent: "-100%"}, {autoAlpha: 1, yPercent: "0%", force3D: true})
					.set(navLists, {display: "block", autoAlpha: 0})
					.staggerFromTo(navLists, 0.6, {z: 0.001, autoAlpha: 0, yPercent: '50%'}, {autoAlpha: 1, yPercent: '0%', force3D: true, ease: Quad.easeOut}, 0.2)
					.staggerFromTo(otherElems, 0.3, {autoAlpha: 0, yPercent: '50%'}, {autoAlpha: 1, yPercent: '0%', force3D: true}, 0.1, "-=0.2");

			// Listen for click event on Menu Icon and activate menu
			menuBtn.on('click', showHideMenu);
		};

		function showMenu() {
			menuTimeline.timeScale(1);
			menuTimeline.play();
		}

		function hideMenu() {
			menuTimeline.timeScale(2);
			menuTimeline.reverse();
		}

		function showHideMenu() {
			// Toggle closed an open for the Menu Icon	
			menuBtn.toggleClass('close-icon');

			if (isOpen === false) {
				showMenu();
				this.isOpen = isOpen = true;
			} else {
				hideMenu();
				this.isOpen = isOpen = false;
			}
		}

		return {
			init: init
		};
	})();

	Menu.init();

	var homeTeaser = function() {
		this.playHead = new TimelineMax({yoyo: true, paused: true});
		$teaser = $("#teaser");
		this.$teaserElems = {
			main: $teaser,
			brands: $teaser.find(".brands"),
			ideas: $teaser.find(".ideas"),
			people: $teaser.find(".people"),
			experiences: $teaser.find(".experience"),
			shapes: $teaser.find("path")
		};

		this.init();
	};

	homeTeaser.prototype.init = function() {
		this.playHead.set(this.$teaserElems.main, {autoAlpha: 1});
		this.playHead.staggerFromTo(this.$teaserElems.shapes, 3, { drawSVG:'0', fill: "transparent", stroke: "gray", scale: 1.1}, { drawSVG: true, fill: "#DBDBDB", stroke: "transparent", scale: 1}, 0.1);
		this.playHead.play();
	};

	myTeaser = new homeTeaser();

	function animateOkPitchGone() {
		var $okPitchGone = $("#okPitchGone"),
			$okPitchGonePaths = $okPitchGone.find("path"),
			OPG = new TimelineMax({yoyo: true, paused: true});

			OPG
				.set($okPitchGone, {autoAlpha: 1})
				.staggerFromTo($okPitchGonePaths, 3, { drawSVG:'0', fill: "transparent", stroke: "gray", scale: 1.1}, { drawSVG: true, fill: "#DBDBDB", stroke: "transparent", scale: 1}, 0.1)
				.play();
	}

	if ($("#okPitchGone").length > 0) {
		var waypoint = $("#okPitchGone").waypoint({
			offset: 'bottom-in-view',
			handler: function() {
				animateOkPitchGone();
			},
			triggerOnce: true
		});
	}

	$loadMore = $(".load-more");

	$loadMore.on('click', function(e){
		$href = $(this).attr('href');
		loadWorks($href);

		e.preventDefault();
	});

	// Load more works, and append to current page
	function loadWorks(link) {
		$.ajax({
			url: link,
			beforeSend: function() {
				showSpinner();
			}
		}).done(function(data){
			var results = {},
				docFrag = document.createElement("div");
			docFrag.innerHTML = data;

			// Get all works item
			results.contents = docFrag.querySelector(".works_wrapper").innerHTML;

			// get next link
			results.nextLink = (docFrag.querySelectorAll(".load-more").length > 0) ? docFrag.querySelector(".load-more").getAttribute('href') : '';

			insertContent(results);
		});
	}

	function showSpinner() {
		$loadMore.html('<div class="spinner"></div>');
	}

	function removeSpinner() {
		$loadMore.html('<div class="container"><span class="icon-plus"></span></div>');
	}

	function insertContent(obj) {
		var $loadMore = $(".load-more"),
			$worksWrapper = $(".works_wrapper");

			if (obj.nextLink === '' ) {
				$loadMore.attr('href', '');
				TweenMax.to($loadMore, 0.3, {autoAlpha: 0});
			} else {
				$loadMore.attr('href', obj.nextLink);
				removeSpinner();
			}
			
			var v = $(obj.contents).appendTo($worksWrapper).css({opacity: 0}).addClass('justadded');

			TweenMax.staggerFromTo(".justadded", 1, {autoAlpha: 0, yPercent: "20%"}, {autoAlpha: 1, yPercent: "0%", z:0.001, className: "-=justadded", force3D: true}, 0.2);
			

	}

});


var body = document.body,
    timer;

window.addEventListener('scroll', function() {
  clearTimeout(timer);
  if(!body.classList.contains('disable-hover')) {
    body.classList.add('disable-hover');
  }
  
  timer = setTimeout(function(){
    body.classList.remove('disable-hover');
  },200);
}, false);