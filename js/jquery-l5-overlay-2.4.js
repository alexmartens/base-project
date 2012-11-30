/*
	JQuery Overlay Pluggin v2.3
	Level Five Solutions, Inc.
	Alex Martens
	
	*** EXAMPLE MARKUP FOR THE OVERLAY ***
	
  <div id="my-overlay" class="overlay" style="display: none;">
		<h1>Test</h1>
		<p>Lorem ipsum dolor.</p>
		<a href="#" onclick="$('#my-overlay').overlay('close'); return false;">OK</a>
	</div> <!-- /.overlay -->

	*** HOW TO USE ***
	
	METHOD #1:
	
	This method iterates over all of the selected anchor tags.  In the example below, these are anchor tags 
	with the class of overlay-trigger.  It associates the click event of the selected elements with the ID 
	of the overlay referenced in their href (ie #my-overlay).
	
	<script src="js/jquery-l5-overlay.js" type="text/javascript"></script>
	<script type="text/javascript">
		$(function(){
			$('a.overlay-trigger').overlay(); // Initialize overlays and establish links/triggers to open them
		});
	</script>

	<a class="overlay-trigger" href="#my-overlay">Open overlay</a>
	
	METHOD #2:
	
	<script src="js/jquery-l5-overlay.js" type="text/javascript"></script>
	<a href="#my-overlay" onclick="$('#my-overlay').overlay('open'); return false;">Open overlay</a>
	
	*** CALLBACKS ***
	
	$('a#click-to-open').overlay( { open : function () { return confirm("Are you sure?"); } });

	$('a.overlay-trigger').overlay( { visible : function () { @@@ CODE GOES HERE @@@ }, complete : function () { @@@ CODE GOES HERE @@@ }} );
	$('a.overlay-trigger').overlay( { close: function () { return confirm("Are you sure?"); } } );
	$('#my-overlay').overlay('open', { visible : function () { @@@ CODE GOES HERE @@@ } })
	$(function () {
		$('#my-overlay').overlay('open', { 
			visible : function () { $('#my-overlay').overlay( 'close' ); }, 
			close : function { return confirm("Are you sure?"); }
		})
	})
	
*/

(function( $ ){

  $.fn.overlay = function( method ) {
    
    // Method calling logic
    if ( $.fn.overlay.methods[method] ) {
      return $.fn.overlay.methods[ method ].apply( this, Array.prototype.slice.call( arguments, 1 ));
    } else if ( typeof method === 'object' || ! method ) {
      return $.fn.overlay.methods.init.apply( this, arguments );
    } else {
      $.error( 'overlay: Method "' +  method + '" does not exist' );
    }    
  
  };
	
	$.fn.overlay.defaults = {
		
		// General options
		modal : true,
		offClick : false,
		closeBtn : true,
		
		// Callbacks
		open : function () { return true; },
		visible : function () {},
		close : function () { return true; },
		hidden : function () {}
		
	};

  $.fn.overlay.methods = {
    init : function( options ) {
			return this.each(function() {
				var o = $(this);
				
				// If the object is an anchor tag, get the overlay
				if ( o.is('a') ) {
					var href = o.attr("href");
					if ( ! /^#[\w\-]+$/.test( href ) ) {
						$.error( 'overlay: "' +  href + '" is invalid' );
					} else {
						var oOverlay = $(href);
						if ( oOverlay.length == 0 ) {
							$.error( 'overlay: "' +  href + '" does not exist' );
						} else {
							o.click(function () {
								$.fn.overlay.methods.open.apply(oOverlay);
								return false;
							});
							o = oOverlay;
						}
					}
				}

				var data = o.data('overlay');
				
				// Initialize
				if ( ! data ) {

					o.css({ opacity : 0, display : 'none' }).data('overlay', {
						 target : o
					});
					
					$.fn.overlay.methods.setDefaults.apply(o, [options]);
				
				}
			});
		},
    open : function( args ) {
			return this.each(function() {
				var o = $(this),
						data = o.data('overlay'),
						options;
				
				// Initialize overlay and extend options
				if ( data ) {
					 options = $.extend({}, data.options, args);
				} else {
					$.fn.overlay.methods.init.apply(o, [args]);	
					data = o.data('overlay');
					options = data.options;
				}					
				
				// Add the 'close' button
				if ( options.closeBtn && ! $(':first', o).hasClass('btn-close') ) {
					var oClose = $("<a class='btn-close overlay-close' href='#'><span>[Close]</span></a>")
					o.prepend(oClose);
				}
				o.find('.overlay-close').unbind('click.overlay').bind('click.overlay', function() {
					$.fn.overlay.methods.close.apply(o, [options]);	
					return false;
				});

				if ( ! o.is(':visible') ) {
					
					// Callback function before displayed; if callback returns false, the overlay will not open
					if ( options.open(o) == false )
						return false;
						
					// Show background layer
					if ( options.modal )
						$.fn.overlay.methods.showBkgLayer.apply(o);
					
					// Begin animated open sequence
					// @@@ Quirks mode: $('html, body').animate({scrollTop: '0px'}, "normal", "easeOutQuart", function() {
					$('html').animate({scrollTop: '0px'}, "normal", "easeOutQuart", function() {
						o.css({
							opacity: 0,
							display : 'block'
						}).animate({opacity: '1'}, "normal", "easeOutQuad", function () {
							
							// Extend background height
							var h = o.offset().top + o.outerHeight();
							if (h > data.background.height())
								data.background.height(h);
		
							// Clicking off of the overlay
							if ( options.offClick ) {
								var doc = $('html');
								
								doc.click(function (e) {
									doc.unbind('click');
									$.fn.overlay.methods.close.apply(o);
									return false;
								});
								
								o.click(function(e){
									e.stopPropagation();
								});
								
							}
							
							// Callback function after displayed
							options.visible(o);
							
						});
					});
				};

			});
		},
    close : function( args ) {
			return this.each(function() {
				var o = $(this),
						data = o.data('overlay'),
						options;

				// Make sure the overlay is initialized
				if ( ! data ) {
					return false;
				}
				options = $.extend({}, data.options, args);

				// Callback fuction; if it returns false, the overlay will not close
				if ( options.close(o) == false )
					return false;

				// If visible, begin close
				if ( o.is(':visible') ) {
					
					o.animate({opacity: '0'}, "normal", "easeOutQuart", function() { 
						o.css({ display : "none" });
						
						// Callback function
						options.complete(o);
					});
				
					$.fn.overlay.methods.hideBkgLayer.apply(o);
					
				};

			});
		},
    setDefaults : function( args ) {
			return this.each(function() {
				var o = $(this),
						data = o.data('overlay');

				if ( data ) {
					o.data('overlay', {
						 options : $.extend({}, $.fn.overlay.defaults, args)
					});
				} else {
					$.fn.overlay.methods.init.apply(o, [args]);	
				}
				
			});
		},
    showBkgLayer : function( ) {
			var o = $(this),
					data = o.data('overlay');

			if ( data ) {
				if (! data.background ) {
					data.background = $("<div class='overlay-bkg' style='display: none;'></div>").insertBefore(o);
					o.data('overlay', data);
				}

				var vpHeight = $(window).height();   // height of viewport
				var docHeight = $(document).height(); // height of HTML document
				var height = vpHeight > docHeight ? vpHeight : docHeight;
				
				data.background.height(height).show();
			}
		},
    hideBkgLayer : function( ) {
			var o = $(this),
					data = o.data('overlay');
		 
			if ( data.background.is(':visible') ) {
				data.background.hide();
			};

		}
  };

})( jQuery );
