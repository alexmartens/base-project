/* 
	File: jquery-l5-slideshow.js

	Examples: 
	$('#gallery').slideshow({ speed: 5000 });
	$('#gallery').slideshow();
	
	$('#promo-gallery').slideshow({
			stopOnHover: true,
			onInterval: function (n, e) {
				var $els = $('#promo-nav ul li a');
				$els.removeClass('active');
				
				// First image is not represented in the nav
				if (n > 0)
					$($els[n - 1]).addClass('active');
			}
		});
	
	$('#promo-nav ul li a').each(function (i) {
																				 
		var delay;
		
		$(this).hover(function () {
			var $this = $(this);
			delay = setInterval (function() {
				$('#promo-nav ul li a').removeClass('active');
				$this.addClass('active');
				$('#promo-gallery').slideshow('show', i + 1);
			}, 300);
			return false;
		}, function () {
			clearInterval(delay);
		});
		
	});
*/

(function($) {
					
	var defaults = {
		speed : 6000,
		stopOnHover : false,
		onInterval : $.noop()
	};
					
	var methods = {
		init : function( options ) {
			 return this.each(function(){
         var $this = $(this),
             data = $this.data('slideshow');
						 
				// If the plugin hasn't been initialized yet
				if ( ! data ) {
	
					$this.data('slideshow', {
						 target : $this,
						 options : $.extend(defaults, options),
						 current : $('a:first', $this),
						 timer : null
					});
					data = $this.data('slideshow');
	
					// Set the opacity of all images to 0  
					$('a', $this).css({opacity: 0.0});
					
					// Display it (set it to full opacity)  
					data.current.css({opacity: 1.0}).addClass('show');
					
					// Start the slideshow
					methods.start.apply( this );
					
					// If applicable, initialize hover events
					if (data.options.stopOnHover) {
						$this.hover(function () {
								methods.stop.apply( this );
							}, function () {
								methods.start.apply( this );
						});
					};
				
				}
							 
			});
		},
		show : function( n ) {
			return $(this).each(function(){
				var $this = $(this),
						 data = $this.data('slideshow'),
						$els = $('a', $this),
						$el = $($els[n]);
				
				if ($el.length) {
					methods.stop.apply( this );
					if (!$el.hasClass('show')) {
						$el.animate({opacity: 1.0}, 1000).addClass('show');
						data.current.animate({opacity: 0.0}, 1000).removeClass('show');
						data.current = $el;
						$this.data('slideshow', data);
					}
				} else {
					$.error('slideshow: element ' + n + ' does not exist');
				}
			});
		},
		start : function( ) {
			return $(this).each(function(){
				var $this = $(this),
						 data = $this.data('slideshow');
				
				if (!data.timer) {
					data.timer = setInterval(function() {
																			
							var $next = data.current.next().length ? data.current.next() : $('a:first', $this);
																													
							// Set the fade in effect for the next image, show class has higher z-index  
							$next.css({opacity: 0.0})  
								.addClass('show')  
								.animate({opacity: 1.0}, 1000);  
				
							// Hide the current image  
							data.current.animate({opacity: 0.0}, 1000).removeClass('show');
							
							// Callback function
							data.options.onInterval($next.index(), $next);
							
							data.current = $next;
							
						}, data.options.speed);
					$this.data('slideshow', data);
				}
			});			
		},
		stop : function( ) {
			return $(this).each(function(){
				var $this = $(this),
						 data = $this.data('slideshow');
						 
				if (data.timer) {
					clearInterval(data.timer);
					data.timer = null;
					$this.data('slideshow', data);
				}
			});
		}
	};
					
	$.fn.slideshow = function ( method ) {
    if ( methods[method] ) {
      return methods[method].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist' );
    }    
	}

})(jQuery);
