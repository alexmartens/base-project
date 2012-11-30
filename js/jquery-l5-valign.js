// JavaScript Document - Vertical Align

(function( $ ) {
	$.fn.vAlign = function() {
		return this.each(function(i) {
			var ah = $(this).height();
			var ph = $(this).parent().innerHeight();
			var mh = (ph - ah) / 2;
			$(this).css('margin-top', mh);
		});
	};
})( jQuery );
