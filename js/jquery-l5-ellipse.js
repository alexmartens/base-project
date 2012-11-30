// JavaScript Document

(function ($) {

	$.fn.ellipse = function (options) {
    return this.each(function() {
			var o = $(this);
			var text = o.html();
			
			options = $.extend({}, $.fn.ellipse.defaults, options);
			
			if (options.maxChars != null) {
				if (text.length > options.maxChars)
					o.html(text.substr(0, options.maxChars) + '...');
			} else {
				
				if ( ! o.is(':visible') )
					$.error( 'ellipse: dimensions cannot be acquired on invisible elements' );
				
				// if the width is not given, acquire the width of the parent element
				if (options.maxWidth == null)
					options.maxWidth = o.parent().width();

				if (o.width() > options.maxWidth) {
					var i = 1;
					o.html('');
					while ((o.width() < options.maxWidth) && (i < text.length)) {
						o.html(text.substr(0, i) + '...');
						i++;
					}
				}
				
			}		
    });
		
	};
	
	$.fn.ellipse.defaults = {
		maxWidth : null,
		maxChars : null
	};
	
}) (jQuery)