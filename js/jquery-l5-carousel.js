// JavaScript Document

(function( $ ){

	function repeat(str, num) {
		return new Array( num + 1 ).join( str );
	}

  $.fn.carousel = function ( method ) {
    
    // Method calling logic
    if ( $.fn.carousel.methods[method] ) {
      return $.fn.carousel.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return $.fn.carousel.methods.init.apply( this, arguments );
    } else {
      $.error( 'Method ' +  method + ' does not exist' );
    }    
  
  };

	$.fn.carousel.defaults = {
		speed : 7500,
		infinite : true,
		onInterval : function () {}
	};

  $.fn.carousel.methods = {
    init : function ( options ) {
       return this.each(function() {
         
					var o = $(this),
						 data = o.data('carousel');
					
					// If the plugin hasn't been initialized yet
					if ( ! data ) {

						data = new Object();
						data.options = $.extend({}, $.fn.carousel.defaults, options);
						data.wrapper = $('> div', this).css('overflow', 'hidden');
						data.slider = data.wrapper.find('> ul');
						data.items = data.slider.find('> li');
						data.single = data.items.filter(':first');
							
						data.singleWidth = data.single.outerWidth(), 
						data.visible = Math.ceil(data.wrapper.innerWidth() / data.singleWidth),
						data.currentPage = 1,
						data.pages = Math.ceil(data.items.length / data.visible),
						data.autoAdvance = null;

						// If more and one page
						if (data.pages > 1) {
							if (data.options.infinite) {
								// 1. Pad so that 'visible' number will always be seen, otherwise create empty items
								if ((data.items.length % data.visible) != 0) {
									data.slider.append(repeat('<li class="empty" />', data.visible - (data.items.length % data.visible)));
									data.items = data.slider.find('> li');
								}
								
								// 2. Top and tail the list with 'visible' number of items, top has the last section, and tail has the first
								data.items.filter(':first').before(data.items.slice(- data.visible).clone().addClass('cloned'));
								data.items.filter(':last').after(data.items.slice(0, data.visible).clone().addClass('cloned'));
								data.items = data.slider.find('> li'); // reselect
								
								// 3. Set the left position to the first 'real' item
								data.wrapper.scrollLeft(data.singleWidth * data.visible);
							}
							
							data.pagination = $('<div class="pagination"></div>').insertBefore(data.wrapper);
							for (var i = 1; i <= data.pages; i++) {
								$('<a href="#">' + i + '</a>').click(function() {
									$.fn.carousel.methods.goto.apply( o, [ parseInt(o.html()) ] );																						
									return false;
								}).appendTo(data.pagination);
							}
							$('a:first', data.pagination).addClass('active');
							
							data.wrapper.after('<a class="arrow back">Back</a><a class="arrow forward">Next</a>');
							
							// 5. Bind to the forward and back buttons
							$('a.back', this).click(function () {
								$.fn.carousel.methods.prev.apply(o);												
								return false;																						
							});
							
							$('a.forward', this).click(function () {
								$.fn.carousel.methods.next.apply(o);												
								return false;
							});
						}

						// STORE THE DATA!
						o.data('carousel', data);

						// Start the carousel
						if (data.options.speed > 0 && data.pages > 1) {
							$.fn.carousel.methods.start.apply( o );
						};
         };
       });
		},
    start : function ( ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel');

				if (!data.autoAdvance) {
					data.autoAdvance = setInterval (function () {
							$.fn.carousel.methods.goto.apply( o, [ data.currentPage + 1 ] );																						
						}, data.options.speed);
					o.data('carousel', data);
				}

			});		
		},
    stop : function ( ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel');
						 
				if (data.autoAdvance) {
					clearInterval(data.autoAdvance);
					data.autoAdvance = null;
					o.data('carousel', data);
				}
			});
		},
    goto : function ( page ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel');
						 
				if (data.options.infinite) {
					$.fn.carousel.methods.gotoInfinite.apply(o, [ page ] );
				} else {
					$.fn.carousel.methods.gotoFinite.apply(o, [ page ] );
				}
				
			});
		},		
    gotoFinite : function ( page ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel'),
						 dir = page < data.currentPage ? -1 : 1,
						 n = Math.abs(data.currentPage - page),
						 left = data.singleWidth * dir * data.visible * n;
						 
				if (page > data.pages) {
					left = data.singleWidth * data.pages * -1;
					page = 1;
				} else if (page < 1) {
					left = data.singleWidth * (data.pages - 1);
					page = data.pages;
				}
				
				data.wrapper.filter(':not(:animated)').animate({
					scrollLeft : '+=' + left
					}, 500, function () {
						$('a:nth-child(' + data.currentPage + ')', data.pagination).removeClass('active');
						$('a:nth-child(' + page + ')', data.pagination).addClass('active');
						data.currentPage = page;
						
						// Callback function
						data.options.onInterval(data.currentPage);
		
					});                

				o.data('carousel', data);
			});		
		},		
    gotoInfinite : function ( page ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel'),
						 dir = page < data.currentPage ? -1 : 1,
						 n = Math.abs(data.currentPage - page),
						 left = data.singleWidth * dir * data.visible * n;
				
				data.wrapper.filter(':not(:animated)').animate({
					scrollLeft : '+=' + left
					}, 500, function () {
						if (page == 0) {
							data.wrapper.scrollLeft(data.singleWidth * data.visible * data.pages);
							page = data.pages;
						} else if (page > data.pages) {
							data.wrapper.scrollLeft(data.singleWidth * data.visible);
							// reset back to start position
							page = 1;
						} 
						
						$('a:nth-child(' + data.currentPage + ')', data.pagination).removeClass('active');
						$('a:nth-child(' + page + ')', data.pagination).addClass('active');
						data.currentPage = page;
						
						// Callback function
						data.options.onInterval(data.currentPage);
		
					});                

				o.data('carousel', data);
			});		
		},
		next : function ( ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel');
				$.fn.carousel.methods.goto.apply(o, [data.currentPage + 1] );
			});
		},
		prev : function ( ) {
			return this.each(function () {
				var o = $(this),
						 data = o.data('carousel');
				$.fn.carousel.methods.goto.apply(o, [data.currentPage - 1] );
			});
		}
  };

})( jQuery );
