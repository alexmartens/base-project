// JavaScript Document

(function($) {
	$.fn.collapsible = function (options) {
		
		options = $.extend({}, {
				multiple : true
			}, options);
		
		
		return $(this).each(function () {
			var parent = $(this);		
			var toggles = parent.children(':even');

			toggles.click(function () {
				var toggle = $(this);
				var content = toggle.next();
				
				if (! options.multiple) {
					toggles.filter('.active').not(this).toggleClass('active').next().toggleClass('open').slideUp();
				}
				toggle.toggleClass('active');
				content.toggleClass('open').slideToggle();
					
				return false;
			}).next().hide();
		});
	};
})(jQuery);
