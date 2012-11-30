// JavaScript Document

(function($) {
	$.fn.toggle = function () {
		return $(this).each(function () {
			var $toggle = $(this);
			var $content = $($toggle.attr("href"));
			
			if ($content.length > 0) {
				$content.hide();
				$toggle.click(function () {
					$content.slideToggle();
					return false;
				});
			}
			
		});
	};
})(jQuery);
