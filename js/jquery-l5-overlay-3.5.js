/*
	JQuery Overlay Pluggin v3
	Level Five Solutions, Inc.
	Alex Martens
	
	*** EXAMPLE MARKUP FOR THE OVERLAY ***
	
  <div id="my-overlay" class="overlay" style="display: none;">
		<h1>Test</h1>
		<p>Lorem ipsum dolor.</p>
		<a href="#" onclick="$('#my-overlay').overlay('close'); return false;">OK</a>
	</div> <!-- /.inner --> </div> <!-- /.overlay -->

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
	
*/

(function( $ ) {

	$.widget( 'l5.overlay', {

		// These options will be used as defaults
		options: { 
		
			// General options
			modal : true,
			offClick : false,
			closeBtn : true,
			alignToViewport : true,		// Align to the top of the viewport
			autoPosition : false,			// Align to the anchor tag
			positionTo : null,				// Element to align to
			
			// Callbacks
			open : function () { return true; },
			visible : function () {},
			confirm : function () {},
			close : function () { return true; },
			hidden : function () {}
		},

		// Set up the widget
		_create: function() {
			
			var o = this;
			
			// If the object is an anchor tag, get the overlay and initialize it
			if ( o.element.is('a') ) {
				
				var href = o.element.attr("href");
				
				if ( ! /^#[\w\-]+$/.test( href ) ) {
					$.error( 'overlay: "' +  href + '" is invalid' );
				} else {
					
					var oOverlay = $(href);
					
					if ( oOverlay.length == 0 ) {
						$.error( 'overlay: "' +  href + '" does not exist' );
					} else {
						
						// INITIALIZE THE OVERLAY
						oOverlay.overlay(o.options);
						
						// CLICK ON THE TRIGGER
						o.element.click(function () {
						
							oOverlay.overlay('open', { trigger : o.element });
							
							return false;
						});
						
						return false;
					}
				}
			} else {			
					
				o.element.css({ opacity : 0, display : 'none' });
			
				// ADD 'CLOSE' BUTTON
				if ( o.options.closeBtn ) {
					o.element.prepend("<a class='close-btn overlay-close' href='#'><span>X</span></a>");
				}
			
				// CLOSE FUNCTIONALITY
				o.element.on('click.overlay', '.overlay-close', function() {
					o.close();	
					return false;
				});
				
				// CONFIRM FUNCTIONALITY
				o.element.on('click.overlay', '.overlay-confirm', function() {
					if ( o.options.confirm(o) != false ) {
						o.close();
					}
					return false;
				});
				
			}
		},
		
		_show: function () {

			var o = this;

			if (o.options.autoPosition) {
				
				o.element.css({
					top : $(o.trigger).offset().top,
					opacity: 0,
					display : 'block'
				}).animate({opacity: '1'}, "normal", "easeOutQuad", function () {
					this._showCallback;
				});
				
			} else if (o.options.positionTo) {
				
				o.element.css({
					top : $(o.options.positionTo).offset().top,
					opacity: 0,
					display : 'block'
				}).animate({opacity: '1'}, "normal", "easeOutQuad", function () {
					this._showCallback;
				});
				
			} else if ( o.options.alignToViewport ) {
					
				var top = $(window).scrollTop();
				
				o.element.css({
						opacity: 0,
						display : 'block',
						top : top
					}).animate({opacity: '1'}, "normal", "easeOutQuad", function () {
						this._showCallback;
				});
				
			} else {
				
				// @@@ Quirks mode: $('html, body').animate({scrollTop: '0px'}, "normal", "easeOutQuart", function() {
				$('html').animate({scrollTop: '0px'}, "normal", "easeOutQuart", function() {
					o.element.removeAttr('style').css({
						opacity: 0,
						display : 'block'
					}).animate({opacity: '1'}, "normal", "easeOutQuad", function () {
						this._showCallback;
					});
				});
				
			}
			
		},
		
		_showCallback: function () {
			
			var o = this;
			
			o.update();
			
			// Clicking off of the overlay
			if ( o.options.offClick ) {
				var doc = $('html');
				
				doc.click(function (e) {
					doc.unbind('click');
					this.close();
					return false;
				});
				
				o.element.click(function(e){
					e.stopPropagation();
				});
				
			}
			
			// CALLBACK
			o.options.visible(o);
			
		},
		
		open: function (params) {
			
			var o = this;
			
			// SAVE THE TRIGGER
			if (params)
				this.trigger = params.trigger;
			
			if ( ! o.element.is(':visible') ) {
				
				// Callback function before displayed; if callback returns false, the overlay will not open
				if ( o.options.open(o) == false )
					return false;
					
				// Show background layer
				if ( o.options.modal )
					this.showBackground();
				
				this._show();
				
			};
		},
		
		close: function () {
			
			var o = this;

			// Callback fuction; if it returns false, the overlay will not close
			if ( o.options.close(o) == false )
				return false;

			// If visible, begin close
			if ( o.element.is(':visible') ) {
				
				o.element.animate({opacity: '0'}, "normal", "easeOutQuart", function() { 
					o.element.css({ display : "none" });
					
					// Callback function
					o.options.hidden(o);
				});
			
				this.hideBackground();
			}
		},
		
		update : function () {
			
			var o = this;
			
			// Adjust the height of the background element
			if ( o.options.modal ) {
				var vpHeight = $(window).height();   // height of viewport
				var docHeight = $(document).height(); // height of HTML document
				var height = vpHeight > docHeight ? vpHeight : docHeight;
				
				this.background.height(height);
			}
			
		},

		showBackground : function () {
			
			var o = this;

			if (! this.background ) {
				this.background = $("<div class='overlay-bkg' style='display: none;'></div>").insertBefore(o.element);
			}
			
			this.update();
			this.background.show();
		},
		
		hideBackground : function () {

			var o = this;
		 
			if ( o.background.is(':visible') ) {
				o.background.hide();
			};

		},

		// Use the _setOption method to respond to changes to options
		_setOption: function( key, value ) {

			// In jQuery UI 1.8, you have to manually invoke the _setOption method from the base widget
			$.Widget.prototype._setOption.apply( this, arguments );
			// For UI 1.9 the _super method can be used instead
			// this._super( "_setOption", key, value );

		}
 
	});

}(jQuery));
