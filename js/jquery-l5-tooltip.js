// JavaScript Document

(function($) {
	
	$.fn.tooltip = function () {
		return $(this).each(function () {
				var trigger = $(this);
				var rel = trigger.attr("rel");
				var tooltip = $(rel);
				var delay;
				
				trigger.hover(function () {
					delay = setInterval (function() {
						var offset = trigger.offset();
						var y = offset.top - tooltip.outerHeight();
						var x = offset.left - tooltip.outerWidth() + 41;
						
						tooltip.css({ 'top' : y + 'px', 'left' : x + 'px' }).fadeIn();
					}, 400);
				}, function () {
					clearInterval(delay);
					tooltip.fadeOut();
				});
			});
	};

})(jQuery);
