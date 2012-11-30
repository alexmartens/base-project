
/* 

	DROPDOWN SELECT EXAMPLE:

	$('.select-trigger').tooltip ({ 
		event : 'click',
		defaultPosition : 'south',		
		init : function (o) {
					
			o.tooltip.find('li').bind('click', function () {
				var $target = $(this);
					
				// UPDATE CLASSES
				$target
					.addClass('active')
					.siblings()
					.removeClass('active');
				
				// SET DISPLAY VALUE
				var displayValue = $target.attr('data-display') || $target.html();
				o.element.html(displayValue);
				
				// SET INTERNAL VALUE
				o.element.attr('data-val', $target.attr('data-value'));
				
				// CLOSE TOOLTIP
				o.close();
			});
		},
		beforeClose : function () {
			process();
		}
	});

	IE PNG FIX EXAMPLE:

	$('.tooltip-trigger').tooltip ({ 
		show : function (el, callback) {
			$.fn.tooltip.show_IEPNGFix(el, callback);
		},
		hide : function (el, callback) {
			$.fn.tooltip.hide_IEPNGFix(el, callback);
		}
	});
	
*/

(function ($) {

  $.widget( 'l5.tooltip', {
		
    options: { 
		
			autoStart : true,
			event : 'hover',
			defaultPosition : 'north',
			
			// Default css selector string for tooltip
			selector : null,
			
			// Default methods for hiding and showing the tooltip
			show : function (el, callback) {
				el.fadeIn('fast', function () {
					callback();
				});
			},
			hide : function (el, callback) {
				el.fadeOut('fast', function () {
					callback();
				});
			},
			
			// Callbacks
			init : function () { },
			beforeOpen : function () { },
			beforeClose : function () { },
			afterOpen : function () { },
			afterClose : function () { }
			
    },
		
    _create: function() {
			var o = this;
			var ref = this.element.attr("data-tooltip") || this.options.selector || this.element.attr("rel") || this.element.attr("href");
			
			// VALIDATE THE SELECTOR
			if ( ! /^#[\w\-]+$/.test( ref ) ) {
				$.error( 'tooltip: "' +  ref + '" is an invalid selector' );
			}

			this.tooltip = $(ref);
			
			// DOES IT EXIST?
			if ( this.tooltip.length == 0 ) {
				$.error( 'tooltip: "' +  ref + '" is invalid' );
			}
			
			this.side = this.element.attr("data-position") || this.options.defaultPosition;
			
			// INITIALIZE TOOLTIP
			this.tooltip
				.hide()
				.css({ position : 'absolute' })
				.click(function (e) { e.stopPropagation(); });
				
			this.delay = null;
			
			// CALLBACK - INITIALIZE
			this.options.init(this);
			
			// ADD EVENTS
			if (this.options.autoStart)
				this.start();
			
			// REPOSITION ON WINDOW RESIZE
			$(window).resize(function() {
				o.position();
			})
			
    },
		
		isOpen : function () {
			return this.tooltip.is(':visible');
		},
		
		start : function () {
			var o = this;

			switch (o.options.event) {
				
				case 'hover':
				
					o.element.hover(function (e) {
						
						o.delay = setTimeout (function() {
								o.open();
							}, 400);
							
					}, function () {
						clearTimeout(o.delay);
						o.close();
					});
					
					break;
					
				case 'click':
				
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';
				
					o.element.bind(event, function () {
						
							if (! o.isOpen())
								o.open(true);
							else
								o.close();
							
							return false;
					});
					
					break;
					
			}

		},
		
		stop : function () {
			clearInterval(this.delay);
			
			var event = o.options.event;
			
			if (event = 'click') {
				event = (navigator.userAgent.match(/iPad/i)) ? 'touchstart' : 'click';
			}
			
			this.element.unbind(event);
		},
		
		open : function ( bodyClick ) {
			var o = this;

			if ( (! this.isOpen()) && (o.options.beforeOpen() != false) ) {
				o.position();
				
				// CLICKING OFF THE TOOLTIP
				if ( bodyClick ) {
					
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';	
										
					$(document).bind(event, function (e) {
							e.stopPropagation();
							o.close();
							
							return false;
					});
					
				}

				o.options.show(o.tooltip, o.options.afterOpen);
					
				o.tooltip.addClass('active');
			}
		},
		
		position : function () {
			var x, y, offset = this.element.offset();
			
			this.tooltip.addClass('position-'+this.side);

			switch (this.side) {
				case 'north' || 'n':
					y = offset.top - this.tooltip.outerHeight();
					x = offset.left + (this.element.outerWidth() / 2);
					break;
				case 'east' || 'e':
					x = offset.left + this.element.outerWidth();
					y = offset.top + (this.element.outerHeight() / 2);
					break;
				case 'south' || 's':
					x = offset.left + (this.element.outerWidth() / 2);
					y = offset.top + this.element.outerHeight();
					break;
				case 'west' || 'w':
					x = offset.left - this.tooltip.outerWidth();
					y = offset.top + (this.element.outerHeight() / 2);
					break;
			}

			this.tooltip.css({ 'top' : y + 'px', 'left' : x + 'px' });
		},
		
		close : function () {
			var o = this;
			
			if ( this.isOpen() && (this.options.beforeClose() != false) ) {
					
					var ua = navigator.userAgent,
							event = (ua.match(/iPad/i)) ? 'touchstart' : 'click';	
					
					$(document).unbind(event);
					
					o.options.hide(o.tooltip, o.options.afterOpen);
					
					this.tooltip.removeClass('active');
			}
			
		}
		
  });
	
	$.fn.tooltip.show_IEPNGFix = function (el, callback) {
		if ( $.browser.msie && jQuery.browser.version.split('.')[0] < 9 ){
			el.show();
			callback();
		} else {
			el.fadeIn('fast', function () {
				callback();
			});
		}			
	}
	
	$.fn.tooltip.hide_IEPNGFix = function (el, callback) {
		if ( $.browser.msie && jQuery.browser.version.split('.')[0] < 9 ){
			el.hide();
			callback();
		} else {
			el.fadeOut('fast', function () {
				callback();
			});
		}			
	}
	
}) (jQuery);
